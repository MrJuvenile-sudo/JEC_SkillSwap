import React from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Repeat, Star, Video, X, Bell, ExternalLink, Sparkles } from "lucide-react";
import { useNotifications } from "../context/NotificationContext";

export default function NotificationToast() {
  const { activeToast, clearActiveToast, markAsRead } = useNotifications();
  const navigate = useNavigate();

  if (!activeToast) return null;

  const handleClickToast = () => {
    if (activeToast.id) {
      markAsRead(activeToast.id);
    }
    const targetLink = activeToast.link || "/dashboard";
    clearActiveToast();
    navigate(targetLink);
  };

  const getIcon = (type) => {
    switch (type) {
      case "message":
        return <MessageSquare className="w-5 h-5 text-blue-600" />;
      case "swap_request":
      case "swap_accepted":
      case "swap_declined":
        return <Repeat className="w-5 h-5 text-emerald-600" />;
      case "review":
        return <Star className="w-5 h-5 text-amber-500 fill-amber-400" />;
      case "live_class":
      case "session_scheduled":
        return <Video className="w-5 h-5 text-purple-600" />;
      default:
        return <Bell className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[9999] max-w-sm sm:max-w-md w-[calc(100vw-2rem)] animate-in slide-in-from-top-4 fade-in duration-300">
      <div 
        onClick={handleClickToast}
        className="group relative bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border-2 border-blue-500/30 hover:border-blue-500 transition-all cursor-pointer overflow-hidden flex items-start gap-3.5"
      >
        {/* Glow Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>

        {/* Avatar or Icon */}
        <div className="relative shrink-0 mt-0.5">
          {activeToast.sender_picture ? (
            <img 
              src={activeToast.sender_picture} 
              alt={activeToast.sender_name || "User"} 
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-blue-500/30"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center">
              {getIcon(activeToast.type)}
            </div>
          )}
          <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[8px] text-white font-bold">
            •
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-6">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 inline-block">
              New Notification
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Just now</span>
          </div>

          <h4 className="text-xs sm:text-sm font-black text-slate-900 truncate mt-1">
            {activeToast.title}
          </h4>

          <p className="text-xs text-slate-600 font-medium line-clamp-2 mt-0.5 leading-snug">
            {activeToast.message}
          </p>

          <div className="pt-2 flex items-center gap-2">
            <span className="text-[11px] font-bold text-blue-600 group-hover:underline flex items-center gap-1">
              <span>View & Reply</span>
              <ExternalLink className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            clearActiveToast();
          }}
          className="absolute top-3 right-3 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
