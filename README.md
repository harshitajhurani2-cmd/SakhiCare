# SakhiCare

**A private, bilingual (Hindi / English) women's health companion that helps women understand their symptoms and reports, and walk into a doctor's visit with clear information.**

Built for **recHERsion'26 Hackathon, PS1: Women's Healthcare**.

> SakhiCare is an awareness and screening-support tool. It does **not** diagnose, and it never suggests medicines or doses.

---

## Problem

Women's symptoms (irregular periods, pain, fatigue, breast changes) are often dismissed or ignored, and diagnosis can take years. Many women cannot remember their history in front of a doctor, cannot understand their lab reports, and find it hard to put their problem into words, especially in English.

## Our Solution

SakhiCare gives women three things: **understanding** (reports, education, chatbot), **record** (voice-enabled diary), and **action** (safe next steps and a one-page Doctor Brief).

## Features

| Feature | What it does |
|---|---|
| **Private Health Journey** | Pick a concern, answer simple questions, get next steps and a "how to talk to the doctor" guide |
| **My Health Diary** | Log periods, pain, bleeding and symptoms. Can also be filled by **speaking**: the app fills the form, the user checks and saves. Timeline and pain chart |
| **Voice Card** | The woman describes her problem in her own words (English or Hinglish). The app builds a **Doctor Card**: what she said, sentences to tell the doctor, and questions to ask. Can be read aloud, shown full screen, copied or saved to the diary |
| **Report Samjho** | Upload a CBC or thyroid report (PDF/photo). Gemini vision extracts values into an **editable table**, compares them with the printed reference range, explains in simple Hindi/English, and lists questions for the doctor. Unsupported reports are rejected instead of guessed |
| **Ask Sakhi (Chatbot)** | Women's-health Q&A in English, Hindi and Hinglish with **voice input and read-aloud**. Emergency words trigger an urgent message; medicine and diagnosis requests are refused |
| **PCOS Check** | Pattern flag (low / medium / high) from 8 self-reportable features. Shows top factors only for medium/high |
| **Breast Health** | Awareness content plus an educational screening demo of our ANN (30 WDBC features) |
| **Health Sikho** | Short modules (periods, PCOS, contraception, condoms, reproductive health) with read-aloud and quizzes |
| **Safe Next Steps** | Rule-based urgency guidance, emergency warning signs and a doctor-visit checklist |
| **Doctor Brief** | One printable page combining diary, voice entries, report values, PCOS/breast results and suggested questions (Save as PDF) |

Voice input, read-aloud and an EN/हिंदी toggle are available across the app.

## Machine Learning

### PCOS pattern model
- **Data:** Kaggle PCOS dataset (541 patients, Kerala hospitals).
- **Features (8, all self-reportable):** age, BMI, cycle regular/irregular, weight gain, hair growth, skin darkening, hair loss, pimples.
- **Deliberately excluded:** follicle counts, AMH, FSH, LH and other lab or ultrasound columns (a user cannot enter them, and they leak the diagnosis). Cycle length (not real cycle length in this dataset), exercise and fast food (confounded, reverse causation) were also removed.
- **Models:** Logistic Regression (default, interpretable) and XGBoost (comparison).

| Model | CV AUC | Test AUC | Recall @0.4 | Precision @0.4 |
|---|---|---|---|---|
| Logistic Regression | 0.874 | 0.899 | 0.833 | 0.612 |
| XGBoost | 0.861 | 0.870 | 0.750 | 0.818 |

Results are shown as risk **bands**, not a raw percentage, and always as a "pattern flag, not a diagnosis".

### Breast screening demo
- ANN (Dense 40-30-20-1, dropout) trained on the **WDBC dataset (569 samples, 30 features)**.
- Output is the probability of **benign**; the API returns `malignant_probability = 1 - output`.
- The 30 inputs come from lab image analysis of a needle aspirate, so a person cannot measure them at home. This is an educational demo, shown as bands (strong malignant-like pattern / uncertain / benign-like pattern), never as a verdict.

### NLP (LLM-based)
Gemini is used for report extraction (vision), plain-language explanations, the chatbot, and converting spoken problems into structured cards. We did not train an NLP model ourselves. Safety rules (urgent-word detection, banned medicine/dose terms, refusal of diagnosis) are applied in our code around the LLM.

## Tech Stack

