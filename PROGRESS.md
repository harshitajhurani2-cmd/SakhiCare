# PROGRESS.md

## Goal
SakhiCare, a private bilingual (Hindi/English) women's health web app for the recHERsion'26 hackathon (PS1 Women's Healthcare).

## Folder structure
- breast/ - Cloned repo with breast cancer ANN model (breast_cancer_ann.keras), scaler.pkl, app.py, notebook
- pcos/ - PCOS data and models
  - PCOS_data.csv (541 rows, 45 columns)
  - lr_model.pkl, lr_scaler.pkl, xgb_model.pkl, features.pkl (8-feature LR default)
  - calibration_curve.png, shap_summary.png
- backend/ - FastAPI backend
  - main.py (breast endpoints)
  - pcos_api.py (pcos endpoints)
  - app_unified.py (unified app)
  - test_*.py files for verification
- frontend/ - Empty (to be created)

## How to run the backend (exact commands)
From the project root (C:\\Users\\harshita jhurani\\Downloads\\New folder\\sakhi):

`ash
cd backend
pip install fastapi uvicorn tensorflow scikit-learn joblib numpy pandas xgboost shap httpx
uvicorn app_unified:app --reload --host 0.0.0.0 --port 8000
`

Or run individual apps:
`ash
cd backend
uvicorn main:app --reload --port 8000  # breast only
uvicorn pcos_api:app --reload --port 8001  # pcos only
`

## API endpoints with example inputs

### Breast Cancer
**POST /breast/predict**
- Input: {"features": [30 float values]}
- Features are in WDBC order (30 features from breast cancer dataset)
- Example (malignant sample from app.py):
`json
{
  "features": [
    17.99, 10.38, 122.8, 1001.0, 0.1184, 0.2776, 0.3001, 0.1471, 0.2419, 0.07871,
    1.095, 0.9053, 8.589, 153.4, 0.006399, 0.04904, 0.05373, 0.01587, 0.03003, 0.006193,
    25.38, 17.33, 184.6, 2019.0, 0.1622, 0.6656, 0.7119, 0.2654, 0.4601, 0.1189
  ]
}
`
- Response:
`json
{
  "malignant_probability": 1.0,
  "label": "malignant",
  "limitations": ["Educational/demo use only - not a substitute for professional medical diagnosis", "..."]
}
`

**GET /health** - Health check

### PCOS
**POST /pcos/predict** (Logistic Regression default, 8 features)
- Input fields: age_yrs, BMI, cycle_ri, weight_gain_yn, hair_growth_yn, skin_darkening_yn, hair_loss_yn, pimples_yn
- Note: cycle_ri = 2 for regular, 4 for irregular (value 5 mapped to 4). Y/N fields are 0 or 1.
- Example (a) - high risk pattern:
`json
{
  "age_yrs": 28,
  "BMI": 27,
  "cycle_ri": 4,
  "weight_gain_yn": 1,
  "hair_growth_yn": 1,
  "skin_darkening_yn": 1,
  "hair_loss_yn": 0,
  "pimples_yn": 1
}
`
- Response:
`json
{
  "probability": 0.982339,
  "risk_band": "high",
  "top_factors": ["Hair growth", "Skin darkening", "Cycle(R/I)"],
  "disclaimer": "This is for educational/demo purposes only and is not a substitute for professional medical diagnosis."
}
`
- Example (b) - low risk:
`json
{
  "age_yrs": 28,
  "BMI": 22,
  "cycle_ri": 2,
  "weight_gain_yn": 0,
  "hair_growth_yn": 0,
  "skin_darkening_yn": 0,
  "hair_loss_yn": 0,
  "pimples_yn": 0
}
`

**GET /health** - Health check

## Done
- **Step 1**: Breast API verified - sigmoid output = P(benign), malignant_probability = 1 - output. Tested with malignant and benign samples.
- **Step 2**: PCOS models + API verified - LR default trained, XGBoost for comparison, tested with multiple samples, API matches direct model predictions.

## Key decisions and why
- **Breast ANN sigmoid output = P(benign); malignant_probability = 1 - output.** Confirmed from app.py logic (prediction is Benign if prob > 0.5, gauge labeled "Probability of Benign") and dataset labels (0=malignant, 1=benign).
- **Breast model is a screening demo with 30 WDBC features from lab/image analysis; it must not claim diagnosis. Show probability bands, not raw %** - Educational demo only, requires clinical correlation.
- **PCOS: logistic regression is the default; XGBoost kept for comparison.** LR performed well and is more interpretable.
- **PCOS uses only self-reportable features. Removed 'Cycle length(days)' (values 2-12, not real cycle length), and Reg.Exercise / Fast food (confounded, reverse causation). Cycle(R/I): 2 = regular, 4 = irregular.** These decisions improve clinical validity.
- **Show PCOS as risk bands (low/medium/high), "pattern flag, not diagnosis".** Avoids diagnostic claims.

## Known limitations
- PCOS dataset is 541 patients from Kerala hospitals; may not generalize to all populations.
- Breast model trained on 569 WDBC samples; screening demo only, not a substitute for professional medical diagnosis.

## Next steps in order
1. **(3) React frontend with 6 features** - Create React app in frontend/ with bilingual support (Hindi/English)
2. **(4) Connect breast and PCOS pages to the API** - Integrate with backend endpoints
3. **(5) Report Samjho (CBC/thyroid extraction with Gemini vision) and RAG chatbot over WHO/ICMR PDFs** - Add document processing and chatbot
4. **(6) doctor brief PDF** - Generate PDF reports

## Rules
- API keys only in .env and never committed
- No diagnosis or medicine advice anywhere in the app
