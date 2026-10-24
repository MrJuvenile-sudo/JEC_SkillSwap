import React, { useState } from "react";
import { X, Check, Star, ShieldCheck, UserCheck, MessageSquare, AlertCircle } from "lucide-react";
import API from "../services/api";

export default function SessionAttendanceModal({
  isOpen,
  onClose,
  session,
  isHost,
  participants = [],
  onUpdated,
}) {
  if (!isOpen || !session) return null;

  // Host state: map of user_id -> boolean
  const [attendanceMap, setAttendanceMap] = useState(() => {
    const init = {};
    participants.forEach((p) => {
      init[p.user_id] = p.status === "attended";
    });
    return init;
  });

  // Learner state: rating & feedback
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleToggleAttendance = (userId) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const handleHostSave = async () => {
    setLoading(true);
    setError("");
    setMsg("");
    try {
      const attendees = Object.entries(attendanceMap).map(([userId, attended]) => ({
        user_id: parseInt(userId),
        attended,
      }));

      const res = await API.post(`/live-sessions/${session.id}/attendance`, { attendees });
      if (res.data.success) {
        setMsg("Attendance successfully recorded!");
        setTimeout(() => {
          if (onUpdated) onUpdated();
          onClose();
        }, 1200);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to record attendance.");
    } finally {
      setLoading(false);
    }
  };

  const handleLearnerSubmit = async () => {
    setLoading(true);
    setError("");
    setMsg("");
    try {
      const res = await API.post(`/live-sessions/${session.id}/attendance`, {
        rating,
        feedback,
      });
      if (res.data.success) {
        setMsg("Thank you for your rating and feedback!");
        setTimeout(() => {
          if (onUpdated) onUpdated();
          onClose();
        }, 1200);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to submit rating.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div 
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-extrabold">
              {isHost ? "Mark Attendance & Participation" : "Rate & Review Class"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {error && (
            <div className="p-3 bg-rose-50 text-rose-800 rounded-xl text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {msg && (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{msg}</span>
            </div>
          )}

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
            <h4 className="text-xs font-extrabold text-slate-900">{session.title}</h4>
            <span className="text-[11px] text-slate-500 font-medium">{session.skill_topic} · {session.session_date}</span>
          </div>

          {/* HOST VIEW: Checklist of participants */}
          {isHost ? (
            <div className="space-y-3">
              <p className="text-xs text-slate-600 font-semibold">
                Mark learners who joined and actively participated in your Google Meet session:
              </p>

              {participants.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400 font-medium">
                  No registered participants for this class yet.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                  {participants.map((p) => {
                    const isAttended = Boolean(attendanceMap[p.user_id]);
                    return (
                      <div
                        key={p.user_id}
                        onClick={() => handleToggleAttendance(p.user_id)}
                        className={`py-2.5 px-3 rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                          isAttended ? "bg-emerald-50/70" : "hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={p.profile_picture || `https://api.dicebear.com/7.x/lorelei/svg?seed=${p.name}`}
                            alt={p.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <span className="text-xs font-black text-slate-900 block leading-tight">{p.name}</span>
                            <span className="text-[10px] text-slate-500 font-semibold">{p.profession || "Learner"}</span>
                          </div>
                        </div>

                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                            isAttended
                              ? "bg-emerald-600 border-emerald-600 text-white shadow-xs"
                              : "border-slate-300 text-transparent hover:border-slate-400"
                          }`}
                        >
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* LEARNER VIEW: Star rating & feedback */
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <span className="text-xs font-bold text-slate-600">How was your experience in this Google Meet class?</span>
                <div className="flex items-center justify-center gap-1 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 cursor-pointer transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          (hoverRating || rating) >= star
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-200 fill-slate-100"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-blue-600" /> Share your feedback
                </label>
                <textarea
                  rows={3}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="What did you learn? Was the host clear and helpful?"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={isHost ? handleHostSave : handleLearnerSubmit}
            disabled={loading}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? "Saving..." : isHost ? "Save Attendance" : "Submit Review"}
          </button>
        </div>
      </div>
    </div>
  );
}
