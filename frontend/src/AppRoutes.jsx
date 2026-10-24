import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
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
  
  const links = [
    { to: '/', label: t.home },
    { to: '/journey', label: t.privateJourney },
    { to: '/diary', label: t.healthDiary },
    { to: '/sikho', label: t.healthSikho },
    { to: '/safe', label: t.safeNextSteps },
    { to: '/breast', label: t.breastHealth },
    { to: '/pcos', label: t.pcosCheck },
    { to: '/report', label: t.reportSamjho },
    { to: '/chatbot', label: t.chatbot },
  ];
  
  return (
    <nav className="bg-white shadow-md mb-4">
      <div className="max-w-6xl mx-auto px-4">
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden w-full py-3 text-left text-primary font-semibold flex justify-between items-center"
          aria-label={lang === 'en' ? 'Menu' : 'मेन्यू'}
        >
          <span>{lang === 'en' ? 'Menu' : 'मेन्यू'}</span>
          <span>{open ? '▲' : '▼'}</span>
        </button>
        <div className={(open ? 'flex' : 'hidden') + ' md:flex flex-col md:flex-row gap-2 py-2 overflow-x-auto'}>
          {links.map(link => (
            <Link 
              key={link.to} 
              to={link.to} 
              onClick={() => setOpen(false)}
              className="px-3 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition text-sm md:text-base font-medium whitespace-nowrap focus:outline focus:outline-2 focus:outline-primary"
            >
              {link.label}
            </Link>
          ))}
        </div>
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
