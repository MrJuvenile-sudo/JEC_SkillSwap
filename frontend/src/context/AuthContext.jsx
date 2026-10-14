import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("skillswap_token"));
  const [loading, setLoading] = useState(true);

  // Load current user profile on app mount if token exists
  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await API.get("/auth/me");
        if (res.data.success) {
          setUser(res.data.user);
        }
      } catch (err) {
        console.error("Failed to authenticate token:", err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, [token]);

  const login = async (email, password) => {
    const res = await API.post("/auth/login", { email, password });
    if (res.data.success) {
      localStorage.setItem("skillswap_token", res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data;
    }
  };

  const register = async (userData) => {
    const res = await API.post("/auth/register", userData);
    if (res.data.success) {
      localStorage.setItem("skillswap_token", res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data;
    }
  };

  const logout = () => {
    localStorage.removeItem("skillswap_token");
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const res = await API.get("/auth/me");
      if (res.data.success) {
        setUser(res.data.user);
        return res.data.user;
      }
    } catch (err) {
      console.error("Error refreshing user:", err);
    }
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => (prev ? { ...prev, ...updatedFields } : updatedFields));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        refreshUser,
        updateUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
