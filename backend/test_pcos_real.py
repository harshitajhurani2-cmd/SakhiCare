from fastapi.testclient import TestClient
from pcos_api import app
import pandas as pd

client = TestClient(app)
df = pd.read_csv('../pcos/PCOS_data.csv')

# Get a couple real samples
s1 = df[df['PCOS (Y/N)']==1].iloc[0]
sample1 = {
    'age_yrs': float(s1[' Age (yrs)']),
    'BMI': float(s1['BMI']),
    'cycle_ri': float(s1['Cycle(R/I)']) if float(s1['Cycle(R/I)']) != 5 else 4,
    'cycle_length_days': float(s1['Cycle length(days)']),
    'weight_gain_yn': float(s1['Weight gain(Y/N)']),
    'hair_growth_yn': float(s1['hair growth(Y/N)']),
    'skin_darkening_yn': float(s1['Skin darkening (Y/N)']),
    'hair_loss_yn': float(s1['Hair loss(Y/N)']),
    'pimples_yn': float(s1['Pimples(Y/N)']),
    'fast_food_yn': float(0 if pd.isna(s1['Fast food (Y/N)']) else s1['Fast food (Y/N)']),
    'reg_exercise_yn': float(s1['Reg.Exercise(Y/N)'])
}

s2 = df[df['PCOS (Y/N)']==0].iloc[0]
sample2 = {
    'age_yrs': float(s2[' Age (yrs)']),
    'BMI': float(s2['BMI']),
    'cycle_ri': float(s2['Cycle(R/I)']) if float(s2['Cycle(R/I)']) != 5 else 4,
    'cycle_length_days': float(s2['Cycle length(days)']),
    'weight_gain_yn': float(s2['Weight gain(Y/N)']),
    'hair_growth_yn': float(s2['hair growth(Y/N)']),
    'skin_darkening_yn': float(s2['Skin darkening (Y/N)']),
    'hair_loss_yn': float(s2['Hair loss(Y/N)']),
    'pimples_yn': float(s2['Pimples(Y/N)']),
    'fast_food_yn': float(0 if pd.isna(s2['Fast food (Y/N)']) else s2['Fast food (Y/N)']),
    'reg_exercise_yn': float(s2['Reg.Exercise(Y/N)'])
}

print('=== REAL SAMPLE 1 (PCOS Y/N=1) ===')
r1 = client.post('/pcos/predict', json=sample1)
print(r1.status_code)
print(r1.json())

print('\n=== REAL SAMPLE 2 (PCOS Y/N=0) ===')
r2 = client.post('/pcos/predict', json=sample2)
print(r2.status_code)
print(r2.json())
