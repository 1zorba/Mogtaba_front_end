import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  PenTool, 
  User, 
  LogOut, 
  Plus,
  X,
  Folder, 
  LayoutDashboard,
  BellRing
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; // أضفت motion للحركات الجمالية
import { getUserData } from './api';
import ProfileSection from './dashboard/ProfileSection';
import ProjectsSection from './dashboard/ProjectsSection';
import PoemsSection from './dashboard/PoemsSection';
import ContactSection from './dashboard/ContactSection';
import ServicesSection from './dashboard/ServicesSection';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0); // حالة عدد الرسائل غير المقروءة

  const STORAGE_URL = "http://127.0.0.1:8000/storage/";

const fetchProfile = async () => {
  try {
    const response = await getUserData();
    // 1. استخراج البيانات (حسب بنية اللارافيل لديك)
    const data = response.data.data;
    setUserInfo(data);

    // 2. الوصول لمصفوفة الرسائل (التي تأتي غالباً من علاقة في الباك إند)
    // ملاحظة: تأكد هل اسمها في الـ API هو 'contact' أم 'messages'
    const messagesArray = data?.contact || data?.messages || [];

    if (Array.isArray(messagesArray)) {
      // 3. حساب الرسائل التي قيمة is_read فيها 0 (غير مقروءة)
      const unread = messagesArray.filter(msg => msg.is_read == 0 || msg.is_read === false).length;
      setUnreadCount(unread);
    }
  } catch (error) { 
    console.error("خطأ في جلب البيانات:", error); 
  } finally { 
    setLoading(false); 
  }
};

  useEffect(() => { fetchProfile(); }, []);

  if (loading) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-sky-500 font-bold">جاري التحميل...</div>;

  return (
    <div className="min-h-screen bg-[#020617] flex text-slate-300 font-sans" dir="rtl">
      
      {/* Sidebar - القائمة الجانبية */}
      <aside className="w-72 bg-[#0f172a] border-l border-slate-800 flex flex-col">
        <div className="p-8">
          <h2 className="text-xl font-bold text-white mb-10 flex items-center gap-3">
            <LayoutDashboard className="text-sky-500" /> لوحة التحكم
          </h2>
          
          <nav className="space-y-2">
            {/* زر البروفايل */}
            <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${activeTab === 'profile' ? 'bg-sky-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-800'}`}>
              <User size={22} /> <span className="font-bold">البروفايل الشخصي</span>
            </button>
            
            {/* زر المشاريع */}
            <button onClick={() => setActiveTab('projects')} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${activeTab === 'projects' ? 'bg-sky-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-800'}`}>
              <Folder size={22} /> <span className="font-bold">إدارة المشاريع</span>
            </button>

            {/* زر الخدمات */}
            <button onClick={() => setActiveTab('services')} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${activeTab === 'services' ? 'bg-sky-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-800'}`}>
              <Briefcase size={22} /> <span className="font-bold">خدماتي</span>
            </button>

            {/* زر القصائد */}
            <button onClick={() => setActiveTab('poems')} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${activeTab === 'poems' ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/20' : 'text-slate-500 hover:bg-slate-800'}`}>
              <PenTool size={22} /> <span className="font-bold"> قصائدي</span>
            </button>

            {/* زر الرسائل مع الإشعار */}
          <button 
  onClick={() => {
    setActiveTab('contact');
    setUnreadCount(0); // تصفير العداد عند الدخول
  }} 
  className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all ${activeTab === 'contact' ? 'bg-sky-600 text-white' : 'text-slate-500 hover:bg-slate-800'}`}
>
  <div className="flex items-center gap-4">
    <BellRing size={22} /> 
    <span className="font-bold">الرسائل</span>
  </div>
  
  {/* الإشعار - سيظهر فقط إذا كان هناك رسائل جديدة ولم تكن في صفحة الرسائل حالياً */}
  {unreadCount > 0 && activeTab !== 'contact' && (
    <motion.span 
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="bg-rose-500 text-white text-[10px] font-black h-5 w-5 flex items-center justify-center rounded-full shadow-lg shadow-rose-500/40"
    >
      {unreadCount}
    </motion.span>
  )}
</button>
          </nav>
        </div>

        {/* زر تسجيل الخروج في الأسفل */}
        <div className="mt-auto p-8">
            <button className="w-full flex items-center gap-4 px-6 py-4 text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all font-bold">
                <LogOut size={22} /> تسجيل الخروج
            </button>
        </div>
      </aside>

      {/* المحتوى الرئيسي */}
      <main className="flex-1 p-12 overflow-y-auto">
        {activeTab === 'profile' && (
          <ProfileSection userInfo={userInfo} fetchProfile={fetchProfile} STORAGE_URL={STORAGE_URL} />
        )}

        {activeTab === 'projects' && (
          <ProjectsSection projects={userInfo?.projects} fetchProfile={fetchProfile} STORAGE_URL={STORAGE_URL} />
        )}
        
        {activeTab === 'services' && (
          <ServicesSection services={userInfo?.services} fetchProfile={fetchProfile} STORAGE_URL={STORAGE_URL} />
        )}

        {activeTab === 'poems' && (
          <PoemsSection poems={userInfo?.poems} fetchProfile={fetchProfile} STORAGE_URL={STORAGE_URL} />
        )}
        {activeTab === 'contact' && (
          <ContactSection contact={userInfo?.contact} fetchProfile={fetchProfile} STORAGE_URL={STORAGE_URL} />
        )}
      </main>
    </div>
  );
};

export default Dashboard;