import { motion } from 'framer-motion';
import { Phone, MessageCircle } from 'lucide-react';

const TopBanner = () => {
  // النص الذي طلبته
  const contactText = "contact me by these following numbers : 776480137 - 711603121";

  return (
    <div className="fixed top-0 w-full z-[120] bg-[#38bdf8] py-1.5 overflow-hidden shadow-[0_0_20px_rgba(56,189,248,0.5)] border-b border-black/10">
      <div className="flex whitespace-nowrap">
        {/* شريط الحركة اللانهائية */}
        <motion.div
          animate={{ x: ["0%", "-50%"] }} // يتحرك من اليمين لليسار (أو العكس حسب الاتجاه)
          transition={{
            ease: "linear",
            duration: 15, // سرعة الحركة (كلما قل الرقم زادت السرعة)
            repeat: Infinity,
          }}
          className="flex items-center gap-12 text-[#0f172a] font-black text-sm md:text-base"
        >
          {/* نكرر الجملة عدة مرات لضمان عدم وجود فراغ في الشريط أثناء الدوران */}
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="flex items-center gap-2">
                <Phone size={16} fill="#0f172a" />
                {contactText}
              </span>
              <span className="opacity-30"> | </span>
              <span className="flex items-center gap-2">
                <MessageCircle size={16} fill="#0f172a" />
          Always in WhatsApp 24 hours in week
              </span>
              {/* <span className="text-lg"></span> */}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default TopBanner;