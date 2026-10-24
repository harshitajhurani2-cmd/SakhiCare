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
- Shared classes: .btn-primary, .btn-secondary, .btn-icon, .chip, .card, .card-hover, .icon-circle, .badge, .notice, .notice-success, risk cards

## Header/Nav
- Solid sticky offwhite header, no transparency
- Logo: SVG lotus/heart (plum/rose), Sakhi (plum) Care (rose)
- Language toggle: pill, active plum white
- Nav: desktop dropdowns (Learn/Track/Tools), mobile hamburger drawer

## Run
Frontend: http://localhost:5173 (npm run dev)
Backend: http://localhost:8000

## Done
Rebuilt UI from scratch with plain CSS variables, fixed all white-on-white buttons, dropdown nav, bilingual support, no functionality/routes/API/i18n changes

## Rules
No API keys committed. No diagnosis or medicine advice.
