import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

const AdminLayout = () => {
  // جلب التوكن من التخزين المحلي
  const token = localStorage.getItem('token'); 

  // إذا لم يوجد توكن، ارجعه لصفحة تسجيل الدخول
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="admin-layout">
      {/* هنا لا توجد ناف بار عامة، فقط محتوى الداش بورد */}
      <Outlet /> 
    </div>
  );
};

export default AdminLayout;