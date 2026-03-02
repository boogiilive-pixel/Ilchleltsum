
import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Send, 
  MessageSquare, 
  Users, 
  Shield, 
  CheckCircle2, 
  Loader2,
  PlusCircle,
  Clock,
  User as UserIcon
} from 'lucide-react';
import { User, SUBMIT_URL } from '../App';

interface PrayerRequest {
  id: string;
  author: string;
  text: string;
  date: string;
  isAnonymous: boolean;
  prayerCount: number;
}

const INITIAL_REQUESTS: PrayerRequest[] = [
  {
    id: '1',
    author: 'Дорж',
    text: 'Миний гэр бүлийн эрүүл мэндийн төлөө залбирч өгөөч. Аав маань эмнэлэгт хэвтсэн байгаа.',
    date: '2026.02.25',
    isAnonymous: false,
    prayerCount: 12
  },
  {
    id: '2',
    author: 'Зочин',
    text: 'Шалгалтандаа амжилттай орохын төлөө залбирал хүсэж байна. Маш их сандарч байна.',
    date: '2026.02.27',
    isAnonymous: true,
    prayerCount: 8
  },
  {
    id: '3',
    author: 'Сараа',
    text: 'Ажлын байран дээрх харилцаа маань сайжрахын төлөө залбирч өгнө үү.',
    date: '2026.02.28',
    isAnonymous: false,
    prayerCount: 5
  }
];

const PrayerRequestPage: React.FC<{ user: User | null }> = ({ user }) => {
  const [requests, setRequests] = useState<PrayerRequest[]>(INITIAL_REQUESTS);
  const [newRequest, setNewRequest] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [prayedIds, setPrayedIds] = useState<Set<string>>(new Set());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRequest.trim()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call to Google Sheets
      const params = new URLSearchParams();
      params.append('name', isAnonymous ? 'Нууц' : (user?.name || 'Зочин'));
      params.append('email', user?.email || 'anonymous@example.com');
      params.append('message', newRequest);
      params.append('action', 'Залбирлын хүсэлт');

      await fetch(SUBMIT_URL, {
        method: "POST",
        mode: "no-cors",
        body: params.toString()
      });

      const request: PrayerRequest = {
        id: Math.random().toString(36).substr(2, 9),
        author: isAnonymous ? 'Зочин' : (user?.name || 'Зочин'),
        text: newRequest,
        date: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
        isAnonymous: isAnonymous,
        prayerCount: 0
      };

      setTimeout(() => {
        setRequests([request, ...requests]);
        setNewRequest('');
        setIsSubmitting(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }, 1000);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  const handlePray = (id: string) => {
    if (prayedIds.has(id)) return;

    setPrayedIds(new Set([...prayedIds, id]));
    setRequests(requests.map(req => 
      req.id === id ? { ...req, prayerCount: req.prayerCount + 1 } : req
    ));
  };

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4">
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-100 text-teal-700 text-xs font-bold uppercase tracking-widest mb-6">
            <Heart className="w-4 h-4" /> Хамтдаа залбиръя
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">Залбирлын хана</h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            "Гуй, тэгвэл та нарт өгөгдөх болно. Хай, тэгвэл та нар олох болно. Тогш, тэгвэл та нарт нээгдэх болно." (Матай 7:7)
          </p>
        </header>

        {/* Submit Form */}
        <section className="mb-20">
          <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-xl border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-teal-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-teal-600/20">
                  <PlusCircle className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Хүсэлт илгээх</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <textarea 
                  required
                  value={newRequest}
                  onChange={(e) => setNewRequest(e.target.value)}
                  placeholder="Таны залбирлын хүсэлт юу вэ? Бид таны төлөө залбирах болно..."
                  className="w-full p-8 bg-slate-50 border border-slate-100 rounded-[32px] focus:ring-2 focus:ring-teal-500 outline-none font-medium min-h-[160px] text-lg transition-all"
                />
                
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${isAnonymous ? 'bg-teal-600 border-teal-600' : 'border-slate-300 group-hover:border-teal-500'}`}>
                      {isAnonymous && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </div>
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={isAnonymous}
                      onChange={() => setIsAnonymous(!isAnonymous)}
                    />
                    <span className="text-slate-600 font-bold text-sm flex items-center gap-2">
                      <Shield className="w-4 h-4" /> Нэрээ нууцлах
                    </span>
                  </label>

                  <button 
                    type="submit" 
                    disabled={isSubmitting || !newRequest.trim()}
                    className="w-full md:w-auto px-12 py-5 bg-teal-700 text-white rounded-[24px] font-black text-lg hover:bg-teal-800 transition-all shadow-xl shadow-teal-700/20 disabled:opacity-50 flex items-center justify-center gap-3 active:scale-95"
                  >
                    {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Send className="w-6 h-6" /> Илгээх</>}
                  </button>
                </div>
              </form>

              {showSuccess && (
                <div className="mt-8 p-6 bg-emerald-50 text-emerald-700 rounded-3xl flex items-center gap-4 animate-in slide-in-from-top duration-500">
                  <CheckCircle2 className="w-8 h-8" />
                  <p className="font-bold">Таны хүсэлтийг хүлээн авлаа. Бид таны төлөө залбирах болно!</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Requests List */}
        <div className="space-y-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <MessageSquare className="w-7 h-7 text-teal-600" /> Сүүлийн хүсэлтүүд
            </h3>
            <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
              <Users className="w-4 h-4" /> {requests.length} хүсэлт
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {requests.map((req) => (
              <div 
                key={req.id} 
                className="bg-white p-8 md:p-10 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${req.isAnonymous ? 'bg-slate-100 text-slate-400' : 'bg-teal-100 text-teal-700'}`}>
                      {req.isAnonymous ? <Shield className="w-6 h-6" /> : req.author[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{req.isAnonymous ? 'Зочин' : req.author}</h4>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                        <Clock className="w-3 h-3" /> {req.date}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-700 rounded-full text-xs font-black">
                    <Users className="w-4 h-4" /> {req.prayerCount} хүн залбирсан
                  </div>
                </div>

                <p className="text-slate-600 text-lg md:text-xl leading-relaxed mb-8 italic font-medium">
                  "{req.text}"
                </p>

                <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                  <button 
                    onClick={() => handlePray(req.id)}
                    disabled={prayedIds.has(req.id)}
                    className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all ${
                      prayedIds.has(req.id) 
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                        : 'bg-slate-50 text-slate-600 hover:bg-teal-50 hover:text-teal-700'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${prayedIds.has(req.id) ? 'fill-current' : ''}`} />
                    {prayedIds.has(req.id) ? 'Залбирсан' : 'Би залбиръя'}
                  </button>
                  
                  <div className="hidden md:flex items-center gap-2 text-slate-300">
                    <UserIcon className="w-4 h-4" />
                    <span className="text-[10px] uppercase tracking-widest font-black">Илчлэлт Сүм</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrayerRequestPage;
