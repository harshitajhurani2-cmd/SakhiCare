import React from 'react';
import { useLanguage } from '../App';
import { translations } from '../i18n';

function ComingSoon({ title }) {
  const { lang } = useLanguage();
  const t = translations[lang];
  
  return (
    <div className="py-6">
      <h2 className="text-2xl font-bold text-primary mb-4">{title}</h2>
      <div className="bg-white p-12 rounded-xl shadow-lg text-center">
        <p className="text-3xl mb-4">🚧</p>
        <p className="text-xl text-gray-600 mb-4">{t.comingSoon}</p>
      </div>
      <p className="mt-6 text-center text-red-600 font-semibold">{t.disclaimerHindi}</p>
    </div>
  );
}

export default function PCOSCheck() {
  const { lang } = useLanguage();
  return <ComingSoon title={lang === 'en' ? 'PCOS Check' : 'पीसीओएस जांच'} />;
}
