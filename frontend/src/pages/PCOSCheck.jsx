import React, { useState } from 'react';
import { useLanguage } from '../App';
import { translations } from '../i18n';
import { pcosPredict } from '../api';
import './pcos.css';

function Chip({ selected, onClick, children }) {
  return (
    <button type="button" className={`pcos-chip ${selected ? 'selected' : ''}`} onClick={onClick}>
      {children}
    </button>
  );
}

export default function PCOSCheck() {
  const { lang } = useLanguage();
  const t = translations[lang];
  
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState('');
  const [cycle, setCycle] = useState('regular');
  const [weightGain, setWeightGain] = useState(0);
  const [hairGrowth, setHairGrowth] = useState(0);
  const [skinDarkening, setSkinDarkening] = useState(0);
  const [hairLoss, setHairLoss] = useState(0);
  const [pimples, setPimples] = useState(0);
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [errorType, setErrorType] = useState(null);
  const [errorDetail, setErrorDetail] = useState(null);
  
  const calcBmi = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;
    if (w > 0 && h > 0) {
      const val = (w / (h*h)).toFixed(1);
      setBmi(val);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setErrorType(null);
    setErrorDetail(null);
    setResult(null);
    
    const bmiVal = parseFloat(bmi) || 0;
    const ageVal = parseFloat(age) || 0;
    const cycleRi = cycle === 'irregular' ? 4 : 2;
    
    const data = {
      age_yrs: ageVal,
      BMI: bmiVal,
      cycle_ri: cycleRi,
      weight_gain_yn: weightGain,
      hair_growth_yn: hairGrowth,
      skin_darkening_yn: skinDarkening,
      hair_loss_yn: hairLoss,
      pimples_yn: pimples
    };
    
    try {
      const res = await pcosPredict(data);
      setResult(res);
      try {
        localStorage.setItem('pcos_last', JSON.stringify({
          band: res.risk_band,
          factors: res.top_factors,
          inputs: data,
          timestamp: new Date().toISOString()
        }));
      } catch {}
    } catch (err) {
      if (err.code === 'OFFLINE') {
        setErrorType('OFFLINE');
        setError(t.offlineMsg || (lang === 'hi' ? 'बैकएंड से कनेक्ट नहीं हो पा रहा। कृपया सर्वर चल रहा है सुनिश्चित करें।' : 'Cannot reach backend. Please check if the server is running.'));
      } else if (err.code === 'SERVER') {
        setErrorType('SERVER');
        setError(err.message || 'Server error');
        setErrorDetail(err.body || '');
      } else {
        setErrorType('OFFLINE');
        setError(t.offlineMsg || (lang === 'hi' ? 'बैकएंड से कनेक्ट नहीं हो पा रहा। कृपया सर्वर चल रहा है सुनिश्चित करें।' : 'Cannot reach backend. Please check if the server is running.'));
      }
    } finally {
      setLoading(false);
    }
  };
  
  const getRiskClass = (band) => {
    if (band === 'low') return 'pcos-risk low';
    if (band === 'medium') return 'pcos-risk medium';
    if (band === 'high') return 'pcos-risk high';
    return 'pcos-risk';
  };
  
  const getRiskIcon = (band) => {
    if (band === 'low') return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="#1F5D3A" strokeWidth="2"/>
        <path d="M9 12l2 2 4-4" stroke="#1F5D3A" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    );
    if (band === 'medium') return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="#7A4B00" strokeWidth="2"/>
        <path d="M12 8v4M12 16h.01" stroke="#7A4B00" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    );
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="#8A1F3D" strokeWidth="2"/>
        <path d="M12 8v4M12 16h.01" stroke="#8A1F3D" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    );
  };
  
  const getRiskLabel = (band) => {
    if (band === 'low') return t.riskLow || (lang === 'hi' ? 'कम जोखिम पैटर्न' : 'Low risk pattern');
    if (band === 'medium') return t.riskMedium || (lang === 'hi' ? 'मध्यम जोखिम पैटर्न' : 'Medium risk pattern');
    if (band === 'high') return t.riskHigh || (lang === 'hi' ? 'उच्च जोखिम पैटर्न' : 'High risk pattern');
    return band;
  };
  
  const lowMsg = t.lowMsg || (lang === 'hi' ? 'आपने कोई बड़ा लक्षण नहीं बताया। अगर लक्षण जारी रहें, तो डॉक्टर से बात करें।' : 'You did not report any major signs. If symptoms continue, still talk to a doctor.');
  const patternFlag = t.patternFlag || (lang === 'hi' ? 'पैटर्न संकेत, निदान नहीं' : 'Pattern flag, not a diagnosis');
  const limitationsText = t.limitationsText || (lang === 'hi' ? 'केरल के अस्पतालों के 541 मरीजों पर अध्ययन, केवल स्व-रिपोर्ट किए गए लक्षण, PCOS की पुष्टि या खंडन नहीं कर सकता।' : '541 patients from Kerala hospitals, only self-reported symptoms, cannot confirm or rule out PCOS.');
  
  const questions = [
    lang === 'hi' ? 'क्या ये लक्षण PCOS से संबंधित हो सकते हैं या कुछ और?' : 'Could these symptoms be related to PCOS or something else?',
    lang === 'hi' ? 'क्या मुझे कोई रक्त परीक्षण या अल्ट्रासाउंड कराने की जरूरत है?' : 'Should I do any blood tests or ultrasound?',
    lang === 'hi' ? 'लक्षणों को प्रबंधित करने के लिए जीवनशैली में कौन से बदलाव कर सकते हैं?' : 'What lifestyle changes can help me manage symptoms?',
    lang === 'hi' ? 'क्या मुझे किसी विशेषज्ञ के पास भेजने की जरूरत है?' : 'Do I need a referral to a specialist?'
  ];
  
  return (
    <div className="pcos-page">
      <h1 className="pcos-title">{t.pcosCheck || (lang === 'hi' ? 'पीसीओएस जांच' : 'PCOS Check')}</h1>
      <p className="pcos-subtitle">{patternFlag}</p>
      
      <form onSubmit={handleSubmit} className="pcos-card">
        <div className="pcos-row">
          <div>
            <label className="pcos-label">{t.age || (lang === 'hi' ? 'उम्र (वर्ष)' : 'Age (years)')}</label>
            <input className="pcos-input" type="number" value={age} onChange={(e) => setAge(e.target.value)} required />
          </div>
          <div>
            <label className="pcos-label">{t.weight || (lang === 'hi' ? 'वजन (किग्रा)' : 'Weight (kg)')}</label>
            <input className="pcos-input" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
          </div>
          <div>
            <label className="pcos-label">{t.height || (lang === 'hi' ? 'ऊंचाई (सेमी)' : 'Height (cm)')}</label>
            <input className="pcos-input" type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
          </div>
          <div>
            <label className="pcos-label">{t.bmi || 'BMI'}</label>
            <div className="pcos-bmi-row">
              <input className="pcos-input" type="number" step="0.1" value={bmi} onChange={(e) => setBmi(e.target.value)} required />
              <button type="button" className="pcos-btn-calc" onClick={calcBmi}>{t.calculateBmi || (lang === 'hi' ? 'बीएमआई गणना करें' : 'Calculate BMI')}</button>
            </div>
          </div>
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <label className="pcos-label">{t.cycle || (lang === 'hi' ? 'चक्र' : 'Cycle')}</label>
          <div className="pcos-chips">
            <Chip selected={cycle === 'regular'} onClick={() => setCycle('regular')}>{t.regular || (lang === 'hi' ? 'नियमित' : 'Regular')}</Chip>
            <Chip selected={cycle === 'irregular'} onClick={() => setCycle('irregular')}>{t.irregular || (lang === 'hi' ? 'अनियमित' : 'Irregular')}</Chip>
          </div>
        </div>
        
        <div className="pcos-row">
          <div>
            <div className="pcos-label">{t.weightGain || (lang === 'hi' ? 'वजन बढ़ना' : 'Weight gain')}</div>
            <div className="pcos-chips">
              <Chip selected={weightGain === 1} onClick={() => setWeightGain(1)}>{t.yes || (lang === 'hi' ? 'हाँ' : 'Yes')}</Chip>
              <Chip selected={weightGain === 0} onClick={() => setWeightGain(0)}>{t.no || (lang === 'hi' ? 'नहीं' : 'No')}</Chip>
            </div>
          </div>
          <div>
            <div className="pcos-label">{t.hairGrowth || (lang === 'hi' ? 'अतिरिक्त बाल बढ़ना' : 'Excess hair growth')}</div>
            <div className="pcos-chips">
              <Chip selected={hairGrowth === 1} onClick={() => setHairGrowth(1)}>{t.yes || (lang === 'hi' ? 'हाँ' : 'Yes')}</Chip>
              <Chip selected={hairGrowth === 0} onClick={() => setHairGrowth(0)}>{t.no || (lang === 'hi' ? 'नहीं' : 'No')}</Chip>
            </div>
          </div>
          <div>
            <div className="pcos-label">{t.skinDarkening || (lang === 'hi' ? 'त्वचा का काला पड़ना' : 'Skin darkening')}</div>
            <div className="pcos-chips">
              <Chip selected={skinDarkening === 1} onClick={() => setSkinDarkening(1)}>{t.yes || (lang === 'hi' ? 'हाँ' : 'Yes')}</Chip>
              <Chip selected={skinDarkening === 0} onClick={() => setSkinDarkening(0)}>{t.no || (lang === 'hi' ? 'नहीं' : 'No')}</Chip>
            </div>
          </div>
          <div>
            <div className="pcos-label">{t.hairLoss || (lang === 'hi' ? 'बालों का झड़ना' : 'Hair loss')}</div>
            <div className="pcos-chips">
              <Chip selected={hairLoss === 1} onClick={() => setHairLoss(1)}>{t.yes || (lang === 'hi' ? 'हाँ' : 'Yes')}</Chip>
              <Chip selected={hairLoss === 0} onClick={() => setHairLoss(0)}>{t.no || (lang === 'hi' ? 'नहीं' : 'No')}</Chip>
            </div>
          </div>
          <div>
            <div className="pcos-label">{t.pimples || (lang === 'hi' ? 'मुंहासे/एक्ने' : 'Pimples/acne')}</div>
            <div className="pcos-chips">
              <Chip selected={pimples === 1} onClick={() => setPimples(1)}>{t.yes || (lang === 'hi' ? 'हाँ' : 'Yes')}</Chip>
              <Chip selected={pimples === 0} onClick={() => setPimples(0)}>{t.no || (lang === 'hi' ? 'नहीं' : 'No')}</Chip>
            </div>
          </div>
        </div>
        
        <button type="submit" className="pcos-btn-submit" disabled={loading}>
          {loading ? '...' : (t.checkRisk || (lang === 'hi' ? 'जोखिम जांचें' : 'Check risk'))}
        </button>
      </form>
      
      {error && (
        <div className="pcos-error">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span>{error}</span>
            {errorType === 'OFFLINE' && (
              <button type="button" className="pcos-btn-retry" onClick={() => window.location.reload()}>{t.retry || (lang === 'hi' ? 'पुनः प्रयास करें' : 'Retry')}</button>
            )}
          </div>
          {errorType === 'SERVER' && errorDetail && (
            <details className="pcos-details">
              <summary>{lang === 'hi' ? 'विवरण' : 'Details'}</summary>
              <pre style={{ whiteSpace: 'pre-wrap', margin: '8px 0 0 0' }}>{errorDetail}</pre>
            </details>
          )}
        </div>
      )}
      
      {result && (
        <div style={{ marginBottom: '24px' }}>
          <div className={getRiskClass(result.risk_band)}>
            {getRiskIcon(result.risk_band)}
            <div className="pcos-risk-text">
              <div className="pcos-risk-label">{getRiskLabel(result.risk_band)}</div>
              <div className="pcos-risk-sub">{patternFlag}</div>
            </div>
          </div>
          
          {result.risk_band === 'low' && (
            <div className="pcos-card">
              <p style={{ margin: 0 }}>{lowMsg}</p>
            </div>
          )}
          
          {(result.risk_band === 'medium' || result.risk_band === 'high') && result.top_factors && result.top_factors.length > 0 && (
            <div className="pcos-card pcos-factors">
              <h3 className="pcos-factors-title">{t.factors || (lang === 'hi' ? 'संभावित योगदान कारक' : 'Possible contributing factors')}</h3>
              <div className="pcos-badges">
                {result.top_factors.map((f, i) => (
                  <span key={i} className="pcos-badge">{f}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="pcos-card pcos-section" style={{ marginBottom: '16px' }}>
        <h3>{t.limitations || (lang === 'hi' ? 'सीमाएँ' : 'Limitations')}</h3>
        <p>{limitationsText}</p>
      </div>
      
      <div className="pcos-card pcos-section">
        <h3>{t.questionsDoctor || (lang === 'hi' ? 'डॉक्टर से पूछने वाले प्रश्न' : 'Questions to ask your doctor')}</h3>
        <ul>
          {questions.map((q, i) => <li key={i}>{q}</li>)}
        </ul>
      </div>
    </div>
  );
}
