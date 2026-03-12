"use client";

import { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Package,
  Home,
  CheckCircle2,
  CircleDashed,
  Truck,
  ArrowRight,
  ArrowLeft,
  XCircle,
  CheckCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useAuthContext } from "@/context/AuthContext";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function TrackPageContent() {
  const { token } = useAuthContext();
  const isAuthenticated = !!token;
  const [trackingId, setTrackingId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [trackingResult, setTrackingResult] = useState(null);

  const searchParams = useSearchParams();
  const initialId = searchParams.get("id");

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

  const [myOrders, setMyOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  // Auto trigger search if ID present in URL
  useEffect(() => {
    if (initialId) {
      setTrackingId(initialId);
      triggerTrack(initialId);
    }
  }, [initialId]);

  // Fetch all orders on load
  useEffect(() => {
    async function loadOrders() {
      if (!isAuthenticated || !token) {
        setIsLoadingOrders(false);
        return;
      }
      try {
        const res = await fetch(
          "https://express.prosental.com/api/auth/orders",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (res.ok) {
          const data = await res.json();
          setMyOrders(data);
        }
      } catch (err) {
        console.error("Failed to load orders", err);
      } finally {
        setIsLoadingOrders(false);
      }
    }
    loadOrders();
  }, [token, isAuthenticated]);

  const viewOrderDetails = (foundOrder) => {
    const primaryShipment = foundOrder.shipments && foundOrder.shipments[0];

    let arStatus = "قيد الانتظار";
    if (foundOrder.status === "pending") arStatus = "قيد الانتظار";
    else if (foundOrder.status === "on_way_to_pickup")
      arStatus = "في الطريق للاستلام";
    else if (foundOrder.status === "picked_up") arStatus = "تم استلام الشحنة";
    else if (foundOrder.status === "on_way_to_receiver")
      arStatus = "في الطريق للمُستلِم";
    else if (foundOrder.status === "delivered") arStatus = "تم التسليم بنجاح";
    else if (
      foundOrder.status === "canceled" ||
      foundOrder.status === "cancelled"
    )
      arStatus = "تم الإلغاء";

    setTrackingResult({
      id: foundOrder.formatted_id,
      status: arStatus,
      rawStatus: foundOrder.status,
      origin: primaryShipment ? primaryShipment.sender_area_name : "غير معروف",
      destination: primaryShipment
        ? primaryShipment.receiver_area_name
        : "غير معروف",
      date: new Date(foundOrder.created_at).toLocaleDateString("ar-EG"),
      order: foundOrder,
      updates: [
        {
          time: new Date(foundOrder.created_at).toLocaleDateString("ar-EG"),
          location: primaryShipment ? primaryShipment.sender_area_name : "",
          status: "تم إنشاء الطلب",
          icon: Package,
          completed: true,
        },
        {
          time: ["picked_up", "on_way_to_receiver", "delivered"].includes(
            foundOrder.status,
          )
            ? "تم الاستلام"
            : "في الانتظار",
          location: primaryShipment ? primaryShipment.sender_area_name : "",
          status: "استلام الشحنة من الراسل",
          icon: Truck,
          completed: ["picked_up", "on_way_to_receiver", "delivered"].includes(
            foundOrder.status,
          ),
        },
        {
          time: ["on_way_to_receiver", "delivered"].includes(foundOrder.status)
            ? "جاري التوصيل"
            : "في الانتظار",
          location: "",
          status: "في الطريق للمُستلِم",
          icon: MapPin,
          completed: ["on_way_to_receiver", "delivered"].includes(
            foundOrder.status,
          ),
        },
        {
          time:
            foundOrder.status === "delivered"
              ? foundOrder.updated_at
                ? new Date(foundOrder.updated_at).toLocaleDateString("ar-EG")
                : ""
              : "في الانتظار",
          location: primaryShipment ? primaryShipment.receiver_area_name : "",
          status: "تم التوصيل بنجاح",
          icon: Home,
          completed: foundOrder.status === "delivered",
        },
      ],
    });
  };

  const triggerTrack = async (idToSearch) => {
    setIsSearching(true);
    setTrackingResult(null);

    try {
      const res = await fetch(
        `https://express.prosental.com/api/orders/track/${idToSearch}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );

      if (!res.ok) {
        throw new Error("لم يتم العثور على شحنة بهذا الرقم");
      }

      const foundOrder = await res.json();
      viewOrderDetails(foundOrder);
    } catch (error) {
      console.error(error);
      showPopup(error.message, "error");
    } finally {
      setIsSearching(false);
    }
  };

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!trackingId) return;
    await triggerTrack(trackingId);
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
          className="bg-gray-50 p-4 rounded-3xl shadow-lg border border-gray-100 max-w-2xl mx-auto relative mb-16 flex flex-col md:flex-row items-center group focus-within:ring-2 focus-within:ring-orange-500 transition-all"
        >
          <MapPin size={24} className="text-gray-400 mr-4 hidden md:block" />
          <input
            type="text"
            dir="ltr"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            placeholder="AE-1030"
            className="flex-1 w-full bg-transparent border-none text-black font-medium text-lg px-4 py-3 focus:outline-none placeholder:text-gray-400 uppercase text-center md:text-right mb-4 md:mb-0"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="w-full md:w-auto bg-black text-white justify-center hover:bg-orange-500 px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-md disabled:opacity-70 disabled:hover:bg-black mr-0 md:mr-2"
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
              className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden mb-16"
            >
              <div className="bg-gray-50 p-4 border-b border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setTrackingResult(null);
                    setTrackingId("");
                  }}
                  className="flex items-center gap-2 text-gray-600 hover:text-black font-bold transition-colors text-sm px-4"
                >
                  <ArrowRight size={18} /> العودة للقائمة
                </button>
              </div>
              {/* Status Header */}
              <div className="bg-black p-8 text-white relative overflow-hidden">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-orange-500 rounded-full blur-3xl opacity-30"></div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end relative z-10 gap-6">
                  <div>
                    <p
                      className="text-white font-medium text-sm mb-2 uppercase"
                      dir="rtl"
                    >
                      رقم الطلب: {trackingResult.id}
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

              {/* Shipment Details Data */}
              <div className="p-8 md:p-12 border-b border-gray-100 bg-white">
                <h3 className="font-bold text-xl text-black mb-8 border-b border-gray-100 pb-4">
                  تفاصيل وبيانات الشحنة
                </h3>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-gray-500 text-sm mb-1 font-bold">
                      إجمالي التكلفة
                    </p>
                    <p className="font-bold text-xl text-orange-600">
                      {trackingResult.order?.total_price || "0.00"} ج.م
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-gray-500 text-sm mb-1 font-bold">
                      تاريخ الإنشاء
                    </p>
                    <p className="font-bold text-black">
                      {trackingResult.date}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {trackingResult.order?.shipments?.map((shipment, index) => (
                    <div
                      key={shipment.id}
                      className="border border-gray-200 rounded-3xl p-6 bg-white overflow-hidden relative"
                    >
                      <div className="absolute top-0 right-0 bg-orange-100 text-orange-600 font-bold py-1 px-4 rounded-bl-xl text-xs">
                        طرد #{index + 1}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="p-1.5 bg-gray-100 rounded-lg text-gray-600">
                              <MapPin size={16} />
                            </span>
                            <h4 className="font-bold text-gray-900">
                              بيانات الراسل
                            </h4>
                          </div>
                          <p className="text-sm font-bold text-gray-800">
                            الأسم:{" "}
                            <span className="text-gray-500 font-medium">
                              {shipment.sender_name || "مخفي للخصوصية"}
                            </span>
                          </p>
                          <p className="text-sm font-bold text-gray-800">
                            الهاتف:{" "}
                            <span
                              className="text-gray-500 font-medium"
                              dir="ltr"
                            >
                              {shipment.sender_phone || "مخفي للخصوصية"}
                            </span>
                          </p>
                          <p className="text-sm font-bold text-gray-800">
                            العنوان:{" "}
                            <span className="text-gray-500 font-medium">
                              {shipment.sender_address
                                ? `${shipment.sender_address} (${shipment.sender_area_name})`
                                : shipment.sender_area_name || "مخفي"}
                            </span>
                          </p>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="p-1.5 bg-black rounded-lg text-white">
                              <Home size={16} />
                            </span>
                            <h4 className="font-bold text-gray-900">
                              بيانات المُستلِم
                            </h4>
                          </div>
                          <p className="text-sm font-bold text-gray-800">
                            الأسم:{" "}
                            <span className="text-gray-500 font-medium">
                              {shipment.receiver_name || "مخفي للخصوصية"}
                            </span>
                          </p>
                          <p className="text-sm font-bold text-gray-800">
                            الهاتف:{" "}
                            <span
                              className="text-gray-500 font-medium"
                              dir="ltr"
                            >
                              {shipment.receiver_phone || "مخفي للخصوصية"}
                            </span>
                          </p>
                          <p className="text-sm font-bold text-gray-800">
                            العنوان:{" "}
                            <span className="text-gray-500 font-medium">
                              {shipment.receiver_address
                                ? `${shipment.receiver_address} (${shipment.receiver_area_name})`
                                : shipment.receiver_area_name || "مخفي"}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-gray-400 text-xs font-bold mb-1">
                            نوع الطرد
                          </p>
                          <p className="font-bold text-sm text-black bg-gray-50 px-3 py-1.5 rounded-lg inline-block">
                            {shipment.type === "box"
                              ? "صندوق"
                              : shipment.type === "documents"
                                ? "مستندات/أوراق"
                                : shipment.type === "pallet"
                                  ? "طلبية كبيرة"
                                  : shipment.type}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs font-bold mb-1">
                            الوزن
                          </p>
                          <p className="font-bold text-sm text-black">
                            {shipment.weight
                              ? `${shipment.weight} كجم`
                              : "غير محدد"}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs font-bold mb-1">
                            تكلفة الطرد
                          </p>
                          <p className="font-bold text-sm text-black">
                            {shipment.price} ج.م
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs font-bold mb-1">
                            أبعاد الطرد
                          </p>
                          <p className="font-bold text-sm text-black">
                            {shipment.dimensions &&
                            shipment.dimensions !== "N/A"
                              ? shipment.dimensions
                              : "غير متوفر"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline Events */}
              <div className="p-8 md:p-12 relative overflow-hidden bg-gray-50">
                <h3 className="font-bold text-xl text-black mb-10 border-b border-gray-200 pb-4">
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

          {/* User's Order List if not searching */}
          {!trackingResult &&
            !isLoadingOrders &&
            isAuthenticated &&
            myOrders.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-8"
              >
                <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                  <h3 className="font-bold text-2xl text-black">
                    طلباتك الأخيرة
                  </h3>
                  <span className="bg-orange-100 text-orange-600 px-4 py-1.5 rounded-full font-bold text-sm">
                    {myOrders.length} طلبات
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {myOrders.map((order, index) => {
                    const primaryShipment =
                      order.shipments && order.shipments[0];
                    let arStatus = "قيد الانتظار";
                    let statusStyle = "bg-yellow-100 text-yellow-700";

                    if (order.status === "pending") {
                      arStatus = "قيد الانتظار";
                      statusStyle = "bg-yellow-100 text-yellow-700";
                    } else if (order.status === "on_way_to_pickup") {
                      arStatus = "في الطريق للاستلام";
                      statusStyle = "bg-orange-100 text-orange-700";
                    } else if (order.status === "picked_up") {
                      arStatus = "تم استلام الشحنة";
                      statusStyle = "bg-blue-100 text-blue-700";
                    } else if (order.status === "on_way_to_receiver") {
                      arStatus = "في الطريق للمُستلِم";
                      statusStyle = "bg-indigo-100 text-indigo-700";
                    } else if (order.status === "delivered") {
                      arStatus = "تم التسليم";
                      statusStyle = "bg-green-100 text-green-700";
                    } else if (
                      order.status === "canceled" ||
                      order.status === "cancelled"
                    ) {
                      arStatus = "ملغية";
                      statusStyle = "bg-red-100 text-red-700";
                    }

                    return (
                      <div
                        key={order.uuid || order.id || index}
                        onClick={() => {
                          setTrackingId(order.formatted_id);
                          viewOrderDetails(order);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="bg-gray-50 border border-gray-100 p-6 rounded-3xl hover:bg-white hover:shadow-xl hover:-translate-y-1 hover:border-orange-100 transition-all cursor-pointer group"
                      >
                        <div className="flex justify-between items-center mb-6">
                          <span
                            className={`px-4 py-1.5 rounded-full text-xs font-bold ${statusStyle}`}
                          >
                            {arStatus}
                          </span>
                          <span className="font-black text-gray-400 group-hover:text-black transition-colors">
                            {order.formatted_id}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 mb-6 relative">
                          <div className="flex-1">
                            <p className="text-xs text-gray-400 font-bold mb-1">
                              من
                            </p>
                            <p className="font-bold text-sm text-black truncate">
                              {primaryShipment
                                ? primaryShipment.sender_area_name
                                : "غير معروف"}
                            </p>
                          </div>
                          <div className="text-orange-400">
                            <ArrowLeft size={20} />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="text-xs text-gray-400 font-bold mb-1">
                              إلى
                            </p>
                            <p className="font-bold text-sm text-black truncate">
                              {primaryShipment
                                ? primaryShipment.receiver_area_name
                                : "غير معروف"}
                            </p>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                          <p className="text-sm font-bold text-gray-500">
                            {new Date(order.created_at).toLocaleDateString(
                              "ar-EG",
                            )}
                          </p>
                          <p className="font-black text-lg text-black">
                            {order.total_price} ج.م
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

          {!trackingResult &&
            !isLoadingOrders &&
            isAuthenticated &&
            myOrders.length === 0 && (
              <div className="text-center bg-gray-50 rounded-3xl p-12 mt-8 border border-gray-100">
                <Package size={64} className="mx-auto text-gray-300 mb-6" />
                <h3 className="font-bold text-2xl text-black mb-2">
                  لا توجد طلبات سابقة
                </h3>
                <p className="text-gray-500">
                  قم بإنشاء شحنتك الأولى لتبدأ بتتبعها من هنا.
                </p>
              </div>
            )}
        </AnimatePresence>
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

export default function TrackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center p-10">
          <CircleDashed className="animate-spin text-orange-500" size={64} />
        </div>
      }
    >
      <TrackPageContent />
    </Suspense>
  );
}
