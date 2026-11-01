import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Bell, 
  Check, 
  MessageSquare, 
  Repeat, 
  Star, 
  Video, 
  Trash2, 
  Volume2, 
  X,
  ExternalLink,
  Sparkles
} from "lucide-react";
import { useNotifications } from "../context/NotificationContext";

export default function NotificationDropdown() {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    sendTestNotification,
    playChime 
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const [testingSound, setTestingSound] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleItemClick = (notif) => {
    if (!notif.is_read) {
      markAsRead(notif.id);
    }
    setIsOpen(false);
    if (notif.link) {
      navigate(notif.link);
    }
  };

  const handleTestSound = async (e) => {
    e.stopPropagation();
    setTestingSound(true);
    playChime();
    await sendTestNotification();
    setTimeout(() => setTestingSound(false), 800);
  };

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return "Just now";
    const date = new Date(dateStr);
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const getIcon = (type) => {
    switch (type) {
      case "message":
        return <MessageSquare className="w-4 h-4 text-blue-600" />;
      case "swap_request":
      case "swap_accepted":
      case "swap_declined":
        return <Repeat className="w-4 h-4 text-emerald-600" />;
      case "review":
        return <Star className="w-4 h-4 text-amber-500 fill-amber-400" />;
      case "live_class":
      case "session_scheduled":
        return <Video className="w-4 h-4 text-purple-600" />;
      default:
        return <Bell className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="relative font-sans" ref={dropdownRef}>
      
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-full text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition-all focus:outline-none cursor-pointer"
        aria-label="View notifications"
        title="Notifications & Alerts"
      >
        <Bell className="w-5 h-5" />

        {/* Unread Badge Counter */}
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu Container */}
      {isOpen && (
        <div className="fixed sm:absolute right-2 sm:right-0 top-16 sm:top-full mt-2 w-[calc(100vw-1rem)] sm:w-96 max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="p-4 bg-slate-50/90 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-slate-900">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-extrabold">
                  {unreadCount} unread
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {/* Test Sound & Vibration Button */}
              <button
                onClick={handleTestSound}
                disabled={testingSound}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 text-[10px] font-bold flex items-center gap-1 shadow-2xs transition-all cursor-pointer active:scale-95"
                title="Play test chime & vibrate phone"
              >
                <Volume2 className={`w-3.5 h-3.5 text-blue-600 ${testingSound ? "animate-bounce" : ""}`} />
                <span>{testingSound ? "Chiming..." : "Test Sound"}</span>
              </button>

              {/* Mark All Read */}
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="px-2 py-1 text-slate-600 hover:text-blue-600 text-[10px] font-bold transition-colors cursor-pointer"
                  title="Mark all as read"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* Notification List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Bell className="w-6 h-6" />
                </div>
                <h4 className="text-xs font-bold text-slate-700">No notifications yet</h4>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                  When someone messages you, sends a swap request, or updates a session, you'll receive real-time alerts and sound chimes here!
                </p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleItemClick(notif)}
                  className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer group ${
                    !notif.is_read ? "bg-blue-50/50 hover:bg-blue-50" : "hover:bg-slate-50"
                  }`}
                >
                  {/* Avatar or Type Icon */}
                  <div className="relative shrink-0 mt-0.5">
                    {notif.sender_picture ? (
                      <img
                        src={notif.sender_picture}
                        alt={notif.sender_name || "User"}
                        className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                        {getIcon(notif.type)}
                      </div>
                    )}
                    {!notif.is_read && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-blue-600 ring-2 ring-white"></span>
                    )}
                  </div>

                  {/* Text Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className={`text-xs truncate ${!notif.is_read ? "font-black text-slate-900" : "font-bold text-slate-700"}`}>
                        {notif.title}
                      </h4>
                      <span className="text-[9px] text-slate-400 font-semibold shrink-0">
                        {formatTimeAgo(notif.created_at)}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5 font-medium leading-snug">
                      {notif.message}
                    </p>
                  </div>

                  {/* Actions on hover */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notif.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 rounded transition-all cursor-pointer shrink-0"
                    title="Remove"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600">
            <span className="text-[10px] text-slate-400">Audio chimes & haptics active</span>
            <button
              onClick={() => {
                setIsOpen(false);
                navigate("/requests");
              }}
              className="text-[11px] text-blue-600 hover:underline"
            >
              View All Swaps →
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
