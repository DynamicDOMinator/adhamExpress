"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Package, Mail, Lock, User, Phone, CheckCircle2 } from "lucide-react";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("كلمة المرور وتأكيد كلمة المرور غير متطابقين.");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate registering then login right away using mock provider
      const result = await signIn("credentials", {
        redirect: true,
        email: formData.email,
        password: formData.password,
        callbackUrl: "/",
      });

      if (result?.error) {
        alert("حدث خطأ أثناء إنشاء الحساب، يرجى المحاولة لاحقاً");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
  

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mt-6 text-center text-3xl font-extrabold text-gray-900"
        >
         انشاء حساب جديد
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-2 text-center text-sm text-gray-600 font-medium"
        >
          هل لديك حساب بالفعل؟{" "}
          <Link
            href="/login"
            className="font-bold text-orange-500 hover:text-orange-600 transition-colors"
          >
            قم بتسجيل الدخول من هنا
          </Link>
        </motion.p>
      </div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg"
      >
        <div className="bg-white py-10 px-4 shadow-2xl sm:rounded-3xl border border-gray-100 sm:px-10">
          <div className="mb-8">
            <motion.button
              whileHover={{ scale: 1.01, y: -2 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all border-b-4 focus:outline-none"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-6 h-6"
              />
              التسجيل بحساب جوجل الخاص بك
            </motion.button>
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">
                أو عبر البريد الإلكتروني
              </span>
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  الاسم 
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                    <User size={20} />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    placeholder="أدخل اسمك"
                    className="block w-full pr-10 pl-3 py-3 border border-gray-200 rounded-xl focus:ring-orange-500 focus:border-orange-500 bg-gray-50 focus:bg-white text-black font-medium transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  رقم الجوال
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                    <Phone size={20} />
                  </div>
                  <input
                    type="tel"
                    required
                    dir="ltr"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+201xxxxxx"
                    className="block w-full pr-10 pl-3 py-3 border border-gray-200 rounded-xl focus:ring-orange-500 focus:border-orange-500 bg-gray-50 focus:bg-white text-black font-medium transition-colors text-right"
                  />
                </div>
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
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="name@example.com"
                  className="block w-full pr-10 pl-3 py-3 border border-gray-200 rounded-xl focus:ring-orange-500 focus:border-orange-500 bg-gray-50 focus:bg-white text-black font-medium transition-colors"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                    placeholder="••••••••"
                    className="block w-full pr-10 pl-3 py-3 border border-gray-200 rounded-xl focus:ring-orange-500 focus:border-orange-500 bg-gray-50 focus:bg-white text-black font-medium transition-colors"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  تأكيد كلمة المرور
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                    <Lock size={20} />
                  </div>
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    placeholder="••••••••"
                    className="block w-full pr-10 pl-3 py-3 border border-gray-200 rounded-xl focus:ring-orange-500 focus:border-orange-500 bg-gray-50 focus:bg-white text-black font-medium transition-colors"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    جاري التسجيل...{" "}
                    <Package className="animate-spin" size={20} />
                  </span>
                ) : (
                  <>
                 <CheckCircle2 size={20} />   إنشاء الحساب 
                  </>
                )}
              </motion.button>
             
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
