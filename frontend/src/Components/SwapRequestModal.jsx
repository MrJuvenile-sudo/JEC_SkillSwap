import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import { X, Repeat, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function SwapRequestModal({ targetUser, onClose, onSuccess }) {
  const { user: currentUser } = useAuth();

  const [availableSkills, setAvailableSkills] = useState([]);
  const [offeredSkillId, setOfferedSkillId] = useState(
    currentUser?.offered_skills?.[0]?.skill_id || "1"
  );
  const [requestedSkillId, setRequestedSkillId] = useState(
    targetUser?.offered_skills?.[0]?.skill_id || "4"
  );
  const [message, setMessage] = useState(
    `Hi ${targetUser.name}! I would love to connect and exchange skills 1-on-1 with you. Looking forward to our session!`
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all system skills so dropdowns are never empty
  useEffect(() => {
    let isMounted = true;
    API.get("/skills")
      .then((res) => {
        if (isMounted && res.data.success && res.data.skills) {
          setAvailableSkills(res.data.skills);
          // Set intelligent defaults if not already set
          if (!offeredSkillId && res.data.skills.length > 0) {
            setOfferedSkillId(String(res.data.skills[0].id));
          }
          if (!requestedSkillId && res.data.skills.length > 1) {
            setRequestedSkillId(String(res.data.skills[1].id));
          }
        }
      })
      .catch((err) => console.warn("Could not load master skills list:", err.message));

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const finalOffered = offeredSkillId ? parseInt(offeredSkillId) : 1;
    const finalRequested = requestedSkillId ? parseInt(requestedSkillId) : 4;

    try {
      const res = await API.post("/requests", {
        receiver_id: targetUser.id,
        offered_skill_id: finalOffered,
        requested_skill_id: finalRequested,
        message,
      });

      if (res.data.success) {
        if (onSuccess) {
          onSuccess(res.data.message || `Connected with ${targetUser.name}! Your 1-on-1 session is ready in Sessions.`);
        }
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const userOffered = currentUser?.offered_skills || [];
  const targetOffered = targetUser?.offered_skills || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in zoom-in-95">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <Repeat className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">Connect & Request Swap</h2>
            <p className="text-xs text-slate-500 font-medium">Propose a 1-on-1 peer exchange session with {targetUser.name}</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Skill You Offer */}
          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
              1. What Skill Will You Teach? (Your Skill)
            </label>
            <select
              value={offeredSkillId}
              onChange={(e) => setOfferedSkillId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {userOffered.length > 0 && (
                <optgroup label="Your Profile Skills">
                  {userOffered.map((s) => (
                    <option key={`my-${s.id}`} value={s.skill_id}>
                      {s.skill_name} ({s.experience_level || "Intermediate"})
                    </option>
                  ))}
                </optgroup>
              )}
              <optgroup label="All Technical Skills">
                {availableSkills.map((s) => (
                  <option key={`avail-${s.id}`} value={s.id}>
                    {s.name} ({s.category || "Skill"})
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Skill You Request */}
          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
              2. What Skill Do You Want to Learn? (From {targetUser.name})
            </label>
            <select
              value={requestedSkillId}
              onChange={(e) => setRequestedSkillId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {targetOffered.length > 0 && (
                <optgroup label={`${targetUser.name}'s Listed Skills`}>
                  {targetOffered.map((s) => (
                    <option key={`target-${s.id}`} value={s.skill_id}>
                      {s.skill_name} ({s.experience_level || "Intermediate"})
                    </option>
                  ))}
                </optgroup>
              )}
              <optgroup label="All Technical Skills">
                {availableSkills.map((s) => (
                  <option key={`target-avail-${s.id}`} value={s.id}>
                    {s.name} ({s.category || "Skill"})
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Message Input */}
          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
              3. Message to {targetUser.name}
            </label>
            <textarea
              rows="3"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Introduce yourself and describe your availability..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
            />
          </div>

          {/* Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-black shadow-md hover:shadow-lg transition-all cursor-pointer hover:scale-105"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <Repeat className="w-4 h-4" />
                  <span>Send Proposal & Connect</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
