import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../App";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

const T = {
  en: {
    title: "Report Samjho", sub: "Upload a photo or PDF of your CBC or thyroid report. We explain it in simple words.",
    supportedNote: "Supported: CBC and thyroid reports. Other reports are not read.",
    pick: "Choose report (PDF / photo)", analyse: "Explain my report", busy: "Reading your report...",
    err: "Could not read the report. Check that the backend is running and try again.",
    unsupported: "This report type is not supported yet, so we will not guess. Please ask your doctor to explain it.",
    reportType: "Report type", test: "Test", value: "Your value", unit: "Unit", range: "Normal range", status: "Status",
    editHint: "If a value was read wrongly, correct it here. The status updates automatically.",
    edited: "Edited values: the explanation below is from the original reading.",
    summary: "Summary", meaning: "What it means", questions: "Questions to ask your doctor", next: "Next step",
    normal: "Normal", low: "Low", high: "High", unknown: "Check", listen: "Listen", stop: "Stop",
    save: "Saved on this device for your Doctor Brief.", source: "Range used",
    note: "Information only, not a diagnosis. Please show your report to a doctor.",
    synthetic: "Demo tip: use the synthetic sample reports.",
  },
  hi: {
    title: "रिपोर्ट समझो", sub: "अपनी CBC या थायरॉइड रिपोर्ट की फोटो या PDF डालें। हम उसे आसान भाषा में समझाएँगे।",
    supportedNote: "समर्थित: CBC और थायरॉइड रिपोर्ट। दूसरी रिपोर्ट नहीं पढ़ी जाती।",
    pick: "रिपोर्ट चुनें (PDF / फोटो)", analyse: "मेरी रिपोर्ट समझाएँ", busy: "आपकी रिपोर्ट पढ़ रही हूँ...",
    err: "रिपोर्ट नहीं पढ़ सके। जाँचें कि बैकएंड चल रहा है, फिर दोबारा कोशिश करें।",
    unsupported: "यह रिपोर्ट अभी समर्थित नहीं है, इसलिए हम अंदाज़ा नहीं लगाएँगे। कृपया डॉक्टर से समझें।",
    reportType: "रिपोर्ट का प्रकार", test: "जाँच", value: "आपकी वैल्यू", unit: "इकाई", range: "सामान्य सीमा", status: "स्थिति",
    editHint: "अगर कोई वैल्यू गलत पढ़ी गई है तो यहाँ ठीक करें। स्थिति अपने आप बदलेगी।",
    edited: "वैल्यू बदली गई हैं: नीचे की व्याख्या मूल रीडिंग की है।",
    summary: "सार", meaning: "इसका मतलब", questions: "डॉक्टर से पूछने के सवाल", next: "अगला कदम",
    normal: "सामान्य", low: "कम", high: "ज़्यादा", unknown: "जाँचें", listen: "सुनें", stop: "रोकें",
    save: "डॉक्टर ब्रीफ के लिए इस डिवाइस पर सेव हुआ।", source: "इस्तेमाल की गई सीमा",
    note: "सिर्फ़ जानकारी के लिए, निदान नहीं। कृपया रिपोर्ट डॉक्टर को दिखाएँ।",
    synthetic: "डेमो टिप: सैंपल (नकली) रिपोर्ट इस्तेमाल करें।",
  },
};

function flagFromRange(value, range) {
  const m = String(range || "").match(/(-?\d+(?:\.\d+)?)\s*[-–]\s*(-?\d+(?:\.\d+)?)/);
  const v = parseFloat(value);
  if (!m || Number.isNaN(v)) return "unknown";
  if (v < parseFloat(m[1])) return "low";
  if (v > parseFloat(m[2])) return "high";
  return "normal";
}

const BADGE = {
  normal: "bg-[#E6F4ED] text-[#1F5D3A]",
  low: "bg-[#FFF1D6] text-[#8A5A00]",
  high: "bg-[#FBE3E8] text-[#A12B4B]",
  unknown: "bg-[#F7E8F0] text-[#6F315F]",
};

