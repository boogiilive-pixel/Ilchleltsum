
import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Youtube, 
  Send, 
  CheckCircle2, 
  Loader2, 
  Clock, 
  MessageCircle,
  ExternalLink,
  Sparkles,
  Map as MapIcon,
  Navigation,
  AlertCircle
} from 'lucide-react';
import { SUBMIT_URL } from '../App';

const ContactPage: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    topic: 'Залбирлын хүсэлт',
    message: ''
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic Validation
    if (formData.name.trim().length < 2 || formData.phone.trim().length < 8 || formData.message.trim().length < 5) {
      setError("Уучлаарай та үнэн зөв мэдээлэл оруулан уу!");
      return;
    }

    setStatus('sending');
    
    try {
      const params = new URLSearchParams();
      params.append('name', formData.name);
      params.append('phone', formData.phone);
      params.append('topic', formData.topic);
      params.append('message', formData.message);

      await fetch(SUBMIT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString()
      });

      setTimeout(() => {
        setStatus('success');
        setFormData({ name: '', phone: '', topic: 'Залбирлын хүсэлт', message: '' });
      }, 1500);
      
    } catch (err) {
      console.error("Form submission error:", err);
      setStatus('success');
    }
  };

  const MAP_URL = "https://maps.app.goo.gl/gsd7eu7zBAG1zKhn9";
  const GOOGLE_MAPS_EMBED = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2674.397283486333!2d106.91631407689127!3d47.88140006830573!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5d96939988220803%3A0xc6651f6540ca7095!2z0JjQu9GH0LvRjdC70YIg0YHRr9C8!5e0!3m2!1sen!2smn!4v1711537241234!5m2!1sen!2smn";

  const contactCards = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Дуудлага хийх",
      value: "+976 9507-6599",
      sub: "Өдөр бүр 10:00 - 20:00",
      link: "tel:+97695076599",
      color: "bg-blue-500"
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Чат бичих",
      value: "Facebook Messenger",
      sub: "Шууд холбогдох",
      link: "https://m.me/ilchleltsum",
      color: "bg-indigo-500"
    }
  ];

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-teal-500/5 to-transparent pointer-events-none"></div>
      <div className="absolute top-[-50px] right-[-50px] w-80 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <header className={`mb-16 text-center transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold mb-6">
            <Sparkles className="w-4 h-4" /> Бид таныг сонсоход бэлэн байна
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-slate-900 tracking-tight">Холбоо барих</h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto font-normal leading-relaxed">
            Залбирлын хүсэлт, асуулт эсвэл санал хүсэлтээ бидэнд илгээгээрэй. Бид тантай удахгүй холбогдох болно.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
          {/* Info & Map Column */}
          <div className={`lg:col-span-5 flex flex-col space-y-8 transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
            
            <div className="grid grid-cols-1 gap-4">
              {contactCards.map((card, idx) => (
                <a 
                  key={idx} 
                  href={card.link} 
                  target={card.link.startsWith('http') ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  className="group bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className={`w-14 h-14 ${card.color} text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform`}>
                    {card.icon}
                  </div>
                  <div>
                    <h4 className="text-slate-400 text-xs font-medium mb-0.5">{card.title}</h4>
                    <p className="text-slate-900 font-semibold text-lg">{card.value}</p>
                    <p className="text-slate-400 text-xs">{card.sub}</p>
                  </div>
                </a>
              ))}
            </div>

            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 relative group overflow-hidden flex flex-col flex-grow">
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-teal-600 text-white rounded-xl flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Манай хаяг</h3>
                </div>
                
                <p className="text-slate-600 font-medium text-lg leading-relaxed mb-8">
                  ХУД, 8-р хороо, 5-р гудамж, 261 тоот, <br />
                  Улаанбаатар хот, Монгол улс
                </p>

                <div className="flex-grow flex flex-col mb-8">
                  <a 
                    href={MAP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block relative flex-grow min-h-[200px] rounded-3xl overflow-hidden border border-slate-100 shadow-inner group/map"
                  >
                    <iframe 
                      src={GOOGLE_MAPS_EMBED} 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0, pointerEvents: 'none' }} 
                      title="Map"
                      className="group-hover/map:scale-105 transition-transform duration-700"
                    ></iframe>
                    <div className="absolute inset-0 bg-slate-900/0 group-hover/map:bg-slate-900/5 flex items-center justify-center transition-all">
                      <div className="bg-white/95 backdrop-blur px-6 py-3 rounded-2xl shadow-xl font-semibold text-teal-700 flex items-center gap-2 opacity-0 group-hover/map:opacity-100 transition-opacity">
                        <Navigation className="w-5 h-5" /> Газрын зурагт нээх
                      </div>
                    </div>
                  </a>
                </div>

                <a 
                  href={MAP_URL} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-4 bg-slate-900 text-white font-semibold rounded-2xl hover:bg-teal-700 transition-all shadow-lg group/btn"
                >
                  Зам заалгах <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className={`lg:col-span-7 transition-all duration-1000 delay-500 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
            <div className="bg-white p-8 md:p-14 rounded-[48px] shadow-sm border border-slate-100 relative h-full">
              {status === 'success' ? (
                <div className="text-center py-20 animate-in zoom-in h-full flex flex-col justify-center items-center">
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mb-8">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4 text-slate-900">Баярлалаа!</h2>
                  <p className="text-slate-500 text-lg mb-10 max-w-sm mx-auto">Таны зурвасыг бид хүлээн авлаа. Бид тантай тун удахгүй холбогдох болно.</p>
                  <button 
                    onClick={() => { setStatus('idle'); setError(null); }} 
                    className="px-8 py-3.5 bg-slate-900 text-white font-semibold rounded-xl hover:bg-teal-700 transition-all"
                  >
                    Дахин бичих
                  </button>
                </div>
              ) : (
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-4 mb-12">
                    <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center">
                      <MessageCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Зурвас илгээх</h2>
                      <p className="text-slate-400 text-sm font-medium mt-1">Бид танд хариулахад таатай байх болно</p>
                    </div>
                  </div>

                  {error && (
                    <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-semibold animate-in slide-in-from-top-2">
                      <AlertCircle className="w-5 h-5" />
                      {error}
                    </div>
                  )}
                  
                  <form className="space-y-8 flex-grow flex flex-col" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-3 ml-1">Бүтэн нэр</label>
                        <input 
                          name="name" 
                          type="text" 
                          required 
                          value={formData.name} 
                          onChange={(e) => setFormData({...formData, name: e.target.value})} 
                          className={`w-full px-6 py-4 rounded-2xl bg-slate-50 border ${error && formData.name.length < 2 ? 'border-red-300 ring-1 ring-red-50' : 'border-slate-100'} focus:bg-white focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500 outline-none font-medium text-slate-900 transition-all`} 
                          placeholder="Жишээ: Бат-Эрдэнэ" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-3 ml-1">Утасны дугаар</label>
                        <input 
                          name="phone" 
                          type="tel" 
                          required 
                          value={formData.phone} 
                          onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                          className={`w-full px-6 py-4 rounded-2xl bg-slate-50 border ${error && formData.phone.length < 8 ? 'border-red-300 ring-1 ring-red-50' : 'border-slate-100'} focus:bg-white focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500 outline-none font-medium text-slate-900 transition-all`} 
                          placeholder="99XXXXXX" 
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3 ml-1">Холбогдох сэдэв</label>
                      <div className="relative">
                        <select 
                          value={formData.topic}
                          onChange={(e) => setFormData({...formData, topic: e.target.value})}
                          className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500 outline-none font-medium text-slate-900 transition-all appearance-none cursor-pointer"
                        >
                          <option>Залбирлын хүсэлт</option>
                          <option>Библийн хичээл авах</option>
                          <option>Цуглааны мэдээлэл</option>
                          <option>Сүмд нэгдэх хүсэлт</option>
                          <option>Бусад</option>
                        </select>
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                           <Clock className="w-5 h-5" />
                        </div>
                      </div>
                    </div>

                    <div className="flex-grow flex flex-col">
                      <label className="block text-sm font-semibold text-slate-700 mb-3 ml-1">Таны зурвас</label>
                      <textarea 
                        name="message" 
                        rows={5} 
                        value={formData.message} 
                        onChange={(e) => setFormData({...formData, message: e.target.value})} 
                        className={`w-full flex-grow px-6 py-5 rounded-3xl bg-slate-50 border ${error && formData.message.length < 5 ? 'border-red-300 ring-1 ring-red-50' : 'border-slate-100'} focus:bg-white focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500 outline-none font-medium text-slate-900 transition-all resize-none min-h-[150px]`} 
                        placeholder="Энд бичнэ үү..."
                      ></textarea>
                    </div>

                    <button 
                      type="submit" 
                      disabled={status === 'sending'} 
                      className="group w-full py-5 bg-teal-700 text-white font-bold text-lg rounded-2xl hover:bg-slate-900 transition-all shadow-xl flex items-center justify-center gap-3 active:scale-[0.99] disabled:opacity-70 mt-4"
                    >
                      {status === 'sending' ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <>
                          Зурвас илгээх
                          <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      ` }} />
    </div>
  );
};

export default ContactPage;
