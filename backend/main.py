from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import joblib
from tensorflow.keras.models import load_model
import os
import pandas as pd
from sklearn.datasets import load_breast_cancer

app = FastAPI(title="Breast Cancer Prediction API", version="1.0.0")

# Add CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load artifacts
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Look in breast/ directory relative to project root
ROOT_DIR = os.path.dirname(BASE_DIR)
MODEL_PATH = os.path.join(ROOT_DIR, "breast", "breast_cancer_ann.keras")
SCALER_PATH = os.path.join(ROOT_DIR, "breast", "scaler.pkl")

model = load_model(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)

# Feature names from sklearn breast cancer dataset (30 features in order)
FEATURE_NAMES = [
    "mean radius", "mean texture", "mean perimeter", "mean area", "mean smoothness",
    "mean compactness", "mean concavity", "mean concave points", "mean symmetry", "mean fractal dimension",
    "radius error", "texture error", "perimeter error", "area error", "smoothness error",
    "compactness error", "concavity error", "concave points error", "symmetry error", "fractal dimension error",
    "worst radius", "worst texture", "worst perimeter", "worst area", "worst smoothness",
    "worst compactness", "worst concavity", "worst concave points", "worst symmetry", "worst fractal dimension"
]

# Cache reference stats
BREAST_REF = []

def _build_breast_ref():
    try:
        data = load_breast_cancer()
        X = data.data
        y = data.target  # 0 malignant, 1 benign in sklearn
        ref = []
        for i, name in enumerate(FEATURE_NAMES):
            col = X[:, i]
            benign_mask = y == 1
            malignant_mask = y == 0
            ref.append({
                "name": name,
                "min": float(col.min()),
                "max": float(col.max()),
                "mean_benign": float(col[benign_mask].mean()) if benign_mask.any() else float(col.mean()),
                "mean_malignant": float(col[malignant_mask].mean()) if malignant_mask.any() else float(col.mean()),
                "mean_all": float(col.mean())
            })
        return ref
    except Exception:
        return [{"name": n, "min": 0.0, "max": 1.0, "mean_benign": 0.5, "mean_malignant": 0.5, "mean_all": 0.5} for n in FEATURE_NAMES]

BREAST_REF = _build_breast_ref()

class BreastFeatures(BaseModel):
    features: list[float]

    model_config = {
        "json_schema_extra": {
            "example": {
                "features": [
                    17.99, 10.38, 122.8, 1001.0, 0.1184, 0.2776, 0.3001, 0.1471, 0.2419, 0.07871,
                    1.095, 0.9053, 8.589, 153.4, 0.006399, 0.04904, 0.05373, 0.01587, 0.03003, 0.006193,
                    25.38, 17.33, 184.6, 2019.0, 0.1622, 0.6656, 0.7119, 0.2654, 0.4601, 0.1189
                ]
            }
        }
    }

@app.post("/breast/predict")
def predict_breast(features_input: BreastFeatures):
    if len(features_input.features) != 30:
        return {"error": "Expected 30 features", "received": len(features_input.features)}
    
    # Convert to array and scale
    X = np.array([features_input.features])
    try:
        X_df = pd.DataFrame(X, columns=FEATURE_NAMES)
        X_scaled = scaler.transform(X_df)
    except Exception:
        X_scaled = scaler.transform(X)
    
    # Predict
    prob_benign = float(model.predict(X_scaled, verbose=0)[0][0])
    malignant_probability = 1.0 - prob_benign
    
    # Determine label
    if malignant_probability > 0.5:
        label = "malignant"
    else:
        label = "benign"
    
    limitations = [
        "Educational/demo use only - not a substitute for professional medical diagnosis",
        "Model trained on Breast Cancer Wisconsin (Diagnostic) dataset",
        "Predictions depend on input feature quality and measurement accuracy"
    ]
    
    return {
        "malignant_probability": round(malignant_probability, 6),
        "label": label,
        "limitations": limitations
    }

@app.get("/breast/reference")
def breast_reference():
    return BREAST_REF

@app.get("/health")
def health():
    return {"status": "ok"}
