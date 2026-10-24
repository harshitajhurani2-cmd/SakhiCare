from fastapi.testclient import TestClient
from pcos_api import app

client = TestClient(app)

# Sample 1: Higher risk profile
sample1 = {
    'age_yrs': 28,
    'BMI': 28.5,
    'cycle_ri': 4,
    'cycle_length_days': 45,
    'weight_gain_yn': 1,
    'hair_growth_yn': 1,
    'skin_darkening_yn': 1,
    'hair_loss_yn': 1,
    'pimples_yn': 1,
    'fast_food_yn': 1,
    'reg_exercise_yn': 0
}

# Sample 2: Lower risk profile
sample2 = {
    'age_yrs': 25,
    'BMI': 21.5,
    'cycle_ri': 2,
    'cycle_length_days': 28,
    'weight_gain_yn': 0,
    'hair_growth_yn': 0,
    'skin_darkening_yn': 0,
    'hair_loss_yn': 0,
    'pimples_yn': 0,
    'fast_food_yn': 0,
    'reg_exercise_yn': 1
}

print('=== SAMPLE 1 (Higher risk) ===')
r1 = client.post('/pcos/predict', json=sample1)
print(r1.status_code)
print(r1.json())

print('\n=== SAMPLE 2 (Lower risk) ===')
r2 = client.post('/pcos/predict', json=sample2)
print(r2.status_code)
print(r2.json())
