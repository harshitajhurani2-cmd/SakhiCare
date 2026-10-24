import React from 'react';
import { useLanguage } from '../App';
import { translations } from '../i18n';
import Logo from './Logo';
import { useState, useEffect } from 'react';

export default function Layout({ children }) {
  const { lang, toggleLang } = useLanguage();
  const t = translations[lang];
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-offwhite pb-24">
      <header className={scrolled ? 'sticky top-0 z-50 transition-all duration-300 bg-offwhite/95 backdrop-blur-sm shadow-md border-b' : 'sticky top-0 z-50 transition-all duration-300 bg-offwhite border-b'} style={{borderColor: 'rgba(111,49,95,0.12)'}}>
        <div className="max-w-[1100px] mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <Logo />
          <div className="flex items-center gap-3">
            <button
              onClick={toggleLang}
              aria-label={t.language}
              className="flex items-center rounded-full border overflow-hidden transition-all duration-150 focus:outline focus:outline-2 focus:outline-rose focus:outline-offset-2 min-h-[44px]"
              style={{borderColor: 'rgba(111,49,95,0.2)'}}
            >
              <span className={(lang === 'en' ? 'bg-plum text-white' : 'bg-blush text-plum') + ' px-4 py-2 text-sm font-semibold transition-colors'}>EN</span>
              <span className={(lang === 'hi' ? 'bg-plum text-white' : 'bg-blush text-plum') + ' px-4 py-2 text-sm font-semibold transition-colors'}>हिंदी</span>
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-[1100px] mx-auto px-4">
        {children}
      </main>
      
      <footer className="mt-12 py-6 border-t" style={{borderColor: 'rgba(111,49,95,0.15)', backgroundColor: '#F7E8F0'}}>
        <div className="max-w-[1100px] mx-auto px-4 text-center space-y-2">
          <p className="text-plum font-semibold">SakhiCare</p>
          <p className="text-charcoal/70 text-sm">{lang === 'en' ? 'Your data stays on your device' : 'आपका डेटा आपके डिवाइस पर रहता है'}</p>
          <p className="text-plum text-sm">{t.disclaimerHindi}</p>
        </div>
      </footer>
    </div>
  );
}
