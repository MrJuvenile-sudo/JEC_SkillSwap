import React, { useState, useEffect } from "react";
import API from "../services/api";
import UserCard from "../Components/UserCard";
import SwapRequestModal from "../Components/SwapRequestModal";
import LoadingSpinner from "../Components/LoadingSpinner";
import { Sparkles, Repeat, AlertCircle, Info, BookOpen, CheckCircle2, Zap, SlidersHorizontal } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Matches() {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [filterTwoWayOnly, setFilterTwoWayOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedUserForSwap, setSelectedUserForSwap] = useState(null);
  const [notification, setNotification] = useState("");

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const res = await API.get("/discovery/matches");
      if (res.data.success) {
        setMatches(res.data.matches || []);
      }
    } catch (err) {
      console.error("Error fetching smart matches:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const displayedMatches = filterTwoWayOnly
    ? matches.filter((m) => m.isTwoWayMatch)
    : matches;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-violet-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-black">
              <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
              <span>AI-Powered Compatibility Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">
              Smart Skill Matcher
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200/90 max-w-2xl leading-relaxed">
              We paired your listed offered & wanted skills with other users. <strong className="text-emerald-300">2-Way Matches</strong> offer what you want to learn AND want to learn what you teach!
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 bg-white/10 p-1.5 rounded-2xl border border-white/20 backdrop-blur-md">
            <button
              onClick={() => setFilterTwoWayOnly(false)}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all ${
                !filterTwoWayOnly ? "bg-white text-indigo-950 shadow-md" : "text-indigo-200 hover:text-white"
              }`}
            >
              All Matches ({matches.length})
            </button>
            <button
              onClick={() => setFilterTwoWayOnly(true)}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1 ${
                filterTwoWayOnly ? "bg-emerald-500 text-white shadow-md" : "text-indigo-200 hover:text-white"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              2-Way Only ({matches.filter((m) => m.isTwoWayMatch).length})
            </button>
          </div>
        </div>
      </div>

      {notification && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xs">
          <span>{notification}</span>
          <button onClick={() => setNotification("")} className="text-emerald-600 font-bold ml-4">✕</button>
        </div>
      )}

      {loading ? (
        <LoadingSpinner label="Analyzing skill compatibility scores..." />
      ) : displayedMatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedMatches.map((matchUser) => (
            <UserCard
              key={matchUser.id}
              user={matchUser}
              onRequestSwap={(target) => setSelectedUserForSwap(target)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center max-w-lg mx-auto my-8 shadow-xs space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Add More Skills to Get Better Matches!</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              List additional skills you offer or want to learn on your profile so our algorithm can match you with compatible peers.
            </p>
          </div>
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-extrabold shadow-md shadow-indigo-500/20 transition-all"
          >
            Update Profile & Skills
          </Link>
        </div>
      )}

      {selectedUserForSwap && (
        <SwapRequestModal
          targetUser={selectedUserForSwap}
          onClose={() => setSelectedUserForSwap(null)}
          onSuccess={(msg) => setNotification(msg)}
        />
      )}

    </div>
  );
}
