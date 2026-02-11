
import React, { useState } from 'react';
import { PlayCircle, Search, Calendar, User, X } from 'lucide-react';
import { Sermon } from '../types';

const SERMONS: (Sermon & { category: string })[] = [
  {
    id: '1',
    title: 'Итгэлийн хүч ба ирээдүй',
    speaker: 'Пастор Б.Бат-Эрдэнэ',
    date: '2024.03.10',
    thumbnail: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Жишээ линк
    category: 'Итгэл'
  },
  {
    id: '2',
    title: 'Уучлалын ач тус',
    speaker: 'Пастор Ж.Гэрэл',
    date: '2024.03.03',
    thumbnail: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    category: 'Уучлал'
  },
  {
    id: '3',
    title: 'Гэр бүлийн харилцаа',
    speaker: 'Пастор Б.Бат-Эрдэнэ',
    date: '2024.02.25',
    thumbnail: 'https://images.unsplash.com/photo-1473625247510-8ceb1760943f?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    category: 'Гэр бүл'
  },
  {
    id: '4',
    title: 'Шинэ эхлэл',
    speaker: 'Пастор А.Саруул',
    date: '2024.02.18',
    thumbnail: 'https://images.unsplash.com/photo-1447069387593-a5de0862481e?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    category: 'Итгэл'
  }
];

const SermonPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('Бүгд');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSermon, setSelectedSermon] = useState<Sermon | null>(null);

  const filteredSermons = SERMONS.filter(sermon => {
    const matchesCategory = activeCategory === 'Бүгд' || sermon.category === activeCategory;
    const matchesSearch = sermon.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          sermon.speaker.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Сургаалууд</h1>
          <p className="text-slate-600">Бурханы үгийг хаанаас ч, хэзээ ч сонсох боломжтой.</p>
        </header>

        <div className="mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Сургаал хайх..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
            {['Бүгд', 'Итгэл', 'Гэр бүл', 'Залбирал', 'Уучлал'].map((cat) => (
              <button 
                key={cat} 
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full border transition-all whitespace-nowrap ${
                  activeCategory === cat 
                  ? 'bg-teal-700 text-white border-teal-700 shadow-md' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filteredSermons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSermons.map((sermon) => (
              <div 
                key={sermon.id} 
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 cursor-pointer"
                onClick={() => setSelectedSermon(sermon)}
              >
                <div className="relative aspect-video">
                  <img src={sermon.thumbnail} alt={sermon.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayCircle className="w-16 h-16 text-white" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 line-clamp-1">{sermon.title}</h3>
                  <div className="space-y-2 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-teal-700" />
                      <span>{sermon.speaker}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-teal-700" />
                      <span>{sermon.date}</span>
                    </div>
                  </div>
                  <button className="mt-6 w-full py-3 bg-slate-50 text-teal-700 font-bold rounded-xl group-hover:bg-teal-700 group-hover:text-white transition-colors">
                    Үзэх
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-3xl">
            <p className="text-slate-500 text-lg">Таны хайсан сургаал олдсонгүй.</p>
          </div>
        )}
      </div>

      {/* Video Modal */}
      {selectedSermon && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm" onClick={() => setSelectedSermon(null)}></div>
          <div className="relative bg-black w-full max-w-5xl aspect-video rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <button 
              className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              onClick={() => setSelectedSermon(null)}
            >
              <X className="w-6 h-6" />
            </button>
            <iframe 
              src={selectedSermon.videoUrl} 
              className="w-full h-full"
              title={selectedSermon.title}
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
