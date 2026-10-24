# PROGRESS.md

## Goal
SakhiCare, a private bilingual (Hindi/English) women's health web app for the recHERsion'26 hackathon (PS1 Women's Healthcare).

## Folder structure
- breast/ - Cloned repo with breast cancer ANN model
- pcos/ - PCOS data and models (8-feature LR default)
- backend/ - FastAPI backend (main.py, pcos_api.py, app_unified.py)
- frontend/ - React + Vite + Tailwind app (SakhiCare)

## How to run

### Backend
`ash
cd backend
pip install fastapi uvicorn tensorflow scikit-learn joblib numpy pandas xgboost shap httpx
uvicorn app_unified:app --reload --host 0.0.0.0 --port 8000
`

### Frontend
`ash
cd frontend
npm install
npm run dev
# Build: npm run build
`
API base URL from VITE_API_URL (default http://localhost:8000). All data in localStorage only.

## API endpoints
- POST /breast/predict (30 features) - returns malignant_probability, label, limitations
- POST /pcos/predict (8 features: age_yrs, BMI, cycle_ri, weight_gain_yn, hair_growth_yn, skin_darkening_yn, hair_loss_yn, pimples_yn; cycle_ri 2=regular,4=irregular) - returns probability, risk_band, top_factors, disclaimer
- GET /health

## Done
- Step 1: Breast API verified (sigmoid = P(benign), malignant_probability = 1 - output)
- Step 2: PCOS models + API verified (LR default, XGBoost comparison). Final 8 features, removed Cycle length, Exercise, Fast food
- Step 3 (frontend): React + Vite + Tailwind app created with bilingual (hi/en) support, all required pages built

## Pages in frontend
- Home, Private Health Journey (concern picker + 5 questions + doctor guide), My Health Diary (period tracking, edit/delete, Recharts), Health Sikho (modules with SVG, read-aloud, quiz), Safe Next Steps (urgency guidance, emergency signs, checklist, helplines)
- Placeholders: Breast Health, PCOS Check, Report Samjho, Chatbot (Coming soon)
- Disclaimer on every page: 'Yeh jaankari ke liye hai, diagnosis nahi. Doctor se zaroor milein.' No diagnosis/medicine advice. All data in localStorage only.

## Key decisions
- Breast: sigmoid = P(benign), malignant_probability = 1-output; screening demo, show bands not raw %
- PCOS: LR default, XGBoost comparison; only self-reportable features; removed Cycle length (2-12, not real), Exercise/Fast food (confounded); Cycle(R/I) 2=regular,4=irregular; risk bands low/medium/high, 'pattern flag not diagnosis'

## Known limitations
- PCOS: 541 Kerala patients; breast: 569 WDBC samples

## Next steps
(3) done, (4) connect breast and PCOS pages to API, (5) Report Samjho + RAG chatbot, (6) doctor brief PDF

## Rules
API keys only in .env, never committed. No diagnosis or medicine advice anywhere.
