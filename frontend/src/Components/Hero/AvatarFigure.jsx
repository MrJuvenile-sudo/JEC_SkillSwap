import React, { useState } from "react";
import { CheckCircle2, Sparkles, Laptop, Tablet, Code, Palette, BookOpen, ArrowUpRight } from "lucide-react";

/**
 * AvatarFigure renders either the Boy (Tech, Left) or Girl (Creative, Right)
 * with photoreal assets, idle breathing animation, contact shadow, rim glow,
 * desktop mouse parallax, and an authentic glass profile chip with live arrival feedback.
 */
export default function AvatarFigure({
  variant = "tech",
  src,
  srcSet,
  alt,
  personName,
  personRole,
  isPaused = false,
  mouseOffset = { x: 0, y: 0 },
  currentTeaching = "",
  currentWanting = "",
  arrivalNotice = null,
  isArrivalGlow = false
}) {
  const isTech = variant === "tech";
  const [imgError, setImgError] = useState(false);

  // Asset paths
  const defaultSrc = isTech ? "/hero/boy-tech.webp" : "/hero/girl-creative.png";
  const imageSource = src || defaultSrc;
  const imageAlt = alt || (isTech ? "Tech partner teaching Machine Learning and Python" : "Creative partner teaching UI/UX Design and Spanish");

  React.useEffect(() => {
    setImgError(false);
  }, [imageSource]);

  // Profile data
  const profile = isTech
    ? {
        name: personName || "Aarav Sharma",
        handle: "@aarav.ml",
        role: personRole || "AI & ML Specialist",
        experience: "Ex-Intern • 24 yrs",
        accentGlow: "from-blue-500/25 via-indigo-500/15 to-transparent",
        glowRing: "border-blue-400/30",
        badgeColor: "bg-blue-50 text-blue-700 border-blue-200/80",
        icon: Laptop,
        defaultTeaching: "Machine Learning",
        defaultWanting: "UI/UX Design",
        skillsOffered: ["Machine Learning", "Python", "System Design"],
        skillsWanted: ["UI/UX Design", "Spanish"]
      }
    : {
        name: personName || "Ananya Iyer",
        handle: "@ananya.design",
        role: personRole || "Product & UI/UX Designer",
        experience: "Lead Freelance • 24 yrs",
        accentGlow: "from-violet-500/25 via-fuchsia-500/15 to-transparent",
        glowRing: "border-violet-400/30",
        badgeColor: "bg-violet-50 text-violet-700 border-violet-200/80",
        icon: Tablet,
        defaultTeaching: "UI/UX Design",
        defaultWanting: "Machine Learning",
        skillsOffered: ["UI/UX Design", "Digital Art", "Spanish"],
        skillsWanted: ["Machine Learning", "Python"]
      };

  const teachingDisplay = currentTeaching || profile.defaultTeaching;
  const wantingDisplay = currentWanting || profile.defaultWanting;

  // Parallax calculations (Desktop only, clamp to max ±6px for figure, ±12px for glow)
  const figureX = isPaused ? 0 : mouseOffset.x * 6;
  const figureY = isPaused ? 0 : mouseOffset.y * 6;
  const glowX = isPaused ? 0 : mouseOffset.x * 12;
  const glowY = isPaused ? 0 : mouseOffset.y * 12;

  return (
    <div className={`relative flex flex-col items-center select-none w-full max-w-[140px] sm:max-w-[160px] ${isTech ? 'items-center md:items-start' : 'items-center md:items-end'}`}>
      
      {/* 1. RIM LIGHT & BACKGROUND DEPTH GLOW */}
      <div
        className="absolute -top-4 -inset-x-4 h-32 sm:h-36 -z-10 pointer-events-none transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${glowX}px, ${glowY}px, 0)`
        }}
        aria-hidden="true"
      >
        <div
          className={`w-full h-full rounded-full blur-xl opacity-60 bg-gradient-to-b ${profile.accentGlow}`}
        />
      </div>

      {/* 2. AVATAR CONTAINER WITH IDLE BREATHING MOTION */}
      <div
        className="relative w-full aspect-[3/4] max-h-[115px] xs:max-h-[135px] sm:max-h-[155px] md:max-h-[175px] flex items-end justify-center transition-transform duration-200 ease-out"
        style={{
          transform: `translate3d(${figureX}px, ${figureY}px, 0)`
        }}
      >
        {/* Subtle Idle Breathing Animation wrapper */}
        <div
          className={`relative w-full h-full flex items-end justify-center ${
            !isPaused ? (isTech ? "animate-boy-breathe" : "animate-girl-breathe") : ""
          }`}
          style={{ transformOrigin: "bottom center" }}
        >
          {/* Photoreal WebP portrait with fallback */}
          {!imgError ? (
            <img
              src={imageSource}
              srcSet={srcSet || `${imageSource} 1x`}
              alt={imageAlt}
              width="180"
              height="240"
              fetchpriority={isTech ? "high" : "auto"}
              decoding="async"
              loading="eager"
              onError={() => setImgError(true)}
              className="relative z-10 w-full h-full object-contain object-bottom drop-shadow-[0_6px_12px_rgba(0,0,0,0.12)] pointer-events-none"
            />
          ) : (
            /* High-fidelity layered SVG fallback if image is missing */
            <div className="relative z-10 w-full h-full flex items-end justify-center">
              <svg
                viewBox="0 0 320 400"
                className="w-full h-full max-h-[155px] drop-shadow-md"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id={`grad-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={isTech ? "#2563eb" : "#7c3aed"} />
                    <stop offset="100%" stopColor={isTech ? "#1d4ed8" : "#9333ea"} />
                  </linearGradient>
                  <radialGradient id={`glow-${variant}`} cx="50%" cy="40%" r="60%">
                    <stop offset="0%" stopColor={isTech ? "rgba(99,102,241,0.4)" : "rgba(192,132,252,0.4)"} />
                    <stop offset="100%" stopColor="transparent" />
                  </radialGradient>
                </defs>
                <circle cx="160" cy="180" r="140" fill={`url(#glow-${variant})`} />
                {/* Torso & garment */}
                <path
                  d={isTech ? "M80 400 C80 270, 100 240, 160 240 C220 240, 240 270, 240 400 Z" : "M90 400 C90 280, 110 245, 160 245 C210 245, 230 280, 230 400 Z"}
                  fill={isTech ? "#1e293b" : "#4c1d95"}
                />
                {/* Neck & Face */}
                <rect x="145" y="190" width="30" height="35" rx="10" fill="#fbcfe8" />
                <ellipse cx="160" cy="160" rx="42" ry="52" fill="#fed7aa" />
                {/* Hair */}
                <path
                  d={isTech ? "M118 150 C118 105, 202 105, 202 150 C190 120, 130 120, 118 150 Z" : "M110 160 C110 95, 210 95, 210 160 C210 210, 200 240, 195 240 C190 190, 130 190, 125 240 C120 240, 110 210, 110 160 Z"}
                  fill="#18181b"
                />
                {/* Device */}
                <g transform="translate(110, 290)">
                  <rect x="0" y="0" width="100" height="60" rx="6" fill="#334155" stroke="#94a3b8" strokeWidth="2" />
                  <rect x="10" y="8" width="80" height="44" rx="3" fill="#0f172a" />
                  <circle cx="50" cy="30" r="12" fill={isTech ? "#3b82f6" : "#ec4899"} opacity="0.8" />
                </g>
              </svg>
            </div>
          )}

          {/* Contact Shadow Under Figure */}
          <div
            className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-20 sm:w-28 h-2.5 bg-slate-900/15 rounded-full blur-xs -z-1 pointer-events-none"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* 3. GLASS PROFILE CHIP & ARRIVAL NOTIFICATION */}
      <div className="relative w-full mt-1 sm:mt-1.5 z-20">
        
        {/* Floating Arrival Feedback Toast */}
        {arrivalNotice && (
          <div
            className={`absolute -top-6 sm:-top-7 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 px-2 sm:px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[8px] sm:text-[10px] font-black tracking-wide shadow-md shadow-emerald-500/30 transition-all duration-300 animate-bounce pointer-events-none whitespace-nowrap`}
          >
            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-200 shrink-0" />
            <span>+ Received: {arrivalNotice} ✓</span>
          </div>
        )}

        {/* Real HTML Glass Card (Compact & Sleek) */}
        <div
          className={`backdrop-blur-md bg-white/95 rounded-lg sm:rounded-xl p-1.5 sm:p-2 border shadow-xs transition-all duration-500 ${
            isArrivalGlow
              ? "ring-2 ring-emerald-500 shadow-[0_0_16px_rgba(16,185,129,0.3)] border-emerald-300 scale-[1.02]"
              : "border-slate-200/90 shadow-slate-900/5 hover:border-slate-300"
          }`}
        >
          {/* Header Row: Identity & Status */}
          <div className="flex items-center justify-between gap-1 pb-0.5 sm:pb-1 border-b border-slate-100">
            <div className="flex items-center gap-1 min-w-0">
              <span className="text-[10px] sm:text-[11px] font-black text-slate-900 leading-tight truncate">
                {profile.name}
              </span>
              <CheckCircle2 className="w-2.5 h-2.5 text-blue-600 fill-blue-50 shrink-0" />
            </div>
            <div className="flex items-center gap-0.5 sm:gap-1 text-[7px] sm:text-[8px] font-bold text-emerald-700 shrink-0">
              <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Online</span>
            </div>
          </div>

          {/* Barter Declarations */}
          <div className="mt-1 space-y-0.5 text-left">
            <div className="flex items-center gap-1 min-w-0">
              <span className="uppercase text-[7px] sm:text-[8px] font-black tracking-wider text-slate-400 shrink-0 w-6 sm:w-8">
                Teach:
              </span>
              <span className="inline-flex items-center gap-0.5 px-1 sm:px-1.5 py-0.2 rounded bg-blue-50/90 border border-blue-200/80 text-blue-700 text-[8px] sm:text-[9px] font-bold truncate max-w-[65px] xs:max-w-[85px] sm:max-w-none">
                <Sparkles className="w-2 h-2 text-blue-500 shrink-0" />
                <span className="truncate">{teachingDisplay}</span>
              </span>
            </div>

            <div className="flex items-center gap-1 min-w-0">
              <span className="uppercase text-[7px] sm:text-[8px] font-black tracking-wider text-slate-400 shrink-0 w-6 sm:w-8">
                Want:
              </span>
              <span className="inline-flex items-center gap-0.5 px-1 sm:px-1.5 py-0.2 rounded bg-amber-50/90 border border-amber-200/80 text-amber-800 text-[8px] sm:text-[9px] font-bold truncate max-w-[65px] xs:max-w-[85px] sm:max-w-none">
                <ArrowUpRight className="w-2 h-2 text-amber-600 shrink-0" />
                <span className="truncate">{wantingDisplay}</span>
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
