# PROGRESS.md

## Goal
SakhiCare, a private bilingual (Hindi/English) women's health web app for the recHERsion'26 hackathon (PS1 Women's Healthcare).

## Design tokens (CSS variables in theme.css)
- --plum: #6F315F (primary), --plum-dark: #57254B
- --rose: #D95C91, --rose-dark: #C04A80
- --blush: #F7E8F0, --offwhite: #FBF8FB
- --charcoal: #2D2630, --mint: #E6F4ED, --mint-text: #1F5D3A
- --border: rgba(111,49,95,0.15), --shadow: 0 6px 20px rgba(111,49,95,0.12)
- Fonts: Poppins (EN), Noto Sans Devanagari (HI)
- Shared classes: .card, .btn-primary, .btn-secondary, .chip, .notice, .badge, risk cards

## Backend
- app_unified.py merges breast + pcos
- GET /breast/reference returns 30 features with stats
- /pcos/predict returns risk_band/top_factors; uses DataFrame for scalers
- Pydantic uses json_schema_extra

## Frontend
- .env: VITE_API_URL=http://localhost:8000
- src/api.js: pcosPredict, breastPredict, breastReference with 15s timeout and OFFLINE error
- PCOS Check page: real form, sends correct field names (age_yrs, BMI, cycle_ri 2/4, *_yn 0/1), shows only risk band with icon/label, \"Pattern flag, not a diagnosis\", top_factors only for medium/high, low message when none, limitations + doctor questions, offline message with retry, saves to localStorage pcos_last, bilingual

## Run
Frontend: http://localhost:5173, Backend: http://localhost:8000

## Rules
No API keys committed. No diagnosis or medicine advice.
