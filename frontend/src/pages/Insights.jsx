import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const T = {
  en: {
    title: 'My Summary Insights', sub: 'Everything you told me, gathered in one place: symptoms, details and the questions to ask your doctor. Only your own words, no diagnosis.',
    mode: 'Language', empty: 'No entries yet. Tell me your problem in Voice Card and press "Save to my diary", then come back here.',
    goVoice: 'Open Voice Card', goDiary: 'Open Diary',
    entries: 'Total entries', voiceN: 'Told by voice', avgPain: 'Average pain', maxPain: 'Highest pain',
    latest: 'Latest summary', common: 'Most repeated symptoms', times: 'times',
    details: 'Details you gave', bleed: 'Bleeding', severity: 'How bad', since: 'Since', period: 'Period details',
    light: 'Light', medium: 'Medium', heavy: 'Heavy', mild: 'Mild', severe: 'Severe',
    byEntry: 'Each time you told me', symptoms: 'Symptoms', ask: 'Questions to ask the doctor',
    allAsk: 'All questions in one list', allAskSub: 'Collected from everything you told by voice, repeats removed.',
    chart: 'Pain over time', listen: 'Listen', stop: 'Stop', copy: 'Copy all', copied: 'Copied',
    noVoice: 'No voice found on this device. Windows: Settings > Time & language > Speech > Add voices.',
    note: 'This only organises what you entered. It is not a diagnosis. Please show it to a doctor.',
  },
  hg: {
    title: 'Mera Summary Insights', sub: 'Aapne jo bataya wo sab ek jagah: symptoms, details aur doctor se poochne ke sawaal. Sirf aapki apni baatein, koi diagnosis nahi.',
    mode: 'Bhasha', empty: 'Abhi koi entry nahi hai. Voice Card me problem batao aur "Save to my diary" dabao, phir yahan aao.',
    goVoice: 'Voice Card kholo', goDiary: 'Diary kholo',
    entries: 'Kul entries', voiceN: 'Bolkar batayi', avgPain: 'Average dard', maxPain: 'Sabse zyada dard',
    latest: 'Pichhla summary', common: 'Sabse zyada baar aaye symptoms', times: 'baar',
    details: 'Aapne di hui details', bleed: 'Khoon', severity: 'Kitna zyada', since: 'Kab se', period: 'Period ki details',
    light: 'Halka', medium: 'Madhyam', heavy: 'Zyada', mild: 'Halka', severe: 'Tez',
    byEntry: 'Har baar jo aapne bataya', symptoms: 'Symptoms', ask: 'Doctor se poochne ke sawaal',
    allAsk: 'Saare sawaal ek list me', allAskSub: 'Aapne bolkar jo bataya un sab se, repeat hata kar.',
    chart: 'Samay ke saath dard', listen: 'Suno', stop: 'Roko', copy: 'Sab copy karo', copied: 'Copy ho gaya',
    noVoice: 'Is device me awaaz nahi mili. Windows: Settings > Time & language > Speech > Add voices.',
    note: 'Ye sirf aapki likhi baaton ko vyavasthit karta hai. Ye diagnosis nahi hai. Doctor ko dikhao.',
  },
};

