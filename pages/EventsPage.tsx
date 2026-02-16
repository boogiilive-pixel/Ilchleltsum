
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  X, 
  User as UserIcon, 
  Phone, 
  Loader2,
  Info,
  BookOpen,
  HandHeart,
  Users,
  Music,
  Coffee,
  ShieldCheck,
  Heart,
  MessageSquare,
  Sparkles,
  Mail
} from 'lucide-react';
import { Event } from '../types.ts';
import { User } from '../App.tsx';

const HEADER_IMAGE = "https://lh3.googleusercontent.com/d/1ai_6o6PLa0IwGChs8IrZx3eypRknz9bs";

const EVENTS: Event[] = [
  {
    id: '1',
    title: 'Библи судлал Онлайн',
    date: 'Лхагва гараг бүр',
    time: '18:30 PM',
    location: 'Онлайн (Zoom / Facebook)',
    description: 'Бурханы үгийг хамтдаа гүнзгийрүүлэн судалж, сүнслэг мэдлэгээ тэлж, амьдралын чухал асуултууддаа Библиэс хариулт авах танин мэдэхүйн цаг.'
  },
  {
    id: '2',
    title: 'Залбирлын цуглаан',
    date: 'Баасан гараг бүр',
    time: '18:30 PM',
    location: 'Сүмийн төв байр',
    description: 'Зүрх сэтгэлээ нэгтгэн Бурхантай ярилцах ариун мөч. Залбирал бол биднийг Бурхантай холбодог алтан гүүр бөгөөд итгэгч хүний хүч чадлын эх ундарга юм.'
  },
  {
    id: '3',
    title: 'Хүндэтгэлийн цуглаан',
    date: 'Бямба гараг бүр',
    time: '10:00 AM',
    location: 'Сүмийн төв байр',
    description: 'Магтан хүндэтгэл, амьд сургаал номлолоор дамжуулан Бурханы ивээлд хамтдаа амрах Шаббат өдрийн баяр.'
  }
];

const MINISTRIES = [
  { icon: Heart, name: "Хүүхдийн үйлчлэл", desc: "Хамгийн бяцхан итгэгчдэд зориулсан Библийн хичээл болон тоглоомын цаг." },
  { icon: Users, name: "Залуучуудын үйлчлэл", desc: "Ахлах сургууль болон оюутан залуучуудын сүнслэг өсөлтөд зориулсан хөтөлбөр." },
  { icon: Music, name: "Магтан хүндэтгэл", desc: "Авьяас чадвараа Бурханыг алдаршуулахад зориулж буй хөгжимчин, дуучдын баг." },
  { icon: BookOpen, name: "Библийн сургалт", desc: "Бурханы үгийг илүү гүнзгий судлахыг хүссэн хэн бүхэнд нээлттэй ангиуд." },
  { icon: ShieldCheck, name: "Залбирлын үйлчлэл", desc: "Бусдын болон улс орныхоо төлөө тогтмол залбирдаг баг." },
  { icon: Coffee, name: "Угталт ба Үйлчилгээ", desc: "Цуглаанд ирсэн хүмүүсийг угтан авах, цай кофегоор үйлчлэх баг." }
];

