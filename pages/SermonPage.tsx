
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Youtube as YoutubeIcon, 
  RefreshCw, 
  Sparkles, 
  ExternalLink,
  Play,
  AlertCircle
} from 'lucide-react';
import { fetchSermons, YouTubeVideo, FALLBACK_VIDEOS } from '../sermonService';

const SermonPage: React.FC = () => {
  const [videos, setVideos] = useState<YouTubeVideo[]>(FALLBACK_VIDEOS);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const loadSermons = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [youtubeVideos, customSermonsRes] = await Promise.all([
        fetchSermons(),
        fetch('/api/sermons')
      ]);
      
      const customSermonsData = await customSermonsRes.json();
      const customSermons: YouTubeVideo[] = customSermonsData.map((s: any) => {
        const videoId = (s.youtubeId || s.id || '').trim();
        return {
          id: videoId,
          title: s.title,
          link: s.link || `https://www.youtube.com/watch?v=${videoId}`,
          pubDate: s.createdAt,
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
      
      const uniqueSermons = Array.from(sermonMap.values());
      
      setVideos(uniqueSermons);
    } catch (err) {
      console.error("Failed to load sermons:", err);
      setError("Бичлэгүүдийг шинэчлэхэд алдаа гарлаа. Та дараа дахин оролдоорой.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSermons();
  }, [loadSermons]);

  const handleOpenYouTube = (video: YouTubeVideo) => {
    window.open(video.link, '_blank', 'noopener,noreferrer');
  };

  const heroVideo: YouTubeVideo = {
    id: 'Q4TXZUBR0yA',
    title: 'Номлол ба Залбирал | Илчлэлт Сүм',
    link: 'https://www.youtube.com/watch?v=Q4TXZUBR0yA',
    pubDate: '2024-03-01',
    thumbnail: 'https://img.youtube.com/vi/Q4TXZUBR0yA/maxresdefault.jpg',
    author: 'Илчлэлт Сүм'
  };

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 font-bold animate-in slide-in-from-top duration-300">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Featured Video Section */}
        <section className="mb-20">
          <div 
            className="relative rounded-[40px] md:rounded-[60px] overflow-hidden bg-slate-900 aspect-video md:aspect-[21/9] flex items-center justify-center shadow-2xl group cursor-pointer" 
            onClick={() => handleOpenYouTube(heroVideo)}
          >
            <img 
              src={heroVideo.thumbnail} 
              alt={heroVideo.title} 
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[5s]"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${heroVideo.id}/hqdefault.jpg`;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
            
            <div className="relative z-10 text-center px-6 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600 text-white text-[10px] font-black mb-6 tracking-widest uppercase shadow-xl">
                <Sparkles className="w-3 h-3" /> Онцлох бичлэг
              </div>
              <h2 className="text-2xl md:text-5xl font-black text-white mb-8 line-clamp-2 leading-tight">
                {heroVideo.title}
              </h2>
              <div className="flex justify-center">
                <div className="flex items-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-lg hover:bg-red-600 hover:text-white transition-all shadow-2xl active:scale-95 group">
                  <Play className="w-6 h-6 fill-current group-hover:scale-110 transition-transform" /> 
                  <span>Одоо үзэх</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* List Header */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900">Видео Номлол</h1>
            <p className="text-slate-500 mt-3 text-lg">Бидний YouTube суваг дээрх хамгийн сүүлийн үеийн бичлэгүүд.</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={loadSermons}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm font-bold text-slate-600"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin text-red-600' : ''}`} />
              <span>Шинэчлэх</span>
            </button>
            <a 
              href="https://www.youtube.com/@ilchlelt/videos" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-all shadow-lg font-bold"
            >
              <YoutubeIcon className="w-5 h-5" />
              <span>Бүх бичлэг</span>
            </a>
          </div>
        </header>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {videos.map((video) => (
            <div 
              key={video.id} 
              className="group flex flex-col cursor-pointer"
              onClick={() => handleOpenYouTube(video)}
            >
              <div className="relative aspect-video rounded-[32px] overflow-hidden bg-slate-200 shadow-lg mb-6">
                <img 
                  src={video.thumbnail} 
                  alt={video.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
                  }}
                />
                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-all duration-300 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300 shadow-2xl">
                    <Play className="w-8 h-8 text-red-600 fill-current ml-1" />
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors leading-snug">
                {video.title}
              </h3>
              <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                <YoutubeIcon className="w-4 h-4" />
                <span>Илчлэлт Сүм</span>
              </div>
            </div>
          ))}
        </div>

        {/* Special Requested Video at the Bottom */}
        <div className="mt-20 pt-20 border-t border-slate-200">
          <h2 className="text-3xl font-black text-slate-900 mb-10 text-center">Онцлох сургаал</h2>
          <div 
            className="max-w-4xl mx-auto group cursor-pointer"
            onClick={() => handleOpenYouTube({
              id: '-2rCblislLQ',
              title: 'Илчлэлт Сүм',
              link: 'https://www.youtube.com/watch?v=-2rCblislLQ',
              pubDate: '2024-03-15',
              thumbnail: 'https://img.youtube.com/vi/-2rCblislLQ/maxresdefault.jpg',
              author: 'Илчлэлт Сүм'
            })}
          >
            <div className="relative aspect-video rounded-[40px] overflow-hidden shadow-2xl bg-slate-900">
              <img 
                src="https://img.youtube.com/vi/-2rCblislLQ/maxresdefault.jpg" 
                alt="Илчлэлт Сүм" 
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-red-600 text-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                  <Play className="w-10 h-10 fill-current ml-1" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-slate-950 to-transparent">
                <h3 className="text-2xl font-bold text-white">Илчлэлт Сүм</h3>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-24 p-12 bg-slate-900 rounded-[48px] text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="relative z-10 text-center md:text-left">
            <h3 className="text-3xl font-bold mb-4">YouTube Сувагт бүртгүүлээрэй</h3>
            <p className="text-slate-400 max-w-md">Шинэ номлол, бичлэгүүдийг цаг алдалгүй хүлээн авч, сүнслэгээр өсөж нэгдээрэй.</p>
          </div>
          <a 
            href="https://www.youtube.com/@ilchlelt?sub_confirmation=1" 
            target="_blank" 
            rel="noopener noreferrer"
            className="relative z-10 bg-red-600 text-white px-10 py-5 rounded-2xl font-bold hover:bg-red-700 transition-all shadow-xl active:scale-95 flex items-center gap-3"
          >
            Бүртгүүлэх (Subscribe) <ExternalLink className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default SermonPage;
