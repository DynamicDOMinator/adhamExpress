"use client";

import { useSession, signIn } from "next-auth/react";
import React, { useState } from "react";
import Link from "next/link";
import {
  Send,
  MapPin,
  User,
  Package,
  ChevronLeft,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ShipPage() {
  const { data: session, status } = useSession();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    sender: { name: "", phone: "", area: "nasr_city", address: "" },
    receiver: { name: "", phone: "", area: "new_cairo", address: "" },
    parcel: { weight: "", dimensions: "", packageType: "box", description: "" },
  });

  const cairoAreas = [
    { id: "nasr_city", name: "مدينة نصر", price: 50 },
    { id: "heliopolis", name: "مصر الجديدة", price: 55 },
    { id: "new_cairo", name: "القاهرة الجديدة (التجمع)", price: 70 },
    { id: "maadi", name: "المعادي", price: 60 },
    { id: "downtown", name: "وسط البلد", price: 40 },
    { id: "mohandeseen", name: "المهندسين", price: 45 },
    { id: "dokki", name: "الدقي", price: 45 },
    { id: "haram", name: "الهرم", price: 60 },
    { id: "faisal", name: "فيصل", price: 55 },
    { id: "october", name: "6 أكتوبر", price: 80 },
    { id: "zayed", name: "الشيخ زايد", price: 80 },
    { id: "shoubra", name: "شبرا", price: 50 },
  ];

  const calculateShippingPrice = () => {
    const senderArea = cairoAreas.find((a) => a.id === formData.sender.area);
    const receiverArea = cairoAreas.find(
      (a) => a.id === formData.receiver.area,
    );
    let base = 30; // base price
    if (senderArea && receiverArea) {
      // Simple logic: base + (sender_price + receiver_price)/2
      base += Math.round((senderArea.price + receiverArea.price) / 2);
    }

    // add weight cost
    const w = parseFloat(formData.parcel.weight) || 0;
    if (w > 5) {
      base += (w - 5) * 5; // 5 EGP for every extra kg over 5kg
    }
    return base;
  };
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleNext = () => setStep((prev) => Math.min(prev + 1, 3));
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!session) {
      window.location.href = "/signup";
      return;
    }

    setTimeout(() => {
      setIsSubmitted(true);
    }, 1000);
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="text-orange-500"
        >
          <Package size={48} />
        </motion.div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg text-center bg-white p-12 rounded-3xl shadow-xl border border-green-100"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 size={40} />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            تم إنشاء الشحنة بنجاح!
          </h2>
          <p className="text-gray-500 mb-6 leading-relaxed font-medium">
            تم تسجيل طردك لدينا، سيتواصل معك المندوب الخاص بنا قريباً للاستلام.
          </p>
          <div className="bg-gray-50 p-6 rounded-xl mb-8 border border-gray-200 text-right">
            <p className="text-sm text-gray-500 mb-1">رقم التتبع الخاص بك:</p>
            <p
              className="text-2xl font-mono font-bold text-black text-center"
              dir="ltr"
            >
              SF-{((Math.random() * 10000000) | 0).toString().padStart(8, "0")}
            </p>
          </div>
          <button
            onClick={() => {
              setIsSubmitted(false);
              setStep(1);
            }}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-all shadow-md"
          >
            إنشاء شحنة أخرى
          </button>
        </motion.div>
      </div>
    );
  }

  const animVariants = {
    hidden: { opacity: 0, x: -50 },
    enter: { opacity: 1, x: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, x: 50, transition: { duration: 0.4 } },
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-black mb-4">
            إنشاء شحنة جديدة
          </h1>
          <p className="text-gray-500 text-lg font-medium">
            أرسل طردك لأي مكان بأمان وسرعة مع شيبنج فاست.
          </p>
        </div>

        {/* Progress Bar */}
        <div
          className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8 flex justify-between items-center relative overflow-hidden"
          dir="rtl"
        >
          <div className="absolute top-1/2 right-0 w-full h-1 bg-gray-100 -z-10 -translate-y-1/2"></div>
          <motion.div
            className="absolute top-1/2 right-0 h-1 bg-orange-500 -z-10 -translate-y-1/2"
            animate={{ width: `${((step - 1) / 2) * 100}%` }}
            transition={{ duration: 0.5 }}
          ></motion.div>

          {[
            { num: 1, label: "بيانات الراسل", icon: User },
            { num: 2, label: "بيانات المستلم", icon: MapPin },
            { num: 3, label: "مواصفات الطرد", icon: Package },
          ].map((s) => (
            <div
              key={s.num}
              className="flex flex-col items-center bg-white px-4 relative z-10"
            >
              <motion.div
                animate={{
                  backgroundColor: step >= s.num ? "#f97316" : "#ffffff",
                  borderColor: step >= s.num ? "#fed7aa" : "#f3f4f6",
                  color: step >= s.num ? "#ffffff" : "#9ca3af",
                }}
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-4 transition-all`}
              >
                {step > s.num ? (
                  <CheckCircle2 size={24} />
                ) : (
                  React.createElement(s.icon, { size: 20 })
                )}
              </motion.div>
              <span
                className={`mt-2 text-sm font-bold ${step >= s.num ? "text-gray-900" : "text-gray-400"}`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100 overflow-hidden min-h-[400px]"
        >
          <AnimatePresence mode="wait">
            {/* Step 1: Sender Data */}
            {step === 1 && (
              <motion.div
                key="step1"
                variants={animVariants}
                initial="hidden"
                animate="enter"
                exit="exit"
              >
                <h2 className="text-2xl font-bold text-black border-b border-gray-100 pb-4 mb-8 flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                    <User size={24} />
                  </div>
                  معلومات الراسل
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      الاسم بالكامل
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.sender.name}
                      onChange={(e) =>
                        handleChange("sender", "name", e.target.value)
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all text-black font-medium"
                      placeholder="مثال: أحمد محمد"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      رقم الهاتف
                    </label>
                    <input
                      required
                      type="tel"
                      dir="ltr"
                      value={formData.sender.phone}
                      onChange={(e) =>
                        handleChange("sender", "phone", e.target.value)
                      }
                      className="w-full text-right bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all text-black font-medium"
                      placeholder="+20 100 000 0000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      المنطقة (داخل القاهرة الكبرى)
                    </label>
                    <select
                      value={formData.sender.area}
                      onChange={(e) =>
                        handleChange("sender", "area", e.target.value)
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all text-black font-medium appearance-none"
                    >
                      {cairoAreas.map((area) => (
                        <option key={area.id} value={area.id}>
                          {area.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      عنوان الاستلام بالتفصيل
                    </label>
                    <textarea
                      required
                      rows="3"
                      value={formData.sender.address}
                      onChange={(e) =>
                        handleChange("sender", "address", e.target.value)
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all text-black resize-none font-medium"
                      placeholder="أدخل عنوان استلام الطرد بالتفصيل مع الرمز البريدي"
                    ></textarea>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Receiver Data */}
            {step === 2 && (
              <motion.div
                key="step2"
                variants={animVariants}
                initial="hidden"
                animate="enter"
                exit="exit"
              >
                <h2 className="text-2xl font-bold text-black border-b border-gray-100 pb-4 mb-8 flex items-center gap-3">
                  <div className="p-2 bg-black rounded-lg text-white">
                    <MapPin size={24} />
                  </div>
                  معلومات المُستلِم
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      الاسم بالكامل
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.receiver.name}
                      onChange={(e) =>
                        handleChange("receiver", "name", e.target.value)
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all text-black font-medium"
                      placeholder="مثال: سارة محمود"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      رقم الهاتف
                    </label>
                    <input
                      required
                      type="tel"
                      dir="ltr"
                      value={formData.receiver.phone}
                      onChange={(e) =>
                        handleChange("receiver", "phone", e.target.value)
                      }
                      className="w-full text-right bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all text-black font-medium"
                      placeholder="+20 111 000 0000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      المنطقة (داخل القاهرة الكبرى)
                    </label>
                    <select
                      value={formData.receiver.area}
                      onChange={(e) =>
                        handleChange("receiver", "area", e.target.value)
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all text-black font-medium appearance-none"
                    >
                      {cairoAreas.map((area) => (
                        <option key={area.id} value={area.id}>
                          {area.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      عنوان التسليم بالتفصيل
                    </label>
                    <textarea
                      required
                      rows="3"
                      value={formData.receiver.address}
                      onChange={(e) =>
                        handleChange("receiver", "address", e.target.value)
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all text-black resize-none font-medium"
                      placeholder="أدخل عنوان تسليم الطرد بالتفصيل مع الرمز البريدي"
                    ></textarea>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Parcel Data */}
            {step === 3 && (
              <motion.div
                key="step3"
                variants={animVariants}
                initial="hidden"
                animate="enter"
                exit="exit"
              >
                <h2 className="text-2xl font-bold text-black border-b border-gray-100 pb-4 mb-8 flex items-center gap-3">
                  <div className="p-2 bg-orange-500 rounded-lg text-white">
                    <Package size={24} />
                  </div>
                  مواصفات الطرد
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      نوع الطرد
                    </label>
                    <div className="flex gap-4">
                      {[
                        { id: "documents", name: "مستندات/أوراق" },
                        { id: "box", name: "صندوق" },
                        { id: "pallet", name: "طبلية/حجم كبير" },
                      ].map((type) => (
                        <label
                          key={type.id}
                          className={`flex-1 flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.parcel.packageType === type.id ? "border-orange-500 bg-orange-50 text-orange-700" : "border-gray-200 bg-white hover:border-orange-200 text-gray-600"}`}
                        >
                          <input
                            type="radio"
                            name="packageType"
                            className="sr-only"
                            checked={formData.parcel.packageType === type.id}
                            onChange={() =>
                              handleChange("parcel", "packageType", type.id)
                            }
                          />
                          <span className="font-bold">{type.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      الوزن التقديري (كجم)
                    </label>
                    <input
                      required
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={formData.parcel.weight}
                      onChange={(e) =>
                        handleChange("parcel", "weight", e.target.value)
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all text-black font-medium"
                      placeholder="مثال: 2.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      الأبعاد (طولxعرضxارتفاع سم)
                    </label>
                    <input
                      required
                      type="text"
                      dir="ltr"
                      value={formData.parcel.dimensions}
                      onChange={(e) =>
                        handleChange("parcel", "dimensions", e.target.value)
                      }
                      className="w-full text-right bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all text-black font-medium"
                      placeholder="30x20x15"
                    />
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      وصف مختصر للطرد
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.parcel.description}
                      onChange={(e) =>
                        handleChange("parcel", "description", e.target.value)
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all text-black font-medium"
                      placeholder="مثال: إلكترونيات، كتب، هدايا..."
                    />
                  </div>
                </div>

                <div className="mt-8 bg-orange-50 border border-orange-200 rounded-2xl p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-orange-900 text-lg">
                        تكلفة الشحن التقديرية
                      </h3>
                      <p className="text-orange-700 text-sm mt-1">
                        من{" "}
                        {
                          cairoAreas.find((a) => a.id === formData.sender.area)
                            ?.name
                        }{" "}
                        إلى{" "}
                        {
                          cairoAreas.find(
                            (a) => a.id === formData.receiver.area,
                          )?.name
                        }
                      </p>
                    </div>
                    <div className="text-3xl font-extrabold text-orange-600 flex items-center gap-2">
                      {calculateShippingPrice()}{" "}
                      <span className="text-base font-bold">ج.م</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Navigation Controls */}
          <div className="mt-10 pt-6 border-t border-gray-100 flex justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-3 border-2 border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-50 transition-colors"
              >
                رجوع للخلف
              </button>
            ) : (
              <div></div>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-8 py-3 bg-black hover:bg-gray-800 text-white rounded-xl font-bold flex items-center gap-2 transition-colors shadow-lg"
              >
                متابعة الخطوات <ChevronLeft size={20} />
              </button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-10 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold flex items-center gap-2 transition-colors shadow-lg"
              >
                {session ? (
                  <>
                    تأكيد الشحن <Send size={20} className="scale-x-[-1]" />
                  </>
                ) : (
                  <>
                    تسجيل الدخول للتأكيد <User size={20} />
                  </>
                )}
              </motion.button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
