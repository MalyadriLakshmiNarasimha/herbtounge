import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import accuracy_score, classification_report
import joblib
import json
import os

def load_and_preprocess_data():
    """Load sample data and preprocess for ML training"""
    # Load the CSV data
    df = pd.read_csv('./public/sample-sensor-data.csv')

    # Extract herb names from SampleID (everything before the underscore)
    df['herb_name'] = df['SampleID'].str.split('_').str[0]

    # Parse voltammetry data (it's stored as JSON string)
    def parse_voltammetry(volt_str):
        try:
            data = json.loads(volt_str.replace('""', '"'))
            # Use mean of current values as a feature
            return np.mean(data['Current'])
        except:
            return 0.0

    df['voltammetry_mean'] = df['Voltammetry'].apply(parse_voltammetry)

    # Select features for ML model
    features = [
        'pH', 'Conductivity', 'ORP', 'Turbidity',
        'Temperature', 'Moisture', 'RF_Resonator', 'voltammetry_mean'
    ]

    X = df[features]
    y = df['herb_name']

    # Encode target labels
    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)

    return X, y_encoded, label_encoder, features

def train_herb_classifier():
    """Train Random Forest classifier for herb identification"""
    print("Loading and preprocessing data...")
    X, y_encoded, label_encoder, features = load_and_preprocess_data()

    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y_encoded, test_size=0.2, random_state=42
    )

    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # Train Random Forest
    print("Training Random Forest classifier...")
    clf = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        random_state=42,
        class_weight='balanced'
    )

    clf.fit(X_train_scaled, y_train)

    # Evaluate
    y_pred = clf.predict(X_test_scaled)
    accuracy = accuracy_score(y_test, y_pred)

    print(f"Model Accuracy: {accuracy:.2f}")
    print("\nClassification Report:")
    # Fix classification_report error by specifying labels explicitly
    unique_labels = np.unique(y_test)
    print(classification_report(y_test, y_pred, labels=unique_labels, target_names=label_encoder.classes_[:len(unique_labels)]))

    # Feature importance
    feature_importance = pd.DataFrame({
        'feature': features,
        'importance': clf.feature_importances_
    }).sort_values('importance', ascending=False)

    print("\nFeature Importance:")
    print(feature_importance)

    return clf, scaler, label_encoder, accuracy

def create_adulteration_detector():
    """Create a simple adulteration detection model based on sensor anomalies"""
    print("\nCreating adulteration detection model...")

    # For demo purposes, create synthetic adulterated samples
    X, y_encoded, label_encoder, features = load_and_preprocess_data()

    # Create synthetic adulterated data by adding noise and outliers
    np.random.seed(42)
    n_adulterated = len(X) // 2

    # Create adulterated samples by modifying sensor values
    adulterated_indices = np.random.choice(len(X), n_adulterated, replace=False)
    X_adulterated = X.copy()

    for idx in adulterated_indices:
        # Add random noise and outliers to simulate adulteration
        noise_factor = np.random.uniform(1.5, 3.0)
        X_adulterated.iloc[idx] = X.iloc[idx] * noise_factor + np.random.normal(0, 0.1, len(features))

    # Create labels (0 = pure, 1 = adulterated)
    y_adulteration = np.zeros(len(X))
    y_adulteration[adulterated_indices] = 1

    # Combine pure and adulterated data
    X_combined = pd.concat([X, X_adulterated])
    y_combined = np.concatenate([y_adulteration, np.ones(len(X_adulterated))])

    # Split and train
    X_train, X_test, y_train, y_test = train_test_split(
        X_combined, y_combined, test_size=0.2, random_state=42
    )

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    detector = RandomForestClassifier(
        n_estimators=50,
        max_depth=8,
        random_state=42
    )

    detector.fit(X_train_scaled, y_train)

    # Evaluate
    y_pred = detector.predict(X_test_scaled)
    accuracy = accuracy_score(y_test, y_pred)

    print(f"Adulteration Detection Accuracy: {accuracy:.2f}")

    return detector, scaler

def save_models():
    """Train and save all ML models"""
    print("Training ML models for Herbal E-Tongue...")

    # Train herb classifier
    herb_clf, herb_scaler, label_encoder, herb_accuracy = train_herb_classifier()

    # Train adulteration detector
    adulteration_clf, adulteration_scaler = create_adulteration_detector()

    # Save models
    os.makedirs('models', exist_ok=True)

    joblib.dump(herb_clf, 'models/herb_classifier.pkl')
    joblib.dump(herb_scaler, 'models/herb_scaler.pkl')
    joblib.dump(label_encoder, 'models/label_encoder.pkl')

    joblib.dump(adulteration_clf, 'models/adulteration_detector.pkl')
    joblib.dump(adulteration_scaler, 'models/adulteration_scaler.pkl')

    # Save model metadata
    metadata = {
        'herb_accuracy': herb_accuracy,
        'herb_classes': label_encoder.classes_.tolist(),
        'features': ['pH', 'Conductivity', 'ORP', 'Turbidity', 'Temperature', 'Moisture', 'RF_Resonator', 'voltammetry_mean']
    }

    with open('models/model_metadata.json', 'w') as f:
        json.dump(metadata, f, indent=2)

    print("\nModels saved successfully!")
    print("- herb_classifier.pkl")
    print("- adulteration_detector.pkl")
    print("- model_metadata.json")

if __name__ == "__main__":
    save_models()
