
import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Send, 
  Plus, 
  MessageSquare, 
  User as UserIcon, 
  Clock, 
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { User } from '../App';

interface Prayer {
  id: string;
  author: string;
  text: string;
  date: string;
  prayCount: number;
  isPrayed?: boolean;
}

const PrayerPage: React.FC<{ user: User | null; onAuthClick: () => void }> = ({ user, onAuthClick }) => {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [newPrayer, setNewPrayer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    const fetchPrayers = async () => {
      try {
        const response = await fetch('/api/prayers');
        const data = await response.json();
        setPrayers(data);
      } catch (error) {
        console.error('Failed to fetch prayers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPrayers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrayer.trim()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      const response = await fetch('/api/prayers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: user ? user.name : 'Зочин',
          text: newPrayer
        })
      });
      
      if (!response.ok) throw new Error('Failed to submit');
      
      const data = await response.json();
      setPrayers([data, ...prayers]);
      setNewPrayer('');
      setSubmitStatus('success');
      setTimeout(() => {
        setShowForm(false);
        setSubmitStatus('idle');
      }, 2000);
    } catch (error) {
      console.error('Failed to submit prayer:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePray = async (id: string) => {
    // Optimistic update
    const prayer = prayers.find(p => p.id === id);
    if (!prayer || prayer.isPrayed) return; // Prevent multiple clicks for now or handle toggle if needed

    setPrayers(prayers.map(p => p.id === id ? { ...p, prayCount: p.prayCount + 1, isPrayed: true } : p));

    try {
      await fetch(`/api/prayers/${id}/pray`, { method: 'POST' });
    } catch (error) {
      console.error('Failed to pray:', error);
      // Revert on error
      setPrayers(prayers.map(p => p.id === id ? { ...p, prayCount: p.prayCount - 1, isPrayed: false } : p));
    }
  };

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4">
        <header className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-700 text-xs font-bold uppercase tracking-wider mb-4">
            <Heart className="w-3 h-3" /> Залбирлын хана
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">Залбирал</h1>
          <p className="text-slate-500 text-lg mt-4 max-w-2xl mx-auto">
            Бие биенийхээ төлөө залбирч, Бурханы хайр ба ивээлийг хамтдаа хуваалцацгаая.
          </p>
        </header>

        <div className="flex justify-center mb-12">
          <button 
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-8 py-4 bg-teal-700 text-white rounded-2xl font-bold hover:bg-teal-800 transition-all shadow-lg shadow-teal-700/20"
          >
            {showForm ? <Plus className="w-5 h-5 rotate-45 transition-transform" /> : <Plus className="w-5 h-5 transition-transform" />}
            Залбирал нэмэх
          </button>
        </div>

        {showForm && (
          <div className="mb-12 animate-in slide-in-from-top duration-500">
            <div className="bg-white p-8 rounded-[32px] shadow-xl border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Таны залбирал</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <textarea 
                  required
                  value={newPrayer}
                  onChange={(e) => {
                    setNewPrayer(e.target.value);
                    if (submitStatus !== 'idle') setSubmitStatus('idle');
                  }}
                  placeholder="Залбирлын хүсэлтээ энд бичнэ үү..."
                  className="w-full p-6 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none font-medium min-h-[150px] resize-none"
                />
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex-grow">
                    {submitStatus === 'success' && (
                      <div className="flex items-center gap-2 text-emerald-600 font-bold animate-in fade-in slide-in-from-left-2">
                        <CheckCircle2 className="w-5 h-5" />
                        Амжилттай илгээгдлээ.
                      </div>
                    )}
                    {submitStatus === 'error' && (
                      <div className="flex items-center gap-2 text-red-600 font-bold animate-in fade-in slide-in-from-left-2">
                        <AlertCircle className="w-5 h-5" />
                        Алдаа гарлаа. Дахин оролдоно уу.
                      </div>
                    )}
                  </div>
                  <button 
                    type="submit" 
                    disabled={isSubmitting || submitStatus === 'success'}
                    className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all shadow-lg disabled:opacity-50 ${
                      submitStatus === 'success' ? 'bg-emerald-600 text-white' : 'bg-teal-700 text-white hover:bg-teal-800'
                    }`}
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : submitStatus === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <><Send className="w-5 h-5" /> Илгээх</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-teal-600 animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Залбирлуудыг ачаалж байна...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {prayers.length > 0 ? (
              prayers.map((prayer) => (
                <div 
                  key={prayer.id} 
                  className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 font-bold">
                      {prayer.author[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{prayer.author}</h4>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <Clock className="w-3 h-3" /> {prayer.date}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-slate-600 leading-relaxed mb-8 flex-grow italic">
                    "{prayer.text}"
                  </p>
                  
                  <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                    <button 
                      onClick={() => handlePray(prayer.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                        prayer.isPrayed 
                          ? 'bg-teal-100 text-teal-700' 
                          : 'bg-slate-50 text-slate-500 hover:bg-teal-50 hover:text-teal-600'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${prayer.isPrayed ? 'fill-current' : ''}`} />
                      <span>{prayer.isPrayed ? 'Залбирч байна' : 'Залбирах'}</span>
                    </button>
                    
                    <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
                      <span className="text-teal-600">{prayer.prayCount}</span> хүн залбирч байна
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <p className="text-slate-400 italic">Одоогоор залбирал байхгүй байна.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PrayerPage;
