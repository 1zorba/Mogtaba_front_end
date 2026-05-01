// src/api.js
import axios from 'axios';  
const BASE_URL = 'https://mogtaba-backend.onrender.com/api';
export const createProject = async (projectData) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();

    // مطابقة الحقول مع الـ JSON الخاص بك
    formData.append('title', projectData.project_title);
    formData.append('description', projectData.description || '');
    formData.append('link_location', projectData.link_location || '');

    // إرسال الصورة باسم الحقل المطلوب في لارافيل
    if (projectData.image) {
        formData.append('image_url', projectData.image);
    }

    return await axios.post(`${BASE_URL}/createProject`, formData, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        }
    });
};
 // جلب بيانات المستخدم (تأكد من حرف الـ z في النهاية)
export const getUserData = async () => {
    const token = localStorage.getItem("token");
    return await axios.get(`${BASE_URL}/getUserByResource`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};

// تحديث البروفايل
 
export const updateProfile = async (profileData) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();

    // إضافة الحقول
    formData.append('job_title', profileData.job_title || '');
    formData.append('bio', profileData.bio || '');
    formData.append('borrow', profileData.borrow || '');
    formData.append('phone', profileData.phone || '');
    formData.append('social_links', profileData.social_links || '');
    formData.append('cv_url', profileData.cv_url || '');

    // إخبار لارافل أن العملية PUT رغم أن الطلب POST (لحل مشكلة رفع الصور)
    formData.append('_method', 'PUT');

    // إضافة الصورة فقط إذا تم اختيار ملف جديد
    if (profileData.profile_image instanceof File) {
        formData.append('profile_image', profileData.profile_image);
    }

    return await axios.post(`${BASE_URL}/UpdateProfile`, formData, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        }
    });
};
 

// دالة جلب جميع الخدمات من الباك إيند
export const getAllServices = async () => {
    try {
        const token = localStorage.getItem("token"); // جلب التوكن للتأكد من الهوية
        const response = await axios.get(`${BASE_URL}/getAllServices`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response; // سيعيد لك مصفوفة الخدمات التي أرسلها لارافل
    } catch (error) {
        console.error("Error fetching services:", error);
        throw error;
    }
};

// ✅ أبقِ على هذه النسخة (التي تستقبل formData)
export const createService = async (formData) => {
    const token = localStorage.getItem("token");
    return await axios.post(`${BASE_URL}/create_service`, formData, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data' 
        }
    });
};


 


export const updateService = async (id, formData) => {
    // 1. يجب جلب التوكين أولاً
    const token = localStorage.getItem("token"); 

    return await axios.post(`${BASE_URL}/update_services/${id}`, formData, { 
        headers: {
            // 2. هنا الـ token هو متغير يحمل النص، والـ Backticks تدمجه مع كلمة Bearer
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'multipart/form-data'
        }
    });
};

// ❌ قم بحذف الدالة الأخرى التي تبدأ في السطر 94 
// export const createService = async (title, imageFile) => { ... }

export const deleteService = async (id) => {
    const token = localStorage.getItem("token");
    return await axios.delete(`${BASE_URL}/DeleteService/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};

export const updateProject = async (id, projectData) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();

    // إرسال الحقول النصية
    formData.append('title', projectData.title);
    formData.append('description', projectData.description || '');
    formData.append('link_location', projectData.link_location || '');
    
    // إخبار لارافل أنها عملية تحديث
    formData.append('_method', 'PUT');

    // إرسال الصورة فقط إذا اختار المستخدم ملفاً جديداً
    if (projectData.image_url instanceof File) {
        formData.append('image_url', projectData.image_url);
    }

    return await axios.post(`${BASE_URL}/UpdateProject/${id}`, formData, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        }
    });
};

 


export const getProjects = async () => {
    const token = localStorage.getItem("token");
    return await axios.get(`${BASE_URL}/getUserByResource`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
};


// دالة حذف مشروع في ملف api.js
export const deleteProject = async (id) => {
    const token = localStorage.getItem("token");
    return await axios.delete(`${BASE_URL}/DeleteProject/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};



export const createPoem = async (formData) => {
    const token = localStorage.getItem("token");
    return await axios.post(`${BASE_URL}/add_poem`, formData, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const getPoems = async () => {
    const token = localStorage.getItem("token");
    return await axios.get(`${BASE_URL}/get_poems`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};


// أضف هذه الدالة داخل ملف api.js
export const deletePoem = async (id) => {
    const token = localStorage.getItem("token");
    return await axios.delete(`${BASE_URL}/delete_poem/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};


 
 
export const getMyInfo = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/getMyInfo`);
        return response.data;  
    } catch (error) {
        console.error("Axios Error:", error);
        throw error;
    }
};
 
 
 
export const showPoems = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/showPoems`);
        // بناءً على الهيكل الذي أرسلته، البيانات موجودة داخل message
        return response.data.message; 
    } catch (error) {
        console.error("Error fetching poems:", error);
        throw error;
    }
};

// ملف /src/components/api.js

// ملف /src/components/api.js

export const updatePoem = async (id, data) => {
    // جلب التوكن (تأكد من الاسم الذي استخدمته عند التخزين، غالباً 'token' أو 'access_token')
    const token = localStorage.getItem('token'); 

    return await axios.post(`https://mogtaba-backend.onrender.com/apiUpdatePoem/${id}`, data, {
        headers: { 
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}` // إرسال التوكن لتعريف السيرفر بهويتك
        }
    });
};


export const getContacts = () => axios.get(`${BASE_URL}/getMessages`);

export const sendMessage = (data) => axios.post(`${BASE_URL}/sendMessage`, data);


export const deleteMessage = async (id) => {
     return await axios.delete(`${BASE_URL}/Delete/${id}`, {
      
    });
};