# PROGRESS.md

## Goal
SakhiCare, a private bilingual (Hindi/English) women's health web app for the recHERsion'26 hackathon (PS1 Women's Healthcare).

## Single entry point
- Run: python -m uvicorn main:app --host 127.0.0.1 --port 8000 from ackend/
- main.py contains all endpoints and loads breast (.keras + scaler) and PCOS (lr_model.pkl, lr_scaler.pkl, features.pkl)

## API
- GET /health
- GET /breast/reference
- POST /breast/predict (features[30])
- POST /pcos/predict (age_yrs, BMI, cycle_ri, *_yn)

## CORS
- Origins: http://localhost:5173, http://127.0.0.1:5173, http://localhost:5174, http://127.0.0.1:5174

## Frontend
- Breast Health: awareness, when-to-see-doctor, FNA note, 30 sliders grouped Mean/SE/Worst, load samples, 400ms debounce, band only, radar, localStorage breast_last
- PCOS: real page with plain CSS, risk band only, factors for medium/high, localStorage pcos_last
- Doctor Brief: reads diary/pcos_last/breast_last, preview A4 card, window.print() with @media print, added to nav and Home, bilingual

## Rules
No API keys committed. No diagnosis or medicine advice.
