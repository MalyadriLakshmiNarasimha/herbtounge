from fastapi import FastAPI, Query, HTTPException, Depends, status, Body
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, timedelta
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship, Session
from jose import JWTError, jwt
import uvicorn
import joblib
import os
import hashlib

DATABASE_URL = "sqlite:///./herbal_etongue.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

app = FastAPI(title="Herbal E-Tongue API", version="1.0")

# Enable CORS (for frontend integration)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # set to your frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------
# Database Models
# -------------------------------
class UserDB(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class SampleDB(Base):
    __tablename__ = "samples"
    id = Column(Integer, primary_key=True, index=True)
    sampleID = Column(String, unique=True, index=True, nullable=False)
    timestamp = Column(DateTime, nullable=False)
    herbName = Column(String, default="Tulsi")
    purityPercent = Column(Float)
    adulterationFlag = Column(Boolean)
    confidenceScore = Column(Float)
    tasteProfile = Column(String)  # JSON stringified list
    recommendation = Column(String)
    sensors = Column(JSON)  # Store sensor data as JSON

Base.metadata.create_all(bind=engine)

# -------------------------------
# ML Model Loading
# -------------------------------
def load_ml_models():
    """Load trained ML models for classification"""
    models_dir = os.path.join(os.path.dirname(__file__), 'models')

    try:
        herb_classifier = joblib.load(os.path.join(models_dir, 'herb_classifier.pkl'))
        herb_scaler = joblib.load(os.path.join(models_dir, 'herb_scaler.pkl'))
        label_encoder = joblib.load(os.path.join(models_dir, 'label_encoder.pkl'))

        adulteration_detector = joblib.load(os.path.join(models_dir, 'adulteration_detector.pkl'))
        adulteration_scaler = joblib.load(os.path.join(models_dir, 'adulteration_scaler.pkl'))

        print("ML models loaded successfully")
        return herb_classifier, herb_scaler, label_encoder, adulteration_detector, adulteration_scaler
    except FileNotFoundError:
        print("Warning: ML models not found. Using fallback classification logic.")
        return None, None, None, None, None

# Load ML models at startup
herb_clf, herb_scaler, label_encoder, adulteration_clf, adulteration_scaler = load_ml_models()

# -------------------------------
# Authentication Setup
# -------------------------------
SECRET_KEY = "your-secret-key-here"  # Change this in production
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

security = HTTPBearer()

def verify_password(plain_password, hashed_password):
    """Simple verification for demo purposes - in production use proper password verification"""
    return hashlib.sha256(plain_password.encode()).hexdigest() == hashed_password

def get_password_hash(password):
    """Simple hash for demo purposes - in production use proper password hashing"""
    return hashlib.sha256(password.encode()).hexdigest()

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def authenticate_user(db: Session, email: str, password: str):
    user = db.query(UserDB).filter(UserDB.email == email).first()
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(UserDB).filter(UserDB.email == email).first()
    if user is None:
        raise credentials_exception
    return user

# -------------------------------
# Pydantic Models
# -------------------------------
class IonSelective(BaseModel):
    Na: float = Field(..., description="Sodium ion concentration")
    K: float = Field(..., description="Potassium ion concentration")
    Ca: float = Field(..., description="Calcium ion concentration")

class SensorData(BaseModel):
    voltammetry: List[float]
    pH: float
    tds_ec: float
    orp: float
    turbidity: float
    temperature: float
    moisture: float
    ion_selective: IonSelective
    rf_resonator: float

class Sample(BaseModel):
    sampleID: str
    timestamp: Optional[datetime] = None
    sensors: SensorData

class ClassificationResponse(BaseModel):
    herbName: str
    purityPercent: float
    adulterationFlag: bool
    confidence: float
    tasteProfile: List[str]
    recommendation: str

class UploadResponse(BaseModel):
    status: str
    uploadedSamples: int
    invalidRows: int

class HistoryResponse(BaseModel):
    sampleID: str
    herbName: str
    testedOn: datetime
    purityPercent: float
    adulterationFlag: bool
    confidenceScore: float

class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

# -------------------------------
# Endpoints
# -------------------------------

@app.post("/api/register", status_code=status.HTTP_201_CREATED)
def register(request: RegisterRequest = Body(...), db: Session = Depends(get_db)):
    user = db.query(UserDB).filter((UserDB.username == request.username) | (UserDB.email == request.email)).first()
    if user:
        raise HTTPException(status_code=400, detail="Username or email already registered")
    hashed_password = get_password_hash(request.password)
    new_user = UserDB(username=request.username, email=request.email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"msg": "User registered successfully"}

@app.post("/api/login")
def login(request: LoginRequest = Body(...), db: Session = Depends(get_db)):
    user = authenticate_user(db, request.email, request.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": user.email}, expires_delta=access_token_expires)
    return {
        "user": {
            "id": str(user.id),
            "email": user.email,
            "name": user.username,  # Using username as name for now
            "role": "admin" if user.username == "admin" else "analyst"  # Simple role assignment
        },
        "access_token": access_token,
        "token_type": "bearer"
    }

@app.post("/api/classify", response_model=ClassificationResponse)
def classify(sample: Sample, db: Session = Depends(get_db)):
    # Note: Authentication removed for demo purposes
    # Use ML models for classification if available
    if herb_clf and herb_scaler and label_encoder and adulteration_clf and adulteration_scaler:
        # Prepare features for ML models
        import numpy as np

        # Extract features in the same order as training
        features = np.array([[
            sample.sensors.pH,
            sample.sensors.tds_ec,  # conductivity
            sample.sensors.orp,
            sample.sensors.turbidity,
            sample.sensors.temperature,
            sample.sensors.moisture,
            sample.sensors.rf_resonator,
            np.mean(sample.sensors.voltammetry) if sample.sensors.voltammetry else 0.0  # voltammetry mean
        ]])

        # Scale features
        features_scaled = herb_scaler.transform(features)

        # Predict herb type
        herb_pred = herb_clf.predict(features_scaled)
        herb_name = label_encoder.inverse_transform(herb_pred)[0]

        # Get prediction probabilities for confidence
        herb_probabilities = herb_clf.predict_proba(features_scaled)
        confidence = float(np.max(herb_probabilities))

        # Check for adulteration
        adulteration_pred = adulteration_clf.predict(adulteration_scaler.transform(features))
        adulteration = bool(adulteration_pred[0])

        # Calculate purity based on confidence and adulteration
        base_purity = confidence * 100
        purity = base_purity * (0.7 if adulteration else 1.0)
        purity = max(0, min(100, purity))

        # Generate taste profile based on herb and adulteration
        taste_profiles = {
            "Ashwagandha": ["bitter", "earthy"],
            "Turmeric": ["bitter", "pungent"],
            "Ginger": ["spicy", "pungent"],
            "Brahmi": ["bitter", "astringent"],
            "Tulsi": ["pungent", "aromatic"],
            "Amla": ["sour", "astringent"],
            "Neem": ["bitter", "pungent"],
            "Triphala": ["sour", "astringent"],
            "Shatavari": ["sweet", "bitter"],
            "Moringa": ["bitter", "peppery"]
        }

        taste = taste_profiles.get(herb_name, ["unknown"])
        if adulteration:
            taste.extend(["off-flavor", "chemical"])

        # Generate recommendation
        if adulteration:
            recommendation = "Sample shows signs of adulteration. Not recommended for Ayurvedic use."
        elif purity > 90:
            recommendation = "High purity sample. Safe for Ayurvedic use."
        elif purity > 75:
            recommendation = "Moderate purity. Use with caution and verify source."
        else:
            recommendation = "Low purity detected. Further testing recommended."

    else:
        # Fallback to simple logic if ML models not available
        purity = 90.0 + (sample.sensors.pH - 7) * 2
        purity = max(0, min(100, purity))
        adulteration = purity < 85
        confidence = 0.8 + (purity / 100) * 0.2
        taste = ["bitter", "pungent"] if adulteration else ["sweet", "mild"]
        recommendation = "Safe for Ayurvedic use" if not adulteration else "Use with caution"
        herb_name = "Tulsi"  # Default fallback

    # Save sample to DB
    sample_db = SampleDB(
        sampleID=sample.sampleID,
        timestamp=sample.timestamp,
        herbName=herb_name,
        purityPercent=purity,
        adulterationFlag=adulteration,
        confidenceScore=confidence,
        tasteProfile=str(taste),
        recommendation=recommendation,
        sensors=sample.sensors.dict()
    )
    db.add(sample_db)
    db.commit()
    db.refresh(sample_db)

    return ClassificationResponse(
        herbName=herb_name,
        purityPercent=purity,
        adulterationFlag=adulteration,
        confidenceScore=confidence,
        tasteProfile=taste,
        recommendation=recommendation
    )

@app.post("/api/upload", response_model=UploadResponse)
def upload(samples: List[Sample], db: Session = Depends(get_db), current_user: UserDB = Depends(get_current_user)):
    valid_samples = 0
    invalid_rows = 0
    for sample in samples:
        if sample.sampleID and sample.sensors:
            sample_db = SampleDB(
                sampleID=sample.sampleID,
                timestamp=sample.timestamp,
                sensors=sample.sensors.dict()
            )
            db.add(sample_db)
            valid_samples += 1
        else:
            invalid_rows += 1
    db.commit()
    return UploadResponse(
        status="success",
        uploadedSamples=valid_samples,
        invalidRows=invalid_rows
    )

@app.get("/api/history", response_model=List[HistoryResponse])
def get_history(sampleID: Optional[str] = Query(None, description="Unique sample ID"), db: Session = Depends(get_db), current_user: UserDB = Depends(get_current_user)):
    query = db.query(SampleDB)
    if sampleID:
        query = query.filter(SampleDB.sampleID == sampleID)
    samples = query.all()
    if not samples:
        raise HTTPException(status_code=404, detail="No history found for the given sampleID")
    results = []
    for sample in samples:
        results.append(HistoryResponse(
            sampleID=sample.sampleID,
            herbName=sample.herbName,
            testedOn=sample.timestamp,
            purityPercent=sample.purityPercent or 0,
            adulterationFlag=sample.adulterationFlag or False,
            confidenceScore=sample.confidenceScore or 0
        ))
    return results

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
