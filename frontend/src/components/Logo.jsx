import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 group transition-transform hover:scale-105 focus:outline focus:outline-2 focus:outline-rose focus:outline-offset-2" aria-label="SakhiCare Home">
      <svg width="40" height="40" viewBox="0 0 40 40" className="flex-shrink-0">
        <circle cx="20" cy="20" r="18" fill="#F7E8F0" opacity="0.6"/>
        <path d="M20 8 C16 12, 12 16, 12 20 C12 26, 16 30, 20 30 C24 30, 28 26, 28 20 C28 16, 24 12, 20 8 Z" fill="#6F315F" opacity="0.9"/>
        <path d="M20 12 C18 14, 16 16, 16 18 C16 21, 18 23, 20 23 C22 23, 24 21, 24 18 C24 16, 22 14, 20 12 Z" fill="#D95C91" opacity="0.7"/>
        <circle cx="20" cy="18" r="3" fill="#FFFFFF"/>
        <path d="M18 26 Q20 28 22 26" stroke="#D95C91" strokeWidth="2" fill="none" strokeLinecap="round"/>
      </svg>
      <div className="flex items-baseline">
        <span className="text-plum text-2xl md:text-[1.7rem] font-bold tracking-tight">Sakhi</span>
        <span className="text-rose text-2xl md:text-[1.7rem] font-bold tracking-tight">Care</span>
        <span className="w-1 h-1 bg-rose rounded-full ml-1 mb-1"></span>
      </div>
    </Link>
  );
}
