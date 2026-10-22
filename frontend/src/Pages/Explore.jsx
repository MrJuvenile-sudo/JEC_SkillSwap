import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import UserCard from "../Components/UserCard";
import SwapRequestModal from "../Components/SwapRequestModal";
import LoadingSpinner from "../Components/LoadingSpinner";
import SkillBadge from "../Components/SkillBadge";
import { 
  Search, 
  Filter, 
  RefreshCw, 
  AlertCircle, 
  Sparkles, 
  X, 
  SlidersHorizontal, 
  BookOpen, 
  Star, 
  Users, 
  Award, 
  GraduationCap, 
  MapPin, 
  Briefcase, 
  ShieldCheck, 
  Repeat, 
  ArrowRight,
  UserCheck
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { get3DAvatarUrl } from "../utils/avatarUtils";

export default function Explore() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get("query") || "";

  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");
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

      const catRes = await API.get("/skills");
      if (catRes.data.success) {
        setCategories(catRes.data.categories || []);
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
    fetchUsers();
  }, [selectedCategory, searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setGenderFilter("all");
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
    if (genderFilter !== "all") {
      const g = (u.gender || "male").toLowerCase();
      if (genderFilter === "male" && g !== "male") return false;
      if (genderFilter === "female" && g !== "female") return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const nameMatch = u.name?.toLowerCase().includes(q);
      const bioMatch = u.bio?.toLowerCase().includes(q);
      const locMatch = u.location?.toLowerCase().includes(q);
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-2 border border-indigo-100">
            <Search className="w-3.5 h-3.5 text-indigo-600" />
            <span>Peer Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Discover Skill Swappers
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl font-medium">
            Browse verified mentors offering 1-on-1 reciprocal skill exchanges. Filter by domain, academic track, or avatar type.
          </p>
        </div>

        {/* Right side: Boy & Girl 1-on-1 Swapping Vignette */}
        <div className="z-10 hidden sm:flex items-center gap-3 bg-slate-50/90 border border-slate-200/90 rounded-2xl p-2.5 shadow-2xs self-start md:self-auto shrink-0">
          <div className="relative flex flex-col items-center">
            <img
              src="/hero/boy-tech.webp"
              alt="Tech Partner"
              className="w-12 h-14 object-contain object-bottom drop-shadow-sm"
              loading="lazy"
            />
            <span className="px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 text-[8px] font-black mt-0.5">
              Tech
            </span>
          </div>

          <div className="flex flex-col items-center justify-center px-1">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Repeat className="w-3.5 h-3.5" />
            </div>
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider mt-1">1:1 Barter</span>
          </div>

          <div className="relative flex flex-col items-center">
            <img
              src="/hero/girl-creative.png"
              alt="Creative Partner"
              className="w-12 h-14 object-contain object-bottom drop-shadow-sm"
              loading="lazy"
            />
            <span className="px-1.5 py-0.2 rounded bg-violet-100 text-violet-800 text-[8px] font-black mt-0.5">
              Design
            </span>
          </div>
        </div>
      </div>

      {/* Directory Live Stats Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="block font-black text-slate-900 text-sm">{filteredUsers.length} Active</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase">Verified Swappers</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <span className="block font-black text-slate-900 text-sm">98.4% Match</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase">Bilateral Precision</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Star className="w-5 h-5 fill-amber-400" />
          </div>
          <div>
            <span className="block font-black text-slate-900 text-sm">4.9 / 5.0</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase">Karma Rating</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="block font-black text-slate-900 text-sm">Computer Science & IT</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase">Curriculum Hub</span>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in">
          <span>{notification}</span>
          <button onClick={() => setNotification("")} className="text-emerald-600 hover:text-emerald-900 font-bold ml-4">✕</button>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          
          {/* Search Input */}
          <div className="sm:col-span-5 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by skill (React, Figma, DSA), name, or location..."
              className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

          {/* Category Dropdown */}
          <div className="sm:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              <option value="MCA Core & IT">MCA Core & IT Courses</option>
              <option value="Top IT Courses">Top IT Courses</option>
              <option value="Technology & Programming">Technology & Programming</option>
              <option value="Design & Creative">Design & Creative</option>
              <option value="Languages">Languages & Communication</option>
              <option value="Business & Marketing">Business & Marketing</option>
            </select>
          </div>

          {/* Gender Filter */}
          <div className="sm:col-span-2">
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 capitalize"
            >
              <option value="all">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
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

            {(searchQuery || selectedCategory || genderFilter !== "all" || sortBy !== "newest") && (
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

        {/* Quick Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 no-scrollbar text-xs">
          <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3 text-blue-600" /> Quick Track:
          </span>

          {[
            { label: "All Swappers", value: "" },
            { label: "🎓 MCA Core & IT", value: "MCA Core & IT" },
            { label: "💻 Top IT Courses", value: "Top IT Courses" },
            { label: "⚡ Technology & Code", value: "Technology & Programming" },
            { label: "🎨 Design & UI/UX", value: "Design & Creative" },
            { label: "🌐 Languages & Comms", value: "Languages" },
            { label: "📈 Business & Marketing", value: "Business & Marketing" }
          ].map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setSelectedCategory(chip.value);
                setSearchQuery("");
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold shrink-0 transition-all ${
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

      {/* Users Card Grid */}
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
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto my-8 space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">No Swappers Match Your Search</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your query terms or clearing the filter options.
            </p>
          </div>
          <button
            onClick={handleClearFilters}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
          >
            Clear Filters & View All
          </button>
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
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-1.5">
                  {quickViewUser.name}
                  <ShieldCheck className="w-5 h-5 text-blue-600 inline" />
                </h3>
                <p className="text-xs font-bold text-blue-600 mt-0.5">
                  {quickViewUser.profession || "SkillSwap Co-Learner"}
                </p>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  {[quickViewUser.city, quickViewUser.location].filter(Boolean).join(", ") || "Location not specified"}
                </p>
              </div>
            </div>

            {/* Academic Credentials Box */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-1.5">
              <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                <span>Academic & Campus Credentials</span>
              </div>
              <p className="text-slate-700">Course / Degree: <strong className="text-slate-900">{quickViewUser.education_degree || "Not specified"}</strong></p>
              <p className="text-slate-700">College / Institute: <strong className="text-slate-900">{quickViewUser.education_institute || "Not specified"}</strong></p>
              <p className="text-slate-700">University / Year: <strong className="text-slate-900">{quickViewUser.education_year || "Not specified"}</strong></p>
            </div>

            {/* Bio */}
            {quickViewUser.bio && (
              <p className="text-xs text-slate-600 italic bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                "{quickViewUser.bio}"
              </p>
            )}

            {/* Skills Offered */}
            <div>
              <p className="text-[10px] uppercase font-black text-emerald-700 tracking-wider mb-2">Can Teach / Offers:</p>
              <div className="flex flex-wrap gap-1.5">
                {quickViewUser.offered_skills && quickViewUser.offered_skills.length > 0 ? (
                  quickViewUser.offered_skills.map((s) => (
                    <SkillBadge key={s.id} skill={s} type="offered" size="sm" />
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">No skills specified</span>
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
                className="flex-1 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl text-xs font-extrabold shadow-md flex items-center justify-center gap-2"
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
              <Sparkles className="w-7 h-7 text-blue-600 fill-blue-600 animate-pulse" />
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900">Unlock 1-on-1 Barter Feature</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                You are currently in <strong className="text-slate-900">Pre-Login Directory Mode</strong>. To initiate direct reciprocal barter proposals, access AI Synergy Matcher, and launch live 1-on-1 video rooms, please sign in or register!
              </p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-left space-y-1.5 text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <span className="text-emerald-500 font-black">✓</span> Send direct bilateral proposals
              </div>
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <span className="text-emerald-500 font-black">✓</span> Live 1-on-1 video call rooms
              </div>
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <span className="text-emerald-500 font-black">✓</span> AI Synergy Matcher & Karma score
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => navigate("/login")}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-extrabold transition-all"
              >
                Log In
              </button>
              <button
                onClick={() => navigate("/register")}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold shadow-md shadow-blue-500/20 transition-all"
              >
                Join Free →
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
