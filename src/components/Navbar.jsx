import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, Code, Briefcase, Mail, Menu, X, Terminal, Book } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { name: 'Home', targetId: 'hero', icon: Code, type: 'scroll' },
     { name: 'Skills', targetId: 'skills', icon: Terminal, type: 'scroll' },
    { name: 'Projects', targetId: 'projects', icon: Briefcase, type: 'scroll' },
    { name: 'Poems', targetId: '/poems', icon: Book, type: 'link' }, // رابط صفحة
    { name: 'Contact', targetId: 'contact', icon: Mail, type: 'scroll' },
  ];

  const handleAction = (link) => {
    setIsOpen(false);
    if (link.type === 'link') {
      navigate(link.targetId);
    } else {
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          document.getElementById(link.targetId)?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      } else {
        document.getElementById(link.targetId)?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="fixed top-7 w-full z-[100] bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/5 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="text-2xl font-black text-[#38bdf8] flex items-center gap-2">
          <div className="w-8 h-8 bg-[#38bdf8]/10 rounded-lg flex items-center justify-center border border-[#38bdf8]/30 text-sm">M</div>
         Mujtaba Manan
        </Link>

        <div className="hidden lg:flex items-center gap-2">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleAction(link)}
              className="px-5 py-2 rounded-full text-gray-300 text-sm font-bold hover:text-[#38bdf8] transition-all flex items-center gap-2"
            >
              <link.icon size={16} />
              {link.name}
            </button>
          ))}
        </div>

        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-[#38bdf8]">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="lg:hidden bg-[#0f172a] border-b border-white/5">
            <div className="p-6 space-y-4">
              {navLinks.map((link) => (
                <button key={link.name} onClick={() => handleAction(link)} className="w-full flex items-center justify-between text-gray-300 p-4 hover:bg-[#38bdf8]/5 rounded-xl">
                  <link.icon size={22} />
                  <span>{link.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;