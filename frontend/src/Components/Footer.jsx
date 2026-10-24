import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Repeat, Globe, Share2, MessageSquare, Mail, Sparkles, ShieldCheck, Zap, Lock, ArrowUp } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Footer() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Exclude pre-footer from Login, Register, Admin as per industry best practices
  const isAuthPage = ["/login", "/register"].includes(location.pathname);
  const isAdminPage = location.pathname.startsWith("/admin");
  const showPrefooter = !isAuthenticated && !isAuthPage && !isAdminPage;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-[#fdfbf7] text-slate-900 font-sans border-t border-slate-200/90">
      
      {/* 1. PRE-FOOTER CTA BANNER (Single Global Prefooter, Excluded from Auth Pages & Admin) */}
      {showPrefooter && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800/80 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Soft Ambient Ambiance (Low Opacity, Zero Glare) */}
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="space-y-3 max-w-2xl text-center md:text-left z-10">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 text-amber-300 border border-amber-400/20 text-xs font-extrabold backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                <span>Zero-Cost 1-on-1 Skill Exchange</span>
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif font-black tracking-tight leading-tight text-white">
                Ready to trade skills 1-on-1 for free?
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                Join thousands of practitioners and lifelong learners worldwide. Teach what you know, master what you need next.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0 z-10">
              <Link
                to="/register"
                onClick={scrollToTop}
                className="px-6 py-3.5 bg-white text-slate-900 hover:bg-slate-100 rounded-2xl text-xs font-black shadow-md transition-all hover:scale-105"
              >
                Get Started Free →
              </Link>
              <Link
                to="/explore"
                onClick={scrollToTop}
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-slate-200 border border-white/20 rounded-2xl text-xs font-bold transition-all backdrop-blur-xs"
              >
                Explore Swappers
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 2. MAIN LIGHT CREAM FOOTER (Industry Best Practices) */}
      <footer className="bg-[#f8f6f0] text-slate-700 py-12 pb-24 md:pb-12 border-t border-slate-200/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            
            {/* Brand Col */}
            <div className="space-y-4 md:col-span-1">
              <Link to="/" onClick={scrollToTop} className="flex items-center gap-2.5 group">
                <img 
                  src="/logo.png" 
                  alt="SkillSwap Logo" 
                  className="w-10 h-10 object-contain rounded-xl shadow-xs group-hover:scale-105 transition-transform" 
                />
                <div className="flex flex-col">
                  <span className="text-xl font-black text-slate-900 leading-tight">SkillSwap</span>
                  <span className="text-[10px] text-blue-600 font-bold tracking-wide">Peer Learning Network</span>
                </div>
              </Link>

              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Empowering peer-to-peer 1-on-1 reciprocal knowledge exchange. Connect with verified mentors and practitioners to co-learn without financial cost.
              </p>

              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-extrabold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  100% Free 1-on-1 Skill Exchange
                </span>
              </div>
            </div>

            {/* Platform Links */}
            <div>
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-4">Platform</h4>
              <ul className="space-y-2.5 text-xs font-bold text-slate-600">
                <li><Link to="/" onClick={scrollToTop} className="hover:text-blue-600 transition-colors">Home Page</Link></li>
                <li><Link to="/explore" onClick={scrollToTop} className="hover:text-blue-600 transition-colors">Explore Swappers</Link></li>
                <li><Link to="/requests" onClick={scrollToTop} className="hover:text-blue-600 transition-colors">Swap Proposals</Link></li>
                <li><Link to="/features" onClick={scrollToTop} className="hover:text-blue-600 transition-colors">Platform Features</Link></li>
                <li><Link to="/how-it-works" onClick={scrollToTop} className="hover:text-blue-600 transition-colors">How It Works</Link></li>
                <li><Link to="/faq" onClick={scrollToTop} className="hover:text-blue-600 transition-colors">Frequently Asked Questions</Link></li>
              </ul>
            </div>

            {/* Popular Skill Tracks */}
            <div>
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-4">Popular Skill Tracks</h4>
              <ul className="space-y-2.5 text-xs font-semibold text-slate-600">
                <li><Link to="/explore?query=React" onClick={scrollToTop} className="hover:text-blue-600 transition-colors">Fullstack Web & React.js</Link></li>
                <li><Link to="/explore?query=Cloud" onClick={scrollToTop} className="hover:text-blue-600 transition-colors">Cloud Computing & AWS DevOps</Link></li>
                <li><Link to="/explore?query=Data" onClick={scrollToTop} className="hover:text-blue-600 transition-colors">Data Structures & Algorithms</Link></li>
                <li><Link to="/explore?query=Figma" onClick={scrollToTop} className="hover:text-blue-600 transition-colors">UI/UX Design & Figma</Link></li>
                <li><Link to="/explore?query=Python" onClick={scrollToTop} className="hover:text-blue-600 transition-colors">Python & Machine Learning</Link></li>
                <li><Link to="/explore?query=Spanish" onClick={scrollToTop} className="hover:text-blue-600 transition-colors">Spanish & Conversation</Link></li>
              </ul>
            </div>

            {/* Trust & Community */}
            <div>
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-4">Trust & Community</h4>
              <ul className="space-y-2.5 text-xs font-medium text-slate-600 mb-4">
                <li>
                  <Link to="/features" onClick={scrollToTop} className="flex items-center gap-1.5 text-slate-800 font-bold hover:text-blue-600 transition-colors">
                    <ShieldCheck className="w-4 h-4 text-blue-600" /> Verified Practitioner Badges
                  </Link>
                </li>
                <li>
                  <Link to="/how-it-works" onClick={scrollToTop} className="flex items-center gap-1.5 text-slate-800 font-bold hover:text-blue-600 transition-colors">
                    <Lock className="w-4 h-4 text-amber-500" /> Peer Review & Trust System
                  </Link>
                </li>
                <li>
                  <Link to="/features" onClick={scrollToTop} className="flex items-center gap-1.5 text-slate-800 font-bold hover:text-blue-600 transition-colors">
                    <Zap className="w-4 h-4 text-emerald-500" /> 1-on-1 Video Session Rooms
                  </Link>
                </li>
              </ul>

              <div className="flex gap-2 pt-1">
                <Link to="/explore" onClick={scrollToTop} title="Browse Directory" className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-blue-600 hover:text-white transition-all shadow-2xs">
                  <Globe className="w-4 h-4" />
                </Link>
                <Link to="/features" onClick={scrollToTop} title="Community Features" className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-blue-600 hover:text-white transition-all shadow-2xs">
                  <MessageSquare className="w-4 h-4" />
                </Link>
                <button onClick={scrollToTop} title="Back to Top" className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-blue-600 hover:text-white transition-all shadow-2xs">
                  <ArrowUp className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500">
            <p>© {new Date().getFullYear()} SkillSwap Network. All rights reserved.</p>
            <button 
              onClick={scrollToTop}
              className="text-slate-600 hover:text-blue-600 font-bold flex items-center gap-1 transition-colors"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
