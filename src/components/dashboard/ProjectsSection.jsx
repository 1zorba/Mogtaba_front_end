import React, { useState } from 'react';
import { 
  Folder, ExternalLink, Plus, 
  Layout, X, Globe, Info, Hash,
  Edit3, Trash2 
} from 'lucide-react';
 
import AddProjectForm from "./AddProjectForm";
import EditProjectForm from "./EditProjectForm";
import Swal from 'sweetalert2'; 
import { deleteProject } from '/src/components/api';const ProjectsSection = ({ projects, fetchProfile, STORAGE_URL }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null); 
  
  // --- الإضافة (1): حالة لتتبع قراءة المزيد لكل مشروع ---
  const [expandedProjects, setExpandedProjects] = useState([]);
  const toggleDescription = (id) => {
    setExpandedProjects(prev => 
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    const cleanPath = imagePath.replace(/^\/+/, '').replace(/^storage\//, '');
    return `${STORAGE_URL}/storage/${cleanPath}`;
  };

  if (showAddForm) {
    return (
      <AddProjectForm 
        onCancel={() => setShowAddForm(false)} 
        onSuccess={() => {
          setShowAddForm(false);
          if (typeof fetchProfile === 'function') {
            fetchProfile(); 
          } else {
            window.location.reload();
          }
        }} 
      />
    );
  }

const handleDelete = async (id) => {
    const result = await Swal.fire({
        title: 'هل أنت متأكد؟',
        text: "لن تتمكن من استعادة هذا المشروع بعد الحذف!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444', 
        cancelButtonColor: '#334155',
        confirmButtonText: 'نعم، احذفه!',
        cancelButtonText: 'إلغاء',
        background: '#0f172a',
        color: '#fff'
    });

    if (result.isConfirmed) {
        try {
            // الآن الدالة أصبحت مستوردة ومعرفة هنا
            await deleteProject(id);
            
            // تحديث البيانات بعد الحذف
            if (typeof fetchProfile === 'function') {
                await fetchProfile();
            }

            Swal.fire({
                title: 'تم الحذف!',
                text: 'تم إزالة المشروع من معرض أعمالك.',
                icon: 'success',
                background: '#0f172a',
                color: '#fff',
                confirmButtonColor: '#0ea5e9'
            });
        } catch (error) {
            console.error("Delete Error:", error);
            Swal.fire({
                title: 'خطأ!',
                text: error.response?.data?.message || 'فشل عملية الحذف، حاول لاحقاً.',
                icon: 'error',
                background: '#0f172a',
                color: '#fff'
            });
        }
    }
  };

 if (editingProject) {
    return (
        <EditProjectForm 
            project={editingProject} 
            STORAGE_URL={STORAGE_URL} 
            onCancel={() => setEditingProject(null)} 
            onUpdateSuccess={async () => {
                setEditingProject(null);
                if (typeof fetchProfile === 'function') {
                    await fetchProfile(); 
                }
                Swal.fire({
                    title: 'تم التحديث بنجاح!',
                    text: 'لقد تم حفظ التعديلات على مشروعك وتحديث الصورة بنجاح.',
                    icon: 'success',
                    background: '#0f172a',
                    color: '#fff',
                    confirmButtonColor: '#0ea5e9',
                    confirmButtonText: 'رائع',
                    showClass: {
                        popup: 'animate__animated animate__fadeInUp'
                    },
                    timer: 3000
                });
            }} 
        />
    );
}

  if (!projects || projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-[#0f172a] border border-dashed border-slate-800 rounded-[3rem]">
        <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center text-slate-700 mb-6">
          <Folder size={40} />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">لا توجد مشاريع حالياً</h3>
        <button onClick={() => setShowAddForm(true)} className="bg-sky-600 text-white px-8 py-3 rounded-2xl font-black mt-4">
          <Plus size={20} /> إضافة مشروعك الأول
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700 pb-10">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-4xl font-black text-white flex items-center gap-4">
            <span className="p-3 bg-sky-500/10 rounded-2xl">
              <Layout className="text-sky-500" size={32} />
            </span>
            معرض الأعمال
          </h2>
          <p className="text-slate-500 mt-2 font-medium flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse block"></span>
            لديك {projects?.length || 0} مشاريع منشورة حالياً
          </p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-sky-600 hover:bg-sky-500 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 transition-all shadow-xl"
        >
          <Plus size={22} /> إضافة مشروع جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {projects.map((project, index) => {
   const isExpanded = expandedProjects.includes(project.id); 
  const desc = project.description || "لا يوجد وصف متوفر لهذا المشروع.";
          return (
            <div key={project.id || index} className="group bg-[#0f172a] border border-slate-800/50 rounded-[3rem] overflow-hidden shadow-2xl transition-all duration-500 hover:border-sky-500/30">
              
              <div className="relative h-60 bg-slate-900 overflow-hidden">
                {project.image_url ? (
                 // ابحث عن وسم الـ <img> داخل الـ map واستبدله بهذا:
<img 
  src={getImageUrl(project.image_url)} // حذفنا الجزء الخاص بـ ?t= الوقت هنا
  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
  alt={project.title}
  onError={(e) => {
    if (!e.target.triedDirect) {
      e.target.triedDirect = true;
      e.target.src = `${STORAGE_URL}/${project.image_url}`;
    } else {
      e.target.src = 'https://ui-avatars.com/api/?name=Project&background=020617&color=38bdf8&size=500';
    }
  }}
/>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-700">
                     <Folder size={48} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-90"></div>
              </div>

              <div className="p-8 -mt-12 relative z-10">
                <h3 className="text-2xl font-black text-white mb-3 group-hover:text-sky-400 transition-colors">
                  {project.title || project.project_title}
                </h3>
                
                <div className="flex gap-2 items-start mb-4">
                  <Info size={16} className="text-slate-600 mt-1 shrink-0" />
                  {/* --- الإضافة (3): تطبيق التمدد على الوصف --- */}
                  <div className="flex-grow">
                <p className={`text-slate-400 text-sm leading-relaxed ${!isExpanded ? 'line-clamp-3' : ''}`}>
       {desc}
    </p>
                    {desc.length > 120 && (
                      <button 
                        onClick={() => toggleDescription(project.id)}
                        className="text-sky-500 text-xs font-bold mt-2 hover:text-white transition-colors"
                      >
                        {isExpanded ? 'عرض أقل' : 'قراءة المزيد...'}
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase">
                     <Hash size={12} className="text-sky-500" />
                 إعلان
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-800/50">
                  <a 
                    href={project.link_location} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center gap-2 text-sm font-bold text-sky-500 hover:text-white transition-all bg-sky-500/5 hover:bg-sky-500 px-4 py-2 rounded-xl"
                  >
                    <Globe size={16} /> معاينة
                  </a>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setEditingProject(project)}
                      className="p-2.5 bg-slate-900/50 text-slate-400 hover:text-sky-500 rounded-xl border border-slate-800 transition-all hover:border-sky-500/50"
                      title="تعديل المشروع"
                    >
                      <Edit3 size={18} />
                    </button>

                    <button 
                      onClick={() => handleDelete(project.id)} 
                      className="p-2.5 bg-slate-900/50 text-slate-400 hover:text-rose-500 rounded-xl border border-slate-800 transition-all hover:border-rose-500/50"
                      title="حذف المشروع"
                    >
                      <Trash2 size={18} />
                    </button>
                    
                  </div>
                </div>
              </div>
              
            </div>
            
          );
        })}
      </div>
    </div>
  );
};

export default ProjectsSection;