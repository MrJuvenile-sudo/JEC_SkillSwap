import React from "react";
import { Repeat } from "lucide-react";

/**
 * SwapNode represents the central SkillSwap matching engine / broker.
 * Features the gradient logo with top-right green lightning bolt badge,
 * brand heading, and 92% Match indicator.
 */
export default function SwapNode({ isPulsing = false, activePairIndex = 0 }) {
  return (
    <div className="relative flex flex-col items-center justify-center select-none pointer-events-auto">
      {/* Outer ambient radar / pulse rings */}
      <div className="absolute inset-0 -m-3 flex items-center justify-center pointer-events-none" aria-hidden="true">
        <div
          className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-blue-400/20 transition-all duration-700 ${
            isPulsing ? "scale-125 opacity-80 border-indigo-400/50" : "scale-100 opacity-25"
          }`}
          style={{
            animation: "ping 3s cubic-bezier(0, 0, 0.2, 1) infinite"
          }}
        />
      </div>

      {/* Main Glass Broker Badge - Matching the User Mockup */}
      <div
        className={`relative z-10 flex flex-col items-center p-2.5 sm:p-3.5 rounded-2xl bg-white border shadow-md transition-all duration-500 min-w-[95px] sm:min-w-[110px] ${
          isPulsing
            ? "border-blue-400 ring-2 ring-blue-200/60 shadow-blue-500/20 scale-105"
            : "border-slate-200/90 shadow-slate-900/5 hover:border-slate-300"
        }`}
      >
        {/* Central Logo Node Icon with Lightning Bolt Badge */}
        <div className="relative flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25">
          <Repeat
            className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-500 ${
              isPulsing ? "rotate-180 scale-110" : ""
            }`}
          />
          {/* Green Lightning Badge on Top-Right */}
          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 rounded-full bg-emerald-500 text-white items-center justify-center text-[9px] font-black shadow-sm ring-2 ring-white">
            ⚡
          </span>
        </div>

        {/* Brand label & verification badge */}
        <div className="mt-1.5 text-center">
          <h4 className="text-xs sm:text-sm font-black tracking-tight text-slate-900 leading-tight">
            SkillSwap
          </h4>
          <div className="text-[10px] sm:text-[11px] text-slate-600 font-bold flex items-center justify-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>92% Match</span>
          </div>
        </div>
      </div>
    </div>
  );
}
