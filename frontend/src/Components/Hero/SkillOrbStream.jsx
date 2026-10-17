import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, 
  Code, 
  Layers, 
  Cpu, 
  Palette, 
  Globe, 
  Target, 
  ArrowRight, 
  ArrowLeft 
} from "lucide-react";

/**
 * 4 Rotating Skill Pairs as defined in the specification.
 */
export const SKILL_PAIRS = [
  {
    id: 0,
    tech: { name: "Machine Learning", tag: "AI / ML", icon: Sparkles, color: "text-blue-600", bg: "bg-blue-50/95 border-blue-300" },
    creative: { name: "UI/UX Design", tag: "Design", icon: Palette, color: "text-purple-600", bg: "bg-purple-50/95 border-purple-300" }
  },
  {
    id: 1,
    tech: { name: "Python", tag: "Backend", icon: Code, color: "text-indigo-600", bg: "bg-indigo-50/95 border-indigo-300" },
    creative: { name: "Spanish", tag: "Language", icon: Globe, color: "text-emerald-600", bg: "bg-emerald-50/95 border-emerald-300" }
  },
  {
    id: 2,
    tech: { name: "Data Science", tag: "Analytics", icon: Layers, color: "text-cyan-600", bg: "bg-cyan-50/95 border-cyan-300" },
    creative: { name: "Digital Art", tag: "Illustration", icon: Palette, color: "text-pink-600", bg: "bg-pink-50/95 border-pink-300" }
  },
  {
    id: 3,
    tech: { name: "System Design", tag: "Architecture", icon: Cpu, color: "text-violet-600", bg: "bg-violet-50/95 border-violet-300" },
    creative: { name: "Brand Strategy", tag: "Strategy", icon: Target, color: "text-rose-600", bg: "bg-rose-50/95 border-rose-300" }
  }
];

// Cubic Bezier interpolation
function getCubicBezierPoint(t, p0, p1, p2, p3) {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;

  const x = uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x;
  const y = uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y;
  return { x, y };
}

// Curve control points (normalized in 1000x260 coordinate space)
const PATH_TECH_TO_CREATIVE = {
  p0: { x: 120, y: 120 },
  p1: { x: 340, y: 40 },
  p2: { x: 660, y: 80 },
  p3: { x: 880, y: 120 }
};

const PATH_CREATIVE_TO_TECH = {
  p0: { x: 880, y: 140 },
  p1: { x: 660, y: 220 },
  p2: { x: 340, y: 180 },
  p3: { x: 120, y: 140 }
};