T.hi = {
  title: 'मेरा सारांश', sub: 'आपने जो बताया वह सब एक जगह: लक्षण, जानकारी और डॉक्टर से पूछने के सवाल। सिर्फ़ आपकी अपनी बातें, कोई निदान नहीं।',
  mode: 'भाषा', empty: 'अभी कोई एंट्री नहीं है। वॉइस कार्ड में समस्या बताएँ और "डायरी में सेव करें" दबाएँ, फिर यहाँ आएँ।',
  goVoice: 'वॉइस कार्ड खोलें', goDiary: 'डायरी खोलें',
  entries: 'कुल एंट्री', voiceN: 'बोलकर बताई', avgPain: 'औसत दर्द', maxPain: 'सबसे ज़्यादा दर्द',
  latest: 'पिछला सारांश', common: 'सबसे ज़्यादा बार आए लक्षण', times: 'बार',
  details: 'आपकी दी हुई जानकारी', bleed: 'खून', severity: 'कितना ज़्यादा', since: 'कब से', period: 'पीरियड की जानकारी',
  light: 'हल्का', medium: 'मध्यम', heavy: 'ज़्यादा', mild: 'हल्का', severe: 'तेज़',
  byEntry: 'हर बार जो आपने बताया', symptoms: 'लक्षण', ask: 'डॉक्टर से पूछने के सवाल',
  allAsk: 'सारे सवाल एक सूची में', allAskSub: 'आपने बोलकर जो बताया उन सबसे, दोहराव हटाकर।',
  chart: 'समय के साथ दर्द', listen: 'सुनें', stop: 'रोकें', copy: 'सब कॉपी करें', copied: 'कॉपी हो गया',
  noVoice: 'इस डिवाइस में हिंदी आवाज़ नहीं मिली। Windows: Settings > Time & language > Speech > Add voices।',
  note: 'यह सिर्फ़ आपकी दर्ज की गई बातों को व्यवस्थित करता है। यह निदान नहीं है। कृपया डॉक्टर को दिखाएँ।',
};
const CSS = `
.ins{max-width:900px;margin:0 auto;padding:4px 4px 40px;color:var(--charcoal,#2D2630);animation:insf .25s ease}
@keyframes insf{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
.ins h1{font-size:2rem;font-weight:700;color:var(--plum,#6F315F);margin:0 0 6px}
.ins h2{font-size:1.2rem;color:var(--plum,#6F315F);margin:0 0 10px}
.ins h3{font-size:1rem;margin:0 0 8px;color:var(--plum,#6F315F)}
.ins .sub{margin:0 0 14px;opacity:.85;line-height:1.7}
.ins button{font-family:inherit}
.ins .mode{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:16px;font-weight:600;color:var(--plum,#6F315F)}
.ins .mode button{min-height:44px;padding:0 18px;border-radius:999px;border:2px solid var(--plum,#6F315F);background:#fff;color:var(--plum,#6F315F);font-weight:600;cursor:pointer}
.ins .mode button.on{background:var(--plum,#6F315F);color:#fff}
.ins .card{background:#fff;border:1px solid rgba(111,49,95,.15);border-radius:20px;padding:18px;box-shadow:0 4px 18px rgba(111,49,95,.07);margin-bottom:16px}
.ins .stats{display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));margin-bottom:16px}
.ins .stat{background:var(--blush,#F7E8F0);border-radius:16px;padding:14px}
.ins .stat small{display:block;opacity:.75;font-size:.85rem;margin-bottom:4px}
.ins .stat b{font-size:1.7rem;color:var(--plum,#6F315F)}
.ins .bar{display:flex;align-items:center;gap:10px;margin-bottom:8px}
.ins .bar .n{min-width:150px;font-weight:600}
.ins .bar .track{flex:1;background:#F3EAF1;border-radius:999px;height:14px;overflow:hidden}
.ins .bar .fill{display:block;height:100%;background:var(--plum,#6F315F);border-radius:999px}
.ins .bar .c{min-width:70px;text-align:right;font-size:.9rem;opacity:.8}
.ins .chips{display:flex;gap:8px;flex-wrap:wrap}
.ins .chip{background:var(--blush,#F7E8F0);color:var(--plum,#6F315F);border-radius:999px;padding:7px 14px;font-weight:600;font-size:.95rem}
.ins .det{display:grid;gap:10px;grid-template-columns:repeat(auto-fit,minmax(150px,1fr))}
.ins .det div{background:#FBF8FB;border-radius:12px;padding:10px 12px}
.ins .det small{display:block;opacity:.7;font-size:.8rem;margin-bottom:2px}
.ins .entry{border:2px solid var(--plum,#6F315F);border-radius:18px;overflow:hidden;margin-bottom:14px;background:#fff}
.ins .ehead{background:var(--blush,#F7E8F0);padding:12px 16px;font-weight:700;color:var(--plum,#6F315F)}
.ins .ebody{padding:14px 16px;display:grid;gap:12px}
.ins .ebody p{margin:0;line-height:1.7}
.ins .ask{background:#FFF1D6;border-radius:14px;padding:14px 16px}
.ins .ask h3,.ins .ask h2{color:#8A5A00}
.ins ol{margin:0;padding-left:22px;display:grid;gap:8px;line-height:1.65;font-size:1.04rem}
.ins .row{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-top:12px}
.ins .sbtn{min-height:44px;padding:0 16px;border-radius:10px;border:1px solid var(--plum,#6F315F);background:#fff;color:var(--plum,#6F315F);cursor:pointer;font-weight:600;transition:.15s}
.ins .lnk{min-height:44px;padding:0 16px;border-radius:10px;border:1px solid var(--plum,#6F315F);background:#fff;color:var(--plum,#6F315F);font-weight:600;text-decoration:none;display:inline-flex;align-items:center}
.ins .sbtn:hover,.ins .sbtn.on,.ins .lnk:hover{background:var(--plum,#6F315F);color:#fff}
.ins .alert{border-radius:12px;padding:10px 14px;margin-top:12px;background:#FFF1D6;color:#8A5A00;font-size:.95rem}
.ins .foot{font-size:.9rem;opacity:.7;margin-top:14px}
.ins button:focus-visible{outline:2px solid var(--rose,#D95C91);outline-offset:2px}
@media (max-width:560px){.ins .bar .n{min-width:100px}}
.ins .chips{display:flex;gap:8px;flex-wrap:wrap}
.ins .chip{background:var(--blush,#F7E8F0);color:var(--plum,#6F315F);border-radius:999px;padding:7px 14px;font-weight:600;font-size:.95rem}
.ins .det{display:grid;gap:10px;grid-template-columns:repeat(auto-fit,minmax(150px,1fr))}
.ins .det div{background:#FBF8FB;border-radius:12px;padding:10px 12px}
.ins .det small{display:block;opacity:.7;font-size:.8rem;margin-bottom:2px}
.ins .entry{border:2px solid var(--plum,#6F315F);border-radius:18px;overflow:hidden;margin-bottom:14px;background:#fff}
.ins .ehead{background:var(--blush,#F7E8F0);padding:12px 16px;font-weight:700;color:var(--plum,#6F315F)}
.ins .ebody{padding:14px 16px;display:grid;gap:12px}
.ins .ebody p{margin:0;line-height:1.7}
.ins .ask{background:#FFF1D6;border-radius:14px;padding:14px 16px}
.ins .ask h3,.ins .ask h2{color:#8A5A00}
.ins ol{margin:0;padding-left:22px;display:grid;gap:8px;line-height:1.65;font-size:1.04rem}
.ins .row{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-top:12px}
.ins .sbtn{min-height:44px;padding:0 16px;border-radius:10px;border:1px solid var(--plum,#6F315F);background:#fff;color:var(--plum,#6F315F);cursor:pointer;font-weight:600;transition:.15s}
.ins .lnk{min-height:44px;padding:0 16px;border-radius:10px;border:1px solid var(--plum,#6F315F);background:#fff;color:var(--plum,#6F315F);font-weight:600;text-decoration:none;display:inline-flex;align-items:center}
.ins .sbtn:hover,.ins .sbtn.on,.ins .lnk:hover{background:var(--plum,#6F315F);color:#fff}
.ins .alert{border-radius:12px;padding:10px 14px;margin-top:12px;background:#FFF1D6;color:#8A5A00;font-size:.95rem}
.ins .foot{font-size:.9rem;opacity:.7;margin-top:14px}
.ins button:focus-visible{outline:2px solid var(--rose,#D95C91);outline-offset:2px}
@media (max-width:560px){.ins .bar .n{min-width:100px}}
`;

