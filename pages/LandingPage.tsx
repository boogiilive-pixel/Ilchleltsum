
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Play, 
  ArrowRight, 
  Heart, 
  Users, 
  Calendar, 
  Sparkles, 
  Star, 
  Loader2, 
  Camera, 
  Maximize2, 
  X,
  ChevronLeft,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { getEncouragement } from '../geminiService';

const GALLERY_IMAGES = [
  { url: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=800&q=80", title: "Нөхөрлөлийн цаг", size: "large" },
  { url: "https://images.unsplash.com/photo-1510590337019-5ef8d3d32116?auto=format&fit=crop&w=600&q=80", title: "Магтан хүндэтгэл", size: "small" },
  { url: "https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&w=600&q=80", title: "Залбирлын мөч", size: "small" },
  { url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80", title: "Манай хамт олон", size: "wide" },
  { url: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=600&q=80", title: "Библийн хичээл", size: "small" },
  { url: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=600&q=80", title: "Хайрын үйлчлэл", size: "small" },
];

const HERO_IMAGE_URL = "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1920&q=80";

const LandingPage: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [encouragement, setEncouragement] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedImageIdx, setSelectedImageIdx] = useState<number | null>(null);
  
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const handleGetEncouragement = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    const result = await getEncouragement(topic);
    setEncouragement(result);
    setLoading(false);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIdx !== null) {
      setSelectedImageIdx((selectedImageIdx + 1) % GALLERY_IMAGES.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIdx !== null) {
      setSelectedImageIdx((selectedImageIdx - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);
    }
  };

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section 
        ref={heroRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative h-screen flex items-center justify-center overflow-hidden bg-slate-900"
      >
        <div 
          className="absolute inset-0 z-0 transition-transform duration-700 ease-out scale-110"
          style={{ 
            transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)`,
          }}
        >
          <img 
            src={HERO_IMAGE_URL} 
            alt="Church Background" 
            className="w-full h-full object-cover opacity-60 brightness-50"
          />
        </div>

        <div 
          className="absolute inset-0 z-[1] pointer-events-none transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at ${(mousePos.x + 1) * 50}% ${(mousePos.y + 1) * 50}%, rgba(20, 184, 166, 0.15) 0%, transparent 50%)`
          }}
        ></div>

        <div className="relative z-10 text-center px-4 max-w-4xl transition-transform duration-500 ease-out"
          style={{ transform: `translate(${mousePos.x * 15}px, ${mousePos.y * 15}px)` }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-600/20 text-teal-300 border border-teal-500/30 text-sm font-bold mb-8 backdrop-blur-sm animate-bounce">
            <Star className="w-4 h-4 fill-current" />
            Тавтай морил
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-white mb-8 leading-tight tracking-tight">
            Гэрэл ба Хайрын <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">Өргөө</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-200 mb-12 max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-lg">
            Илчлэлт сүм нь таны амьдралд утга учир, итгэл найдвар бэлэглэх халуун дулаан гэр бүл юм.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to="/contact" className="group relative bg-teal-700 text-white px-10 py-5 rounded-full font-bold text-xl transition-all hover:bg-teal-800 hover:scale-105 shadow-[0_0_40px_rgba(20,184,166,0.3)] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              Цуглаанд нэгдэх
            </Link>
            <Link to="/sermons" className="bg-white/10 backdrop-blur-xl text-white border border-white/20 px-10 py-5 rounded-full font-bold text-xl hover:bg-white/20 transition-all flex items-center gap-3 group">
              <Play className="w-6 h-6 fill-current group-hover:scale-110 transition-transform" /> 
              Сургаал үзэх
            </Link>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-slate-900">Бидний Үйлчлэлүүд</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">Бид бүх насны хүмүүст зориулсан олон төрлийн үйл ажиллагаа явуулдаг.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Heart, title: "Хүүхдийн үйлчлэл", desc: "Хүүхдүүдийг Бурханы хайранд өсгөх тусгай хөтөлбөр." },
              { icon: Users, title: "Залуучуудын үйлчлэл", desc: "Шинэ үеийнхэнд зориулсан сонирхолтой нөхөрлөл." },
              { icon: Calendar, title: "Нийгмийн халамж", desc: "Нийгэмдээ тусалж, бусдыг хайрлах сайн үйлс." }
            ].map((service, i) => (
              <div key={i} className="p-10 rounded-[32px] bg-slate-50 hover:bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-slate-100 group">
                <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center text-teal-700 mb-8 group-hover:bg-teal-700 group-hover:text-white transition-all duration-500 shadow-sm">
                  <service.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900">{service.title}</h3>
                <p className="text-slate-600 mb-8 leading-relaxed">{service.desc}</p>
                <Link to="/ministries" className="inline-flex items-center gap-2 font-bold text-teal-700 hover:gap-4 transition-all group-hover:text-teal-800">
                  Дэлгэрэнгүй <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Gallery (Bento Grid) */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-teal-600 font-bold uppercase tracking-widest text-sm mb-4">
                <Camera className="w-5 h-5" /> Зургийн цомог
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">Бидний амьдралын <span className="text-teal-600">гэрэлт мөчүүд</span></h2>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px] md:auto-rows-[240px]">
            {GALLERY_IMAGES.map((img, idx) => {
              const spanClass = 
                img.size === 'large' ? 'col-span-2 row-span-2' : 
                img.size === 'wide' ? 'col-span-2 row-span-1' : 
                'col-span-1 row-span-1';
              
              return (
                <div 
                  key={idx}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`${spanClass} relative group rounded-[2rem] overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-2`}
                >
                  <img src={img.url} alt={img.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                    <p className="text-teal-400 font-bold text-sm mb-1 uppercase tracking-widest">{img.title}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-white text-xl font-bold">Илчлэлт Сүм</span>
                      <Maximize2 className="text-white w-6 h-6" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImageIdx !== null && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setSelectedImageIdx(null)}>
          <button className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors z-[210] p-2 bg-white/5 rounded-full" onClick={() => setSelectedImageIdx(null)}>
            <X className="w-8 h-8" />
          </button>
          <button className="absolute left-4 md:left-8 text-white/50 hover:text-white transition-colors z-[210] p-4 bg-white/5 rounded-full hover:bg-white/10" onClick={prevImage}>
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button className="absolute right-4 md:right-8 text-white/50 hover:text-white transition-colors z-[210] p-4 bg-white/5 rounded-full hover:bg-white/10" onClick={nextImage}>
            <ChevronRight className="w-8 h-8" />
          </button>
          <div className="relative max-w-5xl w-full h-[80vh] flex flex-col items-center justify-center" onClick={e => e.stopPropagation()}>
            <img src={GALLERY_IMAGES[selectedImageIdx].url} alt="Preview" className="max-w-full max-h-full object-contain rounded-3xl shadow-2xl animate-in zoom-in duration-500" />
            <div className="mt-8 text-center text-white">
              <h4 className="text-2xl font-bold mb-2">{GALLERY_IMAGES[selectedImageIdx].title}</h4>
              <p className="text-slate-400">Илчлэлт Сүм - {selectedImageIdx + 1} / {GALLERY_IMAGES.length}</p>
            </div>
          </div>
        </div>
      )}

      {/* AI Spiritual Encouragement */}
      <section className="py-32 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Sparkles className="text-teal-400 w-10 h-10 animate-pulse" />
            <h2 className="text-4xl md:text-5xl font-black">Өнөөдрийн Урам Зориг</h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mb-12 bg-white/5 p-2 rounded-[32px] border border-white/10 backdrop-blur-md">
            <input 
              type="text" 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGetEncouragement()}
              placeholder="Сэдэв (жишээ нь: итгэл найдвар, гэр бүл...)"
              className="flex-grow px-8 py-5 rounded-[24px] bg-transparent text-white placeholder-white/30 focus:outline-none text-lg"
            />
            <button onClick={handleGetEncouragement} disabled={loading} className="px-10 py-5 rounded-[24px] bg-teal-500 text-white font-bold text-lg hover:bg-teal-400 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Үг авах'}
            </button>
          </div>
          {encouragement && (
            <div className={`p-10 rounded-[40px] bg-white/5 backdrop-blur-xl border border-white/10 animate-in fade-in zoom-in duration-500 flex flex-col items-center gap-6`}>
               {encouragement.includes("API Key") ? (
                 <div className="flex items-center gap-3 text-amber-400">
                   <AlertCircle className="w-8 h-8" />
                   <p className="text-lg font-bold">{encouragement}</p>
                 </div>
               ) : (
                 <p className="text-2xl md:text-3xl italic leading-relaxed font-medium text-teal-50">"{encouragement}"</p>
               )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
