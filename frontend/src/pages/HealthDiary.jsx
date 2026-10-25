import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../App';
import { safeStorage, apiBaseUrl } from '../utils/storage';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const T = {
  en: {
    title: 'My Health Diary', voiceH: 'Say it, I will fill the form',
    voiceSub: 'Tell me in your own words how you feel. I will fill the form below. You can change anything before saving.',
    mic: 'Press and speak', micStop: 'Stop', listening: 'Listening... speak now',
    hint: 'Or type here. Example: my periods started 3 days ago, heavy bleeding and pain 7',
    fill: 'Fill the form', busy: 'Reading...', filled: 'Form filled. Please check it and save.',
    err: 'Could not read it. Check that the backend is running.',
    micNote: "Voice typing may send your audio to your browser's speech service. You can type instead.",
    noMic: 'Voice typing does not work in this browser. Use Chrome or Edge, or type.',
    micDenied: 'Microphone is blocked. Allow it in the browser address bar.',
    start: 'Date', end: 'Period end date (optional)', pain: 'Pain (0-10)', bleeding: 'Bleeding',
    light: 'Light', medium: 'Medium', heavy: 'Heavy', symptoms: 'Symptoms', symPh: 'e.g., cramps, tiredness',
    since: 'Since when', sinceUnit: 'e.g., 3 days', severity: 'How bad', mild: 'Mild', severe: 'Severe',
    note: 'Notes (what you said)', add: 'Add entry', update: 'Update entry', cancel: 'Cancel',
    timeline: 'Timeline', edit: 'Edit', del: 'Delete', voiceTag: 'From Voice Card', empty: 'No entries yet.',
    chart: 'Pain chart', chartNote: 'Only summarising what you logged, no predictions.',
    urgentH: 'This may be urgent',
    disc: 'This information is for awareness only, not a diagnosis. Please consult a doctor.',
  },
  hi: {
    title: 'मेरी स्वास्थ्य डायरी', voiceH: 'बोलिए, फ़ॉर्म मैं भर दूँगी',
    voiceSub: 'अपने शब्दों में बताइए कैसा लग रहा है। मैं नीचे का फ़ॉर्म भर दूँगी। सेव करने से पहले आप कुछ भी बदल सकती हैं।',
    mic: 'दबाकर बोलें', micStop: 'रोकें', listening: 'सुन रही हूँ... अब बोलिए',
    hint: 'या यहाँ लिखें। जैसे: 3 दिन पहले पीरियड शुरू हुए, ज़्यादा खून और दर्द 7',
    fill: 'फ़ॉर्म भरें', busy: 'पढ़ रही हूँ...', filled: 'फ़ॉर्म भर गया। कृपया जाँचकर सेव करें।',
    err: 'पढ़ नहीं सकी। जाँचें कि बैकएंड चल रहा है।',
    micNote: 'बोलकर लिखने में आपकी आवाज़ ब्राउज़र की स्पीच सेवा को जा सकती है। चाहें तो टाइप करें।',
    noMic: 'इस ब्राउज़र में बोलकर लिखना नहीं चलता। Chrome या Edge इस्तेमाल करें, या टाइप करें।',
    micDenied: 'माइक बंद है। ब्राउज़र के एड्रेस बार में अनुमति दें।',
    start: 'तारीख', end: 'पीरियड ख़त्म होने की तारीख (ज़रूरी नहीं)', pain: 'दर्द (0-10)', bleeding: 'खून',
    light: 'हल्का', medium: 'मध्यम', heavy: 'ज़्यादा', symptoms: 'लक्षण', symPh: 'जैसे, ऐंठन, थकान',
    since: 'कब से', sinceUnit: 'जैसे, 3 दिन', severity: 'कितना ज़्यादा', mild: 'हल्का', severe: 'तेज़',
    note: 'नोट (आपने जो कहा)', add: 'एंट्री जोड़ें', update: 'एंट्री अपडेट करें', cancel: 'रद्द करें',
    timeline: 'टाइमलाइन', edit: 'बदलें', del: 'हटाएँ', voiceTag: 'वॉइस कार्ड से', empty: 'अभी कोई एंट्री नहीं है।',
    chart: 'दर्द चार्ट', chartNote: 'सिर्फ़ आपने जो दर्ज किया उसका सार, कोई भविष्यवाणी नहीं।',
    urgentH: 'यह ज़रूरी हो सकता है',
    disc: 'यह जानकारी सिर्फ़ जागरूकता के लिए है, निदान नहीं। कृपया डॉक्टर से मिलें।',
  },
};

