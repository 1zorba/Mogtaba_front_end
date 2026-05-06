import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // إرسال الطلب إلى سيرفر لارافل الخاص بك
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/login`, {
        params: { email, password },
      });

      if (response.data.Token) {
        // 1. تخزين البيانات في المتصفح
        localStorage.setItem("token", response.data.Token);
        localStorage.setItem("user", JSON.stringify(response.data.User));

        // 2. إظهار رسالة نجاح أنيقة
        Swal.fire({
          icon: "success",
          title: "تم التحقق من الهوية",
          text: `مرحباً بك مجدداً يا ${response.data.User.name}`,
          background: "#0f172a",
          color: "#38bdf8",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });

        // 3. التوجه إلى الداشبورد مباشرة بعد ثانيتين
        setTimeout(() => {
  navigate("/Dashboard"); // تأكد أنها تطابق الـ path في App.js
}, 2000);
      }
    } catch (error) {
      console.error("Login Error:", error);
      
      Swal.fire({
        icon: "error",
        title: "فشل الدخول",
        text: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
        background: "#0f172a",
        color: "#f87171",
        confirmButtonColor: "#38bdf8",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full"></div>
      </div>

      <div className="w-full max-w-md z-10">
        <div className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-2xl border border-slate-800 shadow-2xl transition-all hover:border-blue-500/50">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white tracking-tighter italic">
              ADMIN<span className="text-blue-500">_PORTAL</span>
            </h2>
            <p className="text-slate-400 text-sm mt-2 font-mono">Restricted Access Area</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-slate-300 text-sm mb-2 mr-1">البريد الإلكتروني</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-black/50 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600"
                placeholder="YourEmail@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm mb-2 mr-1">كلمة المرور</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-black/50 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-bold text-white uppercase tracking-widest transition-all ${
                loading 
                ? "bg-slate-700 cursor-not-allowed" 
                : "bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] active:scale-95"
              }`}
            >
              {loading ? "جاري التحقق..." : "تسجيل الدخول"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800 text-center">
            <button 
              onClick={() => navigate("/")}
              className="text-slate-500 hover:text-white text-xs transition-colors"
            >
              ← العودة للمعرض العام
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;