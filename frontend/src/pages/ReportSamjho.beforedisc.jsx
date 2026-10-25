import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../App";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

const T = {
  en: {
    title: "Report Samjho",
    sub: "Upload a photo or PDF of your CBC or thyroid report. We explain it in simple words.",
    supportedNote: "Supported: CBC and thyroid reports. Other reports are not read.",
    drop: "Tap to choose your report", dropSub: "PDF or photo, or drag and drop here",
    change: "Change file", analyse: "Explain my report", busy: "Reading your report...",
    err: "Could not read the report. Check that the backend is running and try again.",
    unsupported: "This report type is not supported yet",
    unsupportedSub: "We do not guess. Please ask your doctor to explain this report.",
    reportType: "Report type", test: "Test", value: "Your value", unit: "Unit", range: "Normal range", status: "Status",
    editHint: "If a value was read wrongly, correct it. The status updates automatically.",
    edited: "You edited values. The explanation below is from the original reading.",
    summary: "Summary", meaning: "What it means", questions: "Questions to ask your doctor", next: "Next step",
    normal: "Normal", low: "Low", high: "High", unknown: "Check", listen: "Listen",
    save: "Saved on this device for your Doctor Brief.", source: "Range used",
    note: "Information only, not a diagnosis. Please show your report to a doctor.",
  },
  hi: {
    title: "रिपोर्ट समझो",
    sub: "अपनी CBC या थायरॉइड रिपोर्ट की फोटो या PDF डालें। हम उसे आसान भाषा में समझाएँगे।",
    supportedNote: "समर्थित: CBC और थायरॉइड रिपोर्ट। दूसरी रिपोर्ट नहीं पढ़ी जाती।",
    drop: "रिपोर्ट चुनने के लिए दबाएँ", dropSub: "PDF या फोटो, या यहाँ खींचकर छोड़ें",
    change: "फ़ाइल बदलें", analyse: "मेरी रिपोर्ट समझाएँ", busy: "आपकी रिपोर्ट पढ़ रही हूँ...",
    err: "रिपोर्ट नहीं पढ़ सके। जाँचें कि बैकएंड चल रहा है, फिर दोबारा कोशिश करें।",
    unsupported: "यह रिपोर्ट अभी समर्थित नहीं है",
    unsupportedSub: "हम अंदाज़ा नहीं लगाते। कृपया डॉक्टर से रिपोर्ट समझें।",
    reportType: "रिपोर्ट का प्रकार", test: "जाँच", value: "आपकी वैल्यू", unit: "इकाई", range: "सामान्य सीमा", status: "स्थिति",
    editHint: "अगर कोई वैल्यू गलत पढ़ी गई है तो ठीक करें। स्थिति अपने आप बदलेगी।",
    edited: "आपने वैल्यू बदली हैं। नीचे की व्याख्या मूल रीडिंग की है।",
    summary: "सार", meaning: "इसका मतलब", questions: "डॉक्टर से पूछने के सवाल", next: "अगला कदम",
    normal: "सामान्य", low: "कम", high: "ज़्यादा", unknown: "जाँचें", listen: "सुनें",
    save: "डॉक्टर ब्रीफ के लिए इस डिवाइस पर सेव हुआ।", source: "इस्तेमाल की गई सीमा",
    note: "सिर्फ़ जानकारी के लिए, निदान नहीं। कृपया रिपोर्ट डॉक्टर को दिखाएँ।",
  },
};

const BADGE = {
  normal: { bg: "#E6F4ED", fg: "#1F5D3A", icon: "✓" },
  low: { bg: "#FFF1D6", fg: "#8A5A00", icon: "↓" },
  high: { bg: "#FBE3E8", fg: "#A12B4B", icon: "↑" },
  unknown: { bg: "#F7E8F0", fg: "#6F315F", icon: "?" },
};

function flagFromRange(value, range) {
  const m = String(range || "").match(/(-?\d+(?:\.\d+)?)\s*[-–]\s*(-?\d+(?:\.\d+)?)/);
  const v = parseFloat(value);
  if (!m || Number.isNaN(v)) return "unknown";
  if (v < parseFloat(m[1])) return "low";
  if (v > parseFloat(m[2])) return "high";
  return "normal";
}

