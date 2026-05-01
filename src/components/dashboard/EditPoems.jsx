import React, { useState, useEffect } from 'react';
import { X, Upload, Save, Link, Type, AlignLeft } from 'lucide-react';
import { updateProject } from '../api';

const EditPoemsForm = ({ poems, STORAGE_URL, onCancel, onUpdateSuccess }) => {
    // 1. تعبئة البيانات التلقائية من المشروع المختار
    const [formData, setFormData] = useState({
        poem_title: poems.poem_title || poems.poem_title || '',
        poem_content: poems.poem_content || '',
        poem_link: poems.poem_link || '',
        image: null // للملف الجديد
    });

    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    // 2. معالجة رابط الصورة لعرضها فور فتح الصفحة
  useEffect(() => {
    if (poems) {
        // 1. تنظيف المسار لضمان ظهور الصورة
        if (poems.image) {
            // إزالة storage/ أو السلاش من البداية لتجنب التكرار
            const cleanPath = poems.image.replace(/^(storage\/|\/+)/, '');
            // التأكد من أن STORAGE_URL لا ينتهي بسلاش قبل إضافة واحدة
            const base = STORAGE_URL.endsWith('/') ? STORAGE_URL.slice(0, -1) : STORAGE_URL;
            const fullUrl = `${base}/storage/${cleanPath}`;
            
            console.log("Image Debug - Final URL:", fullUrl);
            setPreview(fullUrl);
        }

        // 2. تحديث البيانات النصية فقط دون المساس بـ image_url إلا إذا لزم الأمر
        setFormData(prev => ({
            ...prev,
            title: poems.poem_title || poems.poem_title || '',
            poem_content: poems.poem_content || '',
            poem_link: poems.poem_link || '',
            // لا نلمس image_url هنا لكي لا نمسح الملف المختار حديثاً
        }));
    }
}, [poems, STORAGE_URL]);
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            setPreview(URL.createObjectURL(file)); // عرض معاينة للصورة الجديدة المختارة
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateProject(poems.id, formData);
            onUpdateSuccess(); // إغلاق الفورم وتحديث القائمة في ProjectsSection
        } catch (error) {
            console.error("Update Error:", error);
            alert("فشل تحديث المشروع، تأكد من البيانات");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#0f172a] border border-slate-800 rounded-[3rem] p-10 animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black text-white flex items-center gap-3">
                    <Save className="text-sky-500" size={32} /> تعديل المشروع
                </h2>
                <button onClick={onCancel} className="p-3 hover:bg-slate-800 rounded-2xl text-slate-400 transition-colors">
                    <X size={28} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    {/* العنوان */}
                    <div>
                        <label className="text-slate-400 text-sm mb-2 block mr-2">اسم المشروع</label>
                        <div className="relative">
                            <Type className="absolute right-4 top-4 text-slate-500" size={20} />
                            <input 
                                type="text"
                                value={formData.poem_title}
                                onChange={(e) => setFormData({...formData, poem_title: e.target.value})}
                                className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pr-12 pl-4 text-white focus:border-sky-500 outline-none transition-all"
                                required
                            />
                        </div>
                    </div>

                    {/* الرابط */}
                    <div>
                        <label className="text-slate-400 text-sm mb-2 block mr-2">رابط المعاينة</label>
                        <div className="relative">
                            <Link className="absolute right-4 top-4 text-slate-500" size={20} />
                            <input 
                                type="url"
                                value={formData.poem_link}
                                onChange={(e) => setFormData({...formData, poem_link: e.target.value})}
                                className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pr-12 pl-4 text-white focus:border-sky-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* الوصف */}
                    <div>
                        <label className="text-slate-400 text-sm mb-2 block mr-2">وصف المشروع</label>
                        <div className="relative">
                            <AlignLeft className="absolute right-4 top-4 text-slate-500" size={20} />
                            <textarea 
                                value={formData.poem_content}
                                onChange={(e) => setFormData({...formData, poem_content: e.target.value})}
                                className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pr-12 pl-4 text-white focus:border-sky-500 outline-none transition-all h-32 resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* قسم الصورة */}
                <div className="flex flex-col">
                    <label className="text-slate-400 text-sm mb-2 block mr-2">صورة المشروع</label>
                    <div className="flex-1 border-2 border-dashed border-slate-800 rounded-[2.5rem] p-4 bg-slate-900/30 flex flex-col items-center justify-center relative overflow-hidden group">
                        {preview ? (
                            <>
<img src={preview} alt="Preview" key={preview} className="..." />                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <label className="cursor-pointer bg-sky-600 text-white px-6 py-2 rounded-xl font-bold">
                                        تغيير الصورة
                                        <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" />
                                    </label>
                                </div>
                            </>
                        ) : (
                            <label className="cursor-pointer flex flex-col items-center">
                                <Upload size={48} className="text-slate-700 mb-4" />
                                <span className="text-slate-500">اضغط لرفع صورة</span>
                                <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" />
                            </label>
                        )}
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="mt-8 w-full bg-sky-600 hover:bg-sky-500 text-white py-5 rounded-[1.5rem] font-black text-xl shadow-lg shadow-sky-900/20 transition-all disabled:opacity-50"
                    >
                        {loading ? 'جاري الحفظ...' : 'تحديث بيانات المشروع'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditPoemsForm;