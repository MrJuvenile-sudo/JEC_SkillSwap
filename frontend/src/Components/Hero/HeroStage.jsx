import React, { useState, useEffect, useRef, useCallback } from "react";
import { Users, Sparkles } from "lucide-react";
import AvatarFigure from "./AvatarFigure";
import SwapNode from "./SwapNode";
import SkillOrbStream, { SKILL_PAIRS } from "./SkillOrbStream";

/**
 * HeroStage orchestrates the complete 1-on-1 reciprocal skill barter stage:
 * - Top Pills: Verified Peer-to-Peer Learning Network & AI-Powered Skill Matching
 * - Left Flank: "Share Your Skills" doodle & React, JS, Node.js floating badges
 * - Left Zone: Boy (Aarav Sharma) with arch, spark lines, & profile chip
 * - Center Zone: SkillSwap broker node with ⚡ badge, 92% Match, and animated dashed arcs
 * - Right Zone: Girl (Ananya Iyer) with arch, spark lines, & profile chip
 * - Right Flank: "Learn New Skills" doodle & UI/UX, Figma, Product Design floating badges
 */
export default function HeroStage({ heroConfig = {} }) {
  const stageRef = useRef(null);

  // Animation pause controls
  const [isPaused, setIsPaused] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Parallax offsets
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Live exchange state
  const [activePairIndex, setActivePairIndex] = useState(0);
  const [isBrokerPulsing, setIsBrokerPulsing] = useState(false);

  // Arrival toasts & glow rings
  const [boyArrival, setBoyArrival] = useState({ notice: null, glow: false });
  const [girlArrival, setGirlArrival] = useState({ notice: null, glow: false });

  // 1. Accessibility: Detect prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setIsReducedMotion(mediaQuery.matches);

      const handleChange = (e) => setIsReducedMotion(e.matches);
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  // 2. Performance: IntersectionObserver (pause when off-screen)
  useEffect(() => {
    if (!stageRef.current || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsPaused(!entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    observer.observe(stageRef.current);
    return () => observer.disconnect();
  }, []);

  // 3. Tab Visibility: Pause when browser tab is inactive
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        setIsPaused(true);
      } else {
        setIsPaused(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // 4. Desktop Mouse Parallax
  const handleMouseMove = useCallback((e) => {
    if (window.innerWidth < 1024) return;
    if (!stageRef.current) return;

    const rect = stageRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const normX = Math.max(-1, Math.min(1, (e.clientX - centerX) / (rect.width / 2)));
    const normY = Math.max(-1, Math.min(1, (e.clientY - centerY) / (rect.height / 2)));

    setMouseOffset({ x: normX, y: normY });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMouseOffset({ x: 0, y: 0 });
  }, []);

  // Callbacks from SkillOrbStream
  const handleArrivalGirl = useCallback((skillName) => {
    setGirlArrival({ notice: skillName, glow: true });
    setTimeout(() => {
      setGirlArrival({ notice: null, glow: false });
    }, 2400);
  }, []);

  const handleArrivalBoy = useCallback((skillName) => {
    setBoyArrival({ notice: skillName, glow: true });
    setTimeout(() => {
      setBoyArrival({ notice: null, glow: false });
    }, 2400);
  }, []);

  const handleBrokerPulse = useCallback(() => {
    setIsBrokerPulsing(true);
    setTimeout(() => {
      setIsBrokerPulsing(false);
    }, 700);
  }, []);

  const handlePairChange = useCallback((pairIndex) => {
    setActivePairIndex(pairIndex);
  }, []);

  const dynamicPairs = (heroConfig?.pairs && heroConfig.pairs.length > 0)
    ? heroConfig.pairs.map(p => ({
        tech: { name: p.tech },
        creative: { name: p.creative }
      }))
    : SKILL_PAIRS;

  const currentPair = dynamicPairs[activePairIndex % dynamicPairs.length] || dynamicPairs[0];

  return (
    <div
      ref={stageRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      role="img"
      aria-label="Aarav Sharma teaching Tech skills and Ananya Iyer teaching UI/UX Design, bartering skills through SkillSwap."
      className="relative w-full max-w-6xl mx-auto px-2 sm:px-4 select-none flex flex-col items-center justify-center pt-2 pb-4"
    >
      
      {/* ------------------------------------------------------------- */}
      {/* TOP PILLS (DIRECTLY FROM MOCKUP) */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-6 sm:mb-8 z-30">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border border-blue-200/90 text-blue-700 text-xs font-bold shadow-xs hover:scale-105 transition-transform">
          <Users className="w-4 h-4 text-blue-600 shrink-0" />
          <span>{heroConfig?.pill1_text || "Verified Peer-to-Peer Learning Network"}</span>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border border-emerald-200/90 text-emerald-700 text-xs font-bold shadow-xs hover:scale-105 transition-transform">
          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{heroConfig?.pill2_text || "AI-Powered Skill Matching"}</span>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MAIN HERO STAGE ROW */}
      {/* ------------------------------------------------------------- */}
      <div className="relative w-full flex items-center justify-between gap-1 sm:gap-3 lg:gap-4">
        
        {/* ========================================================= */}
        {/* LEFT FLANK: "SHARE YOUR SKILLS" + FLOATING CHIPS */}
        {/* ========================================================= */}
        <div className="hidden md:flex flex-col items-center justify-center relative w-[130px] lg:w-[150px] shrink-0 z-20">
          
          {/* Hand-drawn Doodle: "Share Your Skills" with curved arrow */}
          <div className="flex flex-col items-center mb-3 pointer-events-none select-none">
            <span className="font-handwriting text-xl lg:text-2xl font-black text-slate-800 -rotate-6 tracking-wide drop-shadow-2xs leading-tight text-center">
              Share<br />Your Skills
            </span>
            {/* Hand-drawn curved arrow pointing down-right */}
            <svg viewBox="0 0 60 40" className="w-10 h-7 text-slate-800 -rotate-6 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M 14 6 C 26 14, 38 18, 48 28" />
              <path d="M 38 29 L 49 30 L 48 19" />
            </svg>
          </div>

          {/* Left Vertical Stack of 3 Floating Skill Chips */}
          <div className="flex flex-col gap-2.5 w-full">
            {/* 1. React Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:scale-105 transition-all animate-float-gentle cursor-default">
              {/* React SVG logo */}
              <svg viewBox="-11.5 -10.23174 23 20.46348" className="w-4 h-4 text-[#00d8ff] fill-none stroke-current shrink-0" strokeWidth="1.2">
                <ellipse rx="11" ry="4.2" />
                <ellipse rx="11" ry="4.2" transform="rotate(60)" />
                <ellipse rx="11" ry="4.2" transform="rotate(120)" />
                <circle r="2" fill="#00d8ff" />
              </svg>
              <span className="text-xs font-black text-slate-800">React</span>
            </div>

            {/* 2. JavaScript Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:scale-105 transition-all animate-float-gentle cursor-default" style={{ animationDelay: "1s" }}>
              <div className="w-4 h-4 rounded-xs bg-[#f7df1e] text-black font-black text-[9px] flex items-center justify-center leading-none shrink-0 shadow-2xs">
                JS
              </div>
              <span className="text-xs font-black text-slate-800">JavaScript</span>
            </div>

            {/* 3. Node.js Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:scale-105 transition-all animate-float-gentle cursor-default" style={{ animationDelay: "2s" }}>
              <svg viewBox="0 0 32 32" className="w-4 h-4 shrink-0">
                <path fill="#339933" d="M16 2.5l11.7 6.8v13.4L16 29.5 4.3 22.7V9.3L16 2.5z" />
                <path fill="#fff" d="M13.5 12h-2v8h2v-5l3.5 5h1.5v-8h-2v5z" />
              </svg>
              <span className="text-xs font-black text-slate-800">Node.js</span>
            </div>
          </div>

        </div>

        {/* ========================================================= */}
        {/* ZONE 1: BOY (AARAV SHARMA) */}
        {/* ========================================================= */}
        <div className="w-[45%] md:w-[28%] lg:w-[26%] flex justify-center">
          <AvatarFigure
            variant="tech"
            src={heroConfig?.boy_image || "/hero/boy-clean.png"}
            personName={heroConfig?.boy_name || "Aarav Sharma"}
            personRole={heroConfig?.boy_role || "Full-Stack & ML"}
            personLocation={heroConfig?.boy_location || "Jabalpur, India"}
            alt="Aarav Sharma with laptop teaching tech skills"
            isPaused={isPaused}
            mouseOffset={mouseOffset}
            currentTeaching={currentPair.tech.name}
            currentWanting={currentPair.creative.name}
            arrivalNotice={boyArrival.notice}
            isArrivalGlow={boyArrival.glow}
          />
        </div>

        {/* ========================================================= */}
        {/* ZONE 2: CENTER BROKER & LIVE BARTER STREAM */}
        {/* ========================================================= */}
        <div className="relative w-[18%] md:w-[26%] lg:w-[28%] flex flex-col items-center justify-center py-1 min-h-[140px] sm:min-h-[170px]">
          {/* Central SkillSwap Matcher Node */}
          <div className="relative z-20">
            <SwapNode
              isPulsing={isBrokerPulsing}
              activePairIndex={activePairIndex}
            />
          </div>

          {/* Animated Curved Skill Orb Streams Crossing Over Center */}
          <SkillOrbStream
            isPaused={isPaused}
            isReducedMotion={isReducedMotion}
            customPairs={heroConfig?.pairs}
            onArrivalGirl={handleArrivalGirl}
            onArrivalBoy={handleArrivalBoy}
            onBrokerPulse={handleBrokerPulse}
            onPairChange={handlePairChange}
          />
        </div>

        {/* ========================================================= */}
        {/* ZONE 3: GIRL (ANANYA IYER) */}
        {/* ========================================================= */}
        <div className="w-[45%] md:w-[28%] lg:w-[26%] flex justify-center">
          <AvatarFigure
            variant="creative"
            src={heroConfig?.girl_image || "/hero/girl-clean.png"}
            personName={heroConfig?.girl_name || "Ananya Iyer"}
            personRole={heroConfig?.girl_role || "UI/UX & Product Design"}
            personLocation={heroConfig?.girl_location || "Bangalore, India"}
            alt="Ananya Iyer with laptop teaching creative skills"
            isPaused={isPaused}
            mouseOffset={mouseOffset}
            currentTeaching={currentPair.creative.name}
            currentWanting={currentPair.tech.name}
            arrivalNotice={girlArrival.notice}
            isArrivalGlow={girlArrival.glow}
          />
        </div>

        {/* ========================================================= */}
        {/* RIGHT FLANK: "LEARN NEW SKILLS" + FLOATING CHIPS */}
        {/* ========================================================= */}
        <div className="hidden md:flex flex-col items-center justify-center relative w-[130px] lg:w-[150px] shrink-0 z-20">
          
          {/* Hand-drawn Doodle: "Learn New Skills" with curved arrow */}
          <div className="flex flex-col items-center mb-3 pointer-events-none select-none">
            <span className="font-handwriting text-xl lg:text-2xl font-black text-slate-800 rotate-6 tracking-wide drop-shadow-2xs leading-tight text-center">
              Learn<br />New Skills
            </span>
            {/* Hand-drawn curved arrow pointing down-left */}
            <svg viewBox="0 0 60 40" className="w-10 h-7 text-slate-800 rotate-6 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M 46 6 C 34 14, 22 18, 12 28" />
              <path d="M 22 29 L 11 30 L 12 19" />
            </svg>
          </div>

          {/* Right Vertical Stack of 3 Floating Skill Chips */}
          <div className="flex flex-col gap-2.5 w-full">
            {/* 1. UI/UX Design Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:scale-105 transition-all animate-float-gentle cursor-default">
              <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0">
                <rect x="3" y="3" width="7" height="7" rx="1.5" fill="#3b82f6" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" fill="#ec4899" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" fill="#8b5cf6" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" fill="#10b981" />
              </svg>
              <span className="text-xs font-black text-slate-800 truncate">UI/UX Design</span>
            </div>

            {/* 2. Figma Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:scale-105 transition-all animate-float-gentle cursor-default" style={{ animationDelay: "1s" }}>
              <svg viewBox="0 0 38 57" className="w-3 h-4 shrink-0">
                <path fill="#1abcfe" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" />
                <path fill="#0acf83" d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" />
                <path fill="#ff7262" d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" />
                <path fill="#f24e1e" d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" />
                <path fill="#a259ff" d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" />
              </svg>
              <span className="text-xs font-black text-slate-800">Figma</span>
            </div>

            {/* 3. Product Design Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:scale-105 transition-all animate-float-gentle cursor-default" style={{ animationDelay: "2s" }}>
              <span className="text-sm leading-none shrink-0">💡</span>
              <span className="text-xs font-black text-slate-800 truncate">Product Design</span>
            </div>
          </div>

        </div>

      </div>

      {/* Mobile-only Floating Chips Strip (visible on mobile where side flanks are hidden) */}
      <div className="flex md:hidden flex-wrap items-center justify-center gap-2 mt-4 z-20">
        <span className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-[10px] font-black text-slate-800 flex items-center gap-1">
          <span className="text-[#00d8ff]">⚛</span> React
        </span>
        <span className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-[10px] font-black text-slate-800 flex items-center gap-1">
          <span className="text-amber-500">⚡</span> JavaScript
        </span>
        <span className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-[10px] font-black text-slate-800 flex items-center gap-1">
          <span className="text-purple-500">🎨</span> UI/UX
        </span>
        <span className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-[10px] font-black text-slate-800 flex items-center gap-1">
          <span className="text-pink-500">❖</span> Figma
        </span>
      </div>

    </div>
  );
}
