import React from 'react';
import { useLanguage } from '../App';
import { translations } from '../i18n';

export default function Layout({ children }) {
  const { lang, toggleLang } = useLanguage();
  const t = translations[lang];

  return (
    <div className="min-h-screen bg-bg pb-20">
      <header className="bg-gradient-to-r from-primary to-accent text-white p-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">🌸 {t.appName}</h1>
          <button
            onClick={toggleLang}
            className="bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition text-lg"
          >
            {lang === 'en' ? 'हिंदी' : 'English'}
          </button>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto p-4">
        {children}
      </main>
      
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-primary/30 p-3 text-center text-sm">
        <p className="text-red-600 font-semibold">{t.disclaimerHindi}</p>
      </div>
    </div>
  );
}
