import os
try:
    with open('backend/.env','r',encoding='utf-16') as f:
        content = f.read()
    for line in content.splitlines():
        if line.strip().startswith('GEMINI_API_KEY'):
            k = line.split('=')[1].strip().strip('\"').strip(\"'\")
            os.environ['GEMINI_API_KEY']=k
            break
    print('has' if os.environ.get('GEMINI_API_KEY') else 'no')
except Exception as e:
    print(e)
