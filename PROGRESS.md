# PROGRESS.md

## Goal
SakhiCare, a private bilingual (Hindi/English) women's health web app for the recHERsion'26 hackathon (PS1 Women's Healthcare).

## API Schemas
- POST /pcos/predict: age_yrs, BMI, cycle_ri (2 regular/4 irregular), weight_gain_yn, hair_growth_yn, skin_darkening_yn, hair_loss_yn, pimples_yn (all float/0-1)
- POST /breast/predict: features (list[float], 30 values in FEATURE_NAMES order)
- GET /breast/reference: 30 items with name,min,max,mean_benign,mean_malignant,mean_all

## Frontend
- .env: VITE_API_URL=http://localhost:8000
- src/api.js: pcosPredict, breastPredict, breastReference with AbortController 15s timeout, JSON headers, throws code OFFLINE on network errors, code SERVER with body on non-200
- PCOS Check real page, Home rewritten with plain CSS

## Backend
- CORS updated for localhost:5173/5174 and 127.0.0.1 variants
- app_unified merges routes

## Rules
No API keys committed. No diagnosis or medicine advice.
