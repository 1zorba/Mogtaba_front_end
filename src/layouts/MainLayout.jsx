import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TopBanner from '../components/TopBanner';
import Poems from '../components/Poems';
 
const MainLayout = () => {
  return (
    <div className="bg-grid min-h-screen">
      <Navbar />
      <TopBanner />
       <Outlet /> {/* هنا ستظهر صفحة Hero والمشاريع */}
       <footer className="py-10 text-center text-slate-600 font-mono text-xs uppercase">
        <p>[ system.status: online ]</p>
        <Link 
          to="/the-vault" 
          className="mt-4 inline-block opacity-20 hover:opacity-100 transition-opacity text-[10px] text-slate-500"
        >
          .admin_portal
        </Link>
      </footer>
    </div>
  );
};

export default MainLayout;