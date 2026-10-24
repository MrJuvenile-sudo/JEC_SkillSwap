import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  UserPlus, 
  AlertCircle, 
  Loader2, 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  Repeat, 
  Video, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Briefcase, 
  MapPin,
  Star
} from "lucide-react";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [gender, setGender] = useState("male");
  const [city, setCity] = useState("");
  const [profession, setProfession] = useState("");
  const [bio, setBio] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await register({ 
        name, 
        email, 
        password, 
        gender, 
        location: city, 
        city,
        profession,
        bio 
      });
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f4] text-slate-900 flex flex-col lg:flex-row font-sans relative">
      
      {/* ============================================================== */}
      {/* LEFT HALF: APPLICATION SHOWCASE & PICTURES (Desktop 50%) */}
      {/* ============================================================== */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden min-h-[460px] lg:min-h-screen">
        
        {/* Ambient Glows */}
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

        {/* Top Header Branding */}
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <img 
              src="/logo.png" 
              alt="SkillSwap Logo" 
              className="w-10 h-10 object-contain rounded-xl shadow-md group-hover:scale-105 transition-transform" 
            />
            <div className="flex flex-col">
              <span className="text-xl font-black text-white leading-none">SkillSwap</span>
              <span className="text-[10px] text-blue-400 font-extrabold uppercase tracking-wider mt-0.5">Peer Learning Network</span>
            </div>
          </Link>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-300 border border-emerald-400/20 text-xs font-extrabold backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Zero Subscription Fees</span>
          </span>
        </div>

        {/* Center Visual Showcase: Application Characters & Co-Learning Benefits */}
        <div className="relative z-10 py-6 sm:py-8 my-auto space-y-6 max-w-lg mx-auto w-full">
          
          {/* Main Showcase Card */}
          <div className="relative bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 shadow-2xl space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
              <span className="flex items-center gap-1.5 text-blue-300 font-black">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Join Global Co-Learners</span>
              </span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                50+ Domains • 80+ Skills
              </span>
            </div>

            {/* Application Visual: Dual Learners with Barter Flow */}
            <div className="grid grid-cols-12 items-center gap-3 pt-2">
              
              <div className="col-span-5 flex flex-col items-center text-center space-y-2">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden ring-2 ring-emerald-400/50 bg-gradient-to-b from-emerald-100 to-white shadow-lg flex items-center justify-center">
                  <img 
                    src="/hero/girl-clean.png" 
                    alt="Design & UI/UX" 
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">Creative Track</h4>
                  <p className="text-[10px] text-emerald-400 font-bold">UI/UX, Figma, Brand</p>
                </div>
              </div>

              <div className="col-span-2 flex flex-col items-center justify-center">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md animate-pulse">
                  <Repeat className="w-4 h-4" />
                </div>
                <span className="text-[9px] uppercase font-black text-emerald-300 mt-1">Reciprocal</span>
              </div>

              <div className="col-span-5 flex flex-col items-center text-center space-y-2">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden ring-2 ring-blue-400/50 bg-gradient-to-b from-blue-100 to-white shadow-lg flex items-center justify-center">
                  <img 
                    src="/hero/boy-clean.png" 
                    alt="Technology & Code" 
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">Engineering Track</h4>
                  <p className="text-[10px] text-blue-300 font-bold">Fullstack, AI, Cloud</p>
                </div>
              </div>

            </div>

            {/* 3 Value Pillars */}
            <div className="space-y-2.5 pt-2 text-xs">
              <div className="flex items-center gap-2.5 bg-white/5 p-2.5 rounded-xl border border-white/5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-200 font-semibold">100% Free Peer Barter — Trade your skills instead of money</span>
              </div>
              <div className="flex items-center gap-2.5 bg-white/5 p-2.5 rounded-xl border border-white/5">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="text-slate-200 font-semibold">Mutual 1-on-1 Matching with complementary syllabus goals</span>
              </div>
              <div className="flex items-center gap-2.5 bg-white/5 p-2.5 rounded-xl border border-white/5">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="text-slate-200 font-semibold">Integrated HD Video Room, Markdown Notes & Code Sandbox</span>
              </div>
            </div>

          </div>

          {/* Testimonial preview */}
          <div className="flex items-center gap-3 bg-white/5 p-3.5 rounded-2xl border border-white/10 backdrop-blur-xs">
            <div className="w-10 h-10 rounded-full bg-blue-600/30 flex items-center justify-center text-blue-300 font-black text-sm shrink-0">
              99%
            </div>
            <p className="text-[11px] text-slate-300 font-medium">
              "Found a study partner for DSA in 5 minutes. We meet twice a week and teach each other. Highly recommended!"
            </p>
          </div>

        </div>

        {/* Bottom Metrics Bar */}
        <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold">Zero Credit Card Required</span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            SkillSwap Network © {new Date().getFullYear()}
          </span>
        </div>

      </div>

      {/* ============================================================== */}
      {/* RIGHT HALF: CLEAN REGISTRATION FORM (Desktop 50%) */}
      {/* ============================================================== */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-16 overflow-y-auto">
        
        <div className="max-w-lg w-full space-y-6 py-4">
          
          {/* Back link */}
          <div>
            <Link 
              to="/" 
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to SkillSwap Home</span>
            </Link>
          </div>

          {/* Form Header */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight">
              Create Your Account
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Join thousands of developers, designers, and students in free 1-on-1 reciprocal skill exchanges.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-bold flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Row 1: Full Name & Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-8 space-y-1.5">
                <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all shadow-2xs"
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-4 space-y-1.5">
                <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  Avatar Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3 py-3 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all shadow-2xs capitalize"
                >
                  <option value="male">Male 👦</option>
                  <option value="female">Female 👧</option>
                </select>
              </div>
            </div>

            {/* Row 2: Email Address */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all shadow-2xs"
                  required
                />
              </div>
            </div>

            {/* Row 3: Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password (min 6 characters)"
                  className="w-full pl-11 pr-11 py-3 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all shadow-2xs"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Row 4: Profession & City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  Profession / Role
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                  <input
                    type="text"
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    placeholder="e.g. MCA Student, UI Designer"
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all shadow-2xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  Location / City
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Bengaluru, Remote"
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all shadow-2xs"
                  />
                </div>
              </div>
            </div>

            {/* Row 5: Bio / Learning Goal */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Quick Bio & Learning Goal
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={2}
                placeholder="What skills can you teach, and what topics are you eager to learn next?"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all shadow-2xs resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl text-xs sm:text-sm font-black shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 cursor-pointer min-h-[46px]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Get Started Free →</span>
                </>
              )}
            </button>

          </form>

          {/* Login Redirect */}
          <div className="text-center pt-2 border-t border-slate-200/80">
            <p className="text-xs text-slate-500 font-medium">
              Already have an account?{" "}
              <Link to="/login" className="font-black text-blue-600 hover:underline">
                Sign In to Dashboard →
              </Link>
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
