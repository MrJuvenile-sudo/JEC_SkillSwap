import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Repeat, LogIn, AlertCircle, Loader2, UserCheck, Zap } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
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
      setError(err.response?.data?.message || "Invalid Email/Name or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Soft Light Cream Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200/90 shadow-2xl space-y-6 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <img 
              src="/logo.png" 
              alt="SkillSwap Logo" 
              className="w-11 h-11 object-contain rounded-2xl shadow-md" 
            />
            <span className="text-2xl font-black text-slate-900">SkillSwap</span>
          </Link>
          <h2 className="text-xl font-extrabold text-slate-900 pt-2">Welcome Back</h2>
          <p className="text-xs text-slate-500 font-medium">Sign in to manage your skill exchange proposals</p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address or Full Name
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. user@gmail.com or Your Name"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-2xl text-xs font-black shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
            <span>Sign In to Dashboard</span>
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 pt-2 font-medium">
          Don't have an account?{" "}
          <Link to="/register" className="font-extrabold text-indigo-600 hover:underline">
            Register here
          </Link>
        </p>

      </div>
    </div>
  );
}