const CSS = `
.hd{max-width:900px;margin:0 auto;padding:4px 4px 40px;color:var(--charcoal,#2D2630);animation:hdf .25s ease}
@keyframes hdf{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
.hd h1{font-size:2rem;font-weight:700;color:var(--plum,#6F315F);margin:0 0 14px}
.hd h2{font-size:1.2rem;color:var(--plum,#6F315F);margin:0 0 8px}
.hd button{font-family:inherit}
.hd .card{background:#fff;border:1px solid rgba(111,49,95,.15);border-radius:20px;padding:18px;box-shadow:0 4px 18px rgba(111,49,95,.07);margin-bottom:18px}
.hd .vbox{background:var(--blush,#F7E8F0)}
.hd .sub{margin:0 0 12px;opacity:.85;line-height:1.6}
.hd .bigmic{width:100%;min-height:64px;border-radius:16px;border:2px solid var(--plum,#6F315F);background:#fff;color:var(--plum,#6F315F);font-size:1.15rem;font-weight:700;cursor:pointer;margin-bottom:10px;transition:.15s}
.hd .bigmic:hover{background:var(--plum,#6F315F);color:#fff}
.hd .bigmic.rec{background:#A12B4B;border-color:#A12B4B;color:#fff}
.hd textarea,.hd input[type=text],.hd input[type=date],.hd select{width:100%;box-sizing:border-box;border:1px solid rgba(111,49,95,.25);border-radius:12px;padding:12px;font-family:inherit;font-size:1.02rem;background:#fff;min-height:48px}
.hd textarea{min-height:90px;resize:vertical}
.hd textarea:focus,.hd input:focus,.hd select:focus{outline:none;border-color:var(--plum,#6F315F);box-shadow:0 0 0 3px rgba(217,92,145,.25)}
.hd .grid{display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));margin-bottom:14px}
.hd label{display:block;font-weight:600;margin-bottom:6px}
.hd input[type=range]{width:100%;accent-color:var(--plum,#6F315F)}
.hd .pv{text-align:center;font-weight:700;font-size:1.2rem;color:var(--plum,#6F315F)}
.hd .row{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-top:10px}
.hd .btn{min-height:50px;padding:0 24px;border-radius:12px;border:none;background:var(--plum,#6F315F);color:#fff;font-weight:600;font-size:1rem;cursor:pointer;box-shadow:0 4px 12px rgba(111,49,95,.25);transition:.15s}
.hd .btn:hover:not(:disabled){background:#57254B;transform:translateY(-1px)}
.hd .btn:disabled{opacity:.5;cursor:not-allowed;box-shadow:none}
.hd .sbtn{min-height:44px;padding:0 14px;border-radius:10px;border:1px solid var(--plum,#6F315F);background:#fff;color:var(--plum,#6F315F);cursor:pointer;font-weight:600;transition:.15s}
.hd .sbtn:hover{background:var(--plum,#6F315F);color:#fff}
.hd .sbtn.del{border-color:#A12B4B;color:#A12B4B}
.hd .sbtn.del:hover{background:#A12B4B;color:#fff}
.hd .live{color:#A12B4B;font-weight:600}
.hd .alert{border-radius:12px;padding:10px 14px;margin-top:10px;background:#FFF1D6;color:#8A5A00;font-size:.95rem}
.hd .ok{background:#E6F4ED;color:#1F5D3A}
.hd .urgent{background:#FDE3E3;color:#8E2B3A;border:2px solid #A12B4B;border-radius:14px;padding:14px;font-weight:600;line-height:1.6;margin-top:10px}
.hd .item{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;background:#fff;border:1px solid rgba(111,49,95,.15);border-radius:16px;padding:14px;margin-bottom:10px}
.hd .item b{font-size:1.05rem}
.hd .item p{margin:4px 0 0;opacity:.85;line-height:1.5}
.hd .tag{display:inline-block;background:var(--blush,#F7E8F0);color:var(--plum,#6F315F);border-radius:999px;padding:3px 10px;font-size:.8rem;font-weight:600;margin-left:8px}
.hd .foot{font-size:.9rem;opacity:.7;margin-top:14px;text-align:center}
.hd button:focus-visible{outline:2px solid var(--rose,#D95C91);outline-offset:2px}
`;

const today = () => new Date().toISOString().slice(0, 10);
const blank = () => ({ startDate: today(), endDate: '', pain: 0, bleeding: 'medium', symptoms: '', whenStarted: '', severity: 'medium', note: '' });
const SEV = { mild: 'mild', moderate: 'medium', severe: 'severe' };
const readJson = (k) => { try { return JSON.parse(safeStorage.getItem(k) || '[]'); } catch { return []; } };

