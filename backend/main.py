from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import joblib
from tensorflow.keras.models import load_model
import os
import pandas as pd
from sklearn.datasets import load_breast_cancer

app = FastAPI(title="Unified API", version="1.0.0")

# CORS - allow frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Breast cancer artifacts
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(BASE_DIR)
MODEL_PATH = os.path.join(ROOT_DIR, "breast", "breast_cancer_ann.keras")
SCALER_PATH = os.path.join(ROOT_DIR, "breast", "scaler.pkl")

model = load_model(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)

FEATURE_NAMES = [
    "mean radius", "mean texture", "mean perimeter", "mean area", "mean smoothness",
    "mean compactness", "mean concavity", "mean concave points", "mean symmetry", "mean fractal dimension",
    "radius error", "texture error", "perimeter error", "area error", "smoothness error",
    "compactness error", "concavity error", "concave points error", "symmetry error", "fractal dimension error",
    "worst radius", "worst texture", "worst perimeter", "worst area", "worst smoothness",
    "worst compactness", "worst concavity", "worst concave points", "worst symmetry", "worst fractal dimension"
]

BREAST_REF = []
def _build_breast_ref():
    try:
        data = load_breast_cancer()
        X = data.data
        y = data.target
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
    X = np.array([features_input.features])
    try:
        X_df = pd.DataFrame(X, columns=FEATURE_NAMES)
        X_scaled = scaler.transform(X_df)
    except Exception:
        X_scaled = scaler.transform(X)
    prob_benign = float(model.predict(X_scaled, verbose=0)[0][0])
    malignant_probability = 1.0 - prob_benign
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

# PCOS
PCOS_DIR = os.path.join(ROOT_DIR, 'pcos')
lr_model = joblib.load(os.path.join(PCOS_DIR, 'lr_model.pkl'))
lr_scaler = joblib.load(os.path.join(PCOS_DIR, 'lr_scaler.pkl'))
pcos_features = joblib.load(os.path.join(PCOS_DIR, 'features.pkl'))

class PCOSInput(BaseModel):
    age_yrs: float = None
    BMI: float = None
    cycle_ri: float = None
    weight_gain_yn: float = None
    hair_growth_yn: float = None
    skin_darkening_yn: float = None
    hair_loss_yn: float = None
    pimples_yn: float = None
    model_config = {"json_schema_extra": {}}

@app.post('/pcos/predict')
def predict_pcos(data: PCOSInput):
    vals = []
    for f in pcos_features:
        if str(f).strip() == 'Age (yrs)':
            vals.append(data.age_yrs if data.age_yrs is not None else 0)
        elif f == 'BMI':
            vals.append(data.BMI if data.BMI is not None else 0)
        elif f == 'Cycle(R/I)':
            v = data.cycle_ri if data.cycle_ri is not None else 2
            if v == 5: v = 4
            vals.append(v)
        elif f == 'Weight gain(Y/N)':
            vals.append(data.weight_gain_yn if data.weight_gain_yn is not None else 0)
        elif f == 'hair growth(Y/N)':
            vals.append(data.hair_growth_yn if data.hair_growth_yn is not None else 0)
        elif f == 'Skin darkening (Y/N)':
            vals.append(data.skin_darkening_yn if data.skin_darkening_yn is not None else 0)
        elif f == 'Hair loss(Y/N)':
            vals.append(data.hair_loss_yn if data.hair_loss_yn is not None else 0)
        elif f == 'Pimples(Y/N)':
            vals.append(data.pimples_yn if data.pimples_yn is not None else 0)
        else:
            vals.append(0)
    X = np.array([vals])
    try:
        X_df = pd.DataFrame(X, columns=pcos_features)
        X_scaled = lr_scaler.transform(X_df)
    except Exception:
        X_scaled = lr_scaler.transform(X)
    prob = float(lr_model.predict_proba(X_scaled)[:, 1][0])
    if prob < 0.3:
        risk_band = 'low'
    elif prob < 0.6:
        risk_band = 'medium'
    else:
        risk_band = 'high'
    coef = lr_model.coef_[0]
    contrib = coef * X_scaled[0]
    top_idx = np.argsort(contrib)[::-1]
    feature_names_clean = ['Age', 'BMI', 'Cycle(R/I)', 'Weight gain', 'Hair growth', 'Skin darkening', 'Hair loss', 'Pimples']
    top_factors = []
    for i in top_idx:
        if contrib[i] > 0 and len(top_factors) < 3:
            top_factors.append(feature_names_clean[i])
    if len(top_factors) == 0:
        top_idx = np.argsort(np.abs(contrib))[::-1]
        for i in top_idx:
            if len(top_factors) < 3:
                top_factors.append(feature_names_clean[i])
    disclaimer = 'This is for educational/demo purposes only and is not a substitute for professional medical diagnosis.'
    return {
        'probability': round(prob, 6),
        'risk_band': risk_band,
        'top_factors': top_factors,
        'disclaimer': disclaimer
    }

@app.get("/health")
def health():
    return {"status": "ok", "services": ["breast", "pcos"]}
