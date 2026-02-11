
import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  X, 
  User, 
  Phone, 
  Loader2,
  Info
} from 'lucide-react';
import { Event } from '../types';

const EVENTS: Event[] = [
  {
    id: '1',
    title: 'Бямба гарагийн гол цуглаан (Шаббат)',
    date: 'Долоо хоног бүр',
    time: '11:30 AM',
    location: 'Сүмийн төв байр',
    description: 'Бүх нийтийн магтан хүндэтгэл, сургаал номлолын цаг.'
  },
  {
    id: '2',
    title: 'Залуучуудын үдэш',
    date: 'Бямба гараг бүр',
    time: '18:00 PM',
    location: 'Залуучуудын танхим',
    description: 'Залуучуудад зориулсан сонирхолтой хөтөлбөр, нөхөрлөл.'
  },
  {
    id: '3',
    title: 'Эмэгтэйчүүдийн уулзалт',
    date: '2024.03.15',
    time: '14:00 PM',
    location: 'Уулзалтын өрөө 2',
    description: 'Эмэгтэйчүүдийн халуун дулаан нөхөрлөл, Библийн хичээл.'
  },
  {
    id: '4',
    title: 'Библийн хичээл',
    date: 'Бямба гараг бүр',
    time: '10:00 AM',
    location: 'Сүмийн төв байр',
    description: 'Долоо дахь өдрийн Адвентист сүмийн уламжлалт Библийн сургалт.'
  }
];

const EventRegistrationModal: React.FC<{
  event: Event | null;
  onClose: () => void;
  onSuccess: (eventTitle: string) => void;
}> = ({ event, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });

  if (!event) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulation of API call
    setTimeout(() => {
      setLoading(false);
      onSuccess(event.title);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
        <button 
          onClick={onClose}
          disabled={loading}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 md:p-12">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-100 rounded-2xl text-teal-700 mb-4">
              <Calendar className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Бүртгүүлэх</h2>
            <p className="text-slate-500 mt-2 font-medium">"{event.title}" арга хэмжээнд оролцох хүсэлт илгээх.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Бүтэн нэр</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  required
                  disabled={loading}
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                  placeholder="Жишээ: Батын Дорж"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Утасны дугаар</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="tel" 
                  required
                  disabled={loading}
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                  placeholder="99XXXXXX"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Гэрийн хаяг</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  required
                  disabled={loading}
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                  placeholder="Дүүрэг, хороо, байр, тоот"
                />
              </div>
            </div>

            <div className="bg-teal-50/50 p-4 rounded-2xl flex gap-3 text-sm text-teal-800 border border-teal-100">
              <Info className="w-5 h-5 flex-shrink-0 text-teal-600" />
              <p>Таны мэдээллийг бид зөвхөн энэхүү арга хэмжээний зохион байгуулалтад ашиглах бөгөөд нууцлалыг хадгална.</p>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-teal-700 text-white font-bold rounded-2xl hover:bg-teal-800 transition-all shadow-lg shadow-teal-700/20 active:scale-[0.98] mt-4 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Бүртгүүлэх'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const EventsPage: React.FC = () => {
  const [registeredEvent, setRegisteredEvent] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleRegisterSuccess = (title: string) => {
    setRegisteredEvent(title);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setRegisteredEvent(null), 8000);
  };

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Үйл ажиллагаа</h1>
          <p className="text-slate-600">Цуглаан болон бусад арга хэмжээнүүдийн цаг, бүртгэл.</p>
        </header>

        {registeredEvent && (
          <div className="mb-8 p-6 bg-teal-700 text-white rounded-[24px] shadow-xl flex items-center justify-between animate-in slide-in-from-top duration-500">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-2 rounded-full">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-lg">Амжилттай бүртгүүллээ!</h4>
                <p className="text-teal-100">"{registeredEvent}"-д оролцох таны хүсэлтийг хүлээн авлаа. Бид удахгүй холбогдох болно.</p>
              </div>
            </div>
            <button onClick={() => setRegisteredEvent(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="space-y-6">
          {EVENTS.map((event) => (
            <div key={event.id} className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm flex flex-col md:flex-row gap-8 items-start md:items-center hover:shadow-xl hover:-translate-y-1 transition-all border border-slate-100">
              <div className="bg-teal-50 p-5 rounded-2xl flex flex-col items-center justify-center min-w-[140px] border border-teal-100/50">
                <Calendar className="w-8 h-8 text-teal-700 mb-2" />
                <span className="font-bold text-teal-900 text-center leading-tight">{event.date}</span>
              </div>
              <div className="flex-grow">
                <h3 className="text-2xl font-bold mb-3 text-slate-900">{event.title}</h3>
                <p className="text-slate-600 mb-5 leading-relaxed">{event.description}</p>
                <div className="flex flex-wrap gap-5 text-sm font-semibold text-slate-500">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg">
                    <Clock className="w-4 h-4 text-teal-600" />
                    {event.time}
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg">
                    <MapPin className="w-4 h-4 text-teal-600" />
                    {event.location}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedEvent(event)}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-teal-700 text-white px-8 py-4 rounded-2xl font-bold hover:bg-teal-800 transition-all shadow-lg shadow-teal-700/10 active:scale-95"
              >
                Бүртгүүлэх <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-20 p-10 md:p-16 bg-slate-900 rounded-[40px] text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="relative z-10 text-center md:text-left">
            <h3 className="text-3xl font-bold mb-4">Бидэнтэй хамт байгаарай</h3>
            <p className="text-slate-400 max-w-md">Байр түрээс болон бусад асуудлаар бидэнтэй холбогдож хамтран ажиллах боломжтой.</p>
          </div>
          <button className="relative z-10 bg-teal-700 text-white px-10 py-5 rounded-2xl font-bold hover:bg-teal-800 transition-all whitespace-nowrap shadow-xl active:scale-95">
            Хүсэлт илгээх
          </button>
        </div>
      </div>

      {/* Registration Modal */}
      <EventRegistrationModal 
        event={selectedEvent} 
        onClose={() => setSelectedEvent(null)} 
        onSuccess={handleRegisterSuccess}
      />
    </div>
  );
};

export default EventsPage;
