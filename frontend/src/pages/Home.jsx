import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';
import { translations } from '../i18n';

export default function Home() {
  const { lang } = useLanguage();
  const t = translations[lang];
  
  const cards = [
    { to: '/journey', title: lang === 'en' ? 'Private Health Journey' : 'निजी स्वास्थ्य यात्रा', desc: lang === 'en' ? 'Get guidance for your concerns' : 'अपनी चिंताओं के लिए मार्गदर्शन पाएं' },
    { to: '/diary', title: lang === 'en' ? 'My Health Diary' : 'मेरा स्वास्थ्य डायरी', desc: lang === 'en' ? 'Track your cycle' : 'अपना चक्र ट्रैक करें' },
    { to: '/sikho', title: lang === 'en' ? 'Health Sikho' : 'स्वास्थ्य सीखो', desc: lang === 'en' ? 'Learn about women\'s health' : 'महिला स्वास्थ्य के बारे में जानें' },
    { to: '/safe', title: lang === 'en' ? 'Safe Next Steps' : 'सुरक्षित अगले कदम', desc: lang === 'en' ? 'Know when to seek care' : 'कब देखभाल की जरूरत है जानें' },
    { to: '/breast', title: lang === 'en' ? 'Breast Health' : 'स्तन स्वास्थ्य', desc: lang === 'en' ? 'Breast health info' : 'स्तन स्वास्थ्य जानकारी' },
    { to: '/pcos', title: lang === 'en' ? 'PCOS Check' : 'पीसीओएस जांच', desc: lang === 'en' ? 'PCOS awareness' : 'पीसीओएस जागरूकता' },
    { to: '/report', title: lang === 'en' ? 'Report Samjho' : 'रिपोर्ट समझो', desc: lang === 'en' ? 'Understand your reports' : 'अपनी रिपोर्ट समझें' },
    { to: '/chatbot', title: lang === 'en' ? 'Chatbot' : 'चैटबोट', desc: lang === 'en' ? 'Ask questions' : 'प्रश्न पूछें' },
  ];
  
  return (
    <div className="py-6">
      <div className="bg-white rounded-2xl p-6 shadow-lg mb-6 border-2 border-primary/20">
        <h2 className="text-3xl font-bold text-primary mb-3">🌸 {t.appName}</h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          {lang === 'en' 
            ? 'A private, bilingual women\'s health companion. Safe, simple, and non-judgmental.'
            : 'एक निजी, द्विभाषी महिला स्वास्थ्य साथी। सुरक्षित, सरल और गैर-न्यायिक।'}
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        {cards.map(card => (
          <Link
            key={card.to}
            to={card.to}
            className="bg-white p-5 rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all border-2 border-transparent hover:border-primary"
          >
            <h3 className="text-xl font-bold text-primary mb-2">{card.title}</h3>
            <p className="text-gray-600">{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
