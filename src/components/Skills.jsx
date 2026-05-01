import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getMyInfo } from './api';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // رابط السيرفر الأساسي للصور
  const STORAGE_URL = "http://127.0.0.1:8000";

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const result = await getMyInfo();
        // جلب الخدمات من داخل الـ data
        const servicesData = result.data?.services || [];
        setServices(servicesData);
      } catch (error) {
        console.error("Error loading services:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading || services.length === 0) return null;

  return (
    <section id="services" className="py-24 bg-[#020617] text-white px-10 text-right" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-[#38bdf8] font-mono tracking-widest uppercase text-sm mb-4"
          >
            ماذا نقدم؟
          </motion.h2>
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black"
          >
            خدماتنا الإبداعية
          </motion.h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="relative group overflow-hidden rounded-3xl bg-slate-900 border border-white/5 hover:border-cyan-500/50 transition-all duration-500"
            >
              <div className="flex flex-col md:flex-row items-center">
                {/* قسم الصورة */}
                <div className="w-full md:w-2/5 h-48 md:h-64 overflow-hidden">
                  <img 
                    src={`${STORAGE_URL}/storage/${service.image}`}
                    alt={service.service_title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-[#0f172a] via-transparent to-transparent hidden md:block" />
                </div>

                {/* قسم النص */}
                <div className="p-8 w-full md:w-3/5">
                  <div className="mb-4 inline-block px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-bold tracking-widest uppercase">
                    SERVICE_0{index + 1}
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors">
                    {service.service_title}
                  </h4>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    نقدم حلولاً مبتكرة في {service.service_title} تضمن لك الوصول لأكبر شريحة من الجمهور المستهدف وبأعلى جودة ممكنة.
                  </p>
                </div>
              </div>

              {/* تأثير التوهج عند التحويم */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur opacity-0 group-hover:opacity-100 transition duration-500 -z-10" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;