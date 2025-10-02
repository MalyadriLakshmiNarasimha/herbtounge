import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000"

def test_register():
    print("Testing user registration...")
    data = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpass"
    }
    response = requests.post(f"{BASE_URL}/api/register", json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    return response.status_code == 201

def test_login():
    print("\nTesting user login...")
    data = {
        "username": "testuser",
        "password": "testpass"
    }
    response = requests.post(f"{BASE_URL}/api/login", json=data)
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        token = response.json()["access_token"]
        print("Login successful, got token")
        return token
    else:
        print(f"Response: {response.json()}")
        return None

def test_classify(token):
    print("\nTesting classification...")
    headers = {"Authorization": f"Bearer {token}"}
    data = {
        "sampleID": "sample001",
        "timestamp": datetime.now().isoformat(),
        "sensors": {
            "voltammetry": [1.2, 2.3, 3.4],
            "pH": 7.2,
            "tds_ec": 150.0,
            "orp": 200.0,
            "turbidity": 5.0,
            "temperature": 25.0,
            "moisture": 60.0,
            "ion_selective": {"Na": 10.0, "K": 5.0, "Ca": 8.0},
            "rf_resonator": 100.0
        }
    }
    response = requests.post(f"{BASE_URL}/api/classify", json=data, headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    return response.status_code == 200

def test_upload(token):
    print("\nTesting upload...")
    headers = {"Authorization": f"Bearer {token}"}
    data = [{
        "sampleID": "sample002",
        "timestamp": datetime.now().isoformat(),
        "sensors": {
            "voltammetry": [1.5, 2.5, 3.5],
            "pH": 6.8,
            "tds_ec": 120.0,
            "orp": 180.0,
            "turbidity": 3.0,
            "temperature": 24.0,
            "moisture": 55.0,
            "ion_selective": {"Na": 12.0, "K": 6.0, "Ca": 9.0},
            "rf_resonator": 95.0
        }
    }]
    response = requests.post(f"{BASE_URL}/api/upload", json=data, headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    return response.status_code == 200

def test_history(token):
    print("\nTesting history...")
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/api/history", headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    return response.status_code == 200

def test_unauthorized():
    print("\nTesting unauthorized access...")
    data = {
        "sampleID": "sample003",
        "timestamp": datetime.now().isoformat(),
        "sensors": {
            "voltammetry": [1.0, 2.0, 3.0],
            "pH": 7.0,
            "tds_ec": 100.0,
            "orp": 150.0,
            "turbidity": 2.0,
            "temperature": 23.0,
            "moisture": 50.0,
            "ion_selective": {"Na": 15.0, "K": 7.0, "Ca": 10.0},
            "rf_resonator": 90.0
        }
    }
    response = requests.post(f"{BASE_URL}/api/classify", json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    return response.status_code == 401

if __name__ == "__main__":
    try:
        # Test registration
        if not test_register():
            print("Registration failed")
            exit(1)

        # Test login
        token = test_login()
        if not token:
            print("Login failed")
            exit(1)

        # Test protected endpoints
        if not test_classify(token):
            print("Classification failed")
            exit(1)

        if not test_upload(token):
            print("Upload failed")
            exit(1)

        if not test_history(token):
            print("History failed")
            exit(1)

        # Test unauthorized access
        if not test_unauthorized():
            print("Unauthorized test failed")
            exit(1)

        print("\nAll tests passed!")

    except Exception as e:
        print(f"Test failed with error: {e}")
        exit(1)