export default function SkillOrbStream({
  isPaused = false,
  isReducedMotion = false,
  onArrivalGirl = () => {},
  onArrivalBoy = () => {},
  onBrokerPulse = () => {},
  onPairChange = () => {}
}) {
  const [activePairIndex, setActivePairIndex] = useState(0);
  const [progress, setProgress] = useState(0); // 0 to 1 loop over 8000ms

  // Ref tracking last arrival trigger to prevent duplicate toasts in single cycle
  const arrivalStateRef = useRef({ girlFired: false, boyFired: false, brokerFired: false });
  const lastTimeRef = useRef(null);
  const animFrameRef = useRef(null);

  const CYCLE_DURATION = 8000; // 8 seconds per rotation

  useEffect(() => {
    onPairChange(activePairIndex);
  }, [activePairIndex, onPairChange]);

  useEffect(() => {
    if (isPaused || isReducedMotion) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    const animate = (currentTime) => {
      if (!lastTimeRef.current) lastTimeRef.current = currentTime;
      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      setProgress((prev) => {
        const next = (prev + deltaTime / CYCLE_DURATION) % 1;

        // Boy -> Girl orb travels from t=0.05 to t=0.65
        // Passes broker node at t=0.35
        if (prev < 0.35 && next >= 0.35 && !arrivalStateRef.current.brokerFired) {
          onBrokerPulse();
          arrivalStateRef.current.brokerFired = true;
        }

        // Girl receives at t=0.65
        if (prev < 0.65 && next >= 0.65 && !arrivalStateRef.current.girlFired) {
          const currentPair = SKILL_PAIRS[activePairIndex];
          onArrivalGirl(currentPair.tech.name);
          arrivalStateRef.current.girlFired = true;
        }

        // Girl -> Boy orb travels from t=0.20 to t=0.80
        // Boy receives at t=0.80
        if (prev < 0.80 && next >= 0.80 && !arrivalStateRef.current.boyFired) {
          const currentPair = SKILL_PAIRS[activePairIndex];
          onArrivalBoy(currentPair.creative.name);
          arrivalStateRef.current.boyFired = true;
        }

        // Cycle rollover at t=0.99
        if (next < prev) {
          // Reset triggers and switch pair
          arrivalStateRef.current = { girlFired: false, boyFired: false, brokerFired: false };
          setActivePairIndex((idx) => (idx + 1) % SKILL_PAIRS.length);
        }

        return next;
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      lastTimeRef.current = null;
    };
  }, [isPaused, isReducedMotion, activePairIndex, onArrivalGirl, onArrivalBoy, onBrokerPulse]);

  const currentPair = SKILL_PAIRS[activePairIndex];
  const TechIcon = currentPair.tech.icon;
  const CreativeIcon = currentPair.creative.icon;

  // Calculate normalized travel t [0, 1] for both orbs
  // Tech Orb travels during progress [0.05, 0.65]
  let tTech = 0;
  let opacityTech = 0;
  if (!isReducedMotion) {
    if (progress >= 0.05 && progress <= 0.65) {
      tTech = (progress - 0.05) / 0.6;
      opacityTech = tTech < 0.1 ? tTech * 10 : tTech > 0.9 ? (1 - tTech) * 10 : 1;
    }
  } else {
    tTech = 0.45; // Static park position
    opacityTech = 1;
  }

  // Creative Orb travels during progress [0.20, 0.80]
  let tCreative = 0;
  let opacityCreative = 0;
  if (!isReducedMotion) {
    if (progress >= 0.20 && progress <= 0.80) {
      tCreative = (progress - 0.20) / 0.6;
      opacityCreative = tCreative < 0.1 ? tCreative * 10 : tCreative > 0.9 ? (1 - tCreative) * 10 : 1;
    }
  } else {
    tCreative = 0.55; // Static park position
    opacityCreative = 1;
  }

  // Calculate orb positions in coordinate space
  const techPos = getCubicBezierPoint(
    tTech,
    PATH_TECH_TO_CREATIVE.p0,
    PATH_TECH_TO_CREATIVE.p1,
    PATH_TECH_TO_CREATIVE.p2,
    PATH_TECH_TO_CREATIVE.p3
  );

  const creativePos = getCubicBezierPoint(
    tCreative,
    PATH_CREATIVE_TO_TECH.p0,
    PATH_CREATIVE_TO_TECH.p1,
    PATH_CREATIVE_TO_TECH.p2,
    PATH_CREATIVE_TO_TECH.p3
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible">
      {/* 1. Curved Glowing Exchange Paths (SVG) */}
      <svg
        className="w-full h-full overflow-visible"
        viewBox="0 0 1000 260"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          {/* Gradient for Left -> Right (Tech to Creative) */}
          <linearGradient id="gradient-tech-to-creative" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#6366f1" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.2" />
          </linearGradient>

          {/* Gradient for Right -> Left (Creative to Tech) */}
          <linearGradient id="gradient-creative-to-tech" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#ec4899" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
          </linearGradient>

          <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Path 1: Tech -> Creative (Arcs Upper) */}
        <path
          d={`M ${PATH_TECH_TO_CREATIVE.p0.x} ${PATH_TECH_TO_CREATIVE.p0.y} C ${PATH_TECH_TO_CREATIVE.p1.x} ${PATH_TECH_TO_CREATIVE.p1.y}, ${PATH_TECH_TO_CREATIVE.p2.x} ${PATH_TECH_TO_CREATIVE.p2.y}, ${PATH_TECH_TO_CREATIVE.p3.x} ${PATH_TECH_TO_CREATIVE.p3.y}`}
          fill="none"
          stroke="url(#gradient-tech-to-creative)"
          strokeWidth="2.5"
          strokeDasharray="6 6"
          filter="url(#glow-filter)"
          className="opacity-70"
        />

        {/* Path 2: Creative -> Tech (Arcs Lower) */}
        <path
          d={`M ${PATH_CREATIVE_TO_TECH.p0.x} ${PATH_CREATIVE_TO_TECH.p0.y} C ${PATH_CREATIVE_TO_TECH.p1.x} ${PATH_CREATIVE_TO_TECH.p1.y}, ${PATH_CREATIVE_TO_TECH.p2.x} ${PATH_CREATIVE_TO_TECH.p2.y}, ${PATH_CREATIVE_TO_TECH.p3.x} ${PATH_CREATIVE_TO_TECH.p3.y}`}
          fill="none"
          stroke="url(#gradient-creative-to-tech)"
          strokeWidth="2.5"
          strokeDasharray="6 6"
          filter="url(#glow-filter)"
          className="opacity-70"
        />
      </svg>

      {/* 2. Traveling Skill Orb: Boy -> Girl (Tech) */}
      <div
        className="absolute z-30 transition-opacity duration-200 pointer-events-auto"
        style={{
          left: `${(techPos.x / 1000) * 100}%`,
          top: `${(techPos.y / 260) * 100}%`,
          transform: "translate(-50%, -50%)",
          opacity: opacityTech,
          willChange: "transform, opacity"
        }}
      >
        {/* Glow halo */}
        <div className="absolute inset-0 -m-2 bg-blue-500/25 rounded-full blur-xs pointer-events-none" />

        {/* Glass Orb Badge */}
        <div className="relative flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-md border border-blue-400/80 shadow-md text-slate-800 text-[10px] font-extrabold tracking-tight whitespace-nowrap select-none hover:scale-105 transition-transform">
          <span className="flex items-center justify-center w-4 h-4 rounded-full bg-blue-600 text-white shadow-2xs">
            <TechIcon className="w-2.5 h-2.5" />
          </span>
          <span className="font-bold text-blue-950">{currentPair.tech.name}</span>
          <ArrowRight className="w-2.5 h-2.5 text-blue-500" />
        </div>
      </div>

      {/* 3. Traveling Skill Orb: Girl -> Boy (Creative) */}
      <div
        className="absolute z-30 transition-opacity duration-200 pointer-events-auto"
        style={{
          left: `${(creativePos.x / 1000) * 100}%`,
          top: `${(creativePos.y / 260) * 100}%`,
          transform: "translate(-50%, -50%)",
          opacity: opacityCreative,
          willChange: "transform, opacity"
        }}
      >
        {/* Glow halo */}
        <div className="absolute inset-0 -m-2 bg-purple-500/25 rounded-full blur-xs pointer-events-none" />

        {/* Glass Orb Badge */}
        <div className="relative flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-md border border-purple-400/80 shadow-md text-slate-800 text-[10px] font-extrabold tracking-tight whitespace-nowrap select-none hover:scale-105 transition-transform">
          <ArrowLeft className="w-2.5 h-2.5 text-purple-500" />
          <span className="font-bold text-purple-950">{currentPair.creative.name}</span>
          <span className="flex items-center justify-center w-4 h-4 rounded-full bg-purple-600 text-white shadow-2xs">
            <CreativeIcon className="w-2.5 h-2.5" />
          </span>
        </div>
      </div>

      {/* Reduced-Motion Static Indicator Label */}
      {isReducedMotion && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-slate-900/80 text-white text-[10px] font-bold">
          Skill Exchange in Progress
        </div>
      )}
    </div>
  );
}
