
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
  AlertCircle,
  Newspaper,
  User as UserIcon,
  Clock
} from 'lucide-react';
import { getEncouragement } from '../geminiService';
import { POSTS } from './InfoPage';
import { fetchSermons, YouTubeVideo, FALLBACK_VIDEOS, PLAYLIST_SERMONS } from '../sermonService';
import { Youtube as YoutubeIcon } from 'lucide-react';

// Custom Cross Icon component
const CrossIcon = ({ className = "w-4 h-4" }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 2v20M7 7h10" />
  </svg>
);

const GALLERY_IMAGES = [
  { url: "https://lh3.googleusercontent.com/d/1ZIMzIMa8QEKPit2qFDouDv_U3IONc9vl", title: "Цуглааны танхим", size: "large" },
  { url: "https://lh3.googleusercontent.com/d/1uuV-NXIdLfgFXIqbOmaY6Au2nsCIA-Yg", title: "Магтан хүндэтгэл", size: "small" },
  { url: "https://lh3.googleusercontent.com/d/1UcUf8ZJnG6RkzkBQbX8N4ezfRjgkb8X0", title: "Нөхөрлөлийн мөч", size: "small" },
  { url: "https://lh3.googleusercontent.com/d/14od8umGX-lk8HS5pWYk6hySdde5-hSrD", title: "Бидний гэр бүл", size: "wide" },
  { url: "https://lh3.googleusercontent.com/d/1gGeh1RSaePY_593z_DebADDa4Nn_oWUS", title: "Залбирлын цаг", size: "small" },
  { url: "https://lh3.googleusercontent.com/d/1g6RH4xBAVfhCPoD2HooPHXPDCPhv1KFr", title: "Хайрын үйлчлэл", size: "small" },
  { url: "https://lh3.googleusercontent.com/d/1e5Cs-v0D5eBN09K7GDJFSaW-TRM-NSoh", title: "Сүнслэг өсөлт", size: "small" },
  { url: "https://lh3.googleusercontent.com/d/10Wpu_lnMQRdetxNpBOf1mgj-_VGT6We1", title: "Цуглааны дурсамж", size: "small" },
];

const HERO_IMAGES = [
  "https://lh3.googleusercontent.com/d/1gGeh1RSaePY_593z_DebADDa4Nn_oWUS",
  "https://lh3.googleusercontent.com/d/14od8umGX-lk8HS5pWYk6hySdde5-hSrD",
  "https://lh3.googleusercontent.com/d/1ZIMzIMa8QEKPit2qFDouDv_U3IONc9vl"
];

const LandingPage: React.FC = () => {
  console.log("LANDING PAGE RENDERING...");
  const [topic, setTopic] = useState('');
  const [encouragement, setEncouragement] = useState('');
  const [loading, setLoading] = useState(false);
  const [latestSermons, setLatestSermons] = useState<YouTubeVideo[]>(FALLBACK_VIDEOS.slice(0, 3));
  const [loadingSermons, setLoadingSermons] = useState(false);
  const [selectedImageIdx, setSelectedImageIdx] = useState<number | null>(null);
  const [currentHeroIdx, setCurrentHeroIdx] = useState(0);
  const [dynamicNews, setDynamicNews] = useState<any[]>([]);
  const [dynamicGallery, setDynamicGallery] = useState<any[]>([]);
  
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  // Auto-slide hero images
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroIdx((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    
    // Fetch latest sermons
    const loadSermons = async () => {
      try {
        const results = await Promise.allSettled([
          fetchSermons(PLAYLIST_SERMONS),
          fetch('/api/sermons').then(res => res.json())
        ]);
        
        let youtubeVideos: YouTubeVideo[] = [];
        let customSermonsData: any[] = [];

        if (results[0].status === 'fulfilled') {
          youtubeVideos = results[0].value;
        } else {
          console.error("YouTube fetch failed:", results[0].reason);
          youtubeVideos = FALLBACK_VIDEOS;
        }

        if (results[1].status === 'fulfilled') {
          customSermonsData = results[1].value;
        } else {
          console.error("Custom sermons fetch failed:", results[1].reason);
        }
        
        const customSermons: YouTubeVideo[] = customSermonsData.map((s: any) => {
          const videoId = (s.youtubeId || s.id || '').trim();
          return {
            id: videoId,
            title: s.title,
            link: s.link || `https://www.youtube.com/watch?v=${videoId}`,
            pubDate: s.createdAt || s.pubDate || new Date().toISOString(),
            thumbnail: s.thumbnail || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
            author: 'Илчлэлт Сүм'
          };
        }).filter((s: any) => s.id);
        
        // Combine both sources and ensure uniqueness by video ID
        const allSermons = [...customSermons, ...youtubeVideos];
        const sermonMap = new Map<string, YouTubeVideo>();
        
        allSermons.forEach(video => {
          if (video.id) {
            sermonMap.set(video.id, video);
          }
        });
        
        const uniqueSermons = Array.from(sermonMap.values())
          .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
          
        // Get the first 3 videos (newest first)
        setLatestSermons(uniqueSermons.slice(0, 3));
      } catch (err) {
        console.error("Failed to fetch sermons for landing page:", err);
      } finally {
        setLoadingSermons(false);
      }
    };

    const loadDynamicData = async () => {
      try {
        const [newsRes, galleryRes] = await Promise.all([
          fetch('/api/news'),
          fetch('/api/gallery')
        ]);
        const news = await newsRes.json();
        const gallery = await galleryRes.json();
        setDynamicNews(news.slice(0, 3));
        setDynamicGallery(gallery.length > 0 ? gallery : GALLERY_IMAGES);
      } catch (err) {
        console.error("Failed to fetch dynamic data:", err);
        setDynamicGallery(GALLERY_IMAGES);
      }
    };

    loadSermons();
    loadDynamicData();

    return () => clearInterval(timer);
  }, []);

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
      {/* Hero Section with Image Slider */}
      <section 
        ref={heroRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative h-screen flex items-center justify-center overflow-hidden bg-slate-950"
      >
        {/* Background Slider */}
        {HERO_IMAGES.map((url, idx) => (
          <div 
            key={idx}
            className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${idx === currentHeroIdx ? 'opacity-100' : 'opacity-0'}`}
          >
            <div 
              className="w-full h-full transition-transform duration-700 ease-out scale-110"
              style={{ 
                transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)`,
              }}
            >
              <img 
                src={url} 
                alt={`Church Background ${idx + 1}`} 
                className="w-full h-full object-cover opacity-50 brightness-[0.4]"
              />
            </div>
          </div>
        ))}

        {/* Global Lighting Overlay */}
        <div 
          className="absolute inset-0 z-[1] pointer-events-none transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at ${(mousePos.x + 1) * 50}% ${(mousePos.y + 1) * 50}%, rgba(20, 184, 166, 0.1) 0%, transparent 60%)`
          }}
        ></div>

        <div className="relative z-10 text-center px-4 max-w-5xl transition-transform duration-500 ease-out"
          style={{ transform: `translate(${mousePos.x * 15}px, ${mousePos.y * 15}px)` }}>
          
          {/* Lowered Badge with Cross Icon */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-600/20 text-teal-300 border border-teal-500/30 text-sm font-bold mt-16 mb-8 backdrop-blur-sm animate-bounce">
            <CrossIcon className="w-4 h-4 text-teal-300" />
            Бурхан бол сайн
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight tracking-tight text-shadow-xl uppercase">
            Илчлэлт сүмд <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">тавтай морил!</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-200 mb-12 max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-2xl">
            Илчлэлт сүм нь таны амьдралд утга учир, итгэл найдвар бэлэглэх халуун дулаан гэр бүл юм.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to="/contact" className="group relative bg-teal-700 text-white px-10 py-5 rounded-full font-bold text-xl transition-all hover:bg-teal-800 hover:scale-105 shadow-[0_0_40px_rgba(20,184,166,0.3)] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              Цуглаанд нэгдэх
            </Link>
            <Link to="/sermons" className="bg-white/10 backdrop-blur-xl text-white border border-white/20 px-10 py-5 rounded-full font-bold text-xl hover:bg-white/20 transition-all flex items-center gap-3 group">
              <Play className="w-6 h-6 fill-current group-hover:scale-110 transition-transform" /> 
              Сургаал номлол
            </Link>
          </div>

          {/* Slider Indicators */}
          <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 flex gap-3">
            {HERO_IMAGES.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrentHeroIdx(idx)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === currentHeroIdx ? 'bg-teal-500 w-8' : 'bg-white/20'}`}
              />
            ))}
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
              { icon: Heart, title: "Хүүхдийн үйлчлэл", desc: "Хүүхдүүдийг Бурханы хайранд зөв хүмүүжил төлөвшилтэй болгох тусгай хөтөлбөр." },
              { icon: Users, title: "Залуучуудын үйлчлэл", desc: "Шинэ үеийн залуучуудын хэрэгцээг хангасан онцгой хөтөлбөр" },
              { icon: Calendar, title: "Нийгэмд хандсан үйлчлэл", desc: "Нийгэмд чиглэсэн сайн үйлсийн үйл ажиллагаа, иргэдийг чадавхжуулах хөтөлбөр" }
            ].map((service, i) => (
              <div key={i} className="p-10 rounded-[32px] bg-slate-50 hover:bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-slate-100 group">
                <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center text-teal-700 mb-8 group-hover:bg-teal-700 group-hover:text-white transition-all duration-500 shadow-sm">
                  <service.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900">{service.title}</h3>
                <p className="text-slate-600 mb-8 leading-relaxed">{service.desc}</p>
                <Link to="/events" className="inline-flex items-center gap-2 font-bold text-teal-700 hover:gap-4 transition-all group-hover:text-teal-800">
                  Дэлгэрэрийн <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-teal-600 font-bold uppercase tracking-widest text-sm mb-4">
                <Newspaper className="w-5 h-5" /> Сүмийн үйл ажиллагаа
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">Сүүлийн үеийн <span className="text-teal-600">мэдээ</span></h2>
            </div>
            <Link to="/info" className="flex items-center gap-2 px-8 py-4 bg-slate-50 text-teal-700 font-bold rounded-2xl hover:bg-teal-100 transition-all border border-slate-100 shadow-sm group">
              Бүх мэдээ <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {Array.from(new Map([...dynamicNews, ...POSTS].map(item => [item.id, item])).values()).slice(0, 3).map((post) => (
              <Link 
                key={post.id} 
                to="/info" 
                className="group flex flex-col bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
              >
                <div className="h-60 overflow-hidden relative">
                  <img src={post.image || post.url} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-teal-800 shadow-lg">{post.category || 'Мэдээ'}</span>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 mb-4 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {post.date || new Date(post.createdAt).toLocaleDateString()}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span className="flex items-center gap-1.5"><UserIcon className="w-3.5 h-3.5" /> {post.author || 'Админ'}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4 line-clamp-2 group-hover:text-teal-700 transition-colors leading-tight">{post.title}</h3>
                  <p className="text-slate-500 mb-6 line-clamp-2 text-sm leading-relaxed">{post.excerpt || post.content}</p>
                  <div className="pt-6 border-t border-slate-50 flex items-center text-teal-700 font-bold text-sm">
                    Дэлгэрэнгүй унших <ArrowRight className="w-4 h-4 ml-2 group-hover:ml-4 transition-all" />
                  </div>
                </div>
              </Link>
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
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">Цуглааны <span className="text-teal-600">зургуудаас</span></h2>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px] md:auto-rows-[240px]">
            {dynamicGallery.map((img, idx) => {
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
                  <img src={img.url} alt={img.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" referrerPolicy="no-referrer" />
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
            <img src={dynamicGallery[selectedImageIdx].url} alt="Preview" className="max-w-full max-h-full object-contain rounded-3xl shadow-2xl animate-in zoom-in duration-500" referrerPolicy="no-referrer" />
            <div className="mt-8 text-center text-white">
              <h4 className="text-2xl font-bold mb-2">{dynamicGallery[selectedImageIdx].title}</h4>
              <p className="text-slate-400">Илчлэлт Сүм - {selectedImageIdx + 1} / {dynamicGallery.length}</p>
            </div>
          </div>
        </div>
      )}

      {/* AI Spiritual Encouragement */}
      <section className="py-32 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Sparkles className="text-teal-400 w-10 h-10 animate-pulse" />
            <h2 className="text-4xl md:text-5xl font-black">Мэдэхийг хүссэн сэдвийнхээ түлхүүр үгийг оруулна уу!</h2>
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

      {/* Latest Sermons Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-red-600 font-bold uppercase tracking-widest text-sm mb-4">
                <YoutubeIcon className="w-5 h-5" /> Видео номлол
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">Сүүлийн <span className="text-red-600">Сургаал номлолууд</span></h2>
            </div>
            <Link to="/sermons" className="flex items-center gap-2 px-8 py-4 bg-white text-red-600 font-bold rounded-2xl hover:bg-red-50 transition-all border border-slate-200 shadow-sm group">
              Бүх сургаал номлол <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loadingSermons ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-red-600" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {latestSermons.map((video) => (
                <a 
                  key={video.id} 
                  href={video.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                >
                  <div className="h-52 overflow-hidden relative">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
                      }}
                    />
                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-all duration-300 flex items-center justify-center">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300 shadow-xl">
                        <Play className="w-6 h-6 text-red-600 fill-current ml-1" />
                      </div>
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 line-clamp-2 group-hover:text-red-600 transition-colors leading-tight">{video.title}</h3>
                    <div className="pt-6 border-t border-slate-50 flex items-center text-red-600 font-bold text-sm">
                      Одоо үзэх <Play className="w-4 h-4 ml-2 fill-current" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
