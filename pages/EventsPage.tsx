
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  Info,
  Globe,
  Heart
} from 'lucide-react';
import { Event } from '../types';

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
    description: 'Магтан хүндэтгэл, амьд сургаал номлолоор дамжуулан Бурханы ивээлд хамтдаа амрах Шаббат өдрийн баяр. Долоо хоногийн хамгийн эрхэм, амар амгалан мөч.'
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
            <p className="text-slate-500 mt-2 font-medium">"{event.title}"-д оролцох хүсэлт илгээх.</p>
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
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all font-medium"
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
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all font-medium"
                  placeholder="99XXXXXX"
                />
              </div>
            </div>

            <div className="bg-teal-50/50 p-4 rounded-2xl flex gap-3 text-sm text-teal-800 border border-teal-100">
              <Info className="w-5 h-5 flex-shrink-0 text-teal-600" />
              <p>Бид таны мэдээллийг хүлээн аваад, холбогдох заавар мэдээллийг (линк, байршил г.м) илгээх болно.</p>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-teal-700 text-white font-bold rounded-2xl hover:bg-teal-800 transition-all shadow-lg shadow-teal-700/20 active:scale-[0.98] mt-4 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Илгээх'}
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
          <h1 className="text-4xl font-black mb-4 text-slate-900">Үйл ажиллагаа</h1>
          <p className="text-slate-600 text-lg">Бидний цуглаан болон тогтмол арга хэмжээнүүд.</p>
        </header>

        {registeredEvent && (
          <div className="mb-8 p-6 bg-teal-700 text-white rounded-[24px] shadow-xl flex items-center justify-between animate-in slide-in-from-top duration-500">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-2 rounded-full">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-lg">Амжилттай илгээгдлээ!</h4>
                <p className="text-teal-100">"{registeredEvent}"-д оролцох таны хүсэлтийг хүлээн авлаа.</p>
              </div>
            </div>
            <button onClick={() => setRegisteredEvent(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="space-y-8">
          {EVENTS.map((event) => (
            <div key={event.id} className="bg-white p-6 md:p-10 rounded-[40px] shadow-sm flex flex-col md:flex-row gap-8 items-start md:items-center hover:shadow-2xl hover:-translate-y-1 transition-all border border-slate-100 group">
              <div className="bg-teal-50 p-6 rounded-3xl flex flex-col items-center justify-center min-w-[160px] border border-teal-100/50 group-hover:bg-teal-700 group-hover:border-teal-700 transition-colors">
                {event.title.includes('Онлайн') ? (
                   <Globe className="w-10 h-10 text-teal-700 mb-2 group-hover:text-white" />
                ) : event.title.includes('Залбирал') ? (
                   <Heart className="w-10 h-10 text-teal-700 mb-2 group-hover:text-white" />
                ) : (
                   <Calendar className="w-10 h-10 text-teal-700 mb-2 group-hover:text-white" />
                )}
                <span className="font-black text-teal-900 group-hover:text-white text-center leading-tight">{event.date}</span>
              </div>
              <div className="flex-grow">
                <h3 className="text-2xl font-black mb-3 text-slate-900">{event.title}</h3>
                <p className="text-slate-600 mb-6 leading-relaxed text-lg">{event.description}</p>
                <div className="flex flex-wrap gap-5 text-sm font-bold text-slate-500">
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                    <Clock className="w-5 h-5 text-teal-600" />
                    {event.time}
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                    <MapPin className="w-5 h-5 text-teal-600" />
                    {event.location}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedEvent(event)}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-teal-700 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-teal-800 transition-all shadow-xl shadow-teal-700/20 active:scale-95 whitespace-nowrap"
              >
                Нэгдэх <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-20 p-12 md:p-20 bg-slate-900 rounded-[60px] text-white flex flex-col lg:flex-row items-center justify-between gap-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full -mr-48 -mt-48 blur-[100px]"></div>
          <div className="relative z-10 text-center lg:text-left max-w-xl">
            <h3 className="text-4xl font-black mb-6">Хамтдаа өсөцгөөе</h3>
            <p className="text-slate-400 text-xl leading-relaxed">Бидний нөхөрсөг гэр бүлд нэгдэж, итгэл найдвараар дүүрэн амьдралыг хамтдаа бүтээхийг урьж байна.</p>
          </div>
          <Link 
            to="/contact"
            className="relative z-10 bg-teal-600 text-white px-12 py-6 rounded-2xl font-black text-xl hover:bg-teal-500 transition-all shadow-2xl active:scale-95"
          >
            Бидэнтэй холбогдох
          </Link>
        </div>
      </div>

      <EventRegistrationModal 
        event={selectedEvent} 
        onClose={() => setSelectedEvent(null)} 
        onSuccess={handleRegisterSuccess}
      />
    </div>
  );
};

export default EventsPage;
