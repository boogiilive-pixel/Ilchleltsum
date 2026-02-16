
import React, { useState } from 'react';
import { Calendar, User, ArrowRight, X, Clock, Share2, MessageSquare } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  category: string;
  image: string;
}

// POSTS are ordered by date descending (latest first)
// Top 3 posts are after August 2025 as requested
const POSTS: BlogPost[] = [
  {
    id: '4',
    title: "Хосуудад зориулсан Хайрын баярын хөтөлбөр",
    excerpt: "2026 оны 02 сарын 14-ний өдөр Илчлэлт сүм хосуудад зориулсан онцгой, утга учиртай арга хэмжээг зохион байгуулагдлаа.",
    content: "2026 оны 02 сарын 14-ний өдөр Илчлэлт сүм хосуудад зориулсан онцгой, утга учиртай арга хэмжээг зохион байгуулагдлаа. Энэхүү үйл ажиллагаанд 8 хос буюу 16 хүн оролцож, хайраа сэргээх, харилцаагаа бэхжүүлэх таван цагийг хамтдаа өнгөрүүлэв.\n\n💖 Хайрын таван хэл – Харилцааг сэргээх түлхүүр\nАрга хэмжээний гол онцлог хэсэг нь гэр бүл судлаач Пүрэвдулам-ын орсон сургалт байлаа. Тэрээр Хайрын таван хэл сэдвээр сургалт орж, хосуудад хайраа илэрхийлэх өөр өөр хэлбэрүүдийг таних, ханийнхаа хэрэгцээг ойлгох, гомдол үл ойлголцлыг багасгах, сэтгэл зүйн ойр дотно байдлыг нэмэгдүүлэх зэрэг бодит, хэрэгжүүлэх боломжтой зөвлөгөөнүүдийг өгсөн юм.\n\n🍽 Хүндэт зоог ба хамтын бүтээл\n5 цагийн турш үргэлжилсэн уг арга хэмжээнд хүндэт зоог, хамтдаа зураг зурж бүтээл хийх, хөгжөөнт тоглоом, дурсамжит гэрэл зураг авах хэсгүүд багтсан. Хосууд хамтдаа нэг зураг бүтээхдээ зүгээр нэг будгаар зурсангүй — тэд харилцаагаа дахин зурж, ирээдүйнхээ өнгийг тодруулсан билээ.\n\n🤝 Нээлттэй, халуун дулаан уур амьсгал\nЭнэ удаагийн арга хэмжээнд зөвхөн сүмийн гишүүд бус, шинэ зочид оролцсон нь илүү онцгой байв. Инээмсэглэл, талархал, нулимстай тэврэлтүүд энэ өдрийн үнэ цэнийг илэрхийлж байлаа. Хайр бол мэдрэмж төдийгүй суралцаж, хөгжүүлж болдог ур чадвар юм. Илчлэлт сүм хосуудынхаа харилцааг хамгаалж, сэргээж, илүү бат бөх болгохын төлөө ийнхүү хамтдаа алхсаар байна.",
    date: "2026.02.14",
    author: "Мэдээллийн баг",
    category: "Арга хэмжээ",
    image: "https://lh3.googleusercontent.com/d/1_yedcVfxVzQuAxD8mNQyHzTGIOPprD3R"
  },
  {
    id: '5',
    title: "Христмасын баяр – Хүүхдүүдийн инээмсэглэлээр дүүрэн өдөр",
    excerpt: "2025 оны 12 сарын 25-ны өдөр Христмасын баярыг тохиолдуулан ХУД-ийн 8-р хорооны 35 хүүхдийг баярлуулсан утга учиртай үйл ажиллагаа зохион байгуулагдлаа.",
    content: "2025 оны 12 сарын 25-ны өдөр Христмасын баярыг тохиолдуулан ХУД-ийн 8-р хорооны 35 хүүхдийг баярлуулсан утга учиртай үйл ажиллагаа зохион байгуулагдлаа.\n\nЭнэ өдөр зүгээр нэг баяр биш, харин хуваалцах хайр, халуун дулаан уур амьсгалын өдөр байв.\n\n🎶 Магтан дуу – Зүрхнээс зүрх рүү\nХүүхдүүдэд Христмасын магтан дуу зааж, хамтдаа дуулсан мөчүүд онцгой байлаа. Бяцхан хоолойнууд нэгдэн эгшиглэхэд танхим дүүрэн баярын уур амьсгал бүрэлдэж, хүүхэд бүрийн нүдэнд гэрэл асаав.\n\n🎲 Хөгжөөнт тоглоом – Инээд хөөрөөр дүүрэн цаг\nАрга хэмжээний үеэр:\n• Хөгжөөнт багийн тоглоомууд\n• Асуулт хариултын тэмцээн\n• Багаар хамтран оролцох идэвхжүүлэх үйл ажиллагаанууд\nзэрэг олон сонирхолтой хөтөлбөрүүд явагдаж, хүүхдүүд инээж, баясаж, идэвхтэй оролцов.\n\n🎁 Хүүхэд бүрд бэлэг\nӨдрийн төгсгөлд хүүхэд бүрд бэлэг гардуулж, тэдний баяр хөөрийг улам нэмэгдүүлэв. Жижигхэн гартаа бэлгээ атгасан хүүхдүүдийн инээмсэглэл энэ өдрийн хамгийн үнэ цэнтэй шагнал байлаа.\n\nХристмас бол зөвхөн баярын өдөр биш, харин өгөх, хайрлах, халамжлахын утгыг сануулах өдөр юм. Энэхүү үйл ажиллагаагаар дамжуулан олон хүүхдийн зүрхэнд дулаан дурсамж үлдэж чадсанд бид талархалтай байна.\n\n🎄 Ирэх жилүүдэд ч илүү олон хүүхдэд баяр бэлэглэх үйлс үргэлжилсээр байх болтугай.",
    date: "2025.12.25",
    author: "Мэдээллийн баг",
    category: "Үйл ажиллагаа",
    image: "https://lh3.googleusercontent.com/d/1iH7zOsozqk8I6Mm8Sw4cf4eJV68mIjkT"
  },
  {
    id: '1',
    title: "2025 оны Намрын Залуучуудын Чуулга уулзалт",
    excerpt: "Байгалийн сайханд залуучууд цуглаж, нөхөрлөл болон сүнслэг өсөлтөөр дүүрэн цагийг өнгөрүүллээ.",
    content: "Илчлэлт сүмийн жил бүр уламжлал болгон зохион байгуулдаг залуучуудын чуулга уулзалт энэ жил маш онцгой болж өнгөрлөө. Нийт 50 гаруй залуучууд оролцож, амьдралын зорилго, итгэл найдвар болон ирээдүйн талаарх сонирхолтой хэлэлцүүлэг өрнүүлэв. Мөн спортын тэмцээн, магтан хүндэтгэлийн үдэш зэрэг олон төрлийн хөтөлбөр багтсан юм. Оролцсон бүх залуучууддаа баярлалаа!",
    date: "2025.10.15",
    author: "Мэдээллийн баг",
    category: "Үйл ажиллагаа",
    image: "https://lh3.googleusercontent.com/d/1uuV-NXIdLfgFXIqbOmaY6Au2nsCIA-Yg"
  },
  {
    id: '2',
    title: "Шинэ Библи судлалын хичээлүүд эхэллээ",
    excerpt: "Бурханы үгийг илүү гүнзгийрүүлэн судлахыг хүссэн хэн бүхэнд нээлттэй онлайн болон танхимын сургалтууд шинээр бүртгэж байна.",
    content: "Бид итгэгчдийнхээ сүнслэг суурийг бэхжүүлэх зорилгоор 'Библийн гүн рүү' нэртэй цуврал хичээлийг эхлүүлж байна. Энэхүү сургалт нь Лхагва гараг бүр онлайн хэлбэрээр явагдах бөгөөд сургаал номлолын утга учрыг тайлбарлахад чиглэгдэнэ. Бүртгэлийг 'Үйл ажиллагаа' хэсгээс хийх боломжтой.",
    date: "2024.03.10",
    author: "Сургалтын хэлтэс",
    category: "Сургалт",
    image: "https://lh3.googleusercontent.com/d/1gYlQPTDDuE3?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: '3',
    title: "Нийгмийн сайн үйлсийн аян: Хайр түгээе",
    excerpt: "Илчлэлт сүмийн хамт олон зорилтот бүлгийн өрхүүдэд тусламж үзүүлж, халуун сэтгэлийн бэлэг барилаа.",
    content: "Бид нийгэмдээ гэрэл болох зорилгынхоо хүрээнд энэ сард 10 өрхөд хоол хүнс болон ахуйн хэрэглээний тусламж үзүүллээ. Энэхүү үйл ажиллагаанд хандив өргөсөн болон цаг заваа зориулан тусалсан бүх хүмүүстээ маш их баярлалаа. Бидний хайр үйлсээр дамжин Бурханы хайр бусдад хүрч байна.",
    date: "2024.03.05",
    author: "Халамжийн баг",
    category: "Сайн үйлс",
    image: "https://lh3.googleusercontent.com/d/14od8umGX-lk8HS5pWYk6hySdde5-hSrD"
  }
];

