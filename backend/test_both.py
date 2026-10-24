from fastapi.testclient import TestClient
from main import app
import numpy as np
from tensorflow.keras.models import load_model
import joblib
import os

client = TestClient(app)

malignant_sample = [
    17.99, 10.38, 122.8, 1001.0, 0.1184, 0.2776, 0.3001, 0.1471, 0.2419, 0.07871,
    1.095, 0.9053, 8.589, 153.4, 0.006399, 0.04904, 0.05373, 0.01587, 0.03003, 0.006193,
    25.38, 17.33, 184.6, 2019.0, 0.1622, 0.6656, 0.7119, 0.2654, 0.4601, 0.1189
]

benign_sample = [
    13.54, 14.36, 87.46, 566.3, 0.09779, 0.08129, 0.06664, 0.04781, 0.1885, 0.05766,
    0.2699, 0.7886, 2.058, 23.56, 0.008462, 0.0146, 0.02387, 0.01315, 0.0198, 0.0023,
    15.11, 19.26, 99.7, 711.2, 0.144, 0.1773, 0.239, 0.1288, 0.2977, 0.07259
]

print('=== MALIGNANT SAMPLE ===')
r1 = client.post('/breast/predict', json={'features': malignant_sample})
print(r1.status_code)
print(r1.json())

print('\n=== BENIGN SAMPLE ===')
r2 = client.post('/breast/predict', json={'features': benign_sample})
print(r2.status_code)
print(r2.json())

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(ROOT_DIR, 'breast', 'breast_cancer_ann.keras')
SCALER_PATH = os.path.join(ROOT_DIR, 'breast', 'scaler.pkl')

model = load_model(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)

X1 = np.array([malignant_sample]); X1s = scaler.transform(X1)
p1_benign = float(model.predict(X1s, verbose=0)[0][0])
print(f"\nDirect model (malignant): P(benign)={p1_benign:.6f}, malignant_probability={1-p1_benign:.6f}, API malignant_probability={r1.json()['malignant_probability']:.6f}")

X2 = np.array([benign_sample]); X2s = scaler.transform(X2)
p2_benign = float(model.predict(X2s, verbose=0)[0][0])
print(f"Direct model (benign): P(benign)={p2_benign:.6f}, malignant_probability={1-p2_benign:.6f}, API malignant_probability={r2.json()['malignant_probability']:.6f}")
print("\nCONFIRM: malignant_probability = 1 - model_output (where model_output = P(benign) from sigmoid)")
