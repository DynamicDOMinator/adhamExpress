"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Package, CheckCircle, XCircle, ShieldCheck } from "lucide-react";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [formData, setFormData] = useState({
    password: "",
    password_confirmation: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password_confirmation) {
      showPopup("كلمة المرور وتأكيدها غير متطابقتين.", "error");
      return;
    }
    if (formData.password.length < 8) {
      showPopup("يجب أن تكون كلمة المرور 8 أحرف على الأقل.", "error");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(
        "https://express.prosental.com/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            token,
            email,
            password: formData.password,
            password_confirmation: formData.password_confirmation,
          }),
        },
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok)
        throw new Error(
          data.message || "حدث خطأ أثناء إعادة تعيين كلمة المرور",
        );
      showPopup(
        "تم إعادة تعيين كلمة المرور بنجاح! سيتم توجيهك لتسجيل الدخول.",
        "success",
      );
      setTimeout(() => router.push("/login"), 2500);
    } catch (err) {
      showPopup(err.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
        <XCircle size={64} className="text-red-400 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">رابط غير صالح</h1>
        <p className="text-gray-500 mb-6">
          رابط إعادة تعيين كلمة المرور غير صالح أو مكتمل. يرجى طلب رابط جديد.
        </p>
        <a
          href="/login"
          className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors"
        >
          العودة لتسجيل الدخول
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="flex justify-center mb-6"
        >
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
            <ShieldCheck size={32} />
          </div>
        </motion.div>
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center text-3xl font-extrabold text-gray-900"
        >
          إعادة تعيين كلمة المرور
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-2 text-center text-sm text-gray-600 font-medium"
        >
          أدخل كلمة المرور الجديدة لحسابك
        </motion.p>
      </div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white py-10 px-4 shadow-2xl sm:rounded-3xl border border-gray-100 sm:px-10">
          {/* Email display */}
          <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200 text-center">
            <p className="text-xs text-gray-400 font-medium mb-1">
              إعادة التعيين لـ
            </p>
            <p className="font-bold text-gray-800" dir="ltr">
              {email}
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
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
                  minLength={8}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="block w-full pr-10 pl-3 py-3 border border-gray-200 rounded-xl focus:ring-orange-500 focus:border-orange-500 bg-gray-50 focus:bg-white text-black font-medium transition-colors"
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
                  minLength={8}
                  value={formData.password_confirmation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      password_confirmation: e.target.value,
                    })
                  }
                  className="block w-full pr-10 pl-3 py-3 border border-gray-200 rounded-xl focus:ring-orange-500 focus:border-orange-500 bg-gray-50 focus:bg-white text-black font-medium transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  جاري التحديث... <Package className="animate-spin" size={20} />
                </span>
              ) : (
                <>
                  <ShieldCheck size={20} /> تعيين كلمة المرور الجديدة
                </>
              )}
            </motion.button>

            <div className="text-center">
              <a
                href="/login"
                className="text-sm font-bold text-gray-500 hover:text-orange-500 transition-colors"
              >
                العودة لتسجيل الدخول
              </a>
            </div>
          </form>
        </div>
      </motion.div>

      {/* Toast Notification */}
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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Package className="animate-spin text-orange-500" size={48} />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
