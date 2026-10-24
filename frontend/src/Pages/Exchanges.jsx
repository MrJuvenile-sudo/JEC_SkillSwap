import React, { useState, useEffect } from "react";
import API from "../services/api";
import LoadingSpinner from "../Components/LoadingSpinner";
import ReviewModal from "../Components/ReviewModal";
import { 
  Video, 
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Monitor,
  Calendar, 
  Link as LinkIcon, 
  CheckCircle2, 
  Star, 
  Edit3, 
  ExternalLink, 
  Sparkles,
  BookOpen,
  Clock,
  Play,
  Pause,
  RotateCcw,
  FileText,
  Code,
  Share2,
  HelpCircle,
  Award,
  Layers,
  Check,
  Plus,
  Users,
  Search,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Zap,
  Copy,
  Terminal,
  Cpu,
  Globe,
  Smile,
  Send,
  Download,
  Paperclip,
  Maximize2,
  Minimize2,
  X,
  Grid,
  ListFilter
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { get3DAvatarUrl } from "../utils/avatarUtils";
import { Link, useLocation } from "react-router-dom";

// SkillSwap Learning Stickers
const STICKERS_LIST = [
  { id: "target", emoji: "🎯", label: "Target Achieved!" },
  { id: "rocket", emoji: "🚀", label: "Keep Coding!" },
  { id: "idea", emoji: "💡", label: "Brilliant Idea!" },
  { id: "star", emoji: "⭐", label: "5 Star Mentor!" },
  { id: "books", emoji: "📚", label: "Deep Focus!" },
  { id: "code", emoji: "💻", label: "Clean Code!" },
  { id: "fire", emoji: "🔥", label: "Super Fast!" },
  { id: "hands", emoji: "🙌", label: "High Five!" }
];

// Rich Resource Mappings for Skills (Mapped dynamically to Real Master Skills)
const SKILL_RESOURCES_MAP = {
  "node.js": {
    docs: "https://nodejs.org/docs/latest/api/",
    cheatsheet: "REST API Design, Async/Await, Express Middleware, Event Loop & Promises",
    exercises: [
      "1. Build a basic Express GET & POST endpoint with JSON validation",
      "2. Connect Node.js app to SQLite / MySQL database using async pool",
      "3. Implement JWT Authentication middleware for protected API routes"
    ],
    prompts: "Ask your partner to explain Express middleware order and error handling!"
  },
  "react.js": {
    docs: "https://react.dev",
    cheatsheet: "useState, useEffect, Custom Hooks, Props, Context API & Component Lifecycle",
    exercises: [
      "1. Create a reactive component with dynamic search state filtering",
      "2. Build a custom hook for fetching API endpoints with loading states",
      "3. Manage multi-tab state with Tailwind CSS component styling"
    ],
    prompts: "Ask your partner to walk through React state re-rendering & dependency arrays!"
  },
  "english": {
    docs: "https://dictionary.cambridge.org/",
    cheatsheet: "Past Perfect Tense, Idioms, Formal Email Etiquette, Pronunciation & Vocabulary",
    exercises: [
      "1. Practice 15 minutes of free-flowing conversational dialogue",
      "2. Mock professional interview Q&A session in English",
      "3. Read a tech blog aloud & focus on stress/intonation"
    ],
    prompts: "Discuss your favorite tech project or career aspirations in full English!"
  },
  "python": {
    docs: "https://docs.python.org/3/",
    cheatsheet: "Lists/Dicts, Comprehensions, Pandas DataFrames, Functions, OOP Classes",
    exercises: [
      "1. Write a script to parse & clean CSV data using Pandas",
      "2. Create a web scraper / API fetcher using Requests & BeautifulSoup",
      "3. Implement basic object-oriented classes with methods"
    ],
    prompts: "Ask your partner how list comprehensions work under the hood in Python!"
  },
  "data structures": {
    docs: "https://leetcode.com/",
    cheatsheet: "Arrays, Two Pointers, Linked Lists, Trees, Graph DFS/BFS, Dynamic Programming",
    exercises: [
      "1. Solve 'Two Sum' using Hash Map in O(N) time complexity",
      "2. Implement Binary Tree In-Order & Level-Order Traversal",
      "3. Trace Dynamic Programming Memoization for Fibonacci"
    ],
    prompts: "Dry run your code step-by-step on a virtual whiteboard together!"
  },
  "dsa": {
    docs: "https://leetcode.com/",
    cheatsheet: "Arrays, Two Pointers, Linked Lists, Trees, Graph DFS/BFS, Dynamic Programming",
    exercises: [
      "1. Solve 'Two Sum' using Hash Map in O(N) time complexity",
      "2. Implement Binary Tree In-Order & Level-Order Traversal",
      "3. Trace Dynamic Programming Memoization for Fibonacci"
    ],
    prompts: "Dry run your code step-by-step on a virtual whiteboard together!"
  },
  "database": {
    docs: "https://dev.mysql.com/doc/",
    cheatsheet: "SQL Joins (INNER, LEFT, RIGHT), Indexing, Normalization (1NF to 3NF), ACID",
    exercises: [
      "1. Write complex SQL Query joining 3 tables with GROUP BY & HAVING",
      "2. Design relational schema for an e-commerce barter database",
      "3. Analyze query performance using EXPLAIN and B-Tree indexes"
    ],
    prompts: "Discuss why foreign key constraints maintain data integrity!"
  },
  "dbms": {
    docs: "https://dev.mysql.com/doc/",
    cheatsheet: "SQL Joins (INNER, LEFT, RIGHT), Indexing, Normalization (1NF to 3NF), ACID",
    exercises: [
      "1. Write complex SQL Query joining 3 tables with GROUP BY & HAVING",
      "2. Design relational schema for an e-commerce barter database",
      "3. Analyze query performance using EXPLAIN and B-Tree indexes"
    ],
    prompts: "Discuss why foreign key constraints maintain data integrity!"
  },
  "cloud": {
    docs: "https://aws.amazon.com/free/",
    cheatsheet: "AWS EC2 Deployment, S3 Storage Buckets, Docker Containerization, CI/CD",
    exercises: [
      "1. Deploy a Node.js / React app to an EC2 instance with Nginx",
      "2. Containerize application using Dockerfile and docker-compose",
      "3. Configure S3 bucket for media asset uploads"
    ],
    prompts: "Discuss microservices architecture and load balancing principles!"
  },
  "java": {
    docs: "https://docs.oracle.com/en/java/",
    cheatsheet: "Core Java, OOP Inheritance, Multi-threading, Spring Boot REST Annotations",
    exercises: [
      "1. Create Spring Boot Controller mapping GET/POST request bodies",
      "2. Implement multi-threaded worker thread queue in Java",
      "3. Build DAO layer with JPA Repository & Hibernate"
    ],
    prompts: "Ask your partner to explain JVM Garbage Collection algorithms!"
  },
  "spanish": {
    docs: "https://studyspanish.com/",
    cheatsheet: "Present & Past Tense Verbs, Ser vs Estar, Conversational Greetings",
    exercises: [
      "1. Practice 15-minute introductory conversational dialogue in Spanish",
      "2. Learn top 20 essential software engineering terms in Spanish",
      "3. Roleplay ordering coffee or asking for directions"
    ],
    prompts: "Practice speaking Spanish full sentences out loud with your partner!"
  },
  "default": {
    docs: "https://wikipedia.org",
    cheatsheet: "1-on-1 Co-learning Best Practices, Equal 50/50 Time Split, Mutual Feedback",
    exercises: [
      "1. Spend 25-30 minutes teaching your core expertise",
      "2. Spend 25-30 minutes taking notes and learning partner's topic",
      "3. Summarize key takeaways & assign practice goals before finishing"
    ],
    prompts: "Share your screen or paste code/notes directly into the session scratchpad!"
  }
};

const getResourceForSkill = (skillName) => {
  if (!skillName) return SKILL_RESOURCES_MAP.default;
  const nameLower = skillName.toLowerCase();
  for (const key in SKILL_RESOURCES_MAP) {
    if (nameLower.includes(key)) {
      return SKILL_RESOURCES_MAP[key];
    }
  }
  return SKILL_RESOURCES_MAP.default;
};

export default function Exchanges() {
  const { user: currentUser } = useAuth();
  const location = useLocation();
  
  // Real Database Data State Variables
  const [exchanges, setExchanges] = useState([]);
  const [masterSkills, setMasterSkills] = useState([]);
  const [skillCategories, setSkillCategories] = useState([]);
  const [connectedSwappers, setConnectedSwappers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review & Edit States
  const [selectedExchangeForReview, setSelectedExchangeForReview] = useState(null);
  const [editingExchange, setEditingExchange] = useState(null);
  const [selectedRoomModal, setSelectedRoomModal] = useState(null); // Full classroom modal view
  const [activeChatExchange, setActiveChatExchange] = useState(null); // Full screen SkillSwap Chat view

  const [editMeetingLink, setEditMeetingLink] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [notification, setNotification] = useState("");

  // Main Navigation Tab State: 'active_grid' | 'completed' | 'resources' | 'swappers'
  const [activeTab, setActiveTab] = useState("active_grid");

  // Filters for Study Kits Tab
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [skillSearchQuery, setSkillSearchQuery] = useState("");

  // Timer state for active session room
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(1800); // 30 minutes
  const [teachingTurn, setTeachingTurn] = useState("myTurn");

  // Interactive Live Call State
  const [activeCallSession, setActiveCallSession] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  // Interactive Chat & Stickers State
  const [chatMessages, setChatMessages] = useState({});
  const [inputMsg, setInputMsg] = useState("");
  const [showStickerPicker, setShowStickerPicker] = useState(false);

  // Mutual Session Scheduling State
  const [schedulingExchange, setSchedulingExchange] = useState(null);
  const [scheduleDateTime, setScheduleDateTime] = useState("");
  const [scheduleDuration, setScheduleDuration] = useState("60");
  const [scheduleAgenda, setScheduleAgenda] = useState("");
  const [savingSchedule, setSavingSchedule] = useState(false);

  const handleOpenScheduler = (ex) => {
    setSchedulingExchange(ex);
    if (ex.scheduled_at) {
      try {
        const d = new Date(ex.scheduled_at);
        const localIso = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        setScheduleDateTime(localIso);
      } catch (e) {
        setScheduleDateTime("");
      }
    } else {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(17, 0, 0, 0);
      const localIso = new Date(tomorrow.getTime() - tomorrow.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      setScheduleDateTime(localIso);
    }
    setScheduleDuration(ex.duration_min ? String(ex.duration_min) : "60");
    setScheduleAgenda(ex.agenda || `1-on-1 reciprocal skill swap: ${ex.offered_skill_name} ⇄ ${ex.requested_skill_name}`);
  };

  const handleConfirmSchedule = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!schedulingExchange || !scheduleDateTime) {
      alert("Please select a date and time for your mutual session.");
      return;
    }

    setSavingSchedule(true);
    try {
      const scheduledDateObj = new Date(scheduleDateTime);
      const formattedDateStr = scheduledDateObj.toLocaleString([], {
        dateStyle: "medium",
        timeStyle: "short",
      });

      // Save to database
      await API.put(`/exchanges/${schedulingExchange.id}`, {
        scheduled_at: scheduleDateTime,
        duration_min: Number(scheduleDuration) || 60,
        agenda: scheduleAgenda.trim(),
        status: "scheduled",
      });

      // Automatically post a notification message into chat history so both partners see it
      const systemConfirmMsg = {
        id: Date.now(),
        sender: currentUser?.name || "You",
        senderId: currentUser?.id,
        text: `📅 Session scheduled for ${formattedDateStr} (${scheduleDuration} mins)! Both swappers are free and confirmed. Google Meet room will be active.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sticker: { emoji: "📅", label: "Session Scheduled" },
      };

      const existingHistory = chatMessages[schedulingExchange.id] || [];
      const updatedHistory = [...existingHistory, systemConfirmMsg];
      setChatMessages(prev => ({
        ...prev,
        [schedulingExchange.id]: updatedHistory
      }));

      await API.put(`/exchanges/${schedulingExchange.id}`, {
        chat_history: JSON.stringify(updatedHistory)
      });

      setNotification(`🎉 Session successfully scheduled for ${formattedDateStr}!`);
      setSchedulingExchange(null);
      fetchAllRealData(false);
    } catch (err) {
      console.error("Error scheduling session:", err);
      alert(err.response?.data?.message || "Failed to schedule session. Please try again.");
    } finally {
      setSavingSchedule(false);
    }
  };

  // Instant Google Meet Launcher (Opens Google Meet automatically in new tab and syncs status to DB)
  const handleStartInstantGoogleMeet = async (exchangeId = null, meetingUrl = null) => {
    // Default to Google Meet's official auto-room creation URL if none or dummy
    const targetUrl = (meetingUrl && meetingUrl.startsWith("http") && !meetingUrl.includes("skillswap-room")) 
      ? meetingUrl 
      : "https://meet.google.com/new";
    
    // Automatically launch Google Meet in a new browser tab
    window.open(targetUrl, "_blank", "noopener,noreferrer");
    
    setNotification("🚀 Google Meet launched! Opening automated room in a new tab...");

    if (exchangeId) {
      try {
        await API.put(`/exchanges/${exchangeId}`, {
          meeting_link: targetUrl,
          status: "in_progress"
        });
        fetchAllRealData(false);
      } catch (err) {
        console.error("Error updating exchange meeting link:", err);
      }
    }
  };

  // Fetch real data from database APIs (silent refresh for real-time sync)
  const fetchAllRealData = async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const [exRes, skillsRes, usersRes] = await Promise.all([
        API.get("/exchanges"),
        API.get("/skills"),
        API.get("/discovery/search")
      ]);

      if (exRes.data.success) {
        const fetchedExchanges = exRes.data.exchanges || [];
        setExchanges(fetchedExchanges);

        // Initialize chat history from database
        const chatsObj = {};
        fetchedExchanges.forEach(ex => {
          try {
            const parsedChat = ex.chat_history ? JSON.parse(ex.chat_history) : [];
            chatsObj[ex.id] = parsedChat.length > 0 ? parsedChat : [
              {
                id: 1,
                sender: ex.receiver_name,
                senderId: ex.receiver_id,
                text: `Hi! Ready to trade ${ex.offered_skill_name} and ${ex.requested_skill_name}! Let's launch the Google Meet call.`,
                time: "10:00 AM",
                sticker: null
              }
            ];
          } catch (e) {
            chatsObj[ex.id] = [];
          }
        });
        setChatMessages(chatsObj);
      }

      if (skillsRes.data.success) {
        setMasterSkills(skillsRes.data.skills || []);
        setSkillCategories(skillsRes.data.categories || []);
      }
      if (usersRes.data.success) {
        setConnectedSwappers(usersRes.data.users || []);
      }
    } catch (err) {
      console.error("Error fetching real session data:", err);
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRealData(true);
    const pollInterval = setInterval(() => {
      fetchAllRealData(false);
    }, 4000);
    return () => clearInterval(pollInterval);
  }, []);

  // Auto-open SkillSwap Chat if navigated with openChat or openChatId
  useEffect(() => {
    if (exchanges.length > 0 && (location.state?.openChat || location.state?.openChatId)) {
      const targetId = location.state?.openChatId;
      let targetEx = null;
      if (targetId) {
        targetEx = exchanges.find(e => e.id === Number(targetId) || e.id === targetId);
      }
      if (!targetEx) {
        targetEx = exchanges.find(e => e.status !== "completed") || exchanges[0];
      }
      if (targetEx) {
        setActiveChatExchange(targetEx);
      }
    }
  }, [location.state, exchanges]);

  // Timer Countdown Effect
  useEffect(() => {
    let interval = null;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds]);

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleComplete = async (exchangeId) => {
    if (!window.confirm("Are you sure you want to mark this exchange session as complete?")) return;
    try {
      const res = await API.put(`/exchanges/${exchangeId}/complete`);
      if (res.data.success) {
        setNotification("Session completed successfully! You can now leave a star review.");
        fetchAllRealData();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to complete exchange");
    }
  };

  const handleStartEditing = (ex) => {
    setEditingExchange(ex);
    setEditMeetingLink(ex.meeting_link || "");
    setEditNotes(ex.notes || "");
  };

  const handleSaveDetails = async (e) => {
    e.preventDefault();
    if (!editingExchange) return;

    try {
      const res = await API.put(`/exchanges/${editingExchange.id}`, {
        meeting_link: editMeetingLink,
        notes: editNotes,
      });

      if (res.data.success) {
        setNotification("Session details & notes updated in database!");
        setEditingExchange(null);
        fetchAllRealData();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save details");
    }
  };

  const handleCopyLink = (link) => {
    navigator.clipboard.writeText(link);
    setNotification("Meeting URL copied to clipboard!");
  };

  // Real Time Chat Handler
  const handleSendMessage = async (exchangeId, textMessage = "", stickerObj = null) => {
    if (!textMessage.trim() && !stickerObj) return;

    const newMsg = {
      id: Date.now(),
      sender: currentUser?.name || "You",
      senderId: currentUser?.id,
      text: textMessage.trim(),
      sticker: stickerObj,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const currentChatList = chatMessages[exchangeId] || [];
    const updatedChatList = [...currentChatList, newMsg];

    setChatMessages({
      ...chatMessages,
      [exchangeId]: updatedChatList
    });
    setInputMsg("");
    setShowStickerPicker(false);

    try {
      await API.put(`/exchanges/${exchangeId}`, {
        chat_history: JSON.stringify(updatedChatList)
      });
    } catch (err) {
      console.error("Error saving chat history to DB:", err);
    }
  };

  // Export Notes in Multiple Formats (.txt / .md download)
  const handleExportNotes = (ex, format = "txt") => {
    const filename = `SkillSwap_Session_${ex.id}_Notes.${format}`;
    const content = `=========================================
SKILLSWAP 1-ON-1 SESSION NOTES & AGENDA
Session Room #${ex.id}
Topic 1: ${ex.offered_skill_name}
Topic 2: ${ex.requested_skill_name}
Date: ${new Date().toLocaleDateString()}
=========================================

SESSION NOTES:
${ex.notes || "No notes written."}

MEETING URL:
${ex.meeting_link || "N/A"}
`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    setNotification(`Notes exported as ${filename}!`);
  };

  // Filter Active vs Completed Exchanges
  const activeExchangesList = exchanges.filter(ex => ex.status !== "completed");
  const completedExchangesList = exchanges.filter(ex => ex.status === "completed");

  // Filter Master Skills for Study Kits Tab
  const filteredSkills = masterSkills.filter((s) => {
    if (selectedCategory !== "All" && s.category !== selectedCategory) {
      return false;
    }
    if (skillSearchQuery.trim()) {
      const q = skillSearchQuery.toLowerCase().trim();
      const nameMatch = s.name?.toLowerCase().includes(q);
      const descMatch = s.description?.toLowerCase().includes(q);
      const catMatch = s.category?.toLowerCase().includes(q);
      return nameMatch || descMatch || catMatch;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#fdfbf7] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 font-sans">
      
      {/* Real Data Classroom Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-violet-50 text-violet-700 text-xs font-bold border border-violet-100">
            <Video className="w-3.5 h-3.5 text-violet-600 animate-pulse" />
            <span>Virtual Classroom & Session Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Active Exchange Rooms & Swappers
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl font-medium leading-relaxed">
            Categorized grid of active classrooms, instant Google Meet calls, real-time chat, and multi-format notes exporter.
          </p>
        </div>

        {/* Instant Google Meet Action Button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => handleStartInstantGoogleMeet()}
            className="px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs rounded-2xl shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2 hover:scale-105"
          >
            <Video className="w-4 h-4" />
            <span>Instant Google Meet</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Categorized Tab Navigation Pills */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-2 text-xs font-extrabold">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveTab("active_grid")}
            className={`px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === "active_grid"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <Grid className="w-4 h-4 text-emerald-400" />
            <span>Active Classrooms Grid ({activeExchangesList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("completed")}
            className={`px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === "completed"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Completed Sessions ({completedExchangesList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("resources")}
            className={`px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === "resources"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-500" />
            <span>Curriculum Kits ({masterSkills.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("swappers")}
            className={`px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === "swappers"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <Users className="w-4 h-4 text-indigo-500" />
            <span>Connected Swappers ({connectedSwappers.length})</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in">
          <span>{notification}</span>
          <button onClick={() => setNotification("")} className="text-emerald-600 font-bold ml-4">✕</button>
        </div>
      )}

      {loading ? (
        <LoadingSpinner label="Loading categorized virtual classroom grid & real data..." />
      ) : activeTab === "active_grid" ? (
        /* TAB 1: CATEGORIZED ACTIVE CLASSROOMS IN ELEGANT GRID FORM */
        <div className="space-y-6">
          
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Grid className="w-5 h-5 text-indigo-600" />
              <span>Active 1-on-1 Classrooms Grid</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">Click any room card to open full interactive tools & live chat</span>
          </div>

          {activeExchangesList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeExchangesList.map((ex) => {
                const isRequester = currentUser?.id === ex.requester_id;
                const partnerName = isRequester ? ex.receiver_name : ex.requester_name;
                const partnerPic = isRequester ? ex.receiver_picture : ex.requester_picture;
                const partnerDegree = isRequester ? ex.receiver_degree : ex.requester_degree;
                const partnerCity = isRequester ? ex.receiver_city : ex.requester_city;

                const mySkill = isRequester ? ex.offered_skill_name : ex.requested_skill_name;
                const partnerSkill = isRequester ? ex.requested_skill_name : ex.offered_skill_name;

                return (
                  <div key={ex.id} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 space-y-4 flex flex-col justify-between group hover:-translate-y-1">
                    
                    {/* Card Header */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div 
                          onClick={() => setSelectedRoomModal(ex)}
                          className="flex items-center gap-3 cursor-pointer group/user hover:opacity-90 transition-all"
                        >
                          <img
                            src={partnerPic || get3DAvatarUrl("other", partnerName)}
                            alt={partnerName}
                            className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-500/20 group-hover/user:ring-indigo-600 transition-all shrink-0"
                          />
                          <div>
                            <h4 className="font-extrabold text-sm text-slate-900 leading-tight group-hover/user:text-indigo-600 transition-colors flex items-center gap-1">
                              <span>{partnerName}</span>
                              <ExternalLink className="w-3 h-3 text-indigo-500 opacity-70 group-hover/user:opacity-100 transition-opacity inline" />
                            </h4>
                            <p className="text-[11px] text-blue-600 font-semibold">{partnerDegree || "Co-Learner & Mentor"}</p>
                            <span className="text-[10px] text-slate-400 font-medium">{partnerCity || "Online / Remote"}</span>
                          </div>
                        </div>

                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-indigo-50 text-indigo-700 border border-indigo-200 shrink-0">
                          Room #{ex.id}
                        </span>
                      </div>

                      {/* Reciprocal Skill Trade Pills */}
                      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-150 text-xs space-y-2">
                        <div>
                          <span className="font-extrabold text-slate-400 uppercase tracking-wider text-[9px] block mb-0.5">
                            You Teach:
                          </span>
                          <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 inline-block text-[11px]">
                            {mySkill}
                          </span>
                        </div>

                        <div>
                          <span className="font-extrabold text-slate-400 uppercase tracking-wider text-[9px] block mb-0.5">
                            {partnerName} Teaches You:
                          </span>
                          <span className="font-extrabold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-xl border border-indigo-200 inline-block text-[11px]">
                            {partnerSkill}
                          </span>
                        </div>
                      </div>

                      {/* Mutual Scheduled Free Slot Banner */}
                      <div className="pt-1">
                        {ex.scheduled_at ? (
                          <div className="bg-amber-50/90 border border-amber-200/90 rounded-2xl p-3 flex items-center justify-between gap-2 shadow-2xs">
                            <div className="min-w-0">
                              <span className="text-[9px] font-extrabold uppercase tracking-wider text-amber-700 block">
                                Mutual Free Slot Confirmed:
                              </span>
                              <div className="flex items-center gap-1.5 text-xs font-black text-amber-950 truncate mt-0.5">
                                <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                <span className="truncate">
                                  {new Date(ex.scheduled_at).toLocaleDateString([], {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => handleOpenScheduler(ex)}
                              className="px-2.5 py-1 bg-white hover:bg-amber-100 text-amber-800 text-[10px] font-black rounded-lg border border-amber-300 transition-colors shrink-0 cursor-pointer shadow-2xs"
                              title="Reschedule session"
                            >
                              Reschedule
                            </button>
                          </div>
                        ) : (
                          <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-2.5 px-3 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="text-[11px]">When are both free?</span>
                            </div>
                            <button
                              onClick={() => handleOpenScheduler(ex)}
                              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black shadow-xs flex items-center gap-1 cursor-pointer transition-transform hover:scale-105"
                            >
                              <Calendar className="w-3 h-3 text-indigo-200" />
                              <span>Schedule Session</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Action Bar */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      
                      {/* Dedicated SkillSwap Chat Button */}
                      <button
                        onClick={() => setActiveChatExchange(ex)}
                        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 hover:scale-[1.02] cursor-pointer"
                      >
                        <MessageSquare className="w-4 h-4 text-emerald-300" />
                        <span>Open SkillSwap Chat</span>
                      </button>

                      <div className="grid grid-cols-2 gap-2">
                        {/* Instant Google Meet Launch Button */}
                        <button
                          onClick={() => handleStartInstantGoogleMeet(ex.id, ex.meeting_link)}
                          className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.02]"
                          title="Automatically launches Google Meet in a new tab"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Google Meet</span>
                        </button>

                        {/* Open Room Tools Overlay Button */}
                        <button
                          onClick={() => setSelectedRoomModal(ex)}
                          className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Room Tools</span>
                        </button>
                      </div>

                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-lg mx-auto space-y-4 shadow-xs">
              <Video className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">No Active Classroom Grid Rooms</h3>
              <p className="text-xs text-slate-500 font-medium">Accept incoming swap proposals or launch an instant Google Meet call to start learning!</p>
              <button
                onClick={() => handleStartInstantGoogleMeet()}
                className="px-6 py-3 bg-emerald-600 text-white rounded-2xl text-xs font-black shadow-md inline-flex items-center gap-2"
              >
                <Video className="w-4 h-4" />
                <span>Start Instant Google Meet</span>
              </button>
            </div>
          )}

        </div>
      ) : activeTab === "completed" ? (
        /* TAB 2: COMPLETED SESSIONS & STAR REVIEWS */
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-1">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Completed Session History ({completedExchangesList.length})</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">Finished 1-on-1 skill exchange sessions. Leave star reviews to build your peer trust score.</p>
          </div>

          {completedExchangesList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {completedExchangesList.map((ex) => {
                const isRequester = currentUser?.id === ex.requester_id;
                const partnerName = isRequester ? ex.receiver_name : ex.requester_name;
                const partnerPic = isRequester ? ex.receiver_picture : ex.requester_picture;

                return (
                  <div key={ex.id} className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={partnerPic || get3DAvatarUrl("other", partnerName)}
                          alt={partnerName}
                          className="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-500/20"
                        />
                        <div>
                          <h4 className="font-extrabold text-sm text-slate-900">{partnerName}</h4>
                          <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">Session Completed</span>
                        </div>
                      </div>

                      {ex.hasReviewed ? (
                        <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                          <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" /> Reviewed
                        </span>
                      ) : (
                        <button
                          onClick={() => setSelectedExchangeForReview(ex)}
                          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-1"
                        >
                          <Star className="w-3.5 h-3.5 fill-white" />
                          <span>Leave Review</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto space-y-2 shadow-xs">
              <CheckCircle2 className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">No Completed Sessions Yet</h3>
              <p className="text-xs text-slate-500">When you finish a 1-on-1 swap room, mark it complete to record it here.</p>
            </div>
          )}
        </div>
      ) : activeTab === "resources" ? (
        /* TAB 3: REAL MASTER SKILLS STUDY KITS & CURRICULUM */
        <div className="space-y-6">
          
          {/* Controls: Search & Category Filters */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-600" />
                  <span>Real Master Curriculum & Study Kits ({filteredSkills.length})</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Real skills loaded directly from your database table with documentation links, cheatsheets, and exercise prompts.
                </p>
              </div>

              <div className="relative max-w-xs w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={skillSearchQuery}
                  onChange={(e) => setSkillSearchQuery(e.target.value)}
                  placeholder="Search master skills..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs font-bold">
              <button
                onClick={() => setSelectedCategory("All")}
                className={`px-3.5 py-1.5 rounded-full transition-all ${
                  selectedCategory === "All"
                    ? "bg-emerald-600 text-white shadow-xs font-extrabold"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                All Categories ({masterSkills.length})
              </button>

              {skillCategories.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full transition-all ${
                    selectedCategory === cat
                      ? "bg-emerald-600 text-white shadow-xs font-extrabold"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Master Skill Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSkills.map((skill) => {
              const resInfo = getResourceForSkill(skill.name);
              return (
                <div key={skill.id} className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4 hover:shadow-md transition-all flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {skill.category}
                      </span>
                      <a
                        href={resInfo.docs}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-extrabold text-emerald-600 hover:underline flex items-center gap-1"
                      >
                        Docs <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    <h4 className="font-extrabold text-slate-900 text-base">{skill.name}</h4>
                    
                    <p className="text-xs text-slate-600 leading-relaxed font-medium bg-slate-50 p-3 rounded-2xl border border-slate-150">
                      {skill.description || "Master skill track for 1-on-1 reciprocal peer exchange."}
                    </p>

                    <div className="space-y-1 pt-1 text-xs">
                      <strong className="text-slate-900 font-extrabold block text-[11px]">Cheat Sheet Summary:</strong>
                      <p className="text-[11px] text-slate-600 italic bg-white p-2.5 rounded-xl border border-slate-200">
                        {resInfo.cheatsheet}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500">
                    <span>Skill ID #{skill.id}</span>
                    <Link to={`/explore?query=${encodeURIComponent(skill.name)}`} className="text-emerald-600 hover:underline flex items-center gap-1 font-extrabold">
                      Find Mentors <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      ) : (
        /* TAB 4: REAL CONNECTED SWAPPERS DIRECTORY */
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-2">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span>Real Connected Swappers ({connectedSwappers.length})</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Real swapper profiles fetched from your database with active skill offers and learning objectives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {connectedSwappers.map((user) => (
              <div key={user.id} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-lg transition-all space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <img
                      src={user.profile_picture || get3DAvatarUrl(user.gender, user.name)}
                      alt={user.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/20 shadow-sm shrink-0"
                    />
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">{user.name}</h4>
                      <p className="text-xs text-blue-600 font-semibold">{user.profession || "SkillSwap Co-Learner"}</p>
                      <span className="text-[10px] text-slate-400 font-medium block">{user.city || user.location || "Online / Remote"}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 italic font-medium bg-slate-50/70 p-2.5 rounded-xl border border-slate-150">
                    "{user.bio || "Enthusiastic lifelong learner."}"
                  </p>

                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-150 text-xs space-y-1.5">
                    <p><strong className="text-emerald-700">Teaches:</strong> {user.offered_skills?.map(s => s.skill_name).join(", ") || "Technical Skills"}</p>
                    <p><strong className="text-indigo-700 font-extrabold">Wants:</strong> {user.wanted_skills?.map(s => s.skill_name).join(", ") || "Learning Goals"}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{user.rating || "5.0"}</span>
                  </div>

                  <Link
                    to={`/profile/${user.id}`}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold shadow-xs transition-colors"
                  >
                    View & Connect →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FULL INTERACTIVE CLASSROOM OVERLAY MODAL */}
      {selectedRoomModal && (() => {
        const isRequester = currentUser?.id === selectedRoomModal.requester_id;
        const partnerName = isRequester ? selectedRoomModal.receiver_name : selectedRoomModal.requester_name;
        const partnerPic = isRequester ? selectedRoomModal.receiver_picture : selectedRoomModal.requester_picture;
        const partnerDegree = isRequester ? selectedRoomModal.receiver_degree : selectedRoomModal.requester_degree;
        const partnerCity = isRequester ? selectedRoomModal.receiver_city : selectedRoomModal.requester_city;

        const mySkill = isRequester ? selectedRoomModal.offered_skill_name : selectedRoomModal.requested_skill_name;
        const partnerSkill = isRequester ? selectedRoomModal.requested_skill_name : selectedRoomModal.offered_skill_name;

        const mySkillRes = getResourceForSkill(mySkill);
        const partnerSkillRes = getResourceForSkill(partnerSkill);
        const currentChat = chatMessages[selectedRoomModal.id] || [];

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl space-y-6 border border-slate-200 my-8 max-h-[92vh] overflow-y-auto">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={partnerPic || get3DAvatarUrl("other", partnerName)}
                    alt={partnerName}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-500/20 shrink-0"
                  />
                  <div>
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <span>{partnerName} & You</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-extrabold border border-emerald-200">
                        Active Room #{selectedRoomModal.id}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {[partnerDegree, partnerCity].filter(Boolean).join(" • ") || "SkillSwap Co-Learner"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleStartInstantGoogleMeet(selectedRoomModal.id, selectedRoomModal.meeting_link)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-xs flex items-center gap-1.5 hover:scale-105 transition-transform"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Instant Google Meet</span>
                  </button>
                  <button
                    onClick={() => setSelectedRoomModal(null)}
                    className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Instant Google Meet Auto-Launcher Banner */}
              <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 p-4 rounded-2xl border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900">Google Meet Automated Room</h4>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Clicking Instant Meeting automatically creates and launches your live Google Meet call in a new tab.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleStartInstantGoogleMeet(selectedRoomModal.id, selectedRoomModal.meeting_link)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Launch Google Meet</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleCopyLink(selectedRoomModal.meeting_link || "https://meet.google.com/new")}
                    className="p-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    title="Copy Meeting Link"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Mutual Free Time & Scheduling Section */}
              <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-amber-950">Mutual Availability & Scheduled Slot</h4>
                    <p className="text-[11px] text-amber-800 font-medium">
                      {selectedRoomModal.scheduled_at 
                        ? `Confirmed Slot: ${new Date(selectedRoomModal.scheduled_at).toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })} (${selectedRoomModal.duration_min || 60} mins)` 
                        : "No mutual slot scheduled yet. Coordinate when both of you are free to meet."}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const ex = selectedRoomModal;
                    setSelectedRoomModal(null);
                    handleOpenScheduler(ex);
                  }}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-black text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer hover:scale-105"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{selectedRoomModal.scheduled_at ? "Reschedule Mutual Time" : "Schedule Session (When Free)"}</span>
                </button>
              </div>

              {/* 50/50 Timer & Call Quick Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 50/50 Timer */}
                <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-amber-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> 50/50 Equal Time Splitter
                    </span>
                    <span className="font-mono text-base font-black text-emerald-400">{formatTimer(timerSeconds)}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold gap-2">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setTimerActive(!timerActive)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${
                          timerActive ? "bg-amber-500 text-slate-950" : "bg-emerald-600 text-white"
                        }`}
                      >
                        {timerActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        <span>{timerActive ? "Pause" : "Start 30m"}</span>
                      </button>
                      <button
                        onClick={() => { setTimerActive(false); setTimerSeconds(1800); }}
                        className="p-1.5 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700"
                        title="Reset Timer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg text-[10px]">
                      <button
                        onClick={() => setTeachingTurn("myTurn")}
                        className={`px-2 py-1 rounded font-extrabold ${teachingTurn === "myTurn" ? "bg-indigo-600 text-white" : "text-slate-400"}`}
                      >
                        My Turn
                      </button>
                      <button
                        onClick={() => setTeachingTurn("partnerTurn")}
                        className={`px-2 py-1 rounded font-extrabold ${teachingTurn === "partnerTurn" ? "bg-indigo-600 text-white" : "text-slate-400"}`}
                      >
                        {partnerName}'s Turn
                      </button>
                    </div>
                  </div>
                </div>

                {/* Direct Video Classroom Call */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-col justify-between space-y-2">
                  <div>
                    <h5 className="text-xs font-extrabold text-slate-900">In-App HD Live Video Classroom</h5>
                    <p className="text-[11px] text-slate-500 font-medium">Launch built-in interactive video classroom directly with {partnerName}.</p>
                  </div>
                  <div>
                    <button
                      onClick={() => setActiveCallSession({ exchange: selectedRoomModal, type: "video" })}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Video className="w-4 h-4" />
                      <span>Launch Video Classroom</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* SKILLSWAP CHAT & LEARNING STICKERS */}
              <div className="bg-slate-900 text-white rounded-3xl p-5 space-y-4 shadow-lg border border-slate-800">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-xs font-extrabold text-white">SkillSwap Chat & Learning Stickers</h4>
                  </div>
                  <button
                    onClick={() => {
                      const currentEx = selectedRoomModal;
                      setSelectedRoomModal(null);
                      setActiveChatExchange(currentEx);
                    }}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-xl flex items-center gap-1 shadow-2xs transition-all hover:scale-105"
                  >
                    <Maximize2 className="w-3 h-3" />
                    <span>Open Large SkillSwap Chat</span>
                  </button>
                </div>

                {/* Chat History Box */}
                <div className="bg-slate-950 p-4 rounded-2xl h-52 overflow-y-auto space-y-3 border border-slate-800/80">
                  {currentChat.length > 0 ? (
                    currentChat.map((msg) => {
                      const isMe = msg.senderId === currentUser?.id || msg.sender === currentUser?.name;
                      return (
                        <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                          <div className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs space-y-1 ${
                            isMe ? "bg-emerald-600 text-white rounded-br-none shadow-sm" : "bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700"
                          }`}>
                            <span className="text-[10px] opacity-75 font-bold block">{msg.sender}</span>
                            
                            {msg.sticker && (
                              <div className="bg-black/30 p-2.5 rounded-xl text-center space-y-0.5 my-1.5 border border-white/10">
                                <span className="text-2xl block animate-bounce">{msg.sticker.emoji}</span>
                                <span className="text-[10px] font-bold text-amber-300 block">{msg.sticker.label}</span>
                              </div>
                            )}

                            {msg.text && <p className="leading-relaxed font-medium">{msg.text}</p>}
                            <span className="text-[9px] opacity-60 text-right block pt-0.5">{msg.time}</span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-10 text-slate-500 text-xs font-medium">
                      No chat messages yet. Send a greeting or sticker to start!
                    </div>
                  )}
                </div>

                {/* Sticker Picker Popover */}
                {showStickerPicker && (
                  <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 grid grid-cols-4 gap-2 animate-in fade-in">
                    {STICKERS_LIST.map((st) => (
                      <button
                        key={st.id}
                        onClick={() => handleSendMessage(selectedRoomModal.id, "", st)}
                        className="p-2.5 bg-slate-900 hover:bg-slate-800 rounded-xl text-center transition-colors group border border-slate-800/80"
                      >
                        <span className="text-2xl group-hover:scale-125 transition-transform block">{st.emoji}</span>
                        <span className="text-[9px] text-slate-300 font-bold block mt-1 line-clamp-1">{st.label}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Chat Input Bar */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => setShowStickerPicker(!showStickerPicker)}
                    className="p-2.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-xl transition-colors shrink-0 border border-slate-700"
                    title="Send Learning Sticker"
                  >
                    <Smile className="w-5 h-5" />
                  </button>

                  <input
                    type="text"
                    value={inputMsg}
                    onChange={(e) => setInputMsg(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSendMessage(selectedRoomModal.id, inputMsg);
                    }}
                    placeholder={`Type a message to ${partnerName}...`}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />

                  <button
                    onClick={() => handleSendMessage(selectedRoomModal.id, inputMsg)}
                    className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shrink-0 shadow-md"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* SHARED NOTES & CURRICULUM KITS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                
                {/* Notes & Code Scratchpad */}
                <div className="space-y-3 bg-slate-50 p-5 rounded-3xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      <span>Shared Notes & Code Scratchpad</span>
                    </h4>
                    
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleExportNotes(selectedRoomModal, "txt")}
                        className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 text-[10px] font-bold rounded-lg border border-slate-200 flex items-center gap-1 transition-colors"
                        title="Download .txt"
                      >
                        <Download className="w-3 h-3" /> .txt
                      </button>
                      <button
                        onClick={() => handleExportNotes(selectedRoomModal, "md")}
                        className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 text-[10px] font-bold rounded-lg border border-slate-200 flex items-center gap-1 transition-colors"
                        title="Download .md"
                      >
                        <Code className="w-3 h-3" /> .md
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 font-medium bg-white p-3.5 rounded-2xl border border-slate-200 leading-relaxed min-h-[60px]">
                    {selectedRoomModal.notes || "No notes written yet. Click edit below to add shared session notes or code snippets."}
                  </p>

                  <button
                    onClick={() => {
                      setSelectedRoomModal(null);
                      handleStartEditing(selectedRoomModal);
                    }}
                    className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold text-xs rounded-xl border border-indigo-200 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Session Notes & Details</span>
                  </button>
                </div>

                {/* Skill Curriculum Guide */}
                <div className="space-y-3 bg-slate-50 p-5 rounded-3xl border border-slate-200">
                  <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                    <span>Reciprocal Skill Curriculum Kit</span>
                  </h4>

                  <div className="space-y-2 text-xs">
                    <div className="bg-white p-3 rounded-2xl border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-emerald-700 text-[11px]">You Teach: {mySkill}</span>
                        <a href={mySkillRes.docs} target="_blank" rel="noreferrer" className="text-[10px] text-emerald-600 font-bold hover:underline flex items-center gap-0.5">
                          Docs <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                      <p className="text-[10px] text-slate-500 italic leading-relaxed">{mySkillRes.cheatsheet}</p>
                    </div>

                    <div className="bg-white p-3 rounded-2xl border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-indigo-700 text-[11px]">{partnerName} Teaches You: {partnerSkill}</span>
                        <a href={partnerSkillRes.docs} target="_blank" rel="noreferrer" className="text-[10px] text-indigo-600 font-bold hover:underline flex items-center gap-0.5">
                          Docs <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                      <p className="text-[10px] text-slate-500 italic leading-relaxed">{partnerSkillRes.cheatsheet}</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Footer Action */}
              <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <button
                  onClick={() => handleComplete(selectedRoomModal.id)}
                  className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-extrabold rounded-xl text-xs flex items-center gap-1.5 border border-emerald-200 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Mark Session Complete</span>
                </button>

                <button
                  onClick={() => setSelectedRoomModal(null)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                >
                  Close Room Window
                </button>
              </div>

            </div>
          </div>
        );
      })()}

      {/* DEDICATED FULL SCREEN SKILLSWAP CHAT MODAL (2-COLUMN STYLE) */}
      {activeChatExchange && (() => {
        const isRequester = currentUser?.id === activeChatExchange.requester_id;
        const partnerName = isRequester ? activeChatExchange.receiver_name : activeChatExchange.requester_name;
        const partnerPic = isRequester ? activeChatExchange.receiver_picture : activeChatExchange.requester_picture;
        const partnerDegree = isRequester ? activeChatExchange.receiver_degree : activeChatExchange.requester_degree;
        const partnerCity = isRequester ? activeChatExchange.receiver_city : activeChatExchange.requester_city;

        const mySkill = isRequester ? activeChatExchange.offered_skill_name : activeChatExchange.requested_skill_name;
        const partnerSkill = isRequester ? activeChatExchange.requested_skill_name : activeChatExchange.offered_skill_name;
        const currentChat = chatMessages[activeChatExchange.id] || [];

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 lg:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
            <div className="bg-[#111b21] rounded-3xl max-w-6xl w-full h-[92vh] flex shadow-2xl border border-slate-800 overflow-hidden text-white font-sans">
              
              {/* Left Column: Sidebar (Active Swapper Conversations) */}
              <div className="w-80 sm:w-96 bg-[#111b21] border-r border-slate-800 flex flex-col shrink-0 hidden md:flex">
                {/* Sidebar Header */}
                <div className="p-4 bg-[#202c33] flex items-center justify-between border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <img
                      src={currentUser?.profile_picture || get3DAvatarUrl(currentUser?.gender, currentUser?.name)}
                      alt={currentUser?.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/30"
                    />
                    <div>
                      <h4 className="font-extrabold text-xs text-white leading-tight">{currentUser?.name}</h4>
                      <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Online
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 font-extrabold border border-emerald-500/30">
                    SkillSwap Chat
                  </span>
                </div>

                {/* Sidebar Search Bar */}
                <div className="p-3 bg-[#111b21] border-b border-slate-800">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search swappers or messages..."
                      className="w-full pl-9 pr-3 py-2 bg-[#202c33] border border-slate-700/60 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                    />
                  </div>
                </div>

                {/* Conversations List */}
                <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
                  {activeExchangesList.map((ex) => {
                    const isReq = currentUser?.id === ex.requester_id;
                    const pName = isReq ? ex.receiver_name : ex.requester_name;
                    const pPic = isReq ? ex.receiver_picture : ex.requester_picture;
                    const exChat = chatMessages[ex.id] || [];
                    const lastMsgObj = exChat[exChat.length - 1];
                    const lastMsgText = lastMsgObj ? (lastMsgObj.text || (lastMsgObj.sticker ? `${lastMsgObj.sticker.emoji} ${lastMsgObj.sticker.label}` : "Message")) : "No messages yet";
                    const isSelected = ex.id === activeChatExchange.id;

                    return (
                      <div
                        key={ex.id}
                        onClick={() => setActiveChatExchange(ex)}
                        className={`p-3.5 flex items-center gap-3 cursor-pointer transition-colors ${
                          isSelected ? "bg-[#2a3942]" : "hover:bg-[#202c33]"
                        }`}
                      >
                        <div className="relative shrink-0">
                          <img
                            src={pPic || get3DAvatarUrl("other", pName)}
                            alt={pName}
                            className="w-11 h-11 rounded-2xl object-cover ring-2 ring-emerald-500/20"
                          />
                          <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#111b21] absolute -bottom-0.5 -right-0.5"></span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <h5 className="font-extrabold text-xs text-white truncate">{pName}</h5>
                            <span className="text-[10px] text-slate-400 font-medium">{lastMsgObj?.time || "Active"}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5 font-normal">{lastMsgText}</p>
                          <span className="inline-block mt-1 text-[9px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.2 rounded border border-emerald-500/20">
                            Room #{ex.id}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Main Chat Window */}
              <div className="flex-1 flex flex-col bg-[#0b141a] min-w-0">
                
                {/* Top Header Bar */}
                <div className="bg-[#202c33] px-4 sm:px-6 py-3.5 border-b border-slate-800 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        src={partnerPic || get3DAvatarUrl("other", partnerName)}
                        alt={partnerName}
                        className="w-11 h-11 rounded-2xl object-cover ring-2 ring-emerald-500/40"
                      />
                      <span className="w-3 h-3 bg-emerald-500 rounded-full absolute -bottom-0.5 -right-0.5 ring-2 ring-[#202c33]"></span>
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2 truncate">
                        <span className="truncate">{partnerName}</span>
                        <span className="px-2 py-0.5 rounded-full text-[9px] bg-emerald-500/20 text-emerald-400 font-extrabold border border-emerald-500/30 shrink-0">
                          Online
                        </span>
                      </h3>
                      <p className="text-[11px] text-slate-300 font-medium truncate">
                        Teaching: <strong className="text-emerald-400">{mySkill}</strong> • Learning: <strong className="text-indigo-400">{partnerSkill}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Header Controls */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleOpenScheduler(activeChatExchange)}
                      className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
                      title="Schedule mutual session when both free"
                    >
                      <Calendar className="w-4 h-4 text-indigo-200" />
                      <span className="hidden sm:inline">Schedule Session</span>
                    </button>

                    <button
                      onClick={() => handleStartInstantGoogleMeet(activeChatExchange.id, activeChatExchange.meeting_link)}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
                      title="Automatically launches Google Meet in a new tab"
                    >
                      <Video className="w-4 h-4" />
                      <span className="hidden sm:inline">Google Meet</span>
                    </button>

                    <button
                      onClick={() => {
                        const ex = activeChatExchange;
                        setActiveChatExchange(null);
                        setSelectedRoomModal(ex);
                      }}
                      className="px-3 py-2 bg-[#2a3942] hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                      title="Room Tools & Agenda"
                    >
                      <BookOpen className="w-4 h-4 text-amber-400" />
                      <span className="hidden sm:inline">Room Tools</span>
                    </button>

                    <button
                      onClick={() => setActiveChatExchange(null)}
                      className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
                      title="Close Chat"
                    >
                      <X className="w-5.5 h-5.5" />
                    </button>
                  </div>
                </div>

                {/* Messages Stream Canvas */}
                <div className="flex-1 bg-[#0b141a] p-4 sm:p-6 overflow-y-auto space-y-4 font-sans">
                  {currentChat.length > 0 ? (
                    currentChat.map((msg) => {
                      const isMe = msg.senderId === currentUser?.id || msg.sender === currentUser?.name;
                      return (
                        <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                          <div className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm space-y-1.5 shadow-md ${
                            isMe 
                              ? "bg-[#005c4b] text-white rounded-br-none" 
                              : "bg-[#202c33] text-slate-100 rounded-bl-none border border-slate-700/60"
                          }`}>
                            <span className="text-[10px] font-extrabold opacity-75 block text-amber-300">{msg.sender}</span>
                            
                            {/* Sticker Rendering */}
                            {msg.sticker && (
                              <div className="bg-black/30 p-3 rounded-2xl text-center space-y-1 my-2 border border-white/10 backdrop-blur-xs">
                                <span className="text-4xl block animate-bounce">{msg.sticker.emoji}</span>
                                <span className="text-xs font-black text-amber-300 block">{msg.sticker.label}</span>
                              </div>
                            )}

                            {msg.text && <p className="leading-relaxed font-normal whitespace-pre-wrap">{msg.text}</p>}
                            <span className="text-[10px] opacity-60 text-right block pt-1">{msg.time}</span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-3">
                      <MessageSquare className="w-12 h-12 text-slate-700" />
                      <p className="text-xs font-bold text-slate-400">Welcome to SkillSwap Chat!</p>
                      <p className="text-[11px] text-slate-600">Send a greeting message or learning sticker to get started.</p>
                    </div>
                  )}
                </div>

                {/* Learning Sticker Popover Drawer */}
                {showStickerPicker && (
                  <div className="bg-[#111b21] p-4 border-t border-slate-800 grid grid-cols-4 sm:grid-cols-8 gap-3 animate-in slide-in-from-bottom-2 shrink-0">
                    {STICKERS_LIST.map((st) => (
                      <button
                        key={st.id}
                        onClick={() => handleSendMessage(activeChatExchange.id, "", st)}
                        className="p-3 bg-[#202c33] hover:bg-[#2a3942] rounded-2xl text-center transition-all hover:scale-105 border border-slate-700/60 group"
                      >
                        <span className="text-3xl group-hover:scale-125 transition-transform block">{st.emoji}</span>
                        <span className="text-[10px] text-slate-300 font-bold block mt-1 line-clamp-1">{st.label}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Bottom Chat Input Bar */}
                <div className="bg-[#202c33] p-3.5 sm:p-4 border-t border-slate-800 flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => setShowStickerPicker(!showStickerPicker)}
                    className={`p-3 rounded-2xl transition-all border shrink-0 ${
                      showStickerPicker ? "bg-amber-500 text-slate-950 border-amber-400" : "bg-[#111b21] text-amber-400 hover:bg-slate-800 border-slate-700"
                    }`}
                    title="Send SkillSwap Learning Sticker"
                  >
                    <Smile className="w-6 h-6" />
                  </button>

                  <input
                    type="text"
                    value={inputMsg}
                    onChange={(e) => setInputMsg(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSendMessage(activeChatExchange.id, inputMsg);
                    }}
                    placeholder={`Type a message to ${partnerName}...`}
                    className="flex-1 bg-[#111b21] border border-slate-700 rounded-2xl px-5 py-3 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />

                  <button
                    onClick={() => handleSendMessage(activeChatExchange.id, inputMsg)}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs sm:text-sm rounded-2xl transition-all flex items-center gap-2 shadow-lg shadow-emerald-600/25 shrink-0 hover:scale-105"
                  >
                    <span>Send</span>
                    <Send className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>
          </div>
        );
      })()}

      {/* INTERACTIVE VIDEO CLASSROOM MODAL OVERLAY */}
      {activeCallSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 rounded-3xl max-w-3xl w-full p-6 text-white border border-slate-800 shadow-2xl space-y-6 relative overflow-hidden">
            
            {/* Call Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    <span>1-on-1 Live Video Classroom</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">Connected with {activeCallSession.exchange?.receiver_name || "Peer Swapper"}</p>
                </div>
              </div>

              <button
                onClick={() => setActiveCallSession(null)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Preview Canvas Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Partner Video Tile */}
              <div className="bg-slate-950 h-56 sm:h-64 rounded-2xl border border-slate-800 relative flex flex-col items-center justify-center overflow-hidden">
                <img
                  src={activeCallSession.exchange?.receiver_picture || get3DAvatarUrl("other", activeCallSession.exchange?.receiver_name || "Partner")}
                  alt="Partner"
                  className="w-24 h-24 rounded-full object-cover ring-4 ring-emerald-500/30"
                />
                <span className="text-xs font-bold text-slate-300 mt-2">{activeCallSession.exchange?.receiver_name || "Peer Swapper"} (Remote)</span>
                
                {/* Audio Wave Visualizer */}
                <div className="flex items-center gap-1 mt-2">
                  <span className="w-1 h-3 bg-emerald-400 animate-pulse"></span>
                  <span className="w-1 h-5 bg-emerald-400 animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-1 h-4 bg-emerald-400 animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                </div>

                <div className="absolute top-3 left-3 bg-black/60 px-2.5 py-1 rounded-full text-[10px] font-bold text-emerald-400 backdrop-blur-xs flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> Live HD Audio/Video
                </div>
              </div>

              {/* Local Self Video Tile */}
              <div className="bg-slate-950 h-56 sm:h-64 rounded-2xl border border-slate-800 relative flex flex-col items-center justify-center overflow-hidden">
                {isVideoOff ? (
                  <div className="text-center space-y-2">
                    <VideoOff className="w-10 h-10 text-slate-500 mx-auto" />
                    <span className="text-xs text-slate-400 block font-semibold">Your Camera is Off</span>
                  </div>
                ) : (
                  <>
                    <img
                      src={currentUser?.profile_picture || get3DAvatarUrl(currentUser?.gender, currentUser?.name)}
                      alt="You"
                      className="w-24 h-24 rounded-full object-cover ring-4 ring-indigo-500/30"
                    />
                    <span className="text-xs font-bold text-slate-300 mt-2">{currentUser?.name || "You"} (Local)</span>
                  </>
                )}

                <div className="absolute top-3 left-3 bg-black/60 px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-300 backdrop-blur-xs">
                  {isMuted ? "🎤 Muted" : "🎤 Mic Active"}
                </div>
              </div>

            </div>

            {/* Call Control Toolbar */}
            <div className="flex items-center justify-center gap-4 pt-2 border-t border-slate-800">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-4 rounded-2xl border transition-all ${
                  isMuted ? "bg-rose-600 text-white border-rose-500" : "bg-slate-800 hover:bg-slate-700 text-white border-slate-700"
                }`}
                title={isMuted ? "Unmute Mic" : "Mute Mic"}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {activeCallSession.type === "video" && (
                <button
                  onClick={() => setIsVideoOff(!isVideoOff)}
                  className={`p-4 rounded-2xl border transition-all ${
                    isVideoOff ? "bg-rose-600 text-white border-rose-500" : "bg-slate-800 hover:bg-slate-700 text-white border-slate-700"
                  }`}
                  title={isVideoOff ? "Turn Camera On" : "Turn Camera Off"}
                >
                  {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                </button>
              )}

              <button
                onClick={() => setIsScreenSharing(!isScreenSharing)}
                className={`p-4 rounded-2xl border transition-all ${
                  isScreenSharing ? "bg-emerald-600 text-white border-emerald-500" : "bg-slate-800 hover:bg-slate-700 text-white border-slate-700"
                }`}
                title="Share Screen"
              >
                <Monitor className="w-5 h-5" />
              </button>

              <button
                onClick={() => setActiveCallSession(null)}
                className="px-6 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-black shadow-lg shadow-rose-600/30 flex items-center gap-2 transition-all hover:scale-105"
              >
                <PhoneOff className="w-5 h-5" />
                <span>End Call</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Edit Meeting Details Modal */}
      {editingExchange && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-150">
            <h3 className="text-base font-bold text-slate-900">Update Session Info & Meeting Link</h3>

            <form onSubmit={handleSaveDetails} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Meeting URL (Google Meet / Zoom)</label>
                <input
                  type="url"
                  value={editMeetingLink}
                  onChange={(e) => setEditMeetingLink(e.target.value)}
                  placeholder="https://meet.google.com/xxx-xxxx-xxx"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Notes & Resource Links</label>
                <textarea
                  rows="4"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Paste GitHub links, documentation URLs, or session outline here..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingExchange(null)}
                  className="px-4 py-2 font-bold text-slate-600 rounded-xl hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-md"
                >
                  Save Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MUTUAL SESSION SCHEDULING MODAL */}
      {schedulingExchange && (() => {
        const isRequester = currentUser?.id === schedulingExchange.requester_id;
        const partnerName = isRequester ? schedulingExchange.receiver_name : schedulingExchange.requester_name;
        const partnerPic = isRequester ? schedulingExchange.receiver_picture : schedulingExchange.requester_picture;
        const mySkill = isRequester ? schedulingExchange.offered_skill_name : schedulingExchange.requested_skill_name;
        const partnerSkill = isRequester ? schedulingExchange.requested_skill_name : schedulingExchange.offered_skill_name;

        // Quick slot helper
        const setPresetSlot = (daysOffset, hour, minute = 0) => {
          const target = new Date();
          target.setDate(target.getDate() + daysOffset);
          target.setHours(hour, minute, 0, 0);
          const localIso = new Date(target.getTime() - target.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
          setScheduleDateTime(localIso);
        };

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 my-8">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold shrink-0">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 leading-tight">Mutual Session Scheduler</h3>
                    <p className="text-xs text-slate-500 font-medium">Pick a date & time when you and {partnerName} are both free</p>
                  </div>
                </div>
                <button
                  onClick={() => setSchedulingExchange(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Partner & Skill Barter Context */}
              <div className="bg-[#FAF7EE] p-3.5 rounded-2xl border border-slate-200/90 text-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <img
                    src={partnerPic || get3DAvatarUrl("other", partnerName)}
                    alt={partnerName}
                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/20"
                  />
                  <div>
                    <h4 className="font-extrabold text-slate-900">{partnerName}</h4>
                    <span className="text-[10px] text-slate-500 font-medium">Co-Learning Partner</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-extrabold text-indigo-700 bg-white px-2 py-0.5 rounded-md border border-slate-200 block mb-0.5">
                    {mySkill} ⇄ {partnerSkill}
                  </span>
                  <span className="text-[9px] text-slate-400 font-bold">1-on-1 Barter</span>
                </div>
              </div>

              {/* Quick Preset Free Time Slots */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Quick Free Slot Suggestions:</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPresetSlot(0, 17, 0)}
                    className="p-2 text-left bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-700 transition-colors cursor-pointer"
                  >
                    <span className="block text-indigo-600 font-extrabold text-[10px]">Today</span>
                    5:00 PM
                  </button>
                  <button
                    type="button"
                    onClick={() => setPresetSlot(0, 19, 0)}
                    className="p-2 text-left bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-700 transition-colors cursor-pointer"
                  >
                    <span className="block text-indigo-600 font-extrabold text-[10px]">Today</span>
                    7:00 PM
                  </button>
                  <button
                    type="button"
                    onClick={() => setPresetSlot(1, 10, 0)}
                    className="p-2 text-left bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-700 transition-colors cursor-pointer"
                  >
                    <span className="block text-indigo-600 font-extrabold text-[10px]">Tomorrow</span>
                    10:00 AM
                  </button>
                  <button
                    type="button"
                    onClick={() => setPresetSlot(1, 18, 0)}
                    className="p-2 text-left bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-700 transition-colors cursor-pointer"
                  >
                    <span className="block text-indigo-600 font-extrabold text-[10px]">Tomorrow</span>
                    6:00 PM
                  </button>
                  <button
                    type="button"
                    onClick={() => setPresetSlot(2, 16, 0)}
                    className="p-2 text-left bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-700 transition-colors cursor-pointer"
                  >
                    <span className="block text-indigo-600 font-extrabold text-[10px]">In 2 Days</span>
                    4:00 PM
                  </button>
                  <button
                    type="button"
                    onClick={() => setPresetSlot(3, 11, 0)}
                    className="p-2 text-left bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-700 transition-colors cursor-pointer"
                  >
                    <span className="block text-indigo-600 font-extrabold text-[10px]">In 3 Days</span>
                    11:00 AM
                  </button>
                </div>
              </div>

              {/* Form Controls */}
              <form onSubmit={handleConfirmSchedule} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    Select Mutual Date & Time:
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={scheduleDateTime}
                    onChange={(e) => setScheduleDateTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1">
                      Duration:
                    </label>
                    <select
                      value={scheduleDuration}
                      onChange={(e) => setScheduleDuration(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="30">30 Mins (15m + 15m)</option>
                      <option value="45">45 Mins</option>
                      <option value="60">60 Mins (30m + 30m)</option>
                      <option value="90">90 Mins (45m + 45m)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1">
                      Meeting Platform:
                    </label>
                    <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800">
                      <Video className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Google Meet</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    Session Agenda & Topics:
                  </label>
                  <input
                    type="text"
                    value={scheduleAgenda}
                    onChange={(e) => setScheduleAgenda(e.target.value)}
                    placeholder="e.g. First 30m React basics, next 30m Python basics"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Submit and Action Buttons */}
                <div className="pt-2 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => handleStartInstantGoogleMeet(schedulingExchange.id, schedulingExchange.meeting_link)}
                    className="px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Launch Google Meet now in a new tab"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Launch Meet Now</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSchedulingExchange(null)}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={savingSchedule}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 transition-transform hover:scale-105 cursor-pointer disabled:opacity-50"
                    >
                      <Check className="w-4 h-4" />
                      <span>{savingSchedule ? "Saving..." : "Confirm Schedule"}</span>
                    </button>
                  </div>
                </div>
              </form>

            </div>
          </div>
        );
      })()}

      {/* Leave Review Modal */}
      {selectedExchangeForReview && (
        <ReviewModal
          exchange={selectedExchangeForReview}
          onClose={() => setSelectedExchangeForReview(null)}
          onSuccess={(msg) => {
            setNotification(msg);
            fetchAllRealData();
          }}
        />
      )}

    </div>
  );
}
