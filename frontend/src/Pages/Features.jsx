import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Zap, 
  ShieldCheck, 
  Video, 
  Repeat, 
  Star, 
  ArrowRight, 
  Sparkles, 
  Check, 
  X, 
  Users, 
  BookOpen, 
  Clock,
  Layers,
  Globe,
  GraduationCap,
  Code,
  CheckCircle2,
  Terminal,
  Cpu
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Features() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState(0);

  // Interactive Skill Matching Simulator state
  const [mySkill, setMySkill] = useState("React.js Frontend");
  const [targetSkill, setTargetSkill] = useState("Cloud Computing & AWS");

  const coreFeatures = [
    {
      icon: Zap,
      title: "Mutual Skill Matching",
      badge: "Complementary Pairing",
      color: "from-blue-500 to-indigo-600",
      desc: "Our 2-way matching engine pairs peers who offer what you want to learn and want to learn what you can teach."
    },
    {
      icon: GraduationCap,
      title: "Academic & Tech Curriculum Hub",
      badge: "College & Industry Aligned",
      color: "from-cyan-500 to-blue-600",
      desc: "Tailored module catalog for core engineering subjects (DSA, DBMS, Operating Systems, Networks) and modern industry tracks (Full-Stack, AWS, DevOps, AI/ML)."
    },
    {
      icon: ShieldCheck,
      title: "Zero-Fee Skill Exchange",
      badge: "100% Free Forever",
      color: "from-emerald-500 to-teal-600",
      desc: "No subscription fees, credit card requirements, or token paywalls. Trade knowledge 1-on-1 directly with peers."
    },
    {
      icon: Star,
      title: "Peer Review & Trust System",
      badge: "Verified Reputation",
      color: "from-amber-500 to-orange-600",
      desc: "Every 1-on-1 session is backed by mutual reviews and peer karma ratings, ensuring reliable attendance and helpful feedback."
    },
    {
      icon: Video,
      title: "Live Interactive 1-on-1 Room",
      badge: "Integrated Video & Code",
      color: "from-violet-500 to-purple-600",
      desc: "Connect via WebRTC video rooms with collaborative markdown notes, live multi-language code sandbox, and agenda checklists."
    },
    {
      icon: Users,
      title: "Clean 3D Avatar Profiles",
      badge: "Privacy & Identity",
      color: "from-rose-500 to-pink-600",
      desc: "Distinctive character avatars preserving personal privacy while presenting an authentic, professional engineering profile."
    }
  ];

  const mcaFeatures = [
    {
      title: "Data Structures & Algorithms (DSA)",
      topics: ["Arrays, Linked Lists, Trees, Graphs", "Dynamic Programming & Recursion", "Campus Placement Problem Solving"],
      icon: Code
    },
    {
      title: "Database Systems & SQL",
      topics: ["Relational Schemas & Normalization", "SQL Query Optimization & Indexing", "Transactions & ACID Guarantees"],
      icon: Terminal
    },
    {
      title: "Cloud & Distributed Systems",
      topics: ["AWS EC2, S3 & Cloud Architecture", "Docker Containerization & Linux", "System Design & Microservices"],
      icon: Cpu
    }
  ];

  const comparison = [
    { feature: "Financial Cost", traditional: "₹15,000 – ₹60,000 / course", skillswap: "Zero Fees (100% Free Exchange)" },
    { feature: "Learning Model", traditional: "Passive recorded lectures", skillswap: "Interactive 1-on-1 Co-learning" },
    { feature: "Code Debugging", traditional: "None / Automated bot answers", skillswap: "Live screen sharing & code sandbox" },
    { feature: "Curriculum Alignment", traditional: "Generic international syllabus", skillswap: "Curated to Your Stack & Goals" },
    { feature: "Skill Customization", traditional: "Rigid static syllabus", skillswap: "Tailored to your specific goals" },
    { feature: "Networking", traditional: "Isolated self-study", skillswap: "Direct peer engineer connections" }
  ];

  return (
    <div className="min-h-screen bg-[#faf7ee] text-slate-900 font-sans">
      
      {/* Header */}
      <section className="py-16 sm:py-24 border-b border-slate-200/90 bg-gradient-to-b from-[#faf7ee] via-[#f7f2e5] to-[#faf7ee] relative overflow-hidden text-center">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Platform Capabilities & Architecture</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-serif font-black tracking-tight text-slate-900 leading-tight">
            Engineered for 1-on-1 Peer Learning
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
            Explore mutual matching, 1-on-1 live video rooms, code sandbox, and core engineering tracks powering SkillSwap.
          </p>
        </div>
      </section>

      {/* Interactive Feature Architecture Showcase */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xl space-y-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider border border-indigo-100">
              Interactive Preview
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-black text-slate-900">Experience Platform Capabilities</h2>
            <p className="text-slate-600 text-xs sm:text-sm font-medium">Test our interactive modules below.</p>
          </div>

          {/* Tab Controls */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 border-b border-slate-200 pb-4 text-xs font-bold">
            {[
              { label: "⚡ Mutual Matching", icon: Zap },
              { label: "📹 1-on-1 Session Room", icon: Video },
              { label: "⭐ Peer Trust & Ratings", icon: ShieldCheck },
              { label: "🎓 Engineering Curriculum", icon: GraduationCap }
            ].map((tab, idx) => {
              const Icon = tab.icon;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveTab(idx)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl transition-all ${
                    activeTab === idx
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-105"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab 0: Mutual Matching */}
          {activeTab === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200">
              <div className="space-y-4 text-xs">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                  2-Way Skill Matching
                </span>
                <h3 className="text-xl font-bold text-slate-900">Discover Complementary Partners</h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  Select your teaching expertise and learning goal to test our reciprocal matching algorithm:
                </p>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Your Teaching Skill:</label>
                    <select
                      value={mySkill}
                      onChange={(e) => setMySkill(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900"
                    >
                      <option value="React.js Frontend">React.js Frontend</option>
                      <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
                      <option value="Java & Spring Boot">Java & Spring Boot</option>
                      <option value="UI/UX Design & Figma">UI/UX Design & Figma</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Your Learning Goal:</label>
                    <select
                      value={targetSkill}
                      onChange={(e) => setTargetSkill(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900"
                    >
                      <option value="Cloud Computing & AWS">Cloud Computing & AWS</option>
                      <option value="Python & Machine Learning">Python & Machine Learning</option>
                      <option value="System Design">System Design</option>
                      <option value="DBMS & SQL Optimization">DBMS & SQL Optimization</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                  <Sparkles className="w-8 h-8 text-amber-300 fill-amber-300" />
                </div>
                <div>
                  <span className="text-2xl font-black text-slate-900 block">Mutual Match</span>
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Complementary Skills Found</span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-1">
                  <p className="text-slate-600 font-medium">You Teach: <strong className="text-emerald-700">{mySkill}</strong></p>
                  <p className="text-slate-600 font-medium">You Learn: <strong className="text-blue-700">{targetSkill}</strong></p>
                  <p className="text-emerald-600 font-bold text-[11px] pt-1">✓ Verified 1-on-1 Peer Match Available</p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 1: 1-on-1 Video Sandbox Preview */}
          {activeTab === 1 && (
            <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 font-bold text-xs">
                    Session Room Preview
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1">1-on-1 Co-learning Session Room</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> Live Audio/Video Connected
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-3">
                  <div className="flex items-center justify-between text-slate-400 font-bold">
                    <span>Collaborative Notes</span>
                    <span>Markdown Enabled</span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl font-mono text-[11px] text-blue-300 space-y-1">
                    <p>// Session Agenda Notes:</p>
                    <p>1. 00-25 min: React Hooks & Custom State</p>
                    <p>2. 25-50 min: AWS S3 & Cloud Architecture</p>
                  </div>
                </div>

                <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-3">
                  <div className="flex items-center justify-between text-slate-400 font-bold">
                    <span>Live Code Sandbox</span>
                    <span>Multi-Language</span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl font-mono text-[11px] text-emerald-400 space-y-1">
                    <p>function skillExchange(peerA, peerB) &#123;</p>
                    <p>  return peerA.teach(peerB) && peerB.teach(peerA);</p>
                    <p>&#125;</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Peer Review & Trust */}
          {activeTab === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              <div className="bg-amber-50/70 p-6 rounded-3xl border border-amber-200 space-y-3 text-center">
                <Star className="w-10 h-10 text-amber-500 fill-amber-400 mx-auto" />
                <h4 className="text-base font-bold text-slate-900">Peer Karma Rating</h4>
                <p className="text-slate-600 leading-relaxed font-medium">Ratings awarded after every session ensure high teaching quality, punctual attendance, and mutual respect.</p>
              </div>

              <div className="bg-blue-50/70 p-6 rounded-3xl border border-blue-200 space-y-3 text-center">
                <ShieldCheck className="w-10 h-10 text-blue-600 mx-auto" />
                <h4 className="text-base font-bold text-slate-900">Equal Time Commitment</h4>
                <p className="text-slate-600 leading-relaxed font-medium">Both partners commit equal time teaching and learning with zero financial exchange.</p>
              </div>

              <div className="bg-emerald-50/70 p-6 rounded-3xl border border-emerald-200 space-y-3 text-center">
                <Users className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-slate-900">Verified Student Badges</h4>
                <p className="text-slate-600 leading-relaxed font-medium">Badges issued to peers registered with verified college or engineering credentials.</p>
              </div>
            </div>
          )}

          {/* Tab 3: Engineering Curriculum */}
          {activeTab === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-3">
                <Code className="w-8 h-8 text-blue-600" />
                <h4 className="text-base font-bold text-slate-900">DSA & Algorithms</h4>
                <p className="text-slate-600 leading-relaxed font-medium">Arrays, Linked Lists, Trees, Dynamic Programming, and placement coding rounds.</p>
              </div>

              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-3">
                <Terminal className="w-8 h-8 text-indigo-600" />
                <h4 className="text-base font-bold text-slate-900">DBMS & SQL Optimization</h4>
                <p className="text-slate-600 leading-relaxed font-medium">Relational schemas, SQL join optimizations, indexing, and ACID transaction principles.</p>
              </div>

              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-3">
                <Cpu className="w-8 h-8 text-emerald-600" />
                <h4 className="text-base font-bold text-slate-900">Cloud & DevOps</h4>
                <p className="text-slate-600 leading-relaxed font-medium">EC2 server deployment, Docker containerization, S3 buckets, and CI/CD pipelines.</p>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <span className="px-3.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
            Features Overview
          </span>
          <h2 className="text-3xl font-serif font-black text-slate-900">Platform Features</h2>
          <p className="text-slate-600 text-sm font-medium">Built from the ground up for 1-on-1 reciprocal co-mentorship across Indian colleges.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coreFeatures.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 space-y-4 group hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${f.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                    {f.badge}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {f.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Engineering Curriculum Alignment Section */}
      <section className="py-20 bg-blue-50/60 border-y border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="px-3.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
              Academic & Placement Alignment
            </span>
            <h2 className="text-3xl font-serif font-black text-slate-900">College & IT Industry Curriculum Hub</h2>
            <p className="text-slate-600 text-sm font-medium">Tailored for computer science students, engineering scholars, and top tech tracks.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mcaFeatures.map((m, idx) => {
              const Icon = m.icon;
              return (
                <div key={idx} className="bg-white rounded-3xl p-8 border border-blue-200/80 shadow-xs space-y-4 hover:shadow-lg transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{m.title}</h3>
                  <ul className="space-y-2 text-xs font-semibold text-slate-600">
                    {m.topics.map((t, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <h2 className="text-3xl font-serif font-black text-slate-900">Active Peer Learning vs. Paid Recorded Courses</h2>
          <p className="text-slate-600 text-sm font-medium">Compare traditional video platforms with bilateral 1-on-1 co-learning.</p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
          <div className="grid grid-cols-12 bg-slate-900 text-white p-4 font-bold text-xs uppercase tracking-wider">
            <div className="col-span-4">Aspect</div>
            <div className="col-span-4 text-slate-400">Traditional Paid Courses</div>
            <div className="col-span-4 text-blue-400 font-black">SkillSwap 1-on-1 Exchange</div>
          </div>

          <div className="divide-y divide-slate-100">
            {comparison.map((c, idx) => (
              <div key={idx} className="grid grid-cols-12 p-4 text-xs font-semibold items-center hover:bg-slate-50 transition-colors">
                <div className="col-span-4 font-bold text-slate-900">{c.feature}</div>
                <div className="col-span-4 text-slate-500 flex items-center gap-1.5">
                  <X className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{c.traditional}</span>
                </div>
                <div className="col-span-4 text-blue-700 font-bold flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{c.skillswap}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
