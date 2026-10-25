import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../App";

const LV = ["u", "u", "u", "u", "u", "s", "s"];

const T = {
  en: {
    title: "Safe Next Steps", sub: "Not sure what to do about a symptom? Tick what you feel and see the safest next step.",
    easyH: "In very simple words",
    easy: ["Some symptoms need a hospital right away.", "Some can wait a day or two, but a doctor should see them.", "Tick what you feel below and press the button.", "This page does not tell you what disease you have."],
    checkH: "Symptom checklist", checkSub: "Tick everything you feel right now.",
    sym: ["Very heavy bleeding (a pad soaked every hour or two)", "Severe belly pain", "High fever", "Dizziness or fainting", "Difficulty breathing", "A lump or pain in the breast", "Periods very irregular or stopped"],
    check: "Show my next step", reset: "Clear all",
    resH: "Your next step", picked: "You ticked",
    uT: "Please get medical help now", uD: "Go to the nearest hospital or call 112 now. Ask someone to go with you. Do not wait.",
    sT: "Please see a doctor soon", sD: "This is not an emergency by itself, but a doctor should check it in the next few days. Note it in your Diary and take the notes to the doctor.",
    kT: "Nothing ticked", kD: "If you feel fine, keep noting how you feel in your Diary. If something changes, come back and tick it.",
    emergH: "Emergency warning signs", emerg: ["Bleeding that does not stop", "Severe pain with fainting", "Difficulty breathing", "Thoughts of hurting yourself"],
    docH: "Before you see the doctor", docSub: "Keep these ready:",
    doc: ["Your symptoms list, and since when", "Questions you want to ask", "Medicines you already take", "Old reports and your health card"],
    helpH: "Helplines", women: "Women Helpline", emNo: "Emergency", call: "Call",
    listen: "Listen", stop: "Stop", pause: "Pause", resume: "Resume", readAll: "Read the whole page",
    speed: "Voice speed", slow: "Slow", normal: "Normal", fast: "Fast",
    noVoice: "No voice found on this device. Windows: Settings > Time & language > Speech > Add voices.",
    note: "Information only, not a diagnosis. In an emergency go to the nearest hospital.",
  },
  hi: {
    title: "सुरक्षित अगला कदम", sub: "किसी लक्षण पर समझ नहीं आ रहा क्या करें? जो महसूस हो उसे चुनें और सबसे सुरक्षित अगला कदम देखें।",
    easyH: "बहुत आसान भाषा में",
    easy: ["कुछ लक्षणों में तुरंत अस्पताल जाना चाहिए।", "कुछ लक्षण एक-दो दिन रुक सकते हैं, पर डॉक्टर को दिखाना चाहिए।", "नीचे जो महसूस हो उसे चुनें और बटन दबाएँ।", "यह पेज यह नहीं बताता कि आपको कौन सी बीमारी है।"],
    checkH: "लक्षणों की सूची", checkSub: "अभी जो भी महसूस हो रहा है, सब चुनें।",
    sym: ["बहुत ज़्यादा खून (हर 1-2 घंटे में पैड भीगना)", "पेट में बहुत तेज़ दर्द", "तेज़ बुखार", "चक्कर आना या बेहोशी", "साँस लेने में तकलीफ़", "स्तन में गाँठ या दर्द", "पीरियड बहुत अनियमित या बंद"],
    check: "मेरा अगला कदम दिखाएँ", reset: "सब हटाएँ",
    resH: "आपका अगला कदम", picked: "आपने चुना",
    uT: "कृपया अभी चिकित्सा मदद लें", uD: "नज़दीकी अस्पताल जाएँ या अभी 112 पर फ़ोन करें। किसी को साथ ले जाएँ। इंतज़ार न करें।",
    sT: "कृपया जल्दी डॉक्टर को दिखाएँ", sD: "यह अपने आप में आपात स्थिति नहीं है, पर अगले कुछ दिनों में डॉक्टर से जाँच करानी चाहिए। इसे डायरी में लिखें और नोट्स डॉक्टर को दिखाएँ।",
    kT: "कुछ नहीं चुना", kD: "अगर आप ठीक महसूस कर रही हैं, तो डायरी में अपनी हालत लिखती रहें। कुछ बदले तो यहाँ आकर चुनें।",
    emergH: "आपात चेतावनी के संकेत", emerg: ["खून जो रुक न रहा हो", "तेज़ दर्द के साथ बेहोशी", "साँस लेने में तकलीफ़", "खुद को नुकसान पहुँचाने के विचार"],
    docH: "डॉक्टर से मिलने से पहले", docSub: "ये चीज़ें तैयार रखें:",
    doc: ["आपके लक्षण और कब से हैं", "आप जो सवाल पूछना चाहती हैं", "जो दवाइयाँ आप पहले से ले रही हैं", "पुरानी रिपोर्ट और स्वास्थ्य कार्ड"],
    helpH: "हेल्पलाइन", women: "महिला हेल्पलाइन", emNo: "आपातकालीन", call: "फ़ोन करें",
    listen: "सुनें", stop: "रोकें", pause: "थोड़ा रुकें", resume: "फिर शुरू करें", readAll: "पूरा पेज सुनें",
    speed: "आवाज़ की गति", slow: "धीमी", normal: "सामान्य", fast: "तेज़",
    noVoice: "इस डिवाइस में हिंदी आवाज़ नहीं मिली। Windows: Settings > Time & language > Speech > Add voices।",
    note: "सिर्फ़ जानकारी के लिए, निदान नहीं। आपात स्थिति में नज़दीकी अस्पताल जाएँ।",
  },
};

