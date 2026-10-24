from fastapi.testclient import TestClient
from app_unified import app

client = TestClient(app)

# PCOS sample 1: irregular cycle + hair growth + weight gain + skin darkening
pcos1 = {
    'age_yrs': 26,
    'BMI': 27.5,
    'cycle_ri': 4,  # irregular
    'cycle_length_days': 40,
    'weight_gain_yn': 1,
    'hair_growth_yn': 1,
    'skin_darkening_yn': 1,
    'hair_loss_yn': 0,
    'pimples_yn': 1,
    'fast_food_yn': 1,
    'reg_exercise_yn': 0
}

# PCOS sample 2: none of these
pcos2 = {
    'age_yrs': 24,
    'BMI': 22.0,
    'cycle_ri': 2,  # regular
    'cycle_length_days': 28,
    'weight_gain_yn': 0,
    'hair_growth_yn': 0,
    'skin_darkening_yn': 0,
    'hair_loss_yn': 0,
    'pimples_yn': 0,
    'fast_food_yn': 0,
    'reg_exercise_yn': 1
}

print('=== PCOS /pcos/predict SAMPLE 1 (irregular + hair growth + weight gain + skin darkening) ===')
r1 = client.post('/pcos/predict', json=pcos1)
print(r1.status_code)
print(r1.json())

print('\n=== PCOS /pcos/predict SAMPLE 2 (none) ===')
r2 = client.post('/pcos/predict', json=pcos2)
print(r2.status_code)
print(r2.json())

# Breast sample
breast_sample = [
    17.99, 10.38, 122.8, 1001.0, 0.1184, 0.2776, 0.3001, 0.1471, 0.2419, 0.07871,
    1.095, 0.9053, 8.589, 153.4, 0.006399, 0.04904, 0.05373, 0.01587, 0.03003, 0.006193,
    25.38, 17.33, 184.6, 2019.0, 0.1622, 0.6656, 0.7119, 0.2654, 0.4601, 0.1189
]

print('\n=== BREAST /breast/predict (malignant sample) ===')
rb = client.post('/breast/predict', json={'features': breast_sample})
print(rb.status_code)
print(rb.json())