const readJson = (k) => { try { const v = JSON.parse(localStorage.getItem(k) || '[]'); return Array.isArray(v) ? v : []; } catch { return []; } };
const cap = (s) => String(s).charAt(0).toUpperCase() + String(s).slice(1);
const sp = (s) => (/[.?!]$/.test(String(s).trim()) ? String(s).trim() : String(s).trim() + '.');

export default function Insights() {
  const { lang } = useLanguage();
  const [mode, setMode] = useState(() => {
    try { const s = localStorage.getItem('vc_mode'); if (s === 'en' || s === 'hg') return s; } catch {}
    return lang === 'hi' ? 'hg' : 'en';
  });
  const u = T[mode];
  const code = mode === 'en' ? 'en-IN' : 'hi-IN';
  const [voice] = useState(() => readJson('sakhi_voice_diary'));
  const [diary] = useState(() => readJson('sakhi_diary'));
  const [playing, setPlaying] = useState(null);
  const [info, setInfo] = useState('');
  const [copied, setCopied] = useState(false);
  const tokenRef = useRef(0);

  useEffect(() => { window.speechSynthesis?.getVoices?.(); }, []);
  useEffect(() => () => { tokenRef.current++; try { window.speechSynthesis?.cancel(); } catch {} }, []);

  function pickMode(m) { stopSpeak(); setInfo(''); setMode(m); try { localStorage.setItem('vc_mode', m); } catch {} }

  useEffect(() => { setMode(lang === 'hi' ? 'hi' : 'en'); }, [lang]);
  const total = voice.length + diary.length;

  const pains = [
    ...voice.filter((x) => x.pain !== null && x.pain !== undefined).map((x) => ({ name: String(x.date || '').slice(0, 10), pain: Number(x.pain) })),
    ...diary.map((x) => ({ name: x.startDate || '', pain: Number(x.pain) || 0 })),
  ].filter((x) => !Number.isNaN(x.pain)).sort((a, b) => (a.name < b.name ? -1 : 1));
  const avg = pains.length ? (pains.reduce((s, x) => s + x.pain, 0) / pains.length).toFixed(1) : '-';
  const max = pains.length ? Math.max(...pains.map((x) => x.pain)) : '-';

  const counts = {};
  const addSym = (s) => { const k = String(s || '').trim().toLowerCase(); if (k) counts[k] = (counts[k] || 0) + 1; };
  voice.forEach((x) => (x.symptoms || []).forEach(addSym));
  diary.forEach((x) => String(x.symptoms || '').split(',').forEach(addSym));
  const syms = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const maxC = syms.length ? syms[0][1] : 1;

  const seen = new Set();
  const allQ = [];
  voice.forEach((x) => (x.doctor_questions || []).forEach((q) => {
    const k = String(q).trim().toLowerCase();
    if (k && !seen.has(k)) { seen.add(k); allQ.push(String(q).trim()); }
  }));

  const latest = voice[0] || null;
  const lvl = (k) => u[k] || k;
  const detailsOf = (x) => [[u.severity, x.severity ? lvl(x.severity) : ''], [u.bleed, x.bleeding ? lvl(x.bleeding) : ''],
    [u.since, x.since], [u.period, x.period_note]].filter((d) => d[1]);

  function stopSpeak() { tokenRef.current++; try { window.speechSynthesis?.cancel(); } catch {} setPlaying(null); }
  function speak(key, txt) {
    try {
      const synth = window.speechSynthesis;
      const vs = synth?.getVoices?.() || [];
      const v = vs.find((x) => x.lang === code) || vs.find((x) => x.lang.toLowerCase().startsWith(code.split('-')[0]));
      if (!synth || !v) { setInfo(u.noVoice); return; }
      stopSpeak(); setInfo('');
      const token = ++tokenRef.current;
      const chunks = txt.split(/(?<=[.?!])\s+/).map((s) => s.trim()).filter(Boolean);
      let i = 0; setPlaying(key);
      const next = () => {
        if (token !== tokenRef.current) return;
        if (i >= chunks.length) { setPlaying(null); return; }
        const ut = new SpeechSynthesisUtterance(chunks[i]);
        ut.lang = code; ut.voice = v; ut.rate = 0.9;
        ut.onend = () => { i++; next(); };
        ut.onerror = () => { if (token === tokenRef.current) setPlaying(null); };
        synth.speak(ut);
      };
      next();
    } catch { setInfo(u.noVoice); }
  }
  const lb = (key, txt) => (playing === key
    ? <button className="sbtn on" onClick={stopSpeak}>⏹ {u.stop}</button>
    : <button className="sbtn" onClick={() => speak(key, txt)}>🔊 {u.listen}</button>);

  const entryText = (x) => [x.summary ? sp(x.summary) : '', (x.symptoms || []).length ? sp(u.symptoms) + ' ' + x.symptoms.map(sp).join(' ') : '',
    (x.doctor_questions || []).length ? sp(u.ask) + ' ' + x.doctor_questions.map(sp).join(' ') : ''].filter(Boolean).join(' ');

  const ex = mode === 'hi' ? { intro: 'यह आपका सारांश आसान शब्दों में है।', top: 'आपने सबसे ज़्यादा ये लक्षण बताए:', btn: 'मेरा सारांश समझाएँ' } : mode === 'en'
    ? { intro: 'Here is your summary in simple words.', top: 'The symptoms you mentioned most are', btn: 'Explain my summary' }
    : { intro: 'Ye aapka summary aasaan shabdon me hai.', top: 'Aapne sabse zyada ye symptoms bataye:', btn: 'Mera summary samjhao' };
  const summaryText = [sp(ex.intro), latest && latest.summary ? sp(latest.summary) : '',
    syms.length ? sp(ex.top + ' ' + syms.slice(0, 3).map((x) => cap(x[0])).join(', ')) : '',
    ...(latest ? detailsOf(latest).map((d) => sp(d[0] + ': ' + d[1])) : []),
    allQ.length ? sp(u.ask) : '', ...allQ.slice(0, 5).map(sp)].filter(Boolean).join(' ');
  async function copyAll() {
    try {
      const lines = [];
      if (syms.length) lines.push(u.common + ': ' + syms.map((s) => cap(s[0]) + ' (' + s[1] + ')').join(', '), '');
      if (allQ.length) lines.push(u.ask + ':', ...allQ.map((q) => '- ' + q));
      await navigator.clipboard.writeText(lines.join('\n')); setCopied(true); setTimeout(() => setCopied(false), 1800);
    } catch {}
  }

  return (
    <div className="ins">
      <style>{CSS}</style>
      <h1>📊 {u.title}</h1>
      <p className="sub">{u.sub}</p>

      <div className="mode" role="group" aria-label={u.mode}>
        <span>{u.mode}:</span>
        <button className={mode === 'hg' ? 'on' : ''} onClick={() => pickMode('hg')} aria-pressed={mode === 'hg'}>Hinglish</button>
      </div>

      {total === 0 && (
        <section className="card">
          <p style={{ margin: 0, lineHeight: 1.7 }}>{u.empty}</p>
          <div className="row">
            <Link className="lnk" to="/voice">🎙️ {u.goVoice}</Link>
            <Link className="lnk" to="/diary">📔 {u.goDiary}</Link>
          </div>
        </section>
      )}

      {total > 0 && (
        <>
          <div className="row" style={{ marginTop: 0, marginBottom: 16 }}>
            {playing === 'sum' ? <button className="sbtn on" onClick={stopSpeak}>⏹ {u.stop}</button> : <button className="sbtn" onClick={() => speak('sum', summaryText)}>🔊 {ex.btn}</button>}
          </div>          <div className="stats">
            <div className="stat"><small>{u.entries}</small><b>{total}</b></div>
            <div className="stat"><small>{u.voiceN}</small><b>{voice.length}</b></div>
            <div className="stat"><small>{u.avgPain}</small><b>{avg}</b></div>
            <div className="stat"><small>{u.maxPain}</small><b>{max}</b></div>
          </div>

          {latest && latest.summary && (
            <section className="card">
              <h2>{u.latest}</h2>
              <p style={{ margin: '0 0 12px', lineHeight: 1.7 }}>{latest.summary}</p>
              {detailsOf(latest).length > 0 && (
                <div className="det">{detailsOf(latest).map((d, i) => <div key={i}><small>{d[0]}</small><b>{d[1]}</b></div>)}</div>
              )}
            </section>
          )}

          {syms.length > 0 && (
            <section className="card">
              <h2>{u.common}</h2>
              {syms.map(([name, c]) => (
                <div className="bar" key={name}>
                  <span className="n">{cap(name)}</span>
                  <span className="track"><span className="fill" style={{ width: `${Math.round((c / maxC) * 100)}%` }} /></span>
                  <span className="c">{c} {u.times}</span>
                </div>
              ))}
            </section>
          )}

          {allQ.length > 0 && (
            <section className="card ask">
              <h2>{u.allAsk}</h2>
              <p style={{ margin: '0 0 10px', opacity: 0.85 }}>{u.allAskSub}</p>
              <ol>{allQ.map((q, i) => <li key={i}>{q}</li>)}</ol>
              <div className="row">
                {lb('all', [sp(u.ask), ...allQ.map(sp)].join(' '))}
                <button className="sbtn" onClick={copyAll}>{copied ? '✓ ' + u.copied : '📋 ' + u.copy}</button>
              </div>
            </section>
          )}

          {voice.length > 0 && (
            <>
              <h2>{u.byEntry}</h2>
              {voice.map((x, i) => (
                <article className="entry" key={x.id || i}>
                  <div className="ehead">🎙️ {String(x.date || '').slice(0, 10)}</div>
                  <div className="ebody">
                    {x.summary && <p>{x.summary}</p>}
                    {(x.symptoms || []).length > 0 && (
                      <div><h3>{u.symptoms}</h3><div className="chips">{x.symptoms.map((s, k) => <span className="chip" key={k}>{s}</span>)}</div></div>
                    )}
                    {detailsOf(x).length > 0 && <div className="det">{detailsOf(x).map((d, k) => <div key={k}><small>{d[0]}</small><b>{d[1]}</b></div>)}</div>}
                    {(x.doctor_questions || []).length > 0 && (
                      <div className="ask"><h3>{u.ask}</h3><ol>{x.doctor_questions.map((q, k) => <li key={k}>{q}</li>)}</ol></div>
                    )}
                    <div className="row" style={{ marginTop: 0 }}>{lb('e' + i, entryText(x))}</div>
                  </div>
                </article>
              ))}
            </>
          )}

          {pains.length > 1 && (
            <section className="card">
              <h2>{u.chart}</h2>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={pains}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="pain" stroke="#6F315F" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </section>
          )}
          {info && <div className="alert" role="status">{info}</div>}
        </>
      )}

      
    </div>
  );
}
