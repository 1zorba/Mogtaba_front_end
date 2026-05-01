import React, { useState } from 'react';
import { Briefcase, Plus, Trash2, Upload, Type, X, Image as ImageIcon, Edit2, Save } from 'lucide-react';
import Swal from 'sweetalert2';
import { createService, deleteService, updateService } from '/src/components/api';

const ServicesSection = ({ services, fetchProfile, STORAGE_URL }) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [editingId, setEditingId] = useState(null);
    
    const [formData, setFormData] = useState({
        service_title: '',
        image: null
    });

    // تجهيز البيانات عند الضغط على تعديلupdateService
const handleEditClick = (service) => {
    console.log("البيانات المستلمة في التعديل:", service); // أضف هذا السطر للفحص
    if (!service.id) {
        console.error("خطأ: هذا العنصر لا يملك ID!");
        return;
    }
    setEditingId(service.id); 
    setFormData({ service_title: service.service_title, image: null });
    setPreview(`${STORAGE_URL}${service.image}`);
    setShowEditModal(true);
};

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            setPreview(URL.createObjectURL(file));
        }
    };

    // دالة الإضافة
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.image) return Swal.fire({ icon: 'warning', title: 'صورة الخدمة مطلوبة', background: '#0f172a', color: '#fff' });

        setLoading(true);
        const data = new FormData();
        data.append('service_title', formData.service_title);
        data.append('image', formData.image);

        try {
            await createService(data);
            Swal.fire({ icon: 'success', title: 'تمت الإضافة', timer: 1500, showConfirmButton: false, background: '#0f172a', color: '#fff' });
            resetForm();
            fetchProfile();
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'فشل الإضافة', background: '#0f172a', color: '#fff' });
        } finally { setLoading(false); }
    };

    // دالة التحديث
