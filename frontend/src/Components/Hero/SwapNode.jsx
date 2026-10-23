import React from "react";
import { Repeat } from "lucide-react";

/**
 * SwapNode represents the central SkillSwap matching engine / broker.
 * Features the gradient logo with top-right green lightning bolt badge,
 * brand heading, and clean Mutual Match status.
 */
export default function SwapNode({ isPulsing = false, activePairIndex = 0 }) {
  return (
    <div className="relative flex flex-col items-center justify-center select-none pointer-events-auto">
      {/* Outer ambient radar / pulse rings */}
      <div className="absolute inset-0 -m-2 sm:-m-3 flex items-center justify-center pointer-events-none" aria-hidden="true">
        <div
          className={`w-14 h-14 xs:w-20 xs:h-20 sm:w-24 sm:h-24 rounded-full border border-blue-400/20 transition-all duration-700 ${
            isPulsing ? "scale-125 opacity-80 border-indigo-400/50" : "scale-100 opacity-25"
          }`}
          style={{
            animation: "ping 3s cubic-bezier(0, 0, 0.2, 1) infinite"
          }}
        />
      </div>

      {/* Main Glass Broker Badge - Fluid Scaling for All Screen Dimensions */}
      <div
        className={`relative z-30 flex flex-col items-center p-2 xs:p-2.5 sm:p-3.5 rounded-xl xs:rounded-2xl bg-white border shadow-md transition-all duration-500 min-w-[76px] xs:min-w-[90px] sm:min-w-[110px] ${
          isPulsing
            ? "border-blue-400 ring-2 ring-blue-200/60 shadow-blue-500/20 scale-105"
            : "border-slate-200/90 shadow-slate-900/5 hover:border-slate-300"
        }`}
      >
        {/* Central Logo Node Icon with Lightning Bolt Badge */}
        <div className="relative flex items-center justify-center w-8 h-8 xs:w-9 xs:h-9 sm:w-11 sm:h-11 rounded-lg xs:rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25 p-1">
          <img
            src="/logo.png"
            alt="SkillSwap Logo"
            className={`w-full h-full object-contain drop-shadow-xs transition-transform duration-500 ${
              isPulsing ? "rotate-180 scale-110" : ""
            }`}
            onError={(e) => {
              e.currentTarget.style.display = "none";
              if (e.currentTarget.nextSibling) {
                e.currentTarget.nextSibling.style.display = "block";
              }
            }}
          />
          <Repeat
            className={`hidden w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 transition-transform duration-500 ${
              isPulsing ? "rotate-180 scale-110" : ""
            }`}
          />
          {/* Green Lightning Badge on Top-Right */}
          <span className="absolute -top-1 -right-1 xs:-top-1.5 xs:-right-1.5 flex h-3.5 w-3.5 xs:h-4 xs:w-4 rounded-full bg-emerald-500 text-white items-center justify-center text-[7.5px] xs:text-[9px] font-black shadow-sm ring-1.5 xs:ring-2 ring-white">
            ⚡
          </span>
        </div>

        {/* Brand label & status */}
        <div className="mt-1 xs:mt-1.5 text-center">
          <h4 className="text-[10px] xs:text-xs sm:text-sm font-black tracking-tight text-slate-900 leading-tight">
            SkillSwap
          </h4>
          <div className="text-[7.5px] xs:text-[9px] sm:text-[11px] text-slate-600 font-bold flex items-center justify-center gap-1 xs:gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Mutual Match</span>
          </div>
        </div>
      </div>
    </div>
  );
}
