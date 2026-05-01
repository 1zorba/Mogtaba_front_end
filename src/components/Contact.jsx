import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { getMyInfo, sendMessage } from './api'; // تأكد من إضافة sendMessage في ملف api.js
 const Contact = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // حالات النموذج (Status)
  const [status, setStatus] = useState({
    submitting: false,
    success: false,
    error: false
  });

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const result = await getMyInfo();
        setProfileData(result?.data || result);
      } catch (error) {
        console.error("Error fetching contact data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContactData();
  }, []);

  // دالة الإرسال إلى Laravel
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitting: true, success: false, error: false });
    
    const formData = new FormData(e.target);
    
    // تجهيز البيانات لتطابق قاعدة بيانات اللارافيل لديك
    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      contentMessage: formData.get('message'), // تحويل الاسم من message إلى contentMessage
    };

    try {
      const response = await sendMessage(payload);

      // التحقق من نجاح العملية (200 أو 201)
      if (response.status === 200 || response.status === 201) {
        setStatus({ submitting: false, success: true, error: false });
        e.target.reset(); // تفريغ النموذج بعد النجاح
      } else {
        setStatus({ submitting: false, success: false, error: true });
      }
    } catch (error) {
      console.error("خطأ أثناء الإرسال إلى السيرفر:", error);
      setStatus({ submitting: false, success: false, error: true });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { type: "spring", stiffness: 100 }
    }
  };

  if (loading) return null;

  const contactInfo = [
    { 
      icon: <Mail size={28} />, 
      title: "البريد الإلكتروني", 
      detail: profileData?.email || "mohamedelmojtabaatta@gmail.com", 
      link: `mailto:${profileData?.email}`,
      color: "from-blue-500/20 to-cyan-500/20", 
      border: "group-hover:border-blue-500/50" 
    },
    { 
      icon: <Phone size={28} />, 
      title: "واتساب / هاتف", 
      detail: profileData?.profile?.phone || "+967 xxx xxx xxx", 
      link: `https://wa.me/${profileData?.profile?.phone}`,
      color: "from-green-500/20 to-emerald-500/20", 
      border: "group-hover:border-emerald-500/50" 
    },
    { 
      icon: <MapPin size={28} />, 
      title: "المقر الحالي", 
      detail: profileData?.profile?.address || "السودان", 
      link: "#",
      color: "from-red-500/20 to-orange-500/20", 
      border: "group-hover:border-red-500/50" 
    },
  ];

  return (
    <section id="contact" className="py-24 bg-[#020617] relative overflow-hidden" dir="rtl">
      {/* الخلفية السينمائية */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
          <motion.span animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="text-cyan-400 font-mono tracking-[0.3em] uppercase text-xs mb-3 block">
            Available for Projects
          </motion.span>
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tighter">
            لنصنع شيئاً <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">عظيماً</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-lg leading-relaxed">
            لديك محل تريد الترويج أو الإعلان له، أنا هنا لتحقيق ذلك
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto items-center">
          
          {/* كروت التواصل */}
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-6">
            {contactInfo.map((item, index) => (
              <motion.a key={index} href={item.link} target={item.link.startsWith('http') ? "_blank" : "_self"} rel="noopener noreferrer" variants={itemVariants} whileHover={{ scale: 1.03, x: -10 }} className={`group flex items-center gap-6 p-6 bg-slate-900/40 border border-slate-800 rounded-[2rem] backdrop-blur-xl transition-all cursor-pointer flex-row-reverse text-right ${item.border}`}>
                <div className={`bg-gradient-to-br ${item.color} p-4 rounded-2xl text-white shadow-lg group-hover:rotate-12 transition-transform`}>
                  {item.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-slate-500 text-sm font-mono mb-1">{item.title}</h3>
                  <p className="text-white font-bold text-xl tracking-tight">{item.detail}</p>
                </div>
              </motion.a>
            ))}
          </motion.div>

          {/* نموذج التواصل المربوط باللارافيل */}
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-[2.5rem] blur opacity-20 transition duration-1000"></div>
            
            <form onSubmit={handleSubmit} className="relative space-y-5 p-10 bg-slate-950/80 border border-slate-800 rounded-[2.5rem] backdrop-blur-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input 
                  type="text" 
                  name="name" 
                  placeholder="الاسم" 
                  required
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:border-cyan-500 outline-none transition-all text-right shadow-inner"
                />
                <input 
                  type="email" 
                  name="email" 
                  placeholder="الإيميل" 
                  required
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:border-cyan-500 outline-none transition-all text-right shadow-inner"
                />
              </div>

              <textarea 
                name="message" 
                placeholder="كيف يمكنني مساعدتك؟" 
                rows="5"
                required
                className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-6 py-4 text-white focus:border-cyan-500 outline-none transition-all text-right resize-none shadow-inner"
              ></textarea>

              <motion.button 
                type="submit"
                disabled={status.submitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all uppercase disabled:opacity-50"
              >
                {status.submitting ? 'جاري الإرسال...' : 'إرسال الرسالة الآن'} 
                <Send size={20} />
              </motion.button>

              {/* رسائل الحالة */}
              {status.success && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-2 text-emerald-400 font-bold mt-4 text-sm">
                  <CheckCircle2 size={18} /> تم ارسال الرسالة, سيتم الرد عليك قريباً
                </motion.div>
              )}
              {status.error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-2 text-red-400 font-bold mt-4 text-sm">
                  <AlertCircle size={18} /> حدث خطأ في الاتصال بالسيرفر، حاول مجدداً.
                </motion.div>
              )}
            </form>

            <motion.div animate={{ y: [0, -15, 0], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -bottom-8 -right-8 text-cyan-400/30">
              <Sparkles size={80} />
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Contact;