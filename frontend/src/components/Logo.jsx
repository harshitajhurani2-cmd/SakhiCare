import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'default' }} aria-label="SakhiCare">
      <svg width="40" height="40" viewBox="0 0 40 40" style={{ flexShrink: 0 }}>
        <circle cx="20" cy="20" r="18" fill="var(--blush)" opacity="0.8"/>
        <path d="M20 8 C16 12, 12 16, 12 20 C12 26, 16 30, 20 30 C24 30, 28 26, 28 20 C28 16, 24 12, 20 8 Z" fill="var(--plum)"/>
        <path d="M20 12 C18 14, 16 16, 16 18 C16 21, 18 23, 20 23 C22 23, 24 21, 24 18 C24 16, 22 14, 20 12 Z" fill="var(--rose)"/>
        <circle cx="20" cy="18" r="3" fill="#FFFFFF"/>
        <path d="M18 26 Q20 28 22 26" stroke="var(--rose)" strokeWidth="2" fill="none" strokeLinecap="round"/>
      </svg>
      <div style={{ display: 'flex', alignItems: 'baseline', letterSpacing: '-0.02em' }}>
        <span style={{ color: 'var(--plum)', fontSize: '1.7rem', fontWeight: 700 }}>Sakhi</span>
        <span style={{ color: 'var(--rose)', fontSize: '1.7rem', fontWeight: 700 }}>Care</span>
        <span style={{ width: '4px', height: '4px', background: 'var(--rose)', borderRadius: '50%', marginLeft: '4px', marginBottom: '2px' }}></span>
      </div>
    </div>
  );
}
