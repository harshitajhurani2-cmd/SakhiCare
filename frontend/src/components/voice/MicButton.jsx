import React, { useState } from 'react';
import { useLanguage } from '../../App';
import { translations } from '../../i18n';
import { safeStorage } from '../../utils/storage';

export default function MicButton({ onText, lang: propLang }) {
  const { lang } = useLanguage();
  const currentLang = propLang || lang;
  const t = translations[currentLang];
  
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [showNotice, setShowNotice] = useState(() => {
    return !safeStorage.getItem('sakhi_voice_notice_shown');
  });
  const [supported, setSupported] = useState(true);
  
  React.useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }
    const rec = new SpeechRecognition();
    rec.lang = currentLang === 'hi' ? 'hi-IN' : 'en-IN';
    rec.continuous = false;
    rec.interimResults = false;
    
    rec.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      if (onText) onText(text);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    setRecognition(rec);
  }, [currentLang]);
  
  const startListening = () => {
    if (!supported || !recognition) return;
    if (showNotice) {
      alert(t.voiceNotice);
      safeStorage.setItem('sakhi_voice_notice_shown', 'true');
      setShowNotice(false);
    }
    setTranscript('');
    setListening(true);
    recognition.start();
  };
  
  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
    setListening(false);
  };
  
  if (!supported) {
    return <span className="text-xs text-gray-500">{t.micNotSupported}</span>;
  }
  
  return (
    <div className="space-y-2">
      {!listening && <button onClick={startListening} aria-label={t.voiceInput} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primaryDark focus:outline focus:outline-2 focus:outline-primary">🎤 {t.voiceInput}</button>}
      {listening && <button onClick={stopListening} aria-label={t.stopListening} className="px-4 py-2 bg-red-500 text-white rounded-lg focus:outline focus:outline-2 focus:outline-primary">⏹ {t.stopListening}</button>}
      {listening && <p className="text-sm text-primary animate-pulse">{t.listening}</p>}
      {transcript && (
        <div>
          <textarea value={transcript} onChange={(e) => setTranscript(e.target.value)} className="w-full p-2 border-2 border-primary/30 rounded-lg" rows="2" aria-label={t.editText} />
          {onText && <button onClick={() => onText(transcript)} className="mt-1 px-3 py-1 bg-green-500 text-white rounded">{t.useText}</button>}
        </div>
      )}
    </div>
  );
}
