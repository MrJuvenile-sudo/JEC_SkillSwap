import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import {
  Send,
  ArrowLeft,
  Search,
  Smile,
  Paperclip,
  Phone,
  Video,
  MoreVertical,
  CheckCheck,
  Check,
  Clock,
  MessageSquare,
  Users,
  Zap,
  ExternalLink,
  X,
  Maximize2,
  Minimize2,
  ChevronRight,
  Star,
  Info,
  Bell,
  BellOff,
  Trash2,
  Copy,
  RefreshCw,
  Circle,
  BookOpen,
  Award,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";
import { get3DAvatarUrl } from "../utils/avatarUtils";
import { notifyWithSoundAndVibration } from "../utils/soundUtils";

// ─── Helpers ────────────────────────────────────────────────────────────────
const safeParse = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    try {
      const p = JSON.parse(val.trim());
      return Array.isArray(p) ? p : [];
    } catch {
      return [];
    }
  }
  return [];
};

function timeAgo(ts) {
  if (!ts) return "";
  const now = Date.now();
  const diff = now - (typeof ts === "number" ? ts : new Date(ts).getTime());
  const min = Math.floor(diff / 60000);
  if (min < 1) return "now";
  if (min < 60) return `${min}m`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d`;
  return new Date(ts).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

function renderText(text) {
  if (!text) return null;
  const urlRe = /(https?:\/\/[^\s]+)/g;
  return text.split(urlRe).map((part, i) =>
    part.match(urlRe) ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="text-indigo-300 underline break-all hover:text-indigo-200"
        onClick={(e) => e.stopPropagation()}
      >
        {part}
      </a>
    ) : (
      part
    )
  );
}

function MsgStatus({ status }) {
  if (status === "sending")
    return <Clock className="w-3 h-3 text-slate-400 shrink-0" />;
  if (status === "sent")
    return <Check className="w-3 h-3 text-slate-400 shrink-0" />;
  if (status === "read")
    return <CheckCheck className="w-3 h-3 text-indigo-400 shrink-0" />;
  return <CheckCheck className="w-3 h-3 text-slate-400 shrink-0" />;
}

function OnlineDot({ online }) {
  return (
    <span
      className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#0d0d1a] ${
        online ? "bg-emerald-400" : "bg-slate-500"
      }`}
    />
  );
}

// ─── Typing Dots animation ────────────────────────────────────────────────────
function TypingDots() {
  return (
    <span className="flex items-center gap-0.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  );
}

// ─── Empty conversation placeholder ──────────────────────────────────────────
function EmptyConversation({ onExplore }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-8 select-none">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-600/20 to-purple-600/20 flex items-center justify-center mb-6 ring-1 ring-indigo-500/20">
        <MessageSquare className="w-10 h-10 text-indigo-400" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Your Messages</h3>
      <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-6">
        Select a conversation to start chatting with your swap partner, or
        explore peers to make a new connection.
      </p>
      <button
        onClick={onExplore}
        className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold rounded-full shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all hover:scale-[1.02] active:scale-95"
      >
        Explore Swap Partners
      </button>
    </div>
  );
}

