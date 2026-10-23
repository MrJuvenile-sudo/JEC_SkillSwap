import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import UserCard from "../Components/UserCard";
import SwapRequestModal from "../Components/SwapRequestModal";
import LoadingSpinner from "../Components/LoadingSpinner";
import SkillBadge from "../Components/SkillBadge";
import { 
  Search, 
  RefreshCw, 
  AlertCircle, 
  Sparkles, 
  X, 
  SlidersHorizontal, 
  GraduationCap, 
  MapPin, 
  ShieldCheck, 
  Repeat, 
  ArrowRight,
  Video
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { get3DAvatarUrl } from "../utils/avatarUtils";

export default function Explore() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get("query") || "";
  const urlCategory = searchParams.get("category") || "";

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [expFilter, setExpFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  
  const [selectedUserForSwap, setSelectedUserForSwap] = useState(null);
  const [quickViewUser, setQuickViewUser] = useState(null);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [notification, setNotification] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await API.get("/discovery/search", {
        params: {
          query: searchQuery,
          category: selectedCategory,
        },
      });
      if (res.data.success) {
        setUsers(res.data.users || []);
      }
    } catch (err) {
      console.error("Error loading swappers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (urlQuery) {
      setSearchQuery(urlQuery);
    }
  }, [urlQuery]);

  useEffect(() => {
    if (urlCategory) {
      setSelectedCategory(urlCategory);
    }
  }, [urlCategory]);

  useEffect(() => {
    fetchUsers();
  }, [selectedCategory, searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setExpFilter("all");
    setSortBy("newest");
    fetchUsers();
  };

  const handleRequestSwap = (targetUser) => {
    if (!isAuthenticated) {
      setShowGuestModal(true);
      return;
    }
    setSelectedUserForSwap(targetUser);
  };

  // Filter & Sort client-side
  const filteredUsers = users.filter((u) => {
    // Experience level filter
    if (expFilter !== "all") {
      const level = (u.experience_level || u.level || "intermediate").toLowerCase();
      if (level !== expFilter.toLowerCase()) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const nameMatch = u.name?.toLowerCase().includes(q);
      const bioMatch = u.bio?.toLowerCase().includes(q);
      const locMatch = u.location?.toLowerCase().includes(q) || u.city?.toLowerCase().includes(q);
      const profMatch = u.profession?.toLowerCase().includes(q);
      const eduMatch = u.education_degree?.toLowerCase().includes(q);
      const offeredMatch = u.offered_skills?.some(s => s.skill_name?.toLowerCase().includes(q) || s.category?.toLowerCase().includes(q));
      const wantedMatch = u.wanted_skills?.some(s => s.skill_name?.toLowerCase().includes(q) || s.category?.toLowerCase().includes(q));

      if (!nameMatch && !bioMatch && !locMatch && !profMatch && !eduMatch && !offeredMatch && !wantedMatch) {
        return false;
      }
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === "rating") {
      return (parseFloat(b.rating) || 5) - (parseFloat(a.rating) || 5);
    }
    if (sortBy === "skills") {
      return (b.offered_skills?.length || 0) - (a.offered_skills?.length || 0);
    }
    return 0; // default newest
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/40 rounded-full blur-3xl pointer-events-none"></div>

        <div className="z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-2 border border-blue-100">
            <Search className="w-3.5 h-3.5 text-blue-600" />
            <span>Peer Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Discover Skill Swappers
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl font-medium">
            Connect directly with verified students and developers offering 1-on-1 practical skill exchanges across India.
          </p>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in">
          <span>{notification}</span>
          <button onClick={() => setNotification("")} className="text-emerald-600 hover:text-emerald-900 font-bold ml-4">✕</button>
        </div>
      )}

      {/* Filter & Search Controls */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          
          {/* Search Input */}
          <div className="sm:col-span-5 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by skill (React, Figma, DSA), name, or college..."
              className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-3.5 p-0.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Technical Domain Dropdown */}
          <div className="sm:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Domains</option>
              <option value="Technology & Programming">Web & Software Dev</option>
              <option value="DSA & Core CS">DSA & Core CS</option>
              <option value="AI & Data Science">AI & Machine Learning</option>
              <option value="Design & Creative">UI/UX Design & Creative</option>
              <option value="Cloud & DevOps">Cloud & DevOps</option>
              <option value="Languages">Languages & Interview Prep</option>
            </select>
          </div>

          {/* Experience Level Filter (Replaces Gender Filter) */}
          <div className="sm:col-span-2">
            <select
              value={expFilter}
              onChange={(e) => setExpFilter(e.target.value)}
              className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="sm:col-span-2 flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest</option>
              <option value="rating">Highest Rated</option>
              <option value="skills">Most Skills</option>
            </select>

            {(searchQuery || selectedCategory || expFilter !== "all" || sortBy !== "newest") && (
              <button
                type="button"
                onClick={handleClearFilters}
                title="Reset Filters"
                className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl transition-colors shrink-0"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>

        </form>

        {/* Distinct Technical Domain Quick Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 no-scrollbar text-xs">
          <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3 text-blue-600" /> Domains:
          </span>

          {[
            { label: "All Peers", value: "" },
            { label: "💻 Web Development", value: "Technology & Programming" },
            { label: "⚡ DSA & Core CS", value: "DSA & Core CS" },
            { label: "🤖 AI & Machine Learning", value: "AI & Data Science" },
            { label: "🎨 UI/UX Design", value: "Design & Creative" },
            { label: "☁️ Cloud & DevOps", value: "Cloud & DevOps" },
            { label: "🗣️ Languages & Comms", value: "Languages" }
          ].map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setSelectedCategory(chip.value);
                setSearchQuery("");
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                selectedCategory === chip.value
                  ? "bg-blue-600 text-white shadow-xs scale-105"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Peers Card Grid */}
      {loading ? (
        <LoadingSpinner label="Searching swapper directory..." />
      ) : filteredUsers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onRequestSwap={handleRequestSwap}
              onQuickView={(u) => setQuickViewUser(u)}
            />
          ))}
        </div>
      ) : (
        /* Clean Human Empty State with Quick Reset Tags */
        <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200 max-w-lg mx-auto my-8 space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Search className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">No peers found matching your criteria</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              Try searching for popular topics like <strong className="text-slate-700">React, Python, Figma, or DSA</strong>, or reset your filters.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {["React", "Python", "UI/UX Design", "DSA", "Figma", "Node.js"].map((term) => (
              <button
                key={term}
                onClick={() => {
                  setSearchQuery(term);
                  setSelectedCategory("");
                  setExpFilter("all");
                }}
                className="px-3 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 rounded-full text-xs font-semibold text-slate-700 transition-colors"
              >
                + Try "{term}"
              </button>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={handleClearFilters}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              Reset All Filters
            </button>
          </div>
        </div>
      )}

      {/* Quick View Swapper Modal */}
      {quickViewUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 border border-slate-200 relative overflow-hidden">
            <button
              onClick={() => setQuickViewUser(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 font-bold text-lg"
            >
              ✕
            </button>

            <div className="flex items-center gap-4">
              <img
                src={quickViewUser.profile_picture || get3DAvatarUrl(quickViewUser.gender, quickViewUser.name)}
                alt={quickViewUser.name}
                className="w-20 h-20 rounded-2xl object-cover ring-2 ring-blue-500/20 shadow-md"
              />
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-1.5">
                  {quickViewUser.name}
                  <ShieldCheck className="w-5 h-5 text-blue-600 inline" />
                </h3>
                <p className="text-xs font-bold text-blue-600 mt-0.5">
                  {quickViewUser.profession || "SkillSwap Co-Learner"}
                </p>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  {[quickViewUser.city, quickViewUser.location].filter(Boolean).join(", ") || "India (Remote)"}
                </p>
              </div>
            </div>

            {/* Academic Credentials Box */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-1.5">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                <span>Academic & Campus Credentials</span>
              </div>
              <p className="text-slate-700">Course / Degree: <strong className="text-slate-900">{quickViewUser.education_degree || "Engineering / Technology"}</strong></p>
              <p className="text-slate-700">College / Institute: <strong className="text-slate-900">{quickViewUser.education_institute || "JEC / Engineering College"}</strong></p>
              <p className="text-slate-700">Graduation Year: <strong className="text-slate-900">{quickViewUser.education_year || "2025 / 2026"}</strong></p>
            </div>

            {/* Bio */}
            {quickViewUser.bio && (
              <p className="text-xs text-slate-600 italic bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                "{quickViewUser.bio}"
              </p>
            )}

            {/* Skills Offered */}
            <div>
              <p className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider mb-2">Can Teach / Offers:</p>
              <div className="flex flex-wrap gap-1.5">
                {quickViewUser.offered_skills && quickViewUser.offered_skills.length > 0 ? (
                  quickViewUser.offered_skills.map((s) => (
                    <SkillBadge key={s.id} skill={s} type="offered" size="sm" />
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">No skills listed</span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setQuickViewUser(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setQuickViewUser(null);
                  handleRequestSwap(quickViewUser);
                }}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2"
              >
                <Repeat className="w-4 h-4" />
                <span>Request Swap Session</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Swap Request Proposal Modal */}
      {selectedUserForSwap && (
        <SwapRequestModal
          targetUser={selectedUserForSwap}
          onClose={() => setSelectedUserForSwap(null)}
          onSuccess={(msg) => setNotification(msg)}
        />
      )}

      {/* Guest Feature Teaser Modal */}
      {showGuestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 border border-slate-200 text-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <Sparkles className="w-7 h-7 text-blue-600 fill-blue-600" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900">Start Exchanging Skills 1-on-1</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Sign in to send direct exchange requests, match with complementary learning partners, and launch 1-on-1 video rooms with built-in code sandboxes!
              </p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-left space-y-1.5 text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <span className="text-emerald-500 font-black">✓</span> Send mutual skill exchange proposals
              </div>
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <span className="text-emerald-500 font-black">✓</span> 1-on-1 video rooms with code sandbox
              </div>
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <span className="text-emerald-500 font-black">✓</span> Verified peer reviews and karma ratings
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => navigate("/login")}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all"
              >
                Log In
              </button>
              <button
                onClick={() => navigate("/register")}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
              >
                Get Started Free →
              </button>
            </div>

            <button
              onClick={() => setShowGuestModal(false)}
              className="text-xs text-slate-400 font-semibold hover:underline block mx-auto pt-1"
            >
              Continue browsing as Guest
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
