import React, { useState, useEffect } from 'react';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  gender: 'male' | 'female';
}

const MALE_ICON = "https://lh3.googleusercontent.com/d/1xYh8Ldp7OBXFeKMbO9ixrblbJxw93Eoh";
const FEMALE_ICON = "https://lh3.googleusercontent.com/d/1Xk5_OGjhv8L4R_92cd-a_W1GNZFZ3rrH";

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Д. Даваа",
    role: "Сүмийн гишүүн",
    content: "Танд ямар нэг зүйлд санаа зовнил байна уу? Тэгвэл зөв газраа, зөв цагтаа та миний зурвасыг уншиж байна гэсэн үг. Та үргэлжлүүлэн судлаад үзэхийг зөвлөе. Сургаалт үгс 4:7 МЭРГЭН УХААНЫГ ОЛ ОЛСОН БҮХНЭЭСЭЭ УХААРАН ОЙЛГОХУЙГ ОЛ ЭНЭ НЬ МЭРГЭН УХААНЫ ЭХЛЭЛ.",
    gender: 'male'
  },
  {
    id: 2,
    name: "О. Саруул",
    role: "Залуучуудын багийн гишүүн",
    content: "Эндхийн нөхөрлөл маш халуун дулаан. Залуучуудын үйл ажиллагаагаар дамжуулан би өөрийгөө хөгжүүлж, Бурханд илүү ойр болж байна.",
    gender: 'female'
  },
  {
    id: 3,
    name: "Н. Цогт",
    role: "Сүмийн гишүүн",
    content: "Сүм маань ВЭБ сайттай болсон талархууштай сайхан үйл явдал болсон байна. Агуу Бурханы сайн мэдээ сайтаар маань улам олон түмэнд түгэн дэлгэрэх болтгуай. Амен.",
    gender: 'male'
  },
  {
    id: 4,
    name: "М. Золоо",
    role: "Магтаалын багийн гишүүн",
    content: "Магтан дууны цаг бол миний долоо хоногийн хамгийн дуртай мөч. Тэндээс би эрч хүч авч, ирэх өдрүүдээ баяр хөөртэй угтдаг.",
    gender: 'female'
  },
  {
    id: 5,
    name: "Б. Энхжаргал",
    role: "Сүмийн гишүүн",
    content: "Би олон жил сүмд явсан. Тиймээс бусад хүмүүсийг ч сүмд явж Бурханыг таньж мэдээсэй гэж хүсдэг. Гэвч сүүлийн үед Монголд төдийгүй дэлхий дахинд буруу сургаал заадаг олон христийн урсгал шашин гарч ирж байгаа нь хүмүүсийг төөрөгдүүлж аль нь үнэн бэ гэдгийг харахад их төвөгтэй болж байна. Зөвхөн Библи дээр суурилсан сургаалтай, Есүсийн дахин ирэлтийг хүлээж буй ах дүүс нартай нэгдэж Библийн үнэнг шимтэн суралцахыг хүсвэл манай сүмд хандаарай. Бурхан таныг ивээг.",
    gender: 'female'
  }
];

const TestimonialSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(interval);
  }, [activeIndex]);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <section className="py-24 bg-gradient-to-b from-white to-teal-50/30 overflow-hidden relative">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 border-[40px] border-teal-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 border-[60px] border-teal-500 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-100 text-teal-700 text-xs font-black uppercase tracking-widest mb-4">
            <Star className="w-3.5 h-3.5 fill-current" /> Итгэлийн Гэрчлэл
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">Гишүүдийн <span className="text-teal-600">Гэрчлэлүүд</span></h2>
          <div className="w-24 h-1.5 bg-teal-500 mx-auto rounded-full"></div>
        </div>

        <div className="max-w-4xl mx-auto relative px-4 md:px-12 mt-20">
          {/* Navigation Buttons */}
          <button 
            onClick={handlePrev}
            className="absolute left-[-20px] md:left-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-slate-400 hover:text-teal-600 hover:scale-110 transition-all z-20"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={handleNext}
            className="absolute right-[-20px] md:right-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-slate-400 hover:text-teal-600 hover:scale-110 transition-all z-20"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Testimonial Card */}
          <div className="relative min-h-[600px] md:min-h-[500px] flex items-center justify-center">
            {TESTIMONIALS.map((t, idx) => (
              <div 
                key={t.id}
                className={`absolute inset-0 transition-all duration-700 ease-in-out flex flex-col items-center justify-center ${
                  idx === activeIndex 
                    ? 'opacity-100 translate-y-0 scale-100' 
                    : 'opacity-0 translate-y-8 scale-95 pointer-events-none'
                }`}
              >
                <div className="bg-white p-10 md:p-16 rounded-[48px] shadow-[0_32px_64px_-16px_rgba(15,118,110,0.12)] border border-slate-50 relative max-w-3xl w-full text-center group">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className={`w-28 h-28 rounded-[36px] border-4 border-white shadow-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500 overflow-hidden ${
                      t.gender === 'female' ? 'bg-rose-50' : 'bg-blue-50'
                    }`}>
                      <img 
                        src={t.gender === 'female' ? FEMALE_ICON : MALE_ICON} 
                        alt={t.gender} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <Quote className="w-16 h-16 text-teal-500/10 absolute top-12 left-12" />
                  
                  <div className="mt-8">
                    <p className="text-xl md:text-2xl font-medium text-slate-700 italic leading-relaxed mb-10">
                      "{t.content}"
                    </p>
                    <div className="space-y-1">
                      <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{t.name}</h4>
                      <p className="text-teal-600 font-bold uppercase tracking-widest text-xs">{t.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Indicators */}
          <div className="flex justify-center gap-3 mt-12">
            {TESTIMONIALS.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  idx === activeIndex ? 'w-12 bg-teal-600' : 'w-2.5 bg-teal-200 hover:bg-teal-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;