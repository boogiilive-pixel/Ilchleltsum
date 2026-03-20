
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Youtube as YoutubeIcon, 
  RefreshCw, 
  Sparkles, 
  ExternalLink,
  Play,
  AlertCircle,
  BookOpen,
  MessageSquare
} from 'lucide-react';
import { fetchSermons, YouTubeVideo, FALLBACK_VIDEOS, PLAYLIST_SERMONS, PLAYLIST_SERIES, isPlaceholder } from '../sermonService';

interface SermonPageProps {
  initialCategory?: 'sermons' | 'series';
}

const SermonPage: React.FC<SermonPageProps> = ({ initialCategory = 'sermons' }) => {
  const [videos, setVideos] = useState<YouTubeVideo[]>(FALLBACK_VIDEOS.filter(v => !v.category || v.category === initialCategory));
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'sermons' | 'series'>(initialCategory);
  const [error, setError] = useState<string | null>(null);
  
  // Cache to store fetched videos for each category
  const [cache, setCache] = useState<Record<'sermons' | 'series', YouTubeVideo[] | null>>({
    sermons: null,
    series: null
  });

  // Update active category if prop changes
  useEffect(() => {
    setActiveCategory(initialCategory);
  }, [initialCategory]);

  const loadSermons = useCallback(async (category: 'sermons' | 'series', forceRefresh = false) => {
    // If we have cached data and not forcing refresh, use it immediately
    if (!forceRefresh && cache[category]) {
      setVideos(cache[category]!);
      // We still do a background refresh if it's the first time or explicitly requested
      // but we don't set loading to true to keep the UI responsive
    } else {
      setLoading(true);
    }

    setError(null);
    try {
      const playlistId = category === 'sermons' ? PLAYLIST_SERMONS : PLAYLIST_SERIES;
      
      // Use Promise.allSettled to prevent one source from blocking the other
      const results = await Promise.allSettled([
        fetchSermons(playlistId),
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
      
      const customSermons: YouTubeVideo[] = customSermonsData
        .filter((s: any) => !s.category || s.category === category)
        .map((s: any) => {
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
      const filteredYoutubeVideos = youtubeVideos.filter(video => {
        // If the video has a category (like fallback videos), it must match
        if (video.category && video.category !== category) return false;
        
        // If the video doesn't have a category, we filter by title keywords
        const title = video.title.toLowerCase();
        const isLesson = (title.includes('хичээл') || title.includes('lesson')) && !title.includes('гэр бүлийн');
        
        if (category === 'series') {
          return isLesson;
        } else {
          const isService = title.includes('мөргөл') || title.includes('номлол') || title.includes('service') || title.includes('sermon') || title.includes('цуглаан') || title.includes('цуврал') || title.includes('series') || title.includes('гэр бүлийн');
          return !isLesson || isService;
        }
      });

      const allSermons = [...customSermons, ...filteredYoutubeVideos];
      const sermonMap = new Map<string, YouTubeVideo>();
      
      allSermons.forEach(video => {
        if (video.id) {
          sermonMap.set(video.id, video);
        }
      });
      
      const uniqueSermons = Array.from(sermonMap.values())
        .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
      
      // Update cache and current videos
      setCache(prev => ({ ...prev, [category]: uniqueSermons }));
      
      // Only update the displayed videos if the category we just fetched is still the active one
      setActiveCategory(current => {
        if (current === category) {
          setVideos(uniqueSermons);
        }
        return current;
      });

    } catch (err) {
      console.error("Failed to process sermons:", err);
      if (videos.length === 0) {
        setError("Бичлэгүүдийг шинэчлэхэд алдаа гарлаа. Та дараа дахин оролдоорой.");
      }
    } finally {
      setLoading(false);
    }
  }, [cache, videos.length]);

  useEffect(() => {
    loadSermons(activeCategory);
  }, [activeCategory]);

  // Pre-fetch the other category in the background after the first one is loaded
  useEffect(() => {
    const otherCategory = activeCategory === 'sermons' ? 'series' : 'sermons';
    if (!cache[otherCategory] && !loading) {
      // Small delay to prioritize the active category's initial load
      const timer = setTimeout(() => {
        loadSermons(otherCategory);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [activeCategory, cache, loading]);

  const handleCategoryChange = (category: 'sermons' | 'series') => {
    if (category === activeCategory) return;
    setActiveCategory(category);
  };

  const handleRefresh = () => {
    loadSermons(activeCategory, true);
  };

  const handleOpenYouTube = (video: YouTubeVideo) => {
    window.open(video.link, '_blank', 'noopener,noreferrer');
  };

  const heroVideo: YouTubeVideo = {
    id: 'Q4TXZUBR0yA',
    title: 'Илчлэлт Сүм',
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
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900">Видео Номлол</h1>
            <p className="text-slate-500 mt-3 text-lg">Бидний YouTube суваг дээрх хамгийн сүүлийн үеийн бичлэгүүд.</p>
            
            {/* Category Tabs */}
            <div className="flex gap-4 mt-8">
              <button 
                onClick={() => handleCategoryChange('sermons')}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black transition-all ${
                  activeCategory === 'sermons' 
                  ? 'bg-slate-900 text-white shadow-xl scale-105' 
                  : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                <MessageSquare className="w-5 h-5" />
                <span>Сургаал номлол</span>
              </button>
              <button 
                onClick={() => handleCategoryChange('series')}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black transition-all ${
                  activeCategory === 'series' 
                  ? 'bg-slate-900 text-white shadow-xl scale-105' 
                  : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                <BookOpen className="w-5 h-5" />
                <span>Цуврал хичээл</span>
              </button>
            </div>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={handleRefresh}
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
