import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Star, 
  Award, 
  TrendingUp, 
  CheckCircle2, 
  Zap, 
  Clock
} from "lucide-react";
import API from "../services/api";

export default function EscrowKarmaCard({ user, karmaStats: propStats }) {
  const [stats, setStats] = useState(propStats || null);
  const [loading, setLoading] = useState(!propStats);

  useEffect(() => {
    if (propStats) {
      setStats(propStats);
      setLoading(false);
      return;
    }

    const fetchKarma = async () => {
      try {
        const res = await API.get("/users/karma-stats");
        if (res.data?.success && res.data?.stats) {
          setStats(res.data.stats);
        }
      } catch (err) {
        console.error("Error loading real karma stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchKarma();
  }, [propStats]);

  const hoursTaught = stats?.hoursTaught !== undefined ? stats.hoursTaught : 0.0;
  const hoursLearned = stats?.hoursLearned !== undefined ? stats.hoursLearned : 0.0;
  const netCredit = stats?.netCredit !== undefined ? stats.netCredit : Number((hoursTaught - hoursLearned).toFixed(1));
  const karmaRating = stats?.karmaRating || user?.rating || "5.0";
  const totalSessions = stats?.totalSessions !== undefined ? stats.totalSessions : 0;
  const levelTitle = stats?.levelTitle || (totalSessions > 0 ? "5-Star Verified Peer Mentor" : "Active Peer Learner");
  
  const totalHours = hoursTaught + hoursLearned;
  const taughtPercent = totalHours > 0 ? Math.min(Math.max(Math.round((hoursTaught / totalHours) * 100), 15), 85) : 50;
  const learnedPercent = 100 - taughtPercent;

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-5 font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">Peer Review & Trust Rating</h3>
            <p className="text-xs text-slate-500 font-medium">1-on-1 hours taught vs. hours learned balance</p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified
        </span>
      </div>

      {/* Trust Score & Balance Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
            <span className="text-2xl font-black">{karmaRating}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-amber-400 tracking-wider">Peer Trust Rating</span>
            <h4 className="text-lg font-bold text-white">{levelTitle}</h4>
            <p className="text-[11px] text-slate-400 font-medium">
              Based on {totalSessions} skill exchange session{totalSessions === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        <div className="bg-emerald-950/80 px-4 py-2.5 rounded-xl border border-emerald-700/60 text-right shrink-0">
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Session Balance</span>
          <span className="text-sm font-bold text-emerald-300">
            {netCredit >= 0 ? `+${netCredit.toFixed(1)}` : netCredit.toFixed(1)} hrs {netCredit >= 0 ? "Credit" : "Deficit"}
          </span>
        </div>
      </div>

      {/* Dual Hours Progress Bars */}
      <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs font-bold">
        {/* Hours Taught */}
        <div className="space-y-1">
          <div className="flex justify-between text-slate-700">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-600" /> Hours Taught:
            </span>
            <span className="text-emerald-700 font-black">{hoursTaught} hrs</span>
          </div>
          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${taughtPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Hours Learned */}
        <div className="space-y-1 pt-1">
          <div className="flex justify-between text-slate-700">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-indigo-600" /> Hours Learned:
            </span>
            <span className="text-indigo-700 font-black">{hoursLearned} hrs</span>
          </div>
          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-indigo-600 h-full rounded-full transition-all duration-500" 
              style={{ width: `${learnedPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Trust & Reputation Badges */}
      <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] font-bold">
        <span className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-800 border border-indigo-200 flex items-center gap-1">
          <Award className="w-3.5 h-3.5 text-indigo-600" /> {totalSessions >= 5 ? "Experienced Mentor" : "Active Co-Learner"}
        </span>
        <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-amber-500" /> Responsive Peer
        </span>
        <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Verified Student
        </span>
      </div>

    </div>
  );
}
