
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
  }
];

const getTagValue = (entry: Element, tagName: string): string => {
  try {
    const elements = entry.getElementsByTagName('*');
    for (let i = 0; i < elements.length; i++) {
      const nodeName = elements[i].localName || elements[i].nodeName;
      if (nodeName.toLowerCase() === tagName.toLowerCase()) {
        return elements[i].textContent || '';
      }
    }
  } catch (e) {
    console.warn("Tag parsing error:", e);
  }
  return '';
};

const SermonPage: React.FC = () => {
  const [videos, setVideos] = useState<YouTubeVideo[]>(INITIAL_VIDEOS);
  const [loading, setLoading] = useState(false);

  const fetchLatestSermons = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    
    try {
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(RSS_URL)}&timestamp=${Date.now()}`;
      const response = await fetch(proxyUrl);
      
      if (!response.ok) throw new Error('Fetch failed');
      
      const data = await response.json();
      if (!data || !data.contents) throw new Error('Empty content');

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
          setVideos(prev => [...INITIAL_VIDEOS, ...fetchedVideos]);
        }
      }
    } catch (err) {
      console.warn('Sync failed, using fallback:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLatestSermons();
  }, [fetchLatestSermons]);

  const handleOpenYouTube = (video: YouTubeVideo) => {
    if (video?.link) {
      window.open(video.link, '_blank', 'noopener,noreferrer');
    }
  };

  const currentVideos = videos.length > 0 ? videos : INITIAL_VIDEOS;
  const heroVideo = currentVideos[0];

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        {/* Hero */}
        {heroVideo && (
          <section className="mb-16">
            <div 
              className="relative rounded-[40px] overflow-hidden bg-slate-900 aspect-[21/9] flex items-center justify-center shadow-2xl group cursor-pointer" 
              onClick={() => handleOpenYouTube(heroVideo)}
            >
              <img 
                src={heroVideo.thumbnail} 
                alt="Main" 
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

        {/* Header */}
        <header className="mb-12 flex items-center justify-between border-b border-slate-200 pb-8">
          <div>
            <h1 className="text-4xl font-black text-slate-900">Бичлэгүүд</h1>
            <p className="text-slate-500 mt-2">Сүүлийн үеийн бүх сургаал, номлолууд.</p>
          </div>
          <button 
            onClick={fetchLatestSermons}
            disabled={loading}
            className="p-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-6 h-6 ${loading ? 'animate-spin text-red-600' : 'text-slate-400'}`} />
          </button>
        </header>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentVideos.map((video) => (
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
                <div className="bg-white/95 p-4 rounded-full shadow-2xl">
                  <ExternalLink className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SermonPage;
