
import React, { useState } from 'react';
import { 
  Calendar, 
  User as UserIcon, 
  ArrowRight, 
  X, 
  Clock, 
  Share2, 
  MessageSquare, 
  Facebook, 
  Send, 
  LogIn 
} from 'lucide-react';
import { User } from '../App';

// Custom X (Twitter) Icon Component
const XIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
  </svg>
);

interface Comment {
  id: string;
  author: string;
  text: string;
  date: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  category: string;
  image: string;
}

// Simulated initial comments
const INITIAL_COMMENTS: Record<string, Comment[]> = {
  '4': [
    { id: 'c1', author: 'Болд', text: 'Үнэхээр сайхан арга хэмжээ болсон. Баярлалаа!', date: '2026.02.15' },
    { id: 'c2', author: 'Сараа', text: 'Дараагийн хосуудын өдрийг тэсэн ядан хүлээж байна.', date: '2026.02.16' }
  ],
  '5': [
    { id: 'c3', author: 'Гэрлээ', text: 'Хүүхдүүд маань маш их баяртай байсан.', date: '2025.12.26' }
  ]
};

export const POSTS: BlogPost[] = [
  {
    id: '6',
    title: "Зургийн дугуйлан эхлэх гэж байна",
    excerpt: "2026 оны 04 сарын 01-ний өдрөөс 6-наас дээш насны хүүхдүүдийн дунд Зургийн дугуйлан эхлэх гэж байна.",
    content: "Зургийн дугуйлан эхлэх гэж байна! 🎨\n\n2026 оны 04 сарын 01-ний өдрөөс эхлэн 6-наас дээш насны хүүхдүүдийн дунд Зургийн дугуйлан хичээллэж эхлэх гэж байна. \n\n🎨 Зураг зурахын ач холбогдол:\nЗураг зурах нь хүүхдийн бүтээлч сэтгэлгээг хөгжүүлж, анхаарал төвлөрөлтийг сайжруулж, өөрийгөө илэрхийлэх чадварыг нэмэгдүүлдэг маш чухал үйл ажиллагаа юм. Мөн хүүхдийн гарны жижиг булчингуудыг хөгжүүлж, гоо зүйн мэдрэмжийг төлөвшүүлдэг.\n\n👨‍👩‍👧‍👦 Эцэг эхчүүддээ:\nХүүхдийнхээ авьяас чадварыг нээж, тэдэнд бүтээлч ертөнцөөр аялах боломжийг олгоорой. Бид та бүхнийг хүүхдүүдээ энэхүү дугуйланд идэвхтэй хамруулахыг уриалж байна.\n\n📍 Хаана: Илчлэлт сүм\n📅 Хэзээ: 2026 оны 04 сарын 01-нээс\n👶 Нас: 6-наас дээш\n\nДэлгэрэнгүй мэдээллийг сүмийн мэдээллийн ажилтнаас авна уу.",
    date: "2026.03.20",
    author: "Мэдээллийн баг",
    category: "Арга хэмжээ",
    image: "https://lh3.googleusercontent.com/d/1DM0DhXsI0LR1UQjmsHC7BLSZN2rmJMii"
  },
  {
    id: '4',
    title: "Хосуудад зориулсан Хайрын баярын хөтөлбөр",
    excerpt: "2026 оны 02 сарын 14-ний өдөр Илчлэлт сүм хосуудад зориулсан онцгой, утга учиртай арга хэмжээг зохион байгуулагдлаа.",
    content: "2026 оны 02 сарын 14-ний өдөр Илчлэлт сүм хосуудад зориулсан онцгой, утга учиртай арга хэмжээг зохион байгуулагдлаа. Энэхүү үйл ажиллагаанд 8 хос буюу 16 хүн оролцож, хайраа сэргээх, харилцаагаа бэхжүүлэх таван цагийг хамтдаа өнгөрүүлэв.\n\n💖 Хайрын таван хэл – Харилцааг сэргээх түлхүүр\nАрга хэмжээний гол онцлог хэсэг нь гэр бүл судлаач Пүрэвдулам-ын орсон сургалт байлаа. Тэрээр Хайрын таван хэл сэдвээр сургалт орж, хосуудад хайраа илэрхийлэх өөр өөр хэлбэрүүдийг таних, ханийнхаа хэрэгцээг ойлгох, гомдол үл ойлголцлыг багасгах, сэтгэл зүйн ойр дотно байдлыг нэмэгдүүлэх зэрэг бодит, хэрэгжүүлэх болон боломжтой зөвлөгөөнүүдийг өгсөн юм.\n\n🍽 Хүндэт зоог ба хамтын бүтээл\n5 цагийн турш үргэлжилсэн уг арга хэмжээанд хүндэт зоог, хамтдаа зураг зурж бүтээл хийх, хөгжөөнт тоглоом, дурсамжит гэрэл зураг авах хэсгүүд багтсан. Хосууд хамтдаа нэг зураг бүтээхдээ зүгээр нэг будгаар зурсангүй — тэд харилцаагаа дахин зурж, ирээдүйнхээ өнгийг тодруулсан билээ.\n\n🤝 Нээлттэй, халуун дулаан уур амьсгал\nЭнэ удаагийн арга хэмжээанд зөвхөн сүмийн гишүүд бус, шинэ зочид оролцсон нь илүү онцгой байв. Инээмсэглэл, талархал, нулимстай тэврэлтүүд энэ өдрийн үнэ цэнийг илэрхийлж байлаа. Хайр бол мэдрэмж төдийгүй суралцаж, хөгжүүлж болдог ур чадвар юм. Илчлэлт сүм хосуудынхаа харилцааг хамгаалж, сэргээж, илүү бат бөх болгохын төлөө ийнхүү хамтдаа алхсаар байна.",
    date: "2026.02.14",
    author: "Мэдээллийн баг",
    category: "Арга хэмжээ",
    image: "https://lh3.googleusercontent.com/d/1_yedcVfxVzQuAxD8mNQyHzTGIOPprD3R"
  },
  {
    id: '5',
    title: "Христмасын баяр – Хүүхдүүдийн инээмсэглэлээр дүүрэн өдөр",
    excerpt: "2025 оны 12 сарын 25-ны өдөр Христмасын баярыг тохиолдуулан ХУД-ийн 8-р хорооны 35 хүүхдийг баярлуулсан утга учиртай үйл ажиллагаа зохион байгуулагдлаа.",
    content: "2025 оны 12 сарын 25-ны өдөр Христмасын баярыг тохиолдуулан ХУД-ийн 8-р хорооны 35 хүүхдийг баярлуулсан утга учиртай үйл ажиллагаа зохион байгуулагдлаа.\n\nЭнэ өдөр зүгээр нэг баяр биш, харин хуваалцах хайр, халуун дулаан уур амьсгалын өдөр байв.\n\n🎶 Магтан дуу – Зүрхнээс зүрх рүү\nХүүхдүүдэд Христмасын магтан дуу зааж, хамтдаа дуулсан мөчүүд онцгой байлаа. Бяцхан хоолойнууд нэгдэн эгшиглэхэд танхим дүүрэн баярын уур амьсгал бүрэлдэж, хүүхэд бүрийн нүдэнд гэрэл асаав.\n\n🎲 Хөгжөөнт тоглоом – Инээд хөөрөөр дүүрэн цаг\nАрга хэмжээний үеэр:\n• Хөгжөөнт багийн тоглоомууд\n• Асуулт хариултын тэмцээн\n• Багаар хамтран оролцох идэвхжүүлэх үйл ажиллагаанууд\nзэрэг олон сонирхолтой хөтөлбөрүүд явагдаж, хүүхдүүд инээж, баясаж, идэвхтэй оролцов.\n\n🎁 Хүүхэд бүрд бэлэг\nӨдрийн төгсгөлд хүүхэд бүрд бэлэг гардуулж, тэдний баяр хөөрийг улам нэмэгдүүлэв. Жижигхэн гартаа бэлгээ атгасан хүүхдүүдийн инээмсэглэл энэ өдрийн хамгийн үнэ цэнтэй шагнал байлаа.\n\nХристмас бол зөвхөн баярын өдөр биш, харин өгөх, хайрлах, халамжлахын утгыг сануулах өдөр юм. Энэхүү үйл ажиллагаагоор дамжуулан олон хүүхдин зүрхэнд дулаан дурсамж үлдэж чадсанд бид талархалтай баййна.\n\n🎄 Ирэх жилүүдэд ч илүү олон хүүхдэд баяр бэлэглэх үйлс үргэлжилсээр байх болтугай.",
    date: "2025.12.25",
    author: "Мэдээллийн баг",
    category: "Үйлчлэл",
    image: "https://lh3.googleusercontent.com/d/1iH7zOsozqk8I6Mm8Sw4cf4eJV68mIjkT"
  },
  {
    id: '1',
    title: "Илчлэлт сүмийн үйл ажиллагаа идэвхтэй үргэлжилсээр байна",
    excerpt: "Бид Бямба гараг бүр 10 цагт цуглаж, Бурханы хайр ба ивээл дунд нэгдэн нөхөрлөж байна. Энэ удаагийн цуглаанд Англи улсаас Гантулга эгч маань зочлон оролцлоо.",
    content: "Илчлэлт сүмийн хаалга Бямба гараг бүрийн өглөө 10:00 цагт нээлттэй байж, ариун Шаббат өдрийг хамтдаа угтдаг уламжлал маань амжилттай үргэлжилсээр байна. \n\n✨ Магтан хүндэтгэлийн халуун дулаан цаг\nБид цуглааныхаа эхэнд зүрх сэтгэлээ нэгтгэн магтан дуу дуулж, Бурханыг алдаршуулдаг. Хөгжмийн эгшиг, дуу хоолой бүр нэгдэхэд танхим дүүрэн амар амгалан, баяр баясал бялхдаг билээ. Үүний дараа Бурханы амьд үгээс хуваалцаж, амьдралын чиг баримжаа болон итгэл найдварын зурвасыг хамтдаа судалж байна.\n\n🌍 Алс холын зочин - Гантулга эгчийн нэгдэл\nЭнэ удаагийн цуглаан маань маш онцгой байлаа. Алс хол Англи улсаас Гантулга эгч маань биднийг зорин ирж, сүмийн үйл ажиллагаанд идэвхтэй оролцсон нь бидэнд маш том урам зориг болсон юм. Итгэл үнэмшилд орон зай, зай талбай үл хамаарахыг тэрээр бидэнд харуулж, халуун дулаан яриа, туршлагаараа нөхөрлөлийн цагийг маань чимж өглөө.\n\n🤝 Хамтдаа нөхөрлөж, хамтдаа өсөцгөөе\nЦуглааны дараа бид хамтдаа цай уун нөхөрлөж, бие биенээ халамжлах цагийг өнгөрүүлдэг. Энэ бол зөвхөн сургаал сонсох газар биш, харин бие биенээ түшиж, хайрладаг халуун дулаан гэр бүл юм.\n\n🏠 Таныг урьж байна\nХэрэв та амар амгаланг хайж байгаа бол, эсвэл Бурханы талаар илүү ихийг мэдэхийг хүсвэл манай сүмийн үүд хаалга таны өмнө үргэлж нээлттэй. Бямба гараг бүр 10:00 цагт таныг хүлээж байх болно. Хамтдаа нөхөрлөж, Бурханы хайранд өсөцгөөе!",
    date: "2025.11.29",
    author: "Мэдээллийн баг",
    category: "Нөхөрлөл",
    image: "https://lh3.googleusercontent.com/d/1UcUf8ZJnG6RkzkBQbX8N4ezfRjgkb8X0"
  },
  {
    id: '3',
    title: "Хүндэт зочидтой онцгой өдөр",
    excerpt: "Монголын Адвентист Чуулганы өмнөх удирдлагууд болох Yang Eui Sik болон Kim Young Sik нар Илчлэлт сүмд зочлон, бидний үйл ажиллагаатай танилцаж, үнэтэй зөвлөгөө хайрлалаа.",
    content: "2025 оны 11 сарын 08-ны Шаббат өдөр Илчлэлт сүмийн хувьд маш хүндтэй, баярт үйл явдлаар дүүрэн өдөр тохиолоо. Бидний үйл ажиллагааг дэмжиж, итгэлийн ахан дүүстэй маань уулзахаар Монголын Адвентист Чуулганы (МАЧ) өмнөх Ерөнхийлөгч Yang Eui Sik болон МАЧ-ын өмнөх Санхүүгийн захирал Kim Young Sik нар зочлон ирсэн юм.\n\n✨ Гэгээн сургаал ба Үнэтэй зөвлөгөө\nХүндэт зочид маань цуглааны үеэр сүмийн маань өнөөгийн хөгжил, залуусын идэвх зүтгэлийг хараад маш их бахархаж байгаагаа илэрхийлсэн. Yang Eui Sik ерөнхийлөгч итгэгчдэд хандан Бурханы хайр ба сүмийн эв нэгдлийн талаар гүнзгий сургаал айлдсан бол, Kim Young Sik захирал үйлчлэл болон хариуцлагын талаар үнэтэй зөвлөмжүүдийг өгөв.\n\n🤝 Урам зориг ба Ирээдүйн алсын хараа\nЭнэхүү уулзалт нь бидний хувьд зөвхөн нэг өдрийн цуглаан биш, харин ирээдүйн алсын хараагаа тодорхойлох, туршлагатай удирдагчдаас суралцах том боломж боллоо. Тэдний хэлсэн үг бүр бидний зүрх сэтгэлд урам зориг өгч, цаашдын үйл ажиллагаандаа илүү эрч хүчтэй оролцох сэдлийг төрүүлсэн билээ.\n\nБидэнд үнэтэй цагаа зориулж, сэтгэлийн дэм өгсөн эрхэм хүндэт зочиддоо нийт гишүүдийнхээ өмнөөс гүн талархал илэрхийлье. Илчлэлт сүм ийнхүү өсөж, хөгжиж, Бурханы ажилд улам бүр шамдан зүтгэсээр байна.",
    date: "2025.11.08",
    author: "Мэдээллийн баг",
    category: "Арга хэмжээ",
    image: "https://lh3.googleusercontent.com/d/14od8umGX-lk8HS5pWYk6hySdde5-hSrD"
  }
];

