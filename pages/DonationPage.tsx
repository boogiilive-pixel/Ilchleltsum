
import React from 'react';
import { Heart, Coins, Quote, CheckCircle2, Copy, Sparkles, HandHeart } from 'lucide-react';

const TDBLogoIcon = ({ className = "w-16 h-16" }) => (
  <div className={`${className} bg-[#0091DA] rounded-2xl flex items-center justify-center p-2 shadow-inner overflow-hidden`}>
    <svg viewBox="0 0 100 100" className="w-full h-full text-white fill-none stroke-current stroke-[6]">
      <circle cx="50" cy="50" r="28" strokeWidth="6" />
      <path d="M50 22 L50 34 M50 66 L50 78 M22 50 L34 50 M66 50 L78 50" strokeWidth="4" />
      <rect x="42" y="42" width="16" height="16" fill="currentColor" stroke="none" />
      <path d="M40 30 Q50 20 60 30" strokeWidth="4" />
      <path d="M40 70 Q50 80 60 70" strokeWidth="4" />
      <path d="M30 40 Q20 50 30 60" strokeWidth="4" />
      <path d="M70 40 Q80 50 70 60" strokeWidth="4" />
    </svg>
  </div>
);

const DonationPage: React.FC = () => {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 mb-20">
        <div className="relative rounded-[40px] overflow-hidden h-[400px] md:h-[500px] shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=1200&q=80" 
            alt="Giving hands" 
            className="w-full h-full object-cover brightness-50"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-white">
            <div className="bg-teal-500/30 backdrop-blur-md px-4 py-1 rounded-full mb-6 border border-white/20 text-sm font-bold uppercase tracking-wider">
              Өгөхүй ба Итгэл
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Өгөхүй бол Ивээл юм</h1>
            <p className="max-w-2xl text-lg md:text-xl text-slate-100 font-medium">
              "Өгөх нь авахаасаа илүү ерөөлтэй." — Үйлс 20:35
            </p>
          </div>
        </div>
      </section>

      {/* Bible Verse Section */}
      <section className="max-w-4xl mx-auto px-4 mb-24">
        <div className="bg-white p-10 md:p-16 rounded-[40px] shadow-xl border border-teal-100 relative">
          <Quote className="absolute top-8 left-8 w-16 h-16 text-teal-500/10" />
          <div className="relative z-10">
            <h2 className="text-teal-700 font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Малахи 3:10
            </h2>
            <p className="text-2xl md:text-3xl font-bold text-slate-800 leading-tight mb-8 italic">
              "Аравны нэгийг бүгдийг нь агуулахад авчир. Тэгвэл Миний өргөөнд хүнс байх болно. Намайг үүгээр сорь... Би тэнгэрийн цонхнуудыг та нарт нээж, багтахгүй болтол ерөөл асгахгүй байна уу, үз гэв."
            </p>
            <div className="h-1 w-24 bg-teal-500 rounded-full mb-8"></div>
            <p className="text-slate-600 text-lg leading-relaxed">
              Энэ бол Бурханы бидэнд өгсөн хамгийн гайхалтай амлалтуудын нэг юм. Бид өөрт байгаа зүйлийнхээ хэсгийг Түүний үйл хэрэгт зориулахад Тэрээр бидний амьдралын "тэнгэрийн цонхыг" нээж, хэмжээлшгүй ерөөлөөр бялхуулдаг.
            </p>
          </div>
        </div>
      </section>

      {/* Bank Account Section */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-slate-900 rounded-[40px] p-10 md:p-16 text-white text-center shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>
          
          <h2 className="text-3xl font-bold mb-8 relative z-10">Хандивын данс</h2>
          
          <div className="flex justify-center relative z-10">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 md:p-12 rounded-[48px] group hover:bg-white/10 transition-all w-full max-w-xl">
              {/* TDB Icon SVG based on provided image */}
              <div className="flex justify-center mb-8">
                <TDBLogoIcon className="w-20 h-20 md:w-24 md:h-24 scale-110" />
              </div>
              
              <p className="text-teal-400 text-sm font-black uppercase mb-8 tracking-[0.3em]">Худалдаа Хөгжлийн Банк</p>
              
              <div className="space-y-8">
                <div className="flex flex-col items-center">
                  <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mb-3 opacity-60">IBAN Дугаар</span>
                  <div className="flex items-center gap-4 bg-white/5 px-8 py-4 rounded-[20px] border border-white/5 group-hover:border-white/10 transition-all">
                    <span className="text-xl md:text-3xl font-bold tracking-[0.15em] font-mono">210004000</span>
                    <button onClick={() => copyToClipboard('210004000')} className="text-white/40 hover:text-teal-400 transition-colors p-2">
                      <Copy className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mb-3 opacity-60">Дансны дугаар</span>
                  <div className="flex items-center gap-4 bg-teal-500/10 px-10 py-5 rounded-[24px] border border-teal-500/20 shadow-[0_0_30px_rgba(20,184,166,0.1)] group-hover:scale-105 transition-transform">
                    <span className="text-3xl md:text-5xl font-black tracking-[0.1em] text-teal-400 font-mono">835000219</span>
                    <button onClick={() => copyToClipboard('835000219')} className="text-white/40 hover:text-white transition-colors p-2">
                      <Copy className="w-8 h-8" />
                    </button>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/10 mt-8">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3 opacity-70">Хүлээн авагч</p>
                  <p className="text-2xl md:text-3xl text-white font-black leading-tight">Монголын Адвентист Чуулган</p>
                </div>
              </div>
            </div>
          </div>

          {copied && (
            <div className="mt-8 text-teal-400 flex items-center justify-center gap-2 animate-in zoom-in duration-300">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-bold tracking-wide">Мэдээлэл хуулагдлаа!</span>
            </div>
          )}

          <p className="mt-12 text-slate-400 text-sm max-w-lg mx-auto leading-relaxed font-medium">
            Та гүйлгээний утга дээр өөрийн нэрийг бичих эсвэл "Илчлэлт сүм хандив" гэж бичиж болно. Бид таны өгөөмөр сэтгэлд талархаж байна.
          </p>
        </div>
      </section>

      {/* Spiritual Encouragement Callout */}
      <section className="max-w-7xl mx-auto px-4 mt-24 text-center">
        <div className="max-w-2xl mx-auto bg-teal-50/50 p-10 rounded-[40px] border border-teal-100/50">
          <h3 className="text-2xl font-bold mb-4 italic text-slate-700 leading-relaxed">"Өгөөмөр сэтгэлтэй хүн дэгжинэ, бусдыг ундаалагч өөрөө ундаална."</h3>
          <p className="text-teal-700 font-black tracking-widest uppercase text-sm">— Сургаалт үгс 11:25</p>
        </div>
      </section>
    </div>
  );
};

export default DonationPage;
