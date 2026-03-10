"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { Package, Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ClickAwayListener from "react-click-away-listener";
import Image from "next/image";
export default function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <nav className="bg-white border-b p-3 border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center ">
            <Link href="/" className="flex items-center  gap-2 group">
          <Image className="w-[150px] h-[150px] mt-3" src="/logo.png" alt="Logo" width={1000} height={1000} />
           
            </Link>
          </div>
          <div className="flex hidden md:flex items-center gap-5 ">
            <Link
              href="/"
              className="text-gray-600 hover:text-orange-500 font-medium transition-colors"
            >
              الرئيسية
            </Link>
            <Link
              href="/ship"
              className="text-gray-600 hover:text-orange-500 font-medium transition-colors"
            >
              إرسال طرد
            </Link>
            <Link
              href="/track"
              className="text-gray-600 hover:text-orange-500 font-medium transition-colors"
            >
              تتبع طردك
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center   gap-8">
            {session ? (
              <div className="relative">
                <ClickAwayListener onClickAway={() => setIsProfileOpen(false)}>
                  <div>
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-50 transition-colors focus:outline-none"
                    >
                      {session.user?.image ? (
                        <img
                          src={session.user.image}
                          alt="avatar"
                          className="w-10 h-10 rounded-full border border-gray-200"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                          <User size={20} />
                        </div>
                      )}
                      <span className="text-sm font-bold text-gray-700 hidden lg:block">
                        {session.user?.name?.split(" ")[0]}
                      </span>
                      <ChevronDown
                        size={16}
                        className={`text-gray-500 transition-transform ${isProfileOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    <AnimatePresence>
                      {isProfileOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute left-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden z-50 origin-top-left"
                        >
                          <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-sm text-gray-500 font-medium">
                              تم الدخول بواسطة
                            </p>
                            <p
                          
                              className="text-sm font-bold text-gray-900 truncate"
                              title={session.user?.email}
                            >
                              {session.user?.email}
                            </p>
                          </div>

                          <div className="p-2">
                            <Link
                              href="/track"
                              onClick={() => setIsProfileOpen(false)}
                            >
                              < button  className="w-full text-right px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-colors flex items-center justify-between">
                                شحناتي
                                <Package size={16} />
                              </button>
                            </Link>

                            <Link
                              href="/settings"
                              onClick={() => setIsProfileOpen(false)}
                            >
                              <button className="w-full text-right mt-1 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-colors flex items-center justify-between">
                                إعدادات الحساب
                                <User size={16} />
                              </button>
                            </Link>
                          </div>

                          <div className="p-2 border-t border-gray-100">
                            <button
                              onClick={() => {
                                setIsProfileOpen(false);
                                signOut();
                              }}
                              className="w-full text-right px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center justify-between"
                            >
                              تسجيل الخروج
                              <LogOut size={16} />
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </ClickAwayListener>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-black hover:bg-gray-800 text-white px-5 py-2.5 rounded-full font-medium transition-colors shadow-md focus:outline-none"
                  >
                    دخول
                  </motion.button>
                </Link>
                <Link href="/signup">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-full font-medium transition-colors shadow-md focus:outline-none"
                  >
                    حساب جديد
                  </motion.button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-orange-500 p-2"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white border-t border-gray-100 shadow-xl overflow-hidden"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium text-gray-800 hover:text-orange-500"
              >
                الرئيسية
              </Link>
              <Link
                href="/ship"
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium text-gray-800 hover:text-orange-500"
              >
                إرسال طرد
              </Link>
              <Link
                href="/track"
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium text-gray-800 hover:text-orange-500"
              >
                تتبع طردك
              </Link>

              <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
                {session ? (
                  <>
                    <div className="flex items-center gap-3 py-2">
                      {session.user?.image ? (
                        <img
                          src={session.user.image}
                          alt="avatar"
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                          <User size={20} />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">
                          {session.user?.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {session.user?.email}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        signOut();
                        setIsOpen(false);
                      }}
                      className="w-full text-center bg-gray-100 hover:bg-gray-200 text-black py-3 rounded-xl font-medium transition-colors"
                    >
                      تسجيل خروج
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="w-full py-3 bg-black text-white rounded-xl font-medium flex justify-center items-center gap-2"
                    >
                      تسجيل الدخول
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setIsOpen(false)}
                      className="w-full py-3 bg-orange-500 text-white rounded-xl font-medium flex justify-center items-center gap-2"
                    >
                      إنشاء حساب
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
