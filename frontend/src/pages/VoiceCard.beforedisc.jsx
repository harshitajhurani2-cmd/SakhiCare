import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../App";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

const UI = {
  en: { title: "Voice Card", sub: "Just tell me your problem in your own words. I will make a card for your doctor, with what you said and the questions to ask.",
    mode: "Language", mic: "Press and speak", micStop: "Stop", listening: "Listening... speak now",
    hint: "Or type here. Example: my periods are late for 3 months and I have pimples", make: "Make my doctor card",
    busy: "Making your card...", clear: "Start again", listen: "Listen", stop: "Stop", show: "Show to doctor", close: "Close",
    copy: "Copy", copied: "Copied", save: "Save to my diary", saved: "Saved to diary",
    summary: "What you told", symptoms: "Symptoms", since: "Since", severity: "How bad", bleeding: "Bleeding", pain: "Pain (0-10)", period: "Period details",
    tell: "Tell the doctor", ask: "Ask the doctor", tipAsk: "Show this card to the doctor. You can read these out or just point to them.",
    empty: "I could not understand a health problem in this. Please try again with more detail.",
    err: "Could not make the card. Check that the backend is running and try again.",
    micNote: "Voice typing may send your audio to your browser's speech service. You can type instead.",
    noMic: "Voice typing does not work in this browser. Use Chrome or Edge, or type.",
    micDenied: "Microphone is blocked. Allow it in the browser address bar and try again.",
    noVoice: "No voice found on this device. Windows: Settings > Time & language > Speech > Add voices.",
    urgent: "This may be urgent", note: "This card only organises what you said. It is not a diagnosis. In an emergency go to the nearest hospital." },
  hg: { title: "Voice Card", sub: "Bas apni problem apne shabdon me bolo. Main doctor ke liye card bana dungi, jisme aapne jo bola wo aur doctor se poochne ke sawaal honge.",
    mode: "Bhasha", mic: "Dabao aur bolo", micStop: "Roko", listening: "Sun rahi hoon... ab bolo",
    hint: "Ya yahan likho. Jaise: mere periods 3 mahine se late hain aur pimples bahut hain", make: "Mera doctor card banao",
    busy: "Card ban raha hai...", clear: "Dobara shuru karo", listen: "Suno", stop: "Roko", show: "Doctor ko dikhao", close: "Band karo",
    copy: "Copy karo", copied: "Copy ho gaya", save: "Diary me save karo", saved: "Diary me save ho gaya",
    summary: "Aapne kya bataya", symptoms: "Lakshan", since: "Kab se", severity: "Kitna zyada", bleeding: "Khoon", pain: "Dard (0-10)", period: "Period ki details",
    tell: "Doctor ko ye batao", ask: "Doctor se ye poochho", tipAsk: "Ye card doctor ko dikha do. Aap inhe padh sakti ho ya ungli se dikha sakti ho.",
    empty: "Isme koi health problem samajh nahi aayi. Thoda aur detail me dobara bolo.",
    err: "Card nahi ban paya. Backend chalu hai ya nahi dekho aur dobara try karo.",
    micNote: "Bolkar likhne me aapki awaaz browser ki speech service ko ja sakti hai. Chaho to type karo.",
    noMic: "Is browser me bolkar likhna nahi chalta. Chrome ya Edge use karo, ya type karo.",
    micDenied: "Mic band hai. Browser ke address bar me allow karo aur dobara try karo.",
    noVoice: "Is device me awaaz nahi mili. Windows: Settings > Time & language > Speech > Add voices.",
    urgent: "Ye zaroori ho sakta hai", note: "Ye card sirf aapki baat ko vyavasthit karta hai. Ye diagnosis nahi hai. Emergency me najdeeki hospital jao." },
};

