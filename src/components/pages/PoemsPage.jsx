import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Feather, ArrowLeft, Quote, ChevronLeft, BookOpen, ExternalLink, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const PoemsPage = () => {
  const [poems, setPoems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPoem, setSelectedPoem] = useState(null);

  // جلب البيانات من الـ API الخاص بك
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchPoems = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/showPoems');
        const data = response.data.message || [];
        setPoems(data);
        // عرض أول قصيدة تلقائياً عند التحميل
        if (data.length > 0) setSelectedPoem(data[0]);
      } catch (error) {
        console.error("Error fetching poems:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPoems();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
          <p className="text-cyan-500 font-serif animate-pulse">جاري فتح الديوان...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white pt-28 pb-20 overflow-hidden" dir="rtl">
      {/* تأثيرات الخلفية الضوئية */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* زر العودة للرئيسية */}
        <Link to="/" className="group inline-flex items-center gap-3 text-cyan-500/60 hover:text-cyan-400 mb-16 transition-all font-bold">
          <div className="p-2 rounded-full border border-cyan-500/20 group-hover:border-cyan-500/50 group-hover:translate-x-1 transition-all">
            <ArrowLeft size={18} />
          </div>
          العودة للرئيسية
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* الجانب الأيمن: الفهرس التفاعلي */}
          <aside className="lg:col-span-4 lg:border-l border-white/5 pl-6 order-2 lg:order-1">
            <div className="sticky top-32">
              <div className="flex items-center gap-3 mb-8 text-cyan-500">
                <BookOpen size={24} />
                <h2 className="text-2xl font-black tracking-widest font-serif">قائمة القصائد</h2>
              </div>
              
              <div className="space-y-3 h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {poems.map((poem) => (
                  <motion.button
                    key={poem.id}
                    onClick={() => {
                      setSelectedPoem(poem);
                      window.scrollTo({ top: 0, behavior: 'smooth' }); // للتمرير للأعلى في الجوال عند الاختيار
                    }}
                    whileHover={{ x: 5 }}
                    className={`w-full text-right p-5 rounded-2xl transition-all duration-500 flex items-center justify-between group ${
                      selectedPoem?.id === poem.id 
                      ? 'bg-cyan-500/10 border-l-4 border-cyan-500 text-white shadow-lg shadow-cyan-500/5' 
                      : 'hover:bg-white/5 text-gray-500 border-l-4 border-transparent'
                    }`}
                  >
                    <span className={`text-lg font-bold font-serif transition-colors ${selectedPoem?.id === poem.id ? 'text-cyan-400' : 'group-hover:text-gray-300'}`}>
                      {poem.poem_title}
                    </span>
                    <ChevronLeft size={18} className={`transition-all ${selectedPoem?.id === poem.id ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'}`} />
                  </motion.button>
                ))}
              </div>
            </div>
          </aside>

          {/* الجانب الأيسر: عرض محتوى القصيدة */}
          <main className="lg:col-span-8 order-1 lg:order-2">
            <AnimatePresence mode="wait">
              {selectedPoem && (
                <motion.div
                  key={selectedPoem.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="bg-white/[0.01] border border-white/5 p-8 md:p-20 rounded-[4rem] relative overflow-hidden backdrop-blur-sm"
                >
                  {/* زخرفة خلفية */}
                  <Quote className="absolute top-10 right-10 text-white/[0.02]" size={150} />
                  
                  <div className="flex flex-col items-center text-center relative z-10">
                    
                    {/* الصورة الدائرية الاحترافية */}
                    <div className="relative mb-12">
                      <div className="absolute inset-0 bg-cyan-500/20 blur-2xl rounded-full animate-pulse" />
                      <motion.div 
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="w-32 h-32 md:w-48 md:h-48 rounded-full p-2 border-2 border-cyan-500/30 relative z-10 bg-[#020617]"
                      >
                        <div className="w-full h-full rounded-full overflow-hidden border border-white/10">
                          <img 
                            src={`http://127.0.0.1:8000/storage/${selectedPoem.image}`} 
                            alt={selectedPoem.poem_title}
                            className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110"
                            onError={(e) => { e.target.src = "https://via.placeholder.com/300?text=Poetry"; }}
                          />
                        </div>
                      </motion.div>
                    </div>

                    <motion.h1 
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      className="text-4xl md:text-6xl font-black mb-12 text-white font-serif leading-tight"
                    >
                      {selectedPoem.poem_title}
                    </motion.h1>

                    {/* محتوى القصيدة */}
                    <div className="space-y-8 max-w-3xl mx-auto mb-16">
                      {selectedPoem.poem_content.split('\r\n').map((line, i) => (
                        <p key={i} className="text-2xl md:text-3xl font-serif text-slate-300 leading-relaxed hover:text-white transition-colors cursor-default">
                          {line}
                        </p>
                      ))}
                    </div>

                    {/* عرض الرابط الخارجي (poem_link) */}
                    {selectedPoem.poem_link && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="pt-10 border-t border-white/5 w-full flex justify-center"
                      >
                        <a 
                          href={selectedPoem.poem_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex items-center gap-3 px-10 py-4 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500 hover:text-[#020617] transition-all duration-500 shadow-xl shadow-cyan-500/5"
                        >
                          <span className="font-bold text-lg">زيارة المصدر الأصلي</span>
                          <ExternalLink size={20} className="group-hover:rotate-45 transition-transform" />
                        </a>
                      </motion.div>
                    )}

                    {/* فاصل جمالي */}
                    <div className="mt-16 flex items-center gap-6 text-cyan-500/20">
                      <div className="h-[1px] w-24 bg-current" />
                      <Sparkles size={20} />
                      <div className="h-[1px] w-24 bg-current" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* استايل إضافي للسكرول بار الجانبي */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(6, 182, 212, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(6, 182, 212, 0.5);
        }
      `}} />
    </div>
  );
};

export default PoemsPage;