const CSS = `
.sn{max-width:900px;margin:0 auto;padding:4px 4px 40px;color:var(--charcoal,#2D2630);animation:snf .25s ease}
@keyframes snf{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
.sn h1{font-size:2rem;font-weight:700;color:var(--plum,#6F315F);margin:0 0 6px}
.sn h2{font-size:1.2rem;color:var(--plum,#6F315F);margin:0 0 10px}
.sn .sub{margin:0 0 16px;opacity:.85;line-height:1.7}
.sn button{font-family:inherit}
.sn .card{background:#fff;border:1px solid rgba(111,49,95,.15);border-radius:20px;padding:18px;box-shadow:0 4px 18px rgba(111,49,95,.07);margin-bottom:16px}
.sn .sec{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:10px}
.sn .sec h2{margin:0}
.sn .ez{background:#E6F4ED;border-color:rgba(31,93,58,.2)}
.sn .ez h2{color:#1F5D3A}
.sn ol,.sn ul{margin:0;padding-left:22px;display:grid;gap:8px;line-height:1.7;font-size:1.05rem}
.sn .player{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-bottom:16px;padding:12px;background:var(--blush,#F7E8F0);border-radius:14px}
.sn .spd{display:flex;gap:6px;align-items:center;flex-wrap:wrap;font-size:.9rem}
.sn .spd button{min-height:40px;padding:0 12px;border-radius:999px;border:1px solid rgba(111,49,95,.3);background:#fff;color:var(--plum,#6F315F);cursor:pointer;font-weight:500}
.sn .spd button.on{background:var(--plum,#6F315F);color:#fff;border-color:var(--plum,#6F315F)}
.sn .sbtn{min-height:44px;padding:0 14px;border-radius:10px;border:1px solid var(--plum,#6F315F);background:#fff;color:var(--plum,#6F315F);cursor:pointer;font-weight:600;font-size:.92rem;transition:.15s}
.sn .sbtn:hover,.sn .sbtn.on{background:var(--plum,#6F315F);color:#fff}
.sn .grid{display:grid;gap:10px;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));margin-bottom:14px}
.sn .opt{display:flex;align-items:center;gap:12px;padding:12px 14px;border:2px solid rgba(111,49,95,.18);border-radius:14px;background:#fff;cursor:pointer;min-height:56px;line-height:1.5;transition:.15s}
.sn .opt:hover{background:#FBF8FB;border-color:var(--rose,#D95C91)}
.sn .opt.on{border-color:var(--plum,#6F315F);background:var(--blush,#F7E8F0)}
.sn .opt input{width:22px;height:22px;accent-color:var(--plum,#6F315F);flex-shrink:0}
.sn .row{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
.sn .btn{min-height:50px;padding:0 26px;border-radius:12px;border:none;background:var(--plum,#6F315F);color:#fff;font-weight:600;font-size:1rem;cursor:pointer;box-shadow:0 4px 12px rgba(111,49,95,.25);transition:.15s}
.sn .btn:hover{background:#57254B;transform:translateY(-1px)}
.sn .res{border-radius:20px;padding:18px;margin-bottom:16px;border:2px solid}
.sn .res h2{font-size:1.35rem;margin-bottom:6px}
.sn .res p{margin:0 0 10px;line-height:1.7;font-size:1.05rem}
.sn .res.u{background:#FDE3E3;border-color:#A12B4B;color:#8E2B3A}
.sn .res.u h2{color:#8E2B3A}
.sn .res.s{background:#FFF1D6;border-color:#C98A00;color:#8A5A00}
.sn .res.s h2{color:#8A5A00}
.sn .res.k{background:#E6F4ED;border-color:#1F5D3A;color:#1F5D3A}
.sn .res.k h2{color:#1F5D3A}
.sn .picked{font-size:.95rem;margin-bottom:10px}
.sn .warn{background:#FDE3E3;border-color:rgba(161,43,75,.3)}
.sn .warn h2{color:#8E2B3A}
.sn .help{display:grid;gap:10px;grid-template-columns:repeat(auto-fit,minmax(220px,1fr))}
.sn .call{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:14px;border-radius:14px;background:var(--blush,#F7E8F0);text-decoration:none;color:var(--plum,#6F315F);font-weight:600;min-height:56px}
.sn .call b{font-size:1.5rem}
.sn .call:hover{background:var(--plum,#6F315F);color:#fff}
.sn .alert{border-radius:12px;padding:10px 14px;margin-bottom:12px;background:#FFF1D6;color:#8A5A00;font-size:.92rem}
.sn .foot{font-size:.9rem;opacity:.7;margin-top:14px}
.sn button:focus-visible,.sn input:focus-visible,.sn a:focus-visible{outline:2px solid var(--rose,#D95C91);outline-offset:2px}
@media (prefers-reduced-motion:reduce){.sn{animation:none}}
`;

