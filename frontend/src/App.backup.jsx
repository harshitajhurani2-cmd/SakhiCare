import React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { safeStorage } from './utils/storage';

const LanguageContext = createContext();

export function useLanguage() {
  return useContext(LanguageContext);
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const saved = safeStorage.getItem('sakhi_lang');
    if (saved) return saved;
    const browser = navigator.language?.startsWith('hi') ? 'hi' : 'en';
    safeStorage.setItem('sakhi_lang', browser);
    return browser;
  });

  useEffect(() => {
    document.documentElement.lang = lang;
    safeStorage.setItem('sakhi_lang', lang);
  }, [lang]);

  const toggleLang = () => {
    const newLang = lang === 'en' ? 'hi' : lang === 'hi' ? 'hinglish' : 'en';
    setLang(newLang);
  };

  const setLanguage = (l) => {
    if (['en', 'hi', 'hinglish'].includes(l)) {
      setLang(l);
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export { LanguageContext };