// ─── Main Chat Page ───────────────────────────────────────────────────────────
export default function Chat() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Parse ?c=<exchange_id> from URL
  const searchParams = new URLSearchParams(location.search);
  const urlExchangeId = searchParams.get("c");

  // State
  const [conversations, setConversations] = useState([]); // exchange rows
  const [activeConv, setActiveConv] = useState(null); // selected exchange
  const [messages, setMessages] = useState([]); // messages for active conv
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQ, setSearchQ] = useState("");
  const [filter, setFilter] = useState("all"); // 'all' | 'unread' | 'active'
  const [mobileView, setMobileView] = useState("list"); // 'list' | 'chat'
  const [showInfo, setShowInfo] = useState(false);
  const [sending, setSending] = useState(false);
  const [retryMsg, setRetryMsg] = useState(null);
  const [infoOpen, setInfoOpen] = useState(false);

  // Refs
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const prevMsgLenRef = useRef(0);
  const prevConvIdRef = useRef(null);
  const pollTimerRef = useRef(null);
  const convPollTimerRef = useRef(null);

  // Restore draft from sessionStorage
  useEffect(() => {
    if (activeConv?.id) {
      const saved = sessionStorage.getItem(`chat_draft_${activeConv.id}`);
      if (saved) setDraft(saved);
      else setDraft("");
    }
  }, [activeConv?.id]);

  // Save draft to sessionStorage
  useEffect(() => {
    if (activeConv?.id) {
      if (draft.trim()) {
        sessionStorage.setItem(`chat_draft_${activeConv.id}`, draft);
      } else {
        sessionStorage.removeItem(`chat_draft_${activeConv.id}`);
      }
    }
  }, [draft, activeConv?.id]);

  // Derive partner info
  const getPartner = useCallback(
    (ex) => {
      if (!ex || !user) return null;
      const isReq = Number(user.id) === Number(ex.requester_id);
      return {
        id: isReq ? ex.receiver_id : ex.requester_id,
        name: isReq ? ex.receiver_name : ex.requester_name,
        picture: isReq ? ex.receiver_picture : ex.requester_picture,
        profession: isReq ? ex.receiver_profession : ex.requester_profession,
        teaches: isReq ? ex.requested_skill_name : ex.offered_skill_name,
        learns: isReq ? ex.offered_skill_name : ex.requested_skill_name,
        city: isReq ? ex.receiver_city : ex.requester_city,
      };
    },
    [user]
  );

  // Fetch all exchanges (conversations)
  const fetchConversations = useCallback(
    async (isInit = false) => {
      try {
        const res = await API.get("/exchanges");
        if (res.data?.success) {
          const exs = res.data.exchanges || [];
          // Only show non-rejected/cancelled
          const valid = exs.filter(
            (e) =>
              e.request_status !== "rejected" &&
              e.request_status !== "cancelled"
          );
          setConversations(valid);

          // If URL has an exchange id, activate it
          if (urlExchangeId && isInit) {
            const target = valid.find(
              (e) =>
                String(e.id) === String(urlExchangeId) ||
                String(e.request_id) === String(urlExchangeId)
            );
            if (target) {
              setActiveConv(target);
              setMobileView("chat");
            }
          } else if (!activeConv && valid.length > 0) {
            // Auto-select first active swap on desktop
            const firstActive =
              valid.find((e) => e.request_status === "accepted") || valid[0];
            if (window.innerWidth >= 768) {
              setActiveConv(firstActive);
            }
          }
        }
      } catch (err) {
        console.error("Chat fetchConversations error:", err);
      } finally {
        if (isInit) setLoading(false);
      }
    },
    [urlExchangeId, activeConv]
  );

  // Fetch messages for active conversation
  const fetchMessages = useCallback(async () => {
    if (!activeConv?.id) return;
    try {
      const res = await API.get(`/exchanges/${activeConv.id}/messages`);
      if (res.data?.success) {
        const incoming = res.data.messages || [];
        setMessages((prev) => {
          if (
            prev.length === incoming.length &&
            JSON.stringify(prev) === JSON.stringify(incoming)
          )
            return prev;

          // Play chime for new partner messages
          const partner = getPartner(activeConv);
          if (incoming.length > prev.length && partner) {
            const newest = incoming[incoming.length - 1];
            if (
              newest &&
              Number(newest.senderId || newest.sender_id) !== Number(user?.id)
            ) {
              notifyWithSoundAndVibration(
                `💬 ${partner.name}`,
                newest.text || "New message"
              );
            }
          }
          return incoming;
        });
      }
    } catch (err) {
      // Silent fail for polling
    }
  }, [activeConv?.id, getPartner, user?.id]);

  // Initial load
  useEffect(() => {
    fetchConversations(true);
  }, []);

  // Conversation list polling (every 5s)
  useEffect(() => {
    convPollTimerRef.current = setInterval(() => {
      fetchConversations(false);
    }, 5000);
    return () => clearInterval(convPollTimerRef.current);
  }, [fetchConversations]);

  // Message polling (1.5s active, 10s hidden)
  useEffect(() => {
    clearInterval(pollTimerRef.current);
    if (!activeConv?.id) return;
    fetchMessages();
    const startPolling = () => {
      const interval = document.hidden ? 10000 : 1500;
      pollTimerRef.current = setInterval(fetchMessages, interval);
    };
    startPolling();
    const onVisibilityChange = () => {
      clearInterval(pollTimerRef.current);
      startPolling();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      clearInterval(pollTimerRef.current);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [activeConv?.id, fetchMessages]);

  // Auto scroll to bottom on new messages or conversation change
  useEffect(() => {
    const didConvChange = activeConv?.id !== prevConvIdRef.current;
    const didMsgsGrow = messages.length !== prevMsgLenRef.current;
    if (didConvChange || didMsgsGrow) {
      prevConvIdRef.current = activeConv?.id;
      prevMsgLenRef.current = messages.length;
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: didConvChange ? "instant" : "smooth" });
      }, 50);
    }
  }, [activeConv?.id, messages.length]);

  // Send message
  const sendMessage = async (text) => {
    if (!text.trim() || !activeConv || sending) return;
    const trimmed = text.trim();
    setDraft("");
    sessionStorage.removeItem(`chat_draft_${activeConv.id}`);

    // Optimistic UI
    const tempId = `temp_${Date.now()}`;
    const tempMsg = {
      id: tempId,
      sender: user?.name || "You",
      senderId: Number(user?.id),
      sender_id: Number(user?.id),
      text: trimmed,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      timestamp: Date.now(),
      status: "sending",
    };
    setMessages((prev) => [...prev, tempMsg]);

    try {
      setSending(true);
      const res = await API.post(`/exchanges/${activeConv.id}/messages`, {
        text: trimmed,
      });
      if (res.data?.success) {
        // Replace temp with confirmed
        setMessages((prev) =>
          prev.map((m) =>
            m.id === tempId
              ? { ...m, ...res.data.newMessage, status: "sent" }
              : m
          )
        );
        setRetryMsg(null);
      }
    } catch (err) {
      console.error("Send message error:", err);
      // Mark as failed
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempId ? { ...m, status: "failed" } : m
        )
      );
      setRetryMsg(tempMsg);
    } finally {
      setSending(false);
    }
  };

  const handleSend = () => sendMessage(draft);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleConvSelect = (ex) => {
    setActiveConv(ex);
    setMobileView("chat");
    setShowInfo(false);
    setMessages([]);
  };

  // Filtered conversations
  const filteredConvs = conversations.filter((ex) => {
    const partner = getPartner(ex);
    const matchQ =
      !searchQ ||
      partner?.name?.toLowerCase().includes(searchQ.toLowerCase()) ||
      ex.offered_skill_name?.toLowerCase().includes(searchQ.toLowerCase()) ||
      ex.requested_skill_name?.toLowerCase().includes(searchQ.toLowerCase());
    const matchFilter =
      filter === "all" ||
      (filter === "active" && ex.request_status === "accepted") ||
      (filter === "unread" && safeParse(ex.chat_history).length > 0);
    return matchQ && matchFilter;
  });

  const partner = activeConv ? getPartner(activeConv) : null;
  const lastMsg = messages[messages.length - 1];

  // Group messages by date
  const groupedMessages = [];
  let currentDate = null;
  for (const msg of messages) {
    const ts = msg.timestamp || msg.time;
    const date = ts
      ? new Date(typeof ts === "number" ? ts : `1970-01-01 ${ts}`).toDateString()
      : "Today";
    if (date !== currentDate) {
      groupedMessages.push({ type: "date", date });
      currentDate = date;
    }
    groupedMessages.push({ type: "msg", msg });
  }

  // ── Sidebar ──────────────────────────────────────────────────────────────
  const Sidebar = () => (
    <div
      className={`flex flex-col bg-[#111120] border-r border-white/5 w-full md:w-[320px] lg:w-[360px] shrink-0 ${
        mobileView === "chat" ? "hidden md:flex" : "flex"
      }`}
    >
      {/* Sidebar Header */}
      <div className="px-4 pt-5 pb-3 border-b border-white/5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <img
                src={
                  user?.profile_picture ||
                  get3DAvatarUrl(user?.gender, user?.name)
                }
                alt={user?.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/40"
              />
              <OnlineDot online />
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-tight">
                {user?.name || "You"}
              </p>
              <p className="text-[11px] text-indigo-400 font-semibold">
                Chats
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/explore")}
            title="Explore swap partners"
            className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-colors"
          >
            <Users className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 focus:bg-indigo-500/5 transition-all"
          />
          {searchQ && (
            <button
              onClick={() => setSearchQ("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex gap-1.5 mt-3">
          {["all", "active", "unread"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                filter === f
                  ? "bg-indigo-600 text-white"
                  : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200"
              }`}
            >
              {f === "all" ? "All" : f === "active" ? "Active Swaps" : "Unread"}
            </button>
          ))}
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredConvs.length === 0 ? (
          <div className="text-center py-12 px-6">
            <MessageSquare className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-500 font-semibold">
              {searchQ ? "No chats match your search" : "No conversations yet"}
            </p>
            <button
              onClick={() => navigate("/explore")}
              className="mt-4 text-xs text-indigo-400 hover:text-indigo-300 font-bold underline"
            >
              Find swap partners →
            </button>
          </div>
        ) : (
          filteredConvs.map((ex) => {
            const p = getPartner(ex);
            const chat = safeParse(ex.chat_history);
            const lastMsgInList = chat[chat.length - 1];
            const preview = lastMsgInList?.text
              ? lastMsgInList.text.length > 40
                ? lastMsgInList.text.slice(0, 40) + "…"
                : lastMsgInList.text
              : lastMsgInList?.sticker
              ? "Sent a sticker"
              : ex.request_status === "accepted"
              ? "Swap accepted · Start chatting!"
              : "Pending swap request";
            const isActive =
              activeConv?.id === ex.id || activeConv?.request_id === ex.request_id;
            const isAccepted = ex.request_status === "accepted";

            return (
              <button
                key={ex.id || ex.request_id}
                onClick={() => handleConvSelect(ex)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all border-b border-white/3 ${
                  isActive
                    ? "bg-indigo-600/15 border-l-2 border-l-indigo-500"
                    : "hover:bg-white/5 border-l-2 border-l-transparent"
                }`}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <img
                    src={
                      p?.picture ||
                      get3DAvatarUrl("other", p?.name)
                    }
                    alt={p?.name}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-white/10"
                  />
                  <OnlineDot online={isAccepted} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-sm font-bold text-white truncate">
                      {p?.name || "Swapper"}
                    </span>
                    <span className="text-[10px] text-slate-500 shrink-0 ml-1">
                      {lastMsgInList?.timestamp
                        ? timeAgo(lastMsgInList.timestamp)
                        : ex.request_status === "accepted"
                        ? "Active"
                        : "Pending"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-400 truncate leading-snug">
                      {preview}
                    </p>
                    {isAccepted && !lastMsgInList && (
                      <span className="ml-1 shrink-0 px-1.5 py-0.5 bg-indigo-600 text-white text-[9px] font-bold rounded-full">
                        NEW
                      </span>
                    )}
                  </div>
                  {/* Skill tags */}
                  <div className="flex gap-1 mt-1">
                    <span className="text-[9px] bg-indigo-500/15 text-indigo-400 px-1.5 py-0.5 rounded font-semibold truncate max-w-[80px]">
                      {ex.offered_skill_name?.split(" ")[0] || "Skill"}
                    </span>
                    <span className="text-[9px] text-slate-600">⇄</span>
                    <span className="text-[9px] bg-purple-500/15 text-purple-400 px-1.5 py-0.5 rounded font-semibold truncate max-w-[80px]">
                      {ex.requested_skill_name?.split(" ")[0] || "Skill"}
                    </span>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Sidebar Footer Nav */}
      <div className="p-3 border-t border-white/5 flex items-center justify-around">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-indigo-400 transition-colors text-[10px] font-bold"
        >
          <LayoutDashboard className="w-4.5 h-4.5" />
          <span>Dashboard</span>
        </button>
        <button
          onClick={() => navigate("/exchanges")}
          className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-indigo-400 transition-colors text-[10px] font-bold"
        >
          <BookOpen className="w-4.5 h-4.5" />
          <span>Sessions</span>
        </button>
        <button
          onClick={() => navigate("/explore")}
          className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-indigo-400 transition-colors text-[10px] font-bold"
        >
          <Sparkles className="w-4.5 h-4.5" />
          <span>Explore</span>
        </button>
        <button
          onClick={() => navigate("/requests")}
          className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-indigo-400 transition-colors text-[10px] font-bold"
        >
          <Zap className="w-4.5 h-4.5" />
          <span>Swaps</span>
        </button>
      </div>
    </div>
  );

  // ── Chat Window ────────────────────────────────────────────────────────────
  const ChatWindow = () => (
    <div
      className={`flex-1 flex flex-col min-w-0 ${
        mobileView === "list" ? "hidden md:flex" : "flex"
      }`}
    >
      {!activeConv ? (
        <EmptyConversation onExplore={() => navigate("/explore")} />
      ) : (
        <>
          {/* Chat Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-[#111120]/80 backdrop-blur-sm shrink-0">
            {/* Back button (mobile) */}
            <button
              onClick={() => setMobileView("list")}
              className="md:hidden p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Partner Avatar */}
            <div className="relative shrink-0">
              <img
                src={partner?.picture || get3DAvatarUrl("other", partner?.name)}
                alt={partner?.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/30"
              />
              <OnlineDot online={activeConv?.request_status === "accepted"} />
            </div>

            {/* Partner Info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-bold text-white truncate">
                {partner?.name || "Swap Partner"}
              </h2>
              <p className="text-[11px] text-slate-400 truncate">
                {activeConv?.request_status === "accepted" ? (
                  <span className="text-emerald-400 font-semibold">● Active swap</span>
                ) : activeConv?.request_status === "pending" ? (
                  <span className="text-amber-400 font-semibold">Pending proposal</span>
                ) : (
                  <span className="text-slate-500">{partner?.profession || "SkillSwap Co-Learner"}</span>
                )}
                {" · "}
                <span className="text-indigo-400 font-semibold">{partner?.teaches}</span>
                <span className="text-slate-500"> ⇄ </span>
                <span className="text-purple-400 font-semibold">{partner?.learns}</span>
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 shrink-0">
              {activeConv?.meeting_link && (
                <a
                  href={activeConv.meeting_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Join Video Call"
                  className="p-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-xl transition-colors"
                >
                  <Video className="w-4.5 h-4.5" />
                </a>
              )}
              <button
                onClick={() => navigate(`/exchanges`)}
                title="Open full session room"
                className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-white/5 rounded-xl transition-colors"
              >
                <Maximize2 className="w-4.5 h-4.5" />
              </button>
              <button
                onClick={() => setInfoOpen((v) => !v)}
                title="Info"
                className={`p-2 rounded-xl transition-colors ${
                  infoOpen
                    ? "text-indigo-400 bg-indigo-500/10"
                    : "text-slate-400 hover:text-indigo-400 hover:bg-white/5"
                }`}
              >
                <Info className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div
            className="flex-1 overflow-y-auto px-4 py-4 space-y-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 80%, rgba(79,70,229,0.04) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(124,58,237,0.04) 0%, transparent 50%)",
            }}
          >
            {/* Swap Context Card */}
            {activeConv && (
              <div className="flex items-center justify-center mb-4">
                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl px-4 py-3 text-center max-w-sm">
                  <p className="text-[11px] text-indigo-300 font-bold mb-1">
                    SkillSwap Exchange Room
                  </p>
                  <p className="text-xs text-slate-300">
                    <span className="text-indigo-400 font-bold">
                      {activeConv.offered_skill_name}
                    </span>
                    <span className="text-slate-500 mx-1.5">⇄</span>
                    <span className="text-purple-400 font-bold">
                      {activeConv.requested_skill_name}
                    </span>
                  </p>
                  {activeConv.request_status !== "accepted" && (
                    <p className="text-[10px] text-amber-400 mt-1.5 font-semibold">
                      ⚠ Accept the swap proposal to unlock full chat
                    </p>
                  )}
                  {activeConv.meeting_link && (
                    <a
                      href={activeConv.meeting_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-2 text-[11px] text-emerald-400 hover:text-emerald-300 font-bold"
                    >
                      <Video className="w-3.5 h-3.5" />
                      Join Video Session
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Icebreaker chips for empty chat */}
            {messages.length === 0 && activeConv?.request_status === "accepted" && (
              <div className="flex flex-col items-center gap-3 py-6">
                <p className="text-xs text-slate-500 font-semibold">
                  Say hi! Break the ice 👋
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {[
                    `Hey! Ready to start our ${activeConv.offered_skill_name} swap? 🚀`,
                    `When are you free for our first session? 📅`,
                    `Let's share our Google Meet link! 📹`,
                    `What's your experience level? Let's plan together! 🎯`,
                  ].map((chip) => (
                    <button
                      key={chip}
                      onClick={() => sendMessage(chip)}
                      className="px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 hover:border-indigo-500/40 text-indigo-300 text-xs font-semibold rounded-full transition-all"
                    >
                      {chip.slice(0, 50)}…
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            {groupedMessages.map((item, idx) => {
              if (item.type === "date") {
                const dateLabel =
                  item.date === new Date().toDateString()
                    ? "Today"
                    : item.date === new Date(Date.now() - 86400000).toDateString()
                    ? "Yesterday"
                    : item.date;
                return (
                  <div
                    key={`date_${idx}`}
                    className="flex items-center gap-3 py-3"
                  >
                    <div className="flex-1 h-px bg-white/5" />
                    <span className="text-[10px] text-slate-500 font-bold px-2 py-1 bg-white/5 rounded-full">
                      {dateLabel}
                    </span>
                    <div className="flex-1 h-px bg-white/5" />
                  </div>
                );
              }

              const { msg } = item;
              const isMine =
                Number(msg.senderId || msg.sender_id) === Number(user?.id);
              const isFailed = msg.status === "failed";

              return (
                <div
                  key={msg.id || idx}
                  className={`flex ${isMine ? "justify-end" : "justify-start"} mb-1`}
                >
                  {/* Partner avatar for incoming */}
                  {!isMine && (
                    <img
                      src={
                        partner?.picture ||
                        get3DAvatarUrl("other", partner?.name)
                      }
                      alt=""
                      className="w-6 h-6 rounded-full object-cover mr-2 self-end shrink-0"
                    />
                  )}

                  <div className={`max-w-[72%] sm:max-w-[60%] group`}>
                    {/* Sticker */}
                    {msg.sticker && (
                      <div
                        className={`text-4xl mb-1 ${
                          isMine ? "text-right" : "text-left"
                        }`}
                      >
                        {msg.sticker.emoji}
                      </div>
                    )}

                    {/* Text bubble */}
                    {msg.text && (
                      <div
                        className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                          isMine
                            ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-br-sm"
                            : "bg-white/8 text-slate-200 rounded-bl-sm backdrop-blur-sm border border-white/5"
                        } ${isFailed ? "opacity-50" : ""}`}
                      >
                        {renderText(msg.text)}

                        {/* Time + status */}
                        <div
                          className={`flex items-center gap-1 mt-1 ${
                            isMine ? "justify-end" : "justify-start"
                          }`}
                        >
                          <span className="text-[10px] opacity-60">
                            {msg.time || ""}
                          </span>
                          {isMine && <MsgStatus status={msg.status || "sent"} />}
                        </div>
                      </div>
                    )}

                    {/* Retry button for failed */}
                    {isFailed && (
                      <button
                        onClick={() => {
                          setMessages((prev) =>
                            prev.filter((m) => m.id !== msg.id)
                          );
                          sendMessage(msg.text);
                        }}
                        className="mt-1 text-[10px] text-rose-400 flex items-center gap-1 hover:text-rose-300"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Tap to retry
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            <div ref={messagesEndRef} />
          </div>

          {/* Composer */}
          <div className="shrink-0 px-3 py-3 border-t border-white/5 bg-[#111120]/90 backdrop-blur-sm">
            {activeConv?.request_status !== "accepted" ? (
              <div className="text-center py-3">
                <p className="text-sm text-slate-400 mb-2">
                  ✅ Accept the swap request first to start chatting
                </p>
                <button
                  onClick={() => navigate("/requests")}
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-colors"
                >
                  Go to Swaps →
                </button>
              </div>
            ) : (
              <div className="flex items-end gap-2">
                <div className="flex-1 flex items-end bg-white/5 border border-white/10 rounded-2xl focus-within:border-indigo-500/50 transition-all px-3 py-2 gap-2">
                  <textarea
                    ref={textareaRef}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message…"
                    rows={1}
                    className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 resize-none outline-none max-h-32 overflow-y-auto leading-relaxed scrollbar-none"
                    style={{ lineHeight: "1.5" }}
                    onInput={(e) => {
                      e.target.style.height = "auto";
                      e.target.style.height =
                        Math.min(e.target.scrollHeight, 128) + "px";
                    }}
                  />
                </div>
                <button
                  onClick={handleSend}
                  disabled={!draft.trim() || sending}
                  className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    draft.trim() && !sending
                      ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 active:scale-95"
                      : "bg-white/5 text-slate-600 cursor-not-allowed"
                  }`}
                >
                  <Send className="w-4.5 h-4.5" />
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );

  // ── Info Panel ─────────────────────────────────────────────────────────────
  const InfoPanel = () =>
    infoOpen && partner && activeConv ? (
      <div className="hidden lg:flex flex-col w-72 bg-[#111120] border-l border-white/5 shrink-0 overflow-y-auto">
        {/* Profile */}
        <div className="p-5 text-center border-b border-white/5">
          <div className="relative inline-block mb-3">
            <img
              src={partner.picture || get3DAvatarUrl("other", partner.name)}
              alt={partner.name}
              className="w-16 h-16 rounded-full object-cover ring-2 ring-indigo-500/30 mx-auto"
            />
            <OnlineDot online={activeConv?.request_status === "accepted"} />
          </div>
          <h3 className="font-bold text-white text-sm mb-0.5">{partner.name}</h3>
          <p className="text-xs text-slate-400">{partner.profession || "SkillSwap Co-Learner"}</p>
          {partner.city && (
            <p className="text-xs text-slate-500 mt-0.5">📍 {partner.city}</p>
          )}
        </div>

        {/* Swap Details */}
        <div className="p-4 border-b border-white/5 space-y-3">
          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
            Swap Details
          </p>
          <div className="bg-indigo-500/10 rounded-xl p-3">
            <p className="text-[11px] text-slate-400 mb-1">You teach</p>
            <p className="text-sm font-bold text-indigo-300">
              {activeConv.offered_skill_name}
            </p>
          </div>
          <div className="bg-purple-500/10 rounded-xl p-3">
            <p className="text-[11px] text-slate-400 mb-1">They teach</p>
            <p className="text-sm font-bold text-purple-300">
              {activeConv.requested_skill_name}
            </p>
          </div>
          <div
            className={`rounded-xl p-2.5 text-center text-xs font-bold ${
              activeConv.request_status === "accepted"
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-amber-500/10 text-amber-400"
            }`}
          >
            {activeConv.request_status === "accepted"
              ? "✅ Active Exchange"
              : "⏳ Pending Proposal"}
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 space-y-2">
          {activeConv.meeting_link && (
            <a
              href={activeConv.meeting_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 w-full px-3 py-2.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-xl text-sm font-bold transition-colors"
            >
              <Video className="w-4 h-4" />
              Join Video Session
              <ExternalLink className="w-3.5 h-3.5 ml-auto" />
            </a>
          )}
          <button
            onClick={() => navigate("/exchanges")}
            className="flex items-center gap-2.5 w-full px-3 py-2.5 bg-white/5 text-slate-300 hover:bg-white/10 rounded-xl text-sm font-bold transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            Open Session Room
            <ChevronRight className="w-3.5 h-3.5 ml-auto" />
          </button>
          <button
            onClick={() =>
              navigate(`/profile/${partner.id}`)
            }
            className="flex items-center gap-2.5 w-full px-3 py-2.5 bg-white/5 text-slate-300 hover:bg-white/10 rounded-xl text-sm font-bold transition-colors"
          >
            <Users className="w-4 h-4" />
            View Profile
            <ChevronRight className="w-3.5 h-3.5 ml-auto" />
          </button>
        </div>
      </div>
    ) : null;

  // ── Full Layout ────────────────────────────────────────────────────────────
  return (
    <div
      className="chat-page-root fixed inset-x-0 bottom-0 bg-[#0d0d1a] flex overflow-hidden"
      style={{ top: "56px" }}
      // On md+ (desktop): navbar is h-20 = 80px. We use inline style for mobile (56px)
      // and a pseudo-responsive trick via the class below
    >
      {/* Patch desktop top offset via a hidden div trick — use CSS override */}
      <style>{`
        @media (min-width: 768px) {
          .chat-page-root { top: 80px !important; }
        }
        /* Also account for mobile bottom nav (h-16 = 64px) */
        @media (max-width: 767px) {
          .chat-page-root { bottom: 64px !important; }
        }
      `}</style>
      <Sidebar />
      <ChatWindow />
      <InfoPanel />
    </div>
  );
}
