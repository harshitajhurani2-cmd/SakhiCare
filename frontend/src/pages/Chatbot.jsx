import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../App";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

const T = {
  en: {
    title: "Ask Sakhi", sub: "Type or speak your women's health question. I answer in simple words.",
    hello: "Hi, I am Sakhi. Tell me what you want to understand. You can press the mic and speak.",
    hint: "Type your question here, or press the mic", send: "Send", clear: "Clear chat",
    busy: "Thinking...", err: "Could not reach the server. Please check the backend and try again.",
    src: "Source", listen: "Listen", stop: "Stop", mic: "Speak", micStop: "Stop speaking",
    listening: "Listening... speak now", auto: "Read answers aloud",
    micNote: "Voice typing may send your audio to your browser's speech service. You can type instead if you prefer more privacy.",
    noMic: "Voice typing does not work in this browser. Please use Chrome or Edge, or type.",
    micDenied: "Microphone is blocked. Allow the microphone in your browser address bar and try again.",
    micErr: "Could not hear you. Please try again.",
    noVoice: "No English voice found on this device, so I cannot read aloud.",
    chips: ["What are signs of PCOS?", "My periods are irregular, what should I note?", "When should I see a doctor for breast changes?"],
    note: "Information only, not a diagnosis. In an emergency go to the nearest hospital.",
  },
  hi: {
    title: "सखी से पूछें", sub: "महिला स्वास्थ्य का सवाल लिखें या बोलें। मैं आसान भाषा में जवाब दूँगी।",
    hello: "नमस्ते, मैं सखी हूँ। आप क्या समझना चाहती हैं? माइक दबाकर बोल भी सकती हैं।",
    hint: "यहाँ सवाल लिखें, या माइक दबाएँ", send: "भेजें", clear: "चैट साफ़ करें",
    busy: "सोच रही हूँ...", err: "सर्वर से जुड़ नहीं सका। कृपया बैकएंड जाँचकर फिर कोशिश करें।",
    src: "स्रोत", listen: "सुनें", stop: "रोकें", mic: "बोलें", micStop: "बोलना बंद करें",
    listening: "सुन रही हूँ... अब बोलिए", auto: "जवाब अपने आप सुनाएँ",
    micNote: "बोलकर लिखने में आपकी आवाज़ ब्राउज़र की स्पीच सेवा को जा सकती है। ज़्यादा प्राइवेसी चाहिए तो टाइप करें।",
    noMic: "इस ब्राउज़र में बोलकर लिखना नहीं चलता। कृपया Chrome या Edge इस्तेमाल करें, या टाइप करें।",
    micDenied: "माइक बंद है। ब्राउज़र के एड्रेस बार में माइक की अनुमति दें और फिर कोशिश करें।",
    micErr: "आवाज़ सुनाई नहीं दी। कृपया फिर कोशिश करें।",
    noVoice: "इस डिवाइस में हिंदी आवाज़ नहीं मिली, इसलिए जवाब सुना नहीं सकती। Windows: Settings > Time & language > Speech में हिंदी जोड़ें।",
    chips: ["पीसीओएस के लक्षण क्या हैं?", "पीरियड अनियमित हैं, क्या नोट करूँ?", "स्तन में बदलाव पर डॉक्टर को कब दिखाएँ?"],
    note: "सिर्फ़ जानकारी के लिए, निदान नहीं। आपात स्थिति में नज़दीकी अस्पताल जाएँ।",
  },
};

function pickVoice(code) {
  const vs = window.speechSynthesis?.getVoices?.() || [];
  const base = code.split("-")[0];
  return vs.find((v) => v.lang === code) || vs.find((v) => v.lang.toLowerCase().startsWith(base)) || null;
}

