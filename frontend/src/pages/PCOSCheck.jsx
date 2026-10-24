import React, { useState } from 'react';
import { useLanguage } from '../App';
import { translations } from '../i18n';
import { pcosPredict } from '../api';

function Chip({ selected, onClick, children }) {
  return (
    <button type="button" className={`chip ${selected ? 'selected' : ''}`} onClick={onClick}>
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
  const [cycle, setCycle] = useState('regular'); // regular/irregular
  const [weightGain, setWeightGain] = useState(0);
  const [hairGrowth, setHairGrowth] = useState(0);
  const [skinDarkening, setSkinDarkening] = useState(0);
  const [hairLoss, setHairLoss] = useState(0);
  const [pimples, setPimples] = useState(0);
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  
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
      if (err.code === 'OFFLINE' || err.message === 'OFFLINE') {
        setError(t.offlineMsg);
      } else {
        setError(t.offlineMsg);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const getRiskClass = (band) => {
    if (band === 'low') return 'risk-low';
    if (band === 'medium') return 'risk-medium';
    if (band === 'high') return 'risk-high';
    return '';
  };
  
  const getRiskIcon = (band) => {
    if (band === 'low') return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="var(--mint-text)" strokeWidth="2"/>
        <path d="M9 12l2 2 4-4" stroke="var(--mint-text)" strokeWidth="2" strokeLinecap="round"/>
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
    if (band === 'low') return t.riskLow;
    if (band === 'medium') return t.riskMedium;
    if (band === 'high') return t.riskHigh;
    return band;
  };
  
  return (
    <div className="page-enter" style={{ padding: '24px 0 48px 0' }}>
      <h1 style={{ color: 'var(--plum)', fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>{t.pcosTitle}</h1>
      <p style={{ color: 'rgba(45,38,48,0.75)', marginBottom: '24px' }}>{t.patternFlag}</p>
      
      <form onSubmit={handleSubmit} className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>{t.age}</label>
            <input type="number" value={age} onChange={(e) => setAge(e.target.value)} required />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>{t.weight}</label>
            <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>{t.height}</label>
            <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}>{t.bmi}</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="number" step="0.1" value={bmi} onChange={(e) => setBmi(e.target.value)} required />
              <button type="button" className="btn-secondary" onClick={calcBmi} style={{ padding: '8px 16px' }}>{t.calculateBmi}</button>
            </div>
          </div>
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>{t.cycle}</label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Chip selected={cycle === 'regular'} onClick={() => setCycle('regular')}>{t.regular}</Chip>
            <Chip selected={cycle === 'irregular'} onClick={() => setCycle('irregular')}>{t.irregular}</Chip>
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '20px' }}>
          <div>
            <div style={{ marginBottom: '6px', fontWeight: 500 }}>{t.weightGain}</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Chip selected={weightGain === 1} onClick={() => setWeightGain(1)}>{t.yes}</Chip>
              <Chip selected={weightGain === 0} onClick={() => setWeightGain(0)}>{t.no}</Chip>
            </div>
          </div>
          <div>
            <div style={{ marginBottom: '6px', fontWeight: 500 }}>{t.hairGrowth}</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Chip selected={hairGrowth === 1} onClick={() => setHairGrowth(1)}>{t.yes}</Chip>
              <Chip selected={hairGrowth === 0} onClick={() => setHairGrowth(0)}>{t.no}</Chip>
            </div>
          </div>
          <div>
            <div style={{ marginBottom: '6px', fontWeight: 500 }}>{t.skinDarkening}</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Chip selected={skinDarkening === 1} onClick={() => setSkinDarkening(1)}>{t.yes}</Chip>
              <Chip selected={skinDarkening === 0} onClick={() => setSkinDarkening(0)}>{t.no}</Chip>
            </div>
          </div>
          <div>
            <div style={{ marginBottom: '6px', fontWeight: 500 }}>{t.hairLoss}</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Chip selected={hairLoss === 1} onClick={() => setHairLoss(1)}>{t.yes}</Chip>
              <Chip selected={hairLoss === 0} onClick={() => setHairLoss(0)}>{t.no}</Chip>
            </div>
          </div>
          <div>
            <div style={{ marginBottom: '6px', fontWeight: 500 }}>{t.pimples}</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Chip selected={pimples === 1} onClick={() => setPimples(1)}>{t.yes}</Chip>
              <Chip selected={pimples === 0} onClick={() => setPimples(0)}>{t.no}</Chip>
            </div>
          </div>
        </div>
        
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? '...' : t.checkRisk}
        </button>
      </form>
      
      {error && (
        <div className="notice" style={{ marginBottom: '24px' }}>
          <span>{error}</span>
          <button type="button" className="btn-secondary" onClick={() => window.location.reload()} style={{ marginLeft: 'auto', padding: '8px 16px' }}>{t.retry}</button>
        </div>
      )}
      
      {result && (
        <div style={{ marginBottom: '24px' }}>
          <div className={getRiskClass(result.risk_band)} style={{ marginBottom: '16px' }}>
            {getRiskIcon(result.risk_band)}
            <div>
              <div style={{ fontWeight: 600 }}>{getRiskLabel(result.risk_band)}</div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>{t.patternFlag}</div>
            </div>
          </div>
          
          {result.risk_band === 'low' && (
            <div className="card" style={{ marginBottom: '16px' }}>
              <p style={{ margin: 0 }}>{t.lowMsg}</p>
            </div>
          )}
          
          {(result.risk_band === 'medium' || result.risk_band === 'high') && result.top_factors && result.top_factors.length > 0 && (
            <div className="card" style={{ marginBottom: '16px' }}>
              <h3 style={{ color: 'var(--plum)', marginTop: 0, marginBottom: '12px' }}>{t.factors}</h3>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {result.top_factors.map((f, i) => (
                  <span key={i} className="badge">{f}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="card" style={{ marginBottom: '16px' }}>
        <h3 style={{ color: 'var(--plum)', marginTop: 0 }}>{t.limitations}</h3>
        <p style={{ margin: 0 }}>{t.limitationsText}</p>
      </div>
      
      <div className="card">
        <h3 style={{ color: 'var(--plum)', marginTop: 0 }}>{t.questionsDoctor}</h3>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li>{t.q1}</li>
          <li>{t.q2}</li>
          <li>{t.q3}</li>
          <li>{t.q4}</li>
        </ul>
      </div>
      
      <div className="notice" style={{ marginTop: '24px' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="var(--plum)" strokeWidth="2"/>
          <path d="M12 16v-4M12 8h.01" stroke="var(--plum)" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <p style={{ margin: 0, fontSize: '14px' }}>{lang === 'hi' ? 'यह जानकारी के लिए है, निदान नहीं। डॉक्टर से जरूर मिलें।' : 'This information is for awareness only, not a diagnosis. Please consult a doctor.'}</p>
      </div>
    </div>
  );
}
