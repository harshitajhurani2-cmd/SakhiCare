from fastapi.testclient import TestClient
from app_unified import app
import joblib

client = TestClient(app)

# (a) age 28, BMI 27, cycle_ri 4, weight gain 1, hair growth 1, skin darkening 1, pimples 1, fast food 1, hair loss 0, exercise 0
a = {
    'age_yrs': 28, 'BMI': 27, 'cycle_ri': 4,
    'weight_gain_yn': 1, 'hair_growth_yn': 1, 'skin_darkening_yn': 1,
    'hair_loss_yn': 0, 'pimples_yn': 1, 'fast_food_yn': 1, 'reg_exercise_yn': 0
}
# (b) age 28, BMI 22, cycle_ri 2, all Y/N fields 0 except exercise 1
b = {
    'age_yrs': 28, 'BMI': 22, 'cycle_ri': 2,
    'weight_gain_yn': 0, 'hair_growth_yn': 0, 'skin_darkening_yn': 0,
    'hair_loss_yn': 0, 'pimples_yn': 0, 'fast_food_yn': 0, 'reg_exercise_yn': 1
}

print('=== (a) ===')
r1 = client.post('/pcos/predict', json=a)
print(r1.status_code)
print(r1.json())

print('\n=== (b) ===')
r2 = client.post('/pcos/predict', json=b)
print(r2.status_code)
print(r2.json())

print('\nFEATURES:', joblib.load('../pcos/features.pkl'))
