import React from "react";
import { Link } from "react-router-dom";
import { 
  UserPlus, 
  Sparkles, 
  Repeat, 
  Video, 
  Star, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  MessageSquare,
  ShieldCheck,
  Zap
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function HowItWorks() {
  const { isAuthenticated } = useAuth();

  const steps = [
    {
      num: "01",
      icon: UserPlus,
      title: "Create Your Free Profile",
      desc: "Sign up in less than 60 seconds. List the skills you can teach (like React, English, or Math) and the topics you want to learn (like Python or UI/UX Design)."
    },
    {
      num: "02",
      icon: Sparkles,
      title: "Find Your Best Match",
      desc: "Our matching system automatically pairs you with people who want to learn what you can teach and can teach what you want to learn."
    },
    {
      num: "03",
      icon: Repeat,
      title: "Send & Accept Swap Requests",
      desc: "Look through matched profiles, choose the skills you want to exchange, write a short message, and send a swap request. Once accepted, your private session room is ready!"
    },
    {
      num: "04",
      icon: Video,
      title: "Meet 1-on-1 on Video",
      desc: "Open your video meeting link (like Google Meet), follow your shared notes, spend time teaching and learning together, and complete your session."
    },
    {
      num: "05",
      icon: Star,
      title: "Leave Reviews & Build Trust",
      desc: "Give your partner a 1 to 5 star rating and write a short review. Build your Trust Score to earn verified member badges!"
    }
  ];

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-slate-900 font-sans">
      
      {/* Header */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-indigo-950 via-indigo-900 to-slate-900 text-white border-b border-slate-800 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-violet-500/20 blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-extrabold">
            <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span>Simple Step-by-Step Guide</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-serif font-black tracking-tight">
            How SkillSwap Works
          </h1>
          <p className="text-base sm:text-lg text-indigo-200 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about creating your profile, matching with study partners, and learning 1-on-1.
          </p>
        </div>
      </section>

      {/* Workflow Timeline */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="space-y-8">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-xs hover:shadow-xl transition-all flex flex-col sm:flex-row items-start gap-6 group"
              >
                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-4xl font-black text-blue-600 font-serif">
                    {s.num}
                  </span>
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Icon className="w-7 h-7" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    {s.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Best Practices Banner */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold">Helpful Tips for Great Sessions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left text-xs">
            <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700 space-y-1">
              <strong className="text-blue-400 font-extrabold block">1. Split Time Fairly</strong>
              <p className="text-slate-300">Spend 30 minutes teaching your skill, and 30 minutes learning from your partner.</p>
            </div>
            <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700 space-y-1">
              <strong className="text-blue-400 font-extrabold block">2. Plan What to Cover</strong>
              <p className="text-slate-300">Write down a few topics in your shared session notes before starting the video call.</p>
            </div>
            <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700 space-y-1">
              <strong className="text-blue-400 font-extrabold block">3. Leave an Honest Review</strong>
              <p className="text-slate-300">Help the community grow by giving your partner a star rating and quick feedback.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-600 text-white text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold">Ready to Start Learning?</h2>
          <p className="text-blue-100 text-sm">Join thousands of students and learners sharing skills today.</p>
          <Link
            to={isAuthenticated ? "/explore" : "/register"}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-900 hover:bg-slate-100 rounded-full font-black text-xs shadow-xl transition-all hover:scale-105"
          >
            <span>Create Your Free Account</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}
