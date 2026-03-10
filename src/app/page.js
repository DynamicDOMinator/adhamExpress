"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Truck,
  Globe,
  Map,
  Package,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const containerVars = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      {/* 1. Hero Section */}
      <section className="relative bg-orange-50 pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-0 -ml-20 -mt-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 -mr-20 -mb-20 w-80 h-80 bg-orange-400/10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVars}
            className="text-center max-w-3xl mx-auto mt-10"
          >
            <motion.span
              variants={itemVars}
              className="inline-block py-1.5 px-6 rounded-full bg-orange-100 text-orange-600 font-bold text-sm mb-6 shadow-sm"
            >
              أسرع خدمات الشحن في مصر 
            </motion.span>

            <motion.h1
              variants={itemVars}
              className="text-5xl md:text-7xl font-extrabold text-black mb-6 leading-tight"
            >
              اشحن بـ <span className="text-orange-500">ثقة وأمان</span>
            </motion.h1>

            <motion.p
              variants={itemVars}
              className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed font-medium"
            >
              استمتع بتوصيل سلس لطردك مع أحدث خدمات التتبع لدينا وأسعار تنافسية
              بالإضافة للوصول العالمي السريع أينما كنت.
            </motion.p>

            <motion.div
              variants={itemVars}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                href="/ship"
                className="group flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-orange-500/30"
              >
                ابدأ الشحن
                <ArrowLeft
                  size={20}
                  className="group-hover:-translate-x-1 transition-transform"
                />
              </Link>
              <Link
                href="/track"
                className="group flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg"
              >
                تتبع طردك
                <Map size={20} className="text-orange-500" />
              </Link>
            </motion.div>

            {/* Quick Tracking Widget */}
            <motion.div
              variants={itemVars}
              className="mt-16 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 max-w-xl mx-auto"
            >
              <div className="flex relative items-center">
                <input
                  type="text"
                  placeholder="رقم التتبع (مثل SF-12345678)"
                  className="w-full bg-gray-50 border-none rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800 pr-14 font-bold"
                />
                <Package className="absolute right-5 text-gray-400" size={24} />
                <button className="absolute left-2 bg-black text-white px-6 py-2 rounded-lg font-bold hover:bg-orange-500 transition-colors">
                  تتبع الآن
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-black mb-4">
              لماذا تختارنا
            </h2>
            <div className="w-24 h-1.5 bg-orange-500 mx-auto rounded-full"></div>
            <p className="mt-6 text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
              نقدم حلول لوجستية رائدة في الصناعة ومصممة بدقة لضمان الموثوقية
              التامة.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <motion.div
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-gray-50 rounded-3xl p-10 border border-gray-100 hover:border-orange-200 transition-all group shadow-sm"
            >
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-500 group-hover:text-white transition-colors shadow-inner">
                <Globe size={32} />
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">
             توصيل موثوق
              </h3>
              <p className="text-gray-600 leading-relaxed font-medium">
           نقدم خدمات توصيل موثوقة تغطي أغلب المناطق داخل مصر مع متابعة مستمرة للشحنة.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-black rounded-3xl p-10 shadow-2xl transition-all border border-gray-800 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-orange-500 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <ShieldCheck size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  أمان 100%
                </h3>
                <p className="text-white leading-relaxed font-medium">
                  من الاستلام للتسليم، جميع طرودك مؤمنة بالكامل ويتم التعامل
                  معها بأقصى درجات العناية.
                </p>
              </div>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-gray-50 rounded-3xl p-10 border border-gray-100 hover:border-orange-200 transition-all group shadow-sm"
            >
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-500 group-hover:text-white transition-colors shadow-inner">
                <Clock size={32} />
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">شحن سريع</h3>
              <p className="text-gray-600 leading-relaxed font-medium">
                الوقت من ذهب. خدمة السريع الخاصة بنا تضمن اختيار أفضل المسارات
                للطرود الهامة الزمنية.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. How It Works Section */}
      <section className="py-24 bg-gray-50 border-t border-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <motion.h2
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-4xl font-bold text-black mb-6"
              >
                كيف تعمل خدمة الشحن
              </motion.h2>
              <div className="w-16 h-1.5 bg-orange-500 rounded-full mb-8"></div>
              <p className="text-gray-600 text-lg mb-10 leading-relaxed font-medium">
                إرسال طرد لم يكن أسهل من قبل. قم بملء البيانات ومتابعة الخطوات
                وسنتكفل بالباقي بكل سهولة وتلقائية.
              </p>

              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex gap-6 items-start"
                >
                  <div className="shrink-0 w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-xl shadow-md border-2 border-orange-500">
                    1
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-black mb-2">
                      إنشاء حساب
                    </h4>
                    <p className="text-gray-600 font-medium">
                      سجل الدخول بسرعة وأمان بواسطة حساب جوجل الخاص بك.
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="flex gap-6 items-start"
                >
                  <div className="shrink-0 w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-xl shadow-md border-2 border-orange-500">
                    2
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-black mb-2">
                      إدخال البيانات
                    </h4>
                    <p className="text-gray-600 font-medium">
                      أدخل بياناتك وبيانات المُستلِم لضمان وصول الشحنة بسلام عبر
                      واجهتنا البسيطة.
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="flex gap-6 items-start"
                >
                  <div className="shrink-0 w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-xl shadow-lg border-2 border-black transform scale-110">
                    3
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-orange-600 mb-2">
                      الإرسال والتتبع
                    </h4>
                    <p className="text-gray-800 font-bold">
                      اجلس وانتظر تسليم طردك، كما يمكنك تتبعه في الوقت الفعلي!
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:w-1/2 w-full relative"
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl border-8 border-white bg-black aspect-4/3 flex items-center justify-center relative group">
                <div className="absolute inset-0 bg-orange-500 opacity-20 group-hover:opacity-10 transition-opacity"></div>
                <Truck
                  size={120}
                  className="text-white transform -scale-x-100 group-hover:scale-[-1.1] transition-transform duration-500"
                />
                <div className="absolute bottom-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-xl flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                    <Package className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg">في الطريق</p>
                    <p className="text-white/80 text-sm">
                      التسليم المتوقع: غداً
                    </p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-orange-400 rounded-3xl -z-10 blur-xl opacity-60"></div>
              <div className="absolute -top-8 -left-8 w-40 h-40 bg-black rounded-3xl -z-10 blur-xl opacity-20"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. CTA Section */}
      <section className="bg-orange-500 py-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto px-4 text-center relative z-10"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            مستعد لشحن طردك القادم؟
          </h2>
          <p className="text-orange-50 text-xl font-medium mb-10 max-w-2xl mx-auto">
            انضم إلى آلاف العملاء الذين يثقون بخدماتنا اللوجستية كجزء من حياتهم
            اليومية.
          </p>
          <Link
            href="/ship"
            className="inline-block bg-black hover:bg-gray-900 text-white text-lg font-bold px-10 py-5 rounded-full shadow-2xl transform hover:-translate-y-1 transition-all border border-gray-800"
          >
            أنشئ شحنتك الآن
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
