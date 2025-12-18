from sqlalchemy import create_engine
from sqlalchemy.orm import Session
import sys
from pathlib import Path
# Ensure backend package root is on sys.path when running script directly
sys.path.append(str(Path(__file__).resolve().parents[1]))
from models import Base, User
from auth import get_password_hash
import os

DB_URL = os.getenv('DATABASE_URL', 'sqlite:///./safran.db')
# Use sync engine for local script
engine = create_engine(DB_URL.replace('aiosqlite', 'sqlite'), connect_args={"check_same_thread": False})

Base.metadata.create_all(bind=engine)

admin_email = os.getenv('ADMIN_EMAIL', 'admin@safran.com')
admin_password = os.getenv('ADMIN_PASSWORD', 'admin123')

with Session(engine) as session:
    user = session.query(User).filter_by(email=admin_email).first()
    if user:
        print(f"Admin user already exists: {admin_email}")
    else:
        hashed = get_password_hash(admin_password)
        new_user = User(email=admin_email, hashed_password=hashed, role='admin')
        session.add(new_user)
        session.commit()
        print(f"Created admin user: {admin_email}")
