import pandas as pd
import joblib
import numpy as np
from sklearn.preprocessing import StandardScaler
from fastapi.testclient import TestClient
from app_unified import app

client = TestClient(app)
features = joblib.load('../pcos/features.pkl')
lr_model = joblib.load('../pcos/lr_model.pkl')
lr_scaler = joblib.load('../pcos/lr_scaler.pkl')
df = pd.read_csv('../pcos/PCOS_data.csv')

rows_pos = df[df['PCOS (Y/N)']==1].head(3)
rows_neg = df[df['PCOS (Y/N)']==0].head(3)

def row_to_input(row):
    return {
        'age_yrs': float(row[' Age (yrs)']),
        'BMI': float(row['BMI']),
        'cycle_ri': float(row['Cycle(R/I)']) if float(row['Cycle(R/I)']) != 5 else 4,
        'cycle_length_days': float(row['Cycle length(days)']),
        'weight_gain_yn': float(0 if pd.isna(row['Weight gain(Y/N)']) else row['Weight gain(Y/N)']),
        'hair_growth_yn': float(0 if pd.isna(row['hair growth(Y/N)']) else row['hair growth(Y/N)']),
        'skin_darkening_yn': float(0 if pd.isna(row['Skin darkening (Y/N)']) else row['Skin darkening (Y/N)']),
        'hair_loss_yn': float(0 if pd.isna(row['Hair loss(Y/N)']) else row['Hair loss(Y/N)']),
        'pimples_yn': float(0 if pd.isna(row['Pimples(Y/N)']) else row['Pimples(Y/N)']),
        'fast_food_yn': float(0 if pd.isna(row['Fast food (Y/N)']) else row['Fast food (Y/N)']),
        'reg_exercise_yn': float(0 if pd.isna(row['Reg.Exercise(Y/N)']) else row['Reg.Exercise(Y/N)'])
    }

def row_to_vals(row):
    vals = []
    for f in features:
        if f.strip() == 'Age (yrs)':
            vals.append(float(row[' Age (yrs)']))
        elif f == 'BMI':
            vals.append(float(row['BMI']))
        elif f == 'Cycle(R/I)':
            v = float(row['Cycle(R/I)'])
            if v == 5: v = 4
            vals.append(v)
        elif f == 'Cycle length(days)':
            vals.append(float(row['Cycle length(days)']))
        elif f == 'Weight gain(Y/N)':
            vals.append(float(0 if pd.isna(row['Weight gain(Y/N)']) else row['Weight gain(Y/N)']))
        elif f == 'hair growth(Y/N)':
            vals.append(float(0 if pd.isna(row['hair growth(Y/N)']) else row['hair growth(Y/N)']))
        elif f == 'Skin darkening (Y/N)':
            vals.append(float(0 if pd.isna(row['Skin darkening (Y/N)']) else row['Skin darkening (Y/N)']))
        elif f == 'Hair loss(Y/N)':
            vals.append(float(0 if pd.isna(row['Hair loss(Y/N)']) else row['Hair loss(Y/N)']))
        elif f == 'Pimples(Y/N)':
            vals.append(float(0 if pd.isna(row['Pimples(Y/N)']) else row['Pimples(Y/N)']))
        elif f == 'Fast food (Y/N)':
            vals.append(float(0 if pd.isna(row['Fast food (Y/N)']) else row['Fast food (Y/N)']))
        elif f == 'Reg.Exercise(Y/N)':
            vals.append(float(0 if pd.isna(row['Reg.Exercise(Y/N)']) else row['Reg.Exercise(Y/N)']))
    return vals

print('=== COMPARING API vs DIRECT MODEL ===')
for i, (_, row) in enumerate(rows_pos.iterrows()):
    inp = row_to_input(row)
    vals = row_to_vals(row)
    Xs = lr_scaler.transform([vals])
    direct = float(lr_model.predict_proba(Xs)[0][1])
    api = client.post('/pcos/predict', json=inp).json()['probability']
    print(f'PCOS=1 row{i+1}: direct={direct:.6f}, api={api:.6f}, match={abs(direct-api)<1e-6}')

for i, (_, row) in enumerate(rows_neg.iterrows()):
    inp = row_to_input(row)
    vals = row_to_vals(row)
    Xs = lr_scaler.transform([vals])
    direct = float(lr_model.predict_proba(Xs)[0][1])
    api = client.post('/pcos/predict', json=inp).json()['probability']
    print(f'PCOS=0 row{i+1}: direct={direct:.6f}, api={api:.6f}, match={abs(direct-api)<1e-6}')
