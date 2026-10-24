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
  const [learnOpen, setLearnOpen] = useState(false);
  const [trackOpen, setTrackOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  const Dropdown = ({ title, items, isOpen, setIsOpen }) => (
    <div className="relative" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <button className="px-4 py-2 text-charcoal hover:text-plum font-medium flex items-center gap-1 min-h-[44px]" onClick={() => setIsOpen(!isOpen)}>
        {title} <span className="text-xs">▼</span>
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 bg-white shadow-lg rounded-xl border py-2 min-w-[200px] z-50" style={{borderColor: 'rgba(111,49,95,0.15)'}}>
          {items.map(item => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => {setIsOpen(false); setOpen(false);}}
              className={(isActive(item.to) ? 'text-plum font-semibold' : 'text-charcoal') + ' block px-4 py-2 hover:bg-blush hover:text-plum transition-colors'}
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
  ];
  const trackItems = [
    { to: '/diary', label: t.healthDiary },
    { to: '/journey', label: t.privateJourney },
  ];
  const toolsItems = [
    { to: '/pcos', label: t.pcosCheck },
    { to: '/breast', label: t.breastHealth },
    { to: '/report', label: t.reportSamjho },
    { to: '/safe', label: t.safeNextSteps },
  ];
  
  return (
    <nav className="mb-8">
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden w-full py-3 px-4 text-left text-plum font-semibold flex justify-between items-center bg-white rounded-xl border min-h-[44px]"
        style={{borderColor: 'rgba(111,49,95,0.15)'}}
        aria-label={lang === 'en' ? 'Menu' : 'मेन्यू'}
      >
        <span>{lang === 'en' ? 'Menu' : 'मेन्यू'}</span>
        <span>{open ? '▲' : '▼'}</span>
      </button>
      <div className={(open ? 'flex' : 'hidden') + ' md:flex items-center gap-4 mt-4'}>
        <Dropdown title={lang === 'en' ? 'Learn' : 'सीखें'} items={learnItems} isOpen={learnOpen} setIsOpen={setLearnOpen} />
        <Dropdown title={lang === 'en' ? 'Track' : 'ट्रैक करें'} items={trackItems} isOpen={trackOpen} setIsOpen={setTrackOpen} />
        <Dropdown title={lang === 'en' ? 'Tools' : 'टूल्स'} items={toolsItems} isOpen={toolsOpen} setIsOpen={setToolsOpen} />
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
