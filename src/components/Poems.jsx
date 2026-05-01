import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Feather, Quote, BookOpen } from 'lucide-react';
import axios from 'axios'; // تأكد من تثبيت axios

const Poems = () => {
  const [poems, setPoems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPoems = async () => {
      try {
        // استدعاء مباشر للرابط الذي أرسلته للتأكد من وصول البيانات
        const response = await axios.get('http://127.0.0.1:8000/api/showPoems');
        
        // التعديل الجوهري هنا: البيانات في الرابط الخاص بك داخل "message"
        if (response.data && response.data.message) {
          setPoems(response.data.message);
        }
      } catch (error) {
        console.error("خطأ في جلب البيانات:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPoems();
  }, []);

  if (loading) return <div className="text-center py-20 text-cyan-500">جاري تحميل القصائد...</div>;

  return (
    <section id="poems" className="py-24 bg-[#020617] text-white px-6 md:px-20" dir="rtl">
      <div className="max-w-6xl mx-auto">
        
        {/* رأس القسم */}
        <div className="text-center mb-16">
          <Feather className="mx-auto mb-4 text-cyan-500" size={40} />
          <h2 className="text-4xl md:text-6xl font-black mb-4">ركن القصائد</h2>
          <p className="text-gray-400 italic">"حيث تتنفس الحروف صمت الذاكرة"</p>
        </div>

        {/* عرض القصائد */}
        {poems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {poems.map((poem) => (
              <motion.div
                key={poem.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="bg-white/[0.03] border border-white/10 p-8 rounded-3xl hover:border-cyan-500/50 transition-all"
              >
                <Quote className="text-cyan-500/20 mb-4" size={40} />
                
                {/* استخدام اسم الحقل poem_title كما هو في الـ JSON لديك */}
                <h3 className="text-2xl font-bold text-cyan-400 mb-6 border-r-4 border-cyan-500 pr-4">
                  {poem.poem_title}
                </h3>

                {/* استخدام اسم الحقل poem_content كما هو في الـ JSON لديك */}
                <div className="space-y-4 mb-6">
                  {poem.poem_content?.split('\r\n').map((line, i) => (
                    <p key={i} className="text-lg text-gray-300 font-serif leading-relaxed">
                      {line}
                    </p>
                  ))}
                </div>

                {/* عرض الصورة إذا كانت موجودة */}
                {poem.image && (
                  <div className="mt-4 rounded-xl overflow-hidden h-40">
                    <img 
                      src={`http://127.0.0.1:8000/storage/${poem.image}`} 
                      className="w-full h-full object-cover opacity-60"
                      alt={poem.poem_title}
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-600 border border-dashed border-white/10 rounded-3xl">
             لا توجد بيانات لعرضها حالياً. تأكد من تشغيل السيرفر لارافل.
          </div>
        )}
      </div>
    </section>
  );
};

export default Poems;