import React from "react";
import { Loader2 } from "lucide-react";

export default function LoadingSpinner({ label = "Loading SkillSwap..." }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 min-h-[300px]">
      <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-3" />
      <p className="text-slate-600 font-medium text-sm">{label}</p>
    </div>
  );
}
