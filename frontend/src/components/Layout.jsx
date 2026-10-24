import React from 'react';
import { useLanguage } from '../App';
import { translations } from '../i18n';
import Logo from './Logo';

export default function Layout({ children }) {
  const { lang, toggleLang } = useLanguage();
  const t = translations[lang];

  return (
    <div className="min-h-screen bg-offwhite">
      <header className="sticky top-0 z-50 bg-offwhite border-b shadow-sm" style={{borderColor: 'rgba(111,49,95,0.12)'}}>
        <div className="max-w-[1100px] mx-auto px-4 py-3 flex items-center justify-between">
          <Logo />
          <button
            onClick={toggleLang}
            aria-label={t.language}
            className="flex items-center rounded-full overflow-hidden border min-h-[44px] min-w-[100px]"
            style={{borderColor: 'rgba(111,49,95,0.25)'}}
          >
            <span className={(lang === 'en' ? 'bg-plum text-white' : 'text-plum bg-transparent') + ' flex-1 px-4 py-2 text-center font-semibold'}>EN</span>
            <span className={(lang === 'hi' ? 'bg-plum text-white' : 'text-plum bg-transparent') + ' flex-1 px-4 py-2 text-center font-semibold'}>हिंदी</span>
          </button>
        </div>
      </header>
      
      <main className="max-w-[1100px] mx-auto px-4">
        {children}
      </main>
      
      <footer className="mt-16 py-8 border-t" style={{borderColor: 'rgba(111,49,95,0.15)'}}>
        <div className="max-w-[1100px] mx-auto px-4 text-center space-y-2">
          <p className="text-plum font-bold text-lg">SakhiCare</p>
          <p className="text-charcoal/70 text-sm">{lang === 'en' ? 'A private bilingual women\'s health companion' : 'एक निजी द्विभाषी महिला स्वास्थ्य साथी'}</p>
        </div>
      </footer>
      
      <div className="mx-4 mb-4">
        <div className="max-w-[1100px] mx-auto rounded-xl p-4 flex items-center gap-3" style={{backgroundColor: '#F7E8F0'}}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#6F315F" strokeWidth="2"/>
            <path d="M12 16v-4M12 8h.01" stroke="#6F315F" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <p className="text-plum text-sm">{t.disclaimerHindi}</p>
        </div>
      </div>
    </div>
  );
}
