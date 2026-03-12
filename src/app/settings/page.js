"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Phone,
  Save,
  ShieldCheck,
  Image,
  MapPin,
  Home,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const { user, isLoading: contextLoading, token } = useAuthContext();
  const isAuthenticated = !!session || !!user;
  const isLoadingSession = status === "loading" || contextLoading;
  const currentUser = session?.user || user;
  const [activeTab, setActiveTab] = useState("profile");

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    area: "",
    detailed_address: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [popup, setPopup] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showPopup = (message, type = "success") => {
    setPopup({ show: true, message, type });
    setTimeout(() => {
      setPopup((prev) => ({ ...prev, show: false }));
    }, 4000);
  };

  useEffect(() => {
    async function fetchMe() {
      if (!token) return;
      try {
        const res = await fetch("https://express.prosental.com/api/auth/me", {
          method: "post",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setProfileData((prev) => ({
            ...prev,
            name: data.name || prev.name,
            email: data.email || prev.email,
            phone: data.phone || prev.phone,
            area: data.area || prev.area,
            detailed_address: data.detailed_address || prev.detailed_address,
          }));
        }
      } catch (e) {
        console.error("Failed fetching user data", e);
      }
    }
    fetchMe();
  }, [token]);

  useEffect(() => {
    if (currentUser) {
      setProfileData((prev) => ({
        ...prev,
        name: currentUser.name || currentUser.email?.split("@")[0] || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        area: currentUser.area || "",
        detailed_address: currentUser.detailed_address || "",
      }));
    }
  }, [currentUser]);

  if (isLoadingSession) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!isLoadingSession && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
        <ShieldCheck size={64} className="text-orange-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          غير مصرح لك بالدخول
        </h1>
        <p className="text-gray-500 mb-6">
          يرجى تسجيل الدخول أولاً للوصول إلى إعدادات الحساب.
        </p>
        <a
          href="/login"
          className="bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors"
        >
          الذهاب لتسجيل الدخول
        </a>
      </div>
    );
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const body = {
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
      };
      // Only include password if the user typed one
      if (profileData.password) {
        body.password = profileData.password;
      }
      const res = await fetch(
        "https://express.prosental.com/api/auth/profile/edit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        },
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "فشل تحديث البيانات");
      showPopup("تم تحديث بيانات الحساب بنجاح!", "success");
      // Clear password field after save
      setProfileData((prev) => ({ ...prev, password: "" }));
    } catch (error) {
      showPopup(error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold text-gray-900"
          >
            إعدادات الحساب
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-2 text-lg text-gray-600 font-medium"
          >
            إدارة بياناتك الشخصية وتفضيلات الأمان
          </motion.p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
          {/* Sidebar */}
          <div className="md:w-1/3 bg-gray-50 border-b md:border-b-0 md:border-l border-gray-100 p-6 flex flex-col items-center md:items-start text-right">
            <div className="w-full flex flex-col items-center pb-8 border-b border-gray-200 mb-6 relative group cursor-pointer">
              {currentUser?.image ? (
                <img
                  src={currentUser.image}
                  alt="Profile Avatar"
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover mb-4"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center border-4 border-white shadow-lg mb-4 relative overflow-hidden">
                  <User size={40} />
                </div>
              )}
              <div className="absolute top-[20%] right-[35%] w-8 h-8 bg-black text-white rounded-full flex items-center justify-center border-2 border-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                <Image size={14} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                {profileData.name ||
                  currentUser?.name ||
                  currentUser?.email?.split("@")[0] ||
                  "المستخدم"}
              </h2>
              <p className="text-sm text-gray-500 font-medium">عضو مسجل</p>
            </div>

            <nav className="w-full space-y-2">
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-all ${
                  activeTab === "profile"
                    ? "bg-orange-50 text-orange-600 border border-orange-100"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span>المعلومات الشخصية</span>
                <User size={18} />
              </button>
            </nav>
          </div>

          {/* Content Area */}
          <div className="p-8 md:p-12 md:w-2/3 bg-white">
            {activeTab === "profile" && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900">
                    المعلومات الشخصية
                  </h3>
                  <p className="text-gray-500 mt-1 text-sm font-medium">
                    قم بتحديث بياناتك لتسهيل وصول الشحنات لك.
                  </p>
                </div>

                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      الاسم بالكامل
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                        <User size={20} />
                      </div>
                      <input
                        type="text"
                        required
                        value={profileData.name}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            name: e.target.value,
                          })
                        }
                        className="block w-full pr-10 pl-3 py-3 border border-gray-200 rounded-xl focus:ring-orange-500 focus:border-orange-500 bg-gray-50 focus:bg-white text-black font-medium transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      البريد الإلكتروني
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                        <Mail size={20} />
                      </div>
                      <input
                        type="email"
                        required
                        dir="ltr"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            email: e.target.value,
                          })
                        }
                        className="block w-full text-right pr-10 pl-3 py-3 border border-gray-200 rounded-xl focus:ring-orange-500 focus:border-orange-500 bg-gray-100 text-gray-500 font-medium cursor-not-allowed"
                        disabled
                        title="لا يمكن تغيير البريد الإلكتروني"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      رقم الهاتف الجوال
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                        <Phone size={20} />
                      </div>
                      <input
                        type="tel"
                        dir="ltr"
                        value={profileData.phone}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            phone: e.target.value,
                          })
                        }
                        className="block w-full text-right pr-10 pl-3 py-3 border border-gray-200 rounded-xl focus:ring-orange-500 focus:border-orange-500 bg-gray-50 focus:bg-white text-black font-medium transition-colors"
                      />
                    </div>
                  </div>

                  {/* Password field - optional */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      كلمة المرور الجديدة{" "}
                      <span className="text-gray-400 font-normal text-xs">
                        (اختياري — اتركه فارغاً إذا لم ترد تغييره)
                      </span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                        <Lock size={20} />
                      </div>
                      <input
                        type="password"
                        dir="ltr"
                        value={profileData.password}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            password: e.target.value,
                          })
                        }
                        className="block w-full pr-10 pl-3 py-3 border border-gray-200 rounded-xl focus:ring-orange-500 focus:border-orange-500 bg-gray-50 focus:bg-white text-black font-medium transition-colors"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div className="pt-6 flex justify-end">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-colors flex items-center gap-2 disabled:opacity-70"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Save size={20} />
                      )}
                      حفظ التغييرات
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Toast Notification Popup */}
      <AnimatePresence>
        {popup.show && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center min-w-[300px] justify-center gap-3 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-md font-bold text-white border-2 border-white/20 ${
              popup.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {popup.type === "success" ? (
              <CheckCircle size={24} className="text-white drop-shadow-sm" />
            ) : (
              <XCircle size={24} className="text-white drop-shadow-sm" />
            )}
            <p className="text-sm md:text-base drop-shadow-sm">
              {popup.message}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
