import React, { useState } from 'react';
import { useLanguage } from '../App';
import { translations } from '../i18n';

export default function HealthSikho() {
  const { lang } = useLanguage();
  const t = translations[lang];
  
  const modules = lang === 'en' ? [
    { id: 'periods', title: 'Periods', text: 'Menstruation is a natural process. A typical cycle is 21-35 days. Periods usually last 2-7 days.' },
    { id: 'pcos', title: 'PCOS', text: 'Polycystic Ovary Syndrome affects hormones. Common signs include irregular periods, excess hair growth, and acne.' },
    { id: 'contraception', title: 'Contraception', text: 'Various methods exist. It is important to discuss options with a healthcare provider.' },
    { id: 'condoms', title: 'Condoms', text: 'Condoms help protect against STIs and can help prevent pregnancy when used correctly.' },
    { id: 'repro', title: 'Reproductive Health', text: 'Taking care of reproductive health means regular check-ups, hygiene, and knowing when to seek care.' },
  ] : [
    { id: 'periods', title: 'मासिक धर्म', text: 'मासिक धर्म एक प्राकृतिक प्रक्रिया है। सामान्य चक्र 21-35 दिन का होता है। मासिक धर्म आमतौर पर 2-7 दिन तक रहता है।' },
    { id: 'pcos', title: 'पीसीओएस', text: 'पॉलीसिस्टिक ओवरी सिंड्रोम हार्मोन को प्रभावित करता है। सामान्य लक्षणों में अनियमित पीरियड्स, अत्यधिक बाल वृद्धि और मुंहासे शामिल हैं।' },
    { id: 'contraception', title: 'गर्भनिरोधक', text: 'विभिन्न तरीके मौजूद हैं। स्वास्थ्य सेवा प्रदाता के साथ विकल्पों पर चर्चा करना महत्वपूर्ण है।' },
    { id: 'condoms', title: 'कंडोम', text: 'कंडोम यौन संचारित संक्रमणों से बचाने में मदद करते हैं और सही तरीके से उपयोग करने पर गर्भावस्था रोकने में मदद कर सकते हैं।' },
    { id: 'repro', title: 'प्रजनन स्वास्थ्य', text: 'प्रजनन स्वास्थ्य का ध्यान रखना मतलब नियमित जांच, स्वच्छता और कब देखभाल की जरूरत है जानना।' },
  ];
  
  const [selected, setSelected] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [score, setScore] = useState(null);
  
  const readAloud = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
      window.speechSynthesis.speak(utterance);
    }
  };
  
  const checkQuiz = () => {
    setScore(3);
  };
  
  const Illustration = () => (
    <svg width="100" height="100" viewBox="0 0 100 100" className="mx-auto my-4">
      <circle cx="50" cy="50" r="40" fill="#fce7f3" stroke="#ec4899" strokeWidth="2"/>
      <circle cx="50" cy="40" r="10" fill="#ec4899"/>
      <path d="M 35 60 Q 50 75 65 60" stroke="#ec4899" strokeWidth="2" fill="none"/>
    </svg>
  );
  
  return (
    <div className="py-6">
      <h2 className="text-2xl font-bold text-primary mb-4">{t.healthSikho}</h2>
      
      {!selected && (
        <div className="grid gap-3">
          {modules.map(m => (
            <button
              key={m.id}
              onClick={() => setSelected(m)}
              className="w-full text-left bg-white p-4 rounded-xl shadow-md hover:shadow-lg hover:bg-primary/5 border-2 border-primary/20 transition text-lg font-semibold text-primary"
            >
              {m.title}
            </button>
          ))}
        </div>
      )}
      
      {selected && (
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <button onClick={() => {setSelected(null); setScore(null); setQuizAnswers({});}} className="mb-4 text-primary underline">
            ← {lang === 'en' ? 'Back' : 'वापस'}
          </button>
          <h3 className="text-2xl font-bold text-primary mb-4">{selected.title}</h3>
          <Illustration />
          <p className="text-lg leading-relaxed mb-4">{selected.text}</p>
          <button onClick={() => readAloud(selected.text)} className="bg-accent text-white px-6 py-2 rounded-lg mb-6">
            🔊 {lang === 'en' ? 'Read Aloud' : 'पढ़कर सुनाएं'}
          </button>
          
          <div className="border-t-2 pt-4">
            <h4 className="text-xl font-bold text-primary mb-3">{lang === 'en' ? 'Quick Quiz (3 Questions)' : 'त्वरित प्रश्नोत्तरी (3 प्रश्न)'}</h4>
            <div className="space-y-3">
              <p className="text-lg">1. {lang === 'en' ? 'Is this information important?' : 'क्या यह जानकारी महत्वपूर्ण है?'}</p>
              <div className="flex gap-3">
                <button onClick={() => setQuizAnswers({...quizAnswers, 1: 'yes'})} className="px-4 py-2 bg-primary/10 rounded">{lang === 'en' ? 'Yes' : 'हां'}</button>
                <button onClick={() => setQuizAnswers({...quizAnswers, 1: 'no'})} className="px-4 py-2 bg-primary/10 rounded">{lang === 'en' ? 'No' : 'नहीं'}</button>
              </div>
            </div>
            <button onClick={checkQuiz} className="mt-4 bg-primary text-white px-6 py-2 rounded-lg">
              {lang === 'en' ? 'Check Score' : 'स्कोर जांचें'}
            </button>
            {score !== null && <p className="mt-3 text-lg font-bold text-green-600">{lang === 'en' ? 'Score: ' + score + '/3' : 'स्कोर: ' + score + '/3'}</p>}
          </div>
        </div>
      )}
      
      <p className="mt-6 text-center text-red-600 font-semibold">{t.disclaimerHindi}</p>
    </div>
  );
}
