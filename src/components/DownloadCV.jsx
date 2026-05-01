import React from 'react';
import { motion } from 'framer-motion';
import { Download, FileUser, Sparkles } from 'lucide-react';

const CinematicDownloadBtn = () => {
  return (
    <div className="flex justify-center items-center py-10">
      <motion.a
        href="https://drive.google.com/uc?export=download&id=1fCIUQePGy3guI6_j4ih1yIxamnx5l7Sz"
        target="_blank"
        rel="noreferrer"
        // أنيميشن الظهور لأول مرة
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        // أنيميشن الحوم (Hover) والتفاعل
        whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
        whileTap={{ scale: 0.95 }}
        className="group relative flex items-center gap-6 bg-slate-950 border border-slate-800 px-10 py-5 rounded-3xl overflow-hidden shadow-2xl"
      >
        {/* تأثير الـ Gradient المتحرك في الخلفية */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        {/* خط ضوئي (Beam) يمر بسرعة عند الحوم */}
        <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-[shine_1s_ease-in-out]" />

        {/* أيقونة السيفي مع تأثير "النبض" */}
        <div className="relative">
          <motion.div 
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -inset-2 bg-amber-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" 
          />
          <div className="relative bg-slate-900 p-3 rounded-2xl border border-slate-700 group-hover:border-amber-500/50 transition-colors">
            <FileUser className="text-amber-500" size={28} />
          </div>
        </div>

        {/* النصوص بتنسيق طباعة أنيق */}
        <div className="relative flex flex-col items-start">
          <span className="text-slate-400 text-[10px] uppercase tracking-[0.3em] font-bold mb-1">Portfolio 2026</span>
          <h3 className="text-white text-xl font-black tracking-tight group-hover:text-amber-400 transition-colors">
            Download Resume
          </h3>
        </div>

        {/* سهم التحميل مع حركة ذكية */}
        <motion.div 
          className="relative flex items-center justify-center w-10 h-10 rounded-full bg-amber-600 text-white"
          whileHover={{ y: 3 }}
        >
          <Download size={20} strokeWidth={3} />
          <Sparkles className="absolute -top-1 -right-1 text-amber-300 opacity-0 group-hover:opacity-100 animate-pulse" size={14} />
        </motion.div>

        {/* تأثير الحدود المضيئة السفلى */}
        <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-transparent via-amber-500 to-transparent group-hover:w-full transition-all duration-700" />
      </motion.a>

      {/* إضافة الـ Keyframe للخط الضوئي في ملف CSS الخاص بك أو Tailwind Config */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shine {
          100% { left: 125%; }
        }
      `}} />
    </div>
  );
};

export default CinematicDownloadBtn;