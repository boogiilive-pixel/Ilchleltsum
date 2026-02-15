
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Youtube as YoutubeIcon, 
  RefreshCw, 
  Sparkles, 
  ExternalLink,
  Play,
  ArrowRight
} from 'lucide-react';

interface YouTubeVideo {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  thumbnail: string;
  author: string;
}

const CHANNEL_ID = 'UC87i3_n-zR6xNfR_Yy-Y75A'; // @ilchlelt channel ID
const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

// Таны өгсөн бичлэгүүд болон бусад бодит видеонууд
const FALLBACK_VIDEOS: YouTubeVideo[] = [
  {
    id: 'Q4TXZUBR0yA',
    title: 'Сургаал ба Залбирал | Илчлэлт Сүм',
    link: 'https://youtu.be/Q4TXZUBR0yA',
    pubDate: '2024-03-01',
    thumbnail: 'https://img.youtube.com/vi/Q4TXZUBR0yA/maxresdefault.jpg',
    author: 'Илчлэлт Сүм'
  },
  {
    id: 'JDwKU9aAw74',
    title: 'Итгэлийн хүч - Магтан хүндэтгэл',
    link: 'https://youtu.be/JDwKU9aAw74',
    pubDate: '2024-02-28',
    thumbnail: 'https://img.youtube.com/vi/JDwKU9aAw74/maxresdefault.jpg',
    author: 'Илчлэлт Сүм'
  },
  {
    id: '4AoPz2YVyuI',
    title: 'Бурханы хайр бидний амьдралд',
    link: 'https://youtu.be/4AoPz2YVyuI',
    pubDate: '2024-02-25',
    thumbnail: 'https://img.youtube.com/vi/4AoPz2YVyuI/maxresdefault.jpg',
    author: 'Илчлэлт Сүм'
  },
  {
    id: 'B9Z1MMpKJAQ',
    title: 'Сүнслэг өсөлт ба нөхөрлөл',
    link: 'https://youtu.be/B9Z1MMpKJAQ',
    pubDate: '2024-02-20',
    thumbnail: 'https://img.youtube.com/vi/B9Z1MMpKJAQ/maxresdefault.jpg',
    author: 'Илчлэлт Сүм'
  },
  {
    id: '1TBJdqg0XWk',
    title: 'Библийн гүнзгийрүүлсэн судлал',
    link: 'https://youtu.be/1TBJdqg0XWk',
    pubDate: '2024-02-15',
    thumbnail: 'https://img.youtube.com/vi/1TBJdqg0XWk/maxresdefault.jpg',
    author: 'Илчлэлт Сүм'
  },
  {
    id: 'y515MrzLqqw',
    title: 'Гэр бүлийн цуглаан - Сургаал',
    link: 'https://youtu.be/y515MrzLqqw',
    pubDate: '2024-02-10',
    thumbnail: 'https://img.youtube.com/vi/y515MrzLqqw/maxresdefault.jpg',
    author: 'Илчлэлт Сүм'
  },
  {
    id: '-oYxPfGYdaw',
    title: 'Итгэл найдвар биднийг хөтөлнө',
    link: 'https://youtu.be/-oYxPfGYdaw',
    pubDate: '2024-02-05',
    thumbnail: 'https://img.youtube.com/vi/-oYxPfGYdaw/maxresdefault.jpg',
    author: 'Илчлэлт Сүм'
  }
];

const getTagValue = (entry: Element, tagName: string): string => {
  try {
    const elements = entry.getElementsByTagName('*');
    for (let i = 0; i < elements.length; i++) {
      const nodeName = elements[i].localName || elements[i].nodeName.split(':').pop();
      if (nodeName && nodeName.toLowerCase() === tagName.toLowerCase()) {
        return elements[i].textContent || '';
      }
    }
  } catch (e) {
    return '';
  }
  return '';
};

const SermonPage: React.FC = () => {
  const [videos, setVideos] = useState<YouTubeVideo[]>(FALLBACK_VIDEOS);
  const [loading, setLoading] = useState(false);

  const fetchLatestSermons = useCallback(async () => {
    setLoading(true);
    try {
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(RSS_URL)}&timestamp=${Date.now()}`;
      const response = await fetch(proxyUrl);
      if (!response.ok) throw new Error('Fetch failed');
      
      const data = await response.json();
      if (!data.contents) throw new Error('No content');

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data.contents, "text/xml");
      const entries = Array.from(xmlDoc.getElementsByTagName("entry"));
      
      if (entries.length > 0) {
        const fetchedVideos: YouTubeVideo[] = entries.map(entry => {
          const videoId = getTagValue(entry, "videoId");
          return {
            id: videoId,
            title: getTagValue(entry, "title") || "Сургаал",
            link: `https://www.youtube.com/watch?v=${videoId}`,
            pubDate: getTagValue(entry, "published"),
            thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
            author: 'Илчлэлт Сүм'
          };
        }).filter(v => v.id);

        if (fetchedVideos.length > 0) {
          // Шинэ бичлэгүүдийг өмнөхүүдтэй нэгтгэхдээ давхардалгүйгээр авна
          setVideos(prev => {
            const all = [...fetchedVideos, ...FALLBACK_VIDEOS];
            const unique = Array.from(new Map(all.map(v => [v.id, v])).values());
            return unique;
          });
        }
      }
    } catch (err) {
      console.warn('RSS sync failed, using current list');
      setVideos(FALLBACK_VIDEOS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLatestSermons();
  }, [fetchLatestSermons]);

  const handleOpenYouTube = (video: YouTubeVideo) => {
    window.open(video.link, '_blank', 'noopener,noreferrer');
  };

  const heroVideo = videos[0];

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        {/* Featured Video Section */}
        {heroVideo && (
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
        )}

        {/* List Header */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900">Видео Сургаал</h1>
            <p className="text-slate-500 mt-3 text-lg">Бидний YouTube суваг дээрх хамгийн сүүлийн үеийн бичлэгүүд.</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={fetchLatestSermons}
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
          {videos.slice(1).map((video) => (
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

        {/* CTA */}
        <div className="mt-24 p-12 bg-slate-900 rounded-[48px] text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="relative z-10 text-center md:text-left">
            <h3 className="text-3xl font-bold mb-4">YouTube Сувагт бүртгүүлээрэй</h3>
            <p className="text-slate-400 max-w-md">Шинэ сургаал, бичлэгүүдийг цаг алдалгүй хүлээн авч, сүнслэгээр өсөж нэгдээрэй.</p>
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
