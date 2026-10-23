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
  ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { get3DAvatarUrl } from "../utils/avatarUtils";

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

  const messagesEndRef = useRef(null);

  // Quick reaction chips
  const quickChips = ["👋 Hi!", "🤝 Let's swap skills!", "📅 Meeting time?", "🚀 Ready!", "👍 Sounds great!"];

  useEffect(() => {
    fetchConversations();
  }, [currentUser]);

  useEffect(() => {
    if (activeChatId) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeChatId, messages]);

  const fetchConversations = async () => {
    try {
      const res = await API.get("/exchanges");
      if (res.data.success && res.data.exchanges) {
        const activeList = res.data.exchanges.filter(ex => ex.status !== "completed");
        
        const initialMessages = {};
        const formatted = activeList.map((ex) => {
          const isRequester = currentUser?.id === ex.requester_id;
          const partnerName = isRequester ? ex.receiver_name : ex.requester_name;
          const partnerPic = isRequester ? ex.receiver_picture : ex.requester_picture;
          const partnerRole = isRequester 
            ? (ex.receiver_profession || ex.receiver_degree || "Co-Learner") 
            : (ex.requester_profession || ex.requester_degree || "Co-Learner");
          
          let chatList = [];
          let lastMsg = "Start a direct conversation...";
          let time = "Now";

          if (ex.chat_history) {
            try {
              chatList = JSON.parse(ex.chat_history);
              if (Array.isArray(chatList) && chatList.length > 0) {
                const lastItem = chatList[chatList.length - 1];
                lastMsg = lastItem.text || (lastItem.sticker ? `${lastItem.sticker.emoji} ${lastItem.sticker.label}` : "Message");
                time = lastItem.time || "Recently";
              }
            } catch (e) {
              chatList = [];
            }
          }

          // If no messages yet, provide a welcoming barter prompt
          if (chatList.length === 0) {
            chatList = [
              {
                id: 1,
                sender: partnerName || "Exchange Partner",
                senderId: isRequester ? ex.receiver_id : ex.requester_id,
                text: `Hi ${currentUser?.name || "there"}! Excited for our skill swap: ${ex.offered_skill_name || "Skill"} ⇄ ${ex.requested_skill_name || "Skill"}. When are you free to connect?`,
                time: "10:30 AM",
                isReceived: true
              }
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
            rawExchange: ex
          };
        });

        setConversations(formatted);
        setMessages(initialMessages);
        // Notice: activeChatId is NOT auto-selected, so user tabs/list is shown initially
      }
    } catch (err) {
      console.error("Error fetching conversations in QuickChatWidget:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (customText = null) => {
    const textToSend = customText || inputMsg;
    if (!textToSend.trim() || !activeChatId) return;

    setSending(true);
    const timeNow = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const newMsgObj = {
      id: Date.now(),
      sender: currentUser?.name || "You",
      senderId: currentUser?.id,
      text: textToSend.trim(),
      time: timeNow,
      isReceived: false,
      delivered: true,
      read: true
    };

    const currentChatList = messages[activeChatId] || [];
    const updatedChatList = [...currentChatList, newMsgObj];

    // Optimistic UI Update
    setMessages(prev => ({
      ...prev,
      [activeChatId]: updatedChatList
    }));

    setConversations(prev => prev.map(c => 
      c.id === activeChatId ? { ...c, lastMsg: textToSend.trim(), time: timeNow } : c
    ));

    setInputMsg("");

    try {
      await API.put(`/exchanges/${activeChatId}`, {
        chat_history: JSON.stringify(updatedChatList)
      });
    } catch (err) {
      console.error("Error persisting direct message:", err);
    } finally {
      setSending(false);
    }
  };

  const handleLaunchGoogleMeet = async (chat) => {
    const meetUrl = (chat?.meetingLink && chat.meetingLink.startsWith("http") && !chat.meetingLink.includes("skillswap-room")) 
      ? chat.meetingLink 
      : "https://meet.google.com/new";
    window.open(meetUrl, "_blank", "noopener,noreferrer");
    if (chat?.exchangeId) {
      try {
        await API.put(`/exchanges/${chat.exchangeId}`, {
          meeting_link: meetUrl,
          status: "in_progress"
        });
      } catch (e) {
        console.error("Error updating meet link:", e);
      }
    }
  };

  const handleOpenFullChat = (exchangeId = null) => {
    navigate("/exchanges", { 
      state: { 
        openChat: true, 
        openChatId: exchangeId || activeChatId || (conversations[0]?.exchangeId || null) 
      } 
    });
  };

  const activeChat = activeChatId ? conversations.find(c => c.id === activeChatId) : null;
  const activeChatMessages = (activeChatId && messages[activeChatId]) ? messages[activeChatId] : [];

  const filteredConversations = conversations.filter(c => 
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

  return (
    <div className="bg-[#FAF7EE] rounded-3xl border border-slate-200/90 shadow-sm font-sans flex flex-col h-[520px] overflow-hidden relative">
      
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

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {activeChat ? (
            <>
              <button
                onClick={() => handleLaunchGoogleMeet(activeChat)}
                className="p-2 rounded-xl text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
                title="Launch Google Meet automatically in a new tab"
              >
                <Video className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleOpenFullChat(activeChat.exchangeId)}
                className="p-2 rounded-xl text-slate-600 hover:bg-black/5 transition-colors cursor-pointer"
                title="Expand Full Exchanges Screen"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white text-emerald-800 border border-slate-200 shadow-2xs">
                {conversations.length} Swappers
              </span>
              <button
                onClick={() => handleOpenFullChat()}
                className="p-2 rounded-xl text-slate-600 hover:bg-black/5 transition-colors cursor-pointer"
                title="Open Full Exchanges Screen"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </>
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
          
          {/* Messages Scroll View (Cream Paper Wallpaper) */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
            
            {/* Direct Chat Date Stamp */}
            <div className="flex justify-center">
              <span className="px-3 py-0.5 rounded-full bg-white/90 border border-slate-200/60 text-[9px] font-extrabold text-slate-500 uppercase tracking-wider shadow-2xs">
                TODAY • 1-ON-1 SKILL EXCHANGE
              </span>
            </div>

            {activeChatMessages.map((msg, idx) => {
              const isMine = msg.senderId === currentUser?.id || (!msg.isReceived && (msg.sender === (currentUser?.name || "You") || msg.sender === "You"));

              return (
                <div 
                  key={msg.id || idx} 
                  className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                >
                  <div 
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs relative shadow-2xs ${
                      isMine 
                        ? "bg-[#D9FDD3] text-slate-900 border border-[#bbf7b1] rounded-tr-none" 
                        : "bg-white text-slate-900 border border-slate-200/80 rounded-tl-none"
                    }`}
                  >
                    {!isMine && (
                      <span className="text-[10px] font-extrabold text-emerald-700 block mb-0.5">
                        {activeChat.name}
                      </span>
                    )}
                    <p className="font-medium text-xs leading-relaxed break-words whitespace-pre-wrap">
                      {msg.text}
                    </p>
                    <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-slate-500 font-bold">
                      <span>{msg.time || "Now"}</span>
                      {isMine && (
                        <CheckCheck className="w-3.5 h-3.5 text-sky-500 inline" />
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
              title="Send Wave"
            >
              <Smile className="w-4 h-4 text-amber-500" />
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
                placeholder={`Type a direct message to ${activeChat.name}...`}
                className="flex-1 px-3.5 py-2 bg-white rounded-full text-xs font-medium text-slate-900 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#25D366] placeholder-slate-400"
              />

              <button
                type="submit"
                disabled={!inputMsg.trim() || sending}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-md shrink-0 ${
                  inputMsg.trim() 
                    ? "bg-[#25D366] hover:bg-[#1faa4a] text-white hover:scale-105 cursor-pointer" 
                    : "bg-slate-300 text-slate-500 cursor-not-allowed"
                }`}
                title="Send Message"
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
                placeholder="Search swappers by name or skill..."
                className="w-full pl-8 pr-3 py-1.5 bg-[#FAF7EE] rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#25D366]"
              />
            </div>
          </div>

          {/* 3. Vertical User Cards / Tabs List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setActiveChatId(chat.id)}
                  className="p-3 bg-white hover:bg-[#FAF7EE] rounded-2xl border border-slate-200/90 hover:border-emerald-400 transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 group shadow-2xs hover:shadow-md hover:-translate-y-0.5"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="relative shrink-0">
                      <img
                        src={chat.avatar}
                        alt={chat.name}
                        className="w-11 h-11 rounded-2xl object-cover ring-2 ring-emerald-500/30 bg-white"
                      />
                      <span className="w-3 h-3 rounded-full bg-[#25D366] border-2 border-white absolute -bottom-0.5 -right-0.5"></span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                          {chat.name}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-semibold shrink-0">
                          {chat.time}
                        </span>
                      </div>

                      {/* Reciprocal Barter Pill */}
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 truncate">
                          {chat.offeredSkill}
                        </span>
                        <span className="text-[9px] text-slate-400">⇄</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-800 border border-indigo-200 truncate">
                          {chat.requestedSkill}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 truncate font-normal mt-1 flex items-center gap-1">
                        <CheckCheck className="w-3 h-3 text-sky-500 shrink-0 inline" />
                        <span className="truncate">{chat.lastMsg}</span>
                      </p>
                    </div>
                  </div>

                  {/* Open Chat Action Tab */}
                  <div className="shrink-0 flex items-center">
                    <span className="px-2.5 py-1 rounded-xl text-[10px] font-black bg-[#E2F7CB] text-emerald-800 border border-emerald-300/80 group-hover:bg-[#25D366] group-hover:text-white transition-all flex items-center gap-1 shadow-2xs">
                      <span>Chat</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 px-4 text-xs text-slate-500 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto font-bold shadow-xs">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">No active swapper chats</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {searchQuery ? "No swappers matched your search query." : "Accept swap requests or browse directory to start chatting!"}
                  </p>
                </div>
                {!searchQuery && (
                  <button
                    onClick={() => navigate("/explore")}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    Browse Swappers
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 4. Footer Bar */}
          <div className="p-3 bg-[#f2ecdf] border-t border-slate-200/80 flex items-center justify-between text-xs font-bold text-slate-600 shrink-0">
            <span className="text-[11px] text-emerald-800 flex items-center gap-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
              Encrypted P2P Coordination
            </span>
            <button
              onClick={() => handleOpenFullChat()}
              className="text-emerald-700 hover:text-emerald-800 hover:underline text-xs font-black flex items-center gap-1 cursor-pointer"
            >
              <span>Full Screen</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
