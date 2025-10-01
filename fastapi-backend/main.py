from fastapi import FastAPI, Query, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

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
# Data Models
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
    timestamp: datetime
    sensors: SensorData

# -------------------------------
# Response Models
# -------------------------------
class ClassificationResponse(BaseModel):
    herbName: str
    purityPercent: float
    adulterationFlag: bool
    confidenceScore: float
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

# -------------------------------
# In-memory storage for demo
# -------------------------------
samples_db: List[Sample] = []

# -------------------------------
# Endpoints
# -------------------------------
@app.post("/api/classify", response_model=ClassificationResponse)
def classify(sample: Sample):
    # Simulate ML model classification logic
    # For demo, use simple rules or random values
    purity = 90.0 + (sample.sensors.pH - 7) * 2  # simplistic example
    purity = max(0, min(100, purity))
    adulteration = purity < 85
    confidence = 0.8 + (purity / 100) * 0.2
    taste = ["bitter", "pungent"] if adulteration else ["sweet", "mild"]
    recommendation = "Safe for Ayurvedic use" if not adulteration else "Use with caution"

    # Save sample to in-memory DB
    samples_db.append(sample)

    return ClassificationResponse(
        herbName="Tulsi",
        purityPercent=purity,
        adulterationFlag=adulteration,
        confidenceScore=confidence,
        tasteProfile=taste,
        recommendation=recommendation
    )

@app.post("/api/upload", response_model=UploadResponse)
def upload(samples: List[Sample]):
    valid_samples = 0
    invalid_rows = 0
    for sample in samples:
        # Basic validation example
        if sample.sampleID and sample.sensors:
            samples_db.append(sample)
            valid_samples += 1
        else:
            invalid_rows += 1
    return UploadResponse(
        status="success",
        uploadedSamples=valid_samples,
        invalidRows=invalid_rows
    )

@app.get("/api/history", response_model=List[HistoryResponse])
def get_history(sampleID: Optional[str] = Query(None, description="Unique sample ID")):
    results = []
    for sample in samples_db:
        if sampleID is None or sample.sampleID == sampleID:
            results.append(HistoryResponse(
                sampleID=sample.sampleID,
                herbName="Tulsi",
                testedOn=sample.timestamp,
                purityPercent=92.5,
                adulterationFlag=False,
                confidenceScore=0.87
            ))
    if not results:
        raise HTTPException(status_code=404, detail="No history found for the given sampleID")
    return results

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
