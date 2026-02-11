
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Youtube as YoutubeIcon, 
  RefreshCw, 
  Sparkles, 
  ExternalLink
} from 'lucide-react';

interface YouTubeVideo {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  thumbnail: string;
  author: string;
  isFeatured?: boolean;
}

const CHANNEL_ID = 'UC87i3_n-zR6xNfR_Yy-Y75A';
const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

const INITIAL_VIDEOS: YouTubeVideo[] = [
  {
    id: 'tP5C7f6_3kQ',
    title: '',
    link: 'https://www.youtube.com/watch?v=tP5C7f6_3kQ',
    pubDate: '',
    thumbnail: 'https://img.youtube.com/vi/tP5C7f6_3kQ/maxresdefault.jpg',
    author: 'Илчлэлт Сүм',
    isFeatured: true
  },
  {
    id: '6XmR0H3Z-Wc',
    title: '',
    link: 'https://www.youtube.com/watch?v=6XmR0H3Z-Wc',
    pubDate: '',
    thumbnail: 'https://img.youtube.com/vi/6XmR0H3Z-Wc/maxresdefault.jpg',
    author: 'Илчлэлт Сүм'
  },
  {
    id: 'v_N7B_zQj0E',
    title: '',
    link: 'https://www.youtube.com/watch?v=v_N7B_zQj0E',
    pubDate: '',
    thumbnail: 'https://img.youtube.com/vi/v_N7B_zQj0E/maxresdefault.jpg',
    author: 'Илчлэлт Сүм'
  },
  {
    id: 'L0oP-89XyAw',
    title: '',
    link: 'https://www.youtube.com/watch?v=L0oP-89XyAw',
    pubDate: '',
    thumbnail: 'https://img.youtube.com/vi/L0oP-89XyAw/maxresdefault.jpg',
    author: 'Илчлэлт Сүм'
  },
  {
    id: 'y_5M6zL9qww',
    title: '',
    link: 'https://www.youtube.com/watch?v=y_5M6zL9qww',
    pubDate: '',
    thumbnail: 'https://img.youtube.com/vi/y_5M6zL9qww/maxresdefault.jpg',
    author: 'Илчлэлт Сүм'
  }
];

const getTagValue = (entry: Element, tagName: string): string => {
  const elements = entry.getElementsByTagName('*');
  for (let i = 0; i < elements.length; i++) {
    if (elements[i].localName.toLowerCase() === tagName.toLowerCase()) {
      return elements[i].textContent || '';
    }
  }
  return '';
};

const SermonPage: React.FC = () => {
  const [videos, setVideos] = useState<YouTubeVideo[]>(INITIAL_VIDEOS);
  const [loading, setLoading] = useState(false);

  const fetchLatestSermons = useCallback(async () => {
    // Prevent multiple simultaneous fetches
    if (loading) return;
    
    setLoading(true);
    try {
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(RSS_URL)}&timestamp=${Date.now()}`;
      const response = await fetch(proxyUrl);
      
      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      if (!data || !data.contents) throw new Error('Data empty');

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data.contents, "text/xml");
      const entries = Array.from(xmlDoc.getElementsByTagName("entry"));
      
      if (entries.length > 0) {
        const fetchedVideos: YouTubeVideo[] = entries.map(entry => {
          const videoId = getTagValue(entry, "videoId");
          return {
            id: videoId,
            title: '',
            link: `https://www.youtube.com/watch?v=${videoId}`,
            pubDate: '',
            thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
            author: 'Илчлэлт Сүм'
          };
        }).filter(v => v.id && !INITIAL_VIDEOS.some(f => f.id === v.id));

        if (fetchedVideos.length > 0) {
          setVideos([...INITIAL_VIDEOS, ...fetchedVideos]);
        }
      }
    } catch (err) {
      console.warn('Sync failed, using initial list:', err);
      // Fallback already in state
    } finally {
      setLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    fetchLatestSermons();
  }, []);

  const handleOpenYouTube = (video: YouTubeVideo) => {
    if (video?.link) {
      window.open(video.link, '_blank', 'noopener,noreferrer');
    }
  };

  const heroVideo = videos[0] || INITIAL_VIDEOS[0];

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen font-inter">
      <div className="max-w-7xl mx-auto px-4">
        {/* Hero Section */}
        {heroVideo && (
          <section className="mb-16">
            <div 
              className="relative rounded-[40px] overflow-hidden bg-slate-900 aspect-[21/9] flex items-center justify-center shadow-2xl group cursor-pointer" 
              onClick={() => handleOpenYouTube(heroVideo)}
            >
              <img 
                src={heroVideo.thumbnail} 
                alt="Main Video" 
                className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-[3s]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
              
              <div className="relative z-10 text-center">
                <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-red-600 text-white text-sm font-black mb-8 animate-pulse shadow-xl">
                  <Sparkles className="w-4 h-4" /> ШИНЭ БИЧЛЭГ ҮЗЭХ
                </div>
                <div className="flex justify-center">
                  <div className="flex items-center gap-3 bg-white text-slate-900 px-10 py-5 rounded-2xl font-black text-xl hover:bg-red-600 hover:text-white transition-all shadow-2xl active:scale-95">
                    <YoutubeIcon className="w-8 h-8 fill-current" /> YouTube дээр нээх
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Header & Refresh */}
        <header className="mb-12 flex items-center justify-between gap-8 border-b border-slate-200 pb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Бичлэгүүд</h1>
            <p className="text-slate-500 text-lg font-medium mt-2">
              Сүүлийн үеийн бүх бичлэгүүд.
            </p>
          </div>
          <button 
            onClick={fetchLatestSermons}
            disabled={loading}
            className="p-5 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm active:scale-95 disabled:opacity-50"
            title="Шинэчлэх"
          >
            <RefreshCw className={`w-6 h-6 ${loading ? 'animate-spin text-red-600' : ''}`} />
          </button>
        </header>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video) => (
            <div 
              key={video.id} 
              className="group relative bg-slate-200 rounded-[32px] overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer aspect-video"
              onClick={() => handleOpenYouTube(video)}
            >
              <img 
                src={video.thumbnail} 
                alt="Video" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
                }}
              />
              <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="bg-white/95 p-5 rounded-full shadow-2xl scale-75 group-hover:scale-100 transition-transform">
                  <ExternalLink className="w-8 h-8 text-red-600" />
                </div>
              </div>
              {video.isFeatured && (
                <div className="absolute top-4 right-4 px-3 py-1 bg-red-600 text-white text-[10px] font-black rounded-full shadow-lg">
                  ШИНЭ
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Callout */}
        <section className="mt-24 p-12 bg-slate-900 rounded-[48px] text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="relative z-10 text-center md:text-left">
            <h3 className="text-3xl font-black mb-4">Бүх видеог сувгаас үзээрэй</h3>
            <p className="text-slate-400 max-w-md text-lg font-medium">@ilchlelt сувагт маань илүү олон сонирхолтой контентууд байгаа.</p>
          </div>
          <a 
            href="https://www.youtube.com/@ilchlelt/videos" 
            target="_blank" 
            rel="noopener noreferrer"
            className="relative z-10 flex items-center gap-3 bg-red-600 text-white px-10 py-5 rounded-2xl font-black text-xl hover:bg-red-700 transition-all shadow-xl active:scale-95"
          >
            <YoutubeIcon className="w-8 h-8" /> YouTube суваг руу очих
          </a>
        </section>
      </div>
    </div>
  );
};

export default SermonPage;
