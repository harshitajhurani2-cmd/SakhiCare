import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../App';
import { translations } from '../i18n';
import { breastPredict, breastReference } from '../api';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';
import './breast.css';

const FEATURE_NAMES = [
  "mean radius", "mean texture", "mean perimeter", "mean area", "mean smoothness",
  "mean compactness", "mean concavity", "mean concave points", "mean symmetry", "mean fractal dimension",
  "radius error", "texture error", "perimeter error", "area error", "smoothness error",
  "compactness error", "concavity error", "concave points error", "symmetry error", "fractal dimension error",
  "worst radius", "worst texture", "worst perimeter", "worst area", "worst smoothness",
  "worst compactness", "worst concavity", "worst concave points", "worst symmetry", "worst fractal dimension"
];

export default function BreastHealth() {
  const { lang } = useLanguage();
  const t = translations[lang];
  
  const [refData, setRefData] = useState([]);
  const [values, setValues] = useState(Array(30).fill(0));
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [errorType, setErrorType] = useState(null);
  const [errorDetail, setErrorDetail] = useState(null);
  const [debounceTimer, setDebounceTimer] = useState(null);
  
  useEffect(() => {
    loadReference();
  }, []);
  
  const loadReference = async () => {
    try {
      const ref = await breastReference();
      setRefData(ref);
      if (ref.length === 30) {
        const initial = ref.map(r => r.mean_all || 0);
        setValues(initial);
      }
    } catch (err) {
      if (err.code === 'OFFLINE') {
        setErrorType('OFFLINE');
        setError(t.offlineMsgBreast || t.offlineMsg || 'Cannot reach backend');
      } else if (err.code === 'SERVER') {
        setErrorType('SERVER');
        setError(err.message);
        setErrorDetail(err.body);
      }
    }
  };
  
  const handleSliderChange = (idx, val) => {
    const newValues = [...values];
    newValues[idx] = parseFloat(val);
    setValues(newValues);
    
    if (debounceTimer) clearTimeout(debounceTimer);
    const timer = setTimeout(() => {
      predict(newValues);
    }, 400);
    setDebounceTimer(timer);
  };
  
  const predict = async (vals) => {
    setLoading(true);
    setError(null);
    setErrorType(null);
    setErrorDetail(null);
    try {
      const res = await breastPredict(vals);
      setResult(res);
      try {
        let band = '';
        if (res.malignant_probability >= 0.9) band = 'strong';
        else if (res.malignant_probability >= 0.1) band = 'uncertain';
        else band = 'benign';
        localStorage.setItem('breast_last', JSON.stringify({
          band,
          prob: res.malignant_probability,
          inputs: vals,
          timestamp: new Date().toISOString()
        }));
      } catch {}
    } catch (err) {
      if (err.code === 'OFFLINE') {
        setErrorType('OFFLINE');
        setError(t.offlineMsgBreast || t.offlineMsg || 'Cannot reach backend');
      } else if (err.code === 'SERVER') {
        setErrorType('SERVER');
        setError(err.message);
        setErrorDetail(err.body);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const loadSample = (type) => {
    if (refData.length !== 30) return;
    const newValues = refData.map(r => {
      if (type === 'benign') return r.mean_benign;
      if (type === 'malignant') return r.mean_malignant;
      if (type === 'avg') return r.mean_all;
      return r.mean_all;
    });
    setValues(newValues);
    predict(newValues);
  };
  
  const getBand = () => {
    if (!result) return null;
    const p = result.malignant_probability;
    if (p >= 0.9) return { class: 'breast-risk strong', label: t.breastStrongMalig || 'Strong malignant-like pattern. See a doctor soon.', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#8A1F3D" strokeWidth="2"/><path d="M12 8v4M12 16h.01" stroke="#8A1F3D" strokeWidth="2" strokeLinecap="round"/></svg>
    )};
    if (p >= 0.1 && p <= 0.9) return { class: 'breast-risk uncertain', label: t.breastUncertain || 'Uncertain pattern. Medical evaluation is needed.', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#7A4B00" strokeWidth="2"/><path d="M12 8v4M12 16h.01" stroke="#7A4B00" strokeWidth="2" strokeLinecap="round"/></svg>
    )};
    return { class: 'breast-risk benign', label: t.breastBenignLike || 'Benign-like pattern. Still confirm with a doctor.', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#1F5D3A" strokeWidth="2"/><path d="M9 12l2 2 4-4" stroke="#1F5D3A" strokeWidth="2" strokeLinecap="round"/></svg>
    )};
  };
  
  const band = getBand();
  
  const meanIndices = [0,1,2,3,4,5,6,7,8,9];
  const radarData = meanIndices.map(i => {
    const ref = refData[i] || { min: 0, max: 1, mean_benign: 0, mean_malignant: 1 };
    const norm = (v) => ref.max === ref.min ? 0.5 : (v - ref.min) / (ref.max - ref.min);
    return {
      feature: FEATURE_NAMES[i].replace('mean ', ''),
      current: norm(values[i]),
      benign: norm(ref.mean_benign),
      malignant: norm(ref.mean_malignant)
    };
  });
  
  const groups = [
    { title: t.breastGroupMean || 'Mean', indices: [0,1,2,3,4,5,6,7,8,9] },
    { title: t.breastGroupSE || 'Standard error', indices: [10,11,12,13,14,15,16,17,18,19] },
    { title: t.breastGroupWorst || 'Worst', indices: [20,21,22,23,24,25,26,27,28,29] }
  ];
  
  return (
    <div className="breast-page">
      <h1 className="breast-title">{t.breastTitle || (lang === 'hi' ? 'स्तन स्वास्थ्य' : 'Breast Health')}</h1>
      
      <section className="breast-section">
        <h2>{t.breastAwareness || (lang === 'hi' ? 'जागरूकता' : 'Awareness')}</h2>
        <p>{t.breastAwarenessText || (lang === 'hi' ? 'अपने शरीर को जानें। अपने स्तनों का सामान्य रूप और एहसास जानने से आप बदलाव जल्दी पहचान सकते हैं।' : 'Know your body. Being familiar with how your breasts normally look and feel helps you notice changes early.')}</p>
        <h3>{t.breastWatchFor || (lang === 'hi' ? 'डॉक्टर से कब मिलें' : 'When to see a doctor')}</h3>
        <ul>
          {(t.breastSigns || []).map((s, i) => <li key={i}>{s}</li>)}
        </ul>
      </section>
      
      <section className="breast-section">
        <h2>{t.breastDemoTitle || (lang === 'hi' ? 'स्क्रीनिंग डेमो (शिक्षात्मक)' : 'Screening demo (educational)')}</h2>
        <div className="breast-note">
          <p style={{ margin: 0 }}>{t.breastDemoNote || (lang === 'hi' ? '30 इनपुट सुई एस्पिरेट (FNA) लैब रिपोर्ट के कंप्यूटर छवि विश्लेषण से आते हैं, इसलिए घर पर इन्हें मापना संभव नहीं है।' : 'The 30 inputs come from computer image analysis of a needle aspirate (FNA) lab report, so nobody can measure them at home.')}</p>
        </div>
        
        <div className="breast-actions">
          <button className="breast-btn-plum" onClick={() => loadSample('benign')}>{t.breastLoadBenign || (lang === 'hi' ? 'सामान्य सौम्य नमूना लोड करें' : 'Load typical benign sample')}</button>
          <button className="breast-btn-plum" onClick={() => loadSample('malignant')}>{t.breastLoadMalignant || (lang === 'hi' ? 'सामान्य घातक नमूना लोड करें' : 'Load typical malignant sample')}</button>
          <button className="breast-btn-outline" onClick={() => loadSample('avg')}>{t.breastLoadAvg || (lang === 'hi' ? 'औसत नमूना लोड करें' : 'Load average sample')}</button>
        </div>
        
        <div className="breast-groups">
          {groups.map((g, gi) => (
            <div key={gi}>
              <div className="breast-group-title">{g.title}</div>
              {g.indices.map(idx => {
                const ref = refData[idx] || { min: 0, max: 1 };
                return (
                  <div className="breast-slider-row" key={idx}>
                    <div className="breast-slider-name">{FEATURE_NAMES[idx]}</div>
                    <input
                      type="range"
                      className="breast-slider"
                      min={ref.min}
                      max={ref.max}
                      step={(ref.max - ref.min) / 1000}
                      value={values[idx]}
                      onChange={(e) => handleSliderChange(idx, e.target.value)}
                    />
                    <div className="breast-slider-value">{values[idx].toFixed(3)}</div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        
        {loading && <p style={{ color: '#6F315F', marginTop: '12px' }}>...</p>}
        
        {error && (
          <div className="breast-error">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span>{error}</span>
              {errorType === 'OFFLINE' && (
                <button type="button" className="breast-btn-retry" onClick={() => loadReference()}>{t.retry || (lang === 'hi' ? 'पुनः प्रयास करें' : 'Retry')}</button>
              )}
            </div>
            {errorType === 'SERVER' && errorDetail && (
              <details className="breast-details">
                <summary>{lang === 'hi' ? 'विवरण' : 'Details'}</summary>
                <pre style={{ whiteSpace: 'pre-wrap', margin: '8px 0 0 0' }}>{errorDetail}</pre>
              </details>
            )}
          </div>
        )}
        
        {band && (
          <div className={band.class}>
            {band.icon}
            <div className="breast-risk-text">
              <div className="breast-risk-label">{band.label}</div>
              <div className="breast-risk-sub">{t.breastPatternMatch || (lang === 'hi' ? 'पैटर्न मिलान' : 'Pattern match')}</div>
            </div>
          </div>
        )}
        
        <h3>{t.breastRadarTitle || (lang === 'hi' ? 'मीन विशेषताएँ तुलना (सामान्यीकृत)' : 'Mean features comparison (normalized)')}</h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="feature" tick={{ fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 1]} />
              <Radar name={lang === 'hi' ? 'वर्तमान' : 'Current'} dataKey="current" stroke="#6F315F" fill="#6F315F" fillOpacity={0.3} />
              <Radar name={lang === 'hi' ? 'सामान्य सौम्य' : 'Typical benign'} dataKey="benign" stroke="#D95C91" fill="#D95C91" fillOpacity={0.2} />
              <Radar name={lang === 'hi' ? 'सामान्य घातक' : 'Typical malignant'} dataKey="malignant" stroke="#B79AC9" fill="#B79AC9" fillOpacity={0.2} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </section>
      
      <section className="breast-section">
        <h2>{t.breastLimitations || (lang === 'hi' ? 'सीमाएँ' : 'Limitations')}</h2>
        <p>{t.breastLimitationsText || (lang === 'hi' ? '569 WDBC नमूने, केवल स्क्रीनिंग सहायता, निदान नहीं, नैदानिक परीक्षा का विकल्प नहीं।' : '569 WDBC samples, screening support only, not a diagnosis, cannot replace a clinical examination.')}</p>
      </section>
      
      <div className="breast-notice">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="#6F315F" strokeWidth="2"/>
          <path d="M12 16v-4M12 8h.01" stroke="#6F315F" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <span>{t.disclaimer || (lang === 'hi' ? 'यह जानकारी केवल मार्गदर्शन के लिए है, निदान नहीं। कृपया डॉक्टर से परामर्श करें।' : 'This information is for guidance only, not a diagnosis. Please consult a doctor.')}</span>
      </div>
    </div>
  );
}