- **Frontend:** React, Vite, React Router, Recharts, plain CSS, browser SpeechSynthesis and Web Speech API
- **Backend:** Python, FastAPI, Uvicorn
- **ML:** TensorFlow/Keras (ANN), scikit-learn, XGBoost, joblib
- **LLM:** Google Gemini API (REST)
- **Chatbot retrieval:** TF-IDF over PDFs placed in `backend/docs/` (scikit-learn, pypdf)
- **Storage:** browser `localStorage` only (no login, no server-side user data)

## Project Structure

```
SakhiCare/
├── backend/
│   ├── main.py            # FastAPI app: /breast, /pcos, /report endpoints
│   ├── chat_routes.py     # /chat (chatbot)
│   ├── voice_routes.py    # /voice/analyze (Voice Card and diary voice fill)
│   ├── docs/              # WHO/ICMR guideline PDFs (for chatbot retrieval)
│   ├── sample_reports/    # synthetic test reports
│   └── requirements.txt
├── breast/                # breast_cancer_ann.keras, scaler.pkl
├── pcos/                  # lr_model.pkl, lr_scaler.pkl, features.pkl, dataset, plots
├── frontend/              # React + Vite app
└── README.md
```

## Setup and Run

### Prerequisites
- Python 3.10 or 3.11 (TensorFlow does not support the newest Python versions)
- Node.js 18+
- A Gemini API key from Google AI Studio
- Google Chrome or Edge (needed for voice input)

### 1. Clone
```bash
git clone https://github.com/harshitajhurani2-cmd/SakhiCare.git
cd SakhiCare
```

### 2. Backend
```bash
cd backend
pip install -r requirements.txt
```
Create `backend/.env`:
```
GEMINI_API_KEY=your_key_here
```
Start the server:
```bash
uvicorn main:app --reload
```
Backend runs at `http://localhost:8000` (API docs at `/docs`).

### 3. Frontend
In a second terminal:
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173`.

To point the frontend to a different backend, create `frontend/.env`:
```
VITE_API_URL=http://localhost:8000
```

### 4. (Optional) Chatbot with guideline sources
Place text-based WHO/ICMR guideline PDFs in `backend/docs/` and restart the backend. Without PDFs the chatbot answers in a general-education mode. With PDFs it retrieves relevant passages and shows the source file and page.

## Dependencies

**Backend (`backend/requirements.txt`):** fastapi, uvicorn, python-multipart, python-dotenv, httpx, pydantic, numpy, pandas, scikit-learn, joblib, xgboost, pypdf, tensorflow-cpu

**Frontend (`frontend/package.json`):** react, react-dom, react-router-dom, recharts, vite

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/pcos/predict` | PCOS pattern band and top factors |
| POST | `/breast/predict` | Breast screening demo (30 features) |
| GET | `/breast/reference` | Slider ranges and typical profiles |
| POST | `/report/extract` | Extract and explain a CBC/thyroid report (file upload) |
| POST | `/chat` | Chatbot (English / Hindi / Hinglish) |
| POST | `/voice/analyze` | Turn spoken text into a doctor card or diary fields |
| GET | `/health` | Health check |

## Safety and Privacy

- Never diagnoses and never suggests medicines or doses; medicine terms are filtered from LLM output.
- Emergency words (for example very heavy bleeding, chest pain, self-harm) return an urgent message instead of an AI answer.
- Reports of unsupported types are rejected instead of guessed.
- User data stays in the browser (`localStorage`). No login.
- Voice typing uses the browser's speech service and may send audio to the browser provider. Users are told this before first use and can type instead.
- API keys live only in `.env`, which is excluded from Git.

## Limitations

- The PCOS model is trained on 541 patients from Kerala hospitals and uses only self-reported symptoms. It cannot confirm PCOS.
- The breast model is trained on 569 WDBC samples and its inputs are not measurable at home. It is a demo, not a screening result.
- Report extraction was tested on **synthetic** sample reports, not validated on real patient reports.
- LLM output can be wrong; every result carries a "consult a doctor" disclaimer.
- Voice input works in Chrome/Edge, and Hindi read-aloud needs a Hindi voice installed on the device.

## Demo Reports

`backend/sample_reports/` contains synthetic (fake) CBC and thyroid reports and an unsupported report, used for testing. No real patient data is used.

## Submission Links

- **GitHub:** https://github.com/harshitajhurani2-cmd/SakhiCare
- **Presentation (Google Drive):** _add link_
- **Demo Video (Google Drive):** _add link_
- **Live demo (if deployed):** _add link_

## Team

_Add team name and member names._

## Disclaimer

This project is for awareness and educational purposes only and is not a medical device. It does not provide a diagnosis. Please consult a qualified doctor for any health concern.
