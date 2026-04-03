import { useState, useEffect } from "react";
import { getToken, getUser, logout } from "../utils/auth";

export const useAuth = () => {
  const [user, setUser] = useState(getUser());
  const [loading, setLoading] = useState(false);

  // Хэрэглэгчийн мэдээллийг backend-аас шинэчлэх
  const refreshUser = async () => {
    const token = getToken();
    if (!token) return;

    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        logout();
        return;
      }

      const data = await res.json();

      // Storage шинэчлэх
      if (localStorage.getItem("token")) {
        localStorage.setItem("user", JSON.stringify(data));
      } else {
        sessionStorage.setItem("user", JSON.stringify(data));
      }

      setUser(data);
    } catch (err) {
      console.error("User мэдээлэл татахад алдаа:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return {
    user,
    loading,
    token: getToken(),
    isLoggedIn: !!getToken(),
    isSuperAdmin: user?.superAdmin ?? false,
    warehouse: user?.warehouse ?? "",
    refreshUser,
    logout,
  };
};
