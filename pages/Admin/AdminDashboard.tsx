
import React, { useEffect, useState } from 'react';
import { 
  Newspaper, 
  Youtube, 
  Image as ImageIcon, 
  MessageSquare, 
  TrendingUp,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    news: 0,
    sermons: 0,
    gallery: 0,
    messages: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [newsRes, sermonsRes, galleryRes, messagesRes] = await Promise.all([
          fetch('/api/news'),
          fetch('/api/sermons'),
          fetch('/api/gallery'),
          fetch('/api/messages')
        ]);

        const [news, sermons, gallery, messages] = await Promise.all([
          newsRes.json(),
          sermonsRes.json(),
          galleryRes.json(),
          messagesRes.json()
        ]);

        setStats({
          news: news.length,
          sermons: sermons.length,
          gallery: gallery.length,
          messages: messages.length
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { label: 'Нийт Мэдээ', value: stats.news, icon: Newspaper, color: 'bg-blue-500', link: '/admin/news' },
    { label: 'Нийт Номлол', value: stats.sermons, icon: Youtube, color: 'bg-red-500', link: '/admin/sermons' },
    { label: 'Зургийн цомог', value: stats.gallery, icon: ImageIcon, color: 'bg-purple-500', link: '/admin/gallery' },
    { label: 'Ирсэн Зурвас', value: stats.messages, icon: MessageSquare, color: 'bg-emerald-500', link: '/admin/messages' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-black text-slate-900 mb-2">Сайн байна уу? 👋</h1>
        <p className="text-slate-500">Системийн өнөөдрийн төлөв байдал болон статистик мэдээлэл.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Link 
            key={index} 
            to={stat.link}
            className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
          >
            <div className="flex items-start justify-between mb-6">
              <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                <stat.icon className="w-7 h-7" />
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-red-50 group-hover:text-red-600 transition-colors">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>
            <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-4xl font-black text-slate-900">{stat.value}</h3>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Placeholder */}
        <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-black text-xl text-slate-900">Сүүлийн үеийн идэвх</h3>
            </div>
            <button className="text-sm font-bold text-red-600 hover:underline">Бүгдийг харах</button>
          </div>
          <div className="p-8 space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="text-slate-900 font-bold">Шинэ мэдээ нэмэгдсэн</p>
                  <p className="text-slate-500 text-sm">Админ хэрэглэгч "Сүмийн шинэ байр" мэдээг нийтэллээ.</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">2 цагийн өмнө</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/20 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          <h3 className="text-2xl font-black mb-8 relative z-10">Шуурхай үйлдэл</h3>
          <div className="space-y-4 relative z-10">
            <Link to="/admin/news" className="w-full flex items-center justify-between p-5 bg-white/10 hover:bg-white/20 rounded-2xl transition-all group">
              <span className="font-bold">Мэдээ нэмэх</span>
              <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
            <Link to="/admin/sermons" className="w-full flex items-center justify-between p-5 bg-white/10 hover:bg-white/20 rounded-2xl transition-all group">
              <span className="font-bold">Номлол нэмэх</span>
              <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
            <Link to="/admin/gallery" className="w-full flex items-center justify-between p-5 bg-white/10 hover:bg-white/20 rounded-2xl transition-all group">
              <span className="font-bold">Зураг оруулах</span>
              <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
