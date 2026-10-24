# PROGRESS.md

## Goal
SakhiCare, a private bilingual (Hindi/English) women's health web app for the recHERsion'26 hackathon (PS1 Women's Healthcare).

## Design tokens (CSS variables in theme.css)
- --plum: #6F315F (primary), --plum-dark: #57254B
- --rose: #D95C91, --rose-dark: #C04A80
- --blush: #F7E8F0, --offwhite: #FBF8FB
- --charcoal: #2D2630, --mint: #E6F4ED, --mint-text: #1F5D3A
- --border: rgba(111,49,95,0.15), --shadow: 0 6px 20px rgba(111,49,95,0.12)
- Fonts: Poppins (EN), Poppins/Noto Sans Devanagari (HI)
- Shared classes: .btn-primary, .btn-secondary, .btn-icon, .chip, .card, .card-hover, .icon-circle, .badge, .notice, .notice-success, risk cards

## Backend
- Unified API at app_unified.py (breast + pcos routes merged)
- GET /breast/reference returns 30 features with min/max/mean_benign/mean_malignant/mean_all (cached from sklearn breast cancer)
- /breast/predict and /pcos/predict working; /pcos/predict uses pandas DataFrame with feature names for scaler
- Pydantic models use json_schema_extra

## Frontend
- Rebuilt styling from scratch with CSS variables, solid header, dropdown nav, fixed button contrast
- api.js/PCOS/Breast pages exist (as checked)

## Run
Frontend: http://localhost:5173 (npm run dev)
Backend: http://localhost:8000

## Done
- Added breast reference endpoint, fixed scaler warnings, Pydantic schema_extra -> json_schema_extra
- Rebuilt UI with CSS variables

## Rules
No API keys committed. No diagnosis or medicine advice.