const InfoPage: React.FC<{ user: User | null; onAuthClick: () => void }> = ({ user, onAuthClick }) => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [commentsMap, setCommentsMap] = useState<Record<string, Comment[]>>(INITIAL_COMMENTS);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleShare = (post: BlogPost, platform: 'facebook' | 'x') => {
    const url = window.location.href;
    const text = `${post.title} - Илчлэлт Сүм`;
    let shareUrl = '';
    
    if (platform === 'facebook') {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    } else {
      // Updated to x.com
      shareUrl = `https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim() || !selectedPost) return;

    setIsSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      const comment: Comment = {
        id: Math.random().toString(36).substr(2, 9),
        author: user.name,
        text: newComment,
        date: new Date().toISOString().split('T')[0].replace(/-/g, '.')
      };

      setCommentsMap(prev => ({
        ...prev,
        [selectedPost.id]: [comment, ...(prev[selectedPost.id] || [])]
      }));
      
      setNewComment('');
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <header className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-700 text-xs font-bold uppercase tracking-wider mb-4">
            <Clock className="w-3 h-3" /> Сүүлийн үеийн мэдээ
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">Мэдээ мэдээлэл</h1>
          <p className="text-slate-500 text-lg mt-4 max-w-2xl">Манай сүмийн үйл ажиллагаатай холбоотой шинэ мэдээ мэдээллүүдийг эндээс цаг алдалгүй аваарай!</p>
        </header>

        {/* Featured Post (Always the latest one) */}
        <section className="mb-20">
          <div 
            className="group relative h-[400px] md:h-[550px] rounded-[48px] overflow-hidden shadow-2xl cursor-pointer"
            onClick={() => setSelectedPost(POSTS[0])}
          >
            <img 
              src={POSTS[0].image} 
              alt={POSTS[0].title} 
              className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 md:p-16 text-white max-w-3xl">
              <span className="bg-teal-500 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 inline-block">{POSTS[0].category}</span>
              <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight group-hover:text-teal-300 transition-colors">{POSTS[0].title}</h2>
              <div className="flex items-center gap-6 text-sm md:text-base font-medium text-slate-300">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-teal-400" />
                  {POSTS[0].date}
                </div>
                <div className="flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-teal-400" />
                  {POSTS[0].author}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {POSTS.slice(1).map((post) => (
            <article 
              key={post.id} 
              className="group bg-white rounded-[40px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer"
              onClick={() => setSelectedPost(post)}
            >
              <div className="h-64 overflow-hidden relative">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute top-6 left-6">
                   <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-teal-800 shadow-lg">{post.category}</span>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-4 text-xs font-bold text-slate-400 mb-4">
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {post.date}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span className="flex items-center gap-1.5"><UserIcon className="w-4 h-4" /> {post.author}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 line-clamp-2 group-hover:text-teal-700 transition-colors">{post.title}</h3>
                <p className="text-slate-500 mb-6 line-clamp-3 leading-relaxed">{post.excerpt}</p>
                <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                   <span className="inline-flex items-center gap-2 text-teal-700 font-bold group-hover:gap-4 transition-all">
                     Унших <ArrowRight className="w-5 h-5" />
                   </span>
                   <div className="flex gap-4">
                     <button 
                        onClick={(e) => { e.stopPropagation(); handleShare(post, 'facebook'); }}
                        className="text-slate-300 hover:text-blue-600 transition-colors"
                        title="Facebook-т хуваалцах"
                      >
                       <Facebook className="w-5 h-5" />
                     </button>
                     <button 
                        onClick={(e) => { e.stopPropagation(); handleShare(post, 'x'); }}
                        className="text-slate-300 hover:text-slate-900 transition-colors"
                        title="X (Twitter)-т хуваалцах"
                      >
                       <XIcon className="w-4 h-4" />
                     </button>
                   </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Blog Detail Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setSelectedPost(null)}></div>
          <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[48px] overflow-hidden shadow-2xl animate-in zoom-in duration-300 flex flex-col">
            <button 
              onClick={() => setSelectedPost(null)}
              className="absolute top-8 right-8 z-10 p-2 bg-slate-900/10 hover:bg-slate-900/20 text-slate-800 rounded-full backdrop-blur-md transition-all"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="overflow-y-auto">
              <div className="h-[300px] md:h-[450px] relative">
                <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
              </div>
              
              <div className="px-8 md:px-20 py-12 md:py-16">
                <div className="flex flex-wrap items-center gap-4 mb-8">
                  <span className="bg-teal-700 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">{selectedPost.category}</span>
                  <div className="flex items-center gap-2 text-slate-400 font-medium">
                    <Calendar className="w-5 h-5" /> {selectedPost.date}
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 font-medium">
                    <UserIcon className="w-5 h-5" /> {selectedPost.author}
                  </div>
                </div>
                
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-10 leading-tight">{selectedPost.title}</h2>
                
                <div className="prose prose-lg max-w-none text-slate-600 leading-[1.8] space-y-6 text-lg md:text-xl border-b border-slate-100 pb-16">
                  <p className="font-bold text-slate-800 italic border-l-4 border-teal-500 pl-6 py-2 bg-teal-50/30 rounded-r-2xl whitespace-pre-line">
                    {selectedPost.excerpt}
                  </p>
                  <div className="whitespace-pre-line">
                    {selectedPost.content}
                  </div>
                </div>

                {/* Social Share in Modal */}
                <div className="mt-12 flex flex-wrap items-center gap-6">
                  <p className="font-bold text-slate-900 uppercase tracking-widest text-xs">Мэдээг хуваалцах:</p>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => handleShare(selectedPost, 'facebook')}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-700 rounded-2xl font-bold hover:bg-blue-100 transition-all"
                    >
                      <Facebook className="w-5 h-5" /> Facebook
                    </button>
                    <button 
                      onClick={() => handleShare(selectedPost, 'x')}
                      className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-900 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                    >
                      <XIcon className="w-5 h-5" /> X (Twitter)
                    </button>
                  </div>
                </div>

                {/* Comments Section */}
                <div className="mt-20">
                  <div className="flex items-center gap-3 mb-10">
                    <MessageSquare className="w-8 h-8 text-teal-600" />
                    <h3 className="text-3xl font-black text-slate-900">Сэтгэгдэл</h3>
                    <span className="bg-slate-100 px-3 py-1 rounded-full text-sm font-bold text-slate-600">
                      {(commentsMap[selectedPost.id] || []).length}
                    </span>
                  </div>

                  {/* Comment Form */}
                  <div className="mb-12">
                    {user ? (
                      <form onSubmit={handleAddComment} className="space-y-4">
                        <textarea 
                          required
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Таны бодол..."
                          className="w-full p-6 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-2 focus:ring-teal-500 outline-none font-medium min-h-[120px]"
                        />
                        <button 
                          type="submit" 
                          disabled={isSubmitting}
                          className="flex items-center gap-2 px-8 py-4 bg-teal-700 text-white rounded-2xl font-bold hover:bg-teal-800 transition-all shadow-lg shadow-teal-700/20 disabled:opacity-50"
                        >
                          {isSubmitting ? 'Илгээж байна...' : <><Send className="w-5 h-5" /> Илгээх</>}
                        </button>
                      </form>
                    ) : (
                      <div className="p-10 bg-slate-50 border border-dashed border-slate-200 rounded-[32px] text-center">
                        <p className="text-slate-500 font-medium mb-6">Сэтгэгдэл бичихийн тулд системд нэвтэрнэ үү.</p>
                        <button 
                          onClick={onAuthClick}
                          className="inline-flex items-center gap-2 px-8 py-4 bg-white text-teal-700 border border-teal-100 rounded-2xl font-bold hover:bg-teal-50 transition-all shadow-sm"
                        >
                          <LogIn className="w-5 h-5" /> Нэвтрэх / Бүртгүүлэх
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Comments List */}
                  <div className="space-y-8">
                    {(commentsMap[selectedPost.id] || []).length > 0 ? (
                      (commentsMap[selectedPost.id] || []).map(comment => (
                        <div key={comment.id} className="flex gap-4 md:gap-6 animate-in slide-in-from-bottom duration-500">
                          <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold shrink-0">
                            {comment.author[0]}
                          </div>
                          <div className="flex-grow">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-bold text-slate-900">{comment.author}</h4>
                              <span className="text-xs font-bold text-slate-400">{comment.date}</span>
                            </div>
                            <p className="text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-3xl rounded-tl-none border border-slate-50">
                              {comment.text}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-400 text-center italic py-10">Анхны сэтгэгдлийг та бичэйрэй...</p>
                    )}
                  </div>
                </div>

                <div className="mt-16 pt-10 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                      <UserIcon className="w-6 h-6 text-slate-400" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{selectedPost.author}</p>
                      <p className="text-sm text-slate-500">Илчлэлт Сүм</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoPage;
