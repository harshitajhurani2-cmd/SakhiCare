p = 'main.py'
d = open(p,'rb').read()
if d.startswith(b'\xef\xbb\xbf'):
    d = d[3:]
open(p,'wb').write(d)
print('done')
