import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Clock, 
  MessageSquare, 
  Trash2, 
  Inbox, 
  ShieldCheck, 
  ArrowUpRight,
  Sparkles,
  Search,
  Contact,
   
} from 'lucide-react';
import Swal from 'sweetalert2';

import { getContacts,deleteMessage } from '../api'; 

const ContactSection = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchMessages = async () => {
    try {
      const response = await getContacts();
      const data = response.data.message || response.data; 
      const sortedMessages = Array.isArray(data) 
        ? data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        : [];
      setMessages(sortedMessages);
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  const filteredMessages = messages.filter(msg => 
    msg.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    msg.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

   const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'delete message ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#e11d48',
            background: '#0f172a',
            color: '#fff',
            confirmButtonText: 'حذف'
        });
        if (result.isConfirmed) {
            try { await deleteMessage(id); fetchMessages(); } catch (error) { console.error(error); }
        }
    };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
        <div className="relative w-20 h-20">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-t-2 border-r-2 border-sky-500 rounded-full"
          />
          <div className="absolute inset-2 border-t-2 border-l-2 border-purple-500 rounded-full animate-reverse-spin" />
        </div>
        <p className="text-sky-500 font-mono tracking-widest animate-pulse">SYNCHRONIZING DATA...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 py-10" dir="rtl">
      
      {/* Header Section - Glassmorphism Header */}
      <div className="relative overflow-hidden bg-slate-900/40 border border-slate-800 p-8 rounded-[3rem] backdrop-blur-3xl shadow-2xl">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-sky-500/10 blur-[100px] rounded-full" />
        
        <div className="relative flex flex-col lg:flex-row justify-between items-end lg:items-center gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="bg-sky-500/10 text-sky-400 text-[10px] font-black px-3 py-1 rounded-full border border-sky-500/20 tracking-[0.2em] uppercase">
                Incoming Intel
              </span>
              <ShieldCheck size={16} className="text-slate-600" />
            </div>
            <h2 className="text-5xl font-black text-white tracking-tighter leading-none">
              مركز <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-purple-500">الاتصالات</span>
            </h2>
            <p className="text-slate-400 font-medium max-w-md leading-relaxed">
              إدارة وتحليل الرسائل الواردة من العملاء والشركاء عبر المنصة الرقمية.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
             {/* Search Bar */}
             <div className="relative w-full sm:w-64 group">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky-500 transition-colors" size={18} />
                <input 
                  type="text"
                  placeholder="بحث عن رسالة..."
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-3 pr-12 pl-4 text-white focus:border-sky-500/50 outline-none transition-all font-bold text-sm shadow-inner"
                />
             </div>
             <div className="bg-sky-600 px-8 py-3 rounded-2xl shadow-[0_0_20px_rgba(14,165,233,0.3)] text-white font-black flex flex-col items-center">
                <span className="text-2xl leading-none">{messages.length}</span>
                <span className="text-[10px] opacity-70 uppercase tracking-tighter">Total Inbound</span>
             </div>
          </div>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="grid grid-cols-1 gap-6 relative">
        <AnimatePresence mode="popLayout">
          {filteredMessages.length > 0 ? (
            filteredMessages.map((msg, index) => (
              <motion.div
                key={msg.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group relative bg-[#0f172a]/60 border border-slate-800 hover:border-sky-500/40 p-1 rounded-[2.8rem] transition-all duration-700"
              >
                <div className="bg-slate-900/40 rounded-[2.6rem] p-8 flex flex-col lg:flex-row gap-10">
                  
                  {/* Avatar Side */}
                  <div className="flex flex-col items-center gap-4 min-w-[120px]">
                    <div className="relative">
                      <div className="absolute inset-0 bg-sky-500 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-20 transition-opacity" />
                      <motion.img 
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        src={`https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${encodeURIComponent(msg.name)}&backgroundColor=0f172a`}
                        alt={msg.name}
                        className="w-24 h-24 bg-slate-950 rounded-[2.2rem] border-2 border-slate-800 group-hover:border-sky-500/50 transition-all relative z-10"
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-1">Source ID</p>
                      <p className="text-sky-500 font-mono text-xs font-bold">USR-{msg.id}024</p>
                    </div>
                  </div>

                  {/* Content Side */}
                  <div className="flex-1 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-white text-2xl font-black tracking-tight flex items-center gap-3">
                          {msg.name}
                          <ArrowUpRight size={16} className="text-slate-600 opacity-0 group-hover:opacity-100 transition-all group-hover:text-sky-400" />
                        </h4>
                        <a 
                          href={`mailto:${msg.email}`}
                          className="text-slate-500 font-mono text-sm hover:text-sky-400 transition-colors"
                        >
                          {msg.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-3 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800">
                        <Clock size={14} className="text-sky-500" />
                        <span className="text-xs font-bold text-slate-400">
                          {new Date(msg.created_at).toLocaleTimeString('ar-YE', { hour: '2-digit', minute: '2-digit' })} - {new Date(msg.created_at).toLocaleDateString('ar-YE')}
                        </span>
                      </div>
                    </div>

                    <div className="relative">
                      <Sparkles className="absolute -right-4 -top-4 text-sky-500/10 group-hover:text-sky-500/20 transition-colors" size={40} />
                      <div className="bg-slate-950/40 border-r-4 border-sky-600 p-6 rounded-2xl shadow-inner">
                        <p className="text-slate-300 text-lg leading-relaxed font-medium">
                          {msg.contentMessage}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                       <button 
                        onClick={() => window.location.href = `mailto:${msg.email}`}
                        className="bg-white text-black px-6 py-2 rounded-full font-black text-xs uppercase hover:bg-sky-500 hover:text-white transition-all shadow-lg"
                       >
                         رد  
                       </button>
                       <button className="text-slate-400 border border-slate-800 px-6 py-2 rounded-full font-bold text-xs hover:bg-slate-800 transition-all">
                         أرشفة الرسالة
                       </button>
                    <button onClick={() => handleDelete(msg.id)} className="p-2 bg-slate-900 text-rose-500 rounded-xl border border-slate-800 hover:bg-rose-500 hover:text-white transition-all">
                       <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="text-center py-40 bg-slate-900/20 rounded-[3rem] border-2 border-dashed border-slate-800"
            >
              <Inbox size={80} className="mx-auto text-slate-800 mb-6 animate-bounce" />
              <h3 className="text-slate-500 text-2xl font-black">النظام في انتظار بيانات جديدة...</h3>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ContactSection;