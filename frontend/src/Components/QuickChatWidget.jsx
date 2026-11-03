import React, { useState, useEffect, useRef } from "react";
import { 
  MessageSquare, 
  Send, 
  ArrowLeft, 
  CheckCheck, 
  Video, 
  Search, 
  Smile, 
  ExternalLink,
  Users,
  Sparkles,
  Maximize2,
  Minimize2,
  X,
  ArrowUpRight,
  Clock,
  Check
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { get3DAvatarUrl } from "../utils/avatarUtils";
import { notifyWithSoundAndVibration } from "../utils/soundUtils";

// Helper to render clickable URLs in message text
function renderMessageText(text) {
  if (!text) return null;
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part, i) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-700 underline font-bold hover:text-emerald-950 break-all inline-flex items-center gap-0.5"
          onClick={(e) => e.stopPropagation()}
        >
          <span>{part}</span>
        </a>
      );
    }
    return part;
  });
}

export default function QuickChatWidget() {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null); // Starts null so user tabs are shown first
  const [messages, setMessages] = useState({});
  const [inputMsg, setInputMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false); // WhatsApp Web Fullscreen mode

  const messagesEndRef = useRef(null);

  // Quick reaction chips
  const quickChips = ["👋 Hi!", "🤝 Let's swap skills!", "📅 Meeting time?", "🚀 Ready!", "👍 Sounds great!"];

  // Fetch initial conversations list
  useEffect(() => {
    fetchConversations();
    // Poll conversations list every 5 seconds to catch newly accepted proposals
    const convInterval = setInterval(() => {
      fetchConversations(false);
    }, 5000);
    return () => clearInterval(convInterval);
  }, [currentUser]);

  // Real-time message polling every 2.5 seconds for active chat room
  useEffect(() => {
    if (!activeChatId) return;

    const pollMessages = async () => {
      try {
        const res = await API.get(`/exchanges/${activeChatId}/messages`);
        if (res.data?.success && Array.isArray(res.data.messages)) {
          const incoming = res.data.messages;
          setMessages((prev) => {
            const currentList = prev[activeChatId] || [];
            // Merge & deduplicate by message id or timestamp+senderId
            const seen = new Set();
            const merged = [];

            // Add incoming
            for (const m of incoming) {
              const key = m.id || `${m.timestamp}_${m.senderId || m.sender_id}_${m.text}`;
              if (!seen.has(key)) {
                seen.add(key);
                merged.push(m);
              }
            }

            // Preserve local optimistic sending messages
            for (const m of currentList) {
              if (m.status === "sending") {
                const key = m.id || `${m.timestamp}_${m.senderId || m.sender_id}_${m.text}`;
                if (!seen.has(key)) {
                  seen.add(key);
                  merged.push(m);
                }
              }
            }

            if (merged.length !== currentList.length || JSON.stringify(merged) !== JSON.stringify(currentList)) {
              if (merged.length > currentList.length) {
                const latest = merged[merged.length - 1];
                if (latest && Number(latest.senderId || latest.sender_id) !== Number(currentUser?.id)) {
                  notifyWithSoundAndVibration();
                }
              }
              return { ...prev, [activeChatId]: merged };
            }
            return prev;
          });
        }
      } catch (err) {
        // Fallback: poll general /exchanges if messages sub-route has an issue
      }
    };

    pollMessages();
    const messageInterval = setInterval(pollMessages, 2500);
    return () => clearInterval(messageInterval);
  }, [activeChatId, currentUser?.id]);

  const prevChatIdRef = useRef(null);
  const prevMsgLenRef = useRef(0);

  // Auto-scroll to bottom smoothly on message count change or room switch
  useEffect(() => {
    if (activeChatId) {
      const currentList = messages[activeChatId] || [];
      if (activeChatId !== prevChatIdRef.current || currentList.length !== prevMsgLenRef.current) {
        prevChatIdRef.current = activeChatId;
        prevMsgLenRef.current = currentList.length;
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [activeChatId, (messages[activeChatId] || []).length]);

  const fetchConversations = async (isInitial = true) => {
    if (isInitial) setLoading(true);
    try {
      const res = await API.get("/exchanges");
      if (res.data.success && res.data.exchanges) {
        const activeList = res.data.exchanges.filter(
          (ex) =>
            ex.status !== "completed" &&
            ex.request_status !== "rejected" &&
            ex.request_status !== "cancelled"
        );

        const initialMessages = {};
        const formatted = activeList.map((ex) => {
          const isRequester = Number(currentUser?.id) === Number(ex.requester_id);
          const partnerName = isRequester ? ex.receiver_name : ex.requester_name;
          const partnerPic = isRequester ? ex.receiver_picture : ex.requester_picture;
          const partnerRole = isRequester
            ? (ex.receiver_profession || ex.receiver_degree || "Co-Learner")
            : (ex.requester_profession || ex.requester_degree || "Co-Learner");

          let chatList = [];
          if (Array.isArray(ex.chat_history)) {
            chatList = ex.chat_history;
          } else if (typeof ex.chat_history === "string" && ex.chat_history.trim()) {
            try {
              const parsed = JSON.parse(ex.chat_history.trim());
              chatList = Array.isArray(parsed) ? parsed : [];
            } catch (e) {
              chatList = [];
            }
          }

          let lastMsg = "Start a direct conversation...";
          let time = "Now";

          if (chatList.length > 0) {
            const lastItem = chatList[chatList.length - 1];
            lastMsg = lastItem.text || (lastItem.sticker ? `${lastItem.sticker.emoji} ${lastItem.sticker.label}` : "Message");
            time = lastItem.time || "Recently";
          } else {
            // Default welcoming barter prompt
            chatList = [
              {
                id: 1,
                sender: partnerName || "Exchange Partner",
                senderId: isRequester ? ex.receiver_id : ex.requester_id,
                sender_id: isRequester ? ex.receiver_id : ex.requester_id,
                text: `Hi ${currentUser?.name || "there"}! Excited for our skill swap: ${ex.offered_skill_name || "Skill"} ⇄ ${ex.requested_skill_name || "Skill"}. When are you free to connect?`,
                time: "10:30 AM",
                isReceived: true,
                status: "sent"
              },
            ];
            lastMsg = chatList[0].text;
          }

          initialMessages[ex.id] = chatList;

          return {
            id: ex.id,
            exchangeId: ex.id,
            name: partnerName || "Exchange Partner",
            role: partnerRole,
            avatar: partnerPic || get3DAvatarUrl("other", partnerName),
            lastMsg,
            time,
            offeredSkill: isRequester ? ex.offered_skill_name : ex.requested_skill_name,
            requestedSkill: isRequester ? ex.requested_skill_name : ex.offered_skill_name,
            meetingLink: ex.meeting_link || "https://meet.google.com/new",
            rawExchange: ex,
          };
        });

        setConversations((prev) => {
          if (
            prev.length === formatted.length &&
            JSON.stringify(prev.map(p => ({ id: p.id, lastMsg: p.lastMsg }))) ===
            JSON.stringify(formatted.map(p => ({ id: p.id, lastMsg: p.lastMsg })))
          ) {
            return prev;
          }
          return formatted;
        });
        setMessages((prev) => {
          let hasChanged = false;
          const next = { ...prev };
          for (const [key, list] of Object.entries(initialMessages)) {
            const existing = prev[key];
            if (!existing) {
              next[key] = list;
              hasChanged = true;
            } else if (existing.length !== list.length || JSON.stringify(existing) !== JSON.stringify(list)) {
              const sendingItems = existing.filter((m) => m.status === "sending");
              next[key] = sendingItems.length > 0 ? [...list, ...sendingItems] : list;
              hasChanged = true;
            }
          }
          return hasChanged ? next : prev;
        });
      }
    } catch (err) {
      console.error("Error fetching conversations in QuickChatWidget:", err);
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  // WhatsApp-style optimistic send message
  const handleSendMessage = async (customText = null, customSticker = null) => {
    const textToSend = customText !== null ? customText : inputMsg;
    if (!textToSend.trim() && !customSticker) return;
    if (sending || !activeChatId) return;

    setSending(true);
    const timeNow = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const tempId = Date.now();

    const newMsgObj = {
      id: tempId,
      sender: currentUser?.name || "You",
      senderId: Number(currentUser?.id),
      sender_id: Number(currentUser?.id),
      text: textToSend.trim(),
      sticker: customSticker || null,
      time: timeNow,
      timestamp: tempId,
      isReceived: false,
      status: "sending",
    };

    const currentChatList = messages[activeChatId] || [];
    const updatedChatList = [...currentChatList, newMsgObj];

    // 1. Instant Optimistic UI Update
    setMessages((prev) => ({
      ...prev,
      [activeChatId]: updatedChatList,
    }));

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeChatId
          ? { ...c, lastMsg: textToSend.trim() || "Sticker", time: timeNow }
          : c
      )
    );

    setInputMsg("");

    // 2. Persist to Backend
    try {
      const res = await API.post(`/exchanges/${activeChatId}/messages`, {
        text: textToSend.trim(),
        sticker: customSticker || null,
      });

      if (res.data?.success && res.data.chat_history) {
        setMessages((prev) => ({
          ...prev,
          [activeChatId]: res.data.chat_history,
        }));
      } else {
        // Mark as sent
        setMessages((prev) => ({
          ...prev,
          [activeChatId]: (prev[activeChatId] || []).map((m) =>
            m.id === tempId ? { ...m, status: "sent" } : m
          ),
        }));
      }
    } catch (err) {
      // Fallback: update via PUT /api/exchanges/:id
      try {
        await API.put(`/exchanges/${activeChatId}`, {
          chat_history: JSON.stringify(
            updatedChatList.map((m) => ({ ...m, status: "sent" }))
          ),
        });
        setMessages((prev) => ({
          ...prev,
          [activeChatId]: (prev[activeChatId] || []).map((m) =>
            m.id === tempId ? { ...m, status: "sent" } : m
          ),
        }));
      } catch (fallbackErr) {
        console.error("Error saving message:", fallbackErr);
      }
    } finally {
      setSending(false);
    }
  };

  const handleLaunchGoogleMeet = async (chat) => {
    const meetUrl =
      chat?.meetingLink &&
      chat.meetingLink.startsWith("http") &&
      !chat.meetingLink.includes("skillswap-room")
        ? chat.meetingLink
        : "https://meet.google.com/new";
    window.open(meetUrl, "_blank", "noopener,noreferrer");
    if (chat?.exchangeId) {
      try {
        await API.put(`/exchanges/${chat.exchangeId}`, {
          meeting_link: meetUrl,
          status: "in_progress",
        });
      } catch (e) {
        console.error("Error updating meet link:", e);
      }
    }
  };

  // Dedicated Top-Right Arrow Action: opens full session classroom on /exchanges
  const handleOpenFullChat = (exchangeId = null) => {
    navigate("/exchanges", {
      state: {
        openChat: true,
        openChatId: exchangeId || activeChatId || (conversations[0]?.exchangeId || null),
      },
    });
  };

  const activeChat = activeChatId ? conversations.find((c) => c.id === activeChatId) : null;
  const activeChatMessages = activeChatId && messages[activeChatId] ? messages[activeChatId] : [];

  const filteredConversations = conversations.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.offeredSkill?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.requestedSkill?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMsg.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="bg-[#FAF7EE] rounded-3xl border border-slate-200/90 shadow-sm font-sans flex flex-col h-[520px] items-center justify-center space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin"></div>
        <p className="text-xs font-bold text-slate-600">Loading direct conversations...</p>
      </div>
    );
  }

  // Content Container: handles both normal widget mode and WhatsApp Web full-screen overlay mode
  const widgetContent = (
    <div
      className={`bg-[#FAF7EE] border border-slate-200/90 shadow-sm font-sans flex flex-col overflow-hidden relative transition-all duration-300 ${
        isFullScreen
          ? "w-full max-w-6xl h-full sm:h-[94vh] rounded-none sm:rounded-3xl shadow-2xl border-0 sm:border border-slate-300"
          : "h-[520px] rounded-3xl"
      }`}
    >
      {/* ------------------------------------------------------------- */}
      {/* 1. TOP HEADER (Active User Chat View OR User Tabs View) */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-[#f2ecdf] px-4 py-3 border-b border-slate-200/80 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          {activeChat ? (
            /* Active Chat Top Header */
            <div className="flex items-center gap-2 min-w-0">
              <button
                onClick={() => setActiveChatId(null)}
                className="p-1.5 px-2.5 rounded-xl bg-white/90 hover:bg-white text-slate-800 border border-slate-200/80 transition-all flex items-center gap-1 font-black text-xs cursor-pointer shadow-2xs hover:scale-105 shrink-0"
                title="Back to all users tabs"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-slate-700" />
                <span>Users</span>
              </button>

              <div className="relative shrink-0">
                <img
                  src={activeChat.avatar}
                  alt={activeChat.name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/30 bg-white"
                />
                <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] border-2 border-[#FAF7EE] absolute -bottom-0.5 -right-0.5"></span>
              </div>
              <div className="min-w-0">
                <h4 className="font-extrabold text-xs text-slate-900 truncate leading-tight flex items-center gap-1.5">
                  <span className="truncate">{activeChat.name}</span>
                  <span className="px-1.5 py-0.2 rounded text-[8px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                    Direct Chat
                  </span>
                </h4>
                <span className="text-[10px] text-emerald-700 font-bold block truncate">
                  online • {activeChat.offeredSkill} ⇄ {activeChat.requestedSkill}
                </span>
              </div>
            </div>
          ) : (
            /* User Tabs / Conversations List Header */
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center font-bold shadow-xs shrink-0">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-black text-slate-900 tracking-tight truncate">Direct Quick Inbox</h3>
                <span className="text-[10px] text-slate-500 font-semibold truncate block">Select a swapper tab to open chat</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Controls in Top Right: FullScreen Toggle, Top-Right Arrow to Sessions, and Google Meet */}
        <div className="flex items-center gap-1.5 shrink-0">
          {activeChat && (
            <button
              onClick={() => handleLaunchGoogleMeet(activeChat)}
              className="p-2 rounded-xl text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
              title="Launch Google Meet video call in a new tab"
            >
              <Video className="w-4 h-4" />
            </button>
          )}

          {/* Full Screen Mode Toggle Button - navigates to /chat page */}
          <button
            onClick={() => {
              // Save draft before navigating
              if (activeChatId && inputMsg.trim()) {
                sessionStorage.setItem(`chat_draft_${activeChatId}`, inputMsg);
              }
              if (activeChatId) {
                navigate(`/chat?c=${activeChatId}`);
              } else {
                navigate('/chat');
              }
            }}
            className="p-2 rounded-xl text-slate-700 hover:bg-white hover:text-indigo-700 border border-transparent hover:border-slate-200 transition-all cursor-pointer shadow-2xs"
            title="Open Full Chat Page"
          >
            <Maximize2 className="w-4 h-4 text-slate-700" />
          </button>

          {/* Dedicated Top-Right Arrow: navigates directly to /exchanges classroom */}
          <button
            onClick={() => handleOpenFullChat(activeChat?.exchangeId)}
            className="p-2 rounded-xl bg-white/90 hover:bg-emerald-600 hover:text-white text-slate-700 border border-slate-200 transition-all cursor-pointer shadow-2xs group"
            title="Open Full Session Room in Sessions (Arrow)"
          >
            <ArrowUpRight className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </button>

          {isFullScreen && (
            <button
              onClick={() => setIsFullScreen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer"
              title="Close Full Screen"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. CHAT CONTENT AREA (Active Chat Mode OR Users Tabs Mode)   */}
      {/* ------------------------------------------------------------- */}
      {activeChatId && activeChat ? (
        /* =========================================================== */
        /* MODE A: ACTIVE USER CHAT VIEW                               */
        /* =========================================================== */
        <div className="flex-1 flex flex-col justify-between overflow-hidden bg-[#FAF7EE] relative">
          {/* Messages Scroll View (WhatsApp Cream Paper Wallpaper) */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
            {/* Direct Chat Date Stamp */}
            <div className="flex justify-center my-1">
              <span className="px-3.5 py-1 rounded-full bg-white/95 border border-slate-200/80 text-[10px] font-extrabold text-slate-600 uppercase tracking-wider shadow-2xs flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-emerald-600" />
                <span>TODAY • 1-ON-1 SKILL EXCHANGE</span>
              </span>
            </div>

            {activeChatMessages.map((msg, idx) => {
              const isMine =
                Number(msg.senderId || msg.sender_id) === Number(currentUser?.id) ||
                msg.sender === (currentUser?.name || "You") ||
                msg.sender === "You" ||
                msg.isReceived === false;

              return (
                <div
                  key={msg.id || idx}
                  className={`flex ${isMine ? "justify-end" : "justify-start"} animate-in fade-in duration-200`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-3.5 py-2 text-xs relative shadow-2xs ${
                      isMine
                        ? "bg-[#D9FDD3] text-slate-900 border border-[#bbf7b1] rounded-tr-none"
                        : "bg-white text-slate-900 border border-slate-200/80 rounded-tl-none"
                    }`}
                  >
                    {!isMine && (
                      <span className="text-[10px] font-black text-emerald-700 block mb-0.5">
                        {activeChat.name}
                      </span>
                    )}

                    {msg.sticker && (
                      <div className="bg-black/10 p-2 rounded-xl text-center space-y-0.5 my-1 border border-black/5">
                        <span className="text-2xl block">{msg.sticker.emoji}</span>
                        <span className="text-[10px] font-bold text-slate-700 block">
                          {msg.sticker.label}
                        </span>
                      </div>
                    )}

                    {msg.text && (
                      <p className="font-medium text-xs leading-relaxed break-words whitespace-pre-wrap">
                        {renderMessageText(msg.text)}
                      </p>
                    )}

                    <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-slate-500 font-bold">
                      <span>{msg.time || "Now"}</span>
                      {isMine && (
                        msg.status === "sending" ? (
                          <Clock className="w-3 h-3 text-slate-400 inline animate-spin" />
                        ) : (
                          <CheckCheck className="w-3.5 h-3.5 text-sky-500 inline" title="Delivered & Read" />
                        )
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Reaction Tap Bar */}
          <div className="px-3 py-1.5 bg-[#f5efdf] border-t border-slate-200/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip)}
                className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-full text-[10px] font-bold border border-slate-200 whitespace-nowrap transition-all shadow-2xs shrink-0 hover:scale-105 cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Direct Chat Bottom Input Bar */}
          <div className="p-2.5 bg-[#f0e8d8] border-t border-slate-200/80 flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleSendMessage("👋")}
              className="p-1.5 rounded-full hover:bg-black/5 text-slate-600 transition-colors cursor-pointer"
              title="Send Wave Sticker"
            >
              <Smile className="w-5 h-5 text-amber-500 hover:scale-110 transition-transform" />
            </button>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex-1 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={`Type a direct message to ${activeChat.name}...`}
                className="flex-1 px-4 py-2.5 bg-white rounded-full text-xs font-medium text-slate-900 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#25D366] placeholder-slate-400 shadow-2xs"
              />

              <button
                type="submit"
                disabled={!inputMsg.trim() || sending}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md shrink-0 ${
                  inputMsg.trim()
                    ? "bg-[#25D366] hover:bg-[#1faa4a] text-white hover:scale-105 cursor-pointer"
                    : "bg-slate-300 text-slate-500 cursor-not-allowed"
                }`}
                title="Send Message (Enter)"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* =========================================================== */
        /* MODE B: USERS TABS & CONVERSATIONS LIST VIEW (INITIAL)     */
        /* =========================================================== */
        <div className="flex-1 flex flex-col justify-between overflow-hidden bg-[#FAF7EE]">
          {/* 1. Horizontal User Name Tabs Strip */}
          {conversations.length > 0 && (
            <div className="px-3 py-2 bg-[#f6efe1] border-b border-slate-200/80 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 mr-0.5 shrink-0 flex items-center gap-1">
                <Users className="w-3 h-3 text-emerald-700" />
                <span>Users:</span>
              </span>
              {conversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveChatId(c.id)}
                  className="px-3 py-1.5 bg-white hover:bg-emerald-50 hover:border-emerald-300 text-slate-900 hover:text-emerald-950 rounded-full text-xs font-extrabold border border-slate-200/90 flex items-center gap-1.5 shrink-0 transition-all shadow-2xs hover:scale-105 cursor-pointer"
                  title={`Open direct chat with ${c.name}`}
                >
                  <img
                    src={c.avatar}
                    alt={c.name}
                    className="w-4 h-4 rounded-full object-cover ring-1 ring-emerald-500/40 bg-white"
                  />
                  <span>{c.name}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]"></span>
                </button>
              ))}
            </div>
          )}

          {/* 2. Search Contacts Bar */}
          <div className="p-2.5 bg-white border-b border-slate-200/70 shrink-0">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search swappers or skills..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 rounded-xl text-xs font-medium text-slate-900 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder-slate-400"
              />
            </div>
          </div>

          {/* 3. Conversations Vertical List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 bg-white">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setActiveChatId(c.id)}
                  className="p-3 hover:bg-emerald-50/50 cursor-pointer transition-colors flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        src={c.avatar}
                        alt={c.name}
                        className="w-11 h-11 rounded-full object-cover ring-2 ring-emerald-500/20 group-hover:ring-emerald-500 transition-all bg-slate-100"
                      />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] border-2 border-white absolute bottom-0 right-0"></span>
                    </div>

                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                          {c.name}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-medium">({c.role})</span>
                      </div>

                      <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 truncate">
                        <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 shrink-0">
                          {c.offeredSkill}
                        </span>
                        <span>⇄</span>
                        <span className="text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200 shrink-0">
                          {c.requestedSkill}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 font-medium truncate pt-0.5">
                        {c.lastMsg}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-[10px] text-slate-400 font-bold">{c.time}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveChatId(c.id);
                      }}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-black shadow-2xs transition-all flex items-center gap-1 group-hover:scale-105"
                    >
                      <span>Chat</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center space-y-2">
                <Users className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="text-xs font-bold text-slate-700">No active swapper chats yet</h4>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                  Accept incoming swap proposals or connect on Explore to start messaging here!
                </p>
              </div>
            )}
          </div>

          {/* 4. Bottom Footer Info Bar */}
          <div className="p-2.5 bg-[#f6efe1] border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-600 font-bold shrink-0">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
              <span>SkillSwap WhatsApp Sync Active</span>
            </span>
            <button
              onClick={() => handleOpenFullChat()}
              className="text-emerald-700 hover:text-emerald-900 font-extrabold flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>View Sessions Grid</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // Return either Full Screen Overlay or inline Widget
  if (isFullScreen) {
    return (
      <div className="fixed inset-0 z-50 p-0 sm:p-4 lg:p-6 bg-slate-950/85 backdrop-blur-md flex items-center justify-center animate-in fade-in">
        {widgetContent}
      </div>
    );
  }

  return widgetContent;
}