function pickVoice(code) {
  const vs = window.speechSynthesis?.getVoices?.() || [];
  const base = code.split("-")[0];
  return vs.find((v) => v.lang === code) || vs.find((v) => v.lang.toLowerCase().startsWith(base)) || null;
}
const sp = (s) => (/[.?!।]$/.test(String(s).trim()) ? String(s).trim() : String(s).trim() + ".");

export default function SafeNextSteps() {
  const { lang } = useLanguage();
  const L = lang === "hi" ? "hi" : "en";
  const u = T[L];
  const code = L === "hi" ? "hi-IN" : "en-IN";
  const [sel, setSel] = useState({});
  const [res, setRes] = useState(null);
  const [playing, setPlaying] = useState(null);
  const [paused, setPaused] = useState(false);
  const [rate, setRate] = useState(0.9);
  const [info, setInfo] = useState("");
  const rateRef = useRef(0.9);
  const tokenRef = useRef(0);

  useEffect(() => { window.speechSynthesis?.getVoices?.(); }, []);
  useEffect(() => () => { tokenRef.current++; try { window.speechSynthesis?.cancel(); } catch {} }, []);
  useEffect(() => { stopSpeak(); setInfo(""); /* eslint-disable-next-line */ }, [L]);

  function stopSpeak() { tokenRef.current++; try { window.speechSynthesis?.cancel(); } catch {} setPlaying(null); setPaused(false); }
  function changeRate(r) { setRate(r); rateRef.current = r; }
  function speak(key, txt) {
    try {
      const synth = window.speechSynthesis;
      const v = pickVoice(code);
      if (!synth || !v) { setInfo(u.noVoice); return; }
      stopSpeak(); setInfo("");
      const token = ++tokenRef.current;
      const chunks = txt.split(/(?<=[.?!।])\s+/).map((s) => s.trim()).filter(Boolean);
      let i = 0; setPlaying(key); setPaused(false);
      const next = () => {
        if (token !== tokenRef.current) return;
        if (i >= chunks.length) { setPlaying(null); return; }
        const ut = new SpeechSynthesisUtterance(chunks[i]);
        ut.lang = code; ut.voice = v; ut.rate = rateRef.current;
        ut.onend = () => { i++; next(); };
        ut.onerror = () => { if (token === tokenRef.current) setPlaying(null); };
        synth.speak(ut);
      };
      next();
    } catch { setInfo(u.noVoice); }
  }
  function pauseSpeak() { try { window.speechSynthesis.pause(); setPaused(true); } catch {} }
  function resumeSpeak() { try { window.speechSynthesis.resume(); setPaused(false); } catch {} }

  const ids = Object.keys(sel).filter((k) => sel[k]).map(Number);
  function check() {
    stopSpeak();
    if (!ids.length) setRes("k");
    else if (ids.some((i) => LV[i] === "u")) setRes("u");
    else setRes("s");
  }
  const lb = (key, txt) => (playing === key
    ? <button className="sbtn on" onClick={stopSpeak}>⏹ {u.stop}</button>
    : <button className="sbtn" onClick={() => speak(key, txt)}>🔊 {u.listen}</button>);

  const resT = res === "u" ? u.uT : res === "s" ? u.sT : u.kT;
  const resD = res === "u" ? u.uD : res === "s" ? u.sD : u.kD;
  const pickedTxt = ids.map((i) => u.sym[i]).join(", ");
  const resSpeak = [sp(resT), sp(resD), pickedTxt ? sp(u.picked + ": " + pickedTxt) : ""].filter(Boolean).join(" ");
  const easyTxt = u.easy.map(sp).join(" ");
  const emergTxt = [sp(u.emergH), ...u.emerg.map(sp)].join(" ");
  const docTxt = [sp(u.docH), sp(u.docSub), ...u.doc.map(sp)].join(" ");
  const helpTxt = sp(u.helpH) + " " + sp(u.women + " 181") + " " + sp(u.emNo + " 112");
  const allTxt = [sp(u.title), easyTxt, emergTxt, docTxt, helpTxt].join(" ");

  return (
    <div className="sn">
      <style>{CSS}</style>
      <h1>🛡️ {u.title}</h1>
      <p className="sub">{u.sub}</p>

      <div className="player">
        {playing === "all"
          ? <button className="sbtn on" onClick={stopSpeak}>⏹ {u.stop}</button>
          : <button className="sbtn" onClick={() => speak("all", allTxt)}>🔊 {u.readAll}</button>}
        {playing && (paused
          ? <button className="sbtn" onClick={resumeSpeak}>▶ {u.resume}</button>
          : <button className="sbtn" onClick={pauseSpeak}>⏸ {u.pause}</button>)}
        <div className="spd" role="group" aria-label={u.speed}>
          <span>{u.speed}:</span>
          {[[0.7, u.slow], [0.9, u.normal], [1.15, u.fast]].map(([r, t]) => (
            <button key={r} className={rate === r ? "on" : ""} onClick={() => changeRate(r)} aria-pressed={rate === r}>{t}</button>
          ))}
        </div>
      </div>
      {info && <div className="alert" role="status">{info}</div>}

      <section className="card ez">
        <div className="sec"><h2>{u.easyH}</h2>{lb("easy", easyTxt)}</div>
        <ol>{u.easy.map((s, i) => <li key={i}>{s}</li>)}</ol>
      </section>

      <section className="card">
        <div className="sec"><h2>{u.checkH}</h2></div>
        <p style={{ margin: "0 0 12px", opacity: 0.85 }}>{u.checkSub}</p>
        <div className="grid">
          {u.sym.map((s, i) => (
            <label key={i} className={`opt${sel[i] ? " on" : ""}`}>
              <input type="checkbox" checked={!!sel[i]} onChange={(e) => { setSel({ ...sel, [i]: e.target.checked }); setRes(null); }} />
              <span>{s}</span>
            </label>
          ))}
        </div>
        <div className="row">
          <button className="btn" onClick={check}>{u.check}</button>
          <button className="sbtn" onClick={() => { stopSpeak(); setSel({}); setRes(null); }}>{u.reset}</button>
        </div>
      </section>

      {res && (
        <section className={`res ${res}`} role="status">
          <h2>{res === "u" ? "🚨" : res === "s" ? "⚠️" : "✅"} {resT}</h2>
          <p>{resD}</p>
          {pickedTxt && <div className="picked"><b>{u.picked}:</b> {pickedTxt}</div>}
          {lb("res", resSpeak)}
        </section>
      )}

      <section className="card warn">
        <div className="sec"><h2>🚨 {u.emergH}</h2>{lb("em", emergTxt)}</div>
        <ul>{u.emerg.map((s, i) => <li key={i}>{s}</li>)}</ul>
      </section>

      <section className="card">
        <div className="sec"><h2>📋 {u.docH}</h2>{lb("doc", docTxt)}</div>
        <p style={{ margin: "0 0 8px" }}>{u.docSub}</p>
        <ul>{u.doc.map((s, i) => <li key={i}>{s}</li>)}</ul>
      </section>

      <section className="card">
        <div className="sec"><h2>📞 {u.helpH}</h2>{lb("help", helpTxt)}</div>
        <div className="help">
          <a className="call" href="tel:181"><span>{u.women}</span><b>181</b></a>
          <a className="call" href="tel:112"><span>{u.emNo}</span><b>112</b></a>
        </div>
      </section>

      
    </div>
  );
}