const CSS = `
.cb{max-width:820px;margin:0 auto;padding:8px 4px 40px;color:var(--charcoal,#2D2630);animation:cbfade .25s ease}
@keyframes cbfade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
.cb h1{font-size:2rem;font-weight:700;color:var(--plum,#6F315F);margin:0 0 6px;display:flex;align-items:center;gap:10px}
.cb .ic{width:44px;height:44px;border-radius:12px;background:var(--blush,#F7E8F0);display:inline-flex;align-items:center;justify-content:center;font-size:22px}
.cb .sub{margin:0 0 14px;opacity:.85;line-height:1.6}
.cb .box{background:#fff;border:1px solid var(--border,rgba(111,49,95,.15));border-radius:18px;box-shadow:0 4px 18px rgba(111,49,95,.06)}
.cb .log{height:420px;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px}
.cb .hello{background:var(--blush,#F7E8F0);border-radius:14px;padding:14px;line-height:1.6}
.cb .m{max-width:86%;border-radius:16px;padding:12px 14px;line-height:1.65;white-space:pre-wrap;word-break:break-word}
.cb .m.u{align-self:flex-end;background:var(--plum,#6F315F);color:#fff;border-bottom-right-radius:4px}
.cb .m.b{align-self:flex-start;background:var(--blush,#F7E8F0);border-bottom-left-radius:4px}
.cb .acts{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:8px}
.cb .srcs{font-size:.8rem;color:var(--plum,#6F315F)}
.cb button{font-family:inherit}
.cb .sp{min-height:44px;padding:0 14px;border-radius:10px;border:1px solid var(--plum,#6F315F);background:#fff;color:var(--plum,#6F315F);cursor:pointer;font-weight:500;transition:.15s}
.cb .sp:hover,.cb .sp.on{background:var(--plum,#6F315F);color:#fff}
.cb .bar{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin:12px 0}
.cb .tg{display:flex;gap:8px;align-items:center;font-size:.95rem;cursor:pointer;min-height:44px}
.cb .tg input{width:20px;height:20px;accent-color:var(--plum,#6F315F)}
.cb .chips{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}
.cb .chip{padding:10px 14px;border-radius:999px;border:none;background:var(--blush,#F7E8F0);color:var(--plum,#6F315F);cursor:pointer;font-size:.92rem;transition:.15s;min-height:44px}
.cb .chip:hover{background:var(--plum,#6F315F);color:#fff}
.cb .inp{padding:14px}
.cb textarea{width:100%;box-sizing:border-box;min-height:84px;border:1px solid rgba(111,49,95,.25);border-radius:12px;padding:12px;font-family:inherit;font-size:1.05rem;resize:vertical;background:#fff}
.cb textarea:focus{outline:none;border-color:var(--plum,#6F315F);box-shadow:0 0 0 3px rgba(217,92,145,.25)}
.cb .row{display:flex;gap:10px;margin-top:10px;flex-wrap:wrap;align-items:center}
.cb .mic{min-height:52px;padding:0 20px;border-radius:12px;border:2px solid var(--plum,#6F315F);background:#fff;color:var(--plum,#6F315F);font-weight:600;font-size:1rem;cursor:pointer;display:inline-flex;align-items:center;gap:8px;transition:.15s}
.cb .mic:hover{background:var(--blush,#F7E8F0)}
.cb .mic.rec{background:#A12B4B;border-color:#A12B4B;color:#fff;animation:cbpulse 1.2s infinite}
@keyframes cbpulse{0%{box-shadow:0 0 0 0 rgba(161,43,75,.5)}70%{box-shadow:0 0 0 12px rgba(161,43,75,0)}100%{box-shadow:0 0 0 0 rgba(161,43,75,0)}}
.cb .go{min-height:52px;padding:0 28px;border-radius:12px;border:none;background:var(--plum,#6F315F);color:#fff;font-weight:600;font-size:1rem;cursor:pointer;box-shadow:0 4px 12px rgba(111,49,95,.25);transition:.15s;margin-left:auto}
.cb .go:hover:not(:disabled){background:#57254B;transform:translateY(-1px)}
.cb .go:disabled{opacity:.5;cursor:not-allowed;box-shadow:none}
.cb .live{color:#A12B4B;font-weight:600;font-size:.95rem}
.cb .alert{border-radius:12px;padding:10px 14px;margin-top:10px;background:#FFF1D6;color:#8A5A00;font-size:.92rem}
.cb .foot{font-size:.9rem;opacity:.7;margin-top:12px}
.cb .link{background:none;border:none;color:var(--plum,#6F315F);text-decoration:underline;cursor:pointer;min-height:44px}
.cb button:focus-visible,.cb textarea:focus-visible{outline:2px solid var(--rose,#D95C91);outline-offset:2px}
@media (prefers-reduced-motion:reduce){.cb,.cb .mic.rec{animation:none}}
`;