const UniversalModal: React.FC<{
  title: string | null;
  type: 'event' | 'ministry' | null;
  user: User | null;
  onClose: () => void;
  onSuccess: (targetTitle: string) => void;
}> = ({ title, type, user, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', note: '' });

  useEffect(() => {
    if (user && title) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  }, [user, title]);

  if (!title) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("https://formspree.io/f/xdalgqob", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          selection_type: type,
          selection_title: title,
          _subject: `Илчлэлт Сүм: ${type === 'event' ? 'Цуглааны бүртгэл' : 'Багт нэгдэх хүсэлт'} (${title})`,
        })
      });

      if (response.ok) {
        onSuccess(title);
        onClose();
      } else {
        alert("Илгээлтэд алдаа гарлаа. Дахин оролдоно уу.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("Холболтын алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
        <button onClick={onClose} disabled={loading} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors disabled:opacity-50">
          <X className="w-5 h-5" />
        </button>
        <div className="p-8 md:p-12">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-100 rounded-2xl text-teal-700 mb-4">
              {type === 'event' ? <Calendar className="w-6 h-6" /> : <Users className="w-6 h-6" />}
            </div>
            <h2 className="text-2xl font-bold text-slate-900">{type === 'event' ? 'Бүртгүүлэх' : 'Багт нэгдэх'}</h2>
            <p className="text-slate-500 mt-2 font-medium">"{title}" хүсэлт илгээх.</p>
          </div>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Бүтэн нэр</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input name="name" type="text" required disabled={loading} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all font-medium" placeholder="Таны нэр" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Имэйл хаяг</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input name="email" type="email" required disabled={loading} value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all font-medium" placeholder="Таны имэйл" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Утасны дугаар</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input name="phone" type="tel" required disabled={loading} value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all font-medium" placeholder="99XXXXXX" />
              </div>
            </div>
            <div className="bg-teal-50/50 p-4 rounded-2xl flex gap-3 text-sm text-teal-800 border border-teal-100">
              <Info className="w-5 h-5 flex-shrink-0 text-teal-600" />
              <p>Таны мэдээллийг хүлээн авсны дараа бид тантай холбогдох болно.</p>
            </div>
            <button type="submit" disabled={loading} className="w-full py-4 bg-teal-700 text-white font-bold rounded-2xl hover:bg-teal-800 transition-all shadow-lg flex items-center justify-center gap-2">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Хүсэлт илгээх'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const EventsPage: React.FC<{ user?: User | null }> = ({ user = null }) => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<{title: string, type: 'event' | 'ministry'} | null>(null);

  const handleSuccess = (title: string) => {
    setSuccessMessage(`Таны мэдээллийг хүлээн авсны дараа бид тантай холбогдох болно.`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setSuccessMessage(null), 10000);
  };

  return (
    <div className="pb-20 bg-slate-50 min-h-screen">
      <section className="relative h-[400px] md:h-[600px] overflow-hidden mb-16">
        <div className="absolute inset-0 z-0">
          <img src={HEADER_IMAGE} alt="Events Header" className="w-full h-full object-cover animate-[subtleZoom_20s_infinite_alternate]" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-50"></div>
        </div>
        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 flex flex-col justify-center items-start pt-20">
          <div className="animate-in fade-in slide-in-from-bottom duration-1000 fill-mode-forwards">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold mb-6 backdrop-blur-md uppercase tracking-widest">
              <Sparkles className="w-4 h-4" /> Итгэлийн нэгдэл
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-white mb-6 leading-tight drop-shadow-2xl">Үйл ажиллагаа ба <br /> <span className="text-teal-400">Үйлчлэл</span></h1>
          </div>
        </div>
        <style>{`@keyframes subtleZoom { from { transform: scale(1); } to { transform: scale(1.15); } }`}</style>
      </section>

      <div className="max-w-7xl mx-auto px-4">
        {successMessage && (
          <div className="mb-8 p-6 bg-teal-700 text-white rounded-[24px] shadow-xl flex items-center justify-between animate-in slide-in-from-top duration-500">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-2 rounded-full"><CheckCircle2 className="w-6 h-6" /></div>
              <div>
                <h4 className="font-bold text-lg">Амжилттай!</h4>
                <p className="text-teal-100">{successMessage}</p>
              </div>
            </div>
            <button onClick={() => setSuccessMessage(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-5 h-5" /></button>
          </div>
        )}

        <section className="mb-24">
          <div className="flex items-center gap-4 mb-10"><div className="w-10 h-1 bg-teal-600 rounded-full"></div><h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight">Тогтмол цуглаанууд</h2></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {EVENTS.map((event) => (
              <div key={event.id} className="bg-white p-8 rounded-[40px] shadow-sm flex flex-col hover:shadow-2xl hover:-translate-y-2 transition-all border border-slate-100 group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-full -mr-16 -mt-16 group-hover:bg-teal-100 transition-colors -z-0"></div>
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-teal-50 text-teal-700 rounded-2xl mb-6 group-hover:bg-teal-700 group-hover:text-white transition-all">
                    {event.id === '1' ? <BookOpen /> : event.id === '2' ? <HandHeart /> : <Users />}
                  </div>
                  <h3 className="text-2xl font-black mb-4 text-slate-900">{event.title}</h3>
                  <p className="text-slate-500 mb-8 leading-relaxed font-medium line-clamp-3">{event.description}</p>
                  <button onClick={() => setSelectedTarget({title: event.title, type: 'event'})} className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-2xl font-bold hover:bg-teal-700 transition-all shadow-lg active:scale-95">Нэгдэх <ArrowRight className="w-5 h-5" /></button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-20">
          <div className="flex items-center gap-4 mb-10"><div className="w-10 h-1 bg-teal-600 rounded-full"></div><h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight">Үйлчлэлийн багууд</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MINISTRIES.map((m, idx) => (
              <div key={idx} className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 hover:shadow-xl transition-all group">
                <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-700 mb-6 group-hover:bg-teal-700 group-hover:text-white transition-all"><m.icon className="w-8 h-8" /></div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900">{m.name}</h3>
                <p className="text-slate-600 mb-8 leading-relaxed font-medium">{m.desc}</p>
                <button onClick={() => setSelectedTarget({title: m.name, type: 'ministry'})} className="inline-flex items-center gap-2 text-teal-700 font-bold border-b-2 border-teal-100 hover:border-teal-700 transition-all uppercase tracking-widest text-xs">Багт нэгдэх <ArrowRight className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </section>
      </div>
      <UniversalModal title={selectedTarget?.title || null} type={selectedTarget?.type || null} user={user} onClose={() => setSelectedTarget(null)} onSuccess={handleSuccess} />
    </div>
  );
};

export default EventsPage;
