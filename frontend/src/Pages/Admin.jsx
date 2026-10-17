import React, { useState, useEffect } from "react";
import API from "../services/api";
import LoadingSpinner from "../Components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { get3DAvatarUrl } from "../utils/avatarUtils";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Users,
  BookOpen,
  Video,
  Inbox,
  Star,
  Settings,
  Activity,
  Lock,
  Unlock,
  Trash2,
  Edit3,
  Plus,
  RefreshCw,
  Search,
  ExternalLink,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  Database,
  Layers,
  Key,
  Globe,
  Radio,
  Sliders,
  Terminal,
  Cpu,
  LogOut,
  ChevronRight,
  Eye,
  MessageSquareQuote,
  Mail,
  Phone,
  ToggleLeft,
  ToggleRight,
  Shield,
  Zap,
  Sparkles
} from "lucide-react";

export default function Admin() {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  // Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [masterKeyInput, setMasterKeyInput] = useState("");
  const [authError, setAuthError] = useState("");

  // Sidebar / Tab Navigation State: 'overview' | 'users' | 'skills' | 'exchanges' | 'requests' | 'reviews' | 'testimonials' | 'settings'
  const [activeTab, setActiveTab] = useState("overview");

  // Data States
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [skillsList, setSkillsList] = useState([]);
  const [exchangesList, setExchangesList] = useState([]);
  const [requestsList, setRequestsList] = useState([]);
  const [reviewsList, setReviewsList] = useState([]);
  const [testimonialsList, setTestimonialsList] = useState([]);
  const [settingsData, setSettingsData] = useState({
    site_title: "SkillSwap P2P Barter Network",
    site_tagline: "Zero-Cost 1-on-1 Co-Mentorship & Skill Barter",
    support_email: "support@skillswap.com",
    support_phone: "+91 98765-43210",
    announcement_banner: "Welcome to SkillSwap - Swap Skills, Master Coding & Design for Free!",
    maintenance_mode: "false",
    max_active_swaps: "5",
    default_meeting_provider: "Google Meet Auto-Launcher",
    auto_start_meet: "true",
    enable_testimonials: "true",
    enable_stickers_chat: "true",
    enable_peer_reviews: "true",
    hero_stat1_value: "14,200+",
    hero_stat1_label: "Swaps Completed",
    hero_stat2_value: "99.4%",
    hero_stat2_label: "Synergy Match Accuracy",
    hero_stat3_value: "4.9 / 5",
    hero_stat3_label: "Average Karma",
    hero_badge_pill1: "Verified Reciprocal Peer-to-Peer Learning Network",
    hero_badge_pill2: "Live AI Synergy Matching Active",
    hero_headline_static: "Teach what you know.",
    hero_headline_dynamic_prefix: "Master",
    hero_dynamic_phrases: "what you need next.\nData Structures & Algorithms.\nCloud Computing & AWS.\nSystem Design & DevOps.\nFigma & UI/UX Design.\nPython & Machine Learning.",
    hero_subtitle: "Trade expertise 1-on-1 with verified practitioners. SkillSwap matches schedule, levels, and mutual topics so you co-learn faster for free.",
    hero_cta1_text: "Start Swapping",
    hero_cta1_link: "/register",
    hero_cta2_text: "Explore Skills",
    hero_cta2_link: "/explore",
    hero_popular_topics: "Python, Figma, React, Spanish, Machine Learning, System Design, Prompt Engineering",
    hero_boy_name: "Aarav Sharma",
    hero_boy_role: "AI & ML Specialist",
    hero_boy_image: "/hero/boy-tech.webp",
    hero_boy_teach: "Machine Learning",
    hero_boy_want: "UI/UX Design",
    hero_girl_name: "Ananya Iyer",
    hero_girl_role: "Product & UI/UX Designer",
    hero_girl_image: "/hero/girl-creative.png",
    hero_girl_teach: "UI/UX Design",
    hero_girl_want: "Machine Learning",
    hero_pair1_boy: "Machine Learning",
    hero_pair1_girl: "UI/UX Design",
    hero_pair2_boy: "Python",
    hero_pair2_girl: "Spanish",
    hero_pair3_boy: "Data Science",
    hero_pair3_girl: "Digital Art",
    hero_pair4_boy: "System Design",
    hero_pair4_girl: "Brand Strategy"
  });

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [notification, setNotification] = useState("");

  // Search & Filters
  const [globalSearch, setGlobalSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [userStatusFilter, setUserStatusFilter] = useState("all");

  // Modals & Drawers
  const [inspectUser, setInspectUser] = useState(null);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [skillForm, setSkillForm] = useState({ name: "", category: "Technology & Programming", description: "" });

  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [testimonialForm, setTestimonialForm] = useState({
    author_name: "",
    author_role: "",
    skill_traded: "",
    rating: 5,
    quote: "",
    avatar_url: "",
    is_featured: true
  });

  // Initial Authentication Verification
  useEffect(() => {
    const sessionAuth = sessionStorage.getItem("admin_auth");
    if (currentUser?.role === "admin" || sessionAuth === "true") {
      setIsAdminAuthenticated(true);
    }
  }, [currentUser]);

  // Master Key Authentication Handler
  const handleAuthenticateAdmin = (e) => {
    e.preventDefault();
    if (masterKeyInput.trim() === "admin123" || currentUser?.role === "admin") {
      sessionStorage.setItem("admin_auth", "true");
      setIsAdminAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Invalid Admin Master Security Key. Please enter 'admin123' or login with admin privileges.");
    }
  };

  // Fetch All Synchronized Admin Data (Fault tolerant Promise.allSettled)
  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const config = { headers: { "x-admin-key": "admin123" } };
      const results = await Promise.allSettled([
        API.get("/admin/stats", config),
        API.get("/admin/users", config),
        API.get("/admin/skills", config),
        API.get("/admin/exchanges", config),
        API.get("/admin/requests", config),
        API.get("/admin/reviews", config),
        API.get("/admin/testimonials", config),
        API.get("/admin/settings", config)
      ]);

      const [statsRes, usersRes, skillsRes, exRes, reqRes, revRes, testRes, setRes] = results;

      if (statsRes.status === "fulfilled" && statsRes.value?.data?.success) setStats(statsRes.value.data.stats);
      if (usersRes.status === "fulfilled" && usersRes.value?.data?.success) setUsersList(usersRes.value.data.users || []);
      if (skillsRes.status === "fulfilled" && skillsRes.value?.data?.success) setSkillsList(skillsRes.value.data.skills || []);
      if (exRes.status === "fulfilled" && exRes.value?.data?.success) setExchangesList(exRes.value.data.exchanges || []);
      if (reqRes.status === "fulfilled" && reqRes.value?.data?.success) setRequestsList(reqRes.value.data.requests || []);
      if (revRes.status === "fulfilled" && revRes.value?.data?.success) setReviewsList(revRes.value.data.reviews || []);
      if (testRes.status === "fulfilled" && testRes.value?.data?.success) setTestimonialsList(testRes.value.data.testimonials || []);
      if (setRes.status === "fulfilled" && setRes.value?.data?.success) setSettingsData(prev => ({ ...prev, ...setRes.value.data.settings }));
    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminAuthenticated) {
      fetchAdminData();
    }
  }, [isAdminAuthenticated]);

  // Dynamic Browser Tab Favicon & Title for Admin Console
  useEffect(() => {
    const originalTitle = document.title;
    const faviconLink = document.querySelector("link[rel*='icon']");
    const originalFavicon = faviconLink ? faviconLink.getAttribute("href") : "/favicon.png";

    document.title = "SkillSwap Console | Admin Command Center";
    if (faviconLink) {
      faviconLink.setAttribute("href", "/admin-favicon.svg");
    }

    return () => {
      document.title = originalTitle;
      if (faviconLink && originalFavicon) {
        faviconLink.setAttribute("href", originalFavicon);
      }
    };
  }, []);

  // Actions
  const handleUpdateUserRole = async (userId, newRole) => {
    setActionLoading(userId);
    try {
      const res = await API.put(`/admin/users/${userId}/role`, { role: newRole }, { headers: { "x-admin-key": "admin123" } });
      if (res.data.success) {
        setNotification(`User role updated to ${newRole}`);
        fetchAdminData();
      }
    } catch (err) {
      alert("Failed to update role");
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateUserStatus = async (userId, newStatus) => {
    setActionLoading(userId);
    try {
      const res = await API.put(`/admin/users/${userId}/ban`, { status: newStatus }, { headers: { "x-admin-key": "admin123" } });
      if (res.data.success) {
        setNotification(`User status set to ${newStatus}`);
        fetchAdminData();
      }
    } catch (err) {
      alert("Failed to update user status");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to permanently delete this user account?")) return;
    setActionLoading(userId);
    try {
      const res = await API.delete(`/admin/users/${userId}`, { headers: { "x-admin-key": "admin123" } });
      if (res.data.success) {
        setNotification("User account purged!");
        fetchAdminData();
      }
    } catch (err) {
      alert("Failed to delete user");
    } finally {
      setActionLoading(null);
    }
  };

  const handleSaveSkill = async (e) => {
    e.preventDefault();
    if (!skillForm.name.trim()) return;
    try {
      if (editingSkill) {
        await API.put(`/admin/skills/${editingSkill.id}`, skillForm, { headers: { "x-admin-key": "admin123" } });
        setNotification("Master skill updated!");
      } else {
        await API.post("/admin/skills", skillForm, { headers: { "x-admin-key": "admin123" } });
        setNotification("New master skill created!");
      }
      setShowSkillModal(false);
      setEditingSkill(null);
      setSkillForm({ name: "", category: "Technology & Programming", description: "" });
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save skill");
    }
  };

  const handleDeleteSkill = async (skillId) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) return;
    try {
      await API.delete(`/admin/skills/${skillId}`, { headers: { "x-admin-key": "admin123" } });
      setNotification("Skill deleted!");
      fetchAdminData();
    } catch (err) {
      alert("Failed to delete skill");
    }
  };

  const handleUpdateExchangeStatus = async (exchangeId, newStatus) => {
    try {
      await API.put(`/admin/exchanges/${exchangeId}`, { status: newStatus }, { headers: { "x-admin-key": "admin123" } });
      setNotification(`Exchange room status set to ${newStatus}`);
      fetchAdminData();
    } catch (err) {
      alert("Failed to update exchange status");
    }
  };

  const handleDeleteExchange = async (exchangeId) => {
    if (!window.confirm("Are you sure you want to delete this session room?")) return;
    try {
      await API.delete(`/admin/exchanges/${exchangeId}`, { headers: { "x-admin-key": "admin123" } });
      setNotification("Session room deleted!");
      fetchAdminData();
    } catch (err) {
      alert("Failed to delete exchange");
    }
  };

  const handleUpdateRequestStatus = async (requestId, newStatus) => {
    try {
      await API.put(`/admin/requests/${requestId}/status`, { status: newStatus }, { headers: { "x-admin-key": "admin123" } });
      setNotification(`Proposal status set to ${newStatus}`);
      fetchAdminData();
    } catch (err) {
      alert("Failed to update request status");
    }
  };

  const handleDeleteRequest = async (requestId) => {
    if (!window.confirm("Are you sure you want to delete this request?")) return;
    try {
      await API.delete(`/admin/requests/${requestId}`, { headers: { "x-admin-key": "admin123" } });
      setNotification("Proposal deleted!");
      fetchAdminData();
    } catch (err) {
      alert("Failed to delete request");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await API.delete(`/admin/reviews/${reviewId}`, { headers: { "x-admin-key": "admin123" } });
      setNotification("Review deleted!");
      fetchAdminData();
    } catch (err) {
      alert("Failed to delete review");
    }
  };

  // Testimonial Handlers
  const handleSaveTestimonial = async (e) => {
    e.preventDefault();
    if (!testimonialForm.author_name.trim() || !testimonialForm.quote.trim()) return;
    try {
      if (editingTestimonial) {
        await API.put(`/admin/testimonials/${editingTestimonial.id}`, testimonialForm, { headers: { "x-admin-key": "admin123" } });
        setNotification("Testimonial updated!");
      } else {
        await API.post("/admin/testimonials", testimonialForm, { headers: { "x-admin-key": "admin123" } });
        setNotification("New testimonial added & synchronized with Home Page!");
      }
      setShowTestimonialModal(false);
      setEditingTestimonial(null);
      setTestimonialForm({ author_name: "", author_role: "", skill_traded: "", rating: 5, quote: "", avatar_url: "", is_featured: true });
      fetchAdminData();
    } catch (err) {
      alert("Failed to save testimonial");
    }
  };

  const handleDeleteTestimonial = async (tId) => {
    if (!window.confirm("Are you sure you want to remove this testimonial from the Home Page?")) return;
    try {
      await API.delete(`/admin/testimonials/${tId}`, { headers: { "x-admin-key": "admin123" } });
      setNotification("Testimonial removed!");
      fetchAdminData();
    } catch (err) {
      alert("Failed to delete testimonial");
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      await API.put("/admin/settings", { settings: settingsData }, { headers: { "x-admin-key": "admin123" } });
      setNotification("Global site settings & platform configurations updated!");
      fetchAdminData();
    } catch (err) {
      alert("Failed to update settings");
    }
  };

  // Filtered Lists
  const filteredUsers = usersList.filter((u) => {
    const q = globalSearch.toLowerCase();
    const matchesSearch = u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.city?.toLowerCase().includes(q);
    const matchesRole = userRoleFilter === "all" || u.role === userRoleFilter;
    const matchesStatus = userStatusFilter === "all" || u.status === userStatusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const filteredSkills = skillsList.filter((s) => {
    const q = globalSearch.toLowerCase();
    return s.name?.toLowerCase().includes(q) || s.category?.toLowerCase().includes(q);
  });

  // UNAUTHENTICATED GATE MODAL
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-100 text-slate-900 flex items-center justify-center p-4 font-sans selection:bg-indigo-500 selection:text-white">
        <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-xl border border-slate-200 space-y-6 text-center relative overflow-hidden">
          <div className="relative w-20 h-20 mx-auto">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-950 p-2 flex items-center justify-center shadow-xl shadow-indigo-600/30 ring-4 ring-indigo-100/80">
              <img
                src="/admin-favicon.svg"
                alt="SkillSwap Admin Favicon"
                className="w-full h-full object-contain drop-shadow-md"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-amber-400 text-slate-950 rounded-full border-2 border-white flex items-center justify-center shadow-md">
              <Lock className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-mono border border-indigo-200 font-bold">
              <Terminal className="w-3 h-3 text-indigo-600" /> SECURITY GATE ACCESS
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">SkillSwap Admin Console</h2>
            <p className="text-xs text-slate-500 font-medium">
              Enter your Master Security Key (<code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-indigo-700">admin123</code>) to unlock system governance and database management.
            </p>
          </div>

          <form onSubmit={handleAuthenticateAdmin} className="space-y-4">
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={masterKeyInput}
                onChange={(e) => setMasterKeyInput(e.target.value)}
                placeholder="Enter Master PIN (e.g. admin123)"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white"
              />
            </div>

            {authError && (
              <p className="text-xs font-bold text-rose-700 bg-rose-50 p-3 rounded-xl border border-rose-200">
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-2xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock Command Console</span>
            </button>
          </form>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-4 text-xs font-bold text-slate-500">
            <button onClick={() => navigate("/")} className="hover:text-indigo-600 flex items-center gap-1 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Exit to Public Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
      
      {/* 1. DEDICATED LIGHT ENTERPRISE ADMIN HEADER */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-40 shadow-xs backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand Logo / Favicon & Status */}
          <div className="flex items-center gap-3">
            <div className="relative group cursor-pointer" onClick={() => setActiveTab("overview")}>
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-950 p-1 flex items-center justify-center shadow-lg shadow-indigo-600/25 ring-2 ring-indigo-500/20 transition-all group-hover:scale-105 group-hover:ring-indigo-400">
                <img
                  src="/admin-favicon.svg"
                  alt="SkillSwap Admin Console Favicon"
                  className="w-full h-full object-contain rounded-xl drop-shadow-sm"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center text-[8px] text-white font-black shadow-xs" title="Console Active">
                ✓
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-slate-900 tracking-tight">SkillSwap Admin Console</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span> Live Enterprise v2.5
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium block -mt-0.5">
                Centralized Governance Console • Global Skill Barter Network
              </span>
            </div>
          </div>

          {/* Global Search Bar */}
          <div className="hidden md:flex items-center relative max-w-sm w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Global search swappers, skills, or rooms..."
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
            />
          </div>

          {/* Action Control Group */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={fetchAdminData}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200 text-xs font-bold transition-all flex items-center gap-1.5"
              title="Refresh Synchronized Data"
            >
              <RefreshCw className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline">Sync</span>
            </button>

            <button
              onClick={() => {
                sessionStorage.removeItem("admin_auth");
                setIsAdminAuthenticated(false);
              }}
              className="p-2.5 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 rounded-xl border border-slate-200 hover:border-rose-200 text-xs font-bold transition-all flex items-center gap-1.5"
              title="Lock Admin Session"
            >
              <Lock className="w-4 h-4" />
              <span className="hidden sm:inline">Lock</span>
            </button>

            <button
              onClick={() => navigate("/")}
              className="px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5"
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">Public Website</span>
            </button>
          </div>

        </div>
      </header>

      {/* 2. MAIN LAYOUT WITH ENTERPRISE SIDEBAR & CANVAS */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col md:flex-row gap-6">
        
        {/* LEFT ENTERPRISE SIDEBAR NAVIGATION */}
        <aside className="w-full md:w-64 bg-white rounded-3xl border border-slate-200 p-4 shrink-0 space-y-6 shadow-xs h-fit">
          <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/admin-favicon.svg" alt="Admin Icon" className="w-4 h-4 object-contain rounded drop-shadow-xs" />
              <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider font-extrabold">System Modules</span>
            </div>
            <Sliders className="w-3.5 h-3.5 text-indigo-600" />
          </div>

          <nav className="space-y-1.5 text-xs font-extrabold">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full px-4 py-3 rounded-2xl transition-all flex items-center justify-between ${
                activeTab === "overview"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-black"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Activity className={`w-4 h-4 ${activeTab === "overview" ? "text-white" : "text-indigo-600"}`} />
                <span>Dashboard & Metrics</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className={`w-full px-4 py-3 rounded-2xl transition-all flex items-center justify-between ${
                activeTab === "users"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-black"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className={`w-4 h-4 ${activeTab === "users" ? "text-white" : "text-indigo-600"}`} />
                <span>User Governance</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${activeTab === "users" ? "bg-indigo-700 text-white" : "bg-slate-100 text-slate-700"}`}>
                {usersList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("skills")}
              className={`w-full px-4 py-3 rounded-2xl transition-all flex items-center justify-between ${
                activeTab === "skills"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-black"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className={`w-4 h-4 ${activeTab === "skills" ? "text-white" : "text-amber-500"}`} />
                <span>Skills Catalog</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${activeTab === "skills" ? "bg-indigo-700 text-white" : "bg-slate-100 text-slate-700"}`}>
                {skillsList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("exchanges")}
              className={`w-full px-4 py-3 rounded-2xl transition-all flex items-center justify-between ${
                activeTab === "exchanges"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-black"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Video className={`w-4 h-4 ${activeTab === "exchanges" ? "text-white" : "text-emerald-600"}`} />
                <span>Classroom Sessions</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${activeTab === "exchanges" ? "bg-indigo-700 text-white" : "bg-slate-100 text-slate-700"}`}>
                {exchangesList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("requests")}
              className={`w-full px-4 py-3 rounded-2xl transition-all flex items-center justify-between ${
                activeTab === "requests"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-black"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Inbox className={`w-4 h-4 ${activeTab === "requests" ? "text-white" : "text-rose-500"}`} />
                <span>Swap Proposals</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${activeTab === "requests" ? "bg-indigo-700 text-white" : "bg-slate-100 text-slate-700"}`}>
                {requestsList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("reviews")}
              className={`w-full px-4 py-3 rounded-2xl transition-all flex items-center justify-between ${
                activeTab === "reviews"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-black"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Star className={`w-4 h-4 ${activeTab === "reviews" ? "text-white fill-white" : "text-amber-400 fill-amber-400"}`} />
                <span>Reviews Moderation</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${activeTab === "reviews" ? "bg-indigo-700 text-white" : "bg-slate-100 text-slate-700"}`}>
                {reviewsList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("testimonials")}
              className={`w-full px-4 py-3 rounded-2xl transition-all flex items-center justify-between ${
                activeTab === "testimonials"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-black"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MessageSquareQuote className={`w-4 h-4 ${activeTab === "testimonials" ? "text-white" : "text-cyan-600"}`} />
                <span>Home Testimonials</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${activeTab === "testimonials" ? "bg-indigo-700 text-white" : "bg-slate-100 text-slate-700"}`}>
                {testimonialsList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full px-4 py-3 rounded-2xl transition-all flex items-center justify-between ${
                activeTab === "settings"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-black"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Settings className={`w-4 h-4 ${activeTab === "settings" ? "text-white" : "text-slate-500"}`} />
                <span>Site & Platform Rules</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </button>
          </nav>

          {/* System Uptime Box */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[10px] font-mono font-bold uppercase">DB Connection:</span>
              <span className="text-emerald-600 font-bold">{stats?.dbStatus || "Connected"}</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-full animate-pulse"></div>
            </div>
            <span className="text-[10px] text-slate-500 font-mono block">Uptime: {stats?.systemHealth || "100% Operational"}</span>
          </div>
        </aside>

        {/* RIGHT MAIN COMMAND CENTER CANVAS */}
        <main className="flex-1 space-y-6">
          
          {/* TOAST NOTIFICATION */}
          {notification && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xs">
              <span>{notification}</span>
              <button onClick={() => setNotification("")} className="text-emerald-600 font-bold ml-4 hover:text-emerald-800">✕</button>
            </div>
          )}

          {loading ? (
            <LoadingSpinner label="Loading synchronized backend metrics..." />
          ) : activeTab === "overview" ? (
            /* OVERVIEW / DASHBOARD TAB */
            <div className="space-y-6">
              
              {/* Top Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-2 shadow-xs relative overflow-hidden">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-xs font-mono font-extrabold uppercase">Total Swappers</span>
                    <Users className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900">{stats?.totalUsers || 0}</h3>
                  <p className="text-[11px] text-slate-500 font-medium">{stats?.totalAdmins || 0} System Admins</p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-2 shadow-xs relative overflow-hidden">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-xs font-mono font-extrabold uppercase">Master Skills</span>
                    <BookOpen className="w-5 h-5 text-amber-500" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900">{stats?.totalSkills || 0}</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Categorized Barter Courses</p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-2 shadow-xs relative overflow-hidden">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-xs font-mono font-extrabold uppercase">Classroom Rooms</span>
                    <Video className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900">{stats?.totalExchanges || 0}</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Active Session Rooms</p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-2 shadow-xs relative overflow-hidden">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-xs font-mono font-extrabold uppercase">Proposals</span>
                    <Inbox className="w-5 h-5 text-rose-500" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900">{stats?.totalRequests || 0}</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Pending & Accepted</p>
                </div>
              </div>

              {/* System Diagnostics & Rating */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-xs font-extrabold text-indigo-600 font-mono">Database Diagnostics</span>
                    <Database className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Database Connection:</span>
                      <span className="font-extrabold text-emerald-600 font-mono">{stats?.dbStatus}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">System Uptime:</span>
                      <span className="font-extrabold text-emerald-600 font-mono">{stats?.systemHealth}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Banned Accounts:</span>
                      <span className="font-extrabold text-rose-600 font-mono">{stats?.bannedUsers || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 shadow-xs lg:col-span-2">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-xs font-extrabold text-slate-900">Platform Karma Rating Analytics</span>
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  </div>
                  <div className="flex items-center justify-around text-center py-2">
                    <div>
                      <span className="text-4xl font-black text-amber-500">{stats?.averageRating || "5.0"}</span>
                      <span className="text-xs text-slate-500 font-bold block mt-1">Average Peer Rating</span>
                    </div>
                    <div className="w-px h-12 bg-slate-200"></div>
                    <div>
                      <span className="text-4xl font-black text-slate-900">{stats?.totalReviews || 0}</span>
                      <span className="text-xs text-slate-500 font-bold block mt-1">Total Verified Reviews</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          ) : activeTab === "users" ? (
            /* USERS GOVERNANCE TAB */
            <div className="space-y-6">
              
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-600" />
                    <span>User Accounts Governance ({filteredUsers.length})</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Manage user permissions, roles, bans, and account states.</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-600"
                  >
                    <option value="all">All Roles</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>

                  <select
                    value={userStatusFilter}
                    onChange={(e) => setUserStatusFilter(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-600"
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="banned">Banned</option>
                  </select>
                </div>
              </div>

              {/* Users Data Table */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-mono font-extrabold uppercase border-b border-slate-200 text-[10px]">
                      <th className="py-4 px-4">Swapper</th>
                      <th className="py-4 px-4">Role</th>
                      <th className="py-4 px-4">Status</th>
                      <th className="py-4 px-4">Offered / Wanted</th>
                      <th className="py-4 px-4">City</th>
                      <th className="py-4 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-4 flex items-center gap-3">
                          <img
                            src={u.profile_picture || get3DAvatarUrl("other", u.name)}
                            alt={u.name}
                            className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                          />
                          <div>
                            <span className="font-extrabold text-slate-900 block text-xs">{u.name}</span>
                            <span className="text-[11px] text-slate-500 block">{u.email}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          {u.role === "admin" ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-purple-50 text-purple-700 border border-purple-200">
                              Admin
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                              User
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          {u.status === "banned" ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-50 text-rose-700 border border-rose-200">
                              Banned
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Active
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-slate-700 font-bold">
                          {u.offered_count} Offered / {u.wanted_count} Wanted
                        </td>

                        <td className="py-3.5 px-4 text-slate-500">
                          {u.city || u.location || "Location not set"}
                        </td>

                        <td className="py-3.5 px-4 text-right space-x-1 shrink-0">
                          <button
                            onClick={() => setInspectUser(u)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 rounded-lg hover:bg-indigo-50"
                            title="Inspect Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {u.role === "admin" ? (
                            <button
                              onClick={() => handleUpdateUserRole(u.id, "user")}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold border border-slate-200"
                            >
                              Demote
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUpdateUserRole(u.id, "admin")}
                              className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-[10px] font-bold border border-purple-200"
                            >
                              Make Admin
                            </button>
                          )}

                          {u.status === "banned" ? (
                            <button
                              onClick={() => handleUpdateUserStatus(u.id, "active")}
                              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-bold border border-emerald-200"
                            >
                              Unban
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUpdateUserStatus(u.id, "banned")}
                              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-[10px] font-bold border border-rose-200"
                            >
                              Ban
                            </button>
                          )}

                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                            title="Delete Account"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          ) : activeTab === "skills" ? (
            /* SKILLS DIRECTORY TAB */
            <div className="space-y-6">
              
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-amber-500" />
                    <span>Master Skills Directory Catalog ({filteredSkills.length})</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Manage course offerings available for barter across the platform.</p>
                </div>

                <button
                  onClick={() => {
                    setEditingSkill(null);
                    setSkillForm({ name: "", category: "Technology & Programming", description: "" });
                    setShowSkillModal(true);
                  }}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl shadow-md shadow-amber-500/20 flex items-center gap-1.5 shrink-0 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Skill</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSkills.map((s) => (
                  <div key={s.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 uppercase">
                          {s.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setEditingSkill(s);
                              setSkillForm({ name: s.name, category: s.category, description: s.description || "" });
                              setShowSkillModal(true);
                            }}
                            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSkill(s.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <h4 className="font-extrabold text-slate-900 text-base">{s.name}</h4>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        {s.description || "Master barter skill track."}
                      </p>
                    </div>

                    <div className="text-[10px] text-slate-400 font-mono font-bold pt-2 border-t border-slate-100">
                      Skill ID #{s.id}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ) : activeTab === "exchanges" ? (
            /* EXCHANGES MANAGEMENT TAB */
            <div className="space-y-6">
              
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Video className="w-5 h-5 text-emerald-600" />
                  <span>Classroom Sessions & Exchange Rooms ({exchangesList.length})</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">Monitor live classrooms, edit meeting URLs, or terminate session rooms.</p>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-mono font-extrabold uppercase border-b border-slate-200 text-[10px]">
                      <th className="py-4 px-4">Room ID</th>
                      <th className="py-4 px-4">Requester & Offered</th>
                      <th className="py-4 px-4">Receiver & Requested</th>
                      <th className="py-4 px-4">Status</th>
                      <th className="py-4 px-4">Meeting Link</th>
                      <th className="py-4 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {exchangesList.map((ex) => (
                      <tr key={ex.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">#{ex.id}</td>

                        <td className="py-3.5 px-4">
                          <span className="font-extrabold text-slate-900 block">{ex.requester_name || "Swapper"}</span>
                          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mt-0.5">
                            {ex.offered_skill_name}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-extrabold text-slate-900 block">{ex.receiver_name || "Swapper"}</span>
                          <span className="text-[10px] text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 inline-block mt-0.5">
                            {ex.requested_skill_name}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                            ex.status === "completed" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                            ex.status === "in_progress" ? "bg-blue-50 text-blue-700 border border-blue-200" : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}>
                            {ex.status}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px] truncate max-w-xs">
                          {ex.meeting_link || "https://meet.google.com/new"}
                        </td>

                        <td className="py-3.5 px-4 text-right space-x-1 shrink-0">
                          <button
                            onClick={() => handleUpdateExchangeStatus(ex.id, ex.status === "completed" ? "scheduled" : "completed")}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold border border-slate-200"
                          >
                            Toggle Status
                          </button>

                          <button
                            onClick={() => handleDeleteExchange(ex.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          ) : activeTab === "requests" ? (
            /* REQUESTS MANAGEMENT TAB */
            <div className="space-y-6">
              
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Inbox className="w-5 h-5 text-rose-500" />
                  <span>Swap Proposals & Request Queue ({requestsList.length})</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">Force approve, reject, or purge exchange proposals.</p>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-mono font-extrabold uppercase border-b border-slate-200 text-[10px]">
                      <th className="py-4 px-4">Req ID</th>
                      <th className="py-4 px-4">Requester</th>
                      <th className="py-4 px-4">Receiver</th>
                      <th className="py-4 px-4">Trade Skills</th>
                      <th className="py-4 px-4">Status</th>
                      <th className="py-4 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {requestsList.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">#{r.id}</td>
                        <td className="py-3.5 px-4 font-extrabold text-slate-900">{r.requester_name}</td>
                        <td className="py-3.5 px-4 font-extrabold text-slate-900">{r.receiver_name}</td>
                        <td className="py-3.5 px-4 text-slate-700 font-bold">{r.offered_skill_name} ↔ {r.requested_skill_name}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                            r.status === "accepted" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                            r.status === "rejected" ? "bg-rose-50 text-rose-700 border border-rose-200" : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-1 shrink-0">
                          {r.status !== "accepted" && (
                            <button
                              onClick={() => handleUpdateRequestStatus(r.id, "accepted")}
                              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-bold border border-emerald-200"
                            >
                              Approve
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteRequest(r.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          ) : activeTab === "reviews" ? (
            /* REVIEWS TAB */
            <div className="space-y-6">
              
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <span>Peer Reviews Moderation ({reviewsList.length})</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">Inspect ratings and remove inappropriate comments.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviewsList.map((rev) => (
                  <div key={rev.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> {rev.rating} / 5 Stars
                        </span>
                        <button
                          onClick={() => handleDeleteReview(rev.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-slate-700 italic bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        "{rev.comment || "Great reciprocal barter session!"}"
                      </p>
                    </div>
                    <div className="text-[11px] text-slate-500 font-bold flex justify-between pt-2 border-t border-slate-100">
                      <span>By: {rev.reviewer_name}</span>
                      <span>For: {rev.reviewee_name}</span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ) : activeTab === "testimonials" ? (
            /* HOME PAGE TESTIMONIALS MANAGER TAB */
            <div className="space-y-6">
              
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <MessageSquareQuote className="w-5 h-5 text-cyan-600" />
                    <span>Home Page Testimonials Manager ({testimonialsList.length})</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Manage real student & swapper testimonials displayed on the SkillSwap Home Page.</p>
                </div>

                <button
                  onClick={() => {
                    setEditingTestimonial(null);
                    setTestimonialForm({ author_name: "", author_role: "", skill_traded: "", rating: 5, quote: "", avatar_url: "", is_featured: true });
                    setShowTestimonialModal(true);
                  }}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-indigo-600/20 flex items-center gap-1.5 shrink-0 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Testimonial</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonialsList.map((t) => (
                  <div key={t.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between hover:border-indigo-300 transition-all">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-amber-400">
                          {[...Array(t.rating || 5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                          ))}
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setEditingTestimonial(t);
                              setTestimonialForm({
                                author_name: t.author_name,
                                author_role: t.author_role || "",
                                skill_traded: t.skill_traded || "",
                                rating: t.rating || 5,
                                quote: t.quote || "",
                                avatar_url: t.avatar_url || "",
                                is_featured: Boolean(t.is_featured)
                              });
                              setShowTestimonialModal(true);
                            }}
                            className="p-1 text-slate-400 hover:text-indigo-600 rounded-lg"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTestimonial(t.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-700 italic bg-slate-50 p-3.5 rounded-2xl border border-slate-100 leading-relaxed">
                        "{t.quote}"
                      </p>
                    </div>

                    <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                      <img
                        src={t.avatar_url || get3DAvatarUrl("other", t.author_name)}
                        alt={t.author_name}
                        className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200"
                      />
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1">
                          {t.author_name}
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 fill-blue-50" />
                        </h4>
                        <span className="text-[10px] text-slate-500 font-semibold block">{t.author_role}</span>
                        <span className="text-[10px] text-indigo-600 font-bold block mt-0.5">{t.skill_traded}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ) : (
            /* DETAILED SYSTEM SETTINGS TAB (INDUSTRY BEST PRACTICES) */
            <div className="space-y-6 max-w-4xl">
              
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-indigo-600" />
                  <span>Platform Governance & Site Configurations</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">Fine-tune global platform settings, feature flags, virtual meeting rules, and support helplines.</p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-6">
                
                {/* Section 1: General Identity & Branding */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-900 font-extrabold text-sm">
                    <Globe className="w-4 h-4 text-indigo-600" />
                    <span>General Site Identity & Support</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold">
                    <div>
                      <label className="block text-slate-700 mb-1">Platform Name / Title</label>
                      <input
                        type="text"
                        value={settingsData.site_title || ""}
                        onChange={(e) => setSettingsData({ ...settingsData, site_title: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-600 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">Tagline</label>
                      <input
                        type="text"
                        value={settingsData.site_tagline || ""}
                        onChange={(e) => setSettingsData({ ...settingsData, site_tagline: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-600 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">Support Email</label>
                      <input
                        type="email"
                        value={settingsData.support_email || ""}
                        onChange={(e) => setSettingsData({ ...settingsData, support_email: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-600 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">Contact Phone / Campus Helpline</label>
                      <input
                        type="text"
                        value={settingsData.support_phone || ""}
                        onChange={(e) => setSettingsData({ ...settingsData, support_phone: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-600 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="text-xs font-bold pt-2">
                    <label className="block text-slate-700 mb-1">Global Announcement Banner (Dynamic Sync across Website)</label>
                    <input
                      type="text"
                      value={settingsData.announcement_banner || ""}
                      onChange={(e) => setSettingsData({ ...settingsData, announcement_banner: e.target.value })}
                      placeholder="e.g. Welcome to SkillSwap P2P Barter Network!"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-600 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Section 1.5: Home Page Hero Section Key Statistics */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Hero Section Statistics (Displayed on Home Page)</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSettingsData(prev => ({
                          ...prev,
                          hero_stat1_value: stats?.totalExchanges ? `${stats.totalExchanges}+` : "14,200+",
                          hero_stat1_label: "Swaps Completed",
                          hero_stat2_value: "99.4%",
                          hero_stat2_label: "Synergy Match Accuracy",
                          hero_stat3_value: stats?.averageRating ? `${stats.averageRating} / 5` : "4.9 / 5",
                          hero_stat3_label: "Average Karma"
                        }));
                        setNotification("Populated with real-time database counts! Click 'Save' to persist.");
                      }}
                      className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-2xs font-extrabold rounded-lg border border-indigo-200 transition-all flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Sync Real DB Counts</span>
                    </button>
                  </div>

                  <p className="text-xs text-slate-500 font-medium">
                    Customize the 3 main metrics displayed directly under the search bar on the home page hero section.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-bold">
                    {/* Stat 1 */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                      <span className="text-indigo-600 block uppercase tracking-wider text-2xs font-black">Statistic #1 (Left)</span>
                      <div>
                        <label className="block text-slate-700 mb-1">Value / Count</label>
                        <input
                          type="text"
                          value={settingsData.hero_stat1_value || ""}
                          onChange={(e) => setSettingsData({ ...settingsData, hero_stat1_value: e.target.value })}
                          placeholder="e.g. 14,200+"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 font-extrabold focus:ring-2 focus:ring-indigo-600"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 mb-1">Label / Title</label>
                        <input
                          type="text"
                          value={settingsData.hero_stat1_label || ""}
                          onChange={(e) => setSettingsData({ ...settingsData, hero_stat1_label: e.target.value })}
                          placeholder="e.g. Swaps Completed"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-600"
                        />
                      </div>
                    </div>

                    {/* Stat 2 */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                      <span className="text-emerald-600 block uppercase tracking-wider text-2xs font-black">Statistic #2 (Middle)</span>
                      <div>
                        <label className="block text-slate-700 mb-1">Value / Rate</label>
                        <input
                          type="text"
                          value={settingsData.hero_stat2_value || ""}
                          onChange={(e) => setSettingsData({ ...settingsData, hero_stat2_value: e.target.value })}
                          placeholder="e.g. 99.4%"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 font-extrabold focus:ring-2 focus:ring-emerald-600"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 mb-1">Label / Title</label>
                        <input
                          type="text"
                          value={settingsData.hero_stat2_label || ""}
                          onChange={(e) => setSettingsData({ ...settingsData, hero_stat2_label: e.target.value })}
                          placeholder="e.g. Synergy Match Accuracy"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-600"
                        />
                      </div>
                    </div>

                    {/* Stat 3 */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                      <span className="text-amber-600 block uppercase tracking-wider text-2xs font-black">Statistic #3 (Right)</span>
                      <div>
                        <label className="block text-slate-700 mb-1">Value / Rating</label>
                        <input
                          type="text"
                          value={settingsData.hero_stat3_value || ""}
                          onChange={(e) => setSettingsData({ ...settingsData, hero_stat3_value: e.target.value })}
                          placeholder="e.g. 4.9 / 5"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 font-extrabold focus:ring-2 focus:ring-amber-600"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 mb-1">Label / Title</label>
                        <input
                          type="text"
                          value={settingsData.hero_stat3_label || ""}
                          onChange={(e) => setSettingsData({ ...settingsData, hero_stat3_label: e.target.value })}
                          placeholder="e.g. Average Karma"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-amber-600"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Live Hero Preview Bar */}
                  <div className="pt-2">
                    <span className="text-2xs font-black text-slate-400 uppercase tracking-wider block mb-2">Live Home Hero Preview:</span>
                    <div className="bg-[#faf7ee] p-4 rounded-2xl border border-slate-200/90 grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-base sm:text-lg font-black text-slate-900">{settingsData.hero_stat1_value || "14,200+"}</p>
                        <p className="text-3xs text-slate-500 font-bold">{settingsData.hero_stat1_label || "Swaps Completed"}</p>
                      </div>
                      <div>
                        <p className="text-base sm:text-lg font-black text-slate-900">{settingsData.hero_stat2_value || "99.4%"}</p>
                        <p className="text-3xs text-slate-500 font-bold">{settingsData.hero_stat2_label || "Synergy Match Accuracy"}</p>
                      </div>
                      <div>
                        <p className="text-base sm:text-lg font-black text-slate-900 flex items-center justify-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 inline" />
                          <span>{settingsData.hero_stat3_value || "4.9 / 5"}</span>
                        </p>
                        <p className="text-3xs text-slate-500 font-bold">{settingsData.hero_stat3_label || "Average Karma"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 1.6: Hero Section & Live Barter Stage Customization */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      <span>Hero Section & Live Barter Stage Customization</span>
                    </div>
                    <span className="text-3xs font-black uppercase tracking-wider bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full border border-indigo-100">
                      Live Editable
                    </span>
                  </div>

                  {/* Sub-block A: Hero Announcement Badges & Headline */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                      Hero Badges & Headline Copy
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold">
                      <div>
                        <label className="block text-slate-700 mb-1">Badge Pill 1 (Left Pill)</label>
                        <input
                          type="text"
                          value={settingsData.hero_badge_pill1 || ""}
                          onChange={(e) => setSettingsData({ ...settingsData, hero_badge_pill1: e.target.value })}
                          placeholder="e.g. Verified Reciprocal Peer-to-Peer Learning Network"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-600 focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 mb-1">Badge Pill 2 (Right Live Pulse Pill)</label>
                        <input
                          type="text"
                          value={settingsData.hero_badge_pill2 || ""}
                          onChange={(e) => setSettingsData({ ...settingsData, hero_badge_pill2: e.target.value })}
                          placeholder="e.g. Live AI Synergy Matching Active"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-600 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 mb-1">Static Headline Part</label>
                        <input
                          type="text"
                          value={settingsData.hero_headline_static || ""}
                          onChange={(e) => setSettingsData({ ...settingsData, hero_headline_static: e.target.value })}
                          placeholder="e.g. Teach what you know."
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-extrabold focus:ring-2 focus:ring-indigo-600 focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 mb-1">Rotating Headline Prefix</label>
                        <input
                          type="text"
                          value={settingsData.hero_headline_dynamic_prefix || ""}
                          onChange={(e) => setSettingsData({ ...settingsData, hero_headline_dynamic_prefix: e.target.value })}
                          placeholder="e.g. Master"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-extrabold focus:ring-2 focus:ring-indigo-600 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div className="text-xs font-bold">
                      <label className="block text-slate-700 mb-1">
                        Rotating Dynamic Phrases <span className="text-slate-400 font-normal">(One phrase per line)</span>
                      </label>
                      <textarea
                        rows={3}
                        value={settingsData.hero_dynamic_phrases || ""}
                        onChange={(e) => setSettingsData({ ...settingsData, hero_dynamic_phrases: e.target.value })}
                        placeholder="what you need next.&#10;Data Structures & Algorithms.&#10;System Design & DevOps."
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-xs focus:ring-2 focus:ring-indigo-600 focus:bg-white"
                      />
                    </div>

                    <div className="text-xs font-bold">
                      <label className="block text-slate-700 mb-1">Hero Subtitle / Description Paragraph</label>
                      <textarea
                        rows={2}
                        value={settingsData.hero_subtitle || ""}
                        onChange={(e) => setSettingsData({ ...settingsData, hero_subtitle: e.target.value })}
                        placeholder="Trade expertise 1-on-1 with verified practitioners..."
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-600 focus:bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-bold">
                      <div>
                        <label className="block text-slate-700 mb-1">CTA 1 Text</label>
                        <input
                          type="text"
                          value={settingsData.hero_cta1_text || ""}
                          onChange={(e) => setSettingsData({ ...settingsData, hero_cta1_text: e.target.value })}
                          placeholder="Start Swapping"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-600"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 mb-1">CTA 1 Link</label>
                        <input
                          type="text"
                          value={settingsData.hero_cta1_link || ""}
                          onChange={(e) => setSettingsData({ ...settingsData, hero_cta1_link: e.target.value })}
                          placeholder="/register"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-2xs focus:ring-2 focus:ring-indigo-600"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 mb-1">CTA 2 Text</label>
                        <input
                          type="text"
                          value={settingsData.hero_cta2_text || ""}
                          onChange={(e) => setSettingsData({ ...settingsData, hero_cta2_text: e.target.value })}
                          placeholder="Explore Skills"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-600"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 mb-1">CTA 2 Link</label>
                        <input
                          type="text"
                          value={settingsData.hero_cta2_link || ""}
                          onChange={(e) => setSettingsData({ ...settingsData, hero_cta2_link: e.target.value })}
                          placeholder="/explore"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-2xs focus:ring-2 focus:ring-indigo-600"
                        />
                      </div>
                    </div>

                    <div className="text-xs font-bold">
                      <label className="block text-slate-700 mb-1">
                        Popular Search Topics <span className="text-slate-400 font-normal">(Comma-separated badges)</span>
                      </label>
                      <input
                        type="text"
                        value={settingsData.hero_popular_topics || ""}
                        onChange={(e) => setSettingsData({ ...settingsData, hero_popular_topics: e.target.value })}
                        placeholder="Python, Figma, React, Spanish, Machine Learning"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-600 focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Sub-block B: Live Barter Stage Avatars (Boy & Girl) */}
                  <div className="pt-4 border-t border-slate-100 space-y-4">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-violet-500"></span>
                      Live Stage Personas (Boy & Girl Avatars)
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Left: Boy (Tech) */}
                      <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-2xs font-black text-indigo-700 uppercase tracking-wider">
                            Left Persona (Boy / Tech)
                          </span>
                          {settingsData.hero_boy_image && (
                            <img
                              src={settingsData.hero_boy_image}
                              alt="Boy Preview"
                              className="w-8 h-8 rounded-full object-cover border border-indigo-200 bg-white"
                              onError={(e) => { e.currentTarget.style.display = "none"; }}
                            />
                          )}
                        </div>

                        <div className="space-y-2 text-xs font-bold">
                          <div>
                            <label className="block text-slate-700 mb-1">Display Name</label>
                            <input
                              type="text"
                              value={settingsData.hero_boy_name || ""}
                              onChange={(e) => setSettingsData({ ...settingsData, hero_boy_name: e.target.value })}
                              placeholder="Aarav Sharma"
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-600"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-700 mb-1">Role / Subtitle</label>
                            <input
                              type="text"
                              value={settingsData.hero_boy_role || ""}
                              onChange={(e) => setSettingsData({ ...settingsData, hero_boy_role: e.target.value })}
                              placeholder="AI & ML Specialist"
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-600"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-700 mb-1">Image URL or Local Path</label>
                            <input
                              type="text"
                              value={settingsData.hero_boy_image || ""}
                              onChange={(e) => setSettingsData({ ...settingsData, hero_boy_image: e.target.value })}
                              placeholder="/hero/boy-tech.webp"
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono text-2xs focus:ring-2 focus:ring-indigo-600"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-slate-700 mb-1 text-3xs">Default Teaches</label>
                              <input
                                type="text"
                                value={settingsData.hero_boy_teach || ""}
                                onChange={(e) => setSettingsData({ ...settingsData, hero_boy_teach: e.target.value })}
                                placeholder="Machine Learning"
                                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-2xs focus:ring-2 focus:ring-indigo-600"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-700 mb-1 text-3xs">Default Wants</label>
                              <input
                                type="text"
                                value={settingsData.hero_boy_want || ""}
                                onChange={(e) => setSettingsData({ ...settingsData, hero_boy_want: e.target.value })}
                                placeholder="UI/UX Design"
                                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-2xs focus:ring-2 focus:ring-indigo-600"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Girl (Creative) */}
                      <div className="p-4 bg-fuchsia-50/50 rounded-2xl border border-fuchsia-100 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-2xs font-black text-fuchsia-700 uppercase tracking-wider">
                            Right Persona (Girl / Creative)
                          </span>
                          {settingsData.hero_girl_image && (
                            <img
                              src={settingsData.hero_girl_image}
                              alt="Girl Preview"
                              className="w-8 h-8 rounded-full object-cover border border-fuchsia-200 bg-white"
                              onError={(e) => { e.currentTarget.style.display = "none"; }}
                            />
                          )}
                        </div>

                        <div className="space-y-2 text-xs font-bold">
                          <div>
                            <label className="block text-slate-700 mb-1">Display Name</label>
                            <input
                              type="text"
                              value={settingsData.hero_girl_name || ""}
                              onChange={(e) => setSettingsData({ ...settingsData, hero_girl_name: e.target.value })}
                              placeholder="Ananya Iyer"
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-fuchsia-600"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-700 mb-1">Role / Subtitle</label>
                            <input
                              type="text"
                              value={settingsData.hero_girl_role || ""}
                              onChange={(e) => setSettingsData({ ...settingsData, hero_girl_role: e.target.value })}
                              placeholder="Product & UI/UX Designer"
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-fuchsia-600"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-700 mb-1">Image URL or Local Path</label>
                            <input
                              type="text"
                              value={settingsData.hero_girl_image || ""}
                              onChange={(e) => setSettingsData({ ...settingsData, hero_girl_image: e.target.value })}
                              placeholder="/hero/girl-creative.png"
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono text-2xs focus:ring-2 focus:ring-fuchsia-600"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-slate-700 mb-1 text-3xs">Default Teaches</label>
                              <input
                                type="text"
                                value={settingsData.hero_girl_teach || ""}
                                onChange={(e) => setSettingsData({ ...settingsData, hero_girl_teach: e.target.value })}
                                placeholder="UI/UX Design"
                                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-2xs focus:ring-2 focus:ring-fuchsia-600"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-700 mb-1 text-3xs">Default Wants</label>
                              <input
                                type="text"
                                value={settingsData.hero_girl_want || ""}
                                onChange={(e) => setSettingsData({ ...settingsData, hero_girl_want: e.target.value })}
                                placeholder="Machine Learning"
                                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-2xs focus:ring-2 focus:ring-fuchsia-600"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sub-block C: Rotating Skill Barter Streams */}
                  <div className="pt-4 border-t border-slate-100 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Live Traveling Skill Badges (4 Barter Pairs)
                      </h4>
                      <span className="text-3xs text-slate-400 font-medium">Orbs fly left ↔ right across the central broker</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-bold">
                      {/* Pair 1 */}
                      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                        <span className="text-3xs font-black uppercase tracking-wider text-slate-500 block">Pair #1</span>
                        <div>
                          <label className="block text-3xs text-indigo-700 mb-0.5">Boy Teaches (L → R)</label>
                          <input
                            type="text"
                            value={settingsData.hero_pair1_boy || ""}
                            onChange={(e) => setSettingsData({ ...settingsData, hero_pair1_boy: e.target.value })}
                            placeholder="Machine Learning"
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-2xs"
                          />
                        </div>
                        <div>
                          <label className="block text-3xs text-fuchsia-700 mb-0.5">Girl Teaches (R → L)</label>
                          <input
                            type="text"
                            value={settingsData.hero_pair1_girl || ""}
                            onChange={(e) => setSettingsData({ ...settingsData, hero_pair1_girl: e.target.value })}
                            placeholder="UI/UX Design"
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-2xs"
                          />
                        </div>
                      </div>

                      {/* Pair 2 */}
                      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                        <span className="text-3xs font-black uppercase tracking-wider text-slate-500 block">Pair #2</span>
                        <div>
                          <label className="block text-3xs text-indigo-700 mb-0.5">Boy Teaches (L → R)</label>
                          <input
                            type="text"
                            value={settingsData.hero_pair2_boy || ""}
                            onChange={(e) => setSettingsData({ ...settingsData, hero_pair2_boy: e.target.value })}
                            placeholder="Python"
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-2xs"
                          />
                        </div>
                        <div>
                          <label className="block text-3xs text-fuchsia-700 mb-0.5">Girl Teaches (R → L)</label>
                          <input
                            type="text"
                            value={settingsData.hero_pair2_girl || ""}
                            onChange={(e) => setSettingsData({ ...settingsData, hero_pair2_girl: e.target.value })}
                            placeholder="Spanish"
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-2xs"
                          />
                        </div>
                      </div>

                      {/* Pair 3 */}
                      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                        <span className="text-3xs font-black uppercase tracking-wider text-slate-500 block">Pair #3</span>
                        <div>
                          <label className="block text-3xs text-indigo-700 mb-0.5">Boy Teaches (L → R)</label>
                          <input
                            type="text"
                            value={settingsData.hero_pair3_boy || ""}
                            onChange={(e) => setSettingsData({ ...settingsData, hero_pair3_boy: e.target.value })}
                            placeholder="Data Science"
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-2xs"
                          />
                        </div>
                        <div>
                          <label className="block text-3xs text-fuchsia-700 mb-0.5">Girl Teaches (R → L)</label>
                          <input
                            type="text"
                            value={settingsData.hero_pair3_girl || ""}
                            onChange={(e) => setSettingsData({ ...settingsData, hero_pair3_girl: e.target.value })}
                            placeholder="Digital Art"
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-2xs"
                          />
                        </div>
                      </div>

                      {/* Pair 4 */}
                      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                        <span className="text-3xs font-black uppercase tracking-wider text-slate-500 block">Pair #4</span>
                        <div>
                          <label className="block text-3xs text-indigo-700 mb-0.5">Boy Teaches (L → R)</label>
                          <input
                            type="text"
                            value={settingsData.hero_pair4_boy || ""}
                            onChange={(e) => setSettingsData({ ...settingsData, hero_pair4_boy: e.target.value })}
                            placeholder="System Design"
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-2xs"
                          />
                        </div>
                        <div>
                          <label className="block text-3xs text-fuchsia-700 mb-0.5">Girl Teaches (R → L)</label>
                          <input
                            type="text"
                            value={settingsData.hero_pair4_girl || ""}
                            onChange={(e) => setSettingsData({ ...settingsData, hero_pair4_girl: e.target.value })}
                            placeholder="Brand Strategy"
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-2xs"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Platform Rules & Meeting Settings */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-900 font-extrabold text-sm">
                    <Zap className="w-4 h-4 text-emerald-600" />
                    <span>Platform Trading Rules & Classroom Integration</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold">
                    <div>
                      <label className="block text-slate-700 mb-1">Max Active Proposals per Swapper</label>
                      <input
                        type="number"
                        value={settingsData.max_active_swaps || "5"}
                        onChange={(e) => setSettingsData({ ...settingsData, max_active_swaps: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-600 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">Default Virtual Classroom Provider</label>
                      <select
                        value={settingsData.default_meeting_provider || "Google Meet Auto-Launcher"}
                        onChange={(e) => setSettingsData({ ...settingsData, default_meeting_provider: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-600 focus:bg-white font-bold"
                      >
                        <option value="Google Meet Auto-Launcher">Google Meet Auto-Launcher (https://meet.google.com/new)</option>
                        <option value="Built-in Jitsi Meet">Built-in Jitsi Virtual Room</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 3: Feature Toggles */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-900 font-extrabold text-sm">
                    <Sliders className="w-4 h-4 text-amber-500" />
                    <span>Feature Control Flags</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-bold">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <span className="text-slate-900 block">Home Page Testimonials</span>
                      <select
                        value={settingsData.enable_testimonials || "true"}
                        onChange={(e) => setSettingsData({ ...settingsData, enable_testimonials: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800"
                      >
                        <option value="true">Enabled (Visible)</option>
                        <option value="false">Disabled (Hidden)</option>
                      </select>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <span className="text-slate-900 block">SkillSwap Stickers Chat</span>
                      <select
                        value={settingsData.enable_stickers_chat || "true"}
                        onChange={(e) => setSettingsData({ ...settingsData, enable_stickers_chat: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800"
                      >
                        <option value="true">Enabled</option>
                        <option value="false">Disabled</option>
                      </select>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <span className="text-slate-900 block">Peer Reviews & Ratings</span>
                      <select
                        value={settingsData.enable_peer_reviews || "true"}
                        onChange={(e) => setSettingsData({ ...settingsData, enable_peer_reviews: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800"
                      >
                        <option value="true">Enabled</option>
                        <option value="false">Disabled</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs shadow-lg shadow-indigo-600/20 transition-all hover:scale-105"
                  >
                    Save & Synchronize All Settings
                  </button>
                </div>

              </form>
            </div>
          )}

        </main>
      </div>

      {/* INSPECT USER MODAL DRAWER */}
      {inspectUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-slate-900 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">User Profile Inspector</h3>
              <button onClick={() => setInspectUser(null)} className="p-1.5 text-slate-400 hover:text-slate-800 rounded-xl hover:bg-slate-100">
                ✕
              </button>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={inspectUser.profile_picture || get3DAvatarUrl("other", inspectUser.name)}
                alt={inspectUser.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/20"
              />
              <div>
                <h4 className="font-extrabold text-base text-slate-900">{inspectUser.name}</h4>
                <p className="text-xs text-indigo-600 font-semibold">{inspectUser.email}</p>
                <span className="text-[10px] text-slate-500 font-medium block mt-0.5">{inspectUser.city || inspectUser.location || "Location not set"}</span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
              <p><strong className="text-slate-500">Profession/Degree:</strong> {inspectUser.profession || inspectUser.education_degree || "SkillSwap Co-Learner"}</p>
              <p><strong className="text-slate-500">Account Role:</strong> <span className="font-bold uppercase text-indigo-700">{inspectUser.role}</span></p>
              <p><strong className="text-slate-500">Account Status:</strong> <span className="font-bold uppercase text-emerald-700">{inspectUser.status}</span></p>
              <p><strong className="text-slate-500">Bio:</strong> "{inspectUser.bio || "No bio set."}"</p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setInspectUser(null)}
                className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-200"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MASTER SKILL MODAL */}
      {showSkillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-slate-900 border border-slate-200 shadow-2xl space-y-4">
            <h3 className="text-base font-black text-slate-900">
              {editingSkill ? "Edit Master Skill Track" : "Create Master Skill Track"}
            </h3>

            <form onSubmit={handleSaveSkill} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block text-slate-600 mb-1">Skill Name</label>
                <input
                  type="text"
                  value={skillForm.name}
                  onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                  placeholder="e.g. PyTorch Deep Learning"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Category</label>
                <select
                  value={skillForm.category}
                  onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-amber-500 font-bold focus:bg-white"
                >
                  <option value="Technology & Programming">Technology & Programming</option>
                  <option value="MCA Core & IT">MCA Core & IT</option>
                  <option value="Top IT Courses">Top IT Courses</option>
                  <option value="Design & Creative">Design & Creative</option>
                  <option value="Languages & Speech">Languages & Speech</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Description & Overview</label>
                <textarea
                  rows="3"
                  value={skillForm.description}
                  onChange={(e) => setSkillForm({ ...skillForm, description: e.target.value })}
                  placeholder="Brief curriculum description..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-amber-500 font-medium focus:bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSkillModal(false)}
                  className="px-4 py-2 text-slate-600 rounded-xl font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-black shadow-md"
                >
                  {editingSkill ? "Update Skill" : "Create Skill"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TESTIMONIAL MODAL */}
      {showTestimonialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-slate-900 border border-slate-200 shadow-2xl space-y-4">
            <h3 className="text-base font-black text-slate-900">
              {editingTestimonial ? "Edit Home Testimonial" : "Create Home Testimonial"}
            </h3>

            <form onSubmit={handleSaveTestimonial} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block text-slate-600 mb-1">Author Name</label>
                <input
                  type="text"
                  value={testimonialForm.author_name}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, author_name: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-600 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Author Role / College</label>
                <input
                  type="text"
                  value={testimonialForm.author_role}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, author_role: e.target.value })}
                  placeholder="e.g. Software Engineer / Student"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Skill Barter Traded</label>
                <input
                  type="text"
                  value={testimonialForm.skill_traded}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, skill_traded: e.target.value })}
                  placeholder="e.g. React.js ↔ Data Structures (DSA)"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Star Rating (1 - 5)</label>
                <select
                  value={testimonialForm.rating}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, rating: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-600 font-bold focus:bg-white"
                >
                  <option value={5}>5 Stars ⭐⭐⭐⭐⭐</option>
                  <option value={4}>4 Stars ⭐⭐⭐⭐</option>
                  <option value={3}>3 Stars ⭐⭐⭐</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Testimonial Quote</label>
                <textarea
                  rows="3"
                  value={testimonialForm.quote}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, quote: e.target.value })}
                  placeholder="Enter the testimonial review quote..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-600 font-medium focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Avatar Image URL (Optional)</label>
                <input
                  type="text"
                  value={testimonialForm.avatar_url}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, avatar_url: e.target.value })}
                  placeholder="Leave empty for auto 3D avatar"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-600 focus:bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTestimonialModal(false)}
                  className="px-4 py-2 text-slate-600 rounded-xl font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black shadow-md"
                >
                  {editingTestimonial ? "Update Testimonial" : "Save Testimonial"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
