import React, { useState } from 'react';
import { useLanguage } from '../App';
import { translations } from '../i18n';
import ReadAloud from '../components/voice/ReadAloud';

export default function SafeNextSteps() {
  const { lang } = useLanguage();
  const t = translations[lang];
  
  const symptoms = lang === 'en' 
    ? [
        { id: 'bleeding_heavy', label: 'Very heavy bleeding' },
        { id: 'pain_severe', label: 'Severe abdominal pain' },
        { id: 'fever', label: 'High fever' },
        { id: 'dizzy', label: 'Dizziness/fainting' },
        { id: 'breast_lump', label: 'Breast lump/pain' },
        { id: 'irregular', label: 'Very irregular periods' },
      ]
    : [
        { id: 'bleeding_heavy', label: 'बहुत भारी रक्तस्राव' },
        { id: 'pain_severe', label: 'गंभीर पेट दर्द' },
        { id: 'fever', label: 'तेज बुखार' },
        { id: 'dizzy', label: 'चक्कर आना/बेहोशी' },
        { id: 'breast_lump', label: 'स्तन में गांठ/दर्द (Breast lump/pain)' },
        { id: 'irregular', label: 'बहुत अनियमित पीरियड्स' },
      ];
  
  const [checked, setChecked] = useState([]);
  const [result, setResult] = useState(null);
  
  const checkUrgency = () => {
    const urgent = ['bleeding_heavy', 'dizzy', 'pain_severe'];
    if (checked.some(s => urgent.includes(s))) {
      setResult('urgent');
    } else if (checked.length > 0) {
      setResult('doctor');
    } else {
      setResult('selfcare');
    }
  };
  
  const emergency = lang === 'en'
    ? ['Uncontrolled heavy bleeding', 'Severe pain with fainting', 'Difficulty breathing']
    : ['अनियंत्रित भारी रक्तस्राव', 'बेहोशी के साथ गंभीर दर्द', 'सांस लेने में कठिनाई'];
  
  const checklist = lang === 'en'
    ? ['Symptoms list', 'Questions to ask', 'Medications', 'Insurance details']
    : ['लक्षण सूची', 'पूछने के सवाल', 'दवाएं', 'बीमा विवरण'];
  
  const helplines = [
    { name: t.womenHelpline, number: '181' },
    { name: t.emergency, number: '112' },
  ];
  
  const resultText = result === 'urgent' ? t.urgentCare : result === 'doctor' ? t.doctorSoon : result === 'selfcare' ? t.selfCare : '';
  
  return (
    <div className="py-6">
      <h2 className="text-2xl font-bold text-primary mb-4">{t.safeNextSteps}</h2>
      
      <div className="bg-white p-6 rounded-xl shadow-lg mb-4">
        <h3 className="text-xl font-bold text-primary mb-3">{t.symptomChecklist}</h3>
        <div className="space-y-2">
          {symptoms.map(s => (
            <label key={s.id} className="flex items-center gap-3 text-lg cursor-pointer">
              <input
                type="checkbox"
                checked={checked.includes(s.id)}
                onChange={(e) => {
                  if (e.target.checked) setChecked([...checked, s.id]);
                  else setChecked(checked.filter(x => x !== s.id));
                }}
                className="w-5 h-5"
                aria-label={s.label}
              />
              {s.label}
            </label>
          ))}
        </div>
        <button onClick={checkUrgency} className="mt-4 bg-primary text-white px-6 py-3 rounded-lg w-full text-lg" aria-label={t.checkGuidance}>
          {t.checkGuidance}
        </button>
      </div>
      
      {result && (
        <div className={'p-6 rounded-xl shadow-lg mb-4 ' + (result === 'urgent' ? 'bg-red-100 border-2 border-red-500' : result === 'doctor' ? 'bg-yellow-100 border-2 border-yellow-500' : 'bg-green-100 border-2 border-green-500')}>
          <h3 className="text-xl font-bold mb-2">{resultText}</h3>
          <ReadAloud text={resultText} />
        </div>
      )}
      
      <div className="bg-white p-6 rounded-xl shadow-lg mb-4">
        <h3 className="text-xl font-bold text-red-600 mb-3">{t.emergencySigns}</h3>
        <ul className="space-y-2 text-lg">
          {emergency.map((e, i) => <li key={i}>• {e}</li>)}
        </ul>
        <ReadAloud text={emergency.join('. ')} />
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-lg mb-4">
        <h3 className="text-xl font-bold text-primary mb-3">{t.doctorChecklist}</h3>
        <ul className="space-y-2 text-lg">
          {checklist.map((c, i) => <li key={i}>• {c}</li>)}
        </ul>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-lg mb-4">
        <h3 className="text-xl font-bold text-primary mb-3">{t.helplines}</h3>
        <div className="space-y-2">
          {helplines.map((h, i) => (
            <div key={i} className="flex justify-between p-3 bg-primary/10 rounded-lg">
              <span className="text-lg">{h.name}</span>
              <span className="text-lg font-bold text-primary">{h.number}</span>
            </div>
          ))}
        </div>
      </div>
      
      <p className="mt-6 text-center text-red-600 font-semibold">{t.disclaimerHindi}</p>
    </div>
  );
}
