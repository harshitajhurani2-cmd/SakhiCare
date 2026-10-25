from dotenv import load_dotenv
import os
load_dotenv('backend/.env')
k = os.getenv('GEMINI_API_KEY')
print('has' if k and len(k)>10 else 'no')
