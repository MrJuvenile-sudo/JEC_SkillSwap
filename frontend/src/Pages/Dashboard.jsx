import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import SkillBadge from "../Components/SkillBadge";
import LoadingSpinner from "../Components/LoadingSpinner";
import { 
  Sparkles, 
  BookOpen, 
  Inbox, 
  Video, 
  Repeat, 
  ArrowRight, 
  Star, 
  PlusCircle, 
  Search,
  Zap,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Award,
  MessageSquare,
  Globe,
  ExternalLink,
  Lock,
  UserCheck
} from "lucide-react";
import { get3DAvatarUrl } from "../utils/avatarUtils";

// Import P2P Barter Management Hub Modules
import UpcomingSessions from "../Components/UpcomingSessions";
import EscrowKarmaCard from "../Components/EscrowKarmaCard";
import QuickChatWidget from "../Components/QuickChatWidget";
import SavedSwappers from "../Components/SavedSwappers";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    pendingRequests: 0,
    activeSessions: 0,
    topMatchesCount: 0,
  });
  const [matches, setMatches] = useState([]);
  const [activeExchanges, setActiveExchanges] = useState([]);
  const [karmaStats, setKarmaStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dynamic Time-Based Greeting Function
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 22) return "Good Evening";
    return "Good Night";
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [reqRes, exRes, matchRes, karmaRes] = await Promise.all([
          API.get("/requests"),
          API.get("/exchanges"),
          API.get("/discovery/matches"),
          API.get("/users/karma-stats").catch(() => ({ data: { success: false } })),
        ]);

        const pending = (reqRes.data.received || []).filter(r => r.status === "pending").length;
        
        // Map active exchanges with real partner details and real skill names
        const activeList = (exRes.data.exchanges || [])
          .filter(e => e.status === "scheduled" || e.status === "in_progress")
          .map(ex => {
            const isRequester = user?.id === ex.requester_id;
            const partnerName = isRequester ? ex.receiver_name : ex.requester_name;
            const partnerPic = isRequester ? ex.receiver_picture : ex.requester_picture;
            const partnerRole = isRequester 
              ? (ex.receiver_profession || ex.receiver_degree || "Co-Learner") 
              : (ex.requester_profession || ex.requester_degree || "Co-Learner");
            const offeredSkill = isRequester ? ex.offered_skill_name : ex.requested_skill_name;
            const requestedSkill = isRequester ? ex.requested_skill_name : ex.offered_skill_name;
            const scheduledDate = ex.scheduled_at 
              ? new Date(ex.scheduled_at).toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
              : "Active Scheduled Session";

            return {
              ...ex,
              partnerName: partnerName || "Barter Partner",
              partnerPic,
              partnerRole,
              offeredSkill: offeredSkill || "General Skill",
              requestedSkill: requestedSkill || "General Skill",
              dateBadge: scheduledDate,
              meetLink: (ex.meeting_link && !ex.meeting_link.includes("skillswap-room")) ? ex.meeting_link : "https://meet.google.com/new"
            };
          });

        const topM = (matchRes.data.matches || []).length;

        setStats({
          pendingRequests: pending,
          activeSessions: activeList.length,
          topMatchesCount: topM,
        });

        setActiveExchanges(activeList.slice(0, 5));
        setMatches((matchRes.data.matches || []).slice(0, 3));
        if (karmaRes.data?.success && karmaRes.data?.stats) {
          setKarmaStats(karmaRes.data.stats);
        }
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // Calculate Profile Completion Score
  const calculateProfileScore = () => {
    let score = 40; // Base score
    if (user?.bio) score += 15;
    if (user?.offered_skills?.length > 0) score += 20;
    if (user?.wanted_skills?.length > 0) score += 15;
    if (user?.city) score += 10;
    return Math.min(score, 100);
  };

  const profileScore = calculateProfileScore();

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* 1. DYNAMIC TIME-BASED WELCOME HERO BANNER */}
      <div className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-violet-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={user?.profile_picture || get3DAvatarUrl(user?.gender, user?.name)}
                alt={user?.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-white/20 shadow-md bg-indigo-900"
              />
              <span className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-950 absolute -bottom-1 -right-1" title="Active Swapper"></span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-black text-indigo-300 tracking-wide uppercase">
                  {getGreeting()}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black flex items-center gap-2.5 tracking-tight text-white leading-tight">
                <span>{user?.name || "Swapper"}</span>
                <ShieldCheck className="w-6 h-6 text-indigo-400 shrink-0" />
              </h1>
              <p className="text-xs sm:text-sm text-indigo-200 font-medium">
                {user?.profession || "SkillSwap Co-Learner"}{user?.city || user?.location ? ` • ${[user?.city, user?.location].filter(Boolean).join(', ')}` : ''}
              </p>
              <span className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold uppercase tracking-wider">
                <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
                Zero-Cost Co-Mentorship Active
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="https://meet.google.com/new"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-xs font-black shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 hover:scale-105"
            >
              <Video className="w-4 h-4" />
              <span>Instant Google Meet</span>
            </a>

            <Link
              to="/explore"
              className="px-5 py-3 bg-white text-indigo-950 hover:bg-slate-100 rounded-2xl text-xs font-black shadow-md transition-all flex items-center gap-2"
            >
              <Search className="w-4 h-4 text-indigo-600" />
              <span>Explore Swappers</span>
            </Link>

            <Link
              to="/profile"
              className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl text-xs font-extrabold backdrop-blur-md transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Manage Skills</span>
            </Link>
          </div>
        </div>

        {/* Profile Completion Bar */}
        <div className="mt-6 pt-6 border-t border-indigo-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-indigo-200">Profile Completion:</span>
            <div className="flex-1 sm:w-48 bg-indigo-950 h-2 rounded-full overflow-hidden border border-indigo-700/50">
              <div 
                className="bg-gradient-to-r from-emerald-400 to-teal-400 h-full transition-all duration-500" 
                style={{ width: `${profileScore}%` }}
              ></div>
            </div>
            <span className="text-emerald-400">{profileScore}%</span>
          </div>

          <div className="flex items-center gap-4 text-indigo-200 text-[11px]">
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> 5.0 Peer Rating
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" /> 18.5 Co-Learned Hrs
            </span>
          </div>
        </div>
      </div>

      {/* 2. METRICS & COUNTERS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <Link to="/profile" className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl transition-all group duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Offered Skills</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-3">{user?.offered_skills?.length || 0}</p>
          <p className="text-xs text-slate-500 font-medium mt-1">Ready to teach peers</p>
        </Link>

        <Link to="/profile" className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl transition-all group duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Wanted Skills</span>
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-3">{user?.wanted_skills?.length || 0}</p>
          <p className="text-xs text-slate-500 font-medium mt-1">Learning goals</p>
        </Link>

        <Link to="/requests" className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl transition-all group duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Pending Proposals</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Inbox className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-amber-600 mt-3">{stats.pendingRequests}</p>
          <p className="text-xs text-slate-500 font-medium mt-1">Awaiting your response</p>
        </Link>

        <Link to="/exchanges" className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl transition-all group duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Active Classrooms</span>
            <div className="w-10 h-10 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Video className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-3">{stats.activeSessions}</p>
          <p className="text-xs text-slate-500 font-medium mt-1">Scheduled session rooms</p>
        </Link>

      </div>

      {/* 3. MAIN P2P BARTER HUB LAYOUT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (8 Columns on desktop): Escrow Karma, Upcoming Sessions, Saved Swappers */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Module 1: Escrow Karma / Trust & Credit Balance Tracker */}
          <EscrowKarmaCard user={user} karmaStats={karmaStats} />

          {/* Module 2: Upcoming Scheduled Sessions Timeline */}
          <UpcomingSessions exchanges={activeExchanges} />

          {/* Module 3: Saved / Bookmarked Swappers Shelf */}
          <SavedSwappers />

        </div>

        {/* Right Column (4 Columns on desktop): Direct Inbox */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Module 4: Quick Chat / Direct Inbox Widget */}
          <QuickChatWidget />

        </div>

      </div>

      {/* 4. AI SYNERGY RECOMMENDED BARTER PARTNERS */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              Recommended Swappers For You
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">Top reciprocal matches based on your skill profile</p>
          </div>
          <Link to="/explore" className="text-xs font-black text-indigo-600 hover:underline flex items-center gap-1">
            Browse Directory <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner label="Loading partner recommendations..." />
        ) : matches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {matches.map((m) => (
              <div key={m.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between hover:border-indigo-300 transition-all">
                <div className="flex items-center gap-3">
                  <img
                    src={m.profile_picture || get3DAvatarUrl(m.gender, m.name)}
                    alt={m.name}
                    className="w-11 h-11 rounded-xl object-cover ring-2 ring-indigo-500/20"
                  />
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-900">{m.name}</h4>
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 inline-block mt-0.5">
                      {m.matchScore || 98}% Match
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 space-y-1 bg-white p-3 rounded-xl border border-slate-100">
                  <p><strong className="text-emerald-700">Teaches:</strong> {m.offered_skills?.map(s => s.skill_name).join(", ") || "Technical Track"}</p>
                  <p><strong className="text-indigo-700">Learns:</strong> {m.wanted_skills?.map(s => s.skill_name).join(", ") || "General Barter"}</p>
                </div>

                <Link
                  to={`/profile/${m.id}`}
                  className="block w-full text-center py-2 bg-white border border-slate-200 hover:border-indigo-600 hover:bg-indigo-50 text-slate-800 hover:text-indigo-700 rounded-xl text-xs font-extrabold transition-all shadow-2xs"
                >
                  View Profile & Request Swap
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
            No recommendations available yet. Try adding more offered and wanted skills to your profile!
          </div>
        )}
      </div>

    </div>
  );
}
