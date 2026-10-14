import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import SkillBadge from "../Components/SkillBadge";
import LoadingSpinner from "../Components/LoadingSpinner";
import { 
  User, 
  MapPin, 
  Star, 
  Plus, 
  Trash2, 
  Edit3, 
  Sparkles, 
  BookOpen, 
  AlertCircle, 
  CheckCircle2,
  ShieldCheck,
  Building2,
  GraduationCap,
  Briefcase,
  Clock,
  Globe,
  Github,
  Linkedin,
  ExternalLink,
  Award,
  Check,
  Layers
} from "lucide-react";

import { 
  MALE_3D_AVATARS, 
  FEMALE_3D_AVATARS, 
  NEUTRAL_3D_AVATARS, 
  get3DAvatarUrl 
} from "../utils/avatarUtils";

export default function Profile() {
  const { user, refreshUser, updateUser } = useAuth();
  
  const [allMasterSkills, setAllMasterSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState("");

  // 3D Avatar presets gallery grouped by gender
  const avatarPresets = {
    male: MALE_3D_AVATARS,
    female: FEMALE_3D_AVATARS,
    other: NEUTRAL_3D_AVATARS
  };

  // Edit Profile modal state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState("");
  const [editGender, setEditGender] = useState("male");
  const [editCity, setEditCity] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editProfession, setEditProfession] = useState("");
  const [editEduDegree, setEditEduDegree] = useState("");
  const [editEduInstitute, setEditEduInstitute] = useState("");
  const [editEduYear, setEditEduYear] = useState("");
  const [editAvailability, setEditAvailability] = useState("");
  const [editGithub, setEditGithub] = useState("");
  const [editLinkedin, setEditLinkedin] = useState("");
  const [editPortfolio, setEditPortfolio] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editPic, setEditPic] = useState("");

  // Add Skill modal state
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [skillType, setSkillType] = useState("offered"); // 'offered' | 'wanted'
  const [selectedSkillId, setSelectedSkillId] = useState("");
  const [expLevel, setExpLevel] = useState("intermediate");
  const [skillDescription, setSkillDescription] = useState("");

  // Custom new skill creation
  const [isCreatingNewSkill, setIsCreatingNewSkill] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState("Technology & Programming");

  useEffect(() => {
    fetchMasterSkills();
  }, []);

  const fetchMasterSkills = async () => {
    try {
      const res = await API.get("/skills");
      if (res.data.success) {
        setAllMasterSkills(res.data.skills || []);
      }
    } catch (err) {
      console.error("Error loading master skills:", err);
    }
  };

  const handleStartEditingProfile = () => {
    setEditName(user?.name || "");
    setEditGender(user?.gender || "other");
    setEditCity(user?.city || "");
    setEditLocation(user?.location || "");
    setEditProfession(user?.profession || "");
    setEditEduDegree(user?.education_degree || "");
    setEditEduInstitute(user?.education_institute || "");
    setEditEduYear(user?.education_year || "");
    setEditAvailability(user?.availability || "Flexible (Weekdays & Weekends)");
    setEditGithub(user?.github_url || "");
    setEditLinkedin(user?.linkedin_url || "");
    setEditPortfolio(user?.portfolio_url || "");
    setEditBio(user?.bio || "");
    setEditPic(user?.profile_picture || avatarPresets[user?.gender || "other"]?.[0] || "");
    setIsEditingProfile(true);
  };

  const handleGenderChange = (newGender) => {
    setEditGender(newGender);
    // Auto select first avatar preset for chosen gender if current pic matches previous presets
    const presets = avatarPresets[newGender] || avatarPresets.male;
    if (presets && presets.length > 0) {
      setEditPic(presets[0]);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put("/users/profile", {
        name: editName.trim(),
        gender: editGender,
        city: editCity.trim(),
        location: editLocation.trim(),
        profession: editProfession.trim(),
        education_degree: editEduDegree.trim(),
        education_institute: editEduInstitute.trim(),
        education_year: editEduYear.trim(),
        availability: editAvailability.trim(),
        github_url: editGithub.trim(),
        linkedin_url: editLinkedin.trim(),
        portfolio_url: editPortfolio.trim(),
        bio: editBio.trim(),
        profile_picture: editPic,
      });

      if (res.data.success) {
        if (res.data.user) {
          updateUser(res.data.user);
        }
        await refreshUser();
        setNotification("Profile details successfully updated across SkillSwap!");
        setIsEditingProfile(false);
      }
    } catch (err) {
      alert("Failed to update profile");
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    let skillIdToSubmit = selectedSkillId;

    try {
      if (isCreatingNewSkill) {
        if (!newSkillName.trim()) {
          alert("Please enter a skill name");
          return;
        }
        const createRes = await API.post("/skills", {
          name: newSkillName,
          category: newSkillCategory,
        });
        if (createRes.data.success) {
          skillIdToSubmit = createRes.data.skill.id;
          fetchMasterSkills();
        }
      }

      if (!skillIdToSubmit) {
        alert("Please select a skill");
        return;
      }

      const res = await API.post("/users/skills", {
        skill_id: skillIdToSubmit,
        type: skillType,
        experience_level: expLevel,
        description: skillDescription,
      });

      if (res.data.success) {
        setNotification(`Skill added to your ${skillType === 'offered' ? 'teaching' : 'learning'} list!`);
        setIsAddingSkill(false);
        setIsCreatingNewSkill(false);
        setSelectedSkillId("");
        setNewSkillName("");
        refreshUser();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add skill");
    }
  };

  const handleDeleteSkill = async (userSkillId) => {
    if (!window.confirm("Remove this skill from your profile?")) return;
    try {
      const res = await API.delete(`/users/skills/${userSkillId}`);
      if (res.data.success) {
        setNotification("Skill removed from profile");
        refreshUser();
      }
    } catch (err) {
      alert("Failed to remove skill");
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-6">
      
      {notification && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xs">
          <span>{notification}</span>
          <button onClick={() => setNotification("")} className="text-emerald-600 font-bold ml-4">✕</button>
        </div>
      )}

      {/* Main Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500"></div>

        <button
          onClick={handleStartEditingProfile}
          className="absolute top-6 right-6 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl transition-all flex items-center gap-1.5 text-xs font-extrabold border border-blue-200/80 shadow-2xs hover:scale-105"
        >
          <Edit3 className="w-4 h-4" />
          <span>Edit Profile Details</span>
        </button>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left pt-2">
          
          {/* Avatar Container with Gender Badge */}
          <div className="relative group">
            <img
              src={user?.profile_picture || get3DAvatarUrl(user?.gender, user?.name)}
              alt={user?.name}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover ring-4 ring-blue-500/20 shadow-md transition-transform group-hover:scale-105"
            />
            <span className="absolute -bottom-2 right-0 px-2.5 py-1 bg-slate-900 text-white text-[10px] font-extrabold rounded-full border border-white shadow-xs capitalize">
              {user?.gender || "Verified"}
            </span>
          </div>

          {/* User Basic Info */}
          <div className="space-y-3 flex-1">
            <div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {user?.name}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-extrabold border border-blue-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  Verified Swapper
                </span>
              </div>

              <p className="text-sm font-bold text-blue-600 mt-1 flex items-center justify-center md:justify-start gap-1.5">
                <Briefcase className="w-4 h-4" />
                {user?.profession || "SkillSwap Co-Learner"}
              </p>
            </div>

            {/* City & Location & Education */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-semibold text-slate-600">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-rose-500" />
                {[user?.city, user?.location].filter(Boolean).join(", ") || "Location not specified"}
              </span>

              <span className="flex items-center gap-1 text-slate-600">
                <Building2 className="w-4 h-4 text-blue-600" />
                {user?.education_institute || "Institution not specified"}
              </span>

              {user?.availability && (
                <span className="flex items-center gap-1 text-slate-600">
                  <Clock className="w-4 h-4 text-amber-500" />
                  {user.availability}
                </span>
              )}
            </div>

            {/* Bio Quote */}
            {user?.bio && (
              <p className="text-xs text-slate-600 italic bg-slate-50 p-4 rounded-2xl border border-slate-200/80 max-w-3xl leading-relaxed">
                "{user.bio}"
              </p>
            )}

            {/* Social / Portfolio Links */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1 text-xs">
              {user?.github_url && (
                <a href={user.github_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition-colors">
                  <Github className="w-3.5 h-3.5" /> GitHub
                </a>
              )}
              {user?.linkedin_url && (
                <a href={user.linkedin_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold transition-colors">
                  <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                </a>
              )}
              {user?.portfolio_url && (
                <a href={user.portfolio_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold transition-colors">
                  <Globe className="w-3.5 h-3.5" /> Portfolio
                </a>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Grid Layout: Detailed Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Education & Credentials */}
        <div className="space-y-6 md:col-span-1">
          
          {/* Education Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              Academic & Institution Details
            </h3>

            <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div>
                <span className="text-slate-400 font-medium block">Course / Degree</span>
                <span className="font-extrabold text-slate-900">{user?.education_degree || "Specialization not specified"}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">College / Institute</span>
                <span className="font-bold text-slate-800">{user?.education_institute || "Institution not specified"}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Affiliated University / Year</span>
                <span className="font-bold text-slate-700">{user?.education_year || "Academic year not specified"}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">City / State / Region</span>
                <span className="font-bold text-slate-700">{[user?.city, user?.location].filter(Boolean).join(", ") || "Location not specified"}</span>
              </div>
            </div>
          </div>

          {/* Quick Stats Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Swapper Reputation
            </h3>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-blue-50/70 p-3.5 rounded-2xl border border-blue-100">
                <span className="block text-2xl font-black text-blue-600">100%</span>
                <span className="text-[10px] font-bold text-slate-600 uppercase">Barter Ratio</span>
              </div>
              <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-100">
                <span className="block text-2xl font-black text-amber-600 flex items-center justify-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400" /> 4.9
                </span>
                <span className="text-[10px] font-bold text-slate-600 uppercase">Karma Rating</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Columns: Skills (Teaching & Learning) */}
        <div className="space-y-6 md:col-span-2">
          
          {/* Skills Offered (Teaching) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  Skills You Teach (Offered)
                </h3>
                <p className="text-xs text-slate-500">Topics you are proficient in and can mentor peers 1-on-1</p>
              </div>

              <button
                onClick={() => {
                  setSkillType("offered");
                  setIsAddingSkill(true);
                }}
                className="px-3.5 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1 border border-emerald-200/80 shadow-2xs hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                <span>Add Skill</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {user?.offered_skills && user.offered_skills.length > 0 ? (
                user.offered_skills.map((s) => (
                  <div key={s.id} className="flex items-center justify-between p-3.5 bg-emerald-50/50 rounded-2xl border border-emerald-200/60 transition-all hover:bg-emerald-50">
                    <SkillBadge skill={s} type="offered" size="md" />
                    <button
                      onClick={() => handleDeleteSkill(s.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Remove skill"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-xs text-slate-500 font-semibold mb-2">No teaching skills listed yet.</p>
                  <button
                    onClick={() => {
                      setSkillType("offered");
                      setIsAddingSkill(true);
                    }}
                    className="text-xs text-emerald-600 font-extrabold hover:underline"
                  >
                    + Add your first teaching skill
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Skills Wanted (Learning Goals) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  Skills You Want to Learn (Wanted)
                </h3>
                <p className="text-xs text-slate-500">Skills you want to master through reciprocal barter sessions</p>
              </div>

              <button
                onClick={() => {
                  setSkillType("wanted");
                  setIsAddingSkill(true);
                }}
                className="px-3.5 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1 border border-blue-200/80 shadow-2xs hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                <span>Add Goal</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {user?.wanted_skills && user.wanted_skills.length > 0 ? (
                user.wanted_skills.map((s) => (
                  <div key={s.id} className="flex items-center justify-between p-3.5 bg-blue-50/50 rounded-2xl border border-blue-200/60 transition-all hover:bg-blue-50">
                    <SkillBadge skill={s} type="wanted" size="md" />
                    <button
                      onClick={() => handleDeleteSkill(s.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Remove skill"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-xs text-slate-500 font-semibold mb-2">No learning goals listed yet.</p>
                  <button
                    onClick={() => {
                      setSkillType("wanted");
                      setIsAddingSkill(true);
                    }}
                    className="text-xs text-blue-600 font-extrabold hover:underline"
                  >
                    + Add your first learning goal
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Comprehensive Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 border border-slate-200 my-8">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900">Edit Comprehensive Profile</h3>
                <p className="text-xs text-slate-500 font-medium">Update your profile details, avatar, education, and social links</p>
              </div>
              <button onClick={() => setIsEditingProfile(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">✕</button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-5 text-xs">
              
              {/* Section 1: Basic & Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-extrabold text-slate-800 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-extrabold text-slate-800 mb-1">Gender *</label>
                  <select
                    value={editGender}
                    onChange={(e) => handleGenderChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-extrabold focus:ring-2 focus:ring-blue-500 focus:outline-none capitalize"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Non-Binary / Other</option>
                  </select>
                </div>
              </div>

              {/* Avatar Selector Gallery */}
              <div>
                <label className="block font-extrabold text-slate-800 mb-2 capitalize">Select Avatar ({editGender})</label>
                <div className="grid grid-cols-5 gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  {avatarPresets[editGender]?.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setEditPic(url)}
                      className={`relative rounded-2xl overflow-hidden border-2 transition-all ${
                        editPic === url ? "border-blue-600 ring-2 ring-blue-500/40 scale-105" : "border-transparent opacity-75 hover:opacity-100"
                      }`}
                    >
                      <img src={url} alt={`Avatar ${idx}`} className="w-14 h-14 object-cover" />
                      {editPic === url && (
                        <div className="absolute inset-0 bg-blue-600/30 flex items-center justify-center text-white">
                          <Check className="w-5 h-5 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Custom Image Avatar URL (Optional)</label>
                <input
                  type="url"
                  value={editPic}
                  onChange={(e) => setEditPic(e.target.value)}
                  placeholder="https://api.dicebear.com/7.x/lorelei/svg?seed=MyAvatar"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Section 2: City, Location & Profession */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-extrabold text-slate-800 mb-1">City</label>
                  <input
                    type="text"
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    placeholder="e.g. New York, Madrid, Tokyo"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-extrabold text-slate-800 mb-1">Country / Region</label>
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    placeholder="e.g. USA, Spain, Japan"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-extrabold text-slate-800 mb-1">Profession / Role</label>
                  <input
                    type="text"
                    value={editProfession}
                    onChange={(e) => setEditProfession(e.target.value)}
                    placeholder="e.g. Frontend Engineer, UX Designer"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Section 3: Education Details */}
              <div className="space-y-2 bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                <span className="font-extrabold text-blue-900 block text-xs">Education Details</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Degree / Specialization</label>
                    <input
                      type="text"
                      value={editEduDegree}
                      onChange={(e) => setEditEduDegree(e.target.value)}
                      placeholder="e.g. B.S. Computer Science"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Institute / University</label>
                    <input
                      type="text"
                      value={editEduInstitute}
                      onChange={(e) => setEditEduInstitute(e.target.value)}
                      placeholder="e.g. Stanford University"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Graduation Year</label>
                    <input
                      type="text"
                      value={editEduYear}
                      onChange={(e) => setEditEduYear(e.target.value)}
                      placeholder="e.g. 2024"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Social & Portfolio Links */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-extrabold text-slate-800 mb-1">GitHub Link</label>
                  <input
                    type="url"
                    value={editGithub}
                    onChange={(e) => setEditGithub(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block font-extrabold text-slate-800 mb-1">LinkedIn Link</label>
                  <input
                    type="url"
                    value={editLinkedin}
                    onChange={(e) => setEditLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block font-extrabold text-slate-800 mb-1">Portfolio Link</label>
                  <input
                    type="url"
                    value={editPortfolio}
                    onChange={(e) => setEditPortfolio(e.target.value)}
                    placeholder="https://yourportfolio.com"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Bio & Availability */}
              <div>
                <label className="block font-extrabold text-slate-800 mb-1">Availability Schedule</label>
                <input
                  type="text"
                  value={editAvailability}
                  onChange={(e) => setEditAvailability(e.target.value)}
                  placeholder="e.g. Weekdays after 6 PM EST, Weekends"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block font-extrabold text-slate-800 mb-1">Bio / Introduction</label>
                <textarea
                  rows="3"
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Describe your practical experience, hobbies, and why you love reciprocal barter learning..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-5 py-2.5 font-bold text-slate-600 rounded-xl hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 font-extrabold bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md transition-all"
                >
                  Save Profile Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Skill Modal */}
      {isAddingSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">
              Add Skill to {skillType === "offered" ? "Teaching List" : "Learning Goals"}
            </h3>

            <form onSubmit={handleAddSkill} className="space-y-4 text-xs">
              
              {!isCreatingNewSkill ? (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Select Skill from Catalog</label>
                  <select
                    value={selectedSkillId}
                    onChange={(e) => setSelectedSkillId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold"
                  >
                    <option value="">-- Choose a skill --</option>
                    {allMasterSkills.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.category})
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => setIsCreatingNewSkill(true)}
                    className="text-xs text-blue-600 font-bold hover:underline mt-2 inline-block"
                  >
                    + Can't find your skill? Add custom skill
                  </button>
                </div>
              ) : (
                <div className="space-y-3 bg-blue-50/60 p-4 rounded-2xl border border-blue-200/60">
                  <span className="font-extrabold text-blue-900 block text-xs">Create Custom Skill</span>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Skill Name</label>
                    <input
                      type="text"
                      value={newSkillName}
                      onChange={(e) => setNewSkillName(e.target.value)}
                      placeholder="e.g. Flutter, Violin, Public Speaking"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Category</label>
                    <select
                      value={newSkillCategory}
                      onChange={(e) => setNewSkillCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold"
                    >
                      <option value="Technology & Programming">Technology & Programming</option>
                      <option value="Design & Creative">Design & Creative</option>
                      <option value="Languages">Languages</option>
                      <option value="Business & Marketing">Business & Marketing</option>
                      <option value="Music & Audio">Music & Audio</option>
                      <option value="Personal Development">Personal Development</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsCreatingNewSkill(false)}
                    className="text-xs text-slate-500 font-bold hover:underline"
                  >
                    ← Back to catalog list
                  </button>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Proficiency Level</label>
                <select
                  value={expLevel}
                  onChange={(e) => setExpLevel(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingSkill(false);
                    setIsCreatingNewSkill(false);
                  }}
                  className="px-4 py-2 font-bold text-slate-600 rounded-xl hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md"
                >
                  Add Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
