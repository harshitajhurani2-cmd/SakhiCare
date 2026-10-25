import React, { useState, useEffect } from 'react';
import { useLanguage } from '../App';
import { translations } from '../i18n';
import { safeStorage } from '../utils/storage';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function HealthDiary() {
  const { lang } = useLanguage();
  const t = translations[lang];
  
  const [entries, setEntries] = useState(() => {
    const saved = safeStorage.getItem('sakhi_diary');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [form, setForm] = useState({
    startDate: '', endDate: '', pain: 0, bleeding: 'medium', symptoms: '', whenStarted: '', severity: 'medium'
  });
  const [editingId, setEditingId] = useState(null);
  
  useEffect(() => {
    safeStorage.setItem('sakhi_diary', JSON.stringify(entries));
  }, [entries]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId !== null) {
      setEntries(entries.map(entry => entry.id === editingId ? {...form, id: editingId} : entry));
      setEditingId(null);
    } else {
      setEntries([...entries, {...form, id: Date.now()}]);
    }
    setForm({ startDate: '', endDate: '', pain: 0, bleeding: 'medium', symptoms: '', whenStarted: '', severity: 'medium' });
  };
  
  const handleEdit = (entry) => {
    setForm(entry);
    setEditingId(entry.id);
  };
  
  const handleDelete = (id) => {
    setEntries(entries.filter(e => e.id !== id));
  };
  
  const chartData = entries.map((e, i) => ({
    name: 'Entry ' + (i+1),
    pain: e.pain
  }));
  
  return (
    <div className="py-6">
      <h2 className="text-2xl font-bold text-primary mb-4">{t.healthDiary}</h2>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg mb-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-lg">{lang === 'en' ? 'Period Start Date' : 'मासिक धर्म शुरू की तारीख'}</label>
            <input type="date" value={form.startDate} onChange={(e) => setForm({...form, startDate: e.target.value})} className="w-full p-3 border-2 border-primary/30 rounded-lg text-lg" required />
          </div>
          <div>
            <label className="block mb-2 text-lg">{lang === 'en' ? 'Period End Date' : 'मासिक धर्म समाप्त की तारीख'}</label>
            <input type="date" value={form.endDate} onChange={(e) => setForm({...form, endDate: e.target.value})} className="w-full p-3 border-2 border-primary/30 rounded-lg text-lg" />
          </div>
        </div>
        
        <div>
          <label className="block mb-2 text-lg">{lang === 'en' ? 'Pain (0-10)' : 'दर्द (0-10)'}</label>
          <input type="range" min="0" max="10" value={form.pain} onChange={(e) => setForm({...form, pain: parseInt(e.target.value)})} className="w-full" />
          <div className="text-center text-lg font-bold">{form.pain}</div>
        </div>
        
        <div>
          <label className="block mb-2 text-lg">{lang === 'en' ? 'Bleeding' : 'रक्तस्राव'}</label>
          <select value={form.bleeding} onChange={(e) => setForm({...form, bleeding: e.target.value})} className="w-full p-3 border-2 border-primary/30 rounded-lg text-lg">
            <option value="light">{lang === 'en' ? 'Light' : 'हल्का'}</option>
            <option value="medium">{lang === 'en' ? 'Medium' : 'मध्यम'}</option>
            <option value="heavy">{lang === 'en' ? 'Heavy' : 'भारी'}</option>
          </select>
        </div>
        
        <div>
          <label className="block mb-2 text-lg">{lang === 'en' ? 'Other Symptoms' : 'अन्य लक्षण'}</label>
          <input type="text" value={form.symptoms} onChange={(e) => setForm({...form, symptoms: e.target.value})} className="w-full p-3 border-2 border-primary/30 rounded-lg text-lg" placeholder={lang === 'en' ? 'e.g., cramps' : 'जैसे, ऐंठन'} />
        </div>
        
        <button type="submit" className="w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-primaryDark text-lg">
          {editingId !== null ? (lang === 'en' ? 'Update Entry' : 'एंट्री अपडेट करें') : (lang === 'en' ? 'Add Entry' : 'एंट्री जोड़ें')}
        </button>
      </form>
      
      <h3 className="text-xl font-bold text-primary mb-3">{lang === 'en' ? 'Cycle Timeline' : 'चक्र टाइमलाइन'}</h3>
      <div className="space-y-3 mb-6">
        {entries.slice().reverse().map(entry => (
          <div key={entry.id} className="bg-white p-4 rounded-xl shadow-md">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-bold text-lg">{entry.startDate} {entry.endDate && '- ' + entry.endDate}</p>
                <p className="text-gray-600">{lang === 'en' ? 'Pain:' : 'दर्द:'} {entry.pain}/10 | {lang === 'en' ? 'Bleeding:' : 'रक्तस्राव:'} {entry.bleeding}</p>
                {entry.symptoms && <p className="text-gray-600">{entry.symptoms}</p>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(entry)} className="px-3 py-1 bg-blue-100 text-blue-700 rounded">{lang === 'en' ? 'Edit' : 'संपादित'}</button>
                <button onClick={() => handleDelete(entry.id)} className="px-3 py-1 bg-red-100 text-red-700 rounded">{lang === 'en' ? 'Delete' : 'हटाएं'}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {entries.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold text-primary mb-4">{lang === 'en' ? 'Pain Chart' : 'दर्द चार्ट'}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="pain" stroke="#8b5cf6" strokeWidth={2} name={lang === 'en' ? 'Pain' : 'दर्द'} />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-center text-gray-600 mt-2 text-sm">{lang === 'en' ? 'Only summarising what you logged, no predictions.' : 'केवल आपके द्वारा लॉग की गई जानकारी का सारांश, कोई भविष्यवाणी नहीं।'}</p>
        </div>
      )}
      
      <p className="mt-6 text-center text-red-600 font-semibold">{t.disclaimerHindi}</p>
    </div>
  );
}
