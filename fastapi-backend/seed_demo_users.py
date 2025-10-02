#!/usr/bin/env python3
"""
Script to seed the database with demo users for the Herbal AI Authenticity Dashboard.
"""

from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import hashlib

DATABASE_URL = "sqlite:///./herbal_etongue.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_password_hash(password):
    """Simple hash for demo purposes - in production use proper password hashing"""
    return hashlib.sha256(password.encode()).hexdigest()

class UserDB(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

def seed_demo_users():
    """Create demo users in the database."""
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    # Demo users data
    demo_users = [
        {
            "username": "admin",
            "email": "admin@herbalauth.com",
            "password": "Admin@123",
        },
        {
            "username": "analyst",
            "email": "analyst@herbalauth.com",
            "password": "Analyst@123",
        },
        {
            "username": "viewer",
            "email": "viewer@herbalauth.com",
            "password": "Viewer@123",
        },
    ]

    for user_data in demo_users:
        # Check if user already exists
        existing_user = db.query(UserDB).filter(
            (UserDB.username == user_data["username"]) | (UserDB.email == user_data["email"])
        ).first()

        if existing_user:
            print(f"User {user_data['username']} already exists, skipping...")
            continue

        # Create new user
        hashed_password = get_password_hash(user_data["password"])
        new_user = UserDB(
            username=user_data["username"],
            email=user_data["email"],
            hashed_password=hashed_password
        )
        db.add(new_user)
        print(f"Created user: {user_data['username']} ({user_data['email']})")

    db.commit()
    db.close()
    print("Demo users seeded successfully!")

if __name__ == "__main__":
    seed_demo_users()
