import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';
import { translations } from '../i18n';
import ReadAloud from '../components/voice/ReadAloud';

export default function Home() {
  const { lang } = useLanguage();
  const t = translations[lang];
  
  const cards = [
    { to: '/journey', title: t.privateJourney, desc: lang === 'en' ? 'Get guidance for your concerns' : 'अपनी चिंताओं के लिए मार्गदर्शन पाएं', icon: '🧭' },
    { to: '/diary', title: t.healthDiary, desc: lang === 'en' ? 'Track your cycle' : 'अपना चक्र ट्रैक करें', icon: '📅' },
    { to: '/sikho', title: t.healthSikho, desc: lang === 'en' ? "Learn about women's health" : 'महिला स्वास्थ्य के बारे में जानें', icon: '📚' },
    { to: '/safe', title: t.safeNextSteps, desc: lang === 'en' ? 'Know when to seek care' : 'कब देखभाल की जरूरत है जानें', icon: '🛡️' },
    { to: '/breast', title: t.breastHealth, desc: lang === 'en' ? 'Breast health info' : 'स्तन स्वास्थ्य जानकारी', icon: '🎗️' },
    { to: '/pcos', title: t.pcosCheck, desc: lang === 'en' ? 'PCOS awareness' : 'पीसीओएस जागरूकता', icon: '💜' },
  ];
  
  const intro = lang === 'en' 
    ? "A private, bilingual women's health companion. Safe, simple, and non-judgmental."
    : 'एक निजी, द्विभाषी महिला स्वास्थ्य साथी। सुरक्षित, सरल और गैर-न्यायिक।';
  
  return (
    <div className="py-8">
      <section className="rounded-3xl p-8 md:p-12 mb-10 shadow-lg" style={{background: 'linear-gradient(135deg, #F7E8F0 0%, #FBF8FB 100%)'}}>
        <div className="max-w-3xl">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal mb-4 leading-tight">
            {lang === 'en' ? (<span>Your health, <span className="text-plum">your space</span></span>) : (<span>आपका स्वास्थ्य, <span className="text-plum">आपकी जगह</span></span>)}
          </h2>
          <p className="text-lg md:text-xl text-charcoal/80 mb-6 leading-relaxed">{intro}</p>
          <ReadAloud text={intro} />
          <div className="flex flex-wrap gap-3 mt-6">
            <Link to="/journey" className="px-6 py-3 bg-plum text-white rounded-xl font-semibold hover:bg-plum-dark transition-all duration-150 shadow-md hover:shadow-lg min-h-[44px] flex items-center">
              {lang === 'en' ? 'Start my health journey' : 'अपनी स्वास्थ्य यात्रा शुरू करें'}
            </Link>
            <Link to="/report" className="px-6 py-3 bg-white text-plum border-2 rounded-xl font-semibold hover:bg-blush transition-all duration-150 min-h-[44px] flex items-center" style={{borderColor: 'rgba(111,49,95,0.3)'}}>
              {lang === 'en' ? 'Understand my report' : 'अपनी रिपोर्ट समझें'}
            </Link>
          </div>
        </div>
      </section>
      
      <section className="mb-10">
        <h3 className="text-2xl md:text-3xl font-bold text-charcoal mb-6">{lang === 'en' ? 'Explore SakhiCare' : 'सखीकेयर एक्सप्लोर करें'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map(card => (
            <Link
              key={card.to}
              to={card.to}
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-150 border group"
              style={{borderColor: 'rgba(111,49,95,0.12)'}}
            >
              <div className="w-12 h-12 rounded-full bg-blush flex items-center justify-center mb-4 group-hover:bg-plum transition-colors duration-150">
                <span className="text-2xl">{card.icon}</span>
              </div>
              <h4 className="text-xl font-bold text-plum mb-2">{card.title}</h4>
              <p className="text-charcoal/75 mb-3">{card.desc}</p>
              <span className="text-rose">→</span>
            </Link>
          ))}
        </div>
      </section>
      
      <div className="rounded-xl p-4 flex items-center gap-3" style={{backgroundColor: '#E6F4ED'}}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#1F5D3A" strokeWidth="2" fill="none"/>
          <path d="M9 12l2 2 4-4" stroke="#1F5D3A" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <p className="text-success-text font-medium">{lang === 'en' ? 'Your data stays on your device' : 'आपका डेटा आपके डिवाइस पर रहता है'}</p>
      </div>
    </div>
  );
}
