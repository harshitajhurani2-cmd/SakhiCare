# PROGRESS.md

## Goal
SakhiCare, a private bilingual (Hindi/English) women's health web app for the recHERsion'26 hackathon (PS1 Women's Healthcare).

## API
- POST /pcos/predict: age_yrs, BMI, cycle_ri (2/4), weight_gain_yn,hair_growth_yn,skin_darkening_yn,hair_loss_yn,pimples_yn
- POST /breast/predict: features[30]
- GET /breast/reference: 30 items

## Frontend
- src/api.js with timeout/AbortController, OFFLINE and SERVER error codes
- PCOS Check page rewritten with plain CSS (pcos.css), no Tailwind, no "Coming soon", risk band only, factors only for medium/high, low message, limitations + doctor questions, offline retry, server details, localStorage pcos_last
- Home rebuilt with plain CSS

## Backend
- CORS updated for localhost variants

## Rules
No API keys committed. No diagnosis or medicine advice.