const CSS = `
.vc{max-width:900px;margin:0 auto;padding:4px 4px 40px;color:var(--charcoal,#2D2630);animation:vcf .25s ease}
@keyframes vcf{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
.vc h1{font-size:2rem;font-weight:700;color:var(--plum,#6F315F);margin:0 0 6px}
.vc .sub{margin:0 0 16px;opacity:.85;line-height:1.7}
.vc button{font-family:inherit}
.vc .mode{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:18px;font-weight:600;color:var(--plum,#6F315F)}
.vc .mode button{min-height:44px;padding:0 18px;border-radius:999px;border:2px solid var(--plum,#6F315F);background:#fff;color:var(--plum,#6F315F);font-weight:600;cursor:pointer}
.vc .mode button.on{background:var(--plum,#6F315F);color:#fff}
.vc .box{background:#fff;border:1px solid rgba(111,49,95,.15);border-radius:20px;padding:18px;box-shadow:0 4px 18px rgba(111,49,95,.07);margin-bottom:18px}
.vc .bigmic{width:100%;min-height:76px;border-radius:18px;border:2px solid var(--plum,#6F315F);background:var(--blush,#F7E8F0);color:var(--plum,#6F315F);font-size:1.25rem;font-weight:700;cursor:pointer;margin-bottom:12px;transition:.15s}
.vc .bigmic:hover{background:var(--plum,#6F315F);color:#fff}
.vc .bigmic.rec{background:#A12B4B;border-color:#A12B4B;color:#fff;animation:vcp 1.2s infinite}
@keyframes vcp{0%{box-shadow:0 0 0 0 rgba(161,43,75,.5)}70%{box-shadow:0 0 0 14px rgba(161,43,75,0)}100%{box-shadow:0 0 0 0 rgba(161,43,75,0)}}
.vc textarea{width:100%;box-sizing:border-box;min-height:100px;border:1px solid rgba(111,49,95,.25);border-radius:12px;padding:12px;font-family:inherit;font-size:1.05rem;resize:vertical}
.vc textarea:focus{outline:none;border-color:var(--plum,#6F315F);box-shadow:0 0 0 3px rgba(217,92,145,.25)}
.vc .row{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-top:12px}
.vc .btn{min-height:50px;padding:0 24px;border-radius:12px;border:none;background:var(--plum,#6F315F);color:#fff;font-weight:600;font-size:1rem;cursor:pointer;box-shadow:0 4px 12px rgba(111,49,95,.25);transition:.15s}
.vc .btn:hover:not(:disabled){background:#57254B;transform:translateY(-1px)}
.vc .btn:disabled{opacity:.5;cursor:not-allowed;box-shadow:none}
.vc .sbtn{min-height:44px;padding:0 14px;border-radius:10px;border:1px solid var(--plum,#6F315F);background:#fff;color:var(--plum,#6F315F);cursor:pointer;font-weight:600;font-size:.92rem;transition:.15s}
.vc .sbtn:hover,.vc .sbtn.on{background:var(--plum,#6F315F);color:#fff}
.vc .live{color:#A12B4B;font-weight:600}
.vc .alert{border-radius:12px;padding:10px 14px;margin-top:12px;background:#FFF1D6;color:#8A5A00;font-size:.92rem}
.vc .urgent{background:#FDE3E3;color:#8E2B3A;border:2px solid #A12B4B;border-radius:16px;padding:18px;font-weight:600;line-height:1.7;font-size:1.1rem}
.vc .card{background:#fff;border:2px solid var(--plum,#6F315F);border-radius:22px;overflow:hidden;box-shadow:0 8px 28px rgba(111,49,95,.15)}
.vc .chead{background:var(--blush,#F7E8F0);padding:16px 20px}
.vc .chead h2{margin:0;color:var(--plum,#6F315F);font-size:1.25rem}
.vc .cbody{padding:20px;display:grid;gap:18px}
.vc .cbody h3{margin:0 0 8px;font-size:1.05rem;color:var(--plum,#6F315F)}
.vc .cbody p{margin:0;line-height:1.7;font-size:1.05rem}
.vc .chips{display:flex;flex-wrap:wrap;gap:8px}
.vc .chip{background:var(--blush,#F7E8F0);color:var(--plum,#6F315F);padding:8px 14px;border-radius:999px;font-weight:600;font-size:.95rem}
.vc .det{display:grid;gap:10px;grid-template-columns:repeat(auto-fit,minmax(150px,1fr))}
.vc .det div{background:#FBF8FB;border-radius:12px;padding:10px 12px}
.vc .det small{display:block;opacity:.7;font-size:.8rem;margin-bottom:2px}
.vc .det b{font-size:1rem}
.vc ul,.vc ol{margin:0;padding-left:22px;display:grid;gap:8px;line-height:1.65;font-size:1.05rem}
.vc .tell{background:#E6F4ED;border-radius:14px;padding:14px 16px}
.vc .tell h3{color:#1F5D3A}
.vc .ask{background:#FFF1D6;border-radius:14px;padding:14px 16px}
.vc .ask h3{color:#8A5A00}
.vc .foot{font-size:.9rem;opacity:.7;margin-top:16px}
.vc .full{position:fixed;inset:0;z-index:1000;background:#FBF8FB;overflow-y:auto;padding:24px}
.vc .fin{max-width:900px;margin:0 auto;display:grid;gap:22px}
.vc .fin h2{color:var(--plum,#6F315F);font-size:clamp(1.4rem,4vw,2rem);margin:0 0 8px}
.vc .fin li{font-size:clamp(1.3rem,3.6vw,2rem);line-height:1.5;font-weight:600}
.vc button:focus-visible,.vc textarea:focus-visible{outline:2px solid var(--rose,#D95C91);outline-offset:2px}
@media (prefers-reduced-motion:reduce){.vc,.vc .bigmic.rec{animation:none}}
`;

