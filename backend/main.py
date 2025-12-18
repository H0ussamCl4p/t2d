from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
import logging
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import timedelta
import io

from database import get_db, engine
from models import Base, User, AuditLog
from auth import (
    authenticate_user,
    create_access_token,
    get_current_user,
    LoginRequest,
    Token,
    AnalyzeResponse,
    ChatRequest,
    ChatResponse,
    get_password_hash
)

# Global service instances (lazy-loaded)
analysis_service = None
chatbot_service = None

app = FastAPI(
    title="Safran Neural Hub API",
    description="Production-ready SaaS API for HR Analytics and AI Assistant",
    version="1.0.0"
)

logger = logging.getLogger("safran")
logging.basicConfig(level=logging.INFO)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """Create database tables on startup"""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # Create default admin user if it doesn't exist
    # async for session in get_db():
    #     result = await session.execute(select(User).where(User.email == "admin@safran.com"))
    #     if not result.scalar_one_or_none():
    #         admin_user = User(
    #             email="admin@safran.com",
    #             hashed_password=get_password_hash("admin123"),
    #             role="admin"
    #         )
    #         session.add(admin_user)
    #         await session.commit()
    #     break


@app.post("/login", response_model=Token)
async def login(
    login_data: LoginRequest,
    db: AsyncSession = Depends(get_db)
):
    """Authenticate user and return JWT token"""
    user = await authenticate_user(db, login_data.email, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Log login action
    audit_log = AuditLog(
        action="login",
        user_id=user.id,
        details=f"User {user.email} logged in"
    )
    db.add(audit_log)
    await db.commit()

    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}



from auth import UserOut, UserUpdate, get_password_hash
from sqlalchemy.future import select
from sqlalchemy.exc import SQLAlchemyError

@app.get("/me", response_model=UserOut)
async def read_users_me(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    return UserOut(
        id=current_user.id,
        email=current_user.email,
        role=current_user.role,
        first_name=current_user.first_name,
        last_name=current_user.last_name
    )


# PATCH /me endpoint to update user info
@app.patch("/me", response_model=UserOut)
async def update_user_me(
    update: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Load the user within the provided DB session to ensure changes persist
    try:
        result = await db.execute(select(User).where(User.id == current_user.id))
        user_in_db = result.scalar_one_or_none()
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=f"DB error: {str(e)}")

    if user_in_db is None:
        raise HTTPException(status_code=404, detail="User not found")

    updated = False
    if update.first_name is not None:
        user_in_db.first_name = update.first_name
        updated = True
    if update.last_name is not None:
        user_in_db.last_name = update.last_name
        updated = True
    if update.password is not None and update.password.strip():
        user_in_db.hashed_password = get_password_hash(update.password)
        updated = True

    if updated:
        try:
            # Log incoming update values
            logger.info(f"PATCH /me payload: first_name={update.first_name!r}, last_name={update.last_name!r}")
            db.add(user_in_db)
            await db.commit()
            await db.refresh(user_in_db)
            logger.info(f"User after update in DB: id={user_in_db.id}, first_name={user_in_db.first_name!r}, last_name={user_in_db.last_name!r}")
        except SQLAlchemyError as e:
            await db.rollback()
            raise HTTPException(status_code=500, detail=f"Update failed: {str(e)}")

    return UserOut(
        id=user_in_db.id,
        email=user_in_db.email,
        role=user_in_db.role,
        first_name=user_in_db.first_name,
        last_name=user_in_db.last_name
    )


@app.post("/seed-admin")
async def seed_admin(email: str = "admin@safran.com", password: str = "admin123", db: AsyncSession = Depends(get_db)):
    """Create a default admin user if none exists. Useful for local/dev only."""
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    if user:
        return {"status": "exists", "email": user.email}

    hashed = get_password_hash(password)
    new_user = User(email=email, hashed_password=hashed, role="admin")
    db.add(new_user)
    await db.commit()
    return {"status": "created", "email": email}


@app.get("/audit-logs")
async def get_audit_logs(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    limit: int = 50
):
    """Get audit logs (admin only)"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )

    result = await db.execute(
        select(AuditLog)
        .order_by(AuditLog.timestamp.desc())
        .limit(limit)
    )
    logs = result.scalars().all()

    return [
        {
            "id": log.id,
            "timestamp": log.timestamp,
            "action": log.action,
            "user_id": log.user_id,
            "details": log.details
        }
        for log in logs
    ]


@app.post("/analyze", response_model=AnalyzeResponse, dependencies=[Depends(get_current_user)])
async def analyze_csv(file: UploadFile = File(...)):
    """
    Analyze CSV file with formation evaluations.
    Returns sentiment analysis, KPIs, and insights.
    """
    # Validate file type
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")
    
    # Read and validate CSV
    try:
        import pandas as pd
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))
        
        # Validate required columns
        required_cols = ['satisfaction']
        missing_cols = [col for col in required_cols if col not in df.columns]
        if missing_cols:
            raise HTTPException(
                status_code=400,
                detail=f"Missing required columns: {', '.join(missing_cols)}"
            )
        
        # Lazy-init AnalysisService to avoid importing heavy libs at test-collection time
        global analysis_service
        if analysis_service is None:
            from services.analysis_service import AnalysisService
            analysis_service = AnalysisService()

        # Run analysis
        results, df_analyzed = analysis_service.analyze(df)
        
        # Calculate additional metrics
        satisfaction_moyenne = float(df['satisfaction'].mean())
        total_evaluations = len(df)
        taux_positifs = results['sentiments'].get('positif', 0)
        
        return AnalyzeResponse(
            scores_moyens=results['scores_moyens'],
            sentiments=results['sentiments'],
            keywords=results['keywords'],
            insights=results['insights'],
            total_evaluations=total_evaluations,
            satisfaction_moyenne=satisfaction_moyenne,
            taux_positifs=taux_positifs
        )
    
    except pd.errors.EmptyDataError:
        raise HTTPException(status_code=400, detail="CSV file is empty")
    except pd.errors.ParserError:
        raise HTTPException(status_code=400, detail="Invalid CSV format")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis error: {str(e)}")


@app.post("/chat", response_model=ChatResponse, dependencies=[Depends(get_current_user)])
async def chat(request: ChatRequest):
    """
    RAG-based chatbot endpoint for HR questions.
    Returns response with domain classification.
    """
    # Lazy-init ChatbotService and sanitize input (handled in service)
    global chatbot_service
    if chatbot_service is None:
        from services.chatbot_service import ChatbotService
        chatbot_service = ChatbotService('RH_infos.csv')

    response = chatbot_service.get_response(request.query)
    
    if isinstance(response, tuple):
        response_text, domain = response
        return ChatResponse(response=response_text, domain=domain)
    else:
        return ChatResponse(response=response, domain=None)


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "safran-rh-api"}


# Dev-only: list users for debugging auth issues
@app.get("/debug/users")
async def debug_list_users(db: AsyncSession = Depends(get_db)):
    """Return list of users (development helper). Remove in production."""
    result = await db.execute(select(User))
    users = result.scalars().all()
    return [{"id": u.id, "email": u.email, "role": u.role, "first_name": u.first_name, "last_name": u.last_name} for u in users]


# Dev-only: decode JWT token for debugging
@app.post("/debug/decode-token")
async def debug_decode_token(token: str):
    """Decode JWT token without verification (development helper). Remove in production."""
    try:
        from jose import jwt
        payload = jwt.get_unverified_claims(token)
        return {"decoded": payload}
    except Exception as e:
        return {"error": str(e)}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

