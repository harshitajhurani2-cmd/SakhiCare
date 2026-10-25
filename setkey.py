import os
with open('backend/.env','r',encoding='utf-16') as f:
    c = f.read()
for line in c.replace(chr(13),'').split(chr(10)):
    if line.strip().startswith('GEMINI_API_KEY'):
        k = line.split('=',1)[1].strip().strip(chr(34)).strip(chr(39))
        os.environ['GEMINI_API_KEY']=k
        break
print('ok')
