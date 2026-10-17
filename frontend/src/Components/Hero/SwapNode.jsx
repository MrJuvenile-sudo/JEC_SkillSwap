import React from "react";
import { Repeat, Shield, Zap, Sparkles } from "lucide-react";

/**
 * SwapNode represents the central SkillSwap matching engine / broker.
 * It sits between the two peers and visually anchors the reciprocal trade.
 */
export default function SwapNode({ isPulsing = false, activePairIndex = 0 }) {
  return (
    <div className="relative flex flex-col items-center justify-center select-none pointer-events-auto">
      {/* Outer ambient radar / pulse rings */}
      <div className="absolute inset-0 -m-4 flex items-center justify-center pointer-events-none" aria-hidden="true">
        <div
          className={`w-24 h-24 rounded-full border border-blue-400/20 transition-all duration-700 ${
            isPulsing ? "scale-120 opacity-80 border-indigo-400/50" : "scale-100 opacity-25"
          }`}
          style={{
            animation: "ping 3s cubic-bezier(0, 0, 0.2, 1) infinite"
          }}
        />
        <div
          className={`absolute w-16 h-16 rounded-full border border-indigo-300/30 transition-all duration-500 ${
            isPulsing ? "scale-110 opacity-90" : "scale-95 opacity-35"
          }`}
        />
      </div>

      {/* Ambient center radial glow */}
      <div
        className="absolute w-20 h-20 -z-10 rounded-full blur-lg pointer-events-none transition-opacity duration-500"
        style={{
          background: "radial-gradient(circle, rgba(99,102,241,0.25) 0%, rgba(59,130,246,0.1) 60%, transparent 100%)",
          opacity: isPulsing ? 1 : 0.6
        }}
        aria-hidden="true"
      />

      {/* Main Glass Broker Badge */}
      <div
        className={`relative z-10 flex flex-col items-center p-1.5 sm:p-2.5 rounded-xl bg-white/95 backdrop-blur-md border shadow-md transition-all duration-500 scale-85 xs:scale-95 sm:scale-100 ${
          isPulsing
            ? "border-indigo-400 ring-2 ring-indigo-200/50 shadow-indigo-500/15 scale-90 xs:scale-100 sm:scale-105"
            : "border-slate-200/90 shadow-slate-900/5 hover:border-slate-300"
        }`}
      >
        {/* Central Logo Node Icon */}
        <div className="relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white shadow-xs shadow-indigo-500/25">
          <Repeat
            className={`w-4 h-4 transition-transform duration-500 ${
              isPulsing ? "rotate-180 scale-110" : ""
            }`}
          />
          {/* Sparkle badge */}
          <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 items-center justify-center">
              <Sparkles className="w-1.5 h-1.5 text-white" />
            </span>
          </span>
        </div>

        {/* Brand label & verification badge */}
        <div className="mt-1 text-center">
          <div className="inline-flex items-center gap-1 text-[10px] font-black tracking-tight text-slate-800">
            <span>SkillSwap</span>
            <span className="px-1 py-0.2 rounded bg-indigo-50 text-indigo-700 text-[8px] font-extrabold uppercase tracking-wider border border-indigo-100">
              Broker
            </span>
          </div>
          <div className="text-[9px] text-slate-500 font-medium flex items-center justify-center gap-1 mt-0.5">
            <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>99.4% Match</span>
          </div>
        </div>
      </div>
    </div>
  );
}
