import React from 'react';
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
    <nav className="bg-white shadow-md p-2 overflow-x-auto">
      <div className="max-w-4xl mx-auto flex gap-2 flex-wrap">
        {links.map(link => (
          <Link 
            key={link.to} 
            to={link.to} 
            className="px-3 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition text-sm font-medium"
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
