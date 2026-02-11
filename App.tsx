
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  Users, 
  Phone, 
  Menu, 
  X, 
  PlayCircle,
  Facebook,
  Youtube,
  Mail,
  Lock,
  User as UserIcon,
  LogOut,
  Loader2,
  Coins
} from 'lucide-react';
import LandingPage from './pages/LandingPage';
import SermonPage from './pages/SermonPage';
import EventsPage from './pages/EventsPage';
import MinistryPage from './pages/MinistryPage';
import ContactPage from './pages/ContactPage';
import DonationPage from './pages/DonationPage';

/** 
 * ЛОГО БҮРЭЛДЭХҮҮН
 */
const AdventistLogo = ({ className = "w-12 h-12" }) => (
  <div className={`${className} bg-[#235d5e] rounded-full flex items-center justify-center p-1.5 shadow-md overflow-hidden transition-transform hover:scale-105`}>
    <svg viewBox="0 0 100 100" className="w-full h-full text-white fill-current">
      <path d="M50 20c-5.5 0-10.4 4.5-10.4 10s4.9 10 10.4 10 10.4-4.5 10.4-10-4.9-10-10.4-10zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z" />
      <path d="M50 45c-15 0-25 10-25 25h5c0-12 8-20 20-20s20 8 20 20h5c0-15-10-25-25-25z" />
      <path d="M47.5 55h5v30h-5z" />
      <path d="M40 70h20v5H40z" />
      <path d="M50 10c22.1 0 40 17.9 40 40s-17.9 40-40 40S10 72.1 10 50 27.9 10 50 10m0-2C23.5 8 2 29.5 2 56s21.5 48 48 48 48-21.5 48-48S76.5 8 50 8z" opacity="0.1" />
    </svg>
  </div>
);

interface User {
  name: string;
  email: string;
}

const AuthModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onLoginSuccess({
        name: isLogin ? 'Зочин' : formData.name || 'Шинэ Хэрэглэгч',
        email: formData.email
      });
      setLoading(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">
        <button onClick={onClose} disabled={loading} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
          <X className="w-5 h-5" />
        </button>
        <div className="p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <AdventistLogo className="w-20 h-20" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">{isLogin ? 'Тавтай морил' : 'Шинэ бүртгэл'}</h2>
            <p className="text-slate-500 mt-2 text-sm">Илчлэлт сүмийн гэр бүлд нэгдээрэй.</p>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="text" required disabled={loading} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Бүтэн нэр" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="email" required disabled={loading} value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="Имэйл хаяг" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="password" required disabled={loading} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="Нууц үг" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" />
            </div>
            <button type="submit" disabled={loading} className="w-full py-4 bg-teal-700 text-white font-bold rounded-xl hover:bg-teal-800 transition-all shadow-lg flex items-center justify-center gap-2">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? 'Нэвтрэх' : 'Бүртгүүлэх')}
            </button>
          </form>
          <p className="text-center mt-8 text-sm text-slate-600">
            {isLogin ? 'Шинэ хэрэглэгч үү?' : 'Бүртгэлтэй юу?'} 
            <button onClick={() => setIsLogin(!isLogin)} className="ml-2 text-teal-700 font-bold hover:underline">{isLogin ? 'Бүртгүүлэх' : 'Нэвтрэх'}</button>
          </p>
        </div>
      </div>
    </div>
  );
};

const Navbar: React.FC<{ 
  user: User | null;
  onAuthClick: () => void;
  onLogout: () => void;
}> = ({ user, onAuthClick, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Нүүр', path: '/', icon: Home },
    { name: 'Сургаал', path: '/sermons', icon: PlayCircle },
    { name: 'Үйл ажиллагаа', path: '/events', icon: Calendar },
    { name: 'Үйлчлэлүүд', path: '/ministries', icon: Users },
    { name: 'Хандив', path: '/donation', icon: Coins },
    { name: 'Холбоо барих', path: '/contact', icon: Phone },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass-nav shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-4 group">
          <AdventistLogo className="w-12 h-12" />
          <div className="flex flex-col">
            <span className={`font-bold text-xl leading-none transition-colors ${isScrolled ? 'text-teal-900' : 'text-slate-900'}`}>Илчлэлт Сүм</span>
            <span className="text-[10px] uppercase tracking-widest font-bold text-teal-700/70 mt-1">Revelation Church</span>
          </div>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path} className={`font-semibold text-sm transition-all hover:-translate-y-0.5 ${location.pathname === link.path ? 'text-teal-700 underline underline-offset-8 decoration-2' : 'text-slate-600 hover:text-teal-700'}`}>{link.name}</Link>
          ))}
          {user ? (
            <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
              <span className="font-bold text-sm text-slate-700">{user.name}</span>
              <button onClick={onLogout} className="p-2 text-slate-400 hover:text-red-500"><LogOut className="w-5 h-5" /></button>
            </div>
          ) : (
            <button onClick={onAuthClick} className="bg-teal-700 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-teal-800 shadow-lg shadow-teal-700/20">Нэгдэх</button>
          )}
        </div>
        <button className="md:hidden p-2 text-slate-700" onClick={() => setIsOpen(!isOpen)}>{isOpen ? <X /> : <Menu />}</button>
      </div>
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 p-4 flex flex-col gap-2 shadow-2xl">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)} className={`flex items-center gap-3 p-4 rounded-xl font-bold ${location.pathname === link.path ? 'bg-teal-50 text-teal-700' : 'text-slate-700'}`}>{link.name}</Link>
          ))}
          {!user && <button onClick={() => { setIsOpen(false); onAuthClick(); }} className="mt-2 w-full py-4 bg-teal-700 text-white font-bold rounded-xl">Нэгдэх</button>}
        </div>
      )}
    </nav>
  );
};

const Footer: React.FC = () => {
  const footerLinks = [
    { path: '/sermons', name: 'Сургаалууд' },
    { path: '/events', name: 'Үйл ажиллагаа' },
    { path: '/ministries', name: 'Үйлчлэлүүд' },
    { path: '/donation', name: 'Хандив' },
    { path: '/contact', name: 'Холбоо барих' },
  ];

  return (
    <footer className="bg-slate-900 text-slate-300 py-16">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-4 mb-6">
            <AdventistLogo className="w-16 h-16" />
            <div className="flex flex-col text-white">
              <span className="text-xl font-bold">Илчлэлт Сүм</span>
              <span className="text-xs uppercase tracking-widest text-teal-400 font-bold">Revelation Church</span>
            </div>
          </div>
          <p className="mb-8 max-w-sm leading-relaxed text-slate-400">Гэрэл ба Хайрын Өргөө. Бид Есүс Христийн сайн мэдээг түгээж, нийгэмдээ гэрэл болох зорилготой Долоо дахь өдрийн Адвентист сүм юм.</p>
          <div className="flex gap-4">
            <a href="https://www.facebook.com/ilchleltsum" target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-full bg-slate-800 flex items-center justify-center hover:bg-teal-600 transition-all"><Facebook className="w-5 h-5" /></a>
            <a href="https://www.youtube.com/@ilchlelt" target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-full bg-slate-800 flex items-center justify-center hover:bg-teal-600 transition-all"><Youtube className="w-5 h-5" /></a>
          </div>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6 text-lg">Холбоосууд</h4>
          <ul className="space-y-3">
            {footerLinks.map(link => (
              <li key={link.path}>
                <Link to={link.path} className="hover:text-teal-400 transition-colors">{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6 text-lg">Цуглааны цаг</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex flex-col"><span className="text-teal-400 font-bold">Шаббат (Бямба):</span><span>10:00 - Библийн хичээл</span><span>11:30 - Магтан хүндэтгэл</span></li>
            <li className="flex flex-col"><span className="text-teal-400 font-bold">Лхагва гараг:</span><span>19:00 - Залбирлын цаг</span></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-slate-800 text-center text-sm opacity-40">© {new Date().getFullYear()} Илчлэлт Сүм. Бүх эрх хуулиар хамгаалагдсан.</div>
    </footer>
  );
};

const AppContent: React.FC = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} onAuthClick={() => setIsAuthOpen(true)} onLogout={() => setUser(null)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onLoginSuccess={u => {setUser(u); setIsAuthOpen(false);}} />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/sermons" element={<SermonPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/ministries" element={<MinistryPage />} />
          <Route path="/donation" element={<DonationPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
};

export default App;
