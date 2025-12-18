# Setup Guide - Safran RH Platform

## Prerequisites

- Docker Desktop installed and running
- OR Node.js 18+ and Python 3.11+ for local development

## Quick Start (Local Development)

1. **Clone/Navigate to the project directory**

2. **Ensure you have the required CSV file:**
   - `RH_infos.csv` should be in the project root
   - This file contains the knowledge base for the chatbot

3. **Start the backend:**
   ```bash
   cd backend
   python -m venv .venv
   source .venv/Scripts/Activate.ps1  # Windows PowerShell
   pip install -r requirements.txt
   uvicorn main:app --reload --port 8000
   ```

4. **Start the frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

6. **Login credentials:**
   - Username: `safran`
   - Password: `Think2Deploy2025!`

## Local Development Setup

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on http://localhost:3000

## Project Structure

```
.
├── backend/
│   ├── main.py                    # FastAPI app
│   ├── auth.py                    # JWT authentication
│   ├── services/
│   │   ├── analysis_service.py    # CSV analysis logic
│   │   └── chatbot_service.py     # RAG chatbot logic
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── app/                       # Next.js App Router
│   │   ├── login/                 # Login page
│   │   ├── dashboard/             # Main dashboard
│   │   └── layout.tsx              # Root layout
│   ├── components/                # React components
│   ├── contexts/                  # Auth context
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
├── RH_infos.csv                   # Chatbot knowledge base
└── README.md
```

## Environment Variables

### Backend

Create a `.env` file in the `backend/` directory:

```env
SECRET_KEY=your-secret-key-change-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Frontend

The frontend uses `NEXT_PUBLIC_API_URL` which defaults to `http://localhost:8000` if not set.

## Testing the API

### Using curl

1. **Login:**
   ```bash
   curl -X POST "http://localhost:8000/token" \
     -H "Content-Type: application/json" \
     -d '{"username": "safran", "password": "Think2Deploy2025!"}'
   ```

2. **Use the token for authenticated requests:**
   ```bash
   curl -X POST "http://localhost:8000/chat" \
     -H "Authorization: Bearer YOUR_TOKEN_HERE" \
     -H "Content-Type: application/json" \
     -d '{"query": "Comment poser un congé ?"}'
   ```

### Using the API Documentation

Visit http://localhost:8000/docs for interactive API documentation (Swagger UI).

## Troubleshooting

### Backend won't start
- Check if port 8000 is available
- Ensure all dependencies are installed
- Check Docker logs: `docker-compose logs backend`

### Frontend won't start
- Check if port 3000 is available
- Ensure Node.js 18+ is installed
- Run `npm install` in the frontend directory
- Check Docker logs: `docker-compose logs frontend`

### Chatbot not working
- Ensure `RH_infos.csv` exists in the project root
- Check that the file is properly mounted in Docker
- Verify the CSV has columns: `domaine`, `question`, `reponse`

### CORS errors
- Ensure the backend CORS configuration includes your frontend URL
- Check that both services are running
- Verify the API URL in frontend environment variables

## Production Deployment Notes

Before deploying to production:

1. **Change the JWT secret key** in `backend/auth.py`
2. **Use environment variables** for all sensitive configuration
3. **Set up proper database** instead of dummy user DB
4. **Configure HTTPS** for both frontend and backend
5. **Set up proper logging** and monitoring
6. **Use a secrets manager** for credentials
7. **Configure rate limiting** on API endpoints
8. **Set up CI/CD pipeline** for automated deployments

