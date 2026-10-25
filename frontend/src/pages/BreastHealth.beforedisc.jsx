import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../App";
import { breastPredict, breastReference } from "../api";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Legend } from "recharts";

const T = {
  en: {
    title: "Breast Health", sub: "Learn how to notice changes early. Awareness first, a learning demo second.",
    easyH: "In very simple words",
    easy: ["Know how your breasts normally look and feel.", "Check once a month, a few days after your period ends.", "If you find a new lump or any change, do not be afraid and do not wait. See a doctor.", "Most lumps are not cancer, but a doctor must check each one."],
    stepsH: "How to check yourself",
    steps: ["Stand in front of a mirror. Look at the shape, skin and nipples.", "Raise your arms and look again for any change.", "Lie down. With the flat of your three middle fingers, press gently in small circles over the whole breast.", "Also check up to the armpit and the collarbone.", "Do the same on the other side. Note anything new."],
    seeH: "See a doctor if you notice",
    see: ["A new lump in the breast or armpit", "Skin dimpling, redness or swelling that does not go away", "A nipple turning inward, or bloody discharge", "Pain in one place that does not go away"],
    mfH: "Myth or fact", myth: "Myth", fact: "Fact",
    myths: [{ m: "Breast cancer happens only to older women.", f: "It is more common with age, but can happen earlier. Notice changes at any age." }, { m: "Every lump means cancer.", f: "Most lumps are harmless, but every new lump must be checked." }, { m: "If it does not hurt, it is nothing.", f: "Many serious lumps are painless. Painless does not mean safe." }],
    demoH: "Learning demo (advanced)",
    demoWarn: "These 30 numbers come from a lab image analysis of a cell sample. You cannot measure them at home. This demo only shows how a computer model works. It is not a test and not a diagnosis.",
    open: "Open the demo", close: "Close the demo",
    sB: "Load a benign sample", sM: "Load a malignant sample", sA: "Load an average sample",
    sliders: "Adjust the numbers", chartH: "Your values compared to average samples", you: "Your values", ben: "Benign average", mal: "Malignant average",
    resH: "Demo result", loading: "Calculating...", none: "Load a sample or move a slider to see the demo result.",
    bT: { benign: "Low concern in this demo", uncertain: "Not clear in this demo", strong: "High concern in this demo" },
    bD: { benign: "The model leans towards harmless for these numbers. This is only a demo. A real check needs a doctor.", uncertain: "The model is not sure. Only a doctor with proper tests can tell. Please do not rely on this.", strong: "The model leans towards concern for these numbers. This is only a demo, but please see a doctor for any real worry." },
    offline: "Cannot reach the backend. Please check that it is running.", serverErr: "The server gave an error. Please try again.",
    listen: "Listen", stop: "Stop", pause: "Pause", resume: "Resume", readAll: "Read the whole page",
    speed: "Voice speed", slow: "Slow", normal: "Normal", fast: "Fast",
    noVoice: "No voice found on this device. Windows: Settings > Time & language > Speech > Add voices.",
    note: "Educational demo only. Not a diagnosis. For any change in your breast, please see a doctor.",
  },
  hi: {
    title: "स्तन स्वास्थ्य", sub: "बदलाव जल्दी पहचानना सीखें। पहले जागरूकता, फिर सीखने के लिए एक डेमो।",
    easyH: "बहुत आसान भाषा में",
    easy: ["जानें कि आपके स्तन आम तौर पर कैसे दिखते और महसूस होते हैं।", "महीने में एक बार, पीरियड ख़त्म होने के कुछ दिन बाद जाँचें।", "नई गाँठ या कोई भी बदलाव दिखे तो डरें नहीं और रुकें भी नहीं। डॉक्टर को दिखाएँ।", "ज़्यादातर गाँठें कैंसर नहीं होतीं, पर हर गाँठ डॉक्टर को दिखानी चाहिए।"],
    stepsH: "खुद जाँच कैसे करें",
    steps: ["शीशे के सामने खड़ी हों। आकार, त्वचा और निप्पल देखें।", "हाथ ऊपर उठाकर फिर देखें कि कोई बदलाव तो नहीं।", "लेट जाएँ। बीच की तीन उँगलियों के सपाट हिस्से से, छोटे गोल घेरों में पूरे स्तन को हल्के से दबाकर देखें।", "बगल और कॉलर बोन तक भी जाँचें।", "दूसरी तरफ़ भी यही करें। कुछ नया लगे तो नोट करें।"],
    seeH: "डॉक्टर को दिखाएँ अगर दिखे",
    see: ["स्तन या बगल में नई गाँठ", "त्वचा में गड्ढा, लालिमा या सूजन जो ठीक न हो", "निप्पल का अंदर धँसना, या खून जैसा स्राव", "एक जगह दर्द जो ठीक न हो"],
    mfH: "मिथक या सच", myth: "मिथक", fact: "सच",
    myths: [{ m: "स्तन कैंसर सिर्फ़ बड़ी उम्र की महिलाओं को होता है।", f: "उम्र के साथ बढ़ता है, पर पहले भी हो सकता है। किसी भी उम्र में बदलाव पर ध्यान दें।" }, { m: "हर गाँठ का मतलब कैंसर है।", f: "ज़्यादातर गाँठें हानिरहित होती हैं, पर हर नई गाँठ की जाँच ज़रूरी है।" }, { m: "दर्द न हो तो कुछ नहीं है।", f: "कई गंभीर गाँठों में दर्द नहीं होता। दर्द न होना सुरक्षित होना नहीं है।" }],
    demoH: "सीखने का डेमो (एडवांस्ड)",
    demoWarn: "ये 30 संख्याएँ कोशिका के नमूने की लैब इमेज जाँच से आती हैं। इन्हें घर पर नापा नहीं जा सकता। यह डेमो सिर्फ़ दिखाता है कि कंप्यूटर मॉडल कैसे काम करता है। यह कोई जाँच या निदान नहीं है।",
    open: "डेमो खोलें", close: "डेमो बंद करें",
    sB: "सौम्य (बिनाइन) नमूना लोड करें", sM: "घातक (मैलिग्नेंट) नमूना लोड करें", sA: "औसत नमूना लोड करें",
    sliders: "संख्याएँ बदलें", chartH: "आपकी वैल्यू और औसत नमूनों की तुलना", you: "आपकी वैल्यू", ben: "सौम्य औसत", mal: "घातक औसत",
    resH: "डेमो का नतीजा", loading: "गणना हो रही है...", none: "डेमो का नतीजा देखने के लिए नमूना लोड करें या स्लाइडर हिलाएँ।",
    bT: { benign: "इस डेमो में चिंता कम", uncertain: "इस डेमो में साफ़ नहीं", strong: "इस डेमो में चिंता ज़्यादा" },
    bD: { benign: "इन संख्याओं पर मॉडल हानिरहित की ओर झुकता है। यह सिर्फ़ डेमो है। असली जाँच डॉक्टर ही कर सकते हैं।", uncertain: "मॉडल को पक्का नहीं है। सही जाँच के साथ सिर्फ़ डॉक्टर बता सकते हैं। कृपया इस पर भरोसा न करें।", strong: "इन संख्याओं पर मॉडल चिंता की ओर झुकता है। यह सिर्फ़ डेमो है, पर असली चिंता हो तो कृपया डॉक्टर को दिखाएँ।" },
    offline: "बैकएंड से जुड़ नहीं सका। कृपया जाँचें कि वह चल रहा है।", serverErr: "सर्वर में गड़बड़ी आई। कृपया दोबारा कोशिश करें।",
    listen: "सुनें", stop: "रोकें", pause: "थोड़ा रुकें", resume: "फिर शुरू करें", readAll: "पूरा पेज सुनें",
    speed: "आवाज़ की गति", slow: "धीमी", normal: "सामान्य", fast: "तेज़",
    noVoice: "इस डिवाइस में हिंदी आवाज़ नहीं मिली। Windows: Settings > Time & language > Speech > Add voices।",
    note: "सिर्फ़ सीखने का डेमो। निदान नहीं। स्तन में कोई भी बदलाव हो तो कृपया डॉक्टर को दिखाएँ।",
  },
};

