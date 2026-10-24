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
  Check,
  ChevronDown,
  ChevronUp,
  Layers,
  BookOpen
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
  const [masterSkills, setMasterSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [skillSearchQuery, setSkillSearchQuery] = useState("");
  const [showAllSkills, setShowAllSkills] = useState(false);
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

      const skillsRes = await API.get("/skills");
      if (skillsRes.data.success) {
        setMasterSkills(skillsRes.data.skills || []);
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
    if (urlCategory) {
      setSelectedCategory(urlCategory);
    }
  }, [urlQuery, urlCategory]);

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
    setSelectedSkill("");
    setSkillSearchQuery("");
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

  // Domain keyword mappings for consolidated categories
  const domainKeywords = {
    "Web Development": ["web", "react", "html", "css", "javascript", "js", "node", "frontend", "backend", "fullstack", "next", "vue", "angular", "django", "spring"],
    "DSA & Core CS": ["dsa", "data structures", "algorithm", "java", "c++", "c", "python", "core", "dbms", "os", "sql", "system design", "operating", "network"],
    "AI & Machine Learning": ["ai", "machine learning", "ml", "deep learning", "data science", "nlp", "neural", "python", "pytorch", "tensorflow", "generative", "langchain"],
    "UI/UX Design": ["ui", "ux", "design", "figma", "graphic", "adobe", "prototype", "wireframe", "mobile", "persona", "usability"],
    "Cloud & DevOps": ["cloud", "devops", "aws", "docker", "kubernetes", "linux", "azure", "ci/cd", "terraform", "nginx", "prometheus"],
    "Languages & Comms": ["language", "english", "spanish", "communication", "german", "french", "japanese", "speaking", "writing", "interview", "public"]
  };

  // Get active domain skills list for the catalog tray
  const domainSkills = masterSkills.filter((s) => {
    if (selectedCategory) {
      const isDirectMatch = s.category === selectedCategory;
      const keywords = domainKeywords[selectedCategory] || [];
      const isKeywordMatch = keywords.some((kw) => (s.name || "").toLowerCase().includes(kw));
      if (!isDirectMatch && !isKeywordMatch) return false;
    }

    if (skillSearchQuery.trim()) {
      const q = skillSearchQuery.toLowerCase().trim();
      return (s.name || "").toLowerCase().includes(q) || (s.category || "").toLowerCase().includes(q);
    }

    return true;
  });

  // Filter & Sort client-side
  const filteredUsers = users.filter((u) => {
    // Experience Level Filter
    if (expFilter !== "all") {
      const targetExp = expFilter.toLowerCase();
      const hasExp = u.offered_skills?.some((s) => {
        const lvl = (s.experience_level || "intermediate").toLowerCase();
        if (targetExp === "advanced") {
          return lvl === "advanced" || lvl === "expert";
        }
        return lvl === targetExp;
      });
      if (!hasExp) return false;
    }

    // Consolidated Technical Domain Filter
    if (selectedCategory) {
      const keywords = domainKeywords[selectedCategory] || [selectedCategory.toLowerCase()];
      const matchesCategory = 
        u.offered_skills?.some((s) => keywords.some((kw) => (s.skill_name || "").toLowerCase().includes(kw) || (s.category || "").toLowerCase().includes(kw))) ||
        u.wanted_skills?.some((s) => keywords.some((kw) => (s.skill_name || "").toLowerCase().includes(kw) || (s.category || "").toLowerCase().includes(kw))) ||
        keywords.some((kw) => (u.profession || "").toLowerCase().includes(kw) || (u.bio || "").toLowerCase().includes(kw));

      if (!matchesCategory) return false;
    }

    // Specific Skill Filter (when user selects any technical skill)
    if (selectedSkill) {
      const targetSkill = selectedSkill.toLowerCase();
      const hasSkill = 
        u.offered_skills?.some((s) => (s.skill_name || "").toLowerCase().includes(targetSkill) || targetSkill.includes((s.skill_name || "").toLowerCase())) ||
        u.wanted_skills?.some((s) => (s.skill_name || "").toLowerCase().includes(targetSkill) || targetSkill.includes((s.skill_name || "").toLowerCase()));
      if (!hasSkill) return false;
    }

    // Search query keyword filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const nameMatch = u.name?.toLowerCase().includes(q);
      const bioMatch = u.bio?.toLowerCase().includes(q);
      const locMatch = u.location?.toLowerCase().includes(q);
      const profMatch = u.profession?.toLowerCase().includes(q);
      const eduMatch = u.education_degree?.toLowerCase().includes(q);
      const offeredMatch = u.offered_skills?.some((s) => s.skill_name?.toLowerCase().includes(q) || s.category?.toLowerCase().includes(q));
      const wantedMatch = u.wanted_skills?.some((s) => s.skill_name?.toLowerCase().includes(q) || s.category?.toLowerCase().includes(q));

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
            Browse verified mentors offering 1-on-1 skill exchanges. Explore domain skills below, select your category, and find the perfect learning partner.
          </p>
        </div>

        {/* Total Catalog Badge */}
        <div className="z-10 flex items-center gap-3 bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="block font-black text-slate-900 text-xs sm:text-sm">Technical Skills Catalog</span>
            <span className="text-[10px] text-blue-600 font-bold uppercase">All Technical Domains</span>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in">
          <span>{notification}</span>
          <button onClick={() => setNotification("")} className="text-emerald-600 hover:text-emerald-900 font-bold ml-4 cursor-pointer">✕</button>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-4">
        
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          
          {/* Search Input */}
          <div className="sm:col-span-2 lg:col-span-3 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by swapper name, city, or bio..."
              className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-3.5 p-0.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Consolidated Domain Dropdown */}
          <div className="sm:col-span-1 lg:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSkill("");
              }}
              className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              aria-label="Filter by Technical Domain"
            >
              <option value="">All Technical Domains</option>
              <option value="Web Development">💻 Web Development</option>
              <option value="DSA & Core CS">⚡ DSA & Core CS</option>
              <option value="AI & Machine Learning">🤖 AI & Machine Learning</option>
              <option value="UI/UX Design">🎨 UI/UX Design</option>
              <option value="Cloud & DevOps">☁️ Cloud & DevOps</option>
              <option value="Languages & Comms">🌐 Languages & Comms</option>
            </select>
          </div>

          {/* Technical Skills Dropdown */}
          <div className="sm:col-span-1 lg:col-span-2">
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer truncate"
              aria-label="Filter by Technical Skill"
            >
              <option value="">
                {selectedCategory ? `All ${selectedCategory} Skills` : "All Technical Skills"}
              </option>
              {selectedCategory ? (
                masterSkills
                  .filter((s) => {
                    const isDirectMatch = s.category === selectedCategory;
                    const keywords = domainKeywords[selectedCategory] || [];
                    const isKeywordMatch = keywords.some((kw) => (s.name || "").toLowerCase().includes(kw));
                    return isDirectMatch || isKeywordMatch;
                  })
                  .sort((a, b) => (a.name || "").localeCompare(b.name || ""))
                  .map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))
              ) : (
                Object.keys(domainKeywords).map((dom) => {
                  const skillsInDom = masterSkills
                    .filter((s) => {
                      const isDirectMatch = s.category === dom;
                      const keywords = domainKeywords[dom] || [];
                      const isKeywordMatch = keywords.some((kw) => (s.name || "").toLowerCase().includes(kw));
                      return isDirectMatch || isKeywordMatch;
                    })
                    .sort((a, b) => (a.name || "").localeCompare(b.name || ""));

                  if (skillsInDom.length === 0) return null;

                  return (
                    <optgroup key={dom} label={dom}>
                      {skillsInDom.map((s) => (
                        <option key={`${dom}-${s.id}`} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </optgroup>
                  );
                })
              )}
            </select>
          </div>

          {/* Experience Level Filter */}
          <div className="sm:col-span-1 lg:col-span-2">
            <select
              value={expFilter}
              onChange={(e) => setExpFilter(e.target.value)}
              className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              aria-label="Filter by Experience Level"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          {/* Sort Dropdown & Clear */}
          <div className="sm:col-span-1 lg:col-span-2 flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              aria-label="Sort Swappers"
            >
              <option value="newest">Newest</option>
              <option value="rating">Highest Rated</option>
              <option value="skills">Most Skills</option>
            </select>

            {(searchQuery || selectedCategory || selectedSkill || expFilter !== "all" || sortBy !== "newest") && (
              <button
                type="button"
                onClick={handleClearFilters}
                title="Reset All Filters"
                className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl transition-colors shrink-0 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>

        </form>

        {/* Technical Domain Tabs Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 no-scrollbar text-xs">
          <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3 text-blue-600" /> Domain:
          </span>

          {[
            { label: "All Technical Domains", value: "" },
            { label: "💻 Web Development", value: "Web Development" },
            { label: "⚡ DSA & Core CS", value: "DSA & Core CS" },
            { label: "🤖 AI & Machine Learning", value: "AI & Machine Learning" },
            { label: "🎨 UI/UX Design", value: "UI/UX Design" },
            { label: "☁️ Cloud & DevOps", value: "Cloud & DevOps" },
            { label: "🌐 Languages & Comms", value: "Languages & Comms" }
          ].map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setSelectedCategory(chip.value);
                setSelectedSkill("");
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold shrink-0 transition-all cursor-pointer ${
                selectedCategory === chip.value
                  ? "bg-blue-600 text-white shadow-xs scale-105"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* ============================================================== */}
        {/* INTERACTIVE TECHNICAL DOMAIN SKILLS CATALOG TRAY */}
        {/* ============================================================== */}
        <div className="pt-3 border-t border-slate-100 space-y-3">
          
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-extrabold text-[11px] flex items-center gap-1.5 border border-indigo-100">
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                <span>Skills in {selectedCategory || "All Technical Domains"}</span>
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                Interactive Skill Directory
              </span>
            </div>

            {/* Active Skill Filter Indicator */}
            {selectedSkill && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-full text-xs font-bold animate-in fade-in">
                <span>Filtering by: <strong className="text-slate-950">{selectedSkill}</strong></span>
                <button
                  onClick={() => setSelectedSkill("")}
                  className="p-0.5 hover:bg-amber-200 rounded-full text-amber-700 cursor-pointer ml-1"
                  title="Remove skill filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Quick Skill Search Input inside Tray */}
          <div className="relative max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={skillSearchQuery}
              onChange={(e) => setSkillSearchQuery(e.target.value)}
              placeholder="Search technical skills (e.g. React, Next.js, PyTorch, Figma, AWS, DSA)..."
              className="w-full pl-8 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400"
            />
            {skillSearchQuery && (
              <button
                type="button"
                onClick={() => setSkillSearchQuery("")}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Skills Interactive Chips Grid */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {(showAllSkills ? domainSkills : domainSkills.slice(0, 24)).map((s) => {
              const isSelected = selectedSkill === s.name;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setSelectedSkill(isSelected ? "" : s.name);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                    isSelected
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-md scale-105"
                      : "bg-slate-50 hover:bg-blue-50 text-slate-800 hover:text-blue-700 border-slate-200/90 hover:border-blue-300 shadow-2xs"
                  }`}
                  title={s.description || s.name}
                >
                  {isSelected && <Check className="w-3 h-3 text-white stroke-[3]" />}
                  <span>{s.name}</span>
                  {!selectedCategory && s.category && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-md font-extrabold ${isSelected ? "bg-white/20 text-white" : "bg-slate-200/80 text-slate-600"}`}>
                      {s.category.split(" ")[0]}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Toggle Expand / Collapse button if domain has > 24 skills */}
          {domainSkills.length > 24 && (
            <div className="pt-1 text-center">
              <button
                type="button"
                onClick={() => setShowAllSkills(!showAllSkills)}
                className="inline-flex items-center gap-1 text-xs font-extrabold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
              >
                {showAllSkills ? (
                  <>
                    <span>Show Fewer Skills</span>
                    <ChevronUp className="w-3.5 h-3.5" />
                  </>
                ) : (
                  <>
                    <span>Show All Skills</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          )}

        </div>

      </div>

      {/* Results Count Bar */}
      <div className="flex items-center justify-between px-2 text-xs font-semibold text-slate-500">
        <div>
          Showing <strong className="text-slate-900">{filteredUsers.length}</strong> verified swapper{filteredUsers.length === 1 ? "" : "s"}
          {selectedCategory && <span> in <strong className="text-blue-600">{selectedCategory}</strong></span>}
          {selectedSkill && <span> offering or learning <strong className="text-amber-700">"{selectedSkill}"</strong></span>}
        </div>
        {(selectedCategory || selectedSkill || searchQuery || expFilter !== "all") && (
          <button
            onClick={handleClearFilters}
            className="text-xs text-blue-600 hover:underline font-bold cursor-pointer"
          >
            Clear all filters
          </button>
        )}
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
        <div className="bg-white rounded-3xl p-10 sm:p-12 text-center border border-slate-200 max-w-lg mx-auto my-8 space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">No Swappers Match This Skill Search</h3>
            <p className="text-xs text-slate-500 mt-1">
              {selectedSkill 
                ? `No swappers currently match "${selectedSkill}". Try another skill chip from the catalog or clear filters.`
                : "Try selecting another domain or clearing your active filters."}
            </p>
          </div>

          {/* Quick-Reset Filter Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              onClick={() => {
                setExpFilter("all");
                setSelectedCategory("Web Development");
                setSelectedSkill("React.js Frontend Development");
                setSearchQuery("");
              }}
              className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-extrabold border border-blue-200/80 transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>+ Try "React.js"</span>
            </button>
            <button
              onClick={() => {
                setExpFilter("all");
                setSelectedCategory("DSA & Core CS");
                setSelectedSkill("Data Structures & Algorithms (DSA)");
                setSearchQuery("");
              }}
              className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-extrabold border border-indigo-200/80 transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>+ Try "DSA"</span>
            </button>
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-extrabold transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              Clear All Filters
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
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
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
                  <span className="text-xs text-slate-400 italic">No offered skills listed</span>
                )}
              </div>
            </div>

            {/* Skills Wanted */}
            <div>
              <p className="text-[10px] uppercase font-black text-blue-700 tracking-wider mb-2">Wants to Learn:</p>
              <div className="flex flex-wrap gap-1.5">
                {quickViewUser.wanted_skills && quickViewUser.wanted_skills.length > 0 ? (
                  quickViewUser.wanted_skills.map((s) => (
                    <SkillBadge key={s.id} skill={s} type="wanted" size="sm" />
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">No wanted skills listed</span>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => {
                  const target = quickViewUser;
                  setQuickViewUser(null);
                  handleRequestSwap(target);
                }}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                Propose 1-on-1 Swap
              </button>
              <button
                onClick={() => setQuickViewUser(null)}
                className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-extrabold transition-all cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Swap Request Modal */}
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
              <h3 className="text-xl font-black text-slate-900">Unlock 1-on-1 Skill Exchange</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                You are currently in <strong className="text-slate-900">Pre-Login Directory Mode</strong>. To initiate direct 1-on-1 skill exchange proposals, access Mutual Skill Matching, and launch live video rooms, please sign in or register!
              </p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-left space-y-1.5 text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <span className="text-emerald-500 font-black">✓</span> Send direct 1-on-1 proposals
              </div>
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <span className="text-emerald-500 font-black">✓</span> Live 1-on-1 video call rooms
              </div>
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <span className="text-emerald-500 font-black">✓</span> Mutual Skill Matching & Peer Review score
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => navigate("/login")}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-extrabold transition-all cursor-pointer"
              >
                Log In
              </button>
              <button
                onClick={() => navigate("/register")}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                Get Started →
              </button>
            </div>

            <button
              onClick={() => setShowGuestModal(false)}
              className="text-xs text-slate-400 font-semibold hover:underline block mx-auto pt-1 cursor-pointer"
            >
              Continue browsing as Guest
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
