import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import { useLanguage } from './App';
import { translations } from './i18n';

import Home from './pages/Home';
import PrivateHealthJourney from './pages/PrivateHealthJourney';
import HealthDiary from './pages/HealthDiary';
import HealthSikho from './pages/HealthSikho';
import SafeNextSteps from './pages/SafeNextSteps';
import BreastHealth from './pages/BreastHealth';
import PCOSCheck from './pages/PCOSCheck';
import ReportSamjho from './pages/ReportSamjho';
import Chatbot from './pages/Chatbot';
import DoctorBrief from './pages/DoctorBrief';
import VoiceCard from './pages/VoiceCard';
import Insights from './pages/Insights';
import ErrorBoundary from './components/ErrorBoundary';

function Nav() {
  const { lang } = useLanguage();
  const t = translations[lang];
  const [open, setOpen] = useState(false);
  const [learnOpen, setLearnOpen] = useState(false);
  const [trackOpen, setTrackOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const location = useLocation();
  const navRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setLearnOpen(false);
        setTrackOpen(false);
        setToolsOpen(false);
      }
    };
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setLearnOpen(false);
        setTrackOpen(false);
        setToolsOpen(false);
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);
  
  const isActive = (path) => location.pathname === path;
  
  const Dropdown = ({ title, items, isOpen, setIsOpen }) => (
    <div style={{ position: 'relative' }} onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <button 
        style={{ 
          padding: '8px 16px', 
          color: 'var(--charcoal)', 
          background: 'transparent', 
          border: 'none', 
          fontFamily: 'inherit', 
          fontSize: '16px', 
          fontWeight: 500, 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px', 
          minHeight: '44px', 
          cursor: 'pointer' 
        }} 
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {title} 
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
          <path d="M1 1L5 5L9 1" stroke="var(--plum)" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
      {isOpen && (
        <div style={{ 
          position: 'absolute', 
          top: '100%', 
          left: 0, 
          background: '#ffffff', 
          boxShadow: '0 10px 28px rgba(111,49,95,0.16)', 
          borderRadius: '12px', 
          border: '1px solid var(--border)', 
          padding: '8px 0', 
          minWidth: '200px', 
          zIndex: 100 
        }}>
          {items.map(item => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => {setIsOpen(false); setOpen(false);}}
              style={{ 
                display: 'block', 
                padding: '10px 16px', 
                textDecoration: 'none', 
                color: isActive(item.to) ? 'var(--plum)' : 'var(--charcoal)',
                fontWeight: isActive(item.to) ? 600 : 400,
                background: 'transparent'
              }}
              onMouseEnter={(e) => e.target.style.background = 'var(--blush)'}
              onMouseLeave={(e) => e.target.style.background = 'transparent'}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
  
  const learnItems = [
    { to: '/sikho', label: t.healthSikho },
    { to: '/chatbot', label: t.chatbot },
    { to: '/voice', label: 'Voice Card' },
  ];
  const trackItems = [
    { to: '/diary', label: t.healthDiary },
    { to: '/insights', label: 'Summary Insights' },
    { to: '/journey', label: t.privateJourney },
  ];
  const toolsItems = [
    { to: '/pcos', label: t.pcosCheck },
    { to: '/breast', label: t.breastHealth },
    { to: '/brief', label: t.doctorBrief || (lang === 'hi' ? 'डॉक्टर ब्रीफ' : 'Doctor Brief') },
    { to: '/report', label: t.reportSamjho },
    { to: '/safe', label: t.safeNextSteps },
  ];
  
  return (
    <nav style={{ marginBottom: '32px' }} ref={navRef}>
      <button
        onClick={() => setOpen(!open)}
        style={{ 
          display: 'none',
          width: '100%', 
          padding: '12px 16px', 
          textAlign: 'left', 
          color: 'var(--plum)', 
          fontWeight: 600, 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          background: '#ffffff', 
          borderRadius: '12px', 
          border: '1px solid var(--border)', 
          minHeight: '44px',
          cursor: 'pointer',
          fontFamily: 'inherit',
          fontSize: '16px'
        }}
        className="mobile-menu-btn"
        aria-label={lang === 'en' ? 'Menu' : 'मेन्यू'}
      >
        <span>{lang === 'en' ? 'Menu' : 'मेन्यू'}</span>
        <span>{open ? '▲' : '▼'}</span>
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '16px' }} className="desktop-nav">
        <Dropdown title={lang === 'en' ? 'Learn' : 'सीखें'} items={learnItems} isOpen={learnOpen} setIsOpen={setLearnOpen} />
        <Dropdown title={lang === 'en' ? 'Track' : 'ट्रैक करें'} items={trackItems} isOpen={trackOpen} setIsOpen={setTrackOpen} />
        <Dropdown title={lang === 'en' ? 'Tools' : 'टूल्स'} items={toolsItems} isOpen={toolsOpen} setIsOpen={setToolsOpen} />
      </div>
      {open && (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '8px', 
          marginTop: '12px', 
          background: '#ffffff', 
          padding: '16px', 
          borderRadius: '12px', 
          border: '1px solid var(--border)' 
        }} className="mobile-drawer">
          <div style={{ fontWeight: 600, color: 'var(--plum)', padding: '8px 0' }}>{lang === 'en' ? 'Learn' : 'सीखें'}</div>
          {learnItems.map(item => (
            <Link key={item.to} to={item.to} onClick={() => setOpen(false)} style={{ padding: '12px 0', color: isActive(item.to) ? 'var(--plum)' : 'var(--charcoal)', textDecoration: 'none', fontWeight: isActive(item.to) ? 600 : 400 }}>{item.label}</Link>
          ))}
          <div style={{ fontWeight: 600, color: 'var(--plum)', padding: '8px 0', marginTop: '8px' }}>{lang === 'en' ? 'Track' : 'ट्रैक करें'}</div>
          {trackItems.map(item => (
            <Link key={item.to} to={item.to} onClick={() => setOpen(false)} style={{ padding: '12px 0', color: isActive(item.to) ? 'var(--plum)' : 'var(--charcoal)', textDecoration: 'none', fontWeight: isActive(item.to) ? 600 : 400 }}>{item.label}</Link>
          ))}
          <div style={{ fontWeight: 600, color: 'var(--plum)', padding: '8px 0', marginTop: '8px' }}>{lang === 'en' ? 'Tools' : 'टूल्स'}</div>
          {toolsItems.map(item => (
            <Link key={item.to} to={item.to} onClick={() => setOpen(false)} style={{ padding: '12px 0', color: isActive(item.to) ? 'var(--plum)' : 'var(--charcoal)', textDecoration: 'none', fontWeight: isActive(item.to) ? 600 : 400 }}>{item.label}</Link>
          ))}
        </div>
      )}
      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 901px) {
          .mobile-drawer { display: none !important; }
        }
      `}</style>
    </nav>
  );
}

export default function AppRoutes() {
  return (
    <Layout>
      <Nav />
      <ErrorBoundary><Routes>
        <Route path="/" element={<Home />} />
        <Route path="/journey" element={<PrivateHealthJourney />} />
        <Route path="/diary" element={<HealthDiary />} />
        <Route path="/sikho" element={<HealthSikho />} />
        <Route path="/safe" element={<SafeNextSteps />} />
        <Route path="/breast" element={<BreastHealth />} />
        <Route path="/pcos" element={<PCOSCheck />} />
        <Route path="/brief" element={<DoctorBrief />} />
        <Route path="/report" element={<ReportSamjho />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/voice" element={<VoiceCard />} />
        <Route path="/insights" element={<Insights />} />
      </Routes></ErrorBoundary>
    </Layout>
  );
}
