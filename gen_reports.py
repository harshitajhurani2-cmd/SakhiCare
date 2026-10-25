import os, json
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import random

os.makedirs('sample_reports', exist_ok=True)

expected = []
# CBC reports (3)
cbc_data = [
    {'name': 'CBC Report 1', 'tests': [('Hemoglobin', '12.5', 'g/dL', '12.0-15.5'), ('WBC', '7500', '/uL', '4000-11000'), ('Platelets', '250000', '/uL', '150000-450000')]},
    {'name': 'CBC Report 2', 'tests': [('Hemoglobin', '10.8', 'g/dL', '12.0-15.5'), ('RBC', '4.2', 'million/uL', '4.0-5.5'), ('Hematocrit', '32', '%', '36-46')]},
    {'name': 'CBC Report 3', 'tests': [('Hemoglobin', '14.2', 'g/dL', '12.0-15.5'), ('WBC', '6500', '/uL', '4000-11000'), ('Neutrophils', '65', '%', '40-70')]},
]
# Thyroid (3)
thyroid_data = [
    {'name': 'Thyroid Profile 1', 'tests': [('TSH', '2.1', 'mIU/L', '0.4-4.0'), ('T3', '110', 'ng/dL', '80-200'), ('T4', '8.5', 'ug/dL', '5.0-12.0')]},
    {'name': 'Thyroid Profile 2', 'tests': [('TSH', '6.8', 'mIU/L', '0.4-4.0'), ('Free T4', '0.8', 'ng/dL', '0.8-1.8'), ('T3', '95', 'ng/dL', '80-200')]},
    {'name': 'Thyroid Profile 3', 'tests': [('TSH', '0.2', 'mIU/L', '0.4-4.0'), ('T4', '14.2', 'ug/dL', '5.0-12.0'), ('T3', '220', 'ng/dL', '80-200')]},
]
# 2 different layouts
extra = [
    {'name': 'CBC Layout B', 'tests': [('Hemoglobin', '13.1', 'g/dL', '12.0-15.5'), ('WBC Count', '8200', '/uL', '4000-11000')]},
    {'name': 'Thyroid Layout B', 'tests': [('TSH', '3.2', 'mIU/L', '0.4-4.0'), ('T4', '9.1', 'ug/dL', '5.0-12.0')]},
]
# missing value
missing = [{'name': 'CBC Missing', 'tests': [('Hemoglobin', '12.8', 'g/dL', '12.0-15.5'), ('WBC', None, '/uL', '4000-11000')]}]
# unsupported
unsupported = 'X-RAY CHEST PA VIEW\\nImpression: Clear lung fields. No focal consolidation.'

all_reports = cbc_data + thyroid_data + extra + missing
# save first 5 as PDF, rest as images
files = []
# PDFs
for i, rep in enumerate(all_reports[:5]):
    fname = f'sample_reports/report_{i+1}.pdf'
    c = canvas.Canvas(fname, pagesize=letter)
    c.setFont('Helvetica-Bold', 16)
    c.drawString(72, 750, f'Lab: MediTest Labs (FAKE)')
    c.setFont('Helvetica', 10)
    c.drawString(72, 735, f'Patient: Patient_{i+1:03d} (FAKE)')
    c.setFont('Helvetica-Bold', 12)
    c.drawString(72, 700, rep['name'])
    y = 660
    c.setFont('Helvetica', 10)
    for test, val, unit, ref in rep['tests']:
        c.drawString(72, y, test)
        if val is not None:
            c.drawString(200, y, f'{val} {unit}')
        else:
            c.drawString(200, y, 'N/A')
        c.drawString(350, y, f'Ref: {ref}')
        y -= 20
    c.save()
    files.append(fname)
    expected.append({'file': fname, 'type': 'CBC' if 'CBC' in rep['name'] or 'Hemoglobin' in str(rep) else 'thyroid', 'tests': rep['tests']})

# Images
for i, rep in enumerate(all_reports[5:9]):  # 4 more
    fname = f'sample_reports/report_{i+6}.png'
    img = Image.new('RGB', (800, 600), color='white')
    d = ImageDraw.Draw(img)
    try:
        font = ImageFont.truetype('arial.ttf', 20)
        fontb = ImageFont.truetype('arial.ttf', 24)
    except:
        font = ImageFont.load_default()
        fontb = ImageFont.load_default()
    d.text((50, 50), 'Lab: HealthCare Plus (FAKE)', fill='black', font=fontb)
    d.text((50, 90), f'Patient: Patient_{i+6:03d} (FAKE)', fill='black', font=font)
    d.text((50, 140), rep['name'], fill='black', font=fontb)
    y = 200
    for test, val, unit, ref in rep['tests']:
        d.text((50, y), test, fill='black', font=font)
        if val is not None:
            d.text((300, y), f'{val} {unit}', fill='black', font=font)
        else:
            d.text((300, y), 'N/A', fill='black', font=font)
        d.text((500, y), f'Ref: {ref}', fill='black', font=font)
        y += 30
    if i < 3:  # apply rotation, blur, compression
        img = img.rotate(random.randint(-5,5), expand=False)
        img = img.filter(ImageFilter.GaussianBlur(radius=1))
        fname_jpg = fname.replace('.png', '.jpg')
        img.save(fname_jpg, quality=60)
        files.append(fname_jpg)
        expected.append({'file': fname_jpg, 'type': 'CBC' if 'CBC' in rep['name'] else 'thyroid', 'tests': rep['tests']})
    else:
        img.save(fname)
        files.append(fname)
        expected.append({'file': fname, 'type': 'CBC' if 'CBC' in rep['name'] else 'thyroid', 'tests': rep['tests']})

# unsupported text file as plain text - save as txt (but we need to test; create as image of text)
txt_path = 'sample_reports/unsupported_xray.txt'
with open(txt_path, 'w') as f:
    f.write(unsupported)
files.append(txt_path)
expected.append({'file': txt_path, 'type': 'unsupported', 'tests': []})

with open('sample_reports/expected_values.json', 'w') as f:
    json.dump(expected, f, indent=2)

print('done', len(files))
