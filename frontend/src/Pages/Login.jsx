import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  LogIn, 
  AlertCircle, 
  Loader2, 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  Video, 
  Repeat, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock,
  Star,
  Users
} from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(identifier, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (demoEmail, demoPass) => {
    setIdentifier(demoEmail);
    setPassword(demoPass);
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#faf8f4] text-slate-900 flex flex-col lg:flex-row font-sans relative">
      
      {/* ============================================================== */}
      {/* LEFT HALF: APPLICATION SHOWCASE & PICTURES (Desktop 50%) */}
      {/* ============================================================== */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden min-h-[420px] lg:min-h-screen">
        
        {/* Ambient Glows */}
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

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
            <span>100% Free Barter</span>
          </span>
        </div>

        {/* Center Visual Showcase: 1-on-1 Exchange Composition with Application Images */}
        <div className="relative z-10 py-6 sm:py-8 my-auto space-y-6 max-w-lg mx-auto w-full">
          
          {/* Swapper Duo Visual Frame */}
          <div className="relative bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 shadow-2xl">
            
            {/* Top pill inside card */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
              <span className="flex items-center gap-1.5 text-blue-300 font-extrabold">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Live 1-on-1 Exchange</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                99.4% Match Precision
              </span>
            </div>

            {/* Application Pictures: Boy & Girl learners with exchange flow */}
            <div className="grid grid-cols-12 items-center gap-2 pt-4">
              
              {/* Left Learner: Boy (Tech) */}
              <div className="col-span-5 flex flex-col items-center text-center space-y-2">
                <div className="relative">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden ring-2 ring-blue-400/50 bg-gradient-to-b from-blue-100 to-white shadow-lg flex items-center justify-center">
                    <img 
                      src="/hero/boy-clean.png" 
                      alt="Tech Learner" 
                      className="w-full h-full object-cover object-top hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 bg-blue-600 text-white text-[8px] font-black rounded-md uppercase">
                    Tech
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">Aarav Sharma</h4>
                  <p className="text-[10px] text-emerald-400 font-extrabold">Teaches: React.js</p>
                  <p className="text-[10px] text-blue-300 font-semibold">Wants: UI/UX Design</p>
                </div>
              </div>

              {/* Center Barter Node */}
              <div className="col-span-2 flex flex-col items-center justify-center">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-md animate-pulse">
                  <Repeat className="w-4 h-4" />
                </div>
                <span className="text-[9px] uppercase font-black text-amber-300 mt-1">1:1 Barter</span>
              </div>

              {/* Right Learner: Girl (Design) */}
              <div className="col-span-5 flex flex-col items-center text-center space-y-2">
                <div className="relative">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden ring-2 ring-purple-400/50 bg-gradient-to-b from-purple-100 to-white shadow-lg flex items-center justify-center">
                    <img 
                      src="/hero/girl-clean.png" 
                      alt="Design Learner" 
                      className="w-full h-full object-cover object-top hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 bg-purple-600 text-white text-[8px] font-black rounded-md uppercase">
                    Design
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">Ananya Iyer</h4>
                  <p className="text-[10px] text-emerald-400 font-extrabold">Teaches: UI/UX & Figma</p>
                  <p className="text-[10px] text-blue-300 font-semibold">Wants: React & Cloud</p>
                </div>
              </div>

            </div>

            {/* Live Session Feature Highlights */}
            <div className="grid grid-cols-3 gap-2 pt-4 mt-3 border-t border-white/10 text-center text-[10px] font-bold">
              <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                <span className="block text-amber-300 font-black">Zero Fees</span>
                <span className="text-slate-400">Pure Barter</span>
              </div>
              <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                <span className="block text-emerald-300 font-black">HD Video</span>
                <span className="text-slate-400">Live Sandbox</span>
              </div>
              <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                <span className="block text-cyan-300 font-black">All Domains</span>
                <span className="text-slate-400">Curated Skills</span>
              </div>
            </div>

          </div>

          {/* Social Proof Quote */}
          <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/10 backdrop-blur-xs">
            <div className="flex items-center text-amber-400 shrink-0">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
            <p className="text-[11px] text-slate-300 font-medium">
              "I traded 30 mins of Python for 30 mins of Figma. Learned more in 2 sessions than in months of video tutorials!"
            </p>
          </div>

        </div>

        {/* Bottom Metrics Bar */}
        <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="font-semibold">Join 1,200+ verified co-learners</span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            SkillSwap Network © {new Date().getFullYear()}
          </span>
        </div>

      </div>

      {/* ============================================================== */}
      {/* RIGHT HALF: CLEAN AUTHENTICATION FORM (Desktop 50%) */}
      {/* ============================================================== */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-16">
        
        <div className="max-w-md w-full space-y-6">
          
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
              Welcome Back
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Sign in to manage your 1-on-1 skill exchange proposals, live video sessions, and co-learning chats.
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
            
            {/* Email or Username */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                Email Address or Full Name
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. user@gmail.com or Aarav Sharma"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all shadow-2xs"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  Password
                </label>
                <Link to="/faq" className="text-xs font-bold text-blue-600 hover:underline">
                  Need help?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl text-xs sm:text-sm font-black shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 cursor-pointer min-h-[46px]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In to Dashboard</span>
                </>
              )}
            </button>

          </form>

          {/* Quick Demo Credentials Fill (Optional Convenience) */}
          <div className="pt-2 border-t border-slate-200/80">
            <span className="block text-center text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Quick Test Accounts
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleFillDemo("aarav.sharma@example.com", "password123")}
                className="p-2.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-bold rounded-xl border border-slate-200 transition-colors text-center cursor-pointer"
              >
                ⚡ Fill Aarav (Tech)
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo("ananya.iyer@example.com", "password123")}
                className="p-2.5 bg-slate-100 hover:bg-purple-50 hover:text-purple-700 text-slate-700 font-bold rounded-xl border border-slate-200 transition-colors text-center cursor-pointer"
              >
                ⚡ Fill Ananya (UI/UX)
              </button>
            </div>
          </div>

          {/* Sign Up Redirect */}
          <div className="text-center pt-2">
            <p className="text-xs text-slate-500 font-medium">
              Don't have an account yet?{" "}
              <Link to="/register" className="font-black text-blue-600 hover:underline">
                Create Free Account →
              </Link>
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
