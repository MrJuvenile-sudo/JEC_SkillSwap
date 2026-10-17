import React, { useState, useEffect, useRef, useCallback } from "react";
import AvatarFigure from "./AvatarFigure";
import SwapNode from "./SwapNode";
import SkillOrbStream, { SKILL_PAIRS } from "./SkillOrbStream";

/**
 * HeroStage orchestrates the 3-zone 1-on-1 reciprocal skill barter stage:
 * Zone 1 (Left): Boy (Tech Persona)
 * Zone 2 (Center): SkillSwap Broker Node & Traveling Skill Badges
 * Zone 3 (Right): Girl (Creative Persona)
 */
export default function HeroStage() {
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
    if (window.innerWidth < 1024) return; // Desktop only
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

  const currentPair = SKILL_PAIRS[activePairIndex] || SKILL_PAIRS[0];

  return (
    <div
      ref={stageRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      role="img"
      aria-label="A boy teaching Machine Learning and a girl teaching UI/UX Design, swapping skills through SkillSwap."
      className="relative w-full max-w-6xl mx-auto px-2 sm:px-4 lg:px-6 select-none overflow-hidden sm:overflow-visible min-h-[480px] sm:min-h-[520px] lg:min-h-[560px] flex items-center justify-center"
    >
      {/* Soft Ambient Depth Background Behind Stage */}
      <div
        className="absolute inset-0 -m-6 sm:-m-12 rounded-3xl bg-gradient-to-b from-blue-50/40 via-indigo-50/20 to-purple-50/40 -z-20 pointer-events-none blur-2xl"
        aria-hidden="true"
      />

      {/* Decorative Floating Dots / Particles */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden" aria-hidden="true">
        <span className="absolute top-1/4 left-1/5 w-1.5 h-1.5 rounded-full bg-blue-400/40 animate-ping" />
        <span className="absolute top-2/3 right-1/4 w-2 h-2 rounded-full bg-purple-400/35 animate-ping" style={{ animationDelay: "1.5s" }} />
        <span className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 rounded-full bg-emerald-400/40 animate-ping" style={{ animationDelay: "2.5s" }} />
      </div>

      {/* THREE-ZONE ROW: BOY (LEFT) | BROKER & STREAMS (CENTER) | GIRL (RIGHT) */}
      <div className="relative z-10 w-full flex flex-col md:flex-row items-center justify-between gap-4 md:gap-2 lg:gap-8">
        
        {/* ZONE 1: BOY (TECH PERSONA - LEFT) */}
        <div className="w-full md:w-[38%] lg:w-[36%] flex justify-center md:justify-start">
          <AvatarFigure
            variant="tech"
            src="/hero/boy-tech.webp"
            alt="Young Indian man holding laptop teaching tech skills"
            isPaused={isPaused}
            mouseOffset={mouseOffset}
            currentTeaching={currentPair.tech.name}
            currentWanting={currentPair.creative.name}
            arrivalNotice={boyArrival.notice}
            isArrivalGlow={boyArrival.glow}
          />
        </div>

        {/* ZONE 2: CENTER BROKER & STREAM CONNECTOR */}
        <div className="relative w-full md:w-[24%] lg:w-[28%] flex flex-col items-center justify-center py-4 md:py-0 min-h-[160px] md:min-h-[300px]">
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
            onArrivalGirl={handleArrivalGirl}
            onArrivalBoy={handleArrivalBoy}
            onBrokerPulse={handleBrokerPulse}
            onPairChange={handlePairChange}
          />
        </div>

        {/* ZONE 3: GIRL (CREATIVE PERSONA - RIGHT) */}
        <div className="w-full md:w-[38%] lg:w-[36%] flex justify-center md:justify-end">
          <AvatarFigure
            variant="creative"
            src="/hero/girl-creative.webp"
            alt="Young Indian woman holding tablet teaching creative skills"
            isPaused={isPaused}
            mouseOffset={mouseOffset}
            currentTeaching={currentPair.creative.name}
            currentWanting={currentPair.tech.name}
            arrivalNotice={girlArrival.notice}
            isArrivalGlow={girlArrival.glow}
          />
        </div>

      </div>

    </div>
  );
}
