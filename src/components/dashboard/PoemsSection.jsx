import React, { useState, useEffect } from 'react';
import { 
  PenTool, Plus, Trash2, Upload, X, BookOpen, 
  Edit3, AlignRight, Link2, Loader2, ChevronDown, ChevronUp 
} from 'lucide-react';
import Swal from 'sweetalert2';
// أضفت هنا استيراد دالة التحديث updatePoem
import { getPoems, createPoem, deletePoem, updatePoem } from '/src/components/api';


const PoemsSection = ({ STORAGE_URL }) => {
    const [poemsList, setPoemsList] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editId, setEditId] = useState(null); 
    // مصفوفة لتخزين معرفات القصائد التي تم النقر على "عرض المزيد" لها
    const [expandedPoems, setExpandedPoems] = useState([]);

    const [formData, setFormData] = useState({
        poem_title: '', poem_content: '', poem_link: '', image: null
    });
    const [preview, setPreview] = useState(null);

    const fetchMyPoems = async () => {
        try {
            setLoadingData(true);
            const response = await getPoems();
            setPoemsList(response.data.data || []);
        } catch (error) { console.error(error); } 
        finally { setLoadingData(false); }
    };

    useEffect(() => { fetchMyPoems(); }, []);

    // دالة لتبديل حالة العرض (إظهار/إخفاء)
    const toggleExpand = (id) => {
        setExpandedPoems(prev => 
            prev.includes(id) ? prev.filter(poemId => poemId !== id) : [...prev, id]
        );
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'حذف القصيدة؟',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#e11d48',
            background: '#0f172a',
            color: '#fff',
            confirmButtonText: 'حذف'
        });
        if (result.isConfirmed) {
            try { await deletePoem(id); fetchMyPoems(); } catch (error) { console.error(error); }
        }
    };

    const handleEditClick = (poem) => {
    setEditId(poem.id);
    setFormData({
        poem_title: poem.poem_title,
        poem_content: poem.poem_content,
        poem_link: poem.poem_link || '',
        image: null // الصورة تظل نل إلا إذا اختار المستخدم صورة جديدة
    });
    setPreview(poem.image ? `${STORAGE_URL}${poem.image}` : null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // للصعود لنموذج التعديل
};

const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const data = new FormData();
    data.append('poem_title', formData.poem_title);
    data.append('poem_content', formData.poem_content);
    data.append('poem_link', formData.poem_link);
    if (formData.image) data.append('image', formData.image);

    try {
        if (editId) {
            // في حالة التعديل، Laravel يحتاج أحياناً لهذه الإضافة مع FormData
            data.append('_method', 'PUT'); 
            await updatePoem(editId, data);
            Swal.fire({ icon: 'success', title: 'تم التحديث بنجاح', background: '#0f172a', color: '#fff' });
        } else {
            await createPoem(data);
            Swal.fire({ icon: 'success', title: 'تم بنجاح', background: '#0f172a', color: '#fff' });
        }
        
        // إعادة تعيين النموذج
        setFormData({ poem_title: '', poem_content: '', poem_link: '', image: null });
        setPreview(null);
        setShowForm(false);
        setEditId(null);
        fetchMyPoems();
    } catch (error) {
        console.error(error);
        Swal.fire({ icon: 'error', title: 'حدث خطأ ما', background: '#0f172a', color: '#fff' });
    } finally {
        setLoading(false);
    }
};


    if (loadingData) return <div className="text-center py-20 text-amber-500"><Loader2 className="animate-spin mx-auto" size={40} /></div>;

    return (
        <div className="animate-in fade-in duration-700">
            {/* Header & Form */}
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black text-white flex items-center gap-3">
                    <PenTool className="text-amber-500" size={32} /> ديواني الشعري
                </h2>
                <button onClick={() => {setShowForm(!showForm); if(showForm) setEditId(null);}} className="bg-amber-600 hover:bg-amber-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all">
                    {showForm ? <X size={20} /> : <Plus size={20} />}
                    {showForm ? 'إلغاء' : 'إضافة قصيدة'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-[#0f172a] border border-slate-800 p-8 rounded-[2.5rem] mb-12 shadow-2xl animate-in slide-in-from-top duration-500">
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-4">
                                <input type="text" placeholder="عنوان القصيدة..." className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 px-6 text-white outline-none focus:border-amber-500 transition-all" value={formData.poem_title} onChange={(e) => setFormData({...formData, poem_title: e.target.value})} required />
                                <textarea placeholder="اكتب أبيات القصيدة هنا..." rows="6" className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 px-6 text-white outline-none focus:border-amber-500 resize-none italic" value={formData.poem_content} onChange={(e) => setFormData({...formData, poem_content: e.target.value})} required></textarea>
                                <input type="text" placeholder="رابط خارجي..." className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 px-6 text-white outline-none focus:border-amber-500" value={formData.poem_link} onChange={(e) => setFormData({...formData, poem_link: e.target.value})} />
                            </div>
                            <div className="border-2 border-dashed border-slate-800 rounded-[2rem] relative flex items-center justify-center bg-slate-900/30 min-h-[200px] overflow-hidden">
                                {preview ? <img src={preview} className="w-full h-full object-cover" alt="Preview" /> : <div className="text-slate-500 text-center"><Upload className="mx-auto" /><p>الغلاف</p></div>}
                                <input type="file" onChange={handleImageChange} className="hidden" id="poem-img" accept="image/*" />
                                <label htmlFor="poem-img" className="absolute inset-0 cursor-pointer"></label>
                            </div>
                        </div>
                        <button type="submit" disabled={loading} className="w-full bg-amber-600 text-white py-4 rounded-2xl font-bold">
                          {loading ? 'جاري المعالجة...' : (editId ? 'تحديث القصيدة' : 'نشر القصيدة')}
                        </button>
                    </div>
                </form>
            )}

            {/* Poems Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                {poemsList.map((poem) => {
                    const isExpanded = expandedPoems.includes(poem.id);
                    return (
                        <div key={poem.id} className="bg-[#0f172a] border border-slate-800 rounded-[2.5rem] overflow-hidden flex flex-col hover:border-amber-500/40 transition-all duration-500 shadow-xl h-fit">
                            <div className="h-48 overflow-hidden relative">
                                <img src={poem.image ? `${STORAGE_URL}${poem.image}` : 'https://via.placeholder.com/800x400?text=Poem'} className="w-full h-full object-cover" alt={poem.poem_title} />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-transparent"></div>
                            </div>

                            <div className="p-8">
                                <h3 className="text-xl font-bold text-white mb-4 border-r-4 border-amber-500 pr-3">{poem.poem_title}</h3>
                                
                                <div className="relative">
                                    <p className={`text-slate-400 leading-relaxed whitespace-pre-line italic transition-all duration-500 ${!isExpanded ? 'line-clamp-4' : ''}`}>
                                        {poem.poem_content}
                                    </p>
                                    
                                    <button 
                                        onClick={() => toggleExpand(poem.id)}
                                        className="mt-3 text-amber-500 hover:text-amber-400 font-bold text-sm flex items-center gap-1 transition-colors"
                                    >
                                        {isExpanded ? (
                                            <> عرض أقل <ChevronUp size={16} /> </>
                                        ) : (
                                            <> عرض المزيد... <ChevronDown size={16} /> </>
                                        )}
                                    </button>
                                </div>

                                <div className="mt-8 pt-6 border-t border-slate-800/50 flex justify-between items-center">
                                    <div className="flex gap-2">
                                        {poem.poem_link && (
                                            <a href={poem.poem_link} target="_blank" rel="noreferrer" className="p-2 bg-slate-900 text-amber-500 rounded-xl border border-slate-800 hover:bg-amber-500 hover:text-white transition-all">
                                                <BookOpen size={18} />
                                            </a>
                                        )}
                                        <button onClick={() => handleDelete(poem.id)} className="p-2 bg-slate-900 text-rose-500 rounded-xl border border-slate-800 hover:bg-rose-500 hover:text-white transition-all">
                                            <Trash2 size={18} />
                                        </button>
                                        {/* تم إضافة onClick هنا لتفعيل زر التعديل */}
                                        <button 
                                            onClick={() => handleEditClick(poem)}
                                            className="p-2.5 bg-slate-900/50 text-slate-400 hover:text-sky-500 rounded-xl border border-slate-800 transition-all hover:border-sky-500/50"
                                            title="تعديل"
                                        >
                                            <Edit3 size={18} />
                                        </button>
                                    </div>
                                    <span className="text-[10px] text-slate-600 font-mono tracking-tighter">
                                        {new Date(poem.created_at).toLocaleDateString('ar-YE')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PoemsSection;