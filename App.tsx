
import React, { useState, useEffect, useRef } from 'react';
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
  Coins,
  Newspaper,
  CheckCircle2,
  ArrowUp,
  Send,
  Bell,
  AlertCircle,
  ChevronDown
} from 'lucide-react';
import LandingPage from './pages/LandingPage';
import SermonPage from './pages/SermonPage';
import EventsPage from './pages/EventsPage';
import ContactPage from './pages/ContactPage';
import DonationPage from './pages/DonationPage';
import InfoPage from './pages/InfoPage';
import MinistryPage from './pages/MinistryPage';
import TestimonialSection from './components/TestimonialSection';
import MouseFollower from './components/MouseFollower';

// Admin Pages
import AdminLogin from './pages/Admin/AdminLogin';
import AdminLayout from './pages/Admin/AdminLayout';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminNews from './pages/Admin/AdminNews';
import AdminSermons from './pages/Admin/AdminSermons';
import AdminGallery from './pages/Admin/AdminGallery';
import AdminMessages from './pages/Admin/AdminMessages';

// --- CONFIGURATION ---
export const SUBMIT_URL = "https://script.google.com/macros/s/AKfycbwTsMCjSn82ui6OvCxuYLTlBeh7vj5CHCEn43T5Zp4dSAEPtpbS2iEg0lLtzURzjRIR/exec"; 

// Validation Helper
export const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Global Nav Links
const NAV_LINKS = [
  { name: 'Нүүр', path: '/' },
  { 
    name: 'Номлол', 
    path: '/sermons',
    dropdown: [
      { name: 'Сургаал номлол', path: '/sermons' },
      { name: 'Цуврал хичээл', path: '/series' },
    ]
  },
  { name: 'Мэдээлэл', path: '/info' },
  { name: 'Үйл ажиллагаа', path: '/events' },
  { name: 'Хандив', path: '/donation' },
  { name: 'Холбоо барих', path: '/contact' },
];

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const toggleVisibility = () => setIsVisible(window.pageYOffset > 300);
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-[100] p-4 bg-teal-700 text-white rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 hover:bg-teal-800 focus:outline-none ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      }`}
    >
      <ArrowUp className="w-6 h-6" />
    </button>
  );
};

export const AdventistLogo = ({ className = "w-12 h-12" }) => (
  <div className={`${className} flex items-center justify-center overflow-hidden transition-transform hover:scale-105`}>
    <img 
      src="https://lh3.googleusercontent.com/d/1iVLnofMfCzcUFC5D-jmNz7zUNonArK9K" 
      alt="Илчлэлт Сүм" 
      className="w-full h-full object-contain drop-shadow-md"
      onError={(e) => (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&w=100&q=80"}
    />
  </div>
);

export interface User {
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
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  
  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation logic
    if (formData.name.trim().length < 2 || !isValidEmail(formData.email) || formData.password.length < 4) {
      setError("Уучлаарай та үнэн зөв мэдээлэл оруулан уу!");
      return;
    }

    setLoading(true);

    try {
      const params = new URLSearchParams();
      params.append('name', formData.name);
      params.append('email', formData.email);
      params.append('action', isLogin ? "Нэвтрэх оролдлого" : "Шинэ бүртгүүлэх хүсэлт");

      await fetch(SUBMIT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString()
      });
      
      setTimeout(() => {
        if (!isLogin) {
          setShowSuccess(true);
          setTimeout(() => {
            setShowSuccess(false);
            onLoginSuccess({ name: formData.name || 'Шинэ Хэрэглэгч', email: formData.email });
            onClose();
          }, 2000);
        } else {
          onLoginSuccess({ name: formData.name || 'Зочин', email: formData.email });
          onClose();
        }
      }, 1500);
      
    } catch (err) {
      console.error("Submission failed:", err);
      onLoginSuccess({ name: formData.name || 'Зочин', email: formData.email });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
        <button onClick={onClose} disabled={loading} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"><X className="w-5 h-5" /></button>
        <div className="p-8 md:p-10">
          {showSuccess ? (
            <div className="text-center py-10 animate-in zoom-in">
              <div className="w-20 h-20 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mb-6 mx-auto"><CheckCircle2 className="w-10 h-10" /></div>
              <h2 className="text-xl font-bold mb-4 text-slate-900 leading-tight">Таны мэдээллийг хүлээн авсны дараа бид тантай холбогдох болно.</h2>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4"><AdventistLogo className="w-20 h-20" /></div>
                <h2 className="text-2xl font-bold text-slate-900">{isLogin ? 'Тавтай морил' : 'Шинэ бүртгэл'}</h2>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-semibold animate-in slide-in-from-top-2 duration-300">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  {error}
                </div>
              )}

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input name="name" type="text" required disabled={loading} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Таны нэр" className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border ${error && formData.name.length < 2 ? 'border-red-300 ring-1 ring-red-100' : 'border-slate-100'} rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none font-medium`} />
                </div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input name="email" type="email" required disabled={loading} value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="Имэйл хаяг" className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border ${error && !isValidEmail(formData.email) ? 'border-red-300 ring-1 ring-red-100' : 'border-slate-100'} rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none font-medium`} />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input name="password" type="password" required disabled={loading} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="Нууц үг" className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border ${error && formData.password.length < 4 ? 'border-red-300 ring-1 ring-red-100' : 'border-slate-100'} rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none font-medium`} />
                </div>
                <button type="submit" disabled={loading} className="w-full py-4 bg-teal-700 text-white font-bold rounded-2xl hover:bg-teal-800 transition-all shadow-lg flex items-center justify-center gap-2 mt-4 active:scale-95">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? 'Нэвтрэх' : 'Хүсэлт илгээх')}
                </button>
              </form>
              <p className="text-center mt-8 text-sm text-slate-600 font-medium">
                {isLogin ? 'Шинэ хэрэглэгч үү?' : 'Бүртгэлтэй юу?'} 
                <button onClick={() => { setIsLogin(!isLogin); setError(null); }} className="ml-2 text-teal-700 font-bold hover:underline">{isLogin ? 'Бүртгүүрэх' : 'Нэвтрэх'}</button>
              </p>
            </>
          )}
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
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    };
  }, []);

  const handleMouseEnter = (name: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(name);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

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
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {NAV_LINKS.map((link) => (
            <div 
              key={link.name} 
              className="relative group/dropdown"
              onMouseEnter={() => link.dropdown && handleMouseEnter(link.name)}
              onMouseLeave={() => link.dropdown && handleMouseLeave()}
            >
              <Link 
                to={link.path} 
                className={`flex items-center gap-1 font-semibold text-sm transition-all hover:-translate-y-0.5 ${
                  location.pathname === link.path || (link.dropdown?.some(d => d.path === location.pathname))
                    ? 'text-teal-700 underline underline-offset-8 decoration-2' 
                    : 'text-slate-600 hover:text-teal-700'
                }`}
              >
                {link.name}
                {link.dropdown && <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === link.name ? 'rotate-180' : ''}`} />}
              </Link>

              {link.dropdown && (
                <div className={`absolute top-full left-0 w-48 pt-2 transition-all duration-200 origin-top-left ${
                  activeDropdown === link.name ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                }`}>
                  <div className="bg-white rounded-2xl shadow-xl border border-slate-100 py-2">
                    {link.dropdown.map((subItem) => (
                      <Link
                        key={subItem.path}
                        to={subItem.path}
                        className={`block px-4 py-2 text-sm font-bold transition-colors ${
                          location.pathname === subItem.path ? 'text-teal-700 bg-teal-50' : 'text-slate-600 hover:text-teal-700 hover:bg-slate-50'
                        }`}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          {user ? (
            <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
              <span className="font-bold text-sm text-slate-700">{user.name}</span>
              <button onClick={onLogout} className="p-2 text-slate-400 hover:text-red-500"><LogOut className="w-5 h-5" /></button>
            </div>
          ) : (
            <button onClick={onAuthClick} className="bg-teal-700 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-teal-800 shadow-lg">Нэгдэх</button>
          )}
        </div>
        <button className="md:hidden p-2 text-slate-700" onClick={() => setIsOpen(!isOpen)}>{isOpen ? <X /> : <Menu />}</button>
      </div>
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 p-4 flex flex-col gap-2 shadow-2xl overflow-y-auto max-h-[80vh]">
          {NAV_LINKS.map((link) => (
            <div key={link.name} className="flex flex-col">
              <div className="flex items-center justify-between">
                <Link 
                  to={link.path} 
                  onClick={() => !link.dropdown && setIsOpen(false)} 
                  className={`flex-grow flex items-center gap-3 p-4 rounded-xl font-bold ${
                    location.pathname === link.path || (link.dropdown?.some(d => d.path === location.pathname))
                      ? 'bg-teal-50 text-teal-700' 
                      : 'text-slate-700'
                  }`}
                >
                  {link.name}
                </Link>
                {link.dropdown && (
                  <button 
                    onClick={() => setActiveDropdown(activeDropdown === link.name ? null : link.name)}
                    className="p-4 text-slate-400"
                  >
                    <ChevronDown className={`w-5 h-5 transition-transform ${activeDropdown === link.name ? 'rotate-180' : ''}`} />
                  </button>
                )}
              </div>
              
              {link.dropdown && activeDropdown === link.name && (
                <div className="flex flex-col pl-8 gap-1 animate-in slide-in-from-top-2 duration-200">
                  {link.dropdown.map((subItem) => (
                    <Link
                      key={subItem.path}
                      to={subItem.path}
                      onClick={() => setIsOpen(false)}
                      className={`p-3 rounded-xl text-sm font-bold ${
                        location.pathname === subItem.path ? 'text-teal-700' : 'text-slate-500'
                      }`}
                    >
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          {!user && <button onClick={() => { setIsOpen(false); onAuthClick(); }} className="mt-2 w-full py-4 bg-teal-700 text-white font-bold rounded-xl">Нэгдэх</button>}
        </div>
      )}
    </nav>
  );
};

const Footer: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);

    if (!phone || phone.trim().length < 8) {
      setError(true);
      return;
    }

    setLoading(true);

    try {
      // 1. Send to local API for Admin Panel
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: "Newsletter Subscriber",
          phone: phone,
          topic: "Мэдээлэл авах хүсэлт",
          message: `Утасны дугаар: ${phone}. Мэдээлэл авах хүсэлт илгээлээ.`
        }),
      }).catch(e => console.warn("Failed to save subscription locally", e));

      const params = new URLSearchParams();
      params.append('phone', phone);
      params.append('action', 'Мэдээлэл авах хүсэлт (Newsletter - Phone)');

      await fetch(SUBMIT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString()
      });

      setTimeout(() => {
        setSuccess(true);
        setPhone('');
        setTimeout(() => setSuccess(false), 3000);
      }, 1000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Newsletter Section */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-md text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 text-teal-400 mb-3">
              <Bell className="w-6 h-6 animate-pulse" />
              <h3 className="text-xl md:text-2xl font-black text-white leading-tight">Мэдээлэл авах</h3>
            </div>
            <p className="text-slate-400 font-medium">Хэрэв та мэдээлэл авахыг хүсвэл утасны дугаараа бичээд үлдээгээрэй. Бид тантай холбогдох болно.</p>
          </div>
          <form onSubmit={handleSubscribe} className="w-full max-w-md">
            <div className="relative flex flex-col sm:flex-row gap-3">
              <div className="relative flex-grow">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                   type="tel" 
                  required 
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); if(error) setError(false); }}
                  placeholder="Таны утасны дугаар" 
                  className={`w-full pl-12 pr-4 py-4 bg-slate-800 border ${error ? 'border-red-500/50' : 'border-slate-700'} rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none text-white font-medium transition-colors`} 
                />
              </div>
              <button 
                disabled={loading || success}
                className={`px-8 py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 shadow-lg min-w-[140px] ${
                  success ? 'bg-emerald-500 text-white' : 'bg-teal-600 text-white hover:bg-teal-500'
                }`}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : success ? <CheckCircle2 className="w-5 h-5" /> : <><Send className="w-5 h-5" /> Бүртгүүлэх</>}
              </button>
            </div>
            {error && <p className="text-red-400 text-xs font-bold mt-3 text-center md:text-left animate-in fade-in">Уучлаарай та үнэн зөв мэдээлэл оруулан уу!</p>}
            {success && <p className="text-emerald-400 text-xs font-bold mt-3 text-center md:text-left animate-in fade-in">Амжилттай бүртгэгдлээ. Танд баярлалаа!</p>}
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-4 mb-6">
            <AdventistLogo className="w-16 h-16" />
            <div className="flex flex-col text-white"><span className="text-xl font-bold">Илчлэлт Сүм</span><span className="text-xs uppercase tracking-widest text-teal-400 font-bold">Revelation Church</span></div>
          </div>
          <p className="mb-8 max-w-sm leading-relaxed text-slate-400">Бид зөвхөн Библид суурьтай үнэнийг түгээж, Гурван тэнгэрэлчийн мэдээг тунхаглаж, нийгэмдээ гэрэл, давс болох зорилготой Долоо дахь өдрийн Адвентист сүм юм.</p>
          <div className="flex gap-4">
            <a href="https://www.facebook.com/ilchleltsum" target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-full bg-slate-800 flex items-center justify-center hover:bg-teal-600 transition-all text-white"><Facebook className="w-5 h-5" /></a>
            <a href="https://www.youtube.com/@ilchlelt" target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-full bg-slate-800 flex items-center justify-center hover:bg-teal-600 transition-all text-white"><Youtube className="w-5 h-5" /></a>
          </div>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6 text-lg">Холбоосууд</h4>
          <ul className="space-y-3">
            {NAV_LINKS.map(link => (
              <li key={link.path}>
                <Link to={link.path} className="hover:text-teal-400 transition-colors uppercase text-xs font-bold tracking-widest">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6 text-lg">Цуглааны цаг</h4>
          <ul className="space-y-4 text-sm">
            <li><span className="text-teal-400 font-bold block">Лхагва гараг:</span>18:30 - Библи судлал Онлайн</li>
            <li><span className="text-teal-400 font-bold block">Баасан гараг:</span>18:30 - Залбирлын цуглаан</li>
            <li><span className="text-teal-400 font-bold block">Бямба гараг:</span>10:00 - Хүндэтгэлийн цуглаан</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-30">© {new Date().getFullYear()} Илчлэлт Сүм. Бүх эрх хуулиар хамгаалагдсан.</div>
      </div>
    </footer>
  );
};

const AppContent: React.FC = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  return (
    <Routes>
      {/* Admin Routes (No Main Layout) */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="news" element={<AdminNews />} />
        <Route path="sermons" element={<AdminSermons />} />
        <Route path="gallery" element={<AdminGallery />} />
        <Route path="messages" element={<AdminMessages />} />
      </Route>

      {/* Main App Routes */}
      <Route path="*" element={
        <div className="min-h-screen flex flex-col relative">
          <MouseFollower />
          <Navbar user={user} onAuthClick={() => setIsAuthOpen(true)} onLogout={() => setUser(null)} />
          <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onLoginSuccess={u => {setUser(u); setIsAuthOpen(false);}} />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/sermons" element={<SermonPage initialCategory="sermons" />} />
              <Route path="/series" element={<SermonPage initialCategory="series" />} />
              <Route path="/info" element={<InfoPage user={user} onAuthClick={() => setIsAuthOpen(true)} />} />
              <Route path="/events" element={<EventsPage user={user} />} />
              <Route path="/ministry" element={<MinistryPage user={user} />} />
              <Route path="/donation" element={<DonationPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Routes>
          </main>
          <TestimonialSection />
          <ScrollToTopButton />
          <Footer />
        </div>
      } />
    </Routes>
  );
};

const App: React.FC = () => {
  console.log("APP COMPONENT RENDERING...");
  return (
    <HashRouter>
      <ScrollToTop />
      <AppContent />
    </HashRouter>
  );
};

export default App;
