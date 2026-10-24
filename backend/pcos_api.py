from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import os
import numpy as np
import pandas as pd

app = FastAPI(title='PCOS API', version='1.0.0')
app.add_middleware(CORSMiddleware, allow_origins=['*'], allow_credentials=True, allow_methods=['*'], allow_headers=['*'])

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(BASE_DIR)
PCOS_DIR = os.path.join(ROOT_DIR, 'pcos')

lr_model = joblib.load(os.path.join(PCOS_DIR, 'lr_model.pkl'))
lr_scaler = joblib.load(os.path.join(PCOS_DIR, 'lr_scaler.pkl'))
features = joblib.load(os.path.join(PCOS_DIR, 'features.pkl'))

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
    for f in features:
        if f.strip() == 'Age (yrs)':
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
        X_df = pd.DataFrame(X, columns=features)
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
    feature_names_clean = ['Age', 'BMI', 'Cycle(R/I)', 'Weight gain', 
                          'Hair growth', 'Skin darkening', 'Hair loss', 'Pimples']
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

@app.get('/health')
def health():
    return {'status': 'ok'}
