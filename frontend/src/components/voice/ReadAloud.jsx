import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../App';
import { translations } from '../../i18n';

export default function ReadAloud({ text, lang: propLang }) {
  const { lang } = useLanguage();
  const currentLang = propLang || lang;
  const t = translations[currentLang];
  
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [rate, setRate] = useState(1);
  const [voices, setVoices] = useState([]);
  const [noVoice, setNoVoice] = useState(false);
  
  useEffect(() => {
    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      setVoices(v);
      const hasVoice = v.some(voice => voice.lang.startsWith(currentLang === 'hi' ? 'hi' : 'en'));
      setNoVoice(!hasVoice && v.length > 0);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, [currentLang]);
  
  const speak = () => {
    if (!('speechSynthesis' in window)) {
      alert(t.speechNotSupported);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentLang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = rate;
    const voice = voices.find(v => v.lang.startsWith(currentLang === 'hi' ? 'hi' : 'en'));
    if (voice) utterance.voice = voice;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => { setSpeaking(false); setPaused(false); };
    window.speechSynthesis.speak(utterance);
  };
  
  const pause = () => {
    window.speechSynthesis.pause();
    setPaused(true);
  };
  
  const resume = () => {
    window.speechSynthesis.resume();
    setPaused(false);
  };
  
  const stop = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setPaused(false);
  };
  
  return (
    <div className="flex flex-wrap items-center gap-2">
      {!speaking && <button onClick={speak} aria-label={t.readAloud} className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-pink-600 focus:outline focus:outline-2 focus:outline-primary">{t.readAloud}</button>}
      {speaking && !paused && <button onClick={pause} aria-label={t.pause} className="px-4 py-2 bg-primary text-white rounded-lg focus:outline focus:outline-2 focus:outline-primary">{t.pause}</button>}
      {paused && <button onClick={resume} aria-label={t.resume} className="px-4 py-2 bg-primary text-white rounded-lg focus:outline focus:outline-2 focus:outline-primary">{t.resume}</button>}
      {speaking && <button onClick={stop} aria-label={t.stop} className="px-4 py-2 bg-gray-500 text-white rounded-lg focus:outline focus:outline-2 focus:outline-primary">{t.stop}</button>}
      <select value={rate} onChange={(e) => setRate(parseFloat(e.target.value))} aria-label={t.speed} className="px-3 py-2 border-2 border-primary/30 rounded-lg">
        <option value="0.75">0.75x</option>
        <option value="1">1x</option>
        <option value="1.25">1.25x</option>
      </select>
      {noVoice && <span className="text-xs text-orange-600">{t.noVoice}</span>}
    </div>
  );
}