function speak(text, lang) {
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === "hi" ? "hi-IN" : "en-IN";
    u.rate = 0.9;
    speechSynthesis.speak(u);
  } catch { alert("Voice is not supported on this device."); }
}

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
      setData(j);
      setTests(j.tests || []);
      setEdited(false);
      if (j.supported) {
        try {
          localStorage.setItem("report_last", JSON.stringify({
            report_type: j.report_type, tests: j.tests, explanation: j.explanation, timestamp: new Date().toISOString(),
          }));
        } catch {}
      }
    } catch { setError(t.err); }
    finally { setBusy(false); }
  }

  // re-run when the language changes so the explanation switches language
  useEffect(() => { if (file && data) run(file, L); /* eslint-disable-next-line */ }, [L]);

  function editValue(i, v) {
    setEdited(true);
    setTests((arr) => arr.map((x, k) => k === i
      ? { ...x, value: v, flag: flagFromRange(v, x.reference_range) } : x));
  }

  const label = (f) => t[f] || t.unknown;
  const ex = data?.explanation;
  const btn = "min-h-[48px] px-5 rounded-xl font-semibold transition";

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
      <h1 className="text-2xl font-bold text-[#6F315F]">📄 {t.title}</h1>
      <p className="text-[#2D2630]/80">{t.sub}</p>
      <p className="text-sm text-[#6F315F]">{t.supportedNote}</p>

      <div className="bg-white rounded-2xl border border-[#6F315F]/15 p-4 space-y-3">
        <input ref={fileRef} type="file" accept="application/pdf,image/*" className="hidden"
          onChange={(e) => { setFile(e.target.files?.[0] || null); setData(null); setError(""); }} />
        <button onClick={() => fileRef.current?.click()}
          className={`${btn} border border-[#6F315F] text-[#6F315F] bg-white hover:bg-[#F7E8F0]`}>{t.pick}</button>
        {file && <p className="text-sm text-[#2D2630]/80 break-all">{file.name}</p>}
        <div>
          <button onClick={() => run(file, L)} disabled={!file || busy}
            className={`${btn} bg-[#6F315F] text-white hover:bg-[#57254B] disabled:opacity-50`}>
            {busy ? t.busy : t.analyse}
          </button>
        </div>
        <p className="text-xs text-[#2D2630]/60">{t.synthetic}</p>
      </div>

      {error && <div className="rounded-xl bg-[#FBE3E8] text-[#A12B4B] p-3" role="alert">{error}</div>}

      {data && !data.supported && (
        <div className="rounded-2xl bg-[#F7E8F0] text-[#6F315F] p-4" role="status">
          <p className="font-semibold">{t.unsupported}</p>
          {(data.message || data.reason) && <p className="text-sm mt-1">{data.message || data.reason}</p>}
        </div>
      )}

      {data?.supported && (
        <>
          <div className="bg-white rounded-2xl border border-[#6F315F]/15 p-4 space-y-3">
            <p className="text-sm text-[#2D2630]/70">{t.reportType}: <b className="uppercase text-[#6F315F]">{data.report_type}</b></p>
            <p className="text-sm text-[#2D2630]/70">{t.editHint}</p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-[#6F315F] border-b border-[#6F315F]/15">
                    <th className="py-2 pr-2">{t.test}</th><th className="pr-2">{t.value}</th>
                    <th className="pr-2">{t.unit}</th><th className="pr-2">{t.range}</th><th>{t.status}</th>
                  </tr>
                </thead>
                <tbody>
                  {tests.map((x, i) => (
                    <tr key={i} className="border-b border-[#6F315F]/10 align-middle">
                      <td className="py-2 pr-2 font-medium text-[#2D2630]">{x.name}</td>
                      <td className="pr-2">
                        <input value={x.value ?? ""} onChange={(e) => editValue(i, e.target.value)}
                          aria-label={`${x.name} ${t.value}`} inputMode="decimal"
                          className="w-24 min-h-[44px] rounded-lg border border-[#6F315F]/30 px-2 focus:outline-none focus:ring-2 focus:ring-[#D95C91]" />
                      </td>
                      <td className="pr-2">{x.unit}</td>
                      <td className="pr-2">{x.reference_range}</td>
                      <td><span className={`px-2 py-1 rounded-full text-xs font-semibold ${BADGE[x.flag] || BADGE.unknown}`}>{label(x.flag)}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {tests[0]?.flag_source && <p className="text-xs text-[#2D2630]/60">{t.source}: {tests[0].flag_source}</p>}
            {edited && <p className="text-xs text-[#8A5A00] bg-[#FFF1D6] rounded-lg p-2">{t.edited}</p>}
          </div>

          {ex && (
            <div className="bg-white rounded-2xl border border-[#6F315F]/15 p-4 space-y-4">
              {ex.summary && (
                <div>
                  <h2 className="font-bold text-[#6F315F]">{t.summary}</h2>
                  <p className="text-[#2D2630]">{ex.summary}</p>
                </div>
              )}
              {ex.per_test?.length > 0 && (
                <div className="space-y-3">
                  <h2 className="font-bold text-[#6F315F]">{t.meaning}</h2>
                  {ex.per_test.map((p, i) => (
                    <div key={i} className="bg-[#F7E8F0] rounded-xl p-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <b className="text-[#2D2630]">{p.name}</b>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${BADGE[p.status] || BADGE.unknown}`}>{label(p.status)}</span>
                      </div>
                      <p className="text-[#2D2630] mt-1">{p.meaning}</p>
                      {p.everyday_line && <p className="text-[#2D2630]/80 text-sm mt-1">{p.everyday_line}</p>}
                      {p.speak_text && (
                        <button onClick={() => speak(p.speak_text, L)} aria-label={`${t.listen} ${p.name}`}
                          className="mt-2 min-h-[44px] px-3 rounded-lg bg-white border border-[#6F315F] text-[#6F315F]">🔊 {t.listen}</button>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {ex.questions_for_doctor?.length > 0 && (
                <div>
                  <h2 className="font-bold text-[#6F315F]">{t.questions}</h2>
                  <ul className="list-disc pl-5 space-y-1 text-[#2D2630]">
                    {ex.questions_for_doctor.map((q, i) => <li key={i}>{q}</li>)}
                  </ul>
                </div>
              )}
              {ex.next_step && (
                <div className="rounded-xl bg-[#E6F4ED] text-[#1F5D3A] p-3">
                  <b>{t.next}: </b>{ex.next_step}
                </div>
              )}
              <p className="text-xs text-[#2D2630]/60">💾 {t.save}</p>
            </div>
          )}
        </>
      )}

      <p className="text-sm text-[#2D2630]/70">{t.note}</p>
    </div>
  );
}
