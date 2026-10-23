import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, HelpCircle, ArrowRight, Sparkles, MessageSquare } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function FAQ() {
  const { isAuthenticated } = useAuth();
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "What is SkillSwap?",
      a: "SkillSwap is a 1-on-1 peer skill exchange platform. Instead of paying money or purchasing subscription courses, users trade expertise directly (e.g., you teach React or JavaScript to a peer, and they teach you UI/UX design or DSA in return)."
    },
    {
      q: "Is SkillSwap really 100% free?",
      a: "Yes! Zero fees forever. There are no subscription tiers, hidden token fees, or credit card requirements. You invest your time and knowledge to learn from other practitioners."
    },
    {
      q: "How does the mutual matching algorithm work?",
      a: "Our algorithm compares your listed offered skills (skills you can teach) and wanted skills (topics you want to learn) with thousands of active profiles. It prioritizes 2-way matches where two users complement each other's learning goals."
    },
    {
      q: "What happens after my swap proposal is accepted?",
      a: "Once an exchange proposal is accepted, an Active Exchange Session Room is automatically generated. You can conduct your 1-on-1 session with built-in video, live code sandbox, shared notes, and leave star reviews."
    },
    {
      q: "How are sessions conducted?",
      a: "Sessions take place via built-in WebRTC video or an external meeting link. Typically, users split a 1-hour session into 30 minutes of teaching one skill and 30 minutes of learning the partner's skill."
    },
    {
      q: "What if a skill I want to learn is not listed in the catalog?",
      a: "No problem! When editing your profile, click '+ Add a custom skill' to create a custom topic. It will instantly be added to your profile and the global master catalog."
    },
    {
      q: "How is user trust and quality maintained?",
      a: "Every session ends with mutual 1-to-5 star rating reviews and feedback comments. High ratings increase your peer trust score and feature your profile in top recommendation lists."
    },
    {
      q: "Can I decline a swap proposal if I'm busy?",
      a: "Absolutely. You can accept, decline, or message any user before agreeing to schedule a 1-on-1 co-learning session."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-slate-900 font-sans">
      
      {/* Header */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-indigo-950 via-indigo-900 to-slate-900 text-white border-b border-slate-800 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-bold">
            <HelpCircle className="w-3.5 h-3.5 text-amber-300" />
            <span>Help Center & Knowledge Base</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-serif font-black tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-base sm:text-lg text-indigo-200 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about peer skill exchange, matching algorithms, and session safety.
          </p>
        </div>
      </section>

      {/* Accordion FAQ Container */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleFAQ(idx)}
                className="w-full text-left p-6 flex items-center justify-between gap-4 focus:outline-none"
              >
                <span className="text-base sm:text-lg font-bold text-slate-900">
                  {faq.q}
                </span>
                <div className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 transition-transform ${isOpen ? "rotate-180 bg-blue-600 text-white" : "text-slate-500"}`}>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {isOpen && (
                <div className="px-6 pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4 bg-slate-50/50">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-600 text-white text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold">Still Have Questions?</h2>
          <p className="text-blue-100 text-sm">Create your profile and start exchanging skills today.</p>
          <Link
            to={isAuthenticated ? "/explore" : "/register"}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-900 hover:bg-slate-100 rounded-full font-bold text-xs shadow-xl transition-all hover:scale-105"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}
