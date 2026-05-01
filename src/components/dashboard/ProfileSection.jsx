import React, { useState } from 'react';
import { 
  User, Briefcase, Mail, Phone, Save, Edit2, X, 
  Camera, FileText, Quote, Share2, FileDown 
} from 'lucide-react';
import Swal from 'sweetalert2';
import { updateProfile } from '../api';

const ProfileSection = ({ userInfo, fetchProfile, STORAGE_URL }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    job_title: userInfo?.profile?.job_title || '',
    bio: userInfo?.profile?.bio || '',
    phone: userInfo?.profile?.phone || '',
    borrow: userInfo?.profile?.borrow || '', // عمود الاقتباس
    social_links: userInfo?.profile?.social_links || '',
    social_links2: userInfo?.profile?.social_links2 || '',
    cv_url: userInfo?.profile?.cv_url || '',
    profile_image: null
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateProfile(formData);
      Swal.fire({ title: 'نجاح', text: 'تم تحديث بياناتك بنجاح', icon: 'success', background: '#0f172a', color: '#fff' });
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      Swal.fire('خطأ', 'فشل التحديث، تأكد من اتصال السيرفر', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-white">الملف الشخصي</h2>
          <p className="text-slate-500 text-sm">إدارة هويتك الرقمية واقتباسك المفضل</p>
        </div>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${isEditing ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 'bg-sky-600 text-white shadow-lg'}`}
        >
          {isEditing ? <><X size={18}/> إلغاء</> : <><Edit2 size={18}/> تعديل البروفايل</>}
        </button>
      </div>

      {!isEditing ? (
        <div className="space-y-6">
          {/* الكرت الرئيسي مع الاقتباس */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-10">
            <div className="relative">
              <img 
                src={userInfo?.profile?.profile_image ? `${STORAGE_URL}${userInfo.profile.profile_image}` : 'https://ui-avatars.com/api/?name=Admin'} 
                className="w-44 h-44 rounded-[2.5rem] object-cover border-4 border-slate-800 shadow-2xl" 
                alt="Admin"
              />
            </div>
            <div className="text-center md:text-right flex-1">
              <h3 className="text-5xl font-black text-white mb-2 tracking-tight">{userInfo?.name}</h3>
              <p className="text-sky-400 text-xl font-bold flex items-center justify-center md:justify-start gap-2 mb-4">
                <Briefcase size={22} /> {userInfo?.profile?.job_title || 'كاتب محتوى إبداعي/إعلاني'}
              </p>
                <button className="text-blue-400 text-xl font-bold flex items-center justify-center md:justify-start gap-2 mb-4">
                <Briefcase size={22} /> {userInfo?.email}
              </button>
              {/* عرض الاقتباس بشكل مميز */}
              {userInfo?.profile?.borrow && (
                <div className="relative inline-block">
                  <Quote className="absolute -right-6 -top-2 text-slate-700 w-8 h-8 -z-10" />
                  <p className="italic text-slate-400 text-lg font-medium px-4 border-r-2 border-sky-500/30">
                    "{userInfo.profile.borrow}"
                  </p>
                
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-[#0f172a] border border-slate-800 rounded-[2rem] p-8">
              <h4 className="text-sky-500 font-bold mb-4 flex items-center gap-2"><FileText size={18}/> النبذة التعريفية</h4>
              <p className="text-slate-300 leading-relaxed text-lg">{userInfo?.profile?.bio || 'لا توجد نبذة حالياً.'}</p>
            </div>
            
            <div className="bg-[#0f172a] border border-slate-800 rounded-[2rem] p-8 space-y-4">
              <h4 className="text-slate-500 font-bold text-xs uppercase tracking-widest">  روابط ومعلومات شخصية</h4>
              <div className="space-y-3">
                
                 <h1>رقمي :</h1>
                <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-xl border border-slate-800/50">

                  <Phone size={18} className="text-sky-500" />
                  <span className="text-sm text-slate-300">{userInfo?.profile?.phone || 'بدون هاتف'}</span>
                </div>
                <h1>السيرة الذاتية :</h1>
                <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-xl border border-slate-800/50">
                  <FileDown size={18} className="text-sky-500" />
                  <span className="text-sm text-slate-300 truncate">{userInfo?.profile?.cv_url || 'لا يوجد CV'}</span>
                </div>
                    <h1> حسابي على فيسبوك :</h1>
                <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-xl border border-slate-800/50">
                  <Share2 size={18} className="text-sky-500" />
                  <span className="text-sm text-slate-300 truncate">{userInfo?.profile?.social_links || 'لا روابط'}</span>
                </div>
                    <h1> حسابي على instgram :</h1>
                <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-xl border border-slate-800/50">
                  <Share2 size={18} className="text-sky-500" />
                  <span className="text-sm text-slate-300 truncate">{userInfo?.profile?.social_links2 || 'لا روابط'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* وضع التعديل */
        <form onSubmit={handleUpdate} className="bg-[#0f172a] border border-slate-800 rounded-[2.5rem] p-10 animate-in slide-in-from-top-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div className="md:col-span-2 flex flex-col items-center mb-4">
              <div className="relative group cursor-pointer">
                <div className="w-32 h-32 rounded-[1.5rem] bg-slate-800 border-4 border-slate-700 overflow-hidden shadow-2xl">
                  {formData.profile_image ? (
                    <img src={URL.createObjectURL(formData.profile_image)} className="w-full h-full object-cover" />
                  ) : (
                    <img src={userInfo?.profile?.profile_image ? `${STORAGE_URL}${userInfo.profile.profile_image}` : ''} className="w-full h-full object-cover opacity-50" />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="text-white" />
                  </div>
                </div>
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setFormData({...formData, profile_image: e.target.files[0]})} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-sky-500 uppercase">المسمى الوظيفي</label>
              
              <input type="text" value={formData.job_title} onChange={e => setFormData({...formData, job_title: e.target.value})} className="w-full bg-[#020617] border border-slate-800 p-4 rounded-2xl outline-none focus:border-sky-500 text-white font-bold" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-sky-500 uppercase">رقم الهاتف</label>
              <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-[#020617] border border-slate-800 p-4 rounded-2xl outline-none focus:border-sky-500 text-white font-bold" />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-black text-sky-500 uppercase">اقتباسي المفضل (Borrow)</label>
              <input type="text" value={formData.borrow} onChange={e => setFormData({...formData, borrow: e.target.value})} placeholder="اكتب جملة تعبر عنك هنا..." className="w-full bg-[#020617] border border-slate-800 p-4 rounded-2xl outline-none focus:border-sky-500 text-white italic transition-all" />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-black text-sky-500 uppercase">النبذة التعريفية (Bio)</label>
              <textarea rows="4" value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full bg-[#020617] border border-slate-800 p-4 rounded-2xl outline-none focus:border-sky-500 text-white leading-relaxed resize-none" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-sky-500 uppercase">رابط السيرة الذاتية (CV)</label>
              <input type="text" value={formData.cv_url} onChange={e => setFormData({...formData, cv_url: e.target.value})} className="w-full bg-[#020617] border border-slate-800 p-4 rounded-2xl outline-none focus:border-sky-500 text-white" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-sky-500 uppercase">روابط التواصل الاجتماعي1</label>
              <input type="text" value={formData.social_links} onChange={e => setFormData({...formData, social_links: e.target.value})} className="w-full bg-[#020617] border border-slate-800 p-4 rounded-2xl outline-none focus:border-sky-500 text-white" />
                 <label className="text-xs font-black text-sky-500 uppercase"> روابط التواصل الاجتماعي 2</label>
              <input type="text" value={formData.social_links2} onChange={e => setFormData({...formData, social_links2: e.target.value})} className="w-full bg-[#020617] border border-slate-800 p-4 rounded-2xl outline-none focus:border-sky-500 text-white" />
            </div>

            <div className="md:col-span-2 mt-4">
              <button type="submit" disabled={loading} className="w-full bg-sky-600 hover:bg-sky-500 py-5 rounded-2xl font-black text-white shadow-xl flex items-center justify-center gap-3 transition-all">
                <Save size={20} /> {loading ? 'جاري الحفظ...' : 'تأكيد وحفظ كل البيانات'}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProfileSection;