
import React from 'react';
import { Heart, Coins, Quote, CheckCircle2, Copy, Sparkles, HandHeart } from 'lucide-react';

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

      {/* Why Give Section */}
      <section className="max-w-7xl mx-auto px-4 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-8 text-slate-900 leading-tight">Таны хандив хаашаа <span className="text-teal-600">зарцуулагддаг вэ?</span></h2>
            <div className="space-y-6">
              {[
                { title: "Сайн мэдээ түгээх", desc: "Есүс Христийн хайр ба авралын мэдээг олон хүнд хүргэхэд.", icon: Sparkles },
                { title: "Хүүхэд, залуучууд", desc: "Хойч үеийнхний маань сүнслэг болон оюун санааны хөгжилд.", icon: Heart },
                { title: "Нийгмийн халамж", desc: "Ядуу зүдүү, өвчтэй, зовлонтой хүмүүст тусламжийн гар сунгахад.", icon: HandHeart },
                { title: "Сүмийн үйл ажиллагаа", desc: "Цуглаан болон цуглааны байрны засвар үйлчилгээг дэмжихэд.", icon: Coins }
              ].map((item, i) => (
                <div key={i} className="flex gap-5 group">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-teal-100 flex items-center justify-center text-teal-700 group-hover:bg-teal-700 group-hover:text-white transition-all">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                    <p className="text-slate-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=400&q=80" alt="Charity 1" className="rounded-3xl shadow-lg mt-8" />
            <img src="https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=400&q=80" alt="Charity 2" className="rounded-3xl shadow-lg" />
            <img src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=400&q=80" alt="Charity 3" className="rounded-3xl shadow-lg" />
            <img src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=400&q=80" alt="Charity 4" className="rounded-3xl shadow-lg -mt-8" />
          </div>
        </div>
      </section>

      {/* Bank Account Section */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-slate-900 rounded-[40px] p-10 md:p-16 text-white text-center shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>
          
          <h2 className="text-3xl font-bold mb-8 relative z-10">Хандивын данс</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl group hover:bg-white/10 transition-all">
              <img src="https://www.khanbank.com/static/images/khanbank-logo.png" alt="Khan Bank" className="h-10 mx-auto mb-6 brightness-0 invert opacity-60" />
              <p className="text-teal-400 text-sm font-bold uppercase mb-2">ХААН БАНК</p>
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="text-2xl font-bold tracking-widest">5000123456</span>
                <button onClick={() => copyToClipboard('5000123456')} className="text-white/40 hover:text-white transition-colors">
                  <Copy className="w-5 h-5" />
                </button>
              </div>
              <p className="text-slate-400 text-sm italic">Хүлээн авагч: Илчлэлт Сүм ТББ</p>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl group hover:bg-white/10 transition-all">
              <img src="https://www.tdbm.mn/static/images/logo.png" alt="TDB" className="h-10 mx-auto mb-6 brightness-0 invert opacity-60" />
              <p className="text-teal-400 text-sm font-bold uppercase mb-2">ХУДАЛДАА ХӨГЖЛИЙН БАНК</p>
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="text-2xl font-bold tracking-widest">404123456</span>
                <button onClick={() => copyToClipboard('404123456')} className="text-white/40 hover:text-white transition-colors">
                  <Copy className="w-5 h-5" />
                </button>
              </div>
              <p className="text-slate-400 text-sm italic">Хүлээн авагч: Илчлэлт Сүм ТББ</p>
            </div>
          </div>

          {copied && (
            <div className="mt-8 text-teal-400 flex items-center justify-center gap-2 animate-bounce">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-bold">Дансны дугаар хуулагдлаа!</span>
            </div>
          )}

          <p className="mt-12 text-slate-400 text-sm max-w-lg mx-auto leading-relaxed">
            Та гүйлгээний утга дээр өөрийн нэрийг бичих эсвэл "Хандив" гэж бичиж болно. Бид таны өгөөмөр сэтгэлд талархаж байна.
          </p>
        </div>
      </section>

      {/* Spiritual Encouragement Callout */}
      <section className="max-w-7xl mx-auto px-4 mt-24 text-center">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold mb-4 italic text-slate-700">"Өгөөмөр сэтгэлтэй хүн дэгжинэ, бусдыг ундаалагч өөрөө ундаална."</h3>
          <p className="text-teal-700 font-bold">— Сүргаалт үгс 11:25</p>
        </div>
      </section>
    </div>
  );
};

export default DonationPage;
