import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { getMyInfo } from './api';
import DownloadCV from '/src/components/DownloadCV'; 

const Hero = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSocialMenuOpen, setIsSocialMenuOpen] = useState(false);
  const heroRef = useRef(null);

  // --- منطق الساعة الحية ---
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const secondsDegrees = (time.getSeconds() / 60) * 360;
  const minutesDegrees = ((time.getMinutes() + time.getSeconds() / 60) / 60) * 360;
  const hoursDegrees = ((time.getHours() % 12 + time.getMinutes() / 60) / 12) * 360;
  // -----------------------

 const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
 const baseurl= import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const loadHeroData = async () => {
      try {
        const result = await getMyInfo();
        setProfileData(result?.data || result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadHeroData();
  }, []);

  const getProfileImage = () => {
    return profileData?.profile?.profile_image 
      ? `${baseurl}/storage/${profileData.profile.profile_image}`
      : import.meta.env.VITE_API_BASE_URL;
  };

  const socialLinks = [
    { name: 'WhatsApp', href: `https://wa.me/${profileData?.profile?.phone || ''}`, color: '#25D366', svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> },
    { name: 'Instagram', href: profileData?.profile?.social_links2 || '#', color: '#E4405F', svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg> },
    { name: 'Facebook', href: profileData?.profile?.social_links|| '#', color: '#1877F2', svg: <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
   ];

  if (loading) return null;


 
  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center bg-[#020617] overflow-hidden py-16 px-6" dir="rtl">
      
      {/* الخلفية */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-600/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full animate-pulse-slow" />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* الجانب الأيمن: النصوص */}
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="text-right lg:col-span-7 flex flex-col items-start h-full">
             <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2.5 rounded-full mb-6 shadow-inner">
              <Icons.Terminal size={16} className="text-cyan-400" />
              <span className="text-cyan-400 font-mono text-xs uppercase tracking-widest">{profileData?.profile?.job_title}</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-white mb-8 leading-[1.0] tracking-tighter drop-shadow-lg">
              {profileData?.name?.split(' ')[0]} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-sm">
                {profileData?.name?.split(' ')[1] || 'منان'}
              </span>
            </h1>

            <p className="text-gray-300 text-xl md:text-2xl max-w-xl mb-12 leading-relaxed border-r-4 border-cyan-500 pr-6">
              {profileData?.profile?.bio}
            </p>

            <div className="flex flex-wrap items-center gap-6 mt-4">
              <div className="relative">
                <button 
                  onClick={() => setIsSocialMenuOpen(!isSocialMenuOpen)}
                  className="w-16 h-16 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10 transition-all z-50 relative shadow-2xl"
                >
                   <Icons.Share2 size={26} />
                </button>

                <AnimatePresence>
                  {isSocialMenuOpen && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: -90 }}
                      exit={{ opacity: 0, scale: 0.8, y: 10 }}
                      className="absolute bottom-full right-0 flex flex-row gap-4 bg-[#0f172a] p-4 rounded-3xl border border-white/20 shadow-[0_15px_40px_rgba(0,0,0,0.6)] z-[999] justify-center"
                    >
                      {socialLinks.map((link, i) => (
                        <a key={i} href={link.href} target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-xl flex items-center justify-center transition-all hover:scale-125" style={{ backgroundColor: `${link.color}15`, color: link.color }}>
                          {link.svg}
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="flex flex-col items-center opacity-40">
                <Icons.Book size={26} className="text-cyan-400" />
                <span className="text-[10px] mt-1.5 font-mono uppercase font-bold tracking-widest text-cyan-500">LIB</span>
              </motion.div>
            </div>
          </motion.div>

          {/* الجانب الأيسر: الصورة ومكون الساعة */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="lg:col-span-5 relative flex flex-col items-center gap-8 group">
            
            {/* مـكـون الـسـاعـة ( Spider Clock ) - تم إنزالها قليلاً */}
            <div className="absolute top-[10px] right-[-10px] flex items-center gap-3 z-30 group/spider">
              <div className="relative w-14 h-14 bg-slate-900/60 rounded-full border border-cyan-500/30 backdrop-blur-md flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover/spider:border-cyan-500/60 transition-colors">
                
                {/* جسم العنكبوت المركزي */}
                <div className="absolute w-3.5 h-4.5 bg-gradient-to-b from-slate-700 to-black rounded-full z-20 shadow-[0_0_8px_rgba(6,182,212,0.3)] border border-cyan-500/30" />
                <div className="absolute w-1.5 h-1.5 bg-slate-800 rounded-full top-4.5 z-20 border border-cyan-500/20" />

                {/* أرجل الساعة (العقارب) */}
                <motion.div 
                  className="absolute w-1.5 h-3.5 bg-white/60 rounded-full origin-bottom"
                  style={{ rotate: hoursDegrees, bottom: '50%', borderRadius: '40% 40% 0 0' }}
                />
                <motion.div 
                  className="absolute w-1 h-5.5 bg-cyan-400 rounded-full origin-bottom"
                  style={{ rotate: minutesDegrees, bottom: '50%', clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' }}
                />
                <motion.div 
                  className="absolute w-[2px] h-6.5 bg-red-500 origin-bottom shadow-[0_0_5px_red]"
                  style={{ rotate: secondsDegrees, bottom: '50%' }}
                />

                {/* زينة الأرجل الجانبية */}
                {[45, 135, 225, 315].map((ang) => (
                  <div key={ang} className="absolute w-[1px] h-3.5 bg-slate-700/30 origin-bottom" style={{ rotate: ang, bottom: '50%' }} />
                ))}
              </div>
       
            </div>
            
            {/* تأثيرات الهالة خلف الصورة */}
            <div className="absolute inset-[-15px] border-2 border-dashed border-cyan-500/20 rounded-full animate-spin-slow opacity-60 group-hover:border-cyan-500 group-hover:opacity-100 transition-all duration-700 pointer-events-none z-0" />
            <div className="absolute inset-[-30px] border border-blue-500/10 rounded-full animate-spin-slow-reverse opacity-40 group-hover:border-blue-500 group-hover:opacity-80 transition-all duration-700 pointer-events-none z-0" />
            <div className="absolute inset-0 bg-cyan-500/15 blur-[110px] rounded-full scale-75 animate-pulse group-hover:bg-cyan-500/30 transition-colors pointer-events-none z-0" />
            
            {/* حاوية الصورة */}
            <div className="relative w-72 h-72 md:w-[380px] md:h-[380px] lg:w-[480px] lg:h-[480px] aspect-square rounded-full border-4 border-white/10 group-hover:border-cyan-500/40 overflow-hidden shadow-[0_25px_100px_rgba(0,0,0,0.7)] group-hover:shadow-[0_25px_100px_rgba(6,182,212,0.4)] transition-all duration-700 hover:scale-105 z-10">
              <img src={getProfileImage()} alt="" className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-transform duration-1000 group-hover:scale-110" />
              
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-slate-950/70 backdrop-blur-md px-7 py-3 rounded-full border border-white/10 group-hover:border-cyan-500/30 text-center min-w-[200px] z-20">
                <span className="text-white font-bold text-sm tracking-widest uppercase">{profileData?.profile?.job_title}</span>
              </div>
            </div>
   <section className="relative min-h-screen flex items-center justify-center bg-[#0a0a0a] overflow-hidden">
      
      {/* محتوى الهيرو */}
      <div className="container mx-auto px-6 z-10 text-center">
        <h1 className="text-5xl md:text-7xl font-black text-white mb-6"><span className="text-amber-500">  get my CV </span>
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
          get my CV document,take your time
         </p>

        {/* استدعاء زر السيفي هنا */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <DownloadCV />
          
         
        </div>
      </div>

    </section>
            <Icons.Sparkles className="absolute top-[-20px] right-[-20px] text-cyan-500/20 -rotate-12 animate-pulse group-hover:text-cyan-500/60 transition-colors" size={60} />

            {profileData?.profile?.borrow && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="w-full max-w-[480px] flex flex-col items-center gap-2 p-6 bg-white/[0.01] border border-white/10 rounded-3xl relative backdrop-blur-sm group-hover:border-cyan-500/30 transition-colors shadow-inner z-10"
              >
                 <Icons.Quote className="absolute -top-3 -right-3 text-cyan-500/20 group-hover:text-cyan-500/60 transition-colors" size={30} />
                 <p className="text-gray-300 font-serif italic text-lg leading-relaxed text-center px-4">
                    "{profileData.profile.borrow}"
                 </p>
              </motion.div>
            )}
          </motion.div>

        </div>
      </div>
  
      <style>{`
        @keyframes pulse-slow { 0%, 100% { opacity: 0.8; scale: 1; } 50% { opacity: 0.5; scale: 0.95; } }
        .animate-pulse-slow { animation: pulse-slow 6s ease-in-out infinite; }
        
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes spin-slow-reverse { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        .animate-spin-slow { animation: spin-slow 15s linear infinite; }
        .animate-spin-slow-reverse { animation: spin-slow-reverse 20s linear infinite; }
      `}</style>
    </section>
  );
};

export default Hero;