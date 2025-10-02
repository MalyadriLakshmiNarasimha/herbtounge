from celery import Celery
import os
import joblib
import numpy as np
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .main import SampleDB, SessionLocal  # Import from main.py

celery = Celery('tasks', broker=os.getenv('REDIS_URL', 'redis://localhost:6379/0'))

# Load ML models
models_dir = os.path.join(os.path.dirname(__file__), 'models')
herb_clf = joblib.load(os.path.join(models_dir, 'herb_classifier.pkl'))
herb_scaler = joblib.load(os.path.join(models_dir, 'herb_scaler.pkl'))
label_encoder = joblib.load(os.path.join(models_dir, 'label_encoder.pkl'))
adulteration_clf = joblib.load(os.path.join(models_dir, 'adulteration_detector.pkl'))
adulteration_scaler = joblib.load(os.path.join(models_dir, 'adulteration_scaler.pkl'))

@celery.task
def classify_sample_async(sample_data: dict):
    """Async ML classification task"""
    # Extract features
    sensors = sample_data['sensors']
    features = np.array([[
        sensors['pH'],
        sensors['tds_ec'],
        sensors['orp'],
        sensors['turbidity'],
        sensors['temperature'],
        sensors['moisture'],
        sensors['rf_resonator'],
        np.mean(sensors.get('voltammetry', [0.0]))
    ]])

    # Scale and predict
    features_scaled = herb_scaler.transform(features)
    herb_pred = herb_clf.predict(features_scaled)
    herb_name = label_encoder.inverse_transform(herb_pred)[0]
    confidence = float(np.max(herb_clf.predict_proba(features_scaled)))

    adulteration_pred = adulteration_clf.predict(adulteration_scaler.transform(features))
    adulteration = bool(adulteration_pred[0])

    purity = max(0, min(100, confidence * 100 * (0.7 if adulteration else 1.0)))

    # Save to DB
    db = SessionLocal()
    try:
        sample = SampleDB(
            sampleID=sample_data['sampleID'],
            timestamp=sample_data['timestamp'],
            herbName=herb_name,
            purityPercent=purity,
            adulterationFlag=adulteration,
            confidenceScore=confidence,
            tasteProfile='[]',  # Simplified
            recommendation='Processed asynchronously',
            sensors=sample_data['sensors']
        )
        db.add(sample)
        db.commit()
        return {
            'herbName': herb_name,
            'purityPercent': purity,
            'adulterationFlag': adulteration,
            'confidenceScore': confidence
        }
    finally:
        db.close()

@celery.task
def export_history_async(user_id: int, filters: dict = None):
    """Async data export task"""
    db = SessionLocal()
    try:
        query = db.query(SampleDB)
        if filters:
            if 'start_date' in filters:
                query = query.filter(SampleDB.timestamp >= filters['start_date'])
            if 'end_date' in filters:
                query = query.filter(SampleDB.timestamp <= filters['end_date'])

        samples = query.all()
        # Generate CSV
        csv_data = "sampleID,herbName,purityPercent,adulterationFlag,timestamp\n"
        for sample in samples:
            csv_data += f"{sample.sampleID},{sample.herbName},{sample.purityPercent},{sample.adulterationFlag},{sample.timestamp}\n"

        return csv_data
    finally:
        db.close()
