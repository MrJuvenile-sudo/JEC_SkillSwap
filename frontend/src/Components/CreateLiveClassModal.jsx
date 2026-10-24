import React, { useState } from "react";
import { 
  X, 
  Video, 
  Calendar, 
  Clock, 
  Users, 
  BookOpen, 
  Sparkles, 
  ExternalLink, 
  ShieldCheck, 
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import API from "../services/api";

const DOMAINS = [
  "Web Development",
  "DSA & Core CS",
  "AI & Machine Learning",
  "UI/UX Design",
  "Cloud & DevOps",
  "Languages & Comms",
  "General"
];

export default function CreateLiveClassModal({ isOpen, onClose, onSessionCreated }) {
  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    title: "",
    skill_topic: "",
    category: "Web Development",
    description: "",
    session_date: todayStr,
    start_time: "18:00",
    duration_minutes: 60,
    max_participants: 10,
    meeting_url: "",
    visibility: "public",
    status: "published",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  // Google Meet validation
  const isMeetUrlValid = (url) => {
    if (!url) return false;
    const trimmed = url.trim().toLowerCase();
    return (
      (trimmed.includes("meet.google.com/") && trimmed.split("meet.google.com/")[1]?.length >= 3)
    );
  };

  const handleSubmit = async (publishStatus = "published") => {
    setError("");
    setSuccess("");

    if (!formData.title.trim()) {
      setError("Please provide a title for your live class.");
      return;
    }
    if (!formData.skill_topic.trim()) {
      setError("Please specify the main skill or topic.");
      return;
    }
    if (!formData.session_date) {
      setError("Please choose a date for the session.");
      return;
    }
    if (!formData.start_time) {
      setError("Please choose a start time.");
      return;
    }

    if (publishStatus !== "draft") {
      if (!formData.meeting_url || !isMeetUrlValid(formData.meeting_url)) {
        setError("Please enter a valid Google Meet link (e.g. https://meet.google.com/abc-defg-hij).");
        return;
      }
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        status: publishStatus,
      };

      const res = await API.post("/live-sessions", payload);
      if (res.data.success) {
        setSuccess(
          publishStatus === "draft"
            ? "Live class saved as draft!"
            : "Live class published! Learners can now register for your class."
        );
        setTimeout(() => {
          if (onSessionCreated) onSessionCreated(res.data.session);
          onClose();
        }, 1200);
      } else {
        setError(res.data.message || "Failed to create live class");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Something went wrong creating the class.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-xs">
              <Video className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight leading-snug">Host a Live Class</h2>
              <span className="text-[11px] text-blue-100 font-medium">Powered by Google Meet · SkillSwap Live</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-blue-100 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{success}</span>
            </div>
          )}

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-700">
              Session Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. React.js Fundamentals & State Management Workshop"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Skill/Topic & Domain Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-700">
                Skill / Topic <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="skill_topic"
                value={formData.skill_topic}
                onChange={handleChange}
                placeholder="e.g. React.js, DSA, PyTorch"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-700">Technical Domain</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                {DOMAINS.map((dom) => (
                  <option key={dom} value={dom}>
                    {dom}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-700">Description & Agenda</label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="What will learners build or master in this session? (Prerequisites, syllabus, resources)"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Date, Time, Duration & Max Participants Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-600" /> Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                name="session_date"
                min={todayStr}
                value={formData.session_date}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-600" /> Start Time <span className="text-rose-500">*</span>
              </label>
              <input
                type="time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-700">Duration</label>
              <select
                name="duration_minutes"
                value={formData.duration_minutes}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value={30}>30 mins</option>
                <option value={45}>45 mins</option>
                <option value={60}>60 mins</option>
                <option value={90}>90 mins</option>
                <option value={120}>120 mins</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-blue-600" /> Max Seats
              </label>
              <input
                type="number"
                name="max_participants"
                min={2}
                max={100}
                value={formData.max_participants}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Google Meet Link Field (Highlighted Section) */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/70 via-teal-50/50 to-blue-50/50 border border-emerald-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-black text-slate-900 block leading-tight">Google Meet Link</span>
                  <span className="text-[10px] text-emerald-700 font-semibold">Live Interactive Room</span>
                </div>
              </div>

              {/* Quick Helper to Open Google Meet */}
              <a
                href="https://meet.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-blue-700 bg-white hover:bg-blue-50 border border-blue-200 rounded-lg transition-colors cursor-pointer"
              >
                <span>Open Google Meet</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <input
              type="url"
              name="meeting_url"
              value={formData.meeting_url}
              onChange={handleChange}
              placeholder="https://meet.google.com/abc-defg-hij"
              className={`w-full px-4 py-2.5 bg-white border rounded-xl text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 ${
                formData.meeting_url && !isMeetUrlValid(formData.meeting_url)
                  ? "border-rose-300 focus:ring-rose-500 text-rose-900"
                  : "border-emerald-300 focus:ring-emerald-500 text-slate-900"
              }`}
            />

            <div className="flex items-start gap-1.5 text-[11px] text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Privacy Guaranteed:</strong> This Google Meet link is strictly protected. Only registered learners and the host can view the link when the session starts.
              </span>
            </div>
          </div>

          {/* Visibility */}
          <div className="flex items-center justify-between pt-1">
            <div>
              <span className="text-xs font-extrabold text-slate-900 block">Class Visibility</span>
              <span className="text-[11px] text-slate-500">Public classes are discoverable by the entire SkillSwap community.</span>
            </div>
            <select
              name="visibility"
              value={formData.visibility}
              onChange={handleChange}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 cursor-pointer"
            >
              <option value="public">Public (Recommended)</option>
              <option value="private">Private (Direct Invite)</option>
            </select>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={() => handleSubmit("draft")}
            disabled={loading}
            className="px-4 py-2.5 text-xs font-extrabold text-slate-700 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
          >
            Save as Draft
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSubmit("published")}
              disabled={loading}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-extrabold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{loading ? "Publishing..." : "Publish Live Class"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