export default function HealthDiary() {
  const { lang } = useLanguage();
  const L = lang === 'hi' ? 'hi' : 'en';
  const u = T[L];
  const SR = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);

  const [entries, setEntries] = useState(() => readJson('sakhi_diary'));
  const [vEntries, setVEntries] = useState(() => readJson('sakhi_voice_diary'));
  const [form, setForm] = useState(blank());
  const [editingId, setEditingId] = useState(null);
  const [voiceText, setVoiceText] = useState('');
  const [listening, setListening] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [msgKind, setMsgKind] = useState('');
  const recRef = useRef(null);
  const baseRef = useRef('');

  useEffect(() => { safeStorage.setItem('sakhi_diary', JSON.stringify(entries)); }, [entries]);
  useEffect(() => () => { try { recRef.current?.stop(); } catch {} }, []);

  function startMic() {
    if (!SR) { setMsg(u.noMic); setMsgKind(''); return; }
    try {
      if (!localStorage.getItem('mic_notice')) {
        if (!window.confirm(u.micNote)) return;
        localStorage.setItem('mic_notice', '1');
      }
    } catch {}
    setMsg('');
    const rec = new SR();
    rec.lang = L === 'hi' ? 'hi-IN' : 'en-IN';
    rec.continuous = true; rec.interimResults = true;
    baseRef.current = voiceText ? voiceText.trimEnd() + ' ' : '';
    rec.onresult = (e) => {
      let s = '';
      for (let i = 0; i < e.results.length; i++) s += e.results[i][0].transcript;
      setVoiceText(baseRef.current + s);
    };
    rec.onerror = (e) => {
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') { setMsg(u.micDenied); setMsgKind(''); }
      setListening(false);
    };
    rec.onend = () => setListening(false);
    recRef.current = rec;
    try { rec.start(); setListening(true); } catch { setListening(false); }
  }
  function stopMic() { try { recRef.current?.stop(); } catch {} setListening(false); }

  async function analyze() {
    const tx = voiceText.trim();
    if (!tx || busy) return;
    stopMic(); setBusy(true); setMsg('');
    try {
      const r = await fetch(`${apiBaseUrl}/voice/analyze`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: tx, lang: L === 'hi' ? 'hg' : 'en' }),
      });
      if (!r.ok) throw new Error();
      const j = await r.json();
      if (j.urgent) { setMsg(j.message); setMsgKind('urgent'); return; }
      if (j.error) { setMsg(j.message || u.err); setMsgKind(''); return; }
      setForm((f) => ({
        ...f,
        startDate: f.startDate || today(),
        pain: j.pain !== null && j.pain !== undefined ? j.pain : f.pain,
        bleeding: ['light', 'medium', 'heavy'].includes(j.bleeding) ? j.bleeding : f.bleeding,
        symptoms: (j.symptoms || []).join(', ') || f.symptoms,
        whenStarted: j.since || f.whenStarted,
        severity: SEV[j.severity] || f.severity,
        note: j.summary || tx,
      }));
      setMsg(u.filled); setMsgKind('ok');
    } catch { setMsg(u.err); setMsgKind(''); }
    finally { setBusy(false); }
  }

  function submit(e) {
    e.preventDefault();
    const clean = { ...form, startDate: form.startDate || today() };
    if (editingId !== null) {
      setEntries(entries.map((x) => (x.id === editingId ? { ...clean, id: editingId } : x)));
      setEditingId(null);
    } else {
      setEntries([...entries, { ...clean, id: Date.now() }]);
    }
    setForm(blank()); setVoiceText(''); setMsg('');
  }
  function edit(en) { setForm({ ...blank(), ...en }); setEditingId(en.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  function cancelEdit() { setEditingId(null); setForm(blank()); }
  function del(id) { setEntries(entries.filter((x) => x.id !== id)); }
  function delV(id) {
    const n = vEntries.filter((x) => x.id !== id);
    setVEntries(n); safeStorage.setItem('sakhi_voice_diary', JSON.stringify(n));
  }

  const items = [
    ...entries.map((x) => ({ kind: 'log', id: x.id, date: x.startDate || '', x })),
    ...vEntries.map((x) => ({ kind: 'voice', id: x.id, date: String(x.date || '').slice(0, 10), x })),
  ].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

  const chartData = [
    ...entries.map((x) => ({ name: x.startDate || '', pain: Number(x.pain) || 0 })),
    ...vEntries.filter((x) => x.pain !== null && x.pain !== undefined).map((x) => ({ name: String(x.date).slice(0, 10), pain: Number(x.pain) })),
  ].sort((a, b) => (a.name < b.name ? -1 : 1));

  const lbl = (k) => u[k] || k;

  return (
    <div className="hd">
      <style>{CSS}</style>
      <h1>📔 {u.title}</h1>

      <section className="card vbox">
        <h2>🎙️ {u.voiceH}</h2>
        <p className="sub">{u.voiceSub}</p>
        {SR && (
          <button type="button" className={`bigmic${listening ? ' rec' : ''}`} onClick={listening ? stopMic : startMic}>
            {listening ? <>⏹ {u.micStop}</> : <>🎤 {u.mic}</>}
          </button>
        )}
        {listening && <div className="live">{u.listening}</div>}
        <textarea value={voiceText} onChange={(e) => setVoiceText(e.target.value)} maxLength={1500} placeholder={u.hint} aria-label={u.hint} />
        <div className="row">
          <button type="button" className="btn" disabled={busy || !voiceText.trim()} onClick={analyze}>{busy ? u.busy : u.fill}</button>
        </div>
        {!SR && <div className="alert">{u.noMic}</div>}
        {msg && msgKind === 'urgent' && <div className="urgent" role="alert">🚨 {u.urgentH}<div style={{ marginTop: 6 }}>{msg}</div></div>}
        {msg && msgKind !== 'urgent' && <div className={`alert${msgKind === 'ok' ? ' ok' : ''}`} role="status">{msg}</div>}
      </section>

      <form className="card" onSubmit={submit}>
        <div className="grid">
          <div><label>{u.start}</label><input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></div>
          <div><label>{u.end}</label><input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} /></div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label>{u.pain}</label>
          <input type="range" min="0" max="10" value={form.pain} onChange={(e) => setForm({ ...form, pain: parseInt(e.target.value) })} />
          <div className="pv">{form.pain}</div>
        </div>
        <div className="grid">
          <div><label>{u.bleeding}</label>
            <select value={form.bleeding} onChange={(e) => setForm({ ...form, bleeding: e.target.value })}>
              <option value="light">{u.light}</option><option value="medium">{u.medium}</option><option value="heavy">{u.heavy}</option>
            </select></div>
          <div><label>{u.severity}</label>
            <select value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value })}>
              <option value="mild">{u.mild}</option><option value="medium">{u.medium}</option><option value="severe">{u.severe}</option>
            </select></div>
        </div>
        <div className="grid">
          <div><label>{u.symptoms}</label><input type="text" value={form.symptoms} onChange={(e) => setForm({ ...form, symptoms: e.target.value })} placeholder={u.symPh} /></div>
          <div><label>{u.since}</label><input type="text" value={form.whenStarted} onChange={(e) => setForm({ ...form, whenStarted: e.target.value })} placeholder={u.sinceUnit} /></div>
        </div>
        <div style={{ marginBottom: 6 }}>
          <label>{u.note}</label>
          <textarea value={form.note || ''} onChange={(e) => setForm({ ...form, note: e.target.value })} maxLength={600} />
        </div>
        <div className="row">
          <button type="submit" className="btn">{editingId !== null ? u.update : u.add}</button>
          {editingId !== null && <button type="button" className="sbtn" onClick={cancelEdit}>{u.cancel}</button>}
        </div>
      </form>

      <h2>{u.timeline}</h2>
      {items.length === 0 && <p className="sub">{u.empty}</p>}
      {items.map((it) => it.kind === 'log' ? (
        <div className="item" key={'l' + it.id}>
          <div>
            <b>{it.x.startDate}{it.x.endDate ? ' - ' + it.x.endDate : ''}</b>
            <p>{u.pain}: {it.x.pain}/10 | {u.bleeding}: {lbl(it.x.bleeding)}</p>
            {it.x.symptoms && <p>{it.x.symptoms}</p>}
            {it.x.whenStarted && <p>{u.since}: {it.x.whenStarted}</p>}
            {it.x.note && <p>{it.x.note}</p>}
          </div>
          <div className="row" style={{ marginTop: 0 }}>
            <button className="sbtn" onClick={() => edit(it.x)}>{u.edit}</button>
            <button className="sbtn del" onClick={() => del(it.id)}>{u.del}</button>
          </div>
        </div>
      ) : (
        <div className="item" key={'v' + it.id}>
          <div>
            <b>{it.date}<span className="tag">🎙️ {u.voiceTag}</span></b>
            {it.x.summary && <p>{it.x.summary}</p>}
            {(it.x.symptoms || []).length > 0 && <p>{u.symptoms}: {it.x.symptoms.join(', ')}</p>}
            {it.x.pain !== null && it.x.pain !== undefined && <p>{u.pain}: {it.x.pain}/10</p>}
            {it.x.since && <p>{u.since}: {it.x.since}</p>}
          </div>
          <div className="row" style={{ marginTop: 0 }}>
            <button className="sbtn del" onClick={() => delV(it.id)}>{u.del}</button>
          </div>
        </div>
      ))}

      {chartData.length > 0 && (
        <section className="card">
          <h2>{u.chart}</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Line type="monotone" dataKey="pain" stroke="#6F315F" strokeWidth={2} name={u.pain} />
            </LineChart>
          </ResponsiveContainer>
          <p className="foot">{u.chartNote}</p>
        </section>
      )}

      
    </div>
  );
}
