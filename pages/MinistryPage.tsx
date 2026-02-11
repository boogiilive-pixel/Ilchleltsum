
import React, { useState } from 'react';
import { 
  Heart, 
  Users, 
  BookOpen, 
  Music, 
  Coffee, 
  ShieldCheck, 
  CheckCircle2, 
  X, 
  User, 
  Phone, 
  MapPin, 
  Loader2, 
  Info 
} from 'lucide-react';

const RegistrationModal: React.FC<{
  ministryName: string | null;
  onClose: () => void;
  onSuccess: (name: string) => void;
}> = ({ ministryName, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', note: '' });

  if (!ministryName) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulation of API call
    setTimeout(() => {
      setLoading(false);
      onSuccess(ministryName);
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
              <Users className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Багт нэгдэх</h2>
            <p className="text-slate-500 mt-2 font-medium">"{ministryName}" багт хүчээ өгөх хүсэлт илгээх.</p>
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
              <label className="block text-sm font-bold text-slate-700 mb-2">Нэмэлт мэдээлэл (сонголттой)</label>
              <textarea 
                rows={3}
                disabled={loading}
                value={formData.note}
                onChange={(e) => setFormData({...formData, note: e.target.value})}
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                placeholder="Таны өмнөх туршлага эсвэл бусад зүйлс..."
              />
            </div>

            <div className="bg-teal-50/50 p-4 rounded-2xl flex gap-3 text-sm text-teal-800 border border-teal-100">
              <Info className="w-5 h-5 flex-shrink-0 text-teal-600" />
              <p>Таны илгээсэн мэдээлэл манай сүмийн үйлчлэлийн удирдлагуудад очих бөгөөд бид удахгүй холбогдоно.</p>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-teal-700 text-white font-bold rounded-2xl hover:bg-teal-800 transition-all shadow-lg shadow-teal-700/20 active:scale-[0.98] mt-4 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Хүсэлт илгээх'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const MinistryPage: React.FC = () => {
  const [joinedMinistry, setJoinedMinistry] = useState<string | null>(null);
  const [selectedMinistryForForm, setSelectedMinistryForForm] = useState<string | null>(null);

  const ministries = [
    { icon: Heart, name: "Хүүхдийн үйлчлэл", desc: "Хамгийн бяцхан итгэгчдэд зориулсан Библийн хичээл болон тоглоомын цаг." },
    { icon: Users, name: "Залуучуудын үйлчлэл", desc: "Ахлах сургууль болон оюутан залуучуудын сүнслэг өсөлтөд зориулсан хөтөлбөр." },
    { icon: Music, name: "Магтан хүндэтгэл", desc: "Авьяас чадвараа Бурханыг алдаршуулахад зориулж буй хөгжимчин, дуучдын баг." },
    { icon: BookOpen, name: "Библийн сургалт", desc: "Бурханы үгийг илүү гүнзгий судлахыг хүссэн хэн бүхэнд нээлттэй ангиуд." },
    { icon: ShieldCheck, name: "Залбирлын үйлчлэл", desc: "Бусдын болон улс орныхоо төлөө тогтмол залбирдаг баг." },
    { icon: Coffee, name: "Угталт ба Үйлчилгээ", desc: "Цуглаанд ирсэн хүмүүсийг угтан авах, цай кофегоор үйлчлэх баг." }
  ];

  const handleJoinSuccess = (name: string) => {
    setJoinedMinistry(name);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setJoinedMinistry(null), 6000);
  };

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        {joinedMinistry && (
          <div className="mb-12 p-6 bg-teal-700 text-white rounded-3xl shadow-xl flex items-center justify-between animate-in slide-in-from-top duration-500">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-2 rounded-full">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-lg">Хүсэлтийг хүлээн авлаа!</h4>
                <p className="text-teal-100">Таныг "{joinedMinistry}" багт нэгдэх хүсэлт гаргасанд баярлалаа. Бид тантай удахгүй холбогдох болно.</p>
              </div>
            </div>
            <button onClick={() => setJoinedMinistry(null)} className="p-2 hover:bg-white/10 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <header className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold mb-4 text-slate-900">Үйлчлэлүүд</h1>
          <p className="text-slate-600 text-lg">Та өөрийн авьяас чадвар, хүсэл сонирхолд нийцсэн үйлчлэлийн багт нэгдэж, бусдад туслах боломжтой.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ministries.map((m, idx) => (
            <div key={idx} className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-lg transition-all group">
              <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-700 mb-6 group-hover:bg-teal-700 group-hover:text-white transition-all">
                <m.icon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">{m.name}</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">{m.desc}</p>
              <button 
                onClick={() => setSelectedMinistryForForm(m.name)}
                className="text-teal-700 font-bold border-b-2 border-teal-100 hover:border-teal-700 transition-all"
              >
                Багт нэгдэх
              </button>
            </div>
          ))}
        </div>

        <section className="mt-24 rounded-[48px] overflow-hidden relative shadow-2xl group">
          <img 
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80" 
            alt="Join Ministry" 
            className="w-full h-[500px] object-cover brightness-[0.4] transition-transform duration-[2s] group-hover:scale-110"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-8">
            <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight max-w-2xl">Та яагаад үйлчлэх ёстой вэ?</h2>
            <p className="max-w-2xl text-lg md:text-xl mb-12 text-slate-200 font-medium">"Та нарын дунд хэн агуу нь байхыг хүснэ, тэр нь үйлчлэгч чинь байх ёстой." <br /><span className="text-teal-400 font-bold italic mt-2 inline-block">— Матай 20:26</span></p>
            <button 
              onClick={() => setSelectedMinistryForForm("Ерөнхий үйлчлэл")}
              className="bg-teal-600 px-12 py-5 rounded-2xl font-bold text-xl hover:bg-teal-700 transition-all shadow-2xl active:scale-95 flex items-center gap-3"
            >
              <Heart className="w-6 h-6 fill-current" /> Өнөөдөр нэгдээрэй
            </button>
          </div>
        </section>
      </div>

      <RegistrationModal 
        ministryName={selectedMinistryForForm} 
        onClose={() => setSelectedMinistryForForm(null)}
        onSuccess={handleJoinSuccess}
      />
    </div>
  );
};

export default MinistryPage;
