"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Phone,
  Save,
  ShieldCheck,
  Image,
} from "lucide-react";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("profile");

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setProfileData({
        name: session.user.name || "",
        email: session.user.email || "",
        phone: "+20 100 000 0000", // Dummy phone, you can fetch real one from DB
      });
    }
  }, [session]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
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

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert("تم تحديث بيانات الحساب بنجاح! (محاكاة)");
    }, 1000);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("كلمة المرور الجديدة غير متطابقة.");
      return;
    }
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert("تم تغيير كلمة المرور بنجاح! (محاكاة)");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }, 1000);
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
              {session?.user?.image ? (
                <img
                  src={session.user.image}
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
                {session?.user?.name || "المستخدم"}
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
              <button
                onClick={() => setActiveTab("security")}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-all ${
                  activeTab === "security"
                    ? "bg-orange-50 text-orange-600 border border-orange-100"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span>الرقم السري والأمان</span>
                <ShieldCheck size={18} />
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

                  <div className="pt-6 border-t border-gray-100 flex justify-end">
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

            {activeTab === "security" && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900">
                    تغيير كلمة المرور
                  </h3>
                  <p className="text-gray-500 mt-1 text-sm font-medium">
                    احرص على استخدام كلمة مرور قوية للحفاظ على أمان حسابك.
                  </p>
                </div>

                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      كلمة المرور الحالية
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                        <Lock size={20} />
                      </div>
                      <input
                        type="password"
                        required
                        dir="ltr"
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            currentPassword: e.target.value,
                          })
                        }
                        className="block w-full text-right pr-10 pl-3 py-3 border border-gray-200 rounded-xl focus:ring-orange-500 focus:border-orange-500 bg-gray-50 focus:bg-white text-black font-medium transition-colors"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      كلمة المرور الجديدة
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                        <Lock size={20} />
                      </div>
                      <input
                        type="password"
                        required
                        dir="ltr"
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                        className="block w-full text-right pr-10 pl-3 py-3 border border-gray-200 rounded-xl focus:ring-orange-500 focus:border-orange-500 bg-gray-50 focus:bg-white text-black font-medium transition-colors"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      تأكيد كلمة المرور الجديدة
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                        <Lock size={20} />
                      </div>
                      <input
                        type="password"
                        required
                        dir="ltr"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="block w-full text-right pr-10 pl-3 py-3 border border-gray-200 rounded-xl focus:ring-orange-500 focus:border-orange-500 bg-gray-50 focus:bg-white text-black font-medium transition-colors"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-100 flex justify-end">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-colors flex items-center gap-2 disabled:opacity-70"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <ShieldCheck size={20} />
                      )}
                      تحديث الأمان
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
