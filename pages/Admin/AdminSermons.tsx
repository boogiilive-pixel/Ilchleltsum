
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Youtube, Play, X, Link as LinkIcon } from 'lucide-react';

interface SermonItem {
  id: string;
  title: string;
  youtubeId: string;
  createdAt: string;
}

const AdminSermons: React.FC = () => {
  const [sermons, setSermons] = useState<SermonItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    youtubeUrl: ''
  });

  const fetchSermons = async () => {
    try {
      const res = await fetch('/api/sermons');
      const data = await res.json();
      setSermons(data);
    } catch (error) {
      console.error('Error fetching sermons:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSermons();
  }, []);

  const extractYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const youtubeId = extractYoutubeId(formData.youtubeUrl);
    if (!youtubeId) {
      alert('YouTube линк буруу байна.');
      return;
    }

    try {
      const res = await fetch('/api/sermons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          youtubeId: youtubeId,
          thumbnail: `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
          link: `https://www.youtube.com/watch?v=${youtubeId}`
        }),
      });
      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ title: '', youtubeUrl: '' });
        fetchSermons();
      }
    } catch (error) {
      console.error('Error adding sermon:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Та энэ номлолыг устгахдаа итгэлтэй байна уу?')) return;
    try {
      const res = await fetch(`/api/sermons/${id}`, { method: 'DELETE' });
      if (res.ok) fetchSermons();
    } catch (error) {
      console.error('Error deleting sermon:', error);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Номлол удирдах</h1>
          <p className="text-slate-500">YouTube дээрх номлолуудын линкийг нэмэх, устгах.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3.5 bg-red-600 text-white rounded-2xl font-black hover:bg-red-700 transition-all shadow-lg active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Номлол нэмэх
        </button>
      </header>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sermons.length === 0 ? (
            <div className="col-span-full bg-white p-20 rounded-[40px] border border-dashed border-slate-300 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                <Youtube className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Номлол байхгүй байна</h3>
              <p className="text-slate-500">Та "Номлол нэмэх" товч дээр дарж анхны номлолоо оруулаарай.</p>
            </div>
          ) : (
            sermons.map((item) => (
              <div key={item.id} className="group bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden hover:shadow-xl transition-all">
                <div className="relative aspect-video bg-slate-100">
                  <img 
                    src={`https://img.youtube.com/vi/${item.youtubeId}/mqdefault.jpg`} 
                    alt={item.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-12 h-12 text-white fill-current" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-slate-900 mb-4 line-clamp-2 h-12">{item.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add Sermon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-2xl font-black text-slate-900">Шинэ номлол нэмэх</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">Номлолын гарчиг</label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-600/20 transition-all font-bold"
                  placeholder="Жишээ: Итгэл ба найдвар..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">YouTube Линк</label>
                <div className="relative">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="url" 
                    required
                    value={formData.youtubeUrl}
                    onChange={(e) => setFormData({...formData, youtubeUrl: e.target.value})}
                    className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-600/20 transition-all font-bold"
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all"
                >
                  Цуцлах
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-8 py-4 bg-red-600 text-white rounded-2xl font-black hover:bg-red-700 transition-all shadow-lg active:scale-95"
                >
                  Хадгалах
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSermons;
