"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { data: session, status } = useSession();
  const API_URL =
    process.env.NEXT_PUBLIC_AREAS_API_URL ||
    "https://express.prosental.com/api";
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (session?.accessToken) {
      setToken(session.accessToken);
      if (session.user) {
        setUser(session.user);
        localStorage.setItem("user", JSON.stringify(session.user));
      }
      localStorage.setItem("access_token", session.accessToken);
      document.cookie = `access_token=${session.accessToken}; path=/; max-age=31536000; SameSite=Lax`;
    } else if (status !== "loading") {
      const savedToken = localStorage.getItem("access_token");
      const savedUser = localStorage.getItem("user");
      if (savedToken) {
        setToken(savedToken);
        if (savedUser) setUser(JSON.parse(savedUser));
      }
    }

    if (status !== "loading") {
      setIsLoading(false);
    }
  }, [session, status]);

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || data.message || "فشلت عملية تسجيل الدخول",
        );
      }

      const { access_token } = data;
      setToken(access_token);
      localStorage.setItem("access_token", access_token);
      document.cookie = `access_token=${access_token}; path=/; max-age=31536000; SameSite=Lax`;

      // Since login might not return a user object, optionally store a basic object
      // or rely on a future fetch profile endpoint.
      const basicUser = { email };
      setUser(basicUser);
      localStorage.setItem("user", JSON.stringify(basicUser));

      return { success: true };
    } catch (error) {
      console.error("Login Error:", error);
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(userData),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "حدث خطأ أثناء إجراء التسجيل");
      }

      const { access_token, user } = data;
      setToken(access_token);
      setUser(user);
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("user", JSON.stringify(user));
      document.cookie = `access_token=${access_token}; path=/; max-age=31536000; SameSite=Lax`;

      return { success: true };
    } catch (error) {
      console.error("Register Error:", error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    document.cookie =
      "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);
