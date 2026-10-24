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
  ArrowLeft,
  GraduationCap
} from "lucide-react";

/**
 * 4 Rotating Skill Pairs matching the platform's core barter pairs.
 * Default starts with Teach React ⇄ Learn UI/UX as seen in user mockup.
 */
export const SKILL_PAIRS = [
  {
    id: 0,
    tech: { name: "Teach React", tag: "Frontend", icon: GraduationCap, color: "text-blue-600", bg: "bg-blue-50/95 border-blue-300" },
    creative: { name: "Learn UI/UX", tag: "Design", icon: Palette, color: "text-purple-600", bg: "bg-purple-50/95 border-purple-300" }
  },
  {
    id: 1,
    tech: { name: "Teach JavaScript", tag: "Scripting", icon: Code, color: "text-amber-600", bg: "bg-amber-50/95 border-amber-300" },
    creative: { name: "Learn Figma", tag: "Design", icon: Palette, color: "text-violet-600", bg: "bg-violet-50/95 border-violet-300" }
  },
  {
    id: 2,
    tech: { name: "Teach Node.js", tag: "Backend", icon: Layers, color: "text-emerald-600", bg: "bg-emerald-50/95 border-emerald-300" },
    creative: { name: "Learn Product Design", tag: "Strategy", icon: Target, color: "text-rose-600", bg: "bg-rose-50/95 border-rose-300" }
  },
  {
    id: 3,
    tech: { name: "Teach Python", tag: "AI / Data", icon: Sparkles, color: "text-indigo-600", bg: "bg-indigo-50/95 border-indigo-300" },
    creative: { name: "Learn Machine Learning", tag: "AI", icon: Cpu, color: "text-cyan-600", bg: "bg-cyan-50/95 border-cyan-300" }
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

// Curve control points matching the reference mockup arches:
// Tech to Center broker (Arcs upward from boy towards broker, clear of center icon)
const PATH_TECH_TO_BROKER = {
  p0: { x: 130, y: 130 },
  p1: { x: 230, y: 55 },
  p2: { x: 350, y: 70 },
  p3: { x: 425, y: 130 }
};

// Broker to Creative (Arcs upward from broker towards girl, clear of center icon)
const PATH_BROKER_TO_CREATIVE = {
  p0: { x: 575, y: 130 },
  p1: { x: 650, y: 70 },
  p2: { x: 770, y: 55 },
  p3: { x: 870, y: 130 }
};

export default function SkillOrbStream({
  isPaused = false,
  isReducedMotion = false,
  customPairs = null,
  onArrivalGirl = () => {},
  onArrivalBoy = () => {},
  onBrokerPulse = () => {},
  onPairChange = () => {}
}) {
  const pairsList = (customPairs && customPairs.length > 0)
    ? customPairs.map((p, idx) => ({
        id: idx,
        tech: {
          name: p.tech?.startsWith("Teach") ? p.tech : `Teach ${p.tech || "React"}`,
          icon: [GraduationCap, Code, Layers, Sparkles][idx % 4]
        },
        creative: {
          name: p.creative?.startsWith("Learn") ? p.creative : `Learn ${p.creative || "UI/UX"}`,
          icon: [Palette, Palette, Target, Cpu][idx % 4]
        }
      }))
    : SKILL_PAIRS;

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

        // Boy -> Broker orb reaches broker around t=0.45
        if (prev < 0.45 && next >= 0.45 && !arrivalStateRef.current.brokerFired) {
          onBrokerPulse();
          arrivalStateRef.current.brokerFired = true;
        }

        // Broker -> Girl orb reaches girl at t=0.75
        if (prev < 0.75 && next >= 0.75 && !arrivalStateRef.current.girlFired) {
          const currentPair = pairsList[activePairIndex % pairsList.length] || pairsList[0];
          onArrivalGirl(currentPair.tech.name.replace("Teach ", ""));
          arrivalStateRef.current.girlFired = true;
        }

        // Girl -> Boy completion at t=0.90
        if (prev < 0.90 && next >= 0.90 && !arrivalStateRef.current.boyFired) {
          const currentPair = pairsList[activePairIndex % pairsList.length] || pairsList[0];
          onArrivalBoy(currentPair.creative.name.replace("Learn ", ""));
          arrivalStateRef.current.boyFired = true;
        }

        // Cycle rollover at t=0.99
        if (next < prev) {
          arrivalStateRef.current = { girlFired: false, boyFired: false, brokerFired: false };
          setActivePairIndex((idx) => (idx + 1) % pairsList.length);
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
  }, [isPaused, isReducedMotion, activePairIndex, pairsList, onArrivalGirl, onArrivalBoy, onBrokerPulse]);

  const currentPair = pairsList[activePairIndex % pairsList.length] || pairsList[0];
  const TechIcon = currentPair.tech.icon;
  const CreativeIcon = currentPair.creative.icon;

  // Normalized travel t [0, 1] for both orbs
  let tTech = 0;
  let opacityTech = 0;
  if (!isReducedMotion) {
    if (progress >= 0.05 && progress <= 0.48) {
      tTech = (progress - 0.05) / 0.43;
      opacityTech = tTech < 0.2 ? tTech * 5 : tTech > 0.8 ? (1 - tTech) * 5 : 1;
    }
  } else {
    tTech = 0.5;
    opacityTech = 0.7;
  }

  let tCreative = 0;
  let opacityCreative = 0;
  if (!isReducedMotion) {
    if (progress >= 0.52 && progress <= 0.95) {
      tCreative = (progress - 0.52) / 0.43;
      opacityCreative = tCreative < 0.2 ? tCreative * 5 : tCreative > 0.8 ? (1 - tCreative) * 5 : 1;
    }
  } else {
    tCreative = 0.5;
    opacityCreative = 0.7;
  }

  // Calculate positions
  const techPos = getCubicBezierPoint(
    tTech,
    PATH_TECH_TO_BROKER.p0,
    PATH_TECH_TO_BROKER.p1,
    PATH_TECH_TO_BROKER.p2,
    PATH_TECH_TO_BROKER.p3
  );

  const creativePos = getCubicBezierPoint(
    tCreative,
    PATH_BROKER_TO_CREATIVE.p0,
    PATH_BROKER_TO_CREATIVE.p1,
    PATH_BROKER_TO_CREATIVE.p2,
    PATH_BROKER_TO_CREATIVE.p3
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible">
      {/* 1. Curved Glowing Exchange Dashed Paths (Matching Mockup) */}
      <svg
        className="w-full h-full overflow-visible"
        viewBox="0 0 1000 260"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="gradient-tech-arc" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#0ea5e9" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.5" />
          </linearGradient>

          <linearGradient id="gradient-creative-arc" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#a855f7" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#d946ef" stopOpacity="0.3" />
          </linearGradient>

          {/* Marker arrows */}
          <marker id="arrow-tech" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
            <path d="M 0 1 L 9 5 L 0 9 z" fill="#0ea5e9" />
          </marker>
          <marker id="arrow-creative" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
            <path d="M 0 1 L 9 5 L 0 9 z" fill="#a855f7" />
          </marker>
        </defs>

        {/* Path 1: Tech -> Center Broker (Dashed Cyan Curve) */}
        <path
          d={`M ${PATH_TECH_TO_BROKER.p0.x} ${PATH_TECH_TO_BROKER.p0.y} C ${PATH_TECH_TO_BROKER.p1.x} ${PATH_TECH_TO_BROKER.p1.y}, ${PATH_TECH_TO_BROKER.p2.x} ${PATH_TECH_TO_BROKER.p2.y}, ${PATH_TECH_TO_BROKER.p3.x} ${PATH_TECH_TO_BROKER.p3.y}`}
          fill="none"
          stroke="url(#gradient-tech-arc)"
          strokeWidth="2.5"
          strokeDasharray="5 5"
          markerEnd="url(#arrow-tech)"
          className="animate-dash-flow opacity-80"
        />

        {/* Path 2: Center Broker -> Creative (Dashed Purple Curve) */}
        <path
          d={`M ${PATH_BROKER_TO_CREATIVE.p0.x} ${PATH_BROKER_TO_CREATIVE.p0.y} C ${PATH_BROKER_TO_CREATIVE.p1.x} ${PATH_BROKER_TO_CREATIVE.p1.y}, ${PATH_BROKER_TO_CREATIVE.p2.x} ${PATH_BROKER_TO_CREATIVE.p2.y}, ${PATH_BROKER_TO_CREATIVE.p3.x} ${PATH_BROKER_TO_CREATIVE.p3.y}`}
          fill="none"
          stroke="url(#gradient-creative-arc)"
          strokeWidth="2.5"
          strokeDasharray="5 5"
          markerEnd="url(#arrow-creative)"
          className="animate-dash-flow opacity-80"
        />
      </svg>

      {/* 2. Traveling Skill Badge: Teach Data Science / Teach React (Decreased Size Sleek Pill) */}
      <div
        className="absolute z-20 transition-opacity duration-300 pointer-events-auto"
        style={{
          left: `${(techPos.x / 1000) * 100}%`,
          top: `${(techPos.y / 260) * 100}%`,
          transform: "translate(-50%, -50%)",
          opacity: opacityTech,
          willChange: "transform, opacity"
        }}
      >
        {/* Soft radial glow */}
        <div className="absolute inset-0 -m-1.5 bg-blue-400/20 rounded-full blur-xs pointer-events-none" />

        {/* Compact Pill Badge */}
        <div className="relative flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-white/95 border border-blue-200/90 shadow-sm text-slate-800 select-none hover:scale-105 transition-transform backdrop-blur-xs">
          <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <TechIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          </div>
          <span className="text-[7.5px] xs:text-[8px] sm:text-[9px] font-black text-blue-900 tracking-tight whitespace-nowrap leading-none pr-0.5">
            {currentPair.tech.name}
          </span>
        </div>
      </div>

      {/* 3. Traveling Skill Badge: Learn UI/UX Design (Decreased Size Sleek Pill) */}
      <div
        className="absolute z-20 transition-opacity duration-300 pointer-events-auto"
        style={{
          left: `${(creativePos.x / 1000) * 100}%`,
          top: `${(creativePos.y / 260) * 100}%`,
          transform: "translate(-50%, -50%)",
          opacity: opacityCreative,
          willChange: "transform, opacity"
        }}
      >
        {/* Soft radial glow */}
        <div className="absolute inset-0 -m-1.5 bg-purple-400/20 rounded-full blur-xs pointer-events-none" />

        {/* Compact Pill Badge */}
        <div className="relative flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-white/95 border border-purple-200/90 shadow-sm text-slate-800 select-none hover:scale-105 transition-transform backdrop-blur-xs">
          <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <CreativeIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          </div>
          <span className="text-[7.5px] xs:text-[8px] sm:text-[9px] font-black text-purple-900 tracking-tight whitespace-nowrap leading-none pr-0.5">
            {currentPair.creative.name}
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
