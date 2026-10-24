from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import os
import numpy as np

app = FastAPI(title='PCOS API', version='1.0.0')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(BASE_DIR)
PCOS_DIR = os.path.join(ROOT_DIR, 'pcos')

lr_model = joblib.load(os.path.join(PCOS_DIR, 'lr_model.pkl'))
lr_scaler = joblib.load(os.path.join(PCOS_DIR, 'lr_scaler.pkl'))
features = joblib.load(os.path.join(PCOS_DIR, 'features.pkl'))

class PCOSInput(BaseModel):
    age_yrs: float = None  # Age (yrs)
    BMI: float = None
    cycle_ri: float = None  # Cycle(R/I)
    cycle_length_days: float = None
    weight_gain_yn: float = None
    hair_growth_yn: float = None
    skin_darkening_yn: float = None
    hair_loss_yn: float = None
    pimples_yn: float = None
    fast_food_yn: float = None
    reg_exercise_yn: float = None
    
    class Config:
        schema_extra = {
            'example': {
                'age_yrs': 25,
                'BMI': 24.5,
                'cycle_ri': 2,
                'cycle_length_days': 5,
                'weight_gain_yn': 1,
                'hair_growth_yn': 1,
                'skin_darkening_yn': 0,
                'hair_loss_yn': 1,
                'pimples_yn': 1,
                'fast_food_yn': 1,
                'reg_exercise_yn': 0
            }
        }

@app.post('/pcos/predict')
def predict_pcos(data: PCOSInput):
    # Map to feature order
    vals = [
        data.age_yrs if data.age_yrs is not None else 0,
        data.BMI if data.BMI is not None else 0,
        data.cycle_ri if data.cycle_ri is not None else 2,
        data.cycle_length_days if data.cycle_length_days is not None else 5,
        data.weight_gain_yn if data.weight_gain_yn is not None else 0,
        data.hair_growth_yn if data.hair_growth_yn is not None else 0,
        data.skin_darkening_yn if data.skin_darkening_yn is not None else 0,
        data.hair_loss_yn if data.hair_loss_yn is not None else 0,
        data.pimples_yn if data.pimples_yn is not None else 0,
        data.fast_food_yn if data.fast_food_yn is not None else 0,
        data.reg_exercise_yn if data.reg_exercise_yn is not None else 0,
    ]
    
    X = np.array([vals])
    X_scaled = lr_scaler.transform(X)
    prob = float(lr_model.predict_proba(X_scaled)[:, 1][0])
    
    # Risk band
    if prob < 0.3:
        risk_band = 'low'
    elif prob < 0.6:
        risk_band = 'medium'
    else:
        risk_band = 'high'
    
    # Top factors (simple based on coefficients)
    coef = lr_model.coef_[0]
    feature_names_clean = ['Age', 'BMI', 'Cycle(R/I)', 'Cycle length', 'Weight gain', 
                          'Hair growth', 'Skin darkening', 'Hair loss', 'Pimples', 
                          'Fast food', 'Reg.Exercise']
    top_idx = np.argsort(np.abs(coef))[-3:][::-1]
    top_factors = [feature_names_clean[i] for i in top_idx]
    
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
