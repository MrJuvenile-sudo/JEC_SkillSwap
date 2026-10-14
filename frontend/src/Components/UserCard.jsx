import React from "react";
import { Link } from "react-router-dom";
import SkillBadge from "./SkillBadge";
import { MapPin, Star, Repeat, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { get3DAvatarUrl } from "../utils/avatarUtils";

export default function UserCard({ user, onRequestSwap, onQuickView }) {
  const isTwoWay = user.isTwoWayMatch;
  const matchScore = user.matchScore;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative group overflow-hidden">
      
      {/* Top Subtle Gradient Accent Line */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 ${
        isTwoWay ? "bg-gradient-to-r from-emerald-400 to-teal-500" : "bg-gradient-to-r from-indigo-500 to-violet-600"
      }`}></div>

      <div>
        {/* Header with Match Score */}
        <div className="flex items-start justify-between gap-3 mb-4 pt-1">
          <div className="flex items-center gap-3.5">
            <div 
              onClick={() => onQuickView ? onQuickView(user) : null} 
              className="relative shrink-0 cursor-pointer"
            >
              <img
                src={user.profile_picture || get3DAvatarUrl(user.gender, user.name)}
                alt={user.name}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-200 group-hover:ring-indigo-500/50 transition-all shadow-sm group-hover:scale-105"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white"></span>
            </div>

            <div>
              <div 
                onClick={() => onQuickView ? onQuickView(user) : null}
                className="cursor-pointer hover:text-indigo-600 transition-colors"
              >
                <h3 className="text-base font-extrabold text-slate-900 line-clamp-1 flex items-center gap-1.5">
                  {user.name}
                  <ShieldCheck className="w-4 h-4 text-indigo-500 inline shrink-0" title="Verified Swapper" />
                </h3>
              </div>

              {(user.city || user.location) && (
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {[user.city, user.location].filter(Boolean).join(", ")}
                </p>
              )}

              <div className="flex items-center gap-1.5 mt-1 text-xs">
                <div className="flex items-center text-amber-500 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                  <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                  <span>{user.rating || "5.0"}</span>
                </div>
                <span className="text-slate-400 font-medium">({user.total_reviews || 0} reviews)</span>
              </div>
            </div>
          </div>

          {/* Match Score Badge */}
          {matchScore && (
            <div className={`shrink-0 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 shadow-xs ${
              isTwoWay
                ? "bg-emerald-500 text-white shadow-emerald-200"
                : "bg-indigo-600 text-white shadow-indigo-200"
            }`}>
              <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
              <span>{matchScore}%</span>
            </div>
          )}
        </div>

        {/* Bio quote snippet */}
        {user.bio && (
          <p className="text-xs text-slate-600 mb-4 line-clamp-2 italic bg-slate-50/80 p-3 rounded-2xl border border-slate-150/80 leading-relaxed">
            "{user.bio}"
          </p>
        )}

        {/* Skills Offered Section */}
        <div className="mb-3.5">
          <p className="text-[10px] uppercase font-black text-emerald-700 tracking-wider mb-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Can Teach / Offers:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {user.offered_skills && user.offered_skills.length > 0 ? (
              user.offered_skills.map((skill) => (
                <SkillBadge key={skill.id} skill={skill} type="offered" size="sm" />
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">No skills listed yet</span>
            )}
          </div>
        </div>

        {/* Skills Wanted Section */}
        <div className="mb-4">
          <p className="text-[10px] uppercase font-black text-indigo-700 tracking-wider mb-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            Wants to Learn:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {user.wanted_skills && user.wanted_skills.length > 0 ? (
              user.wanted_skills.map((skill) => (
                <SkillBadge key={skill.id} skill={skill} type="wanted" size="sm" />
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">No learning goals specified</span>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2.5">
        <button
          onClick={() => onQuickView ? onQuickView(user) : null}
          className="text-xs font-bold text-slate-600 hover:text-indigo-600 px-3 py-2.5 rounded-xl hover:bg-slate-100/70 transition-all flex items-center gap-1"
        >
          <span>Quick View</span>
        </button>

        <button
          onClick={() => onRequestSwap(user)}
          className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/35 transition-all hover:scale-[1.02]"
        >
          <Repeat className="w-4 h-4" />
          <span>Request Swap</span>
        </button>
      </div>

    </div>
  );
}
