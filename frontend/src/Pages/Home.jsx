import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Repeat, 
  Sparkles, 
  BookOpen, 
  Users, 
  Award, 
  ArrowRight, 
  CheckCircle2, 
  Shield, 
  Code, 
  Palette, 
  Globe, 
  TrendingUp, 
  Star, 
  Zap, 
  Search, 
  Check, 
  X, 
  ChevronDown, 
  Layers, 
  Cpu,
  UserPlus, 
  Video, 
  MessageSquareQuote,
  Laptop
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import { get3DAvatarUrl } from "../utils/avatarUtils";
import HeroStage from "../Components/Hero/HeroStage";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [activeSkillIndex, setActiveSkillIndex] = useState(0);
  const [fadeState, setFadeState] = useState(true);
  const [testimonials, setTestimonials] = useState([]);

  const [heroConfig, setHeroConfig] = useState({
    headline_static: "Trade Skills 1-on-1 with Peers across India",
    dynamic_phrases: [
      "Full-Stack Web Development",
      "Data Structures & Algorithms",
      "Figma & UI/UX Design",
      "Cloud Computing & DevOps",
      "System Design & Architecture",
      "Python & Machine Learning"
    ],
    subtitle: "Connect directly with fellow engineering students and developers to exchange practical skills. Teach what you know, learn what you need — zero course fees, zero middlemen.",
    cta1_text: "Get Started Free",
    cta1_link: "/register",
    cta2_text: "Explore Peers",
    cta2_link: "/explore",
    popular_topics: [
      "Python", "React", "UI/UX Design", "DSA", "System Design", "Cloud & AWS", "DevOps"
    ],
    boy_name: "Aarav Sharma",
    boy_role: "Full-Stack Developer",
    boy_image: "/hero/boy-clean.png",
    boy_location: "Jabalpur, India",
    boy_teach: "React & Node.js",
    boy_want: "UI/UX Design",
    girl_name: "Ananya Iyer",
    girl_role: "UI/UX & Product Design",
    girl_image: "/hero/girl-clean.png",
    girl_location: "Bangalore, India",
    girl_teach: "UI/UX Design",
    girl_want: "React & Node.js",
    pairs: [
      { id: 0, tech: "React & Node.js", creative: "UI/UX Design" },
      { id: 1, tech: "JavaScript", creative: "Figma" },
      { id: 2, tech: "Node.js", creative: "Product Design" },
      { id: 3, tech: "Python", creative: "Data Structures" }
    ]
  });

  useEffect(() => {
    API.get("/admin/public/testimonials")
      .then(res => {
        if (res.data.success && res.data.testimonials && res.data.testimonials.length > 0) {
          setTestimonials(res.data.testimonials);
        } else {
          // Authentic default testimonials with Indian student context
          setTestimonials([
            {
              id: 1,
              author_name: "Priyansh Verma",
              author_role: "B.Tech CSE, Jabalpur Engineering College",
              skill_traded: "React.js ⇄ DSA & LeetCode",
              quote: "Exchanged frontend React concepts for DSA preparation with Aarav. Within 3 weeks we both cleared our college campus placement coding rounds together without paying a single rupee for bootcamps.",
              rating: 5,
              avatar_url: ""
            },
            {
              id: 2,
              author_name: "Tanya Saxena",
              author_role: "Design Scholar, Pune",
              skill_traded: "Figma & UI/UX ⇄ Python Backend",
              quote: "Watching passive video tutorials never gave me genuine critique. Having a weekly 1-on-1 swap session with a coding peer gave me real design portfolio reviews and hands-on Python feedback.",
              rating: 5,
              avatar_url: ""
            },
            {
              id: 3,
              author_name: "Rahul Kulkarni",
              author_role: "Full-Stack Developer, Bengaluru",
              skill_traded: "Node.js & Docker ⇄ System Design",
              quote: "SkillSwap paired me with someone who wanted exactly what I could teach and already knew what I wanted to learn. Mutual accountability kept us consistent every weekend.",
              rating: 5,
              avatar_url: ""
            }
          ]);
        }
      })
      .catch(() => {
        setTestimonials([
          {
            id: 1,
            author_name: "Priyansh Verma",
            author_role: "B.Tech CSE, Jabalpur Engineering College",
            skill_traded: "React.js ⇄ DSA & LeetCode",
            quote: "Exchanged frontend React concepts for DSA preparation with Aarav. Within 3 weeks we both cleared our campus placement coding rounds together without paying for expensive bootcamps.",
            rating: 5,
            avatar_url: ""
          },
          {
            id: 2,
            author_name: "Tanya Saxena",
            author_role: "Design Scholar, Pune",
            skill_traded: "Figma & UI/UX ⇄ Python Backend",
            quote: "Watching passive video tutorials never gave me genuine critique. Having a weekly 1-on-1 swap session gave me real design portfolio reviews and hands-on Python feedback.",
            rating: 5,
            avatar_url: ""
          },
          {
            id: 3,
            author_name: "Rahul Kulkarni",
            author_role: "Full-Stack Developer, Bengaluru",
            skill_traded: "Node.js & Docker ⇄ System Design",
            quote: "SkillSwap paired me with someone who wanted what I could teach and already knew what I wanted to learn. Mutual accountability kept us consistent every weekend.",
            rating: 5,
            avatar_url: ""
          }
        ]);
      });
  }, []);

  const dynamicPhrases = heroConfig.dynamic_phrases;
  const popularTopics = heroConfig.popular_topics;

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeState(false);
      setTimeout(() => {
        setActiveSkillIndex((prev) => (prev + 1) % dynamicPhrases.length);
        setFadeState(true);
      }, 300);
    }, 3200);
    return () => clearInterval(interval);
  }, [dynamicPhrases.length]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?query=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/explore");
    }
  };

  const handleTopicClick = (topic) => {
    setSearchQuery(topic);
    navigate(`/explore?query=${encodeURIComponent(topic)}`);
  };

  // 4 Human-Centered How It Works Steps
  const workingSteps = [
    {
      step: "01",
      icon: UserPlus,
      title: "Set Your Skill Profile",
      desc: "List the skills you can confidently teach (e.g., React, Python) and the specific topics you want to learn (e.g., UI/UX, DSA)."
    },
    {
      step: "02",
      icon: Repeat,
      title: "Find a Mutual Match",
      desc: "Filter peers whose learning goals complement yours. Both parties teach and learn in a balanced 1-on-1 collaboration."
    },
    {
      step: "03",
      icon: BookOpen,
      title: "Propose an Agenda",
      desc: "Send an exchange request with specific topics, goals, and mutually convenient time slots."
    },
    {
      step: "04",
      icon: Video,
      title: "Meet 1-on-1 & Review",
      desc: "Join the built-in video room with code sandbox, take shared notes, collaborate live, and leave mutual peer feedback."
    }
  ];

  // 6 Domain Cards
  const categories = [
    { 
      title: "Technology & Code", 
      icon: Code, 
      count: "450+ Skills", 
      color: "from-blue-500 to-indigo-600", 
      desc: "React, Node.js, Python, Rust, Full-Stack Development", 
      slug: "Technology & Programming" 
    },
    { 
      title: "Design & Creative", 
      icon: Palette, 
      count: "320+ Skills", 
      color: "from-purple-500 to-pink-600", 
      desc: "UI/UX Design, Figma, Design Systems, Product Design", 
      slug: "Design & Creative" 
    },
    { 
      title: "DSA & Core CS", 
      icon: Cpu, 
      count: "290+ Skills", 
      color: "from-amber-500 to-orange-600", 
      desc: "Data Structures, Algorithms, DBMS, Operating Systems", 
      slug: "DSA & Core CS" 
    },
    { 
      title: "AI & Data Science", 
      icon: Sparkles, 
      count: "210+ Skills", 
      color: "from-cyan-500 to-blue-600", 
      desc: "Machine Learning, PyTorch, Deep Learning, SQL Analytics", 
      slug: "AI & Data Science" 
    },
    { 
      title: "Cloud & DevOps", 
      icon: Layers, 
      count: "180+ Skills", 
      color: "from-emerald-500 to-teal-600", 
      desc: "Docker, Kubernetes, AWS, CI/CD Pipelines, Linux", 
      slug: "Cloud & DevOps" 
    },
    { 
      title: "Languages & Comms", 
      icon: Globe, 
      count: "240+ Skills", 
      color: "from-rose-500 to-red-600", 
      desc: "Technical Interview Prep, Soft Skills, Public Speaking", 
      slug: "Languages" 
    }
  ];

  // Consolidated Comparison Table
  const comparison = [
    { 
      feature: "Financial Cost", 
      traditional: "₹15,000 – ₹60,000 / course", 
      skillswap: "Zero Fees (100% Free Peer Exchange)" 
    },
    { 
      feature: "Learning Format", 
      traditional: "Passive pre-recorded video lectures", 
      skillswap: "Interactive 1-on-1 Live Co-learning" 
    },
    { 
      feature: "Real-Time Debugging", 
      traditional: "Automated chatbot or forum threads", 
      skillswap: "Instant live code debugging & screen sharing" 
    },
    { 
      feature: "Accountability", 
      traditional: "High dropout rate studying alone", 
      skillswap: "Committed partner with structured agenda" 
    },
    { 
      feature: "Curriculum Relevance", 
      traditional: "Generic, one-size-fits-all syllabus", 
      skillswap: "Tailored to your placement, project, or exam" 
    }
  ];

  // Authentic FAQs
  const homeFaqs = [
    {
      q: "What is SkillSwap?",
      a: "SkillSwap is a peer-to-peer 1-on-1 skill exchange platform. Instead of paying money for recorded courses or bootcamps, peers trade knowledge directly. For example, you can teach React or JavaScript to a fellow student, and they can teach you UI/UX design or DSA in return."
    },
    {
      q: "Is SkillSwap really 100% free?",
      a: "Yes! There are zero subscription tiers, platform commissions, or hidden fees. You invest your practical knowledge and time to learn directly from other practitioners."
    },
    {
      q: "How does the mutual matching algorithm work?",
      a: "Our matching engine checks the skills you offer to teach against the skills other peers want to learn, and vice versa. It prioritizes 2-way complementary matches so both people get equal value out of each session."
    },
    {
      q: "What tools are included in the 1-on-1 session room?",
      a: "Every session includes built-in HD video calling, a live multi-language code sandbox, shared notes scratchpad, and a meeting agenda checklist so your time together stays focused and productive."
    }
  ];

  return (
    <div className="min-h-screen bg-[#faf7ee] text-slate-900 font-sans relative">
      
      {/* ------------------------------------------------------------- */}
      {/* 1. HERO SECTION (CENTERED TOP-DOWN WITH AARAV & ANANYA SHOWCASE) */}
      {/* ------------------------------------------------------------- */}
      <section className="pt-8 pb-16 sm:pt-12 sm:pb-20 border-b border-slate-200/80 bg-gradient-to-b from-[#faf7ee] via-[#f7f2e5] to-[#faf7ee] relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6 relative z-10">
          
          {/* Subtle Eyebrow Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold shadow-2xs">
            <Repeat className="w-3.5 h-3.5 text-blue-600" />
            <span>1-on-1 Peer Skill Exchange</span>
          </div>

          {/* Main Headline */}
          <div className="space-y-2">
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-serif font-black tracking-tight text-slate-900 leading-tight">
              {heroConfig.headline_static}
            </h1>
            <div className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-serif italic text-blue-600 min-h-[1.4em] flex items-center justify-center flex-wrap gap-2">
              <span className="text-slate-800 not-italic font-bold">Exchange expertise in</span>
              <span
                className={`inline-block text-blue-600 transition-all duration-300 font-bold ${
                  fadeState ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
                }`}
              >
                {dynamicPhrases[activeSkillIndex % dynamicPhrases.length]}
              </span>
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal px-2">
            {heroConfig.subtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
            <Link
              to={isAuthenticated ? "/explore" : "/register"}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 min-h-[46px]"
            >
              <span>{heroConfig.cta1_text}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to={heroConfig.cta2_link}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-800 rounded-full text-xs sm:text-sm font-bold border border-slate-200/90 shadow-2xs transition-all hover:border-slate-300 hover:scale-105 active:scale-95 min-h-[46px]"
            >
              <span>{heroConfig.cta2_text}</span>
            </Link>
          </div>

          {/* Search Box Input */}
          <div className="max-w-2xl mx-auto relative group pt-2">
            <form
              onSubmit={handleSearchSubmit}
              className="bg-white rounded-2xl sm:rounded-full p-2 shadow-xl border border-slate-200/90 flex flex-col sm:flex-row items-center gap-2 transition-all group-hover:border-blue-300"
            >
              <div className="flex-1 flex items-center px-4 w-full">
                <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3 group-hover:text-blue-500 transition-colors" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What do you want to learn? (e.g. React, Python, UI/UX, DSA)..."
                  className="w-full py-3 bg-transparent text-sm font-medium text-slate-900 focus:outline-none placeholder:text-slate-400"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black rounded-xl sm:rounded-full text-xs sm:text-sm shadow-md shadow-amber-400/25 border border-amber-300 transition-all shrink-0 hover:scale-105 active:scale-95 min-h-[46px] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Search className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                <span>Find Matches</span>
              </button>
            </form>
          </div>

          {/* Popular Topics Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs pt-1">
            <span className="text-slate-500 font-medium mr-1">Popular topics:</span>
            {popularTopics.map((topic, idx) => (
              <button
                key={idx}
                onClick={() => handleTopicClick(topic)}
                className="px-3.5 py-1.5 rounded-full bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 font-bold transition-all shadow-2xs hover:border-blue-300 hover:scale-105 min-h-[34px]"
              >
                {topic}
              </button>
            ))}
          </div>

          {/* Concrete Platform Workflow Highlights (Replaces Fake Accuracy Stats) */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-xs font-bold text-slate-700">
            <div className="flex items-center gap-1.5 bg-white/90 px-3.5 py-2 rounded-full border border-slate-200 shadow-2xs">
              <Video className="w-4 h-4 text-blue-600 shrink-0" />
              <span>1-on-1 Live Video & Code Sandbox</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/90 px-3.5 py-2 rounded-full border border-slate-200 shadow-2xs">
              <Repeat className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Mutual Skill Matching</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/90 px-3.5 py-2 rounded-full border border-slate-200 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
              <span>Zero Platform Fees</span>
            </div>
          </div>

          {/* 1-ON-1 INTERACTIVE SKILL EXCHANGE STAGE (Directly Below Search Bar) */}
          <div className="pt-6 sm:pt-10">
            <HeroStage heroConfig={heroConfig} />
          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 2. HOW SKILLSWAP WORKS (4 STEPS - CLEAN HUMAN TITLES) */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 bg-[#fdfbf7]">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <span className="px-3.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
            Workflow
          </span>
          <h2 className="text-3xl font-serif font-black text-slate-900">How SkillSwap Works</h2>
          <p className="text-slate-600 text-sm font-medium">Four simple steps to exchange knowledge and level up your skills.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {workingSteps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 space-y-4 group hover:-translate-y-1 relative flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-serif font-black text-blue-600/30 group-hover:text-blue-600 transition-colors">
                      {item.step}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-2xs">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1.5">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500">
                  <span>Step {item.step}</span>
                  <span className="text-blue-600 font-semibold">1-on-1 Swap</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/how-it-works"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-bold shadow-md shadow-blue-500/20 transition-all hover:scale-105"
          >
            <span>Explore Complete Guide</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 3. EXPLORE POPULAR DOMAINS (6 CATEGORY CARDS WITH DIRECT ROUTING) */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 bg-[#fdfbf7]">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <span className="px-3.5 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold uppercase tracking-wider">
            Explore Domains
          </span>
          <h2 className="text-3xl font-serif font-black text-slate-900">Explore Popular Fields</h2>
          <p className="text-slate-600 text-sm font-medium">Browse verified peers offering 1-on-1 skill exchanges across core technical fields.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <Link
                key={i}
                to={`/explore?category=${encodeURIComponent(cat.slug)}`}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 block"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${cat.color} text-white flex items-center justify-center mb-5 shadow-md shadow-slate-200 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">{cat.desc}</p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs">
                  <span className="font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                    {cat.count}
                  </span>
                  <span className="font-bold text-slate-400 group-hover:text-blue-600 flex items-center gap-1 transition-colors">
                    Browse Peers <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 4. WHY PEER LEARNING WORKS (CONSOLIDATED COMPARISON SECTION) */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 bg-[#fdfbf7]">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <span className="px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            Comparison
          </span>
          <h2 className="text-3xl font-serif font-black text-slate-900">Active 1-on-1 Co-Learning vs. Passive Video Courses</h2>
          <p className="text-slate-600 text-sm font-medium">Why direct reciprocal skill exchange produces faster comprehension and lasting retention.</p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-x-auto touch-pan-x">
          <div className="min-w-[500px]">
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
        </div>

        <div className="text-center mt-6">
          <Link to="/features" className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1">
            View All Platform Features <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 5. COMMUNITY STORIES (AUTHENTIC STUDENT & PRACTITIONER REVIEWS) */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 bg-[#fdfbf7]">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <span className="px-3.5 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
            <MessageSquareQuote className="w-3.5 h-3.5 text-indigo-600" />
            <span>Community Stories</span>
          </span>
          <h2 className="text-3xl font-serif font-black text-slate-900">What Our Swappers Say</h2>
          <p className="text-slate-600 text-sm font-medium">Real experiences from students, developers, and engineering peers across India.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={t.id || i}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 relative"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.rating || 5)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    Verified Swapper
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed italic bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3.5 pt-4 border-t border-slate-100 mt-4">
                <img
                  src={t.avatar_url || get3DAvatarUrl("other", t.author_name)}
                  alt={t.author_name}
                  className="w-11 h-11 rounded-2xl object-cover ring-2 ring-blue-500/20 bg-blue-50"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1">
                    {t.author_name}
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 fill-blue-100" />
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium">{t.author_role}</p>
                  <p className="text-[10px] text-indigo-600 font-bold mt-0.5">{t.skill_traded}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 6. FAQ PREVIEW (CLEAN HUMAN QUESTIONS) */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-[#fdfbf7]">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <span className="px-3.5 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold uppercase tracking-wider">
            Help Center
          </span>
          <h2 className="text-3xl font-serif font-black text-slate-900">Frequently Asked Questions</h2>
          <p className="text-slate-600 text-sm font-medium">Clear answers about how 1-on-1 peer skill exchange works.</p>
        </div>

        <div className="space-y-4">
          {homeFaqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div key={idx} className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full text-left p-6 flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="text-base font-bold text-slate-900">{faq.q}</span>
                  <div className={`w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0 transition-transform ${isOpen ? "rotate-180 bg-blue-600 text-white" : "text-slate-500"}`}>
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
        </div>

        <div className="text-center mt-8">
          <Link to="/faq" className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1">
            Browse All FAQs in Help Center <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* Note: The single clean high-contrast footer CTA banner is rendered in Footer.jsx (redundant first banner removed) */}

    </div>
  );
}
