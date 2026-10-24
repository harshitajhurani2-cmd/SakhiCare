from fastapi.testclient import TestClient
from app_unified import app

client = TestClient(app)

pcos1 = {
    'age_yrs': 28,
    'BMI': 27,
    'cycle_ri': 4,
    'cycle_length_days': 35,
    'weight_gain_yn': 1,
    'hair_growth_yn': 1,
    'skin_darkening_yn': 1,
    'hair_loss_yn': 0,
    'pimples_yn': 1,
    'fast_food_yn': 1,
    'reg_exercise_yn': 0
}

pcos2 = {
    'age_yrs': 28,
    'BMI': 22,
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

print('=== INPUT 1 ===')
print(pcos1)
print('\n=== INPUT 2 ===')
print(pcos2)
print('\n---')
r1 = client.post('/pcos/predict', json=pcos1)
r2 = client.post('/pcos/predict', json=pcos2)
print(r1.status_code, r1.json())
print(r2.status_code, r2.json())