const CSS = `
.bh{max-width:900px;margin:0 auto;padding:4px 4px 40px;color:var(--charcoal,#2D2630);animation:bhf .25s ease}
@keyframes bhf{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
.bh h1{font-size:2rem;font-weight:700;color:var(--plum,#6F315F);margin:0 0 6px}
.bh h2{font-size:1.2rem;color:var(--plum,#6F315F);margin:0 0 10px}
.bh .sub{margin:0 0 16px;opacity:.85;line-height:1.7}
.bh button{font-family:inherit}
.bh .card{background:#fff;border:1px solid rgba(111,49,95,.15);border-radius:20px;padding:18px;box-shadow:0 4px 18px rgba(111,49,95,.07);margin-bottom:16px}
.bh .sec{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:10px}
.bh .sec h2{margin:0}
.bh .ez{background:#E6F4ED;border-color:rgba(31,93,58,.2)}
.bh .ez h2{color:#1F5D3A}
.bh .see{background:#FFF1D6;border-color:rgba(201,138,0,.3)}
.bh .see h2{color:#8A5A00}
.bh ol,.bh ul{margin:0;padding-left:22px;display:grid;gap:8px;line-height:1.7;font-size:1.05rem}
.bh .player{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-bottom:16px;padding:12px;background:var(--blush,#F7E8F0);border-radius:14px}
.bh .spd{display:flex;gap:6px;align-items:center;flex-wrap:wrap;font-size:.9rem}
.bh .spd button{min-height:40px;padding:0 12px;border-radius:999px;border:1px solid rgba(111,49,95,.3);background:#fff;color:var(--plum,#6F315F);cursor:pointer;font-weight:500}
.bh .spd button.on{background:var(--plum,#6F315F);color:#fff;border-color:var(--plum,#6F315F)}
.bh .sbtn{min-height:44px;padding:0 14px;border-radius:10px;border:1px solid var(--plum,#6F315F);background:#fff;color:var(--plum,#6F315F);cursor:pointer;font-weight:600;font-size:.92rem;transition:.15s}
.bh .sbtn:hover,.bh .sbtn.on{background:var(--plum,#6F315F);color:#fff}
.bh .mf{display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(250px,1fr))}
.bh .mfc{border-radius:14px;padding:14px;border:1px solid rgba(111,49,95,.15);background:#fff}
.bh .tag{display:inline-block;font-size:.78rem;font-weight:700;padding:3px 10px;border-radius:999px;margin-bottom:8px}
.bh .tag.m{background:#FDE3E3;color:#8E2B3A}
.bh .tag.f{background:#E6F4ED;color:#1F5D3A}
.bh .mfc p{margin:0 0 10px;line-height:1.6}
.bh .warn{background:#FDE3E3;color:#8E2B3A;border-radius:14px;padding:14px;line-height:1.7;font-weight:500;margin-bottom:12px}
.bh .row{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:12px}
.bh .btn{min-height:50px;padding:0 24px;border-radius:12px;border:none;background:var(--plum,#6F315F);color:#fff;font-weight:600;font-size:1rem;cursor:pointer;box-shadow:0 4px 12px rgba(111,49,95,.25);transition:.15s}
.bh .btn:hover{background:#57254B;transform:translateY(-1px)}
.bh .sl{display:grid;gap:10px;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));margin-top:10px}
.bh .sl label{display:block;font-size:.88rem;font-weight:600;margin-bottom:2px}
.bh .sl input[type=range]{width:100%;accent-color:var(--plum,#6F315F)}
.bh .sl small{opacity:.7}
.bh .res{border-radius:20px;padding:18px;margin-bottom:16px;border:2px solid}
.bh .res h2{font-size:1.3rem;margin-bottom:6px}
.bh .res p{margin:0 0 10px;line-height:1.7;font-size:1.05rem}
.bh .res.benign{background:#E6F4ED;border-color:#1F5D3A;color:#1F5D3A}
.bh .res.benign h2{color:#1F5D3A}
.bh .res.uncertain{background:#FFF1D6;border-color:#C98A00;color:#8A5A00}
.bh .res.uncertain h2{color:#8A5A00}
.bh .res.strong{background:#FDE3E3;border-color:#A12B4B;color:#8E2B3A}
.bh .res.strong h2{color:#8E2B3A}
.bh .alert{border-radius:12px;padding:10px 14px;margin-bottom:12px;background:#FFF1D6;color:#8A5A00;font-size:.92rem}
.bh .foot{font-size:.9rem;opacity:.7;margin-top:14px}
.bh button:focus-visible,.bh input:focus-visible{outline:2px solid var(--rose,#D95C91);outline-offset:2px}
@media (prefers-reduced-motion:reduce){.bh{animation:none}}
`;

