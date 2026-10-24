import React, { useState } from 'react';
import { useLanguage } from '../App';
import { translations } from '../i18n';

export default function PrivateHealthJourney() {
  const { lang } = useLanguage();
  const t = translations[lang];
  
  const concerns = lang === 'en' 
    ? [
        { id: 'periods', label: 'Periods & Menstrual Issues' },
        { id: 'breast', label: 'Breast Changes' },
        { id: 'pcos', label: 'PCOS-related Concerns' },
        { id: 'contraception', label: 'Contraception' },
        { id: 'other', label: 'Other Concerns' },
        { id: 'unsure', label: "I do not understand what to do" },
      ]
    : [
        { id: 'periods', label: 'मासिक धर्म और मासिक समस्याएं' },
        { id: 'breast', label: 'स्तन में बदलाव' },
        { id: 'pcos', label: 'पीसीओएस से संबंधित चिंताएं' },
        { id: 'contraception', label: 'गर्भनिरोधक' },
        { id: 'other', label: 'अन्य चिंताएं' },
        { id: 'unsure', label: 'मैं समझ नहीं पा रही कि क्या करूं' },
      ];
  
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState({});
  const [step, setStep] = useState(0);
  
  const questions = [
    lang === 'en' ? 'When did you first notice this?' : 'आपने इसे पहली बार कब महसूस किया?',
    lang === 'en' ? 'How long has this been happening?' : 'यह कब से हो रहा है?',
    lang === 'en' ? 'Is it getting worse, better, or same?' : 'यह बिगड़ रहा है, बेहतर हो रहा है, या वही है?',
    lang === 'en' ? 'Does it affect your daily life?' : 'क्या यह आपके दैनिक जीवन को प्रभावित करता है?',
    lang === 'en' ? 'Have you spoken to anyone about this?' : 'क्या आपने किसी से इसके बारे में बात की है?',
  ];
  
  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };
  
  const copyGuide = () => {
    const guide = lang === 'en'
      ? 'Doctor Conversation Guide:\\n1. Start with: I have been noticing [your concern]\\n2. When did it start?\\n3. What changes have you observed?\\n4. Any pain/discomfort? (rate 1-10)\\n5. Questions you want answered'
      : 'डॉक्टर से बात करने की गाइड:\\n1. शुरू करें: मैंने [अपनी चिंता] नोटिस किया है\\n2. यह कब शुरू हुआ?\\n3. क्या बदलाव देखे हैं?\\n4. कोई दर्द/असहजता? (1-10 पर रेट करें)\\n5. कौन से सवाल पूछने हैं';
    try {
      navigator.clipboard.writeText(guide);
      alert(lang === 'en' ? 'Copied!' : 'कॉपी हो गया!');
    } catch(e) {}
  };
  
  return (
    <div className="py-6">
      <h2 className="text-2xl font-bold text-primary mb-4">{t.privateJourney}</h2>
      
      {!selected && (
        <div className="space-y-3">
          <p className="text-lg mb-4">{lang === 'en' ? 'Select your concern:' : 'अपनी चिंता चुनें:'}</p>
          {concerns.map(c => (
            <button
              key={c.id}
              onClick={() => setSelected(c)}
              className="w-full text-left bg-white p-4 rounded-xl shadow-md hover:shadow-lg hover:bg-primary/5 border-2 border-primary/20 transition text-lg"
            >
              {c.label}
            </button>
          ))}
        </div>
      )}
      
      {selected && step < 5 && (
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold text-primary mb-4">{selected.label}</h3>
          <p className="text-lg mb-4">{questions[step]}</p>
          <textarea
            value={answers[step] || ''}
            onChange={(e) => setAnswers({...answers, [step]: e.target.value})}
            className="w-full p-3 border-2 border-primary/30 rounded-lg text-lg"
            rows="3"
          />
          <button
            onClick={handleNext}
            className="mt-4 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primaryDark text-lg w-full"
          >
            {step === 4 ? (lang === 'en' ? 'Finish' : 'समाप्त') : (lang === 'en' ? 'Next' : 'आगे')}
          </button>
        </div>
      )}
      
      {selected && step === 5 && (
        <div className="bg-white p-6 rounded-xl shadow-lg space-y-4">
          <h3 className="text-xl font-bold text-primary">{lang === 'en' ? 'Next Steps' : 'आगे के कदम'}</h3>
          <ul className="space-y-2 text-lg">
            <li>• {lang === 'en' ? 'Keep track of your symptoms' : 'अपने लक्षणों पर नज़र रखें'}</li>
            <li>• {lang === 'en' ? 'Rest and take care of yourself' : 'आराम करें और अपना ख्याल रखें'}</li>
            <li>• {lang === 'en' ? 'If symptoms persist or worsen, consult a doctor' : 'यदि लक्षण बने रहें या बिगड़ें, तो डॉक्टर से सलाह लें'}</li>
          </ul>
          
          <button
            onClick={copyGuide}
            className="w-full bg-accent text-white px-6 py-3 rounded-lg hover:bg-pink-600 text-lg"
          >
            {lang === 'en' ? 'Copy Doctor Conversation Guide' : 'डॉक्टर बातचीत गाइड कॉपी करें'}
          </button>
          
          <button
            onClick={() => {setSelected(null); setStep(0); setAnswers({});}}
            className="w-full bg-gray-200 px-6 py-3 rounded-lg hover:bg-gray-300 text-lg"
          >
            {lang === 'en' ? 'Start Over' : 'फिर से शुरू करें'}
          </button>
        </div>
      )}
      
      <p className="mt-6 text-center text-red-600 font-semibold">{t.disclaimerHindi}</p>
    </div>
  );
}
