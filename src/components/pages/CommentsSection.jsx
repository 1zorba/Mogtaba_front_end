import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, User, Send, Clock } from 'lucide-react';
import axios from 'axios';
import { getComments, postComment } from '../api'; // تأكد من المسار الصحيح
const CommentsSection = () => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ user_name: '', content: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // في أعلى ملف CommentsSection.jsx


// ... داخل المكون
const fetchComments = async () => {
    try {
        const data = await getComments();
        setComments(data);
    } catch (err) { 
        console.error("فشل الجلب"); 
    }
};

const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
        // نستخدم الدالة المستوردة هنا
        await postComment(newComment);
        setNewComment({ user_name: '', content: '' });
        await fetchComments();
    } catch (err) {
        alert("حدث خطأ في الاتصال بالسيرفر");
    } finally {
        setIsSubmitting(false);
    }
};

  return (
    <section className="py-20 px-4 bg-[#020617]" dir="rtl">
      <div className="max-w-3xl mx-auto">
        
        {/* العنوان */}
        <div className="flex items-center gap-4 mb-12">
          <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20">
            <MessageSquare className="text-cyan-400" size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white">آراء ومقترحات</h2>
            <p className="text-slate-500 text-sm font-mono">COMMENTS_FEED // REALT_IME</p>
          </div>
        </div>

        {/* نموذج الإضافة */}
        <form onSubmit={handleSubmit} className="mb-16 p-8 bg-slate-900/40 border border-slate-800 rounded-[2.5rem] backdrop-blur-xl shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-30" />
           
           <div className="space-y-5">
             <div className="relative">
                <User className="absolute right-4 top-4 text-slate-500" size={18} />
                <input 
                  type="text" 
                  placeholder="اسمك المستعار"
                  value={newComment.user_name}
                  onChange={(e) => setNewComment({...newComment, user_name: e.target.value})}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pr-12 pl-4 py-4 text-white outline-none focus:border-cyan-500/50 transition-all shadow-inner"
                  required
                />
             </div>

             <textarea 
               placeholder="ماذا يدور في ذهنك؟"
               value={newComment.content}
               onChange={(e) => setNewComment({...newComment, content: e.target.value})}
               className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-white outline-none focus:border-cyan-500/50 transition-all resize-none shadow-inner"
               rows="4"
               required
             />

             <motion.button 
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               disabled={isSubmitting}
               className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-cyan-500/10 disabled:opacity-50"
             >
               {isSubmitting ? "جاري النشر..." : "نشر التعليق"}
               <Send size={18} />
             </motion.button>
           </div>
        </form>

        {/* قائمة التعليقات */}
        <div className="space-y-8">
          <AnimatePresence>
            {comments.map((comment, index) => (
              <motion.div 
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
              >
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center text-cyan-400 font-bold shadow-lg">
                      {comment.user_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="w-0.5 h-full bg-gradient-to-b from-slate-800 to-transparent mt-2" />
                  </div>
                  
                  <div className="flex-1 pb-8">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-bold text-lg">{comment.user_name}</h4>
                      <div className="flex items-center gap-2 text-slate-500 text-xs font-mono">
                        <Clock size={12} />
                        {new Date(comment.created_at).toLocaleDateString('ar-EG')}
                      </div>
                    </div>
                    <p className="text-slate-400 leading-relaxed bg-white/5 p-5 rounded-3xl rounded-tr-none border border-white/5 group-hover:border-cyan-500/20 transition-colors">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};

export default CommentsSection;