function pickVoice(code) {
  const vs = window.speechSynthesis?.getVoices?.() || [];
  const base = code.split("-")[0];
  return vs.find((v) => v.lang === code) || vs.find((v) => v.lang.toLowerCase().startsWith(base)) || null;
}
const sp = (s) => (/[.?!।]$/.test(String(s).trim()) ? String(s).trim() : String(s).trim() + ".");
const bandOf = (p) => (p >= 0.9 ? "strong" : p >= 0.1 ? "uncertain" : "benign");

export default function BreastHealth() {
  const { lang } = useLanguage();
  const L = lang === "hi" ? "hi" : "en";
  const u = T[L];
  const code = L === "hi" ? "hi-IN" : "en-IN";
  const [ref, setRef] = useState([]);
  const [vals, setVals] = useState(Array(30).fill(0));
  const [res, setRes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(null);
  const [paused, setPaused] = useState(false);
  const [rate, setRate] = useState(0.9);
  const [info, setInfo] = useState("");
  const timerRef = useRef(null);
  const rateRef = useRef(0.9);
  const tokenRef = useRef(0);

  useEffect(() => { window.speechSynthesis?.getVoices?.(); }, []);
  useEffect(() => () => { clearTimeout(timerRef.current); tokenRef.current++; try { window.speechSynthesis?.cancel(); } catch {} }, []);
  useEffect(() => { stopSpeak(); setInfo(""); /* eslint-disable-next-line */ }, [L]);
  useEffect(() => {
    let alive = true;
    Promise.resolve(breastReference()).then((r) => {
      const arr = Array.isArray(r) ? r : (r && Array.isArray(r.data) ? r.data : []);
      if (alive && arr.length === 30) { setRef(arr); setVals(arr.map((x) => x.mean_all)); }
    }).catch(() => { if (alive) setErr(u.offline); });
    return () => { alive = false; };
    // eslint-disable-next-line
  }, []);

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

  async function predict(v) {
    setLoading(true); setErr("");
    try {
      const r = await breastPredict(v);
      if (!r || typeof r.malignant_probability !== "number") throw new Error("bad");
      setRes(r);
      try {
        localStorage.setItem("breast_last", JSON.stringify({
          band: bandOf(r.malignant_probability), prob: r.malignant_probability, inputs: v, timestamp: new Date().toISOString(),
        }));
      } catch {}
    } catch (e) {
      setErr(e && e.code === "OFFLINE" ? u.offline : u.serverErr);
    } finally { setLoading(false); }
  }
  function setVal(i, x) {
    const nv = vals.map((a, k) => (k === i ? Number(x) : a));
    setVals(nv);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => predict(nv), 400);
  }
  function loadSample(type) {
    if (ref.length !== 30) return;
    const nv = ref.map((r) => (type === "b" ? r.mean_benign : type === "m" ? r.mean_malignant : r.mean_all));
    setVals(nv); predict(nv);
  }

  const norm = (x, r) => Math.max(0, Math.min(100, ((x - r.min) / (r.max - r.min || 1)) * 100));
  const radar = ref.length === 30 ? ref.slice(0, 10).map((r, i) => ({
    name: r.name.replace("mean ", ""), you: norm(vals[i], r), ben: norm(r.mean_benign, r), mal: norm(r.mean_malignant, r),
  })) : [];
  const band = res ? bandOf(res.malignant_probability) : null;

  const easyTxt = u.easy.map(sp).join(" ");
  const stepsTxt = [sp(u.stepsH), ...u.steps.map(sp)].join(" ");
  const seeTxt = [sp(u.seeH), ...u.see.map(sp)].join(" ");
  const mythTxt = u.myths.map((x) => `${u.myth}: ${sp(x.m)} ${u.fact}: ${sp(x.f)}`).join(" ");
  const resTxt = band ? sp(u.bT[band]) + " " + sp(u.bD[band]) : "";
  const allTxt = [sp(u.title), sp(u.easyH), easyTxt, stepsTxt, seeTxt, mythTxt].join(" ");

  const lb = (key, txt) => (playing === key
    ? <button className="sbtn on" onClick={stopSpeak}>⏹ {u.stop}</button>
    : <button className="sbtn" onClick={() => speak(key, txt)}>🔊 {u.listen}</button>);

  return (
    <div className="bh">
      <style>{CSS}</style>
      <h1>💗 {u.title}</h1>
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
        <div className="sec"><h2>{u.stepsH}</h2>{lb("steps", stepsTxt)}</div>
        <ol>{u.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
      </section>

      <section className="card see">
        <div className="sec"><h2>{u.seeH}</h2>{lb("see", seeTxt)}</div>
        <ul>{u.see.map((s, i) => <li key={i}>{s}</li>)}</ul>
      </section>

      <section className="card">
        <div className="sec"><h2>{u.mfH}</h2>{lb("myth", mythTxt)}</div>
        <div className="mf">
          {u.myths.map((x, i) => (
            <div className="mfc" key={i}>
              <span className="tag m">{u.myth}</span><p>{x.m}</p>
              <span className="tag f">{u.fact}</span><p style={{ margin: 0 }}>{x.f}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <div className="sec"><h2>🧪 {u.demoH}</h2>{lb("warn", sp(u.demoWarn))}</div>
        <div className="warn">{u.demoWarn}</div>
        <button className="btn" onClick={() => setOpen(!open)} aria-expanded={open}>{open ? u.close : u.open}</button>

        {open && (
          <div style={{ marginTop: 16 }}>
            <div className="row">
              <button className="sbtn" onClick={() => loadSample("b")}>{u.sB}</button>
              <button className="sbtn" onClick={() => loadSample("m")}>{u.sM}</button>
              <button className="sbtn" onClick={() => loadSample("a")}>{u.sA}</button>
            </div>
            {err && <div className="alert" role="alert">{err}</div>}

            <h2>{u.resH}</h2>
            {loading && <p>{u.loading}</p>}
            {!loading && !band && <p>{u.none}</p>}
            {!loading && band && (
              <div className={`res ${band}`} role="status">
                <h2>{band === "benign" ? "✅" : band === "uncertain" ? "⚠️" : "🚨"} {u.bT[band]}</h2>
                <p>{u.bD[band]}</p>
                {lb("res", resTxt)}
              </div>
            )}

            {radar.length > 0 && (
              <>
                <h2>{u.chartH}</h2>
                <ResponsiveContainer width="100%" height={320}>
                  <RadarChart data={radar}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <Radar name={u.ben} dataKey="ben" stroke="#1F5D3A" fill="#1F5D3A" fillOpacity={0.15} />
                    <Radar name={u.mal} dataKey="mal" stroke="#A12B4B" fill="#A12B4B" fillOpacity={0.15} />
                    <Radar name={u.you} dataKey="you" stroke="#6F315F" fill="#6F315F" fillOpacity={0.35} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </>
            )}

            {ref.length === 30 && (
              <>
                <h2>{u.sliders}</h2>
                <div className="sl">
                  {ref.map((r, i) => (
                    <div key={r.name}>
                      <label htmlFor={"s" + i}>{r.name}: {Number(vals[i]).toFixed(3)}</label>
                      <input id={"s" + i} type="range" min={r.min} max={r.max} step={(r.max - r.min) / 200 || 0.001}
                        value={vals[i]} onChange={(e) => setVal(i, e.target.value)} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </section>

      <p className="foot">{u.note}</p>
    </div>
  );
}
