from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="user", nullable=False)  # user, admin, etc.
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    action = Column(String, nullable=False)  # login, analyze, etc.
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    details = Column(Text, nullable=True)  # Additional context/details