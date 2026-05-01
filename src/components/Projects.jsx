import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, ArrowUpRight, Image as ImageIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { getMyInfo } from './api';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  // مصفوفة لتخزين المعرفات (IDs) للمشاريع التي تم فتح "قراءة المزيد" لها
  const [expandedProjects, setExpandedProjects] = useState({});

  const STORAGE_URL = "http://127.0.0.1:8000";

  const toggleExpand = (id) => {
    setExpandedProjects(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const result = await getMyInfo();
        const projectsData = result.data?.projects || [];
        setProjects(projectsData);
      } catch (error) {
        console.error("Error loading projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading || projects.length === 0) return null;

  return (
    <section id="projects" className="py-32 bg-[#020617] text-white px-8 md:px-16 relative overflow-hidden" dir="rtl">
      
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-600/5 blur-[120px] rounded-full -z-10 animate-pulse"></div>

      <div className="max-w-7xl mx-auto text-right">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl space-y-4">
            <motion.span className="text-[#38bdf8] font-mono text-sm tracking-[0.3em] uppercase font-bold">
              معرض الأعمال
            </motion.span>
            <motion.h2 className="text-5xl md:text-7xl font-black leading-tight">
              مشاريعنا <br /> <span className="text-gray-500 italic">الإبداعية</span>
            </motion.h2>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 items-start">
          {projects.map((project, index) => {
            const isExpanded = expandedProjects[project.id];
            
            return (
              <motion.div
                key={project.id || index}
                layout // يجعل الانتقال عند فتح النص انسيابياً
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="group relative flex flex-col bg-white/[0.02] border border-white/5 rounded-[3rem] overflow-hidden hover:bg-white/[0.04] hover:border-[#38bdf8]/30 transition-all duration-500 shadow-2xl"
              >
                {/* قسم الصورة */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={`${STORAGE_URL}/storage/${project.image_url}`} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000"
                  />
                  <div className="absolute inset-0 bg-[#0f172a]/90 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-6 backdrop-blur-sm">
                    <motion.a 
                      whileHover={{ scale: 1.1 }}
                      href={project.link_location} 
                      target="_blank"
                      className="p-5 bg-[#38bdf8] text-[#0f172a] rounded-2xl"
                    >
                      <Eye size={22} />
                    </motion.a>
                  </div>
                </div>

                {/* محتوى النص */}
                <div className="p-10 flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[#38bdf8] text-[10px] font-black tracking-widest uppercase py-1 px-3 bg-[#38bdf8]/10 rounded-lg">
                      <ImageIcon size={12} />
                      حملة إعلانية
                    </span>
                  </div>
                  
                  <h4 className="text-2xl font-black group-hover:text-[#38bdf8] transition-colors leading-tight">
                    {project.title}
                  </h4>
                  
                  <div className="relative">
                    <p className={`text-gray-400 text-sm leading-relaxed transition-all duration-500 ${isExpanded ? '' : 'line-clamp-3'}`}>
                      {project.description}
                    </p>
                    
                    {/* زر قراءة المزيد */}
                    <button 
                      onClick={() => toggleExpand(project.id)}
                      className="mt-3 flex items-center gap-1 text-[#38bdf8] text-xs font-bold hover:underline"
                    >
                      {isExpanded ? (
                        <> عرض أقل <ChevronUp size={14} /> </>
                      ) : (
                        <> قراءة المزيد <ChevronDown size={14} /> </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Projects;