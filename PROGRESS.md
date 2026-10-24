# PROGRESS.md

## Goal
SakhiCare, a private bilingual (Hindi/English) women's health web app for the recHERsion'26 hackathon (PS1 Women's Healthcare).

## Folder structure
- breast/, pcos/, backend/, frontend/

## How to run
### Backend
`ash
cd backend
pip install fastapi uvicorn tensorflow scikit-learn joblib numpy pandas xgboost shap httpx
uvicorn app_unified:app --reload --host 0.0.0.0 --port 8000
`
### Frontend
`powershell
cd "C:\Users\harshita jhurani\Downloads\New folder\sakhi\frontend"
npm install
npm run dev -- --host 0.0.0.0 --port 5173
`
URL: http://localhost:5173

## UI/UX updates
- Language toggle (EN | हिंदी) clearly visible at top right of header on every page, large tap target, saves to localStorage, updates entire UI
- Responsive header: logo left, nav links in scrollable row on desktop or hamburger menu on mobile, language toggle right
- ReadAloud button added to: Home intro, Health Sikho modules, Safe Next Steps results/emergency, Journey next steps and doctor guide

## i18n & Voice
- All strings in src/i18n.js (en/hi), structure ready for more languages
- ReadAloud with play/pause/stop/speed, hi-IN/en-IN
- MicButton with SpeechRecognition, privacy notice, editable transcript

## Done
Step 1-4 complete. Frontend tested at http://localhost:5173 (200).

## Next steps
(4) done, (5) Report Samjho + RAG chatbot, (6) doctor brief PDF

## Rules
No API keys committed. No diagnosis or medicine advice.
