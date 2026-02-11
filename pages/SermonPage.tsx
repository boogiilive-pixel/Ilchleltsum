
import React, { useState, useEffect, useCallback } from 'react';
import { 
  PlayCircle, 
  Search, 
  Calendar, 
  User, 
  X, 
  Youtube as YoutubeIcon, 
  Share2, 
  AlertCircle, 
  RefreshCw, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Info
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

// @ilchlelt сувгийн ID болон RSS холбоос
const CHANNEL_ID = 'UC87i3_n-zR6xNfR_Yy-Y75A';
const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

// Таны ирүүлсэн 5 видео (Хамгийн сүүлийнх нь хамгийн дээр)
const FEATURED_VIDEOS: YouTubeVideo[] = [
  {
    id: 'y515MrzLqqw',
    title: 'Илчлэлт Сүм: Хамгийн шинэ сургаал ба амьдралын гэрэл',
    link: 'https://youtu.be/y515MrzLqqw',
    pubDate: '2024.05.23',
    thumbnail: 'https://img.youtube.com/vi/y515MrzLqqw/maxresdefault.jpg',
    author: 'Илчлэлт Сүм',
    isFeatured: true
  },
  {
    id: '1TBJdqg0XWk',
    title: 'Бурханы хайр ба бидний дуудлага',
    link: 'https://youtu.be/1TBJdqg0XWk',
    pubDate: '2024.05.22',
    thumbnail: 'https://img.youtube.com/vi/1TBJdqg0XWk/maxresdefault.jpg',
    author: 'Илчлэлт Сүм'
  },
  {
    id: 'B9Z1MMpKJAQ',
    title: 'Итгэл ба найдвар: Хүнд хэцүү цаг үеийг даван туулах нь',
    link: 'https://youtu.be/B9Z1MMpKJAQ',
    pubDate: '2024.05.21',
    thumbnail: 'https://img.youtube.com/vi/B9Z1MMpKJAQ/maxresdefault.jpg',
    author: 'Илчлэлт Сүм'
  },
  {
    id: '4AoPz2YVyuI',
    title: 'Сүнслэг өсөлт ба Библийн үнэнүүд',
    link: 'https://youtu.be/4AoPz2YVyuI',
    pubDate: '2024.05.20',
    thumbnail: 'https://img.youtube.com/vi/4AoPz2YVyuI/maxresdefault.jpg',
    author: 'Илчлэлт Сүм'
  },
  {
    id: 'JDwKU9aAw74',
    title: 'Залбирал ба түүний гайхамшигт хүч',
    link: 'https://youtu.be/JDwKU9aAw74',
    pubDate: '2024.05.19',
    thumbnail: 'https://img.youtube.com/vi/JDwKU9aAw74/maxresdefault.jpg',
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
  const [videos, setVideos] = useState<YouTubeVideo[]>(FEATURED_VIDEOS);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);

  const fetchLatestSermons = useCallback(async () => {
    setLoading(true);
    setFetchError(false);
    
    try {
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(RSS_URL)}&timestamp=${Date.now()}`;
      const response = await fetch(proxyUrl);
      
      if (!response.ok) throw new Error('Proxy failed');
      
      const data = await response.json();
      if (!data || !data.contents) throw new Error('No data contents');

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data.contents, "text/xml");
      const entries = Array.from(xmlDoc.getElementsByTagName("entry"));
      
      if (entries.length === 0) throw new Error('Empty RSS');

      const fetchedVideos: YouTubeVideo[] = entries.map(entry => {
        const videoId = getTagValue(entry, "videoId");
        const title = getTagValue(entry, "title");
        const pubDateRaw = getTagValue(entry, "published");
        
        return {
          id: videoId,
          title: title,
          link: `https://www.youtube.com/watch?v=${videoId}`,
          pubDate: new Date(pubDateRaw).toLocaleDateString('mn-MN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
          author: 'Илчлэлт Сүм'
        };
      }).filter(v => v.id && !FEATURED_VIDEOS.some(f => f.id === v.id));

      setVideos([...FEATURED_VIDEOS, ...fetchedVideos]);
    } catch (err) {
      console.error('Dynamic fetch failed, showing featured only:', err);
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLatestSermons();
  }, [fetchLatestSermons]);

  const filteredVideos = videos.filter(video => 
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        {/* Hero Banner for the Most Recent Video */}
        <section className="mb-16">
          <div className="relative rounded-[40px] overflow-hidden bg-slate-900 aspect-[21/9] flex items-center shadow-2xl group cursor-pointer" 
               onClick={() => setSelectedVideo(FEATURED_VIDEOS[0])}>
            <img 
              src={FEATURED_VIDEOS[0].thumbnail} 
              alt="Hero" 
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[2s]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
            
            <div className="relative z-10 p-8 md:p-16 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600 text-white text-xs font-black mb-6 animate-pulse">
                <Sparkles className="w-4 h-4" /> ШИНЭ СУРГААЛ
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight group-hover:text-red-400 transition-colors">
                {FEATURED_VIDEOS[0].title}
              </h2>
              <div className="flex items-center gap-6 text-slate-300 mb-8">
                <div className="flex items-center gap-2 font-bold"><User className="w-5 h-5" /> Илчлэлт Сүм</div>
                <div className="flex items-center gap-2 font-bold"><Calendar className="w-5 h-5" /> {FEATURED_VIDEOS[0].pubDate}</div>
              </div>
              <button className="flex items-center gap-3 bg-white text-slate-900 px-10 py-5 rounded-2xl font-black text-xl hover:bg-red-600 hover:text-white transition-all shadow-2xl active:scale-95">
                <PlayCircle className="w-8 h-8 fill-current" /> Одоо үзэх
              </button>
            </div>
          </div>
        </section>

        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Сургаал ба Номлол</h1>
            <p className="text-slate-500 text-lg font-medium leading-relaxed">
              Бидний итгэл найдвар, амьдралын гэрэл болсон Бурханы үгийг хамтдаа судалж, суралцацгаая.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative flex-grow md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Сургаал хайх..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-slate-200 focus:outline-none focus:ring-4 focus:ring-red-500/10 shadow-sm font-bold"
              />
            </div>
            <button 
              onClick={fetchLatestSermons}
              className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
              title="Шинэчлэх"
            >
              <RefreshCw className={`w-6 h-6 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </header>

        {fetchError && !loading && (
          <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3 text-amber-700 font-bold text-sm">
            <Info className="w-5 h-5" /> 
            YouTube сувгаас автоматаар татахад асуудал гарлаа. Гэхдээ та манай хамгийн сүүлийн үеийн сургаалуудыг үзэх боломжтой.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredVideos.map((video) => (
            <div 
              key={video.id} 
              className="group bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 cursor-pointer flex flex-col h-full"
              onClick={() => setSelectedVideo(video)}
            >
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={video.thumbnail} 
                  alt={video.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
                  }}
                />
                <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <PlayCircle className="w-16 h-16 text-white fill-current shadow-2xl" />
                </div>
                {video.isFeatured && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-red-600 text-white text-[10px] font-black rounded-full shadow-lg">
                    ШИНЭ
                  </div>
                )}
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-xl font-black mb-4 text-slate-900 group-hover:text-red-600 transition-colors line-clamp-2 leading-tight min-h-[3.5rem]">
                  {video.title}
                </h3>
                <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between text-slate-400">
                  <div className="flex items-center gap-2 text-sm font-bold">
                    <User className="w-4 h-4 text-red-500" />
                    <span className="text-slate-700">{video.author}</span>
                  </div>
                  <div className="text-xs font-bold">{video.pubDate}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Youtube Link Callout */}
        <section className="mt-24 p-12 bg-red-600 rounded-[48px] text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="relative z-10">
            <h3 className="text-3xl font-black mb-4">Бүх видеог сувгаас үзээрэй</h3>
            <p className="text-red-100 max-w-md text-lg font-medium">@ilchlelt сувагт маань 200 гаруй сургаал, номлол болон нэвтрүүлгүүд тогтмол ордог.</p>
          </div>
          <a 
            href="https://www.youtube.com/@ilchlelt/videos" 
            target="_blank" 
            rel="noopener noreferrer"
            className="relative z-10 flex items-center gap-3 bg-white text-red-600 px-10 py-5 rounded-2xl font-black text-xl hover:bg-slate-900 hover:text-white transition-all shadow-xl active:scale-95"
          >
            <YoutubeIcon className="w-8 h-8" /> YouTube руу очих
          </a>
        </section>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md" onClick={() => setSelectedVideo(null)}></div>
          <div className="relative bg-black w-full max-w-6xl aspect-video rounded-[32px] overflow-hidden shadow-2xl border border-white/10 animate-in zoom-in duration-500">
            <button 
              className="absolute top-6 right-6 z-20 p-3 bg-black/60 hover:bg-red-600 rounded-full text-white transition-all border border-white/10"
              onClick={() => setSelectedVideo(null)}
            >
              <X className="w-6 h-6" />
            </button>
            <iframe 
              src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1&rel=0&modestbranding=1`}
              className="w-full h-full"
              title={selectedVideo.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default SermonPage;