function pickVoice(code) {
  const vs = window.speechSynthesis?.getVoices?.() || [];
  const base = code.split("-")[0];
  return vs.find((v) => v.lang === code) || vs.find((v) => v.lang.toLowerCase().startsWith(base)) || null;
}
const sp = (s) => (/[.?!]$/.test(String(s).trim()) ? String(s).trim() : String(s).trim() + ".");

export default function VoiceCard() {
  const { lang } = useLanguage();
  const [mode, setMode] = useState(() => {
    try { const s = localStorage.getItem("vc_mode"); if (s === "en" || s === "hg") return s; } catch {}
    return lang === "hi" ? "hg" : "en";
  });
  const u = UI[mode];
  const code = mode === "en" ? "en-IN" : "hi-IN";
  const SR = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const [busy, setBusy] = useState(false);
  const [card, setCard] = useState(null);
  const [info, setInfo] = useState("");
  const [playing, setPlaying] = useState(false);
  const [full, setFull] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const recRef = useRef(null);
  const baseRef = useRef("");
  const tokenRef = useRef(0);

  useEffect(() => { window.speechSynthesis?.getVoices?.(); }, []);
  useEffect(() => () => { tokenRef.current++; try { recRef.current?.stop(); window.speechSynthesis?.cancel(); } catch {} }, []);

  function stopSpeak() { tokenRef.current++; try { window.speechSynthesis?.cancel(); } catch {} setPlaying(false); }
  function pickMode(m) {
    stopSpeak(); stopMic(); setInfo(""); setMode(m);
    try { localStorage.setItem("vc_mode", m); } catch {}
  }

  function startMic() {
    if (!SR) { setInfo(u.noMic); return; }
    try {
      if (!localStorage.getItem("mic_notice")) {
        if (!window.confirm(u.micNote)) return;
        localStorage.setItem("mic_notice", "1");
      }
    } catch {}
    stopSpeak(); setInfo("");
    const rec = new SR();
    rec.lang = code; rec.continuous = true; rec.interimResults = true;
    baseRef.current = text ? text.trimEnd() + " " : "";
    rec.onresult = (e) => {
      let s = "";
      for (let i = 0; i < e.results.length; i++) s += e.results[i][0].transcript;
      setText(baseRef.current + s);
    };
    rec.onerror = (e) => {
      if (e.error === "not-allowed" || e.error === "service-not-allowed") setInfo(u.micDenied);
      setListening(false);
    };
    rec.onend = () => setListening(false);
    recRef.current = rec;
    try { rec.start(); setListening(true); } catch { setListening(false); }
  }
  function stopMic() { try { recRef.current?.stop(); } catch {} setListening(false); }

  async function make() {
    const t = text.trim();
    if (!t || busy) return;
    stopMic(); stopSpeak(); setBusy(true); setInfo(""); setCard(null); setSaved(false);
    try {
      const r = await fetch(`${API}/voice/analyze`, { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: t, lang: mode }) });
      if (!r.ok) throw new Error();
      const j = await r.json();
      if (j.error) { setInfo(j.message || u.err); }
      else if (!j.urgent && !j.summary && !(j.symptoms || []).length) { setInfo(u.empty); }
      else setCard({ ...j, raw: t });
    } catch { setInfo(u.err); }
    finally { setBusy(false); }
  }

  function cardText(c) {
    return [sp(u.summary) + " " + sp(c.summary),
      c.symptoms?.length ? sp(u.symptoms) + " " + c.symptoms.map(sp).join(" ") : "",
      c.tell_doctor?.length ? sp(u.tell) + " " + c.tell_doctor.map(sp).join(" ") : "",
      c.doctor_questions?.length ? sp(u.ask) + " " + c.doctor_questions.map(sp).join(" ") : ""].filter(Boolean).join(" ");
  }

  function speakAll(txt) {
    try {
      const synth = window.speechSynthesis;
      const v = pickVoice(code);
      if (!synth || !v) { setInfo(u.noVoice); return; }
      stopSpeak(); setInfo("");
      const token = ++tokenRef.current;
      const chunks = txt.split(/(?<=[.?!])\s+/).map((s) => s.trim()).filter(Boolean);
      let i = 0; setPlaying(true);
      const next = () => {
        if (token !== tokenRef.current) return;
        if (i >= chunks.length) { setPlaying(false); return; }
        const ut = new SpeechSynthesisUtterance(chunks[i]);
        ut.lang = code; ut.voice = v; ut.rate = 0.9;
        ut.onend = () => { i++; next(); };
        ut.onerror = () => { if (token === tokenRef.current) setPlaying(false); };
        synth.speak(ut);
      };
      next();
    } catch { setInfo(u.noVoice); }
  }

  async function copyCard() {
    try {
      const c = card;
      const t = [c.summary, "", u.tell + ":", ...(c.tell_doctor || []).map((x) => "- " + x), "", u.ask + ":", ...(c.doctor_questions || []).map((x) => "- " + x)].join("\n");
      await navigator.clipboard.writeText(t); setCopied(true); setTimeout(() => setCopied(false), 1800);
    } catch {}
  }

  function saveDiary() {
    try {
      const list = JSON.parse(localStorage.getItem("sakhi_voice_diary") || "[]");
      list.unshift({ id: Date.now(), date: new Date().toISOString(), raw: card.raw, summary: card.summary, symptoms: card.symptoms,
        since: card.since, severity: card.severity, bleeding: card.bleeding, pain: card.pain, period_note: card.period_note,
        doctor_questions: card.doctor_questions });
      localStorage.setItem("sakhi_voice_diary", JSON.stringify(list.slice(0, 200)));
      setSaved(true);
    } catch { setInfo(u.err); }
  }

  const c = card;
  const details = c ? [[u.since, c.since], [u.severity, c.severity], [u.bleeding, c.bleeding],
    [u.pain, c.pain === null || c.pain === undefined ? "" : String(c.pain)], [u.period, c.period_note]].filter((d) => d[1]) : [];

  return (
    <div className="vc">
      <style>{CSS}</style>
      <h1>🎙️ {u.title}</h1>
      <p className="sub">{u.sub}</p>

      <div className="mode" role="group" aria-label={u.mode}>
        <span>{u.mode}:</span>
        <button className={mode === "en" ? "on" : ""} onClick={() => pickMode("en")} aria-pressed={mode === "en"}>English</button>
        <button className={mode === "hg" ? "on" : ""} onClick={() => pickMode("hg")} aria-pressed={mode === "hg"}>Hinglish</button>
      </div>

      <section className="box">
        {SR && (
          <button className={`bigmic${listening ? " rec" : ""}`} onClick={listening ? stopMic : startMic}>
            {listening ? <>⏹ {u.micStop}</> : <>🎤 {u.mic}</>}
          </button>
        )}
        {listening && <div className="live">{u.listening}</div>}
        <textarea value={text} onChange={(e) => setText(e.target.value)} maxLength={1500} placeholder={u.hint} aria-label={u.hint} />
        <div className="row">
          <button className="btn" disabled={busy || !text.trim()} onClick={make}>{busy ? u.busy : u.make}</button>
          <button className="sbtn" onClick={() => { stopMic(); stopSpeak(); setText(""); setCard(null); setInfo(""); setSaved(false); }}>{u.clear}</button>
        </div>
        {!SR && <div className="alert">{u.noMic}</div>}
        {info && <div className="alert" role="status">{info}</div>}
      </section>

      {c && c.urgent && (
        <div className="urgent" role="alert">🚨 {u.urgent}<div style={{ marginTop: 8 }}>{c.message}</div></div>
      )}

      {c && !c.urgent && (
        <article className="card">
          <div className="chead"><h2>🩺 {u.title}</h2></div>
          <div className="cbody">
            <section><h3>{u.summary}</h3><p>{c.summary}</p></section>
            {c.symptoms?.length > 0 && (
              <section><h3>{u.symptoms}</h3><div className="chips">{c.symptoms.map((s, i) => <span className="chip" key={i}>{s}</span>)}</div></section>
            )}
            {details.length > 0 && (
              <div className="det">{details.map((d, i) => <div key={i}><small>{d[0]}</small><b>{d[1]}</b></div>)}</div>
            )}
            {c.tell_doctor?.length > 0 && (
              <section className="tell"><h3>{u.tell}</h3><ul>{c.tell_doctor.map((x, i) => <li key={i}>{x}</li>)}</ul></section>
            )}
            {c.doctor_questions?.length > 0 && (
              <section className="ask"><h3>{u.ask}</h3><ol>{c.doctor_questions.map((x, i) => <li key={i}>{x}</li>)}</ol></section>
            )}
            <div className="row" style={{ marginTop: 0 }}>
              {playing
                ? <button className="sbtn on" onClick={stopSpeak}>⏹ {u.stop}</button>
                : <button className="sbtn" onClick={() => speakAll(cardText(c))}>🔊 {u.listen}</button>}
              <button className="sbtn" onClick={() => { stopSpeak(); setFull(true); }}>🔍 {u.show}</button>
              <button className="sbtn" onClick={copyCard}>{copied ? "✓ " + u.copied : "📋 " + u.copy}</button>
              <button className="sbtn" disabled={saved} onClick={saveDiary}>{saved ? "✓ " + u.saved : "📔 " + u.save}</button>
            </div>
          </div>
        </article>
      )}

      <p className="foot">{u.note}</p>

      {full && c && (
        <div className="full" role="dialog" aria-modal="true">
          <div className="fin">
            <div className="row" style={{ marginTop: 0 }}><button className="sbtn" onClick={() => setFull(false)}>✕ {u.close}</button></div>
            <div><h2>{u.summary}</h2><ul><li>{c.summary}</li></ul></div>
            {c.tell_doctor?.length > 0 && <div><h2>{u.tell}</h2><ul>{c.tell_doctor.map((x, i) => <li key={i}>{x}</li>)}</ul></div>}
            {c.doctor_questions?.length > 0 && <div><h2>{u.ask}</h2><ol>{c.doctor_questions.map((x, i) => <li key={i}>{x}</li>)}</ol></div>}
          </div>
        </div>
      )}
    </div>
  );
}
