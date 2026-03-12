"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Mail,
  Lock,
  LogIn,
  Chrome,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const { login } = useAuthContext();
  const router = useRouter();
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

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    try {
      const res = await fetch(
        "https://express.prosental.com/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ email: forgotEmail }),
        },
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok)
        throw new Error(data.message || "حدث خطأ أثناء إرسال البريد");
      showPopup("تم إرسال رابط إعادة التعيين لبريدك الإلكتروني!", "success");
      setShowForgotModal(false);
      setForgotEmail("");
    } catch (err) {
      showPopup(err.message, "error");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        let callbackUrl = "/";
        if (typeof window !== "undefined") {
          const params = new URLSearchParams(window.location.search);
          callbackUrl = params.get("callbackUrl") || "/";
        }
        router.push(callbackUrl);
      } else {
        showPopup(result.error || "بيانات الدخول غير صحيحة", "error");
      }
    } catch (error) {
      showPopup(error.message || "حدث خطأ أثناء الاتصال بالخادم", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mt-6 text-center text-3xl font-extrabold text-gray-900"
        >
          تسجيل الدخول لحسابك
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-2 text-center text-sm text-gray-600 font-medium"
        >
          أو{" "}
          <Link
            href={
              typeof window !== "undefined" &&
              new URLSearchParams(window.location.search).get("callbackUrl")
                ? `/signup?callbackUrl=${encodeURIComponent(new URLSearchParams(window.location.search).get("callbackUrl"))}`
                : "/signup"
            }
            className="font-bold text-orange-500 hover:text-orange-600 transition-colors"
          >
            قم بإنشاء حساب جديد مجاناً
          </Link>
        </motion.p>
      </div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white py-10 px-4 shadow-2xl sm:rounded-3xl border border-gray-100 sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
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
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="block w-full pr-10 pl-3 py-3 border border-gray-200 rounded-xl focus:ring-orange-500 focus:border-orange-500 bg-gray-50 focus:bg-white text-black font-medium transition-colors"
                  placeholder="name@example.com"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="block w-full pr-10 pl-3 py-3 border border-gray-200 rounded-xl focus:ring-orange-500 focus:border-orange-500 bg-gray-50 focus:bg-white text-black font-medium transition-colors"
                  placeholder="••••••••"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="font-bold text-orange-500 hover:text-orange-600 transition-colors"
                >
                  نسيت كلمة المرور؟
                </button>
              </div>
            </div>

            <div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    جارِ الدخول...{" "}
                    <Package className="animate-spin" size={20} />
                  </span>
                ) : (
                  <>
                    تسجيل الدخول{" "}
                    <LogIn size={20} className="transform scale-x-[-1]" />
                  </>
                )}
              </motion.button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">
                  أو المتابعة باستخدام
                </span>
              </div>
            </div>

            <div className="mt-6">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  let callbackUrl = "/";
                  if (typeof window !== "undefined") {
                    const params = new URLSearchParams(window.location.search);
                    callbackUrl = params.get("callbackUrl") || "/";
                  }
                  signIn("google", { callbackUrl });
                }}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all border-b-4 focus:outline-none"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="w-6 h-6"
                />
                الدخول بواسطة حساب جوجل
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowForgotModal(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-extrabold text-gray-900">
                  نسيت كلمة المرور؟
                </h2>
                <button
                  onClick={() => setShowForgotModal(false)}
                  className="text-gray-400 hover:text-black transition-colors"
                >
                  <XCircle size={24} />
                </button>
              </div>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور
                فوراً.
              </p>
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                    <Mail size={20} />
                  </div>
                  <input
                    type="email"
                    required
                    dir="ltr"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="block w-full pr-10 pl-3 py-3 border border-gray-200 rounded-xl focus:ring-orange-500 focus:border-orange-500 bg-gray-50 text-black font-medium transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {forgotLoading ? (
                    <>
                      <Package className="animate-spin" size={20} /> جاري
                      الإرسال...
                    </>
                  ) : (
                    "إرسال رابط إعادة التعيين"
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
