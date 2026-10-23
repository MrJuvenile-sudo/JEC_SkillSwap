import React, { useState } from "react";
import { CheckCircle2, Sparkles, Check, MapPin, Laptop, Tablet, ArrowUpRight } from "lucide-react";

/**
 * AvatarFigure renders either the Boy (Aarav Sharma) or Girl (Ananya Iyer)
 * inside an authentic pastel arch frame, with playful energy spark bursts,
 * laptop workspace photo, contact shadow, and a glass profile chip
 * matching the user's reference mockup.
 */
export default function AvatarFigure({
  variant = "tech",
  src,
  srcSet,
  alt,
  personName,
  personRole,
  personLocation,
  isPaused = false,
  mouseOffset = { x: 0, y: 0 },
  currentTeaching = "",
  currentWanting = "",
  arrivalNotice = null,
  isArrivalGlow = false
}) {
  const isTech = variant === "tech";
  const [imgError, setImgError] = useState(false);

  // Asset paths (default to the clean crops from the user's reference mockup)
  const defaultSrc = isTech ? "/hero/boy-clean.png" : "/hero/girl-clean.png";
  const imageSource = src || defaultSrc;
  const imageAlt = alt || (isTech ? "Aarav Sharma teaching Tech skills" : "Ananya Iyer teaching Creative skills");

  React.useEffect(() => {
    setImgError(false);
  }, [imageSource]);

  // Skill alignment: Aarav teaches React & Node.js, wants UI/UX Design
  // Ananya teaches UI/UX Design, wants React & Node.js
  const primaryTeach = currentTeaching 
    ? currentTeaching.replace(/^Teach\s+/i, "") 
    : (isTech ? "React & Node.js" : "UI/UX Design");

  const primaryWant = currentWanting 
    ? currentWanting.replace(/^Learn\s+/i, "") 
    : (isTech ? "UI/UX Design" : "React & Node.js");

  const profile = isTech
    ? {
        name: personName || "Aarav Sharma",
        location: personLocation || "Jabalpur, India",
        role: personRole || "Full-Stack Developer",
        archGradient: "from-indigo-100/90 via-purple-50/60 to-blue-50/40 border-indigo-100/90",
        sparkColor: "text-blue-500",
        teachSkills: [primaryTeach],
        wantSkills: [primaryWant]
      }
    : {
        name: personName || "Ananya Iyer",
        location: personLocation || "Bangalore, India",
        role: personRole || "UI/UX & Product Design",
        archGradient: "from-orange-100/90 via-rose-50/60 to-pink-50/40 border-orange-100/90",
        sparkColor: "text-amber-500",
        teachSkills: [primaryTeach],
        wantSkills: [primaryWant]
      };

  // Parallax calculations (Desktop only, clamped)
  const figureX = isPaused ? 0 : mouseOffset.x * 5;
  const figureY = isPaused ? 0 : mouseOffset.y * 5;

  return (
    <div className={`relative flex flex-col items-center select-none w-full max-w-[150px] xs:max-w-[195px] sm:max-w-[240px] md:max-w-[260px]`}>
      
      {/* 1. ARCH FRAME & PERSON CONTAINER */}
      <div
        className="relative w-full transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${figureX}px, ${figureY}px, 0)`
        }}
      >
        
        {/* Playful Hand-Drawn Radiant Energy Spark Lines \ | / around Head */}
        {/* Left spark burst */}
        <div className={`absolute -top-1 sm:top-1 -left-1 sm:-left-3 pointer-events-none z-20 ${profile.sparkColor} animate-spark-pulse`}>
          <svg viewBox="0 0 36 36" className="w-4 h-4 sm:w-7 sm:h-7" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round">
            <path d="M 8 8 L 20 18" />
            <path d="M 4 22 L 18 24" />
            <path d="M 9 32 L 20 26" />
          </svg>
        </div>

        {/* Right spark burst */}
        <div className={`absolute top-2 sm:top-4 -right-1 sm:-right-3 pointer-events-none z-20 ${profile.sparkColor} animate-spark-pulse`} style={{ animationDelay: "0.6s" }}>
          <svg viewBox="0 0 36 36" className="w-4 h-4 sm:w-7 sm:h-7" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round">
            <path d="M 28 8 L 16 18" />
            <path d="M 32 22 L 18 24" />
            <path d="M 27 32 L 16 26" />
          </svg>
        </div>

        {/* Arch Shaped Portrait Card */}
        <div className={`relative w-full aspect-[4/3.1] rounded-t-[20px] xs:rounded-t-[28px] sm:rounded-t-[38px] bg-gradient-to-b ${profile.archGradient} border shadow-xs overflow-hidden flex items-end justify-center pt-1.5 xs:pt-2`}>
          
          {/* Subtle Ambient Glow inside arch */}
          <div className="absolute top-0 inset-x-0 h-16 bg-white/40 blur-md pointer-events-none" />

          {/* Photo with lifelike breathing animation */}
          <div className={`relative w-full h-full flex items-end justify-center ${!isPaused ? (isTech ? "animate-boy-breathe" : "animate-girl-breathe") : ""}`}>
            {!imgError ? (
              <img
                src={imageSource}
                srcSet={srcSet || `${imageSource} 1x`}
                alt={imageAlt}
                width="220"
                height="170"
                fetchPriority={isTech ? "high" : "auto"}
                decoding="async"
                loading="eager"
                onError={() => {
                  if (imageSource !== (isTech ? "/hero/boy-tech.webp" : "/hero/girl-creative.png")) {
                    setImgError(false);
                  } else {
                    setImgError(true);
                  }
                }}
                className="relative z-10 w-full h-full object-cover object-bottom pointer-events-none"
              />
            ) : (
              <div className="relative z-10 w-full h-full flex items-end justify-center bg-slate-100">
                <span className="text-[10px] xs:text-xs font-bold text-slate-400 mb-4">{profile.name}</span>
              </div>
            )}
          </div>

          {/* Soft contact shadow at desk level */}
          <div className="absolute bottom-0 inset-x-0 h-2 bg-gradient-to-t from-black/15 to-transparent pointer-events-none" />
        </div>

      </div>

      {/* 2. GLASS PROFILE CHIP WITH TEACH & WANT ROWS (EXACT TO MOCKUP) */}
      <div className="relative w-full -mt-2 sm:-mt-3 z-30 px-0.5">
        
        {/* Floating Arrival Feedback Toast */}
        {arrivalNotice && (
          <div
            className="absolute -top-7 sm:-top-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[8px] xs:text-[9px] sm:text-[10px] font-black tracking-wide shadow-md shadow-emerald-500/30 transition-all duration-300 animate-bounce pointer-events-none whitespace-nowrap"
          >
            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-200 shrink-0" />
            <span>+ Received: {arrivalNotice} ✓</span>
          </div>
        )}

        {/* Real Profile Card */}
        <div
          className={`backdrop-blur-md bg-white rounded-xl sm:rounded-2xl p-1.5 xs:p-2 sm:p-2.5 border shadow-md transition-all duration-500 text-left ${
            isArrivalGlow
              ? "ring-2 ring-emerald-500 shadow-[0_0_18px_rgba(16,185,129,0.35)] border-emerald-300 scale-[1.02]"
              : "border-slate-200/90 shadow-slate-900/5 hover:border-slate-300"
          }`}
        >
          {/* Header Row: Name, Verified Badge & Online Status */}
          <div className="flex items-center justify-between gap-1 pb-1 border-b border-slate-100">
            <div className="flex items-center gap-1 min-w-0">
              <span className="text-[9.5px] xs:text-[11px] sm:text-[12px] font-black text-slate-900 leading-tight truncate">
                {profile.name}
              </span>
              <CheckCircle2 className="w-2.5 h-2.5 xs:w-3 xs:h-3 text-blue-600 fill-blue-600 text-white shrink-0" />
            </div>
            
            {/* Online Indicator */}
            <div className="flex items-center gap-0.5 xs:gap-1 text-[7px] xs:text-[8px] sm:text-[9px] font-bold text-emerald-600 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Online</span>
            </div>
          </div>

          {/* Location row */}
          <div className="flex items-center gap-1 text-[7px] xs:text-[8px] sm:text-[9px] text-slate-500 font-semibold pt-0.5 pb-0.5 truncate">
            <MapPin className="w-2 h-2 xs:w-2.5 xs:h-2.5 text-slate-400 shrink-0" />
            <span className="truncate">{profile.location}</span>
          </div>

          {/* TEACH Row */}
          <div className="flex items-center gap-1 pt-0.5">
            <span className="uppercase text-[6.5px] xs:text-[7.5px] sm:text-[8px] font-black tracking-wider text-slate-400 shrink-0 w-6 xs:w-7 sm:w-8">
              TEACH:
            </span>
            <div className="flex flex-wrap items-center gap-0.5 xs:gap-1 min-w-0">
              {profile.teachSkills.map((sk, i) => {
                const isPrimary = i === 0 || (sk.toLowerCase() === currentTeaching.toLowerCase());
                return (
                  <span
                    key={i}
                    className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[7.5px] xs:text-[8px] sm:text-[9px] font-bold ${
                      isPrimary
                        ? "bg-blue-50 text-blue-700 border border-blue-200/90"
                        : "bg-blue-50/70 text-blue-700/90"
                    }`}
                  >
                    {isPrimary && <Check className="w-2 h-2 text-blue-500 shrink-0" />}
                    <span className="truncate">{sk}</span>
                  </span>
                );
              })}
            </div>
          </div>

          {/* WANT Row */}
          <div className="flex items-center gap-1 pt-1">
            <span className="uppercase text-[6.5px] xs:text-[7.5px] sm:text-[8px] font-black tracking-wider text-slate-400 shrink-0 w-6 xs:w-7 sm:w-8">
              WANT:
            </span>
            <div className="flex flex-wrap items-center gap-0.5 xs:gap-1 min-w-0">
              {profile.wantSkills.map((sk, i) => {
                const isMatch = sk.toLowerCase() === currentWanting.toLowerCase();
                return (
                  <span
                    key={i}
                    className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[7.5px] xs:text-[8px] sm:text-[9px] font-bold ${
                      isMatch
                        ? "bg-amber-100/90 text-amber-900 border border-amber-300 font-extrabold"
                        : "bg-amber-50 text-amber-800 border border-amber-200/60"
                    }`}
                  >
                    <span className="truncate">{sk}</span>
                  </span>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
