import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import API from "../services/api";
import { useAuth } from "./AuthContext";
import { notifyWithSoundAndVibration } from "../utils/soundUtils";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeToast, setActiveToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const isInitialLoadRef = useRef(true);
  const highestSeenIdRef = useRef(0);
  const toastTimeoutRef = useRef(null);
  const originalTitleRef = useRef(typeof document !== "undefined" ? document.title : "SkillSwap");

  // Fetch current user's notifications
  const fetchNotifications = useCallback(async (isBackgroundPoll = false) => {
    if (!isAuthenticated) return;

    try {
      if (!isBackgroundPoll) setLoading(true);
      const res = await API.get("/notifications");

      if (res.data?.success) {
        const notifs = res.data.notifications || [];
        const count = res.data.unreadCount || 0;

        setNotifications(notifs);
        setUnreadCount(count);

        if (notifs.length > 0) {
          const newest = notifs[0];

          // On subsequent polls, check if a brand-new notification arrived
          if (!isInitialLoadRef.current && newest.id > highestSeenIdRef.current && !newest.is_read) {
            // Trigger Phone Sound Chime & Vibration
            notifyWithSoundAndVibration();

            // Display floating Toast notification
            showToast(newest);

            // Flash tab title if document is hidden / user on another tab
            if (typeof document !== "undefined" && document.hidden) {
              document.title = `(1) 💬 ${newest.title} - SkillSwap`;
            }
          }

          // Update highest seen ID
          if (newest.id > highestSeenIdRef.current) {
            highestSeenIdRef.current = newest.id;
          }
        }

        if (isInitialLoadRef.current) {
          isInitialLoadRef.current = false;
        }
      }
    } catch (err) {
      console.warn("Could not fetch notifications:", err.message);
    } finally {
      if (!isBackgroundPoll) setLoading(false);
    }
  }, [isAuthenticated]);

  // Show a floating in-app toast notification with auto-dismiss
  const showToast = (notif) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setActiveToast(notif);
    toastTimeoutRef.current = setTimeout(() => {
      setActiveToast(null);
    }, 6000); // 6 seconds display
  };

  const clearActiveToast = () => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setActiveToast(null);
  };

  // Restore document title when user focuses window
  useEffect(() => {
    const handleFocus = () => {
      if (typeof document !== "undefined") {
        document.title = originalTitleRef.current || "SkillSwap - Peer Learning Network";
      }
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  // Poll for notifications every 4 seconds when user is authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setNotifications([]);
      setUnreadCount(0);
      setActiveToast(null);
      isInitialLoadRef.current = true;
      highestSeenIdRef.current = 0;
      return;
    }

    // Initial fetch
    fetchNotifications(false);

    const interval = setInterval(() => {
      fetchNotifications(true);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAuthenticated, fetchNotifications]);

  // Mark single notification as read
  const markAsRead = async (id) => {
    try {
      // Optimistic update
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));

      await API.put(`/notifications/${id}/read`);
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      // Optimistic update
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);

      await API.put("/notifications/read-all");
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  // Delete notification
  const deleteNotification = async (id) => {
    try {
      const target = notifications.find(n => n.id === id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      if (target && !target.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }

      await API.delete(`/notifications/${id}`);
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  // Test notification helper
  const sendTestNotification = async () => {
    try {
      // Immediate local sound & vibration test
      notifyWithSoundAndVibration();

      const res = await API.post("/notifications/test");
      if (res.data?.success) {
        await fetchNotifications(true);
      }
    } catch (err) {
      console.error("Failed to send test notification:", err);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        activeToast,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearActiveToast,
        sendTestNotification,
        playChime: notifyWithSoundAndVibration,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};