export default function Chatbot() {
  const { lang } = useLanguage();
  const L = lang === "hi" ? "hi" : "en";
  const t = T[L];
  const SR = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);

  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [listening, setListening] = useState(false);
  const [speakingIdx, setSpeakingIdx] = useState(-1);
  const [auto, setAuto] = useState(() => { try { return localStorage.getItem("chat_auto") !== "0"; } catch { return true; } });
  const [info, setInfo] = useState("");
  const recRef = useRef(null);
  const baseRef = useRef("");
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, busy]);
  useEffect(() => { window.speechSynthesis?.getVoices?.(); }, []);
  useEffect(() => () => { try { recRef.current?.stop(); window.speechSynthesis?.cancel(); } catch {} }, []);
  useEffect(() => { stopSpeak(); stopMic(); setInfo(""); /* eslint-disable-next-line */ }, [L]);

  function speak(textToSay, idx) {
    try {
      const synth = window.speechSynthesis;
      if (!synth) { setInfo(t.noVoice); return; }
      synth.cancel();
      const code = L === "hi" ? "hi-IN" : "en-IN";
      const v = pickVoice(code);
      if (!v) { setInfo(t.noVoice); return; }
      setInfo("");
      const u = new SpeechSynthesisUtterance(textToSay);
      u.lang = code; u.voice = v; u.rate = 0.92;
      u.onstart = () => setSpeakingIdx(idx);
      u.onend = () => setSpeakingIdx(-1);
      u.onerror = () => setSpeakingIdx(-1);
      synth.speak(u);
    } catch { setInfo(t.noVoice); }
  }
  function stopSpeak() { try { window.speechSynthesis?.cancel(); } catch {} setSpeakingIdx(-1); }

  function toggleAuto(v) {
    setAuto(v);
    try { localStorage.setItem("chat_auto", v ? "1" : "0"); } catch {}
    if (!v) stopSpeak();
  }

  async function send(q) {
    const message = (q ?? text).trim();
    if (!message || busy) return;
    stopMic(); stopSpeak();
    const history = msgs.slice(-6).map((m) => ({ role: m.role, text: m.text }));
    const next = [...msgs, { role: "user", text: message }];
    setMsgs(next); setText(""); setBusy(true);
    try {
      const r = await fetch(`${API}/chat`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history, lang: L }),
      });
      if (!r.ok) throw new Error();
      const j = await r.json();
      const say = j.speak_text || j.reply;
      setMsgs((m) => [...m, { role: "model", text: j.reply, speak: say, sources: j.sources || [] }]);
      if (auto) speak(say, next.length);
    } catch {
      setMsgs((m) => [...m, { role: "model", text: t.err, speak: t.err, sources: [] }]);
    } finally { setBusy(false); }
  }

  function startMic() {
    if (!SR) { setInfo(t.noMic); return; }
    try {
      if (!localStorage.getItem("mic_notice")) {
        if (!window.confirm(t.micNote)) return;
        localStorage.setItem("mic_notice", "1");
      }
    } catch {}
    stopSpeak(); setInfo("");
    const rec = new SR();
    rec.lang = L === "hi" ? "hi-IN" : "en-IN";
    rec.continuous = true;
    rec.interimResults = true;
    baseRef.current = text ? text.trimEnd() + " " : "";
    rec.onresult = (e) => {
      let s = "";
      for (let i = 0; i < e.results.length; i++) s += e.results[i][0].transcript;
      setText(baseRef.current + s);
    };
    rec.onerror = (e) => {
      if (e.error === "not-allowed" || e.error === "service-not-allowed") setInfo(t.micDenied);
      else if (e.error !== "aborted") setInfo(t.micErr);
      setListening(false);
    };
    rec.onend = () => setListening(false);
    recRef.current = rec;
    try { rec.start(); setListening(true); } catch { setListening(false); }
  }
  function stopMic() { try { recRef.current?.stop(); } catch {} setListening(false); }

  return (
    <div className="cb">
      <style>{CSS}</style>
      <h1><span className="ic" aria-hidden>🌸</span>{t.title}</h1>
      <p className="sub">{t.sub}</p>

      <div className="box">
        <div className="log" aria-live="polite">
          {msgs.length === 0 && <div className="hello">{t.hello}</div>}
          {msgs.map((m, i) => (
            <div key={i} className={`m ${m.role === "user" ? "u" : "b"}`}>
              {m.text}
              {m.role === "model" && (
                <div className="acts">
                  {speakingIdx === i
                    ? <button className="sp on" onClick={stopSpeak} aria-label={t.stop}>⏹ {t.stop}</button>
                    : <button className="sp" onClick={() => speak(m.speak, i)} aria-label={t.listen}>🔊 {t.listen}</button>}
                  {m.sources?.length > 0 && <span className="srcs">{t.src}: {m.sources.map((s) => `${s.file} p.${s.page}`).join(", ")}</span>}
                </div>
              )}
            </div>
          ))}
          {busy && <div className="m b">{t.busy}</div>}
          <div ref={endRef} />
        </div>
      </div>

      <div className="bar">
        <label className="tg">
          <input type="checkbox" checked={auto} onChange={(e) => toggleAuto(e.target.checked)} />
          {t.auto}
        </label>
        {msgs.length > 0 && <button className="link" onClick={() => { setMsgs([]); stopSpeak(); }}>{t.clear}</button>}
      </div>

      {msgs.length === 0 && (
        <div className="chips">
          {t.chips.map((c) => <button key={c} className="chip" onClick={() => send(c)}>{c}</button>)}
        </div>
      )}

      <div className="box inp">
        <textarea value={text} onChange={(e) => setText(e.target.value)} maxLength={1000}
          placeholder={t.hint} aria-label={t.hint}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} />
        <div className="row">
          {SR && (
            <button type="button" className={`mic${listening ? " rec" : ""}`}
              onClick={listening ? stopMic : startMic} aria-label={listening ? t.micStop : t.mic}>
              {listening ? <>⏹ {t.micStop}</> : <>🎤 {t.mic}</>}
            </button>
          )}
          {listening && <span className="live">{t.listening}</span>}
          <button type="button" className="go" onClick={() => send()} disabled={busy || !text.trim()}>{t.send}</button>
        </div>
        {!SR && <div className="alert">{t.noMic}</div>}
        {info && <div className="alert" role="status">{info}</div>}
      </div>

      
    </div>
  );
}