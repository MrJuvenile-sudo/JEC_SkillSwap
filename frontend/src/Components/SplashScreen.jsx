import React, { useState, useEffect } from "react";
import { ShieldCheck, Sparkles } from "lucide-react";

export default function SplashScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Ultra-smooth progress line over 1.8s
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 45);

    // Trigger smooth fade-out at 1.9s
    const timer = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        if (onFinish) onFinish();
      }, 500);
    }, 1900);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#fdfbf7] text-slate-900 transition-all duration-500 ease-in-out ${
        isFadingOut ? "opacity-0 scale-102 pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
      {/* Subtle Radial Ambient Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center text-center space-y-5 max-w-sm px-6">
        
        {/* Sleek Professional Logo Card */}
        <div className="relative">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-2xl p-4 shadow-xl border border-slate-200/80 flex items-center justify-center transition-all duration-500">
            <img
              src="/logo.png"
              alt="SkillSwap Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="absolute -bottom-1 -right-1 p-1.5 rounded-xl bg-blue-600 text-white shadow-md border border-white">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
          </span>
        </div>

        {/* Clean Typography */}
        <div className="space-y-1 pt-1">
          <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-slate-900 leading-tight">
            SkillSwap
          </h1>
          <p className="text-[11px] font-extrabold text-blue-600 uppercase tracking-widest flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>1-on-1 Peer Skill Exchange Network</span>
          </p>
        </div>

        {/* Ultra-Fine Minimalist Progress Bar (No clutter/numbers) */}
        <div className="w-48 pt-3">
          <div className="h-1 w-full bg-slate-200/70 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 rounded-full transition-all duration-75 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

      </div>

      <div className="absolute bottom-8 text-[10px] font-extrabold text-slate-400 tracking-widest uppercase">
        Peer-to-Peer 1-on-1 Knowledge Exchange
      </div>
    </div>
  );
}
