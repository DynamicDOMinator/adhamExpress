"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Package,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
} from "lucide-react";
import Image from "next/image";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // "success" | "error"

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      const res = await fetch(
        "https://express.prosental.com/api/newsletter/subscribe",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ email }),
        },
      );
      if (!res.ok) throw new Error();
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    } finally {
      setTimeout(() => setStatus(null), 4000);
    }
  };
  return (
    <footer className=" text-black pt-16 pb-8 border-t-4 border-orange-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6 group">
              <div className=" ">
                <Image
                  className="lg:w-[150px] lg:h-[150px] w-[100px] h-[100px]"
                  src="/logo.png"
                  alt="Logo"
                  width={150}
                  height={150}
                />
              </div>
            </Link>
            <p className="text-black text-sm leading-relaxed mb-6">
              حلول شحن سريعة وآمنة وموثوقة لتلبية كافة احتياجاتك الشخصية
              والتجارية. الثقة أساس عملنا.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="https://www.facebook.com/share/1GdsBktk9c/"
                target="_blank"
                className="bg-orange-100 p-2.5 rounded-full text-orange-600 hover:bg-orange-500 hover:text-white transition-colors cursor-pointer z-10"
              >
                <Facebook size={20} />
              </Link>
              <Link
                href="https://www.instagram.com/expressadham?igsh=djliZXNhcm02d3Ny"
                target="_blank"
                className="bg-orange-100 p-2.5 rounded-full text-orange-600 hover:bg-orange-500 hover:text-white transition-colors cursor-pointer z-10"
              >
                <Instagram size={20} />
              </Link>
            </div>
          </div>

          <div className="col-span-1">
            <h3 className="text-lg font-bold text-black mb-6 flex items-center gap-2">
              <span className="w-4 h-1 bg-orange-500 rounded-full"></span> روابط
              سريعة
            </h3>
            <ul className="space-y-4 text-sm text-black">
              <li>
                <Link
                  href="/"
                  className="hover:text-orange-500 transition-colors"
                >
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link
                  href="/ship"
                  className="hover:text-orange-500 transition-colors"
                >
                  إرسال طرد
                </Link>
              </li>
              <li>
                <Link
                  href="/track"
                  className="hover:text-orange-500 transition-colors"
                >
                  تتبع طردك
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-lg font-bold text-black mb-6 flex items-center gap-2">
              <span className="w-4 h-1 bg-orange-500 rounded-full"></span> تواصل
              معنا
            </h3>
            <ul className="space-y-4 text-sm text-black">
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-orange-500 shrink-0" />
                <span dir="ltr">01123255374</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-orange-500 shrink-0" />
                <span>adhamlogisics@gmail.com</span>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-lg font-bold text-black mb-6 flex items-center gap-2">
              <span className="w-4 h-1 bg-orange-500 rounded-full"></span>{" "}
              النشرة البريدية
            </h3>
            <p className="text-sm text-black mb-4">
              اشترك للحصول على آخر التحديثات والعروض الخاصة بأسعار الشحن.
            </p>
            <form
              suppressHydrationWarning
              onSubmit={handleSubscribe}
              className="flex flex-col gap-3"
            >
              <input
                suppressHydrationWarning
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="أدخل بريدك الإلكتروني"
                className="bg-gray-900 border border-gray-800 text-white rounded-lg px-4 py-2.5 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-sm"
              />
              <button
                type="submit"
                suppressHydrationWarning
                className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-4 py-2.5 font-medium transition-colors text-sm w-full"
              >
                اشترك الآن
              </button>
              {status === "success" && (
                <p className="text-green-500 text-sm font-bold text-center">
                  ✓ تم الاشتراك بنجاح!
                </p>
              )}
              {status === "error" && (
                <p className="text-red-500 text-sm font-bold text-center">
                  ✗ حدث خطأ، حاول مجدداً.
                </p>
              )}
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-center items-center gap-4">
          <p dir="ltr" className="text-black  text-sm">
            &copy; {new Date().getFullYear()} AdhamExpress جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
}
