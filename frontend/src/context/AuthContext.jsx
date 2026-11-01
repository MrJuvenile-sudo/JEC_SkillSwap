import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize user from cached session in localStorage to avoid 1-second blank/redirect flicker
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("skillswap_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem("skillswap_token") || null;
    } catch {
      return null;
    }
  });

  // If user is already in state, initial loading is false immediately!
  const [loading, setLoading] = useState(() => !user && !!token);

  // Validate or silently refresh current user profile on app mount
  useEffect(() => {
    let isMounted = true;

    const fetchMe = async () => {
      const currentToken = localStorage.getItem("skillswap_token");
      if (!currentToken) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const res = await API.get("/auth/me");
        if (isMounted && res.data.success && res.data.user) {
          setUser(res.data.user);
          localStorage.setItem("skillswap_user", JSON.stringify(res.data.user));
        }
      } catch (err) {
        console.warn("Token validation failed:", err.message);
        // CRITICAL: Only log out if backend returns 401 (Invalid/expired token) or 403 (Banned)
        // Never log out on 500 server errors or temporary network disconnects!
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          logout();
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchMe();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const login = async (email, password) => {
    const res = await API.post("/auth/login", { email, password });
    if (res.data.success) {
      localStorage.setItem("skillswap_token", res.data.token);
      if (res.data.user) {
        localStorage.setItem("skillswap_user", JSON.stringify(res.data.user));
        setUser(res.data.user);
      }
      setToken(res.data.token);
      setLoading(false);
      return res.data;
    }
    throw new Error(res.data.message || "Login failed");
  };

  const register = async (userData) => {
    const res = await API.post("/auth/register", userData);
    if (res.data.success) {
      localStorage.setItem("skillswap_token", res.data.token);
      if (res.data.user) {
        localStorage.setItem("skillswap_user", JSON.stringify(res.data.user));
        setUser(res.data.user);
      }
      setToken(res.data.token);
      setLoading(false);
      return res.data;
    }
    throw new Error(res.data.message || "Registration failed");
  };

  const logout = () => {
    try {
      localStorage.removeItem("skillswap_token");
      localStorage.removeItem("skillswap_user");
    } catch (e) {
      // ignore storage errors
    }
    setToken(null);
    setUser(null);
    setLoading(false);
  };

  const refreshUser = async () => {
    try {
      const res = await API.get("/auth/me");
      if (res.data.success && res.data.user) {
        setUser(res.data.user);
        localStorage.setItem("skillswap_user", JSON.stringify(res.data.user));
        return res.data.user;
      }
    } catch (err) {
      console.error("Error refreshing user:", err);
    }
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const updated = prev ? { ...prev, ...updatedFields } : updatedFields;
      try {
        localStorage.setItem("skillswap_user", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
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
        isAuthenticated: !!user || !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
