import React, { useState } from 'react';
import { Save, X, Image as ImageIcon, Link as LinkIcon, Type, AlignLeft } from 'lucide-react';
import Swal from 'sweetalert2';
import { createProject } from '../api';

const AddProjectForm = ({ onCancel, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    project_title: '', // سنقوم بتحويله إلى title عند الإرسال
    description: '',
    link_location: '',
    image: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.project_title || !formData.image) {
      Swal.fire('تنبيه', 'يرجى كتابة عنوان المشروع واختيار صورة', 'warning');
      return;
    }

    try {
      setLoading(true);
      // إرسال البيانات للدالة في api.js
      const response = await createProject(formData);

      // التحقق من النجاح بناءً على الرسالة التي أرسلتها "created successfully"
      if (response && (response.data?.message === "created successfully" || response.data?.[0])) {
        Swal.fire({
          title: 'تم الإضافة!',
          text: 'تم إنشاء المشروع وحفظ الصورة بنجاح',
          icon: 'success',
          background: '#0f172a',
          color: '#fff'
        });
        onSuccess(); 
      }
    } catch (error) {
      // طباعة الخطأ كاملاً في الكونسول لتشخيصه إذا فشل
      console.error("Full Error:", error);
      Swal.fire('خطأ', 'حدثت مشكلة أثناء الإرسال، تأكد من اتصال السيرفر', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0f172a] border border-slate-800 rounded-[2.5rem] p-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-black text-white">إضافة مشروع جديد</h3>
        <button type="button" onClick={onCancel} className="text-slate-500 hover:text-rose-500 transition-colors">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* رفع الصورة */}
        <div className="md:col-span-2">
          <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-slate-800 rounded-[2rem] cursor-pointer hover:border-sky-500/50 hover:bg-sky-500/5 transition-all">
            {formData.image ? (
              <img src={URL.createObjectURL(formData.image)} className="h-full w-full object-cover rounded-[2rem]" alt="preview" />
            ) : (
              <div className="flex flex-col items-center">
                <ImageIcon className="text-slate-600 mb-2" size={32} />
                <span className="text-slate-500 font-bold">اختر صورة المشروع</span>
              </div>
            )}
            <input type="file" className="hidden" onChange={(e) => setFormData({...formData, image: e.target.files[0]})} />
          </label>
        </div>

        {/* عنوان المشروع */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-black text-sky-500 uppercase tracking-widest flex items-center gap-2">
            <Type size={14} /> عنوان المشروع
          </label>
          <input 
            type="text" 
            required
            value={formData.project_title}
            onChange={(e) => setFormData({...formData, project_title: e.target.value})}
            className="w-full bg-[#020617] border border-slate-800 p-4 rounded-2xl outline-none focus:border-sky-500 text-white"
            placeholder="مثلاً: اعلان لمطعم "
          />
        </div>

        {/* وصف المشروع */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-black text-sky-500 uppercase tracking-widest flex items-center gap-2">
            <AlignLeft size={14} /> وصف المشروع
          </label>
          <textarea 
            rows="3"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full bg-[#020617] border border-slate-800 p-4 rounded-2xl outline-none focus:border-sky-500 text-white resize-none"
            placeholder="تكلم باختصار عن فكرة المشروع..."
          />
        </div>

        {/* رابط المشروع الوحيد المعتمد في القاعدة */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-black text-sky-500 uppercase tracking-widest flex items-center gap-2">
            <LinkIcon size={14} /> رابط المشروع (link_location)
          </label>
          <input 
            type="url" 
            value={formData.link_location}
            onChange={(e) => setFormData({...formData, link_location: e.target.value})}
            className="w-full bg-[#020617] border border-slate-800 p-4 rounded-2xl outline-none focus:border-sky-500 text-white"
            placeholder="https://location of place"
          />
        </div>

        <div className="md:col-span-2 mt-4">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 py-5 rounded-2xl font-black text-white shadow-xl flex items-center justify-center gap-3 transition-all"
          >
            <Save size={20} /> {loading ? 'جاري الحفظ...' : 'اعتماد وإضافة المشروع'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProjectForm;