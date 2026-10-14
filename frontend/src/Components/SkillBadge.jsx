import React from "react";
import { BookOpen, Sparkles } from "lucide-react";

export default function SkillBadge({ skill, type = "offered", size = "md" }) {
  const isOffered = type === "offered";

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs font-medium",
    md: "px-2.5 py-1 text-xs font-medium",
    lg: "px-3 py-1.5 text-sm font-semibold",
  };

  const colorClasses = isOffered
    ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
    : "bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full transition-all ${sizeClasses[size]} ${colorClasses}`}
      title={`${isOffered ? "Teaches" : "Wants to learn"}: ${skill.skill_name || skill.name} (${skill.experience_level || "intermediate"})`}
    >
      {isOffered ? (
        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
      ) : (
        <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
      )}
      <span>{skill.skill_name || skill.name}</span>
      {skill.experience_level && (
        <span className="text-[10px] opacity-75 uppercase font-bold tracking-wider ml-0.5">
          • {skill.experience_level.slice(0, 3)}
        </span>
      )}
    </span>
  );
}
