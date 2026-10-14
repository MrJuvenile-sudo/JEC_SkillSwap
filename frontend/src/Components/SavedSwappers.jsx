import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Bookmark, 
  Trash2, 
  UserCheck, 
  ArrowRight, 
  Zap, 
  Star
} from "lucide-react";
import { get3DAvatarUrl } from "../utils/avatarUtils";

export default function SavedSwappers({ initialSaved = [] }) {
  const [savedList, setSavedList] = useState(initialSaved);

  const removeBookmark = (id) => {
    setSavedList((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold">
            <Bookmark className="w-5 h-5 text-violet-600 fill-violet-600/20" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">Saved & Bookmarked Swappers</h3>
            <p className="text-xs text-slate-500 font-medium">Quick-access shelf for bookmarked peer mentors</p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-violet-50 text-violet-700 border border-violet-200">
          {savedList.length} Saved
        </span>
      </div>

      {/* Grid / Horizontal Shelf */}
      {savedList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {savedList.map((swapper) => (
            <div
              key={swapper.id}
              className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 hover:border-violet-300 transition-all flex flex-col justify-between group relative"
            >
              {/* Remove Button */}
              <button
                onClick={() => removeBookmark(swapper.id)}
                className="absolute top-4 right-4 text-slate-400 hover:text-rose-600 transition-colors p-1"
                title="Remove Bookmark"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              {/* Avatar & Info */}
              <div className="flex items-start gap-3">
                <img
                  src={swapper.avatar || get3DAvatarUrl(swapper.gender, swapper.name)}
                  alt={swapper.name}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-violet-500/20 bg-violet-100 shrink-0"
                />
                <div className="pr-6">
                  <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-1">
                    <span>{swapper.name}</span>
                    <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium truncate">{swapper.role}</p>

                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 inline-flex items-center gap-0.5">
                      <Zap className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                      {swapper.matchScore || 95}% Match
                    </span>
                    <span className="text-[10px] font-bold text-slate-600 flex items-center gap-0.5">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      {swapper.rating || 5.0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Offered Skills Badges */}
              {swapper.offeredSkills?.length > 0 && (
                <div className="bg-white p-3 rounded-xl border border-slate-200/80 space-y-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                    Teaches Core:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {swapper.offeredSkills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-md border border-indigo-100"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <Link
                to={`/profile/${swapper.id}`}
                className="w-full text-center py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-black shadow-xs transition-all flex items-center justify-center gap-1.5 hover:scale-[1.02]"
              >
                <span>Request Swap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-xs text-slate-500 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
          <p className="font-bold text-slate-700">No bookmarked swappers yet.</p>
          <p className="text-slate-500">Explore the directory and bookmark swapper profiles to quick-access them here!</p>
          <div className="pt-2">
            <Link to="/explore" className="px-4 py-2 bg-violet-600 text-white text-xs font-bold rounded-xl inline-block shadow-xs hover:bg-violet-700">
              Explore Swapper Directory
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
