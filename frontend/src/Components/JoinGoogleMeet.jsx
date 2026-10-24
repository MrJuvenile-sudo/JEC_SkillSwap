import React from "react";
import { ExternalLink, Video } from "lucide-react";

/**
 * JoinGoogleMeet Component
 * Industry-standard Google Meet Launcher
 * Only rendered when caller is authorized (Host or Registered Learner)
 */
export default function JoinGoogleMeet({ 
  meetingUrl, 
  className = "",
  size = "md",
  label = "Join Google Meet" 
}) {
  if (!meetingUrl) return null;

  const sizeClasses = {
    sm: "px-3.5 py-1.5 text-xs gap-1.5",
    md: "px-5 py-2.5 text-xs sm:text-sm gap-2",
    lg: "px-6 py-3.5 text-sm sm:text-base gap-2.5"
  };

  return (
    <a
      href={meetingUrl}
      target="_blank"
      rel="noopener noreferrer"
      title="Join Google Meet (opens in new tab)"
      className={`inline-flex items-center justify-center font-extrabold rounded-2xl text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-800 shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer shrink-0 ${sizeClasses[size] || sizeClasses.md} ${className}`}
    >
      {/* Google Meet Multi-Color Camera Icon */}
      <div className="w-5 h-5 rounded-md bg-white/20 p-0.5 flex items-center justify-center shrink-0">
        <Video className="w-3.5 h-3.5 text-white" />
      </div>
      <span>{label}</span>
      <ExternalLink className="w-3.5 h-3.5 opacity-80 shrink-0" />
    </a>
  );
}
