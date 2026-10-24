import React, { useState } from 'react';
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

function Nav() {
  const { lang } = useLanguage();
  const t = translations[lang];
  const [open, setOpen] = useState(false);
  const location = useLocation();
  
  const allLinks = [
    { to: '/sikho', label: t.healthSikho },
    { to: '/journey', label: t.privateJourney },
    { to: '/diary', label: t.healthDiary },
    { to: '/safe', label: t.safeNextSteps },
    { to: '/breast', label: t.breastHealth },
    { to: '/pcos', label: t.pcosCheck },
    { to: '/report', label: t.reportSamjho },
    { to: '/chatbot', label: t.chatbot },
  ];
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <nav className="mb-6">
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden w-full py-3 px-4 text-left text-plum font-semibold flex justify-between items-center bg-white rounded-xl border shadow-sm min-h-[44px]"
        style={{borderColor: 'rgba(111,49,95,0.15)'}}
        aria-label={lang === 'en' ? 'Menu' : 'मेन्यू'}
      >
        <span>{lang === 'en' ? 'Menu' : 'मेन्यू'}</span>
        <span>{open ? '▲' : '▼'}</span>
      </button>
      <div className={(open ? 'flex' : 'hidden') + ' md:flex flex-col md:flex-row md:flex-wrap gap-2 mt-3'}>
        {allLinks.map(link => (
          <Link 
            key={link.to} 
            to={link.to} 
            onClick={() => setOpen(false)}
            className={'px-4 py-2 rounded-full text-sm md:text-base font-medium transition-all duration-150 min-h-[44px] flex items-center whitespace-nowrap focus:outline focus:outline-2 focus:outline-rose focus:outline-offset-2 ' + (isActive(link.to) ? 'text-plum' : 'text-charcoal hover:bg-blush hover:text-plum')}
            style={isActive(link.to) ? {borderBottom: '2px solid #D95C91', borderRadius: '0'} : {}}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default function AppRoutes() {
  return (
    <Layout>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/journey" element={<PrivateHealthJourney />} />
        <Route path="/diary" element={<HealthDiary />} />
        <Route path="/sikho" element={<HealthSikho />} />
        <Route path="/safe" element={<SafeNextSteps />} />
        <Route path="/breast" element={<BreastHealth />} />
        <Route path="/pcos" element={<PCOSCheck />} />
        <Route path="/report" element={<ReportSamjho />} />
        <Route path="/chatbot" element={<Chatbot />} />
      </Routes>
    </Layout>
  );
}
