import React from 'react';
import { useLanguage } from '../App';
import { translations } from '../i18n';
import Logo from './Logo';

export default function Layout({ children }) {
  const { lang, toggleLang } = useLanguage();
  const t = translations[lang];

  return (
    <div className="min-h-screen" style={{ background: 'var(--offwhite)' }}>
      <header style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 50, 
        background: 'var(--offwhite)', 
        borderBottom: '1px solid var(--border)', 
        boxShadow: '0 1px 3px rgba(111,49,95,0.04)' 
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Logo />
          <button
            onClick={toggleLang}
            aria-label={t.language}
            style={{
              display: 'flex',
              alignItems: 'center',
              borderRadius: '9999px',
              overflow: 'hidden',
              border: '1px solid rgba(111,49,95,0.25)',
              minHeight: '44px',
              minWidth: '100px',
              background: '#fff',
              cursor: 'pointer'
            }}
          >
            <span style={{ 
              flex: 1, 
              padding: '8px 16px', 
              textAlign: 'center', 
              fontWeight: 600,
              background: lang === 'en' ? 'var(--plum)' : 'transparent',
              color: lang === 'en' ? '#ffffff' : 'var(--plum)'
            }}>EN</span>
            <span style={{ 
              flex: 1, 
              padding: '8px 16px', 
              textAlign: 'center', 
              fontWeight: 600,
              background: lang === 'hi' ? 'var(--plum)' : 'transparent',
              color: lang === 'hi' ? '#ffffff' : 'var(--plum)'
            }}>हिंदी</span>
          </button>
        </div>
      </header>
      
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 16px' }}>
        {children}
      </main>
      
      <footer style={{ marginTop: '64px', padding: '32px 0', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 16px', textAlign: 'center' }}>
          <p style={{ color: 'var(--plum)', fontWeight: 700, fontSize: '18px', margin: '0 0 8px 0' }}>SakhiCare</p>
          <p style={{ color: 'rgba(45,38,48,0.7)', fontSize: '14px', margin: 0 }}>{lang === 'en' ? 'A private bilingual women\'s health companion' : 'एक निजी द्विभाषी महिला स्वास्थ्य साथी'}</p>
        </div>
      </footer>
      
      <div style={{ margin: '0 16px 16px 16px' }}>
        <div className="notice" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="var(--plum)" strokeWidth="2"/>
            <path d="M12 16v-4M12 8h.01" stroke="var(--plum)" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <p style={{ margin: 0, fontSize: '14px' }}>{lang === 'hi' ? 'यह जानकारी के लिए है, निदान नहीं। डॉक्टर से जरूर मिलें।' : 'This information is for awareness only, not a diagnosis. Please consult a doctor.'}</p>
        </div>
      </div>
    </div>
  );
}
