import React, { useState } from 'react';
import { useLanguage } from '../App';
import { translations } from '../i18n';

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
        { id: 'breast_lump', label: 'स्तन में गांठ/दर्द' },
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
    { name: lang === 'en' ? 'Women Helpline' : 'महिला हेल्पलाइन', number: '181' },
    { name: lang === 'en' ? 'Emergency' : 'आपातकाल', number: '112' },
  ];
  
  return (
    <div className="py-6">
      <h2 className="text-2xl font-bold text-primary mb-4">{t.safeNextSteps}</h2>
      
      <div className="bg-white p-6 rounded-xl shadow-lg mb-4">
        <h3 className="text-xl font-bold text-primary mb-3">{lang === 'en' ? 'Symptom Checklist' : 'लक्षण चेकलिस्ट'}</h3>
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
              />
              {s.label}
            </label>
          ))}
        </div>
        <button onClick={checkUrgency} className="mt-4 bg-primary text-white px-6 py-3 rounded-lg w-full text-lg">
          {lang === 'en' ? 'Check Guidance' : 'मार्गदर्शन जांचें'}
        </button>
      </div>
      
      {result && (
        <div className={'p-6 rounded-xl shadow-lg mb-4 ' + (result === 'urgent' ? 'bg-red-100 border-2 border-red-500' : result === 'doctor' ? 'bg-yellow-100 border-2 border-yellow-500' : 'bg-green-100 border-2 border-green-500')}>
          <h3 className="text-xl font-bold mb-2">
            {result === 'urgent' && (lang === 'en' ? 'URGENT - Seek immediate care' : 'अत्यावश्यक - तुरंत देखभाल लें')}
            {result === 'doctor' && (lang === 'en' ? 'See a doctor soon' : 'जल्द डॉक्टर से मिलें')}
            {result === 'selfcare' && (lang === 'en' ? 'Self-care may be enough' : 'स्व-देखभाल पर्याप्त हो सकती है')}
          </h3>
        </div>
      )}
      
      <div className="bg-white p-6 rounded-xl shadow-lg mb-4">
        <h3 className="text-xl font-bold text-red-600 mb-3">{lang === 'en' ? 'Emergency Warning Signs' : 'आपातकालीन चेतावनी संकेत'}</h3>
        <ul className="space-y-2 text-lg">
          {emergency.map((e, i) => <li key={i}>• {e}</li>)}
        </ul>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-lg mb-4">
        <h3 className="text-xl font-bold text-primary mb-3">{lang === 'en' ? 'Doctor Visit Checklist' : 'डॉक्टर यात्रा चेकलिस्ट'}</h3>
        <ul className="space-y-2 text-lg">
          {checklist.map((c, i) => <li key={i}>• {c}</li>)}
        </ul>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-lg mb-4">
        <h3 className="text-xl font-bold text-primary mb-3">{lang === 'en' ? 'Helplines' : 'हेल्पलाइन'}</h3>
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
