import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; 

// الـ Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// الصفحات والمكونات
import Hero from './components/Hero';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contacts from './components/Contact';
import Login from "./Login.jsx"; 
import Dashboard from './components/Dashboard.jsx';
import PoemsPage from '/src/components/pages/PoemsPage.jsx'; // الصفحة الجديدة

function App() {
  return (
    <Router>
      <Routes>
        {/* المجموعة الأولى: الموقع العام */}
        <Route element={<MainLayout />}>
          <Route path="/" element={
            <main className="container mx-auto px-6">
              <section id="hero"><Hero /></section>
              <section id="skills"><Skills /></section>
              <section id="projects"><Projects /></section>
              <section id="contact"><Contacts /></section>
            </main>
          } />
          
          {/* مسار صفحة القصائد المنفصلة */}
          <Route path="/poems" element={<PoemsPage />} />
          
          <Route path="/the-vault" element={<Login />} />
        </Route>

        {/* المجموعة الثانية: لوحة التحكم */}
        <Route element={<AdminLayout />}>
          <Route path="/Dashboard" element={<Dashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;