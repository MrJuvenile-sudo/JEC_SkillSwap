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
      a: "SkillSwap is a free 1-on-1 skill exchange community. Instead of paying money or buying expensive courses, you learn directly from others by sharing your own skills (for example, you help someone learn React, and they teach you Spanish in return)."
    },
    {
      q: "Is SkillSwap really 100% free?",
      a: "Yes! SkillSwap is completely free forever. There are no subscription fees, hidden charges, or credit card requirements. You simply share your time and skills to learn from others."
    },
    {
      q: "How does mutual skill matching work?",
      a: "We match what you want to teach with what someone else wants to learn, and vice versa. When two people match each other's learning goals, you get a 'Perfect 2-Way Match' so both of you can help each other."
    },
    {
      q: "What happens after a swap request is accepted?",
      a: "Once your request is accepted, your private Session Room is ready! You can share a Google Meet or video link, plan your meeting notes, hold your 1-on-1 call, and leave a review afterward."
    },
    {
      q: "How do learning sessions work?",
      a: "Sessions happen online over video call (like Google Meet). Most members split a 1-hour call into 30 minutes of teaching their skill, and 30 minutes of learning their partner's skill."
    },
    {
      q: "What if a skill I want is not in the list?",
      a: "No problem! In your profile, click '+ Add a custom skill' to add any new skill you want. It is saved to your profile right away."
    },
    {
      q: "How does the community stay safe and helpful?",
      a: "After every session, both members give each other a 1 to 5 star rating and a helpful review. Good ratings build your Trust Score and help you find great partners faster."
    },
    {
      q: "Can I say no to a request if I am busy?",
      a: "Yes, of course! You can accept, decline, or chat with any user before deciding to schedule a session."
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-extrabold">
            <HelpCircle className="w-3.5 h-3.5 text-amber-300" />
            <span>Help Center & Common Questions</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-serif font-black tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-base sm:text-lg text-indigo-200 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about sharing skills, finding study partners, and staying safe.
          </p>
        </div>
      </section>

      {/* Accordion FAQ Container */}
      <section className="py-16 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleFAQ(idx)}
                className="w-full text-left p-6 flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
              >
                <span className="text-base sm:text-lg font-extrabold text-slate-900">
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
          <h2 className="text-3xl font-serif font-bold">Have More Questions?</h2>
          <p className="text-blue-100 text-sm">Our friendly community of learners is ready to help you get started.</p>
          <Link
            to={isAuthenticated ? "/explore" : "/register"}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-900 hover:bg-slate-100 rounded-full font-black text-xs shadow-xl transition-all hover:scale-105"
          >
            <span>Start Free Today</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}
