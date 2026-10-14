import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import SkillBadge from "../Components/SkillBadge";
import SwapRequestModal from "../Components/SwapRequestModal";
import LoadingSpinner from "../Components/LoadingSpinner";
import { MapPin, Star, Repeat, Calendar, MessageSquare, ArrowLeft, Building2, Briefcase } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { get3DAvatarUrl } from "../utils/avatarUtils";

export default function UserProfileView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user: currentUser } = useAuth();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/users/profile/${id}`);
      if (res.data.success) {
        setUser(res.data.user);
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const isSelf = currentUser && parseInt(currentUser.id) === parseInt(id);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6">
      
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Explore
      </button>

      {notification && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-xs">
          <span>{notification}</span>
          <button onClick={() => setNotification("")} className="text-emerald-600 font-bold ml-4">✕</button>
        </div>
      )}

      {loading ? (
        <LoadingSpinner label="Loading swapper profile..." />
      ) : user ? (
        <div className="space-y-6">
          
          {/* Main Profile Header Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <img
                src={user.profile_picture || get3DAvatarUrl(user.gender, user.name)}
                alt={user.name}
                className="w-24 h-24 rounded-3xl object-cover ring-4 ring-indigo-500/20 shadow-md"
              />

              <div className="space-y-2">
                <h1 className="text-2xl font-extrabold text-slate-900">{user.name}</h1>
                
                {user.profession && (
                  <p className="text-xs font-bold text-blue-600 flex items-center justify-center sm:justify-start gap-1">
                    <Briefcase className="w-3.5 h-3.5" />
                    {user.profession}
                  </p>
                )}

                {(user.city || user.location) && (
                  <p className="text-xs font-medium text-slate-600 flex items-center justify-center sm:justify-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    {[user.city, user.location].filter(Boolean).join(", ")}
                  </p>
                )}

                {user.education_institute && (
                  <p className="text-xs font-medium text-slate-600 flex items-center justify-center sm:justify-start gap-1">
                    <Building2 className="w-3.5 h-3.5 text-blue-600" />
                    {user.education_institute} {user.education_degree ? `• ${user.education_degree}` : ""}
                  </p>
                )}

                <div className="flex items-center justify-center sm:justify-start gap-2 text-xs">
                  <div className="flex items-center text-amber-500 font-bold">
                    <Star className="w-4 h-4 fill-amber-400 mr-1" />
                    {user.rating || "5.0"}
                  </div>
                  <span className="text-slate-400">({user.total_reviews || 0} reviews)</span>
                </div>

                {user.bio && (
                  <p className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-2xl border border-slate-150 max-w-xl mt-2">
                    "{user.bio}"
                  </p>
                )}
              </div>
            </div>

            {!isSelf && (
              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate("/login");
                    return;
                  }
                  setShowSwapModal(true);
                }}
                className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-xs shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition-all hover:scale-105 shrink-0"
              >
                <Repeat className="w-4 h-4" />
                Propose Skill Swap
              </button>
            )}
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Offered */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                Skills {user.name} Can Teach
              </h3>
              <div className="flex flex-wrap gap-2">
                {user.offered_skills && user.offered_skills.length > 0 ? (
                  user.offered_skills.map((s) => <SkillBadge key={s.id} skill={s} type="offered" size="md" />)
                ) : (
                  <p className="text-xs text-slate-400 italic">No skills listed</p>
                )}
              </div>
            </div>

            {/* Wanted */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                Skills {user.name} Wants to Learn
              </h3>
              <div className="flex flex-wrap gap-2">
                {user.wanted_skills && user.wanted_skills.length > 0 ? (
                  user.wanted_skills.map((s) => <SkillBadge key={s.id} skill={s} type="wanted" size="md" />)
                ) : (
                  <p className="text-xs text-slate-400 italic">No learning goals listed</p>
                )}
              </div>
            </div>

          </div>

          {/* Reviews List */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
              Community Reviews ({user.reviews ? user.reviews.length : 0})
            </h3>

            {user.reviews && user.reviews.length > 0 ? (
              <div className="space-y-3">
                {user.reviews.map((r) => (
                  <div key={r.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-150 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={r.reviewer_picture || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"}
                          alt={r.reviewer_name}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <span className="text-xs font-bold text-slate-900">{r.reviewer_name}</span>
                      </div>
                      <div className="flex items-center text-amber-500 font-bold text-xs">
                        <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                        {r.rating}.0
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 italic">"{r.comment}"</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic py-4 text-center">No reviews received yet.</p>
            )}
          </div>

          {/* Swap Modal */}
          {showSwapModal && (
            <SwapRequestModal
              targetUser={user}
              onClose={() => setShowSwapModal(false)}
              onSuccess={(msg) => setNotification(msg)}
            />
          )}

        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-slate-500">User profile not found.</p>
        </div>
      )}

    </div>
  );
}