const InfoPage: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <header className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-700 text-xs font-bold uppercase tracking-wider mb-4">
            <Clock className="w-3 h-3" /> Сүүлийн үеийн мэдээ
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">Мэдээ мэдээлэл</h1>
          <p className="text-slate-500 text-lg mt-4 max-w-2xl">Илчлэлт сүмийн амьдрал, шинэ сонин мэдээллүүдийг эндээс цаг алдалгүй аваарай.</p>
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
                  <User className="w-5 h-5 text-teal-400" />
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
                  <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {post.author}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 line-clamp-2 group-hover:text-teal-700 transition-colors">{post.title}</h3>
                <p className="text-slate-500 mb-6 line-clamp-3 leading-relaxed">{post.excerpt}</p>
                <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                   <span className="inline-flex items-center gap-2 text-teal-700 font-bold group-hover:gap-4 transition-all">
                     Унших <ArrowRight className="w-5 h-5" />
                   </span>
                   <div className="flex gap-3 text-slate-300">
                     <Share2 className="w-5 h-5 hover:text-teal-500 transition-colors" />
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
                    <User className="w-5 h-5" /> {selectedPost.author}
                  </div>
                </div>
                
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-10 leading-tight">{selectedPost.title}</h2>
                
                <div className="prose prose-lg max-w-none text-slate-600 leading-[1.8] space-y-6 text-lg md:text-xl">
                  <p className="font-bold text-slate-800 italic border-l-4 border-teal-500 pl-6 py-2 bg-teal-50/30 rounded-r-2xl whitespace-pre-line">
                    {selectedPost.excerpt}
                  </p>
                  <div className="whitespace-pre-line">
                    {selectedPost.content}
                  </div>
                </div>

                <div className="mt-16 pt-10 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-slate-400" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{selectedPost.author}</p>
                      <p className="text-sm text-slate-500">Илчлэлт Сүм</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button className="flex items-center gap-2 px-6 py-3 bg-slate-50 rounded-2xl font-bold text-slate-600 hover:bg-slate-100 transition-all">
                      <Share2 className="w-5 h-5" /> Хуваалцах
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-teal-700 text-white rounded-2xl font-bold hover:bg-teal-800 transition-all">
                      <MessageSquare className="w-5 h-5" /> Сэтгэгдэл
                    </button>
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
