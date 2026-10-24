# PROGRESS.md

## Goal
SakhiCare, a private bilingual (Hindi/English) women's health web app for the recHERsion'26 hackathon (PS1 Women's Healthcare).

## Design tokens
- Colors: plum #6F315F, plum-dark #57254B, rose #D95C91, rose-dark #C04A80, blush #F7E8F0, offwhite #FBF8FB, charcoal #2D2630, mint #E6F4ED, success-text #1F5D3A
- Fonts: Poppins/Nunito for English, Noto Sans Devanagari for Hindi
- Logo: inline SVG lotus/heart mark, wordmark Sakhi (plum) Care (rose)
- Components: pill language toggle, responsive nav (hamburger on mobile), cards with hover effects, styled buttons/inputs

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

## Done
Steps 1-5: Backend APIs, full i18n + voice, polished UI redesign applied to all pages

## Rules
No API keys committed. No diagnosis or medicine advice.
