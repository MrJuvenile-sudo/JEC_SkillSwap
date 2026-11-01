import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Zap, 
  ShieldCheck, 
  Video, 
  Repeat, 
  Star, 
  Lock, 
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
  Cpu,
  Play,
  Share2,
  Sliders,
  MessageSquare
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Features() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState(0);

  // Interactive Mutual Skill Matching Simulator state
  const [mySkill, setMySkill] = useState("React.js Frontend");
  const [targetSkill, setTargetSkill] = useState("Cloud Computing & AWS");

  const coreFeatures = [
    {
      icon: Zap,
      title: "Mutual Skill Matching",
      badge: "Smart Pairing",
      color: "from-blue-500 to-indigo-600",
      desc: "Our matching system connects you with partners who teach what you want to learn and want to learn what you can teach."
    },
    {
      icon: GraduationCap,
      title: "College & Tech Skill Tracks",
      badge: "Core Tech & College",
      color: "from-cyan-500 to-blue-600",
      desc: "Carefully organized skills for computer science subjects (DSA, SQL, Java, Operating Systems) and popular modern tech (AWS, DevOps, Web, AI)."
    },
    {
      icon: ShieldCheck,
      title: "100% Free Skill Exchange",
      badge: "No Fees Ever",
      color: "from-emerald-500 to-teal-600",
      desc: "No monthly subscriptions, no credit card required, and no hidden fees. Simply trade your skills 1-on-1 directly with peers."
    },
    {
      icon: Lock,
      title: "Peer Reviews & Trust Score",
      badge: "Safe & Verified",
      color: "from-amber-500 to-orange-600",
      desc: "Every 1-on-1 session includes honest star ratings and feedback, keeping sessions friendly, reliable, and high quality."
    },
    {
      icon: Video,
      title: "Live Video & Shared Notes",
      badge: "Google Meet Ready",
      color: "from-violet-500 to-purple-600",
      desc: "Join Google Meet sessions right from your session room with shared notes, code examples, and meeting agendas."
    },
    {
      icon: Users,
      title: "Friendly 3D Avatars",
      badge: "Privacy First",
      color: "from-rose-500 to-pink-600",
      desc: "Clean 3D avatars keep your personal identity private while giving your profile a modern, friendly look."
    }
  ];

  const mcaFeatures = [
    {
      title: "Data Structures & Algorithms (DSA)",
      topics: ["Arrays, Linked Lists, Trees, Graphs", "Sorting & Problem Solving", "Coding Interview Practice"],
      icon: Code
    },
    {
      title: "Database Systems & SQL",
      topics: ["Database Design & Tables", "Writing Fast SQL Queries", "Database Transactions & Safety"],
      icon: Terminal
    },
    {
      title: "Cloud & DevOps",
      topics: ["AWS Cloud Hosting & Storage", "Docker Containers & Setup", "Building Scalable Web Apps"],
      icon: Cpu
    }
  ];

  const comparison = [
    { feature: "Cost", traditional: "$500 - $3,000 per course", skillswap: "100% Free (Always)" },
    { feature: "How You Learn", traditional: "Watching pre-recorded videos alone", skillswap: "Hands-on 1-on-1 live practice" },
    { feature: "Direct Help", traditional: "None / automated quizzes", skillswap: "Real-time answers from a partner" },
    { feature: "Topics", traditional: "One-size-fits-all syllabus", skillswap: "Focused on exactly what you need" },
    { feature: "Flexibility", traditional: "Rigid course schedule", skillswap: "Schedule times that work for both" },
    { feature: "Connections", traditional: "Studying completely alone", skillswap: "Build real relationships with peers" }
  ];

  return (
    <div className="min-h-screen bg-[#faf7ee] text-slate-900 font-sans">
      
      {/* Header */}
      <section className="py-16 sm:py-24 border-b border-slate-200/90 bg-gradient-to-b from-[#faf7ee] via-[#f7f2e5] to-[#faf7ee] relative overflow-hidden text-center">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-spin" style={{ animationDuration: '4s' }} />
            <span>Platform Features & How It Works</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-serif font-black tracking-tight text-slate-900 leading-tight">
            Built for Easy 1-on-1 Skill Sharing
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
            Explore smart skill matching, private 3D avatars, live video rooms, and curated tech topics on SkillSwap.
          </p>
        </div>
      </section>

      {/* Interactive Feature Architecture Showcase */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xl space-y-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-black uppercase tracking-wider border border-indigo-100">
              Interactive Preview
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-black text-slate-900">Try Out Key Features</h2>
            <p className="text-slate-600 text-xs sm:text-sm font-medium">Click the tabs below to test live interactive tools.</p>
          </div>

          {/* Tab Controls */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 border-b border-slate-200 pb-4 text-xs font-extrabold">
            {[
              { label: "⚡ Skill Matching", icon: Zap },
              { label: "📹 1-on-1 Video Room", icon: Video },
              { label: "🔒 Peer Trust System", icon: ShieldCheck },
              { label: "🎓 Tech & College Topics", icon: GraduationCap }
            ].map((tab, idx) => {
              const Icon = tab.icon;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveTab(idx)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl transition-all cursor-pointer ${
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

          {/* Tab 0: Mutual Skill Matching Calculator */}
          {activeTab === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200">
              <div className="space-y-4 text-xs">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[11px]">
                  Mutual Skill Matching
                </span>
                <h3 className="text-xl font-black text-slate-900">Finds Your Best Skill Match</h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  Pick what you want to teach and what you want to learn to see how we pair you with the right study partner:
                </p>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">What you can teach:</label>
                    <select
                      value={mySkill}
                      onChange={(e) => setMySkill(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 cursor-pointer"
                    >
                      <option value="React.js Frontend">React.js Frontend</option>
                      <option value="Data Structures & DSA">Data Structures & DSA</option>
                      <option value="Java & Spring Boot">Java & Spring Boot</option>
                      <option value="UI/UX Design & Figma">UI/UX Design & Figma</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">What you want to learn:</label>
                    <select
                      value={targetSkill}
                      onChange={(e) => setTargetSkill(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 cursor-pointer"
                    >
                      <option value="Cloud Computing & AWS">Cloud Computing & AWS</option>
                      <option value="Python & Machine Learning">Python & Machine Learning</option>
                      <option value="Spanish & Conversation">Spanish & Conversation</option>
                      <option value="DBMS & SQL Optimization">DBMS & SQL Optimization</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                  <Sparkles className="w-8 h-8 text-amber-300 fill-amber-300 animate-pulse" />
                </div>
                <div>
                  <span className="text-3xl font-black text-slate-900 block">98.6%</span>
                  <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider">Skill Match Score</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs space-y-1">
                  <p className="text-slate-600 font-medium">You Teach: <strong className="text-emerald-700">{mySkill}</strong></p>
                  <p className="text-slate-600 font-medium">You Learn: <strong className="text-blue-700">{targetSkill}</strong></p>
                  <p className="text-emerald-600 font-bold text-[11px] pt-1">✓ Perfect Match Found in Community Directory</p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 1: 1-on-1 Video Sandbox Preview */}
          {activeTab === 1 && (
            <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 font-extrabold text-xs">
                    Live Session Room Preview
                  </span>
                  <h3 className="text-lg font-black text-white mt-1">1-on-1 Learning Session Room</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> Live Meeting Active
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-3">
                  <div className="flex items-center justify-between text-slate-400 font-bold">
                    <span>Shared Notes & Checklist</span>
                    <span>Clean Markdown</span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl font-mono text-[11px] text-blue-300 space-y-1">
                    <p>// Meeting Plan:</p>
                    <p>1. 00-25 min: React State & Components</p>
                    <p>2. 25-50 min: AWS Cloud Setup & Hosting</p>
                  </div>
                </div>

                <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-3">
                  <div className="flex items-center justify-between text-slate-400 font-bold">
                    <span>Code Box</span>
                    <span>JavaScript</span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl font-mono text-[11px] text-emerald-400 space-y-1">
                    <p>function swapSkills(personA, personB) &#123;</p>
                    <p>  return personA.teach(personB) && personB.teach(personA);</p>
                    <p>&#125;</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Reviews & Trust */}
          {activeTab === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              <div className="bg-amber-50/70 p-6 rounded-3xl border border-amber-200 space-y-3 text-center">
                <ShieldCheck className="w-10 h-10 text-amber-600 mx-auto" />
                <h4 className="text-base font-black text-slate-900">Peer Reviews</h4>
                <p className="text-slate-600 leading-relaxed font-medium">Ratings and reviews given after each 1-on-1 session help keep the community friendly and helpful.</p>
              </div>

              <div className="bg-blue-50/70 p-6 rounded-3xl border border-blue-200 space-y-3 text-center">
                <Lock className="w-10 h-10 text-blue-600 mx-auto" />
                <h4 className="text-base font-black text-slate-900">Fair Time Guarantee</h4>
                <p className="text-slate-600 leading-relaxed font-medium">Both learning partners get equal time to teach and learn with zero money involved.</p>
              </div>

              <div className="bg-emerald-50/70 p-6 rounded-3xl border border-emerald-200 space-y-3 text-center">
                <Users className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-base font-black text-slate-900">Verified Member Badges</h4>
                <p className="text-slate-600 leading-relaxed font-medium">Badges show active students, verified college members, and top mentors.</p>
              </div>
            </div>
          )}

          {/* Tab 3: Tech & Academic Hub */}
          {activeTab === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-3">
                <Code className="w-8 h-8 text-blue-600" />
                <h4 className="text-base font-black text-slate-900">DSA & Problem Solving</h4>
                <p className="text-slate-600 leading-relaxed font-medium">Arrays, Linked Lists, Trees, Dynamic Programming, and LeetCode problem solving.</p>
              </div>

              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-3">
                <Terminal className="w-8 h-8 text-indigo-600" />
                <h4 className="text-base font-black text-slate-900">DBMS & SQL Queries</h4>
                <p className="text-slate-600 leading-relaxed font-medium">Database tables, fast SQL queries, joins, and transactions.</p>
              </div>

              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-3">
                <Cpu className="w-8 h-8 text-emerald-600" />
                <h4 className="text-base font-black text-slate-900">AWS & Cloud DevOps</h4>
                <p className="text-slate-600 leading-relaxed font-medium">Cloud server setup, Docker containers, file storage, and website hosting.</p>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-black uppercase tracking-wider">
            Key Advantages
          </span>
          <h2 className="text-3xl font-serif font-black text-slate-900">Platform Features</h2>
          <p className="text-slate-600 text-sm font-medium">Built from the ground up for free 1-on-1 skill sharing and study partners.</p>
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
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                    {f.badge}
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
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

      {/* College & Tech Specialization Section */}
      <section className="py-20 bg-blue-50/60 border-y border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-black uppercase tracking-wider">
              College & Tech Skills
            </span>
            <h2 className="text-3xl font-serif font-black text-slate-900">Popular Tech & College Courses</h2>
            <p className="text-slate-600 text-sm font-medium">Tailored for college students, software engineers, and learners preparing for tech careers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mcaFeatures.map((m, idx) => {
              const Icon = m.icon;
              return (
                <div key={idx} className="bg-white rounded-3xl p-8 border border-blue-200/80 shadow-xs space-y-4 hover:shadow-lg transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900">{m.title}</h3>
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
          <h2 className="text-3xl font-serif font-black text-slate-900">Why 1-on-1 Skill Swapping Beats Paid Courses</h2>
          <p className="text-slate-600 text-sm font-medium">Compare recorded video tutorials with hands-on 1-on-1 learning.</p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
          <div className="grid grid-cols-12 bg-slate-900 text-white p-4 font-bold text-xs uppercase tracking-wider">
            <div className="col-span-4">Aspect</div>
            <div className="col-span-4 text-slate-400">Paid Recorded Courses</div>
            <div className="col-span-4 text-blue-400 font-black">SkillSwap 1-on-1 Learning</div>
          </div>

          <div className="divide-y divide-slate-100">
            {comparison.map((c, idx) => (
              <div key={idx} className="grid grid-cols-12 p-4 text-xs font-semibold items-center hover:bg-slate-50 transition-colors">
                <div className="col-span-4 font-extrabold text-slate-900">{c.feature}</div>
                <div className="col-span-4 text-slate-500 flex items-center gap-1.5">
                  <X className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{c.traditional}</span>
                </div>
                <div className="col-span-4 text-blue-700 font-extrabold flex items-center gap-1.5">
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