function speak(text, lang) {
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === "hi" ? "hi-IN" : "en-IN";
    u.rate = 0.9;
    speechSynthesis.speak(u);
  } catch { alert("Voice is not supported on this device."); }
}

const CSS = `
.rs{max-width:860px;margin:0 auto;padding:8px 4px 40px;color:var(--charcoal,#2D2630);animation:rsfade .25s ease}
@keyframes rsfade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
.rs h1{font-size:2rem;font-weight:700;color:var(--plum,#6F315F);margin:0 0 6px;display:flex;align-items:center;gap:10px}
.rs .ic{width:44px;height:44px;border-radius:12px;background:var(--blush,#F7E8F0);display:inline-flex;align-items:center;justify-content:center;font-size:22px}
.rs .sub{font-size:1.05rem;margin:0 0 10px;opacity:.85;line-height:1.6}
.rs .chip{display:inline-block;background:var(--blush,#F7E8F0);color:var(--plum,#6F315F);border-radius:999px;padding:6px 14px;font-size:.88rem;font-weight:500;margin-bottom:18px}
.rs .card{background:#fff;border:1px solid var(--border,rgba(111,49,95,.15));border-radius:18px;padding:20px;margin-bottom:16px;box-shadow:0 4px 18px rgba(111,49,95,.06)}
.rs .drop{border:2px dashed rgba(111,49,95,.35);border-radius:16px;background:#FDF8FB;padding:28px 16px;text-align:center;cursor:pointer;transition:.15s;width:100%;font-family:inherit;color:inherit}
.rs .drop:hover,.rs .drop.over{background:var(--blush,#F7E8F0);border-color:var(--rose,#D95C91)}
.rs .drop:focus-visible,.rs .btn:focus-visible,.rs .listen:focus-visible,.rs input:focus-visible{outline:2px solid var(--rose,#D95C91);outline-offset:2px}
.rs .drop .big{font-size:34px;line-height:1}
.rs .drop .t1{font-weight:600;color:var(--plum,#6F315F);margin-top:8px;font-size:1.05rem}
.rs .drop .t2{font-size:.9rem;opacity:.7;margin-top:2px}
.rs .file{display:flex;align-items:center;gap:10px;justify-content:space-between;flex-wrap:wrap;margin-top:12px;background:var(--blush,#F7E8F0);border-radius:12px;padding:10px 14px}
.rs .file span{word-break:break-all;font-weight:500}
.rs .link{background:none;border:none;color:var(--plum,#6F315F);text-decoration:underline;cursor:pointer;font-family:inherit;font-size:.9rem;min-height:44px}
.rs .btn{margin-top:14px;min-height:48px;padding:0 26px;border-radius:12px;border:none;background:var(--plum,#6F315F);color:#fff;font-weight:600;font-size:1rem;font-family:inherit;cursor:pointer;box-shadow:0 4px 12px rgba(111,49,95,.25);transition:.15s;display:inline-flex;align-items:center;gap:10px}
.rs .btn:hover:not(:disabled){background:#57254B;transform:translateY(-1px)}
.rs .btn:active:not(:disabled){transform:scale(.98)}
.rs .btn:disabled{opacity:.5;cursor:not-allowed;box-shadow:none}
.rs .spin{width:18px;height:18px;border:3px solid rgba(255,255,255,.4);border-top-color:#fff;border-radius:50%;animation:rsspin .8s linear infinite}
@keyframes rsspin{to{transform:rotate(360deg)}}
.rs .alert{border-radius:14px;padding:14px 16px;margin-bottom:16px;display:flex;gap:12px;align-items:flex-start}
.rs .alert.err{background:#FBE3E8;color:#A12B4B}
.rs .alert.uns{background:var(--blush,#F7E8F0);color:var(--plum,#6F315F);border:1px solid rgba(111,49,95,.2)}
.rs .alert b{display:block;font-size:1.05rem}
.rs .alert small{display:block;margin-top:4px;font-size:.92rem;color:var(--charcoal,#2D2630);opacity:.85}
.rs .meta{display:flex;gap:10px;align-items:center;flex-wrap:wrap;font-size:.92rem;margin-bottom:6px}
.rs .tag{background:var(--plum,#6F315F);color:#fff;border-radius:8px;padding:3px 10px;font-weight:600;text-transform:uppercase;font-size:.8rem}
.rs .hint{font-size:.88rem;opacity:.7;margin:4px 0 12px}
.rs .tw{overflow-x:auto;border-radius:12px;border:1px solid rgba(111,49,95,.12)}
.rs table{width:100%;border-collapse:collapse;min-width:520px;font-size:.95rem}
.rs th{background:var(--blush,#F7E8F0);color:var(--plum,#6F315F);text-align:left;padding:10px 12px;font-weight:600;white-space:nowrap}
.rs td{padding:8px 12px;border-top:1px solid rgba(111,49,95,.1)}
.rs tr:hover td{background:#FDF8FB}
.rs td input{width:92px;min-height:44px;border:1px solid rgba(111,49,95,.25);border-radius:10px;padding:0 10px;font-family:inherit;font-size:1rem;background:#fff}
.rs td input:focus{border-color:var(--plum,#6F315F);box-shadow:0 0 0 3px rgba(217,92,145,.25);outline:none}
.rs .badge{display:inline-flex;gap:5px;align-items:center;border-radius:999px;padding:4px 12px;font-size:.82rem;font-weight:600;white-space:nowrap}
.rs .warn{margin-top:10px;font-size:.88rem;background:#FFF1D6;color:#8A5A00;border-radius:10px;padding:8px 12px}
.rs h2{font-size:1.15rem;color:var(--plum,#6F315F);margin:0 0 8px}
.rs .sec{margin-bottom:18px}
.rs .mc{background:var(--blush,#F7E8F0);border-radius:14px;padding:14px;margin-bottom:10px;transition:.15s}
.rs .mc:hover{box-shadow:0 6px 16px rgba(111,49,95,.12)}
.rs .mc .row{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.rs .mc p{margin:6px 0 0;line-height:1.6}
.rs .listen{margin-top:10px;min-height:44px;padding:0 14px;border-radius:10px;border:1px solid var(--plum,#6F315F);background:#fff;color:var(--plum,#6F315F);font-family:inherit;font-weight:500;cursor:pointer;transition:.15s}
.rs .listen:hover{background:var(--plum,#6F315F);color:#fff}
.rs ul{margin:0;padding-left:20px;line-height:1.8}
.rs .next{background:var(--mint,#E6F4ED);color:#1F5D3A;border-radius:14px;padding:14px 16px;font-weight:500}
.rs .foot{font-size:.9rem;opacity:.7;margin-top:12px}
@media (prefers-reduced-motion:reduce){.rs,.rs .btn,.rs .drop{animation:none;transition:none}}
`;

