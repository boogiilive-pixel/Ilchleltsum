
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Facebook, Youtube, Send, CheckCircle2, ExternalLink } from 'lucide-react';

const ContactPage: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    topic: 'Залбирлын хүсэлт',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    
    setStatus('sending');
    // Дуурайлган илгээх хугацаа
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', phone: '', topic: 'Залбирлын хүсэлт', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    }, 1500);
  };

  const mapLink = "https://maps.app.goo.gl/wDGGaLogDJDRNRpdA";

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4 text-slate-900">Холбоо барих</h1>
          <p className="text-slate-600">Бидэнтэй хүссэн үедээ холбогдож, асуух зүйлээ асуугаарай.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Info Side */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold mb-8">Мэдээлэл</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center text-teal-700">
                    <MapPin />
                  </div>
                  <div>
                    <h4 className="font-bold text-teal-900">Хаяг байршил</h4>
                    <p className="text-slate-600 font-medium">5р гудамж 261, HUD - 8 khoroo, Ulaanbaatar, Mongolia, 17111</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center text-teal-700">
                    <Phone />
                  </div>
                  <div>
                    <h4 className="font-bold text-teal-900">Утас</h4>
                    <p className="text-slate-600 font-medium">+976 9507-6599</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center text-teal-700">
                    <Facebook />
                  </div>
                  <div>
                    <h4 className="font-bold text-teal-900">Facebook</h4>
                    <p className="text-slate-600 font-medium">Илчлэлт</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-10 border-t border-slate-100">
                <h4 className="font-bold mb-4 text-slate-700">Олон нийтийн сүлжээ</h4>
                <div className="flex gap-4">
                  <a href="https://www.facebook.com/ilchleltsum" target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-teal-700 hover:text-white transition-all shadow-sm">
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a href="https://www.youtube.com/@ilchlelt" target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-teal-700 hover:text-white transition-all shadow-sm">
                    <Youtube className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Interactive Map Link */}
            <a 
              href={mapLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group relative block h-80 rounded-[40px] overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/20 transition-colors z-10 flex flex-col items-center justify-center">
                <div className="bg-white/95 backdrop-blur-md px-8 py-4 rounded-2xl shadow-xl flex items-center gap-3 font-black text-teal-800 transition-all group-hover:scale-110 group-hover:bg-teal-700 group-hover:text-white">
                  <MapPin className="w-6 h-6" />
                  <span>Газрын зураг дээр харах</span>
                  <ExternalLink className="w-4 h-4 opacity-50" />
                </div>
                <p className="mt-4 text-white font-bold text-sm tracking-widest uppercase bg-black/30 px-4 py-1 rounded-full backdrop-blur-sm">Илчлэлт Сүм - Байршил</p>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80" 
                alt="Map View" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
              />
            </a>
          </div>

          {/* Form Side */}
          <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-lg border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-full -mr-16 -mt-16 -z-10"></div>
            {status === 'success' ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 animate-in zoom-in">
                <div className="w-20 h-20 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Амжилттай илгээгдлээ!</h2>
                <p className="text-slate-600 max-w-sm mx-auto">Бид таны хүсэлтийг хүлээн авлаа. Тантай удахгүй эргэн холбогдох болно. Баярлалаа.</p>
                <button 
                  onClick={() => setStatus('idle')}
                  className="mt-8 px-8 py-3 bg-slate-100 text-teal-700 font-bold rounded-xl hover:bg-slate-200 transition-all"
                >
                  Дахин зурвас илгээх
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-black mb-4 text-slate-900">Хүсэлт илгээх</h2>
                <p className="text-slate-500 mb-8 font-medium">Танд залбирлын хүсэлт эсвэл асуулт байвал доорх формоор илгээнэ үү.</p>
                
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Нэр</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all font-medium"
                        placeholder="Таны нэр"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Утас</label>
                      <input 
                        type="tel" 
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all font-medium"
                        placeholder="99XXXXXX"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Сэдэв</label>
                    <select 
                      value={formData.topic}
                      onChange={(e) => setFormData({...formData, topic: e.target.value})}
                      className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 font-bold text-slate-700"
                    >
                      <option>Залбирлын хүсэлт</option>
                      <option>Цуглаанд нэгдэх</option>
                      <option>Үйлчлэлийн талаар асуух</option>
                      <option>Бусад</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Зурвас</label>
                    <textarea 
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all font-medium"
                      placeholder="Энд бичнэ үү..."
                    ></textarea>
                  </div>
                  <button 
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full py-5 bg-teal-700 text-white font-black text-lg rounded-2xl hover:bg-teal-800 transition-all shadow-xl shadow-teal-700/20 flex items-center justify-center gap-3 disabled:bg-teal-400 active:scale-[0.98]"
                  >
                    {status === 'sending' ? (
                      <>Бичиж байна...</>
                    ) : (
                      <><Send className="w-6 h-6" /> Зурвас илгээх</>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
