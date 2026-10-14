import React, { useState } from "react";
import { 
  Calendar, 
  Clock, 
  Video, 
  CheckSquare, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  UserCheck
} from "lucide-react";
import { Link } from "react-router-dom";
import { get3DAvatarUrl } from "../utils/avatarUtils";

export default function UpcomingSessions({ exchanges = [] }) {
  const [expandedChecklistId, setExpandedChecklistId] = useState(null);
  const [checklists, setChecklists] = useState({});

  const toggleCheckItem = (sessionId, itemId) => {
    setChecklists(prev => ({
      ...prev,
      [sessionId]: (prev[sessionId] || []).map(item => 
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    }));
  };

  const displaySessions = exchanges;

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4 font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Calendar className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">Upcoming Scheduled Sessions</h3>
            <p className="text-xs text-slate-500 font-medium">Chronological agenda of your booked 1-on-1 barter appointments</p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
          {displaySessions.length} Booked
        </span>
      </div>

      {/* Sessions Timeline List or Empty State */}
      {displaySessions.length > 0 ? (
        <div className="space-y-4">
          {displaySessions.map((s) => {
            const isChecklistOpen = expandedChecklistId === s.id;
            const sessionChecklist = checklists[s.id] || [
              { id: "c1", label: "Review session notes & trade skills", completed: false },
              { id: "c2", label: "Test Google Meet video & audio", completed: false }
            ];

            return (
              <div 
                key={s.id} 
                className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 transition-all hover:border-indigo-300"
              >
                {/* Top Row: Date Badge & Partner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={s.partnerPic || s.partner_picture || get3DAvatarUrl("other", s.partnerName || s.partner_name || "Swapper")}
                      alt={s.partnerName || s.partner_name || "Swapper"}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-500/20 bg-indigo-100 shrink-0"
                    />
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                        <span>{s.partnerName || s.partner_name || "Barter Partner"}</span>
                        <UserCheck className="w-4 h-4 text-blue-600" />
                      </h4>
                      <p className="text-[11px] text-indigo-600 font-semibold">{s.partnerRole || s.title || "Scheduled Session Room"}</p>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-bold shadow-2xs shrink-0">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>
                      {s.scheduled_at 
                        ? new Date(s.scheduled_at).toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) 
                        : (s.dateBadge || "When both free")}
                    </span>
                  </div>
                </div>

                {/* Skill Trade Pills */}
                <div className="bg-white p-3 rounded-xl border border-slate-200/80 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">YOU TEACH:</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                      {s.offeredSkill || s.offered_skill_name || "Offered Skill"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">YOU LEARN:</span>
                    <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 text-[11px]">
                      {s.requestedSkill || s.requested_skill_name || "Requested Skill"}
                    </span>
                  </div>
                </div>

                {/* Action Buttons & Checklist Toggle */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-1">
                  <button
                    onClick={() => setExpandedChecklistId(isChecklistOpen ? null : s.id)}
                    className="w-full sm:w-auto px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <CheckSquare className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Prepare Checklist ({sessionChecklist.filter(c => c.completed).length}/{sessionChecklist.length})</span>
                    {isChecklistOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => {
                      const rawUrl = s.meetLink || s.meeting_link;
                      const targetUrl = (rawUrl && rawUrl.startsWith("http") && !rawUrl.includes("skillswap-room"))
                        ? rawUrl
                        : "https://meet.google.com/new";
                      window.open(targetUrl, "_blank", "noopener,noreferrer");
                    }}
                    className="w-full sm:w-auto px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow-xs transition-all flex items-center justify-center gap-1.5 hover:scale-105 cursor-pointer"
                    title="Automatically launches Google Meet in a new tab"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Launch Google Meet</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                {/* Prepare Checklist Drawer */}
                {isChecklistOpen && (
                  <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs space-y-2 animate-in fade-in">
                    <span className="font-extrabold text-slate-800 text-[11px] block border-b border-slate-100 pb-1">
                      Pre-Session Study Checklist:
                    </span>
                    <div className="space-y-1.5">
                      {sessionChecklist.map((item) => (
                        <label 
                          key={item.id} 
                          className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900 font-medium"
                        >
                          <input
                            type="checkbox"
                            checked={item.completed}
                            onChange={() => toggleCheckItem(s.id, item.id)}
                            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                          />
                          <span className={item.completed ? "line-through text-slate-400" : ""}>
                            {item.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-xs text-slate-500 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
          <p className="font-bold text-slate-700">No upcoming scheduled sessions yet.</p>
          <p className="text-slate-500">Explore swapper profiles and send proposal requests to schedule a 1-on-1 session!</p>
          <div className="pt-2">
            <Link to="/explore" className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl inline-block shadow-xs hover:bg-indigo-700">
              Browse Directory
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