export default function ReportSamjho() {
  const { lang } = useLanguage();
  const L = lang === "hi" ? "hi" : "en";
  const t = T[L];
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [tests, setTests] = useState([]);
  const [edited, setEdited] = useState(false);
  const [over, setOver] = useState(false);

  async function run(f, language) {
    if (!f) return;
    setBusy(true); setError(""); setData(null);
    try {
      const fd = new FormData();
      fd.append("file", f);
      fd.append("lang", language);
      const r = await fetch(`${API}/report/extract`, { method: "POST", body: fd });
      if (!r.ok) throw new Error();
      const j = await r.json();
      setData(j); setTests(j.tests || []); setEdited(false);
      if (j.supported) {
        try {
          localStorage.setItem("report_last", JSON.stringify({
            report_type: j.report_type, tests: j.tests, explanation: j.explanation,
            timestamp: new Date().toISOString(),
          }));
        } catch {}
      }
    } catch { setError(t.err); }
    finally { setBusy(false); }
  }

  useEffect(() => { if (file && data) run(file, L); /* eslint-disable-next-line */ }, [L]);

  function pick(f) { if (f) { setFile(f); setData(null); setError(""); } }

  function editValue(i, v) {
    setEdited(true);
    setTests((arr) => arr.map((x, k) => k === i ? { ...x, value: v, flag: flagFromRange(v, x.reference_range) } : x));
  }

  const Badge = ({ f }) => {
    const b = BADGE[f] || BADGE.unknown;
    const label = t[f] || t.unknown;
    return <span className="badge" style={{ background: b.bg, color: b.fg }}><span aria-hidden>{b.icon}</span>{label}</span>;
  };

  const ex = data?.explanation;
  const detail = data && !data.supported ? (data.message || data.reason) : "";

  return (
    <div className="rs">
      <style>{CSS}</style>
      <h1><span className="ic" aria-hidden>📄</span>{t.title}</h1>
      <p className="sub">{t.sub}</p>
      <span className="chip">{t.supportedNote}</span>

      <div className="card">
        <input ref={fileRef} type="file" accept="application/pdf,image/*" style={{ display: "none" }}
          onChange={(e) => pick(e.target.files?.[0])} />
        <button type="button" className={`drop${over ? " over" : ""}`}
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setOver(true); }}
          onDragLeave={() => setOver(false)}
          onDrop={(e) => { e.preventDefault(); setOver(false); pick(e.dataTransfer.files?.[0]); }}>
          <div className="big" aria-hidden>📤</div>
          <div className="t1">{t.drop}</div>
          <div className="t2">{t.dropSub}</div>
        </button>

        {file && (
          <div className="file">
            <span>📎 {file.name}</span>
            <button type="button" className="link" onClick={() => fileRef.current?.click()}>{t.change}</button>
          </div>
        )}

        <button type="button" className="btn" onClick={() => run(file, L)} disabled={!file || busy}>
          {busy && <span className="spin" aria-hidden />}
          {busy ? t.busy : t.analyse}
        </button>
      </div>

      {error && <div className="alert err" role="alert"><span aria-hidden>⚠️</span><div>{error}</div></div>}

      {data && !data.supported && (
        <div className="alert uns" role="status">
          <span aria-hidden>🛈</span>
          <div><b>{t.unsupported}</b><small>{t.unsupportedSub}</small>
            {detail && <small>({detail})</small>}</div>
        </div>
      )}

      {data?.supported && (
        <>
          <div className="card">
            <div className="meta"><span>{t.reportType}:</span><span className="tag">{data.report_type}</span></div>
            <p className="hint">{t.editHint}</p>
            <div className="tw">
              <table>
                <thead><tr><th>{t.test}</th><th>{t.value}</th><th>{t.unit}</th><th>{t.range}</th><th>{t.status}</th></tr></thead>
                <tbody>
                  {tests.map((x, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 600 }}>{x.name}</td>
                      <td><input value={x.value ?? ""} inputMode="decimal"
                        aria-label={`${x.name} ${t.value}`} onChange={(e) => editValue(i, e.target.value)} /></td>
                      <td>{x.unit}</td>
                      <td>{x.reference_range}</td>
                      <td><Badge f={x.flag} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {tests[0]?.flag_source && <p className="hint" style={{ marginTop: 10 }}>{t.source}: {tests[0].flag_source}</p>}
            {edited && <div className="warn">{t.edited}</div>}
          </div>

          {ex && (
            <div className="card">
              {ex.summary && <div className="sec"><h2>{t.summary}</h2><p style={{ margin: 0, lineHeight: 1.6 }}>{ex.summary}</p></div>}

              {ex.per_test?.length > 0 && (
                <div className="sec">
                  <h2>{t.meaning}</h2>
                  {ex.per_test.map((p, i) => (
                    <div className="mc" key={i}>
                      <div className="row"><b>{p.name}</b><Badge f={p.status} /></div>
                      <p>{p.meaning}</p>
                      {p.everyday_line && <p style={{ opacity: 0.8, fontSize: ".92rem" }}>{p.everyday_line}</p>}
                      {p.speak_text && (
                        <button type="button" className="listen" aria-label={`${t.listen} ${p.name}`}
                          onClick={() => speak(p.speak_text, L)}>🔊 {t.listen}</button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {ex.questions_for_doctor?.length > 0 && (
                <div className="sec"><h2>{t.questions}</h2>
                  <ul>{ex.questions_for_doctor.map((q, i) => <li key={i}>{q}</li>)}</ul></div>
              )}

              {ex.next_step && <div className="next"><b>{t.next}: </b>{ex.next_step}</div>}
              <p className="foot">💾 {t.save}</p>
            </div>
          )}
        </>
      )}

      <p className="foot">{t.note}</p>
    </div>
  );
}
