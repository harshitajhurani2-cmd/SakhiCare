import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';
import { translations } from '../i18n';
import ReadAloud from '../components/voice/ReadAloud';
import '../home.css';

export default function Home() {
  const { lang } = useLanguage();
  const t = translations[lang];
  
  const cards = [
    { to: '/diary', title: t.healthDiary, desc: t.descDiary, key: 'diary' },
    { to: '/sikho', title: t.healthSikho, desc: t.descSikho, key: 'sikho' },
    { to: '/safe', title: t.safeNextSteps, desc: t.descSafe, key: 'safe' },
    { to: '/breast', title: t.breastHealth, desc: t.descBreast, key: 'breast' },
    { to: '/pcos', title: t.pcosCheck, desc: t.descPcos, key: 'pcos' },
    { to: '/brief', title: t.doctorBrief || (lang === 'hi' ? 'डॉक्टर ब्रीफ' : 'Doctor Brief'), desc: t.doctorBriefDesc || (lang === 'hi' ? 'अपने डेटा का प्रिंट करने योग्य सारांश बनाएं' : 'Generate a printable summary of your data'), key: 'brief' },
    { to: '/report', title: t.reportSamjho, desc: t.descReport, key: 'report', soon: true },
    { to: '/chatbot', title: t.chatbot, desc: t.descChatbot, key: 'chatbot', soon: true },
  ];
  
  const intro = t.homeSubtitle;
  
  const getIcon = (key) => {
    if (key === 'journey') return <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" strokeWidth="2"/><path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" strokeWidth="2" strokeLinecap="round"/></svg>;
    if (key === 'diary') return <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="2"/><path d="M16 2v4M8 2v4M3 10h18" strokeWidth="2" strokeLinecap="round"/></svg>;
    if (key === 'sikho') return <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" strokeWidth="2" strokeLinecap="round"/></svg>;
    if (key === 'safe') return <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeWidth="2"/></svg>;
    if (key === 'breast') return <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" strokeWidth="2"/><path d="M12 1v6m0 6v6" strokeWidth="2" strokeLinecap="round"/></svg>;
    if (key === 'pcos') return <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" strokeWidth="2"/><path d="M12 16v6M12 2v6M4.93 4.93l4.24 4.24m5.66 5.66l4.24 4.24M2 12h6m6 0h6M4.93 19.07l4.24-4.24m5.66-5.66l4.24-4.24" strokeWidth="2" strokeLinecap="round"/></svg>;
    if (key === 'report') return <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeWidth="2"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" strokeWidth="2" strokeLinecap="round"/></svg>;
    if (key === 'chatbot') return <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" strokeWidth="2" strokeLinecap="round"/></svg>;
    return <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" strokeWidth="2"/></svg>;
  };
  
  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero-deco1"></div>
        <div className="home-hero-deco2"></div>
        <div className="home-hero-content">
          <h1>{lang === 'en' ? <>Your health, <span>your space</span></> : <>आपका स्वास्थ्य, <span>आपकी जगह</span></>}</h1>
          <p className="home-hero-subtitle">{intro}</p>
          <div className="home-read-aloud" style={{ marginBottom: '20px' }}>
            <ReadAloud text={intro} />
          </div>
          <div className="home-hero-actions">
            <Link to="/journey" className="home-btn-primary">
              {t.startJourney}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 3l5 5-5 5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link to="/report" className="home-btn-secondary">{t.understandReport}</Link>
          </div>
          <div className="home-badges">
            <span className="home-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#6F315F" strokeWidth="2"/>
              </svg>
              {t.private}
            </span>
            <span className="home-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="3" stroke="#6F315F" strokeWidth="2"/>
                <path d="M12 1v6m0 6v6" stroke="#6F315F" strokeWidth="2"/>
              </svg>
              {t.hindiEnglish}
            </span>
            <span className="home-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#6F315F" strokeWidth="2"/>
                <path d="M12 8v4M12 16h.01" stroke="#6F315F" strokeWidth="2"/>
              </svg>
              {t.notDiagnosis}
            </span>
          </div>
        </div>
      </section>
      
      <section className="home-section">
        <h2>{t.exploreSakhiCare}</h2>
        <div className="home-grid">
          {cards.map(card => (
            <Link key={card.key} to={card.to} className="home-card">
              <div className="home-icon-circle">
                {getIcon(card.key)}
              </div>
              <h3 className="home-card-title">{card.title}</h3>
              <p className="home-card-desc">{card.desc}</p>
              {card.soon && <span className="home-badge-soon">{t.comingSoon}</span>}
              <span className="home-arrow">→</span>
            </Link>
          ))}
        </div>
      </section>
      
      <section className="home-how">
        <h2>{t.howItWorks}</h2>
        <div className="home-how-steps">
          <div className="home-how-step">
            <div className="home-how-circle">1</div>
            <div>
              <p className="home-how-title">{t.stepUnderstand}</p>
              <p className="home-how-desc">{t.stepUnderstandDesc}</p>
            </div>
          </div>
          <div className="home-how-step">
            <div className="home-how-circle">2</div>
            <div>
              <p className="home-how-title">{t.stepRecord}</p>
              <p className="home-how-desc">{t.stepRecordDesc}</p>
            </div>
          </div>
          <div className="home-how-step">
            <div className="home-how-circle">3</div>
            <div>
              <p className="home-how-title">{t.stepAct}</p>
              <p className="home-how-desc">{t.stepActDesc}</p>
            </div>
          </div>
        </div>
      </section>
      
      <div className="home-privacy">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#1F5D3A" strokeWidth="2"/>
          <path d="M9 12l2 2 4-4" stroke="#1F5D3A" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <span>{t.dataStays}</span>
      </div>
    </div>
  );
}
