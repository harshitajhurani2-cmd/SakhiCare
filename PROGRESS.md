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

## i18n (Localization)
- All UI strings in rontend/src/i18n.js with en and hi objects. Structure allows adding more languages (add new object).
- Language switcher in header, saved to localStorage, sets <html lang>, defaults to browser language.
- Medical terms use Hindi with English in brackets e.g. \"पीसीओएस (PCOS)\".
- Dates/numbers use Intl APIs where applicable.
- Backend receives lang on API calls; returns localized user-facing text where applicable.

## Voice features
- components/voice/ReadAloud.jsx: play/pause/stop, speed control (0.75x/1x/1.25x), hi-IN/en-IN, best voice selection, fallback message if no voice.
- components/voice/MicButton.jsx: SpeechRecognition with hi-IN/en-IN, listening indicator, stop button, editable transcript, one-time privacy notice, hidden if unsupported.
- Added to Health Sikho, Safe Next Steps, Diary notes, Journey inputs.

## API endpoints
- POST /breast/predict (30 features) - returns malignant_probability, label, limitations
- POST /pcos/predict (8 features) - returns probability, risk_band, top_factors, disclaimer
- GET /health

## Done
- Step 1: Breast API verified
- Step 2: PCOS models + API verified (LR default)
- Step 3: Frontend built
- Step 4: Full localization (hi/en) + voice output/input added

## Pages
Home, Private Health Journey, My Health Diary, Health Sikho, Safe Next Steps, Breast Health (coming soon), PCOS Check (coming soon), Report Samjho (coming soon), Chatbot (coming soon)

## Key decisions
- Breast: sigmoid = P(benign), malignant_probability = 1-output
- PCOS: LR default, 8 self-reportable features, removed Cycle length/Exercise/Fast food, Cycle(R/I) 2=regular,4=irregular, risk bands low/medium/high

## Known limitations
- PCOS: 541 Kerala patients; breast: 569 WDBC samples

## Next steps
(4) done, (5) Report Samjho + RAG chatbot, (6) doctor brief PDF

## Rules
API keys only in .env, never committed. No diagnosis or medicine advice anywhere.
