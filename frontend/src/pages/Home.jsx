import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';
import { translations } from '../i18n';
import ReadAloud from '../components/voice/ReadAloud';

export default function Home() {
  const { lang } = useLanguage();
  const t = translations[lang];
  
  const cards = [
    { to: '/journey', title: t.privateJourney, desc: lang === 'en' ? 'Get guidance for your concerns' : 'अपनी चिंताओं के लिए मार्गदर्शन पाएं' },
    { to: '/diary', title: t.healthDiary, desc: lang === 'en' ? 'Track your cycle' : 'अपना चक्र ट्रैक करें' },
    { to: '/sikho', title: t.healthSikho, desc: lang === 'en' ? 'Learn about women\'s health' : 'महिला स्वास्थ्य के बारे में जानें' },
    { to: '/safe', title: t.safeNextSteps, desc: lang === 'en' ? 'Know when to seek care' : 'कब देखभाल की जरूरत है जानें' },
    { to: '/breast', title: t.breastHealth, desc: lang === 'en' ? 'Breast health info' : 'स्तन स्वास्थ्य जानकारी' },
    { to: '/pcos', title: t.pcosCheck, desc: lang === 'en' ? 'PCOS awareness' : 'पीसीओएस जागरूकता' },
    { to: '/report', title: t.reportSamjho, desc: lang === 'en' ? 'Understand your reports' : 'अपनी रिपोर्ट समझें' },
    { to: '/chatbot', title: t.chatbot, desc: lang === 'en' ? 'Ask questions' : 'प्रश्न पूछें' },
  ];
  
  const intro = lang === 'en' 
    ? 'A private, bilingual women\'s health companion. Safe, simple, and non-judgmental.'
    : 'एक निजी, द्विभाषी महिला स्वास्थ्य साथी। सुरक्षित, सरल और गैर-न्यायिक।';
  
  return (
    <div className="py-6">
      <div className="bg-white rounded-2xl p-6 shadow-lg mb-6 border-2 border-primary/20">
        <h2 className="text-3xl font-bold text-primary mb-3">🌸 {t.appName}</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-3">{intro}</p>
        <ReadAloud text={intro} />
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