// دالة التحديث
const handleUpdate = async (e) => {
    e.preventDefault();
    
    // تأكد أن editingId يحتوي على قيمة وليس null
    if (!editingId) {
        console.error("ID الخدمة غير موجود!");
        return;
    }

    setLoading(true);
    const data = new FormData();
    data.append('service_title', formData.service_title);
    if (formData.image) data.append('image', formData.image);
    data.append('_method', 'PUT'); 

    try {
        // تأكد من تمرير editingId كباراميتر أول
        await updateService(editingId, data); 

        // --- إضافة رسالة النجاح وتحديث الواجهة ---
        Swal.fire({
            icon: 'success',
            title: 'تم التحديث بنجاح',
            showConfirmButton: false,
            timer: 1500,
            background: '#0f172a',
            color: '#fff'
        });

        setShowEditModal(false); // إغلاق النافذة
        fetchProfile();          // تحديث البيانات في الصفحة
        // ---------------------------------------

    } catch (error) {
        console.error(error);
        // إضافة تنبيه في حال حدوث خطأ (اختياري)
        Swal.fire({
            icon: 'error',
            title: 'فشل التحديث',
            background: '#0f172a',
            color: '#fff'
        });
    } finally {
        setLoading(false);
    }
};

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'هل أنت متأكد؟',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'نعم، احذف',
            background: '#0f172a',
            color: '#fff'
        });

        if (result.isConfirmed) {
            try {
                await deleteService(id);
                fetchProfile();
                Swal.fire({ title: 'تم الحذف', icon: 'success', background: '#0f172a', color: '#fff' });
            } catch (error) { Swal.fire('خطأ', 'فشل الحذف', 'error'); }
        }
    };

    const resetForm = () => {
        setFormData({ service_title: '', image: null });
        setPreview(null);
        setShowAddForm(false);
        setEditingId(null);
    };

    const servicesList = services ? (Array.isArray(services) ? services : Object.values(services)) : [];

    return (
        <div className="animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black text-white flex items-center gap-3">
                    <Briefcase className="text-sky-500" size={32} /> إدارة خدماتي
                </h2>
                <button 
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="bg-sky-600 hover:bg-sky-500 text-white px-6 py-3 rounded-2xl font-bold transition-all flex items-center gap-2"
                >
                    {showAddForm ? <X size={20} /> : <Plus size={20} />}
                    {showAddForm ? 'إلغاء' : 'إضافة خدمة جديدة'}
                </button>
            </div>

            {/* Add Form */}
            {showAddForm && (
                <form onSubmit={handleSubmit} className="bg-[#0f172a] border border-slate-800 p-8 rounded-[2.5rem] mb-12 animate-in zoom-in duration-300 shadow-2xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <input 
                                type="text"
                                value={formData.service_title}
                                onChange={(e) => setFormData({...formData, service_title: e.target.value})}
                                className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 px-6 text-white outline-none focus:border-sky-500"
                                placeholder="عنوان الخدمة..."
                                required
                            />
                            <button type="submit" disabled={loading} className="w-full bg-sky-600 py-4 rounded-2xl font-bold text-white">
                                {loading ? 'جاري الحفظ...' : 'اعتماد الإضافة'}
                            </button>
                        </div>
                        <div className="h-40 border-2 border-dashed border-slate-800 rounded-[2rem] relative flex items-center justify-center bg-slate-900/30 overflow-hidden">
                            {preview ? (
                                <img src={preview} className="w-full h-full object-contain" alt="Preview" />
                            ) : (
                                <label className="cursor-pointer text-slate-500"><Upload className="mx-auto mb-2" /> ارفع صورة</label>
                            )}
                            <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" id="add-img" />
                            <label htmlFor="add-img" className="absolute inset-0 cursor-pointer"></label>
                        </div>
                    </div>
                </form>
            )}

            {/* Services Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {servicesList.map((service, index) => (
                    <div key={service.id || index} className="bg-[#0f172a] border border-slate-800 rounded-[2.5rem] p-6 group relative hover:border-sky-500/40 transition-all shadow-xl">
                        <div className="h-32 w-full mb-4 rounded-2xl overflow-hidden bg-slate-900">
                            {service.image ? (
                                <img src={`${STORAGE_URL}${service.image}`} className="w-full h-full object-cover" alt={service.service_title} />
                            ) : <ImageIcon size={40} className="m-auto mt-10 text-slate-700" />}
                        </div>
                        <h3 className="text-center text-white font-bold truncate px-2">{service.service_title}</h3>
                        
                        {/* Action Buttons */}
<div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
    <button 
        type="button" // إضافة type لمنع أي سلوك افتراضي
        onClick={(e) => {
            e.stopPropagation(); // منع انتشار الحدث
            handleEditClick(service);
        }} 
        className="p-2 bg-slate-900 text-sky-500 rounded-xl border border-slate-800 hover:bg-sky-500 hover:text-white transition-all shadow-lg"
    >
        <Edit2 size={16} />
    </button>
    
    <button 
        type="button"
        onClick={(e) => {
            e.stopPropagation();
            handleDelete(service.id);
        }} 
        className="p-2 bg-slate-900 text-rose-500 rounded-xl border border-slate-800 hover:bg-rose-500 hover:text-white transition-all shadow-lg"
    >
        <Trash2 size={16} />
    </button>
</div>
                    </div>
                ))}
            </div>

            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-[#0f172a] border border-slate-800 w-full max-w-xl rounded-[2.5rem] p-10 relative shadow-2xl animate-in zoom-in duration-300">
                        <button onClick={() => setShowEditModal(false)} className="absolute top-6 left-6 text-slate-500 hover:text-white"><X /></button>
                        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3"><Edit2 className="text-sky-500" /> تعديل الخدمة</h2>
                        
                        <form onSubmit={handleUpdate} className="space-y-6">
                            <div>
                                <label className="text-slate-400 text-sm mb-2 block">العنوان الجديد</label>
                                <input 
                                    type="text"
                                    value={formData.service_title}
                                    onChange={(e) => setFormData({...formData, service_title: e.target.value})}
                                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 px-6 text-white outline-none focus:border-sky-500"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="text-slate-400 text-sm mb-2 block">تغيير الصورة (اختياري)</label>
                                <div className="h-48 border-2 border-dashed border-slate-800 rounded-[2rem] relative flex items-center justify-center bg-slate-900/30 overflow-hidden group">
                                    {preview && <img src={preview} className="w-full h-full object-contain p-2" alt="Preview" />}
                                    <input type="file" onChange={handleImageChange} className="hidden" id="edit-img" />
                                    <label htmlFor="edit-img" className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-all text-white font-bold">تغيير الصورة</label>
                                </div>
                            </div>

                            <button type="submit" disabled={loading} className="w-full bg-sky-600 hover:bg-sky-500 text-white py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-2">
                                <Save size={20} /> {loading ? 'جاري التحديث...' : 'حفظ التعديلات'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServicesSection;