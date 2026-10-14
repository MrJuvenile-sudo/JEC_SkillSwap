import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import { X, Repeat, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function SwapRequestModal({ targetUser, onClose, onSuccess }) {
  const { user: currentUser } = useAuth();
  
  const [offeredSkillId, setOfferedSkillId] = useState(
    currentUser?.offered_skills?.[0]?.skill_id || ""
  );
  const [requestedSkillId, setRequestedSkillId] = useState(
    targetUser?.offered_skills?.[0]?.skill_id || ""
  );
  const [message, setMessage] = useState(
    `Hi ${targetUser.name}! I would love to learn ${targetUser?.offered_skills?.[0]?.skill_name || 'your skill'} and can teach you in return.`
  );
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!offeredSkillId || !requestedSkillId) {
      setError("Please select both a skill you offer and a skill you request.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await API.post("/requests", {
        receiver_id: targetUser.id,
        offered_skill_id: parseInt(offeredSkillId),
        requested_skill_id: parseInt(requestedSkillId),
        message,
      });

      if (res.data.success) {
        onSuccess(res.data.message || "Swap request sent successfully!");
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-150 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
            <Repeat className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Request Skill Swap</h2>
            <p className="text-xs text-slate-500">Propose a exchange session with {targetUser.name}</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Skill You Offer */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              1. What Skill Will You Teach? (Your Skill)
            </label>
            {currentUser?.offered_skills?.length > 0 ? (
              <select
                value={offeredSkillId}
                onChange={(e) => setOfferedSkillId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {currentUser.offered_skills.map((s) => (
                  <option key={s.id} value={s.skill_id}>
                    {s.skill_name} ({s.experience_level})
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                You haven't listed any offered skills on your profile yet. Please update your profile first.
              </p>
            )}
          </div>

          {/* Skill You Request */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              2. What Skill Do You Want to Learn? (From {targetUser.name})
            </label>
            {targetUser?.offered_skills?.length > 0 ? (
              <select
                value={requestedSkillId}
                onChange={(e) => setRequestedSkillId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {targetUser.offered_skills.map((s) => (
                  <option key={s.id} value={s.skill_id}>
                    {s.skill_name} ({s.experience_level})
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-xs text-amber-600 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                {targetUser.name} hasn't listed specific offered skills.
              </p>
            )}
          </div>

          {/* Message Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              3. Personal Message
            </label>
            <textarea
              rows="3"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Introduce yourself and describe your availability..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !currentUser?.offered_skills?.length}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-200 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Repeat className="w-4 h-4" />
                  Send Proposal
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
