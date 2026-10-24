from fastapi.testclient import TestClient
from app_unified import app
import joblib

client = TestClient(app)
a = {
    'age_yrs': 28, 'BMI': 27, 'cycle_ri': 4,
    'weight_gain_yn': 1, 'hair_growth_yn': 1, 'skin_darkening_yn': 1,
    'hair_loss_yn': 0, 'pimples_yn': 1
}
b = {
    'age_yrs': 28, 'BMI': 22, 'cycle_ri': 2,
    'weight_gain_yn': 0, 'hair_growth_yn': 0, 'skin_darkening_yn': 0,
    'hair_loss_yn': 0, 'pimples_yn': 0
}
print('=== (a) ===')
r1 = client.post('/pcos/predict', json=a)
print(r1.status_code); print(r1.json())
print('\n=== (b) ===')
r2 = client.post('/pcos/predict', json=b)
print(r2.status_code); print(r2.json())
print('\nFEATURES:', joblib.load('../pcos/features.pkl'))
