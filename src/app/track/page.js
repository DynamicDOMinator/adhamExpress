"use client";

import { useState } from "react";
import {
  Search,
  MapPin,
  Package,
  Home,
  CheckCircle2,
  CircleDashed,
  Truck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TrackPage() {
  const [trackingId, setTrackingId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [trackingResult, setTrackingResult] = useState(null);

  const handleTrack = (e) => {
    e.preventDefault();
    if (!trackingId) return;

    setIsSearching(true);
    setTrackingResult(null);

    // Mock API call
    setTimeout(() => {
      setIsSearching(false);
      setTrackingResult({
        id: trackingId.toUpperCase(),
        status: "في الطريق إلى المُستلِم",
        estimatedDelivery: "غداً",
        origin: "استلام من الراسل",
        destination: "جاري التوصيل للمُستلِم",
        updates: [
          {
            time: "اليوم، 10:30 صباحاً",
            location: "طريق الدائري",
            status: "في الطريق إلى المُستلِم",
            icon: Truck,
            completed: true,
          },
          {
            time: "أمس، 04:45 مساءً",
            location: "مركز التوزيع الرئيسي",
            status: "تم استلام الطرد من الراسل",
            icon: Package,
            completed: true,
          },
          {
            time: "في الانتظار",
            location: "عنوان المُستلِم",
            status: "تم التوصيل بنجاح",
            icon: Home,
            completed: false,
          },
        ],
      });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center p-4 bg-orange-100 rounded-full text-orange-600 mb-6"
          >
            <Search size={32} />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-black mb-4"
          >
            تتبع الشحنة الخاصة بك
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 text-lg max-w-2xl mx-auto font-medium"
          >
            تحديثات في الوقت الفعلي لنبقيك على اطلاع دائم. أدخل رقم التتبع الخاص
            بك بالأسفل لتعرف مسار الطرد.
          </motion.p>
        </div>

        {/* Search Input */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleTrack}
          className="bg-gray-50 p-4 rounded-3xl shadow-lg border border-gray-100 max-w-2xl mx-auto relative mb-16 flex items-center group focus-within:ring-2 focus-within:ring-orange-500 transition-all"
        >
          <MapPin size={24} className="text-gray-400 mr-4 hidden sm:block" />
          <input
            type="text"
            dir="ltr"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            placeholder="SF-98765432"
            className="flex-1 bg-transparent border-none text-black font-medium text-lg px-4 py-3 focus:outline-none placeholder:text-gray-400 uppercase text-right"
            required
          />
          <button
            type="submit"
            disabled={isSearching}
            className="bg-black text-white hover:bg-orange-500 px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-md disabled:opacity-70 disabled:hover:bg-black mr-2"
          >
            {isSearching ? (
              <div className="flex items-center gap-2">
                <Package className="animate-spin" size={20} /> جاري البحث
              </div>
            ) : (
              "تتبع الشحنة"
            )}
          </button>
        </motion.form>

        {/* Results Timeline */}
        <AnimatePresence>
          {trackingResult && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
            >
              {/* Status Header */}
              <div className="bg-black p-8 text-white relative overflow-hidden">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-orange-500 rounded-full blur-3xl opacity-30"></div>
                <div  className="flex flex-col md:flex-row justify-between items-start md:items-end relative z-10 gap-6">
                  <div>
                    <p
                      className="text-white font-medium text-sm mb-2 uppercase"
                      dir="rtl"
                    >
                      رقم التتبع: {trackingResult.id}
                    </p>
                    <h2 className="text-4xl font-black text-white flex items-center gap-4">
                       <span className="bg-orange-500 flex items-center justify-center p-1 rounded-full">
                        <CheckCircle2 size={24} className="text-white" />
                      </span>
                      {trackingResult.status}
                     
                    </h2>
                  </div>
                  
                </div>
              </div>

              {/* Path */}
              <div className="bg-gray-50 border-b border-gray-100 p-6 flex items-center justify-between text-center overflow-x-auto gap-4">
                <div className="flex-1 min-w-[140px]">
                  <p className="text-sm text-gray-400 font-bold mb-1 uppercase">
                    نقطة الانطلاق
                  </p>
                  <p className="font-bold text-gray-900 whitespace-nowrap">
                    {trackingResult.origin}
                  </p>
                </div>
                <div className="flex-1 flex items-center justify-center min-w-[100px]">
                  <div className="h-0.5 w-full bg-orange-200"></div>
                  <Truck
                    size={24}
                    className="text-orange-500 shrink-0 mx-2 transform scale-x-[-1]"
                  />
                  <div className="h-0.5 w-full bg-gray-200"></div>
                </div>
                <div className="flex-1 min-w-[140px]">
                  <p className="text-sm text-gray-400 font-bold mb-1 uppercase">
                    الوجهة
                  </p>
                  <p className="font-bold text-gray-900 whitespace-nowrap">
                    {trackingResult.destination}
                  </p>
                </div>
              </div>

              {/* Timeline Events */}
              <div className="p-8 md:p-12 relative overflow-hidden">
                <h3 className="font-bold text-xl text-black mb-10 border-b border-gray-100 pb-4">
                  مراحل سير الشحنة
                </h3>
                <div className="space-y-10 relative before:absolute before:inset-0 before:mr-6 md:before:mx-auto before:h-full before:w-1 before:bg-gradient-to-b before:from-orange-500 before:via-orange-200 before:to-gray-200">
                  {trackingResult.updates.map((update, index) => {
                    const Icon = update.icon;
                    return (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.15 }}
                        key={index}
                        className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                      >
                        {/* Icon point */}
                        <div
                          className={`flex items-center justify-center w-12 h-12 rounded-full border-4 shadow shrink-0 md:order-1 text-white relative z-10 ${update.completed ? "bg-orange-500 border-white" : "bg-gray-200 border-white text-gray-400"}`}
                        >
                          {update.completed ? (
                            <Icon
                              size={20}
                              className={
                                Icon === Truck || Icon === MapPin
                                  ? "transform scale-x-[-1]"
                                  : ""
                              }
                            />
                          ) : (
                            <CircleDashed
                              size={20}
                              className="animate-spin-slow"
                            />
                          )}
                        </div>

                        {/* Event Bubble */}
                        <div
                          className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-5 rounded-2xl shadow-sm border transition-all ${update.completed ? "border-orange-100 hover:border-orange-300" : "border-gray-100 opacity-60"}`}
                        >
                          <div className="flex flex-col mb-1">
                            <span
                              className={`font-bold text-lg ${update.completed ? "text-black" : "text-gray-500"}`}
                            >
                              {update.status}
                            </span>
                            <span
                              className={`text-sm ${update.completed ? "text-orange-600 font-medium" : "text-gray-400"}`}
                            >
                              {update.time}
                            </span>
                          </div>
                         
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
