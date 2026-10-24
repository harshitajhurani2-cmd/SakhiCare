from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

app = FastAPI(title='Unified API', version='1.0.0')
app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174', 'http://127.0.0.1:5174'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

# Import and mount routes from both
from main import app as breast_app
from pcos_api import app as pcos_app

# Merge routes
app.router.routes.extend(breast_app.router.routes)
app.router.routes.extend(pcos_app.router.routes)

@app.get('/health')
def health():
    return {'status': 'ok', 'services': ['breast', 'pcos']}
