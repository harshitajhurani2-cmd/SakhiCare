import React, { useState, useEffect } from 'react';
import { useLanguage } from '../App';
import { translations } from '../i18n';
import { Link } from 'react-router-dom';
import './brief.css';

export default function DoctorBrief() {
  const { lang } = useLanguage();
  const t = translations[lang];
  
  const [diary, setDiary] = useState([]);
  const [journey, setJourney] = useState(null);
  const [pcos, setPcos] = useState(null);
  const [breast, setBreast] = useState(null);
  
  useEffect(() => {
    try {
      const d = localStorage.getItem('sakhi_diary');
      if (d) setDiary(JSON.parse(d));
    } catch {}
    try {
      const j = localStorage.getItem('sakhi_journey');
      if (j) setJourney(JSON.parse(j));
    } catch {}
    try {
      const p = localStorage.getItem('pcos_last');
      if (p) setPcos(JSON.parse(p));
    } catch {}
    try {
      const b = localStorage.getItem('breast_last');
      if (b) setBreast(JSON.parse(b));
    } catch {}
  }, []);
  
  const [voice, setVoice] = useState([]);
  const [report, setReport] = useState(null);
  useEffect(() => {
    try { const v = localStorage.getItem('sakhi_voice_diary'); if (v) setVoice(JSON.parse(v)); } catch {}
    try { const r = localStorage.getItem('report_last'); if (r) setReport(JSON.parse(r)); } catch {}
  }, []);

  const handlePrint = () => {
    window.print();
  };
  
  const getAvgPain = () => {
    if (diary.length === 0) return null;
    const sum = diary.reduce((acc, e) => acc + (parseInt(e.pain) || 0), 0);
    return (sum / diary.length).toFixed(1);
  };
  
  const getBleedingPattern = () => {
    if (diary.length === 0) return null;
    const patterns = diary.map(e => e.bleeding).filter(Boolean);
    return patterns.join(', ');
  };
  
  const getSymptoms = () => {
    if (diary.length === 0) return null;
    const syms = diary.map(e => e.symptoms).filter(Boolean);
    return syms.join('; ');
  };
  
  const getCycleDates = () => {
    if (diary.length === 0) return null;
    return diary.map(e => e.startDate + (e.endDate ? ' to ' + e.endDate : '')).join(', ');
  };
  
  const avgPain = getAvgPain();
  const bleeding = getBleedingPattern();
  const symptoms = getSymptoms();
  const cycleDates = getCycleDates();
  
  const questions = [];
  if (pcos && pcos.band) {
    questions.push(lang === 'hi' ? 'क्या ये लक्षण PCOS से संबंधित हो सकते हैं?' : 'Could these symptoms be related to PCOS?');
  }
  if (breast && breast.band) {
    questions.push(lang === 'hi' ? 'क्या मुझे स्तन जांच की जरूरत है?' : 'Do I need a breast examination?');
  }
  if (diary.length > 0 && parseFloat(avgPain) > 6) {
    questions.push(lang === 'hi' ? 'गंभीर दर्द का कारण क्या हो सकता है?' : 'What could be causing the severe pain?');
  }
  questions.push(lang === 'hi' ? 'क्या मुझे किसी परीक्षण की जरूरत है?' : 'Do I need any tests?');
  questions.push(lang === 'hi' ? 'आगे क्या देखभाल की आवश्यकता है?' : 'What follow-up care is needed?');
  
  const dateStr = new Date().toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US');
  
  return (
    <div className="brief-page">
      <div className="brief-header">
        <h1 className="brief-title">{t.briefTitle || (lang === 'hi' ? 'डॉक्टर ब्रीफ' : 'Doctor Brief')}</h1>
        <div>
          <button className="brief-btn" onClick={handlePrint}>
            {t.downloadPdf || (lang === 'hi' ? 'डाउनलोड / प्रिंट पीडीएफ' : 'Download / Print PDF')}
          </button>
          <span className="brief-hint">{t.printHint || (lang === 'hi' ? 'पीडीएफ के रूप में सहेजें चुनें' : 'choose Save as PDF')}</span>
        </div>
      </div>
      
      <div className="brief-card">
        <div className="brief-card-header">
          <div className="brief-logo">SakhiCare</div>
          <div>
            <strong>{t.briefDate || (lang === 'hi' ? 'तारीख' : 'Date')}:</strong> {dateStr}
          </div>
        </div>
        
        <section className="brief-section">
          <h2 className="brief-section-title">{t.patientSymptoms || (lang === 'hi' ? 'रोगी द्वारा रिपोर्ट किए गए लक्षण और डायरी सारांश' : 'Patient-reported symptoms and diary summary')}</h2>
          {diary.length === 0 ? (
            <div className="brief-empty">
              <span>{t.noData || (lang === 'hi' ? 'कोई डेटा नहीं' : 'No data yet')}</span>
              <Link to="/diary">{t.goToPage || (lang === 'hi' ? 'पृष्ठ पर जाएं' : 'Go to page')}</Link>
            </div>
          ) : (
            <>
              {cycleDates && <p><strong>{t.cycleDates || (lang === 'hi' ? 'चक्र तिथियां' : 'Cycle dates')}:</strong> {cycleDates}</p>}
              {avgPain !== null && <p><strong>{t.avgPain || (lang === 'hi' ? 'औसत दर्द' : 'Average pain')}:</strong> {avgPain}/10</p>}
              {bleeding && <p><strong>{t.bleedingPattern || (lang === 'hi' ? 'रक्तस्राव पैटर्न' : 'Bleeding pattern')}:</strong> {bleeding}</p>}
              {symptoms && <p><strong>{t.symptomsListed || (lang === 'hi' ? 'सूचीबद्ध लक्षण' : 'Symptoms listed')}:</strong> {symptoms}</p>}
            </>
          )}
        </section>
        
        <section className="brief-section">
          <h2 className="brief-section-title">{t.journeyAnswers || (lang === 'hi' ? 'यात्रा उत्तर' : 'Journey answers')}</h2>
          {!journey ? (
            <div className="brief-empty">
              <span>{t.noData || (lang === 'hi' ? 'कोई डेटा नहीं' : 'No data yet')}</span>
              <Link to="/journey">{t.goToPage || (lang === 'hi' ? 'पृष्ठ पर जाएं' : 'Go to page')}</Link>
            </div>
          ) : (
            <>
              {journey.concern && <p><strong>{t.concern || (lang === 'hi' ? 'चिंता' : 'Concern')}:</strong> {journey.concern}</p>}
              {journey.answers && <p><strong>{t.answers || (lang === 'hi' ? 'उत्तर' : 'Answers')}:</strong> {journey.answers}</p>}
            </>
          )}
        </section>
        
        <section className="brief-section">
          <h2 className="brief-section-title">{t.pcosPattern || (lang === 'hi' ? 'पीसीओएस पैटर्न संकेत' : 'PCOS pattern flag')}</h2>
          {!pcos ? (
            <div className="brief-empty">
              <span>{t.noData || (lang === 'hi' ? 'कोई डेटा नहीं' : 'No data yet')}</span>
              <Link to="/pcos">{t.goToPage || (lang === 'hi' ? 'पृष्ठ पर जाएं' : 'Go to page')}</Link>
            </div>
          ) : (
            <>
              {pcos.band && <p><strong>{t.patternFlagText || (lang === 'hi' ? 'पैटर्न संकेत' : 'pattern flag')}:</strong> {pcos.band}</p>}
              {pcos.factors && pcos.factors.length > 0 && <p><strong>{t.factors || (lang === 'hi' ? 'संभावित योगदान कारक' : 'Possible contributing factors')}:</strong> {pcos.factors.join(', ')}</p>}
            </>
          )}
        </section>
        
        <section className="brief-section">
          <h2 className="brief-section-title">{t.breastDemo || (lang === 'hi' ? 'स्तन स्क्रीनिंग डेमो' : 'Breast screening demo')}</h2>
          {!breast ? (
            <div className="brief-empty">
              <span>{t.noData || (lang === 'hi' ? 'कोई डेटा नहीं' : 'No data yet')}</span>
              <Link to="/breast">{t.goToPage || (lang === 'hi' ? 'पृष्ठ पर जाएं' : 'Go to page')}</Link>
            </div>
          ) : (
            <>
              <p><em>{t.educationalDemo || (lang === 'hi' ? 'शिक्षात्मक डेमो, नैदानिक परिणाम नहीं' : 'Educational demo, not a clinical result')}</em></p>
              {breast.band && <p><strong>{t.patternFlagText || (lang === 'hi' ? 'पैटर्न संकेत' : 'pattern flag')}:</strong> {breast.band}</p>}
            </>
          )}
        </section>
        
        <section className="brief-section">
          <h2 className="brief-section-title">{t.suggestedQuestions || (lang === 'hi' ? 'डॉक्टर से पूछने के लिए सुझावित प्रश्न' : 'Suggested questions for the doctor')}</h2>
          <ul>
            {questions.map((q, i) => <li key={i}>{q}</li>)} {((voice[0] && voice[0].doctor_questions) || []).map((q, i) => <li key={'v' + i}>{q}</li>)}
          </ul>
        </section>
        
        {report && report.tests && report.tests.length > 0 && (<section className="brief-section"><h2 className="brief-section-title">Report values ({String(report.report_type || "").toUpperCase()})</h2>{report.tests.map((x, i) => (<p key={i}><strong>{x.name}:</strong> {x.value} {x.unit} (range {x.reference_range}) - {x.flag}</p>))}</section>)} {voice.length > 0 && (<section className="brief-section"><h2 className="brief-section-title">Problems told by voice</h2>{voice.slice(0, 3).map((v, i) => (<div key={i}><p><strong>{String(v.date || "").slice(0, 10)}:</strong> {v.summary}</p>{v.symptoms && v.symptoms.length > 0 && <p>Symptoms: {v.symptoms.join(", ")}</p>}{v.since && <p>Since: {v.since}</p>}{v.pain !== null && v.pain !== undefined && <p>Pain: {v.pain}/10</p>}</div>))}</section>)} <div className="brief-limitations">
          <h3>{t.limitations || (lang === 'hi' ? 'सीमाएँ' : 'Limitations')}</h3>
          <p>{lang === 'hi' ? 'यह ब्रीफ केवल आपके द्वारा प्रदान किए गए डेटा पर आधारित है। यह निदान नहीं है।' : 'This brief is based only on data you provided. It is not a diagnosis.'}</p>
        </div>
        
        <div className="brief-note">
          <p style={{ margin: 0 }}>{t.disclaimer || (lang === 'hi' ? 'यह जानकारी केवल मार्गदर्शन के लिए है, निदान नहीं। कृपया डॉक्टर से परामर्श करें।' : 'This information is for guidance only, not a diagnosis. Please consult a doctor.')}</p>
        </div>
      </div>
    </div>
  );
}
