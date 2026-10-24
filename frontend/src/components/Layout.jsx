import React from 'react';
import { useLanguage } from '../App';
import { translations } from '../i18n';

export default function Layout({ children }) {
  const { lang, toggleLang } = useLanguage();
  const t = translations[lang];

  return (
    <div className="min-h-screen bg-bg pb-20">
      <header className="bg-gradient-to-r from-primary to-accent text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌸</span>
            <h1 className="text-xl md:text-2xl font-bold whitespace-nowrap">{t.appName}</h1>
          </div>
          <button
            onClick={toggleLang}
            aria-label={t.language}
            className="bg-white text-primary px-4 py-2 rounded-lg hover:bg-gray-100 transition text-base md:text-lg font-semibold focus:outline focus:outline-2 focus:outline-white shadow-md min-w-[80px]"
          >
            {lang === 'en' ? 'हिंदी' : 'EN'}
          </button>
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto p-4">
        {children}
      </main>
      
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-primary/30 p-3 text-center text-sm z-40">
        <p className="text-red-600 font-semibold">{t.disclaimerHindi}</p>
      </div>
    </div>
  );
}
