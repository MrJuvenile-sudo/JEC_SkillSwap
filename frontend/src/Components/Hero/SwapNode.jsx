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
      <div className="absolute inset-0 -m-8 flex items-center justify-center pointer-events-none" aria-hidden="true">
        <div
          className={`w-36 h-36 rounded-full border border-blue-400/20 transition-all duration-700 ${
            isPulsing ? "scale-125 opacity-80 border-indigo-400/50" : "scale-100 opacity-30"
          }`}
          style={{
            animation: "ping 3s cubic-bezier(0, 0, 0.2, 1) infinite"
          }}
        />
        <div
          className={`absolute w-24 h-24 rounded-full border border-indigo-300/30 transition-all duration-500 ${
            isPulsing ? "scale-110 opacity-90" : "scale-95 opacity-40"
          }`}
        />
      </div>

      {/* Ambient center radial glow */}
      <div
        className="absolute w-28 h-28 -z-10 rounded-full blur-xl pointer-events-none transition-opacity duration-500"
        style={{
          background: "radial-gradient(circle, rgba(99,102,241,0.28) 0%, rgba(59,130,246,0.12) 60%, transparent 100%)",
          opacity: isPulsing ? 1 : 0.6
        }}
        aria-hidden="true"
      />

      {/* Main Glass Broker Badge */}
      <div
        className={`relative z-10 flex flex-col items-center p-3 sm:p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border shadow-xl transition-all duration-500 ${
          isPulsing
            ? "border-indigo-400 ring-4 ring-indigo-200/50 shadow-indigo-500/20 scale-105"
            : "border-slate-200/90 shadow-slate-900/5 hover:border-slate-300"
        }`}
      >
        {/* Central Logo Node Icon */}
        <div className="relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/30">
          <Repeat
            className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-500 ${
              isPulsing ? "rotate-180 scale-110" : ""
            }`}
          />
          {/* Sparkle badge */}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 items-center justify-center">
              <Sparkles className="w-2 h-2 text-white" />
            </span>
          </span>
        </div>

        {/* Brand label & verification badge */}
        <div className="mt-2 text-center">
          <div className="inline-flex items-center gap-1 text-[11px] font-black tracking-tight text-slate-800">
            <span>SkillSwap</span>
            <span className="px-1 py-0.2 rounded bg-indigo-50 text-indigo-700 text-[9px] font-extrabold uppercase tracking-wider border border-indigo-100">
              Broker
            </span>
          </div>
          <div className="text-[10px] text-slate-500 font-medium flex items-center justify-center gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Synergy 99.4% Match</span>
          </div>
        </div>

        {/* Micro guarantee badge */}
        <div className="mt-1.5 pt-1.5 border-t border-slate-100 flex items-center gap-1 text-[9px] font-bold text-slate-500">
          <Shield className="w-2.5 h-2.5 text-blue-600" />
          <span>Zero-Fee Escrow</span>
        </div>
      </div>
    </div>
  );
}
