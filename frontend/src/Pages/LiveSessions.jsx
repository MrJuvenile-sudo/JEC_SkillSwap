import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Video, 
  Calendar, 
  Clock, 
  Users, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  ExternalLink,
  ShieldCheck,
  Star,
  UserCheck,
  Filter,
  RefreshCw,
  X
} from "lucide-react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import JoinGoogleMeet from "../Components/JoinGoogleMeet";
import CreateLiveClassModal from "../Components/CreateLiveClassModal";
import SessionAttendanceModal from "../Components/SessionAttendanceModal";
import LoadingSpinner from "../Components/LoadingSpinner";

const DOMAINS = [
  "All",
  "Web Development",
  "DSA & Core CS",
  "AI & Machine Learning",
  "UI/UX Design",
  "Cloud & DevOps",
  "Languages & Comms",
];

export default function LiveSessions() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("discover"); // "discover" | "registered" | "hosted"
  const [sessions, setSessions] = useState([]);
  const [myHosted, setMyHosted] = useState([]);
  const [myRegistered, setMyRegistered] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [timeframe, setTimeframe] = useState("all");

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedSessionForAttendance, setSelectedSessionForAttendance] = useState(null);
  const [selectedSessionForDetails, setSelectedSessionForDetails] = useState(null);

  // Notifications
  const [toast, setToast] = useState("");

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 4000);
  };

  // Fetch Discover Sessions
  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await API.get("/live-sessions", {
        params: {
          search: searchQuery,
          category: selectedCategory === "All" ? "" : selectedCategory,
          timeframe,
        },
      });
      if (res.data.success) {
        setSessions(res.data.sessions || []);
      }

      // If authenticated, also fetch my sessions
      if (isAuthenticated) {
        const myRes = await API.get("/live-sessions/my/all");
        if (myRes.data.success) {
          setMyHosted(myRes.data.hosted || []);
          setMyRegistered(myRes.data.registered || []);
        }
      }
    } catch (err) {
      console.error("Error loading live sessions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [searchQuery, selectedCategory, timeframe, isAuthenticated]);

  // Handle Register for Seat
  const handleRegister = async (sessionId) => {
    if (!isAuthenticated) {
      navigate("/login?redirect=/live");
      return;
    }

    try {
      const res = await API.post(`/live-sessions/${sessionId}/register`);
      if (res.data.success) {
        showToast("Seat confirmed! Google Meet link is now available.");
        fetchSessions();
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to register for seat.");
    }
  };

  // Handle Cancel Seat
  const handleCancelRegistration = async (sessionId) => {
    if (!window.confirm("Are you sure you want to cancel your seat registration?")) return;
    try {
      const res = await API.delete(`/live-sessions/${sessionId}/register`);
      if (res.data.success) {
        showToast("Registration cancelled and seat released.");
        fetchSessions();
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to cancel registration.");
    }
  };

  // Handle Cancel Class (Host)
  const handleCancelSession = async (sessionId) => {
    if (!window.confirm("Are you sure you want to cancel this entire live class?")) return;
    try {
      const res = await API.post(`/live-sessions/${sessionId}/cancel`);
      if (res.data.success) {
        showToast("Class cancelled.");
        fetchSessions();
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to cancel class.");
    }
  };

  // Choose which list to display based on activeTab
  let displayedSessions = sessions;
  if (activeTab === "registered") {
    displayedSessions = myRegistered;
  } else if (activeTab === "hosted") {
    displayedSessions = myHosted;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-700 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toast}</span>
          <button onClick={() => setToast("")} className="text-slate-400 hover:text-white ml-2 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Hero Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black border border-emerald-400/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>SkillSwap Live · Powered by Google Meet</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Interactive Group Classes & Workshops
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              Master technical topics through live peer workshops. Reserve seats in community masterclasses or host your own session with Google Meet.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  navigate("/login?redirect=/live");
                  return;
                }
                setShowCreateModal(true);
              }}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Host a Live Class</span>
            </button>
          </div>
        </div>

        {/* Feature Highlights Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-white/10 text-xs font-bold text-slate-300">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-emerald-400 shrink-0">
              <Video className="w-4 h-4" />
            </div>
            <span>Google Meet Rooms</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-blue-400 shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <span>100% Free Peer Seats</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span>Protected Join Links</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-purple-400 shrink-0">
              <Star className="w-4 h-4" />
            </div>
            <span>Peer Ratings & Reviews</span>
          </div>
        </div>
      </div>

      {/* Tabs & Filter Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-4">
        
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("discover")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                activeTab === "discover"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Discover Classes
            </button>

            {isAuthenticated && (
              <>
                <button
                  onClick={() => setActiveTab("registered")}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === "registered"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <span>My Registered Classes</span>
                  {myRegistered.length > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-black">
                      {myRegistered.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab("hosted")}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === "hosted"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <span>Classes I Host</span>
                  {myHosted.length > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-black">
                      {myHosted.length}
                    </span>
                  )}
                </button>
              </>
            )}
          </div>

          <div className="text-xs font-semibold text-slate-500">
            Showing <strong className="text-slate-900">{displayedSessions.length}</strong> class{displayedSessions.length === 1 ? "" : "es"}
          </div>
        </div>

        {/* Search & Domain Filter Row */}
        {activeTab === "discover" && (
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search classes by title, skill, topic, or host..."
                className="w-full pl-11 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="sm:col-span-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                {DOMAINS.map((dom) => (
                  <option key={dom} value={dom}>
                    {dom === "All" ? "All Technical Domains" : dom}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-3">
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="all">All Dates</option>
                <option value="upcoming">Upcoming Sessions</option>
                <option value="today">Today Only</option>
              </select>
            </div>
          </div>
        )}

      </div>

      {/* Main Sessions Grid */}
      {loading ? (
        <LoadingSpinner label="Loading live Google Meet classes..." />
      ) : displayedSessions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedSessions.map((s) => {
            const seatsRemaining = Math.max(0, s.max_participants - (s.registered_count || 0));
            const isFull = seatsRemaining === 0;
            const isCurrentUserHost = user && s.host_id === user.id;

            return (
              <div
                key={s.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-1"
              >
                {/* Top Card Header */}
                <div className="p-6 space-y-4">
                  {/* Date & Time pill */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-extrabold border border-blue-100">
                      <Calendar className="w-3 h-3 text-blue-600" />
                      <span>{s.session_date}</span>
                      <span className="text-slate-300">•</span>
                      <Clock className="w-3 h-3 text-blue-600" />
                      <span>{s.start_time?.slice(0, 5)}</span>
                    </span>

                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-black uppercase tracking-wider">
                      <Video className="w-3 h-3 text-emerald-600" />
                      <span>Google Meet</span>
                    </span>
                  </div>

                  {/* Title & Topic */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-wide">
                        {s.skill_topic}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        {s.duration_minutes} mins
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                      {s.title}
                    </h3>
                  </div>

                  {/* Description */}
                  {s.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 font-medium">
                      {s.description}
                    </p>
                  )}

                  {/* Capacity Progress Bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" /> Seats Reserved
                      </span>
                      <span className={isFull ? "text-rose-600 font-black" : "text-slate-900 font-black"}>
                        {s.registered_count || 0} / {s.max_participants}
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isFull
                            ? "bg-rose-500"
                            : "bg-gradient-to-r from-blue-500 to-indigo-600"
                        }`}
                        style={{
                          width: `${Math.min(100, ((s.registered_count || 0) / s.max_participants) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Host Profile Info */}
                  <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                    <img
                      src={s.host_avatar || `https://api.dicebear.com/7.x/lorelei/svg?seed=${s.host_name}`}
                      alt={s.host_name}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/20"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-black text-slate-900 truncate">{s.host_name}</span>
                      <span className="text-[10px] text-slate-500 truncate font-semibold">
                        {s.host_profession || s.host_city || "SkillSwap Peer Host"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions Bottom Strip */}
                <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                  
                  {/* HOST CONTROLS */}
                  {isCurrentUserHost ? (
                    <div className="w-full flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setSelectedSessionForAttendance(s)}
                          className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                        >
                          Attendance
                        </button>
                        <button
                          onClick={() => handleCancelSession(s.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 rounded-xl transition-colors cursor-pointer"
                          title="Cancel class"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Host Join Button */}
                      <JoinGoogleMeet meetingUrl={s.meeting_url} size="sm" label="Join as Host" />
                    </div>
                  ) : s.is_registered ? (
                    /* REGISTERED LEARNER CONTROLS */
                    <div className="w-full flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Seat Confirmed</span>
                        </span>

                        <button
                          onClick={() => handleCancelRegistration(s.id)}
                          className="text-[11px] font-bold text-slate-400 hover:text-rose-600 cursor-pointer"
                          title="Release my seat"
                        >
                          Cancel
                        </button>
                      </div>

                      {/* Protected Join Google Meet Button */}
                      <JoinGoogleMeet meetingUrl={s.meeting_url} size="sm" label="Join Google Meet" />
                    </div>
                  ) : (
                    /* UNREGISTERED VISITOR ACTION */
                    <div className="w-full flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-slate-500">
                        {isFull ? (
                          <span className="text-rose-600 font-extrabold">Session Full</span>
                        ) : (
                          `${seatsRemaining} seat${seatsRemaining === 1 ? "" : "s"} left`
                        )}
                      </span>

                      <button
                        onClick={() => handleRegister(s.id)}
                        disabled={isFull}
                        className={`px-4 py-2 rounded-xl text-xs font-black shadow-xs transition-all cursor-pointer ${
                          isFull
                            ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow"
                        }`}
                      >
                        {isFull ? "Class Full" : "Reserve Seat"}
                      </button>
                    </div>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Video className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">No Live Classes Found</h3>
            <p className="text-xs text-slate-500 mt-1">
              {activeTab === "registered"
                ? "You haven't registered for any upcoming classes yet."
                : activeTab === "hosted"
                ? "You haven't hosted any live classes yet. Host your first Google Meet workshop today!"
                : "No classes match your current search and filters. Be the first to host one!"}
            </p>
          </div>
          <button
            onClick={() => {
              if (!isAuthenticated) navigate("/login?redirect=/live");
              else setShowCreateModal(true);
            }}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-sm transition-all cursor-pointer inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Host a Live Class</span>
          </button>
        </div>
      )}

      {/* Modal: Create Live Class */}
      <CreateLiveClassModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSessionCreated={() => {
          showToast("Live class published successfully!");
          fetchSessions();
        }}
      />

      {/* Modal: Attendance & Feedback */}
      {selectedSessionForAttendance && (
        <SessionAttendanceModal
          isOpen={Boolean(selectedSessionForAttendance)}
          onClose={() => setSelectedSessionForAttendance(null)}
          session={selectedSessionForAttendance}
          isHost={user && selectedSessionForAttendance.host_id === user.id}
          participants={[]}
          onUpdated={() => {
            fetchSessions();
          }}
        />
      )}

    </div>
  );
}
