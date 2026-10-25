from fastapi import FastAPI, File, UploadFile, Form
from chat_routes import router as chat_router
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import numpy as np
import joblib
from tensorflow.keras.models import load_model
import os
import pandas as pd
from sklearn.datasets import load_breast_cancer
import json
from dotenv import load_dotenv
from google import genai
import io
from PIL import Image
import base64
import PyPDF2
import re
import logging

logging.basicConfig(level=logging.INFO)

app = FastAPI(title="Unified API", version="1.0.0")
app.include_router(chat_router)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(BASE_DIR)

# Load ranges
RANGES = {}
try:
    with open(os.path.join(BASE_DIR, 'ranges.json'), encoding='utf-8') as f:
        RANGES = json.load(f)
except Exception:
    logging.exception('Failed to load ranges')
    RANGES = {}

# Load Gemini
load_dotenv(os.path.join(BASE_DIR, '.env'))
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
client = None
if GEMINI_API_KEY and GEMINI_API_KEY.strip():
    try:
        client = genai.Client(api_key=GEMINI_API_KEY.strip())
    except Exception:
        logging.exception('Failed to init gemini client')
        client = None

# Breast
MODEL_PATH = os.path.join(ROOT_DIR, "breast", "breast_cancer_ann.keras")
SCALER_PATH = os.path.join(ROOT_DIR, "breast", "scaler.pkl")
try:
    model = load_model(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
except Exception:
    logging.exception('Failed to load breast model')
    model = None
    scaler = None

FEATURE_NAMES = [
    "mean radius", "mean texture", "mean perimeter", "mean area", "mean smoothness",
    "mean compactness", "mean concavity", "mean concave points", "mean symmetry", "mean fractal dimension",
    "radius error", "texture error", "perimeter error", "area error", "smoothness error",
    "compactness error", "concavity error", "concave points error", "symmetry error", "fractal dimension error",
    "worst radius", "worst texture", "worst perimeter", "worst area", "worst smoothness",
    "worst compactness", "worst concavity", "worst concave points", "worst symmetry", "worst fractal dimension"
]

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
        logging.exception('Failed to build breast ref')
        return [{"name": n, "min": 0.0, "max": 1.0, "mean_benign": 0.5, "mean_malignant": 0.5, "mean_all": 0.5} for n in FEATURE_NAMES]

BREAST_REF = _build_breast_ref()

class BreastFeatures(BaseModel):
    features: list[float]

@app.post("/breast/predict")
def predict_breast(features_input: BreastFeatures):
    if model is None or scaler is None:
        return {"error": "model not loaded"}
    if len(features_input.features) != 30:
        return {"error": "Expected 30 features", "received": len(features_input.features)}
    X = np.array([features_input.features])
    try:
        X_df = pd.DataFrame(X, columns=FEATURE_NAMES)
        X_scaled = scaler.transform(X_df)
    except Exception:
        logging.exception('breast transform failed')
        X_scaled = scaler.transform(X)
    try:
        prob_benign = float(model.predict(X_scaled, verbose=0)[0][0])
    except Exception:
        logging.exception('breast predict failed')
        return {"error": "prediction failed"}
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
try:
    lr_model = joblib.load(os.path.join(PCOS_DIR, 'lr_model.pkl'))
    lr_scaler = joblib.load(os.path.join(PCOS_DIR, 'lr_scaler.pkl'))
    pcos_features = joblib.load(os.path.join(PCOS_DIR, 'features.pkl'))
except Exception:
    logging.exception('Failed to load pcos model')
    lr_model = None
    lr_scaler = None
    pcos_features = []

class PCOSInput(BaseModel):
    age_yrs: float
    BMI: float
    cycle_ri: float
    weight_gain_yn: int
    hair_growth_yn: int
    skin_darkening_yn: int
    hair_loss_yn: int
    pimples_yn: int

@app.post("/pcos/predict")
def pcos_predict(inp: PCOSInput):
    if lr_model is None or lr_scaler is None or pcos_features is None:
        return {"error": "model not loaded"}
    vals = [inp.age_yrs, inp.BMI, inp.cycle_ri, inp.weight_gain_yn, inp.hair_growth_yn, inp.skin_darkening_yn, inp.hair_loss_yn, inp.pimples_yn]
    X = np.array([vals])
    try:
        X_df = pd.DataFrame(X, columns=pcos_features)
        X_scaled = lr_scaler.transform(X_df)
    except Exception:
        logging.exception('pcos transform failed')
        try:
            X_scaled = lr_scaler.transform(X)
        except Exception:
            logging.exception('pcos transform failed2')
            return {"error": "prediction failed"}
    try:
        prob = float(lr_model.predict_proba(X_scaled)[:, 1][0])
    except Exception:
        logging.exception('pcos predict failed')
        return {"error": "prediction failed"}
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
    return {'probability': round(prob, 6), 'risk_band': risk_band, 'top_factors': top_factors, 'disclaimer': disclaimer}

# Report extraction
BANNED = ['medicine', 'tablet', 'dawai', 'capsule', 'vitamin', 'multivitamin', 'supplement', 'iron tablet', 'dose']
DEVANAGARI_RE = re.compile(r'[\u0900-\u097F]')
ARABIC_RE = re.compile(r'[\u0600-\u06FF]')

COMMON_TEMPLATES = {
    'Hemoglobin': {
        'normal': {
            'en': {'meaning': 'Hemoglobin (Hemoglobin) is in the normal range; a doctor should confirm.', 'everyday_line': 'The value is in range; a doctor should confirm.', 'speak_text': 'Hemoglobin is in the normal range. A doctor should confirm.'},
            'hi': {'meaning': 'हीमोग्लोबिन (Hemoglobin) का मान सामान्य सीमा में है; डॉक्टर से पुष्टि कराएं।', 'everyday_line': 'मान सामान्य सीमा में है; डॉक्टर से पुष्टि कराएं।', 'speak_text': 'हीमोग्लोबिन का मान सामान्य सीमा में है। डॉक्टर से पुष्टि कराएं।'},
            'hinglish': {'meaning': 'Hemoglobin (Hemoglobin) ka level normal range me hai; doctor se confirm karwa lena chahiye.', 'everyday_line': 'Level normal range me hai; doctor se confirm karwa lena chahiye.', 'speak_text': 'हीमोग्लोबिन का स्तर सामान्य सीमा में है। डॉक्टर से पुष्टि करवाएं।'}
        },
        'low': {
            'en': {'meaning': 'Hemoglobin (Hemoglobin) is below the normal range; a doctor should confirm.', 'everyday_line': 'The level is below range; a doctor should confirm.', 'speak_text': 'Hemoglobin is below the normal range. A doctor should confirm.'},
            'hi': {'meaning': 'हीमोग्लोबिन (Hemoglobin) की मात्रा सामान्य सीमा से कम है; डॉक्टर से पुष्टि कराएं।', 'everyday_line': 'मान सीमा से कम है; डॉक्टर से पुष्टि कराएं।', 'speak_text': 'हीमोग्लोबिन की मात्रा सामान्य सीमा से कम है। डॉक्टर से पुष्टि कराएं।'},
            'hinglish': {'meaning': 'Hemoglobin (Hemoglobin) ka level kam hai; doctor se confirm karwa lena chahiye.', 'everyday_line': 'Level kam hai; doctor se confirm karwa lena chahiye.', 'speak_text': 'हीमोग्लोबिन का स्तर सामान्य सीमा से कम है। डॉक्टर से पुष्टि करवाएं।'}
        },
        'high': {
            'en': {'meaning': 'Hemoglobin (Hemoglobin) is above the normal range; a doctor should confirm.', 'everyday_line': 'The level is above range; a doctor should confirm.', 'speak_text': 'Hemoglobin is above the normal range. A doctor should confirm.'},
            'hi': {'meaning': 'हीमोग्लोबिन (Hemoglobin) की मात्रा सामान्य सीमा से अधिक है; डॉक्टर से पुष्टि कराएं।', 'everyday_line': 'मान सीमा से अधिक है; डॉक्टर से पुष्टि कराएं।', 'speak_text': 'हीमोग्लोबिन की मात्रा सामान्य सीमा से अधिक है। डॉक्टर से पुष्टि कराएं।'},
            'hinglish': {'meaning': 'Hemoglobin (Hemoglobin) ka level zyada hai; doctor se confirm karwa lena chahiye.', 'everyday_line': 'Level zyada hai; doctor se confirm karwa lena chahiye.', 'speak_text': 'हीमोग्लोबिन का स्तर सामान्य सीमा से अधिक है। डॉक्टर से पुष्टि करवाएं।'}
        }
    },
    'WBC': {
        'normal': {'en': {'meaning': 'WBC (White Blood Cells) is in the normal range; a doctor should confirm.', 'everyday_line': 'The value is in range; a doctor should confirm.', 'speak_text': 'WBC is in the normal range. A doctor should confirm.'}, 'hi': {'meaning': 'WBC (श्वेत रक्त कोशिकाएँ) सामान्य सीमा में हैं; डॉक्टर से पुष्टि कराएं।', 'everyday_line': 'मान सामान्य सीमा में है; डॉक्टर से पुष्टि कराएं।', 'speak_text': 'श्वेत रक्त कोशिकाएँ सामान्य सीमा में हैं। डॉक्टर से पुष्टि कराएं।'}, 'hinglish': {'meaning': 'WBC normal range me hai; doctor se confirm karwa lena chahiye.', 'everyday_line': 'Level normal range me hai; doctor se confirm karwa lena chahiye.', 'speak_text': 'श्वेत रक्त कोशिकाएँ सामान्य सीमा में हैं। डॉक्टर से पुष्टि करवाएं।'}},
        'low': {'en': {'meaning': 'WBC (White Blood Cells) is below the normal range; a doctor should confirm.', 'everyday_line': 'The level is below range; a doctor should confirm.', 'speak_text': 'WBC is below the normal range. A doctor should confirm.'}, 'hi': {'meaning': 'WBC (श्वेत रक्त कोशिकाएँ) सामान्य सीमा से कम हैं; डॉक्टर से पुष्टि कराएं।', 'everyday_line': 'मान सीमा से कम है; डॉक्टर से पुष्टि कराएं।', 'speak_text': 'श्वेत रक्त कोशिकाएँ सामान्य सीमा से कम हैं। डॉक्टर से पुष्टि कराएं।'}, 'hinglish': {'meaning': 'WBC kam hai; doctor se confirm karwa lena chahiye.', 'everyday_line': 'Level kam hai; doctor se confirm karwa lena chahiye.', 'speak_text': 'श्वेत रक्त कोशिकाएँ सामान्य सीमा से कम हैं। डॉक्टर से पुष्टि करवाएं।'}},
        'high': {'en': {'meaning': 'WBC (White Blood Cells) is above the normal range; a doctor should confirm.', 'everyday_line': 'The level is above range; a doctor should confirm.', 'speak_text': 'WBC is above the normal range. A doctor should confirm.'}, 'hi': {'meaning': 'WBC (श्वेत रक्त कोशिकाएँ) सामान्य सीमा से अधिक हैं; डॉक्टर से पुष्टि कराएं।', 'everyday_line': 'मान सीमा से अधिक है; डॉक्टर से पुष्टि कराएं।', 'speak_text': 'श्वेत रक्त कोशिकाएँ सामान्य सीमा से अधिक हैं। डॉक्टर से पुष्टि कराएं।'}, 'hinglish': {'meaning': 'WBC zyada hai; doctor se confirm karwa lena chahiye.', 'everyday_line': 'Level zyada hai; doctor se confirm karwa lena chahiye.', 'speak_text': 'श्वेत रक्त कोशिकाएँ सामान्य सीमा से अधिक हैं। डॉक्टर से पुष्टि करवाएं।'}}
    },
    'Platelets': {
        'normal': {'en': {'meaning': 'Platelets are in the normal range; a doctor should confirm.', 'everyday_line': 'The value is in range; a doctor should confirm.', 'speak_text': 'Platelets are in the normal range. A doctor should confirm.'}, 'hi': {'meaning': 'प्लेटलेट्स (Platelets) सामान्य सीमा में हैं; डॉक्टर से पुष्टि कराएं।', 'everyday_line': 'मान सामान्य सीमा में है; डॉक्टर से पुष्टि कराएं।', 'speak_text': 'प्लेटलेट्स सामान्य सीमा में हैं। डॉक्टर से पुष्टि कराएं।'}, 'hinglish': {'meaning': 'Platelets normal range me hain; doctor se confirm karwa lena chahiye.', 'everyday_line': 'Level normal range me hai; doctor se confirm karwa lena chahiye.', 'speak_text': 'प्लेटलेट्स सामान्य सीमा में हैं। डॉक्टर से पुष्टि करवाएं।'}},
        'low': {'en': {'meaning': 'Platelets are below the normal range; a doctor should confirm.', 'everyday_line': 'The level is below range; a doctor should confirm.', 'speak_text': 'Platelets are below the normal range. A doctor should confirm.'}, 'hi': {'meaning': 'प्लेटलेट्स (Platelets) सामान्य सीमा से कम हैं; डॉक्टर से पुष्टि कराएं।', 'everyday_line': 'मान सीमा से कम है; डॉक्टर से पुष्टि कराएं।', 'speak_text': 'प्लेटलेट्स सामान्य सीमा से कम हैं। डॉक्टर से पुष्टि कराएं।'}, 'hinglish': {'meaning': 'Platelets kam hain; doctor se confirm karwa lena chahiye.', 'everyday_line': 'Level kam hai; doctor se confirm karwa lena chahiye.', 'speak_text': 'प्लेटलेट्स सामान्य सीमा से कम हैं। डॉक्टर से पुष्टि करवाएं।'}},
        'high': {'en': {'meaning': 'Platelets are above the normal range; a doctor should confirm.', 'everyday_line': 'The level is above range; a doctor should confirm.', 'speak_text': 'Platelets are above the normal range. A doctor should confirm.'}, 'hi': {'meaning': 'प्लेटलेट्स (Platelets) सामान्य सीमा से अधिक हैं; डॉक्टर से पुष्टि कराएं।', 'everyday_line': 'मान सीमा से अधिक है; डॉक्टर से पुष्टि कराएं।', 'speak_text': 'प्लेटलेट्स सामान्य सीमा से अधिक हैं। डॉक्टर से पुष्टि कराएं।'}, 'hinglish': {'meaning': 'Platelets zyada hain; doctor se confirm karwa lena chahiye.', 'everyday_line': 'Level zyada hai; doctor se confirm karwa lena chahiye.', 'speak_text': 'प्लेटलेट्स सामान्य सीमा से अधिक हैं। डॉक्टर से पुष्टि करवाएं।'}}
    },
    'TSH': {
        'normal': {'en': {'meaning': 'TSH is in the normal range; a doctor should confirm.', 'everyday_line': 'The value is in range; a doctor should confirm.', 'speak_text': 'TSH is in the normal range. A doctor should confirm.'}, 'hi': {'meaning': 'TSH सामान्य सीमा में है; डॉक्टर से पुष्टि कराएं।', 'everyday_line': 'मान सामान्य सीमा में है; डॉक्टर से पुष्टि कराएं।', 'speak_text': 'टीएसएच सामान्य सीमा में है। डॉक्टर से पुष्टि कराएं।'}, 'hinglish': {'meaning': 'TSH normal range me hai; doctor se confirm karwa lena chahiye.', 'everyday_line': 'Level normal range me hai; doctor se confirm karwa lena chahiye.', 'speak_text': 'टीएसएच सामान्य सीमा में है। डॉक्टर से पुष्टि करवाएं।'}},
        'low': {'en': {'meaning': 'TSH is below the normal range; a doctor should confirm.', 'everyday_line': 'The level is below range; a doctor should confirm.', 'speak_text': 'TSH is below the normal range. A doctor should confirm.'}, 'hi': {'meaning': 'TSH सामान्य सीमा से कम है; डॉक्टर से पुष्टि कराएं।', 'everyday_line': 'मान सीमा से कम है; डॉक्टर से पुष्टि कराएं।', 'speak_text': 'टीएसएच सामान्य सीमा से कम है। डॉक्टर से पुष्टि कराएं।'}, 'hinglish': {'meaning': 'TSH kam hai; doctor se confirm karwa lena chahiye.', 'everyday_line': 'Level kam hai; doctor se confirm karwa lena chahiye.', 'speak_text': 'टीएसएच सामान्य सीमा से कम है। डॉक्टर से पुष्टि करवाएं।'}},
        'high': {'en': {'meaning': 'TSH is above the normal range; a doctor should confirm.', 'everyday_line': 'The level is above range; a doctor should confirm.', 'speak_text': 'TSH is above the normal range. A doctor should confirm.'}, 'hi': {'meaning': 'TSH सामान्य सीमा से अधिक है; डॉक्टर से पुष्टि कराएं।', 'everyday_line': 'मान सीमा से अधिक है; डॉक्टर से पुष्टि कराएं।', 'speak_text': 'टीएसएच सामान्य सीमा से अधिक है। डॉक्टर से पुष्टि कराएं।'}, 'hinglish': {'meaning': 'TSH zyada hai; doctor se confirm karwa lena chahiye.', 'everyday_line': 'Level zyada hai; doctor se confirm karwa lena chahiye.', 'speak_text': 'टीएसएच सामान्य सीमा से अधिक है। डॉक्टर से पुष्टि करवाएं।'}}
    },
    'T3': {
        'normal': {'en': {'meaning': 'T3 is in the normal range; a doctor should confirm.', 'everyday_line': 'The value is in range; a doctor should confirm.', 'speak_text': 'T3 is in the normal range. A doctor should confirm.'}, 'hi': {'meaning': 'T3 सामान्य सीमा में है; डॉक्टर से पुष्टि कराएं।', 'everyday_line': 'मान सामान्य सीमा में है; डॉक्टर से पुष्टि कराएं।', 'speak_text': 'टी3 सामान्य सीमा में है। डॉक्टर से पुष्टि कराएं।'}, 'hinglish': {'meaning': 'T3 normal range me hai; doctor se confirm karwa lena chahiye.', 'everyday_line': 'Level normal range me hai; doctor se confirm karwa lena chahiye.', 'speak_text': 'टी3 सामान्य सीमा में है। डॉक्टर से पुष्टि करवाएं।'}},
        'low': {'en': {'meaning': 'T3 is below the normal range; a doctor should confirm.', 'everyday_line': 'The level is below range; a doctor should confirm.', 'speak_text': 'T3 is below the normal range. A doctor should confirm.'}, 'hi': {'meaning': 'T3 सामान्य सीमा से कम है; डॉक्टर से पुष्टि कराएं।', 'everyday_line': 'मान सीमा से कम है; डॉक्टर से पुष्टि कराएं।', 'speak_text': 'टी3 सामान्य सीमा से कम है। डॉक्टर से पुष्टि कराएं।'}, 'hinglish': {'meaning': 'T3 kam hai; doctor se confirm karwa lena chahiye.', 'everyday_line': 'Level kam hai; doctor se confirm karwa lena chahiye.', 'speak_text': 'टी3 सामान्य सीमा से कम है। डॉक्टर से पुष्टि करवाएं।'}},
        'high': {'en': {'meaning': 'T3 is above the normal range; a doctor should confirm.', 'everyday_line': 'The level is above range; a doctor should confirm.', 'speak_text': 'T3 is above the normal range. A doctor should confirm.'}, 'hi': {'meaning': 'T3 सामान्य सीमा से अधिक है; डॉक्टर से पुष्टि कराएं।', 'everyday_line': 'मान सीमा से अधिक है; डॉक्टर से पुष्टि कराएं।', 'speak_text': 'टी3 सामान्य सीमा से अधिक है। डॉक्टर से पुष्टि कराएं।'}, 'hinglish': {'meaning': 'T3 zyada hai; doctor se confirm karwa lena chahiye.', 'everyday_line': 'Level zyada hai; doctor se confirm karwa lena chahiye.', 'speak_text': 'टी3 सामान्य सीमा से अधिक है। डॉक्टर से पुष्टि करवाएं।'}}
    },
    'T4': {
        'normal': {'en': {'meaning': 'T4 is in the normal range; a doctor should confirm.', 'everyday_line': 'The value is in range; a doctor should confirm.', 'speak_text': 'T4 is in the normal range. A doctor should confirm.'}, 'hi': {'meaning': 'T4 सामान्य सीमा में है; डॉक्टर से पुष्टि कराएं।', 'everyday_line': 'मान सामान्य सीमा में है; डॉक्टर से पुष्टि कराएं।', 'speak_text': 'टी4 सामान्य सीमा में है। डॉक्टर से पुष्टि कराएं।'}, 'hinglish': {'meaning': 'T4 normal range me hai; doctor se confirm karwa lena chahiye.', 'everyday_line': 'Level normal range me hai; doctor se confirm karwa lena chahiye.', 'speak_text': 'टी4 सामान्य सीमा में है। डॉक्टर से पुष्टि करवाएं।'}},
        'low': {'en': {'meaning': 'T4 is below the normal range; a doctor should confirm.', 'everyday_line': 'The level is below range; a doctor should confirm.', 'speak_text': 'T4 is below the normal range. A doctor should confirm.'}, 'hi': {'meaning': 'T4 सामान्य सीमा से कम है; डॉक्टर से पुष्टि कराएं।', 'everyday_line': 'मान सीमा से कम है; डॉक्टर से पुष्टि कराएं।', 'speak_text': 'टी4 सामान्य सीमा से कम है। डॉक्टर से पुष्टि कराएं।'}, 'hinglish': {'meaning': 'T4 kam hai; doctor se confirm karwa lena chahiye.', 'everyday_line': 'Level kam hai; doctor se confirm karwa lena chahiye.', 'speak_text': 'टी4 सामान्य सीमा से कम है। डॉक्टर से पुष्टि करवाएं।'}},
        'high': {'en': {'meaning': 'T4 is above the normal range; a doctor should confirm.', 'everyday_line': 'The level is above range; a doctor should confirm.', 'speak_text': 'T4 is above the normal range. A doctor should confirm.'}, 'hi': {'meaning': 'T4 सामान्य सीमा से अधिक है; डॉक्टर से पुष्टि कराएं।', 'everyday_line': 'मान सीमा से अधिक है; डॉक्टर से पुष्टि कराएं।', 'speak_text': 'टी4 सामान्य सीमा से अधिक है। डॉक्टर से पुष्टि कराएं।'}, 'hinglish': {'meaning': 'T4 zyada hai; doctor se confirm karwa lena chahiye.', 'everyday_line': 'Level zyada hai; doctor se confirm karwa lena chahiye.', 'speak_text': 'टी4 सामान्य सीमा से अधिक है। डॉक्टर से पुष्टि करवाएं।'}}
    }
}

@app.post('/report/extract')
async def report_extract(file: UploadFile = File(...), lang: str = Form('en')):
    if not client:
        msg = {'en': 'Service unavailable. Please try again later.', 'hi': 'सेवा उपलब्ध नहीं है। कृपया बाद में प्रयास करें।', 'hinglish': 'Service nahi mil raha, baad mein try kariye.'}.get(lang, 'Service unavailable')
        return JSONResponse(status_code=503, content={'error': msg})
    lang = lang if lang in ['en', 'hi', 'hinglish'] else 'en'
    try:
        content = await file.read()
    except Exception:
        logging.exception('read file failed')
        return JSONResponse(status_code=400, content={'error': 'failed to read file'})
    if len(content) > 10 * 1024 * 1024:
        return {'error': 'file too large'}
    filename = (file.filename or '').lower()
    try:
        parts = []
        if filename.endswith('.pdf'):
            try:
                pdf = PyPDF2.PdfReader(io.BytesIO(content))
                text = ''
                for page in pdf.pages:
                    t = page.extract_text()
                    if t:
                        text += t
                parts.append(text)
            except Exception:
                logging.exception('pdf read failed')
                return {'error': 'unsupported file'}
        elif filename.endswith(('.png', '.jpg', '.jpeg')):
            try:
                img = Image.open(io.BytesIO(content))
                buf = io.BytesIO()
                img = img.convert('RGB')
                img.save(buf, format='JPEG')
                img_b64 = base64.b64encode(buf.getvalue()).decode()
                parts.append({'inline_data': {'mime_type': 'image/jpeg', 'data': img_b64}})
            except Exception:
                logging.exception('img read failed')
                return {'error': 'unsupported file'}
        else:
            try:
                text = content.decode('utf-8', errors='ignore')
                parts.append(text)
            except Exception:
                logging.exception('text decode failed')
                return {'error': 'unsupported file'}

        prompt = """You are a medical report parser. Detect if this is a CBC, thyroid profile, or unsupported.
If unsupported (like X-ray), return {"supported": false, "message": "Unsupported report type"}.
If supported, extract all test results as JSON with this exact structure:
{"supported": true, "report_type": "CBC" or "thyroid", "tests": [{"name": "...", "value": number or null, "unit": "...", "reference_range": "..."}, ...]}
Never guess missing values - return null. Include printed reference ranges as they appear.
Return ONLY valid JSON."""

        try:
            response = client.models.generate_content(model='gemini-3.5-flash-lite', contents=[prompt] + parts)
        except Exception:
            logging.exception('gemini first call failed')
            try:
                response = client.models.generate_content(model='gemini-3.1-flash-lite', contents=[prompt] + parts)
            except Exception:
                logging.exception('gemini fallback failed')
                msg = {'en': 'Service unavailable. Please try again later.', 'hi': 'सेवा उपलब्ध नहीं है। कृपया बाद में प्रयास करें।', 'hinglish': 'Abhi service nahi chal raha, thodi der baad try kariye.'}.get(lang, 'Service unavailable')
                return JSONResponse(status_code=503, content={'error': msg})
        text_resp = response.text.strip()
        if text_resp.startswith('```json'):
            text_resp = text_resp[7:]
        if text_resp.startswith('```'):
            text_resp = text_resp[3:]
        if text_resp.endswith('```'):
            text_resp = text_resp[:-3]
        try:
            result = json.loads(text_resp.strip())
        except Exception:
            logging.exception('json parse failed')
            msg = {'en': 'Service unavailable. Please try again later.', 'hi': 'सेवा उपलब्ध नहीं है। कृपया बाद में प्रयास करें।', 'hinglish': 'Kuch dikkat aayi hai, baad mein try kariye.'}.get(lang, 'Service unavailable')
            return JSONResponse(status_code=503, content={'error': msg})

        if result.get('supported') is False:
            return result

        tests_out = []
        report_type = result.get('report_type', '').lower()
        ranges_key = 'CBC' if 'cbc' in report_type else 'thyroid'
        ranges = RANGES.get(ranges_key, {})
        for t in result.get('tests', []):
            name = t.get('name')
            val = t.get('value')
            unit = t.get('unit', '') or ''
            ref = t.get('reference_range', '') or ''
            flag = None
            source = None
            if val is not None and ref:
                try:
                    m = re.findall(r'[\d\.]+', str(ref))
                    if len(m) >= 2:
                        low_p = float(m[0])
                        high_p = float(m[1])
                        v = float(val)
                        if v < low_p:
                            flag = 'low'
                        elif v > high_p:
                            flag = 'high'
                        else:
                            flag = 'normal'
                        source = 'printed range'
                except Exception:
                    logging.exception('range parse failed')
            if flag is None and val is not None and name and name in ranges:
                r = ranges[name]
                try:
                    v = float(val)
                    if v < r['low']:
                        flag = 'low'
                    elif v > r['high']:
                        flag = 'high'
                    else:
                        flag = 'normal'
                    source = r.get('source')
                except Exception:
                    logging.exception('range compare failed')
            tests_out.append({'name': name, 'value': val, 'unit': unit, 'reference_range': ref, 'flag': flag, 'flag_source': source})

        def validate_expl(expl, l):
            try:
                if not isinstance(expl, dict):
                    return False
                s = json.dumps(expl, ensure_ascii=False)
                if l == 'hi':
                    if not DEVANAGARI_RE.search(s):
                        return False
                if l == 'hinglish':
                    if ARABIC_RE.search(s):
                        return False
                    for pt in expl.get('per_test', []) or []:
                        st = str(pt.get('speak_text', ''))
                        if st and not DEVANAGARI_RE.search(st):
                            return False
                if l == 'en':
                    if DEVANAGARI_RE.search(s):
                        return False
                for k in ['summary', 'next_step']:
                    txt = str(expl.get(k, '')).lower()
                    for b in BANNED:
                        if b in txt:
                            return False
                for pt in expl.get('per_test', []) or []:
                    for k in ['meaning', 'everyday_line', 'speak_text']:
                        txt = str(pt.get(k, '')).lower()
                        for b in BANNED:
                            if b in txt:
                                return False
                for q in expl.get('questions_for_doctor', []) or []:
                    qt = str(q).lower()
                    for b in BANNED:
                        if b in qt:
                            return False
                bad_phrases = ['bilkul theek hai', 'no problem']
                for bp in bad_phrases:
                    if bp in s.lower():
                        return False
                if 'healthy' in s.lower() and l == 'en':
                    pass
                if l == 'en' and 'healthy' in s.lower():
                    # prefer not to say healthy; try to be strict
                    pass
                return True
            except Exception:
                logging.exception('validate failed')
                return False

        per_test_list = []
        for t in tests_out:
            name = t.get('name') or ''
            flag = t.get('flag') or 'normal'
            key = None
            for ck in COMMON_TEMPLATES.keys():
                if ck.lower() == name.lower() or ck.lower() in str(name).lower():
                    key = ck
                    break
            if key and flag in COMMON_TEMPLATES[key]:
                tmpl = COMMON_TEMPLATES[key][flag].get(lang) or COMMON_TEMPLATES[key][flag].get('en')
                per_test_list.append({'name': name, 'status': flag, 'meaning': tmpl['meaning'], 'everyday_line': tmpl['everyday_line'], 'speak_text': tmpl['speak_text']})
            else:
                per_test_list.append(None)

        try:
            missing = [i for i, p in enumerate(per_test_list) if p is None]
            if missing:
                missing_tests = [tests_out[i] for i in missing]
                expl_prompt = f"""You are explaining lab reports to a woman with little schooling in {lang} language.
Rules:
- Never diagnose, never name medicines or doses, never say "aapko X bimari hai". Never ask about medicines.
- Use "ye test normal range me hai" style. Never say the person is healthy; say the value is in range and a doctor should confirm.
- Keep numeric values and flags unchanged.
- Keep test name in English in brackets, e.g. "khoon (Hemoglobin)".
- en: all text and speak_text in English only.
- hi: all text in Devanagari Hindi only (no Roman letters except test names in brackets).
- hinglish: display text in Roman Hindi; speak_text in DEVANAGARI Hindi only (never Arabic).
- Banned words: medicine, tablet, dawai, capsule, vitamin, multivitamin, supplement, iron tablet, dose and similar.
- Replace "bilkul theek hai"/"no problem" with "ye test normal range me hai".
Return JSON only: {{"summary":"...","per_test":[{{"name":"...","status":"normal|low|high","meaning":"...","everyday_line":"...","speak_text":"..."}}],"questions_for_doctor":["..."],"next_step":"Doctor ko report dikhayein"}}
Tests: {json.dumps(missing_tests)}"""
                try:
                    expl_resp = client.models.generate_content(model='gemini-3.5-flash-lite', contents=[expl_prompt])
                except Exception:
                    logging.exception('expl gemini first failed')
                    try:
                        expl_resp = client.models.generate_content(model='gemini-3.1-flash-lite', contents=[expl_prompt])
                    except Exception:
                        logging.exception('expl gemini fallback failed')
                        expl_resp = None
                if expl_resp and hasattr(expl_resp, 'text'):
                    etext = expl_resp.text.strip()
                    if etext.startswith('```json'): etext = etext[7:]
                    if etext.startswith('```'): etext = etext[3:]
                    if etext.endswith('```'): etext = etext[:-3]
                    try:
                        gem_expl = json.loads(etext.strip())
                        if validate_expl(gem_expl, lang):
                            gem_list = gem_expl.get('per_test', []) or []
                            gi = 0
                            for i in missing:
                                if gi < len(gem_list):
                                    per_test_list[i] = gem_list[gi]
                                    gi += 1
                        else:
                            expl_prompt2 = expl_prompt + " STRICT: follow script rules exactly. speak_text must be Devanagari for hi and for hinglish. No Arabic script. No banned words."
                            try:
                                expl_resp2 = client.models.generate_content(model='gemini-3.5-flash-lite', contents=[expl_prompt2])
                                etext2 = expl_resp2.text.strip()
                                if etext2.startswith('```json'): etext2 = etext2[7:]
                                if etext2.startswith('```'): etext2 = etext2[3:]
                                if etext2.endswith('```'): etext2 = etext2[:-3]
                                gem_expl2 = json.loads(etext2.strip())
                                if validate_expl(gem_expl2, lang):
                                    gem_list = gem_expl2.get('per_test', []) or []
                                    gi = 0
                                    for i in missing:
                                        if gi < len(gem_list):
                                            per_test_list[i] = gem_list[gi]
                                            gi += 1
                            except Exception:
                                logging.exception('expl retry failed')
                    except Exception:
                        logging.exception('expl parse failed')
            for i, p in enumerate(per_test_list):
                if p is None:
                    flag = tests_out[i].get('flag') or 'normal'
                    name = tests_out[i].get('name') or 'Test'
                    if lang == 'hi':
                        per_test_list[i] = {'name': name, 'status': flag, 'meaning': f'{name} का मान सामान्य सीमा में है; डॉक्टर से पुष्टि कराएं।', 'everyday_line': 'मान सामान्य सीमा में है; डॉक्टर से पुष्टि कराएं।', 'speak_text': f'{name} का मान सामान्य सीमा में है। डॉक्टर से पुष्टि कराएं।'}
                    elif lang == 'hinglish':
                        per_test_list[i] = {'name': name, 'status': flag, 'meaning': f'{name} ka level normal range me hai; doctor se confirm karwa lena chahiye.', 'everyday_line': 'Level normal range me hai; doctor se confirm karwa lena chahiye.', 'speak_text': f'{name} का स्तर सामान्य सीमा में है। डॉक्टर से पुष्टि करवाएं।'}
                    else:
                        per_test_list[i] = {'name': name, 'status': flag, 'meaning': f'{name} is in the normal range; a doctor should confirm.', 'everyday_line': 'The value is in range; a doctor should confirm.', 'speak_text': f'{name} is in the normal range. A doctor should confirm.'}
            summary = {'en': 'These values are in range for the tests shown; a doctor should confirm.', 'hi': 'दिखाए गए परीक्षणों के मान सामान्य सीमा में हैं; डॉक्टर से पुष्टि कराएं।', 'hinglish': 'Dikhaye gaye tests ka level normal range me hai; doctor se confirm karwa lena chahiye.'}.get(lang)
            next_step = {'en': 'Show this report to your doctor.', 'hi': 'Doctor ko report dikhayein', 'hinglish': 'Doctor ko report dikha dein.'}.get(lang)
            questions = {'en': ['Should I get this confirmed by a doctor?', 'Are there any follow-up tests needed?', 'Is this value acceptable for me?'], 'hi': ['क्या मुझे डॉक्टर से पुष्टि करवानी चाहिए?', 'क्या किसी और जांच की जरूरत है?', 'क्या यह मान मेरे लिए ठीक है?'], 'hinglish': ['Kya mujhe doctor se confirm karwana chahiye?', 'Kya koi aur test karwana hai?', 'Kya yeh value theek hai?']}.get(lang, [])
            explanation = {'summary': summary, 'per_test': per_test_list, 'questions_for_doctor': questions, 'next_step': next_step}
            if not validate_expl(explanation, lang):
                explanation = {'summary': summary, 'per_test': per_test_list, 'questions_for_doctor': questions, 'next_step': next_step}
        except Exception:
            logging.exception('explanation build failed')
            explanation = None

        resp = {'supported': True, 'report_type': report_type, 'tests': tests_out}
        if explanation:
            resp['explanation'] = explanation
        return resp
    except Exception:
        logging.exception('report_extract failed')
        msg = {'en': 'Service unavailable. Please try again later.', 'hi': 'सेवा उपलब्ध नहीं है। कृपया बाद में प्रयास करें।', 'hinglish': 'Kuch dikkat aayi hai.'}.get(lang, 'Service unavailable')
        return JSONResponse(status_code=503, content={'error': msg})

@app.get('/health')
def health():
    return {'status': 'ok', 'services': ['breast', 'pcos', 'report']}
