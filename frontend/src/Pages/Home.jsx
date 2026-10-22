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
  Music,
  Star,
  Zap,
  Search,
  Check,
  X,
  Lock,
  ChevronDown,
  Layers,
  MessageSquare,
  DollarSign,
  UserCheck,
  Target,
  Flame,
  AlertTriangle,
  UserPlus,
  Video,
  MessageSquareQuote,
  Laptop,
  Tablet
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
  const [heroStats, setHeroStats] = useState({
    stat1_value: "14,200+",
    stat1_label: "Swaps Completed",
    stat2_value: "99.4%",
    stat2_label: "Synergy Match Accuracy",
    stat3_value: "4.9 / 5",
    stat3_label: "Average Karma"
  });

  const [heroConfig, setHeroConfig] = useState({
    pill1_text: "Verified Reciprocal Peer-to-Peer Learning Network",
    pill2_text: "Live AI Synergy Matching Active",
    headline_static: "Teach what you know.",
    headline_dynamic_prefix: "Master",
    dynamic_phrases: [
      "what you need next.",
      "Data Structures & Algorithms.",
      "Cloud Computing & AWS.",
      "System Design & DevOps.",
      "Figma & UI/UX Design.",
      "Python & Machine Learning."
    ],
    subtitle: "Trade expertise 1-on-1 with verified practitioners. SkillSwap matches schedule, levels, and mutual topics so you co-learn faster for free.",
    cta1_text: "Start Swapping",
    cta1_link: "/register",
    cta2_text: "Explore Skills",
    cta2_link: "/explore",
    popular_topics: [
      "Python", "Figma", "React", "Spanish", "Machine Learning", "System Design", "Prompt Engineering"
    ],
    boy_name: "Aarav Sharma",
    boy_role: "AI & ML Specialist",
    boy_image: "/hero/boy-tech.webp",
    boy_teach: "Machine Learning",
    boy_want: "UI/UX Design",
    girl_name: "Ananya Iyer",
    girl_role: "Product & UI/UX Designer",
    girl_image: "/hero/girl-creative.png",
    girl_teach: "UI/UX Design",
    girl_want: "Machine Learning",
    pairs: [
      { id: 0, tech: "Machine Learning", creative: "UI/UX Design" },
      { id: 1, tech: "Python", creative: "Spanish" },
      { id: 2, tech: "Data Science", creative: "Digital Art" },
      { id: 3, tech: "System Design", creative: "Brand Strategy" }
    ]
  });

  useEffect(() => {
    API.get("/admin/public/testimonials")
      .then(res => {
        if (res.data.success && res.data.testimonials) {
          setTestimonials(res.data.testimonials);
        }
      })
      .catch(err => {
        console.log("No testimonials loaded");
      });

    API.get("/admin/public/settings")
      .then(res => {
        if (res.data.success && res.data.settings) {
          const s = res.data.settings;
          setHeroStats({
            stat1_value: s.hero_stat1_value || "14,200+",
            stat1_label: s.hero_stat1_label || "Swaps Completed",
            stat2_value: s.hero_stat2_value || "99.4%",
            stat2_label: s.hero_stat2_label || "Synergy Match Accuracy",
            stat3_value: s.hero_stat3_value || "4.9 / 5",
            stat3_label: s.hero_stat3_label || "Average Karma"
          });

          const parsedPhrases = s.hero_dynamic_phrases
            ? s.hero_dynamic_phrases.split("\n").map(p => p.trim()).filter(Boolean)
            : null;

          const parsedTopics = s.hero_popular_topics
            ? s.hero_popular_topics.split(",").map(t => t.trim()).filter(Boolean)
            : null;

          const dynamicPairs = [
            { id: 0, tech: s.hero_pair1_boy || "Machine Learning", creative: s.hero_pair1_girl || "UI/UX Design" },
            { id: 1, tech: s.hero_pair2_boy || "Python", creative: s.hero_pair2_girl || "Spanish" },
            { id: 2, tech: s.hero_pair3_boy || "Data Science", creative: s.hero_pair3_girl || "Digital Art" },
            { id: 3, tech: s.hero_pair4_boy || "System Design", creative: s.hero_pair4_girl || "Brand Strategy" }
          ];

          setHeroConfig(prev => ({
            ...prev,
            pill1_text: s.hero_badge_pill1 || prev.pill1_text,
            pill2_text: s.hero_badge_pill2 || prev.pill2_text,
            headline_static: s.hero_headline_static || prev.headline_static,
            headline_dynamic_prefix: s.hero_headline_dynamic_prefix || prev.headline_dynamic_prefix,
            dynamic_phrases: parsedPhrases && parsedPhrases.length > 0 ? parsedPhrases : prev.dynamic_phrases,
            subtitle: s.hero_subtitle || prev.subtitle,
            cta1_text: s.hero_cta1_text || prev.cta1_text,
            cta1_link: s.hero_cta1_link || prev.cta1_link,
            cta2_text: s.hero_cta2_text || prev.cta2_text,
            cta2_link: s.hero_cta2_link || prev.cta2_link,
            popular_topics: parsedTopics && parsedTopics.length > 0 ? parsedTopics : prev.popular_topics,
            boy_name: s.hero_boy_name || prev.boy_name,
            boy_role: s.hero_boy_role || prev.boy_role,
            boy_image: s.hero_boy_image || prev.boy_image,
            boy_teach: s.hero_boy_teach || prev.boy_teach,
            boy_want: s.hero_boy_want || prev.boy_want,
            girl_name: s.hero_girl_name || prev.girl_name,
            girl_role: s.hero_girl_role || prev.girl_role,
            girl_image: s.hero_girl_image || prev.girl_image,
            girl_teach: s.hero_girl_teach || prev.girl_teach,
            girl_want: s.hero_girl_want || prev.girl_want,
            pairs: dynamicPairs
          }));
        }
      })
      .catch(err => {
        console.log("No hero settings loaded, using defaults");
      });
  }, []);

  const dynamicPhrases = heroConfig.dynamic_phrases;
  const popularTopics = heroConfig.popular_topics;

  const defaultSimulationPairs = [
    {
      synergy: "99.4%",
      user1: {
        name: "Aarav Sharma",
        role: "AI & ML Specialist",
        location: "Bengaluru, India (Remote)",
        picture: "/hero/boy-tech.webp",
        teaching: "Python & Machine Learning",
        learning: "UI/UX & Product Design"
      },
      user2: {
        name: "Ananya Iyer",
        role: "Product & UI/UX Designer",
        location: "Mumbai, India (Remote)",
        picture: "/hero/girl-creative.png",
        teaching: "UI/UX & Product Design",
        learning: "Python & Machine Learning"
      }
    }
  ];

  const [simulationPairs, setSimulationPairs] = useState(defaultSimulationPairs);
  const [simulationIndex, setSimulationIndex] = useState(() => {
    // Randomize initial simulation pair index on every browser refresh!
    return Math.floor(Math.random() * 3);
  });

  useEffect(() => {
    // Dynamically fetch live database swappers to form authentic simulation pairs
    const loadRealSwappers = async () => {
      try {
        const res = await API.get("/discovery/search");
        if (res.data.success && res.data.users && res.data.users.length >= 2) {
          const dbUsers = res.data.users;
          const dynamicPairs = [];
          for (let i = 0; i < dbUsers.length; i += 2) {
            if (i + 1 < dbUsers.length) {
              const u1 = dbUsers[i];
              const u2 = dbUsers[i + 1];
              const loc1 = [u1.city, u1.location].filter(Boolean).join(", ") || "Online / Remote";
              const loc2 = [u2.city, u2.location].filter(Boolean).join(", ") || "Online / Remote";
              dynamicPairs.push({
                synergy: `${94 + (i % 6)}%`,
                user1: {
                  name: u1.name,
                  role: u1.profession || u1.education_degree || "Verified Co-Learner",
                  location: loc1,
                  picture: u1.profile_picture || get3DAvatarUrl(u1.gender, u1.name),
                  teaching: u1.offered_skills?.[0]?.skill_name || "Data Structures & Java (DSA)",
                  learning: u1.wanted_skills?.[0]?.skill_name || "Cloud Computing & AWS"
                },
                user2: {
                  name: u2.name,
                  role: u2.profession || u2.education_degree || "Verified Co-Learner",
                  location: loc2,
                  picture: u2.profile_picture || get3DAvatarUrl(u2.gender, u2.name),
                  teaching: u2.offered_skills?.[0]?.skill_name || "UI/UX Design & Figma",
                  learning: u2.wanted_skills?.[0]?.skill_name || "Python & Machine Learning"
                }
              });
            }
          }
          if (dynamicPairs.length > 0) {
            setSimulationPairs(dynamicPairs);
            setSimulationIndex(Math.floor(Math.random() * dynamicPairs.length));
          }
        }
      } catch (e) {
        // Fallback to static initial pairs if server error
      }
    };
    loadRealSwappers();
  }, []);

  const currentPair = simulationPairs[simulationIndex] || defaultSimulationPairs[0];

  const handleNextMatch = () => {
    setSimulationIndex((prev) => (prev + 1) % simulationPairs.length);
  };

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

  const workingSteps = [
    {
      step: "01",
      icon: UserPlus,
      title: "Profile & Skill Setup",
      desc: "Declare the skills you excel at and want to teach, along with the topics you want to learn."
    },
    {
      step: "02",
      icon: Sparkles,
      title: "Bilateral Match Discovery",
      desc: "Our AI Synergy engine pairs you with peers who offer what you want and want what you teach."
    },
    {
      step: "03",
      icon: Repeat,
      title: "Proposal & Confirmation",
      desc: "Send a friendly exchange proposal, select skills to trade, and set your mutual agenda notes."
    },
    {
      step: "04",
      icon: Video,
      title: "Live Session & Review",
      desc: "Connect via 1-on-1 video call, split time teaching each other, and build your Karma rating."
    }
  ];

  const whyUseful = [
    {
      icon: DollarSign,
      title: "Zero Financial Cost",
      color: "from-emerald-500 to-teal-600",
      desc: "Save thousands on expensive bootcamps and subscriptions. Trade your expertise instead of money."
    },
    {
      icon: UserCheck,
      title: "Real 1-on-1 Practitioner Mentorship",
      color: "from-blue-500 to-indigo-600",
      desc: "Get direct, real-time feedback from active practitioners working in tech, design, and business."
    },
    {
      icon: Target,
      title: "Mutual Accountability",
      color: "from-amber-500 to-orange-600",
      desc: "Co-learning with a committed partner guarantees higher progress and consistent motivation."
    },
    {
      icon: Flame,
      title: "Practical Project Growth",
      color: "from-violet-500 to-purple-600",
      desc: "Focus on real-world projects and immediate skill application rather than passive video lectures."
    }
  ];

  const problemSolutions = [
    {
      problemTitle: "Expensive Bootcamps & Subscription Fatigue",
      problemDesc: "Online courses cost hundreds of dollars, while subscriptions charge monthly even when unused.",
      solutionTitle: "100% Free Knowledge Barter",
      solutionDesc: "SkillSwap operates on zero-fee peer barter. Teach 30 minutes of what you know, learn 30 minutes of what you need."
    },
    {
      problemTitle: "Passive Video Lectures Without Feedback",
      problemDesc: "Watching pre-recorded tutorials leads to low engagement, confusion, and zero personalized guidance.",
      solutionTitle: "Live Interactive Video Rooms",
      solutionDesc: "Connect in 1-on-1 video rooms with agenda checklists, screen sharing, and instant Q&A."
    },
    {
      problemTitle: "Difficulty Finding Compatible Study Partners",
      problemDesc: "Finding a dedicated study partner who shares complementary learning goals is almost impossible manually.",
      solutionTitle: "Bilateral AI Synergy Engine",
      solutionDesc: "Our 2-way matching algorithm pairs you with peers who offer what you want and want what you teach with 99.4% precision."
    }
  ];

  const categories = [
    { title: "Technology & Code", icon: Code, count: "450+ Skills", color: "from-blue-500 to-indigo-600", desc: "React, Node, Python, Rust, System Design, DevOps" },
    { title: "Design & Creative", icon: Palette, count: "320+ Skills", color: "from-purple-500 to-pink-600", desc: "UI/UX, Figma, Photoshop, Motion Graphics, Blender" },
    { title: "Languages", icon: Globe, count: "280+ Skills", color: "from-emerald-500 to-teal-600", desc: "Spanish, French, English, German, Mandarin, Japanese" },
    { title: "Business & Marketing", icon: TrendingUp, count: "190+ Skills", color: "from-amber-500 to-orange-600", desc: "Digital Marketing, SEO, Finance, Investing, Growth" },
    { title: "Music & Audio", icon: Music, count: "140+ Skills", color: "from-rose-500 to-red-600", desc: "Guitar, Piano, Vocal Practice, Music Production, Mixing" },
    { title: "AI & Data Science", icon: Sparkles, count: "210+ Skills", color: "from-cyan-500 to-blue-600", desc: "Machine Learning, PyTorch, Prompt Engineering, SQL" }
  ];

  const comparison = [
    { feature: "Financial Cost", traditional: "$500 - $3,000 / course", skillswap: "100% Free Peer Barter" },
    { feature: "Learning Model", traditional: "Passive video lectures", skillswap: "Interactive 1-on-1 Co-learning" },
    { feature: "Feedback Loop", traditional: "None / Automated quizzes", skillswap: "Real-time mentor guidance" },
    { feature: "Customization", traditional: "Rigid static syllabus", skillswap: "Tailored to your specific goals" }
  ];

  const homeFaqs = [
    {
      q: "What is SkillSwap?",
      a: "SkillSwap is a peer-to-peer reciprocal knowledge exchange platform. Instead of paying money or purchasing subscription courses, users trade expertise 1-on-1 (e.g. you teach React.js to a peer, and they teach you Spanish in return)."
    },
    {
      q: "Is SkillSwap really 100% free?",
      a: "Yes! Zero fees forever. There are no subscription tiers, hidden token fees, or credit card requirements. You invest your time and knowledge to learn from other practitioners."
    },
    {
      q: "How does the AI Synergy Matcher work?",
      a: "Our algorithm compares your listed offered skills (skills you can teach) and wanted skills (topics you want to learn) with thousands of active profiles. It prioritizes '2-Way Matches' where two users complementary complement each other's learning goals."
    }
  ];

  return (
    <div className="min-h-screen bg-[#faf7ee] text-slate-900 font-sans relative">
      
      {/* ------------------------------------------------------------- */}
      {/* 1. HERO SECTION (WITH 1-ON-1 EXCHANGE STAGE ABOVE TEXT) */}
      {/* ------------------------------------------------------------- */}
      <section className="pt-8 pb-16 sm:pt-10 sm:pb-24 border-b border-slate-200/80 bg-gradient-to-b from-[#faf7ee] via-[#f7f2e5] to-[#faf7ee] relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-5 relative z-10">
          
          {/* Animated Top Pill Badges with Slide-in Right animation */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50/90 border border-blue-200/80 text-blue-700 text-xs font-bold shadow-2xs animate-fade-in-up">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span>{heroConfig.pill1_text}</span>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50/90 border border-emerald-200/80 text-emerald-700 text-xs font-bold shadow-2xs animate-slide-in-right hidden sm:inline-flex">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" style={{ animationDuration: '4s' }} />
              <span>{heroConfig.pill2_text}</span>
            </div>
          </div>

          {/* 1-ON-1 SKILL BARTER STAGE: DYNAMIC & SLEEK DIMENSIONS ABOVE TEXT */}
          <div className="py-0.5">
            <HeroStage heroConfig={heroConfig} />
          </div>

          {/* Main Headline with Dynamic Rotating Animation */}
          <div className="space-y-2 pt-1">
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-black tracking-tight text-slate-900 leading-tight break-words">
              {heroConfig.headline_static}
            </h1>
            <div className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-serif italic font-normal text-blue-600 leading-tight min-h-[1.3em] flex items-center justify-center flex-wrap gap-x-2 sm:gap-x-3">
              <span className="text-slate-900 not-italic font-black">{heroConfig.headline_dynamic_prefix}</span>
              <span
                className={`inline-block text-blue-600 transition-all duration-300 transform ${
                  fadeState ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-3 scale-95"
                }`}
              >
                {dynamicPhrases[activeSkillIndex % dynamicPhrases.length]}
              </span>
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal animate-fade-in-up px-2">
            {heroConfig.subtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
            <Link
              to={isAuthenticated ? (heroConfig.cta1_link === "/register" ? "/explore" : heroConfig.cta1_link) : heroConfig.cta1_link}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-extrabold shadow-md shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 min-h-[44px]"
            >
              <span>{heroConfig.cta1_text}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to={heroConfig.cta2_link}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-800 rounded-full text-xs font-extrabold border border-slate-200/90 shadow-2xs transition-all hover:border-slate-300 hover:scale-105 active:scale-95 min-h-[44px]"
            >
              <span>{heroConfig.cta2_text}</span>
            </Link>
          </div>

          {/* Search Box Input */}
          <div className="max-w-2xl mx-auto relative group">
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
                  placeholder="What do you want to learn? (e.g. Python, UI/UX, Rust, Spanish)..."
                  className="w-full py-3 bg-transparent text-sm font-medium text-slate-900 focus:outline-none placeholder:text-slate-400"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl sm:rounded-full text-xs font-extrabold shadow-md shadow-blue-500/20 transition-all shrink-0 hover:scale-105 active:scale-95 min-h-[44px]"
              >
                Find Matches
              </button>
            </form>
          </div>

          {/* Popular Topics Chips with subtle animation */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-500 font-medium mr-1">Popular topics:</span>
            {popularTopics.map((topic, idx) => (
              <button
                key={idx}
                onClick={() => handleTopicClick(topic)}
                className="px-3.5 py-1.5 rounded-full bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 font-bold transition-all shadow-2xs hover:border-blue-300 hover:scale-105 min-h-[36px]"
              >
                {topic}
              </button>
            ))}
          </div>

          {/* Bottom Metrics Bar (Dynamic from Admin Panel) */}
          <div className="pt-8 sm:pt-12 border-t border-slate-200/80 max-w-3xl mx-auto grid grid-cols-3 gap-2 sm:gap-4 text-center">
            <div className="transition-transform hover:-translate-y-0.5">
              <p className="text-base sm:text-xl md:text-2xl font-black text-slate-900">
                {heroStats.stat1_value}
              </p>
              <p className="text-[10px] sm:text-xs text-slate-500 font-semibold mt-0.5 leading-tight">{heroStats.stat1_label}</p>
            </div>

            <div className="transition-transform hover:-translate-y-0.5">
              <p className="text-base sm:text-xl md:text-2xl font-black text-slate-900">
                {heroStats.stat2_value}
              </p>
              <p className="text-[10px] sm:text-xs text-slate-500 font-semibold mt-0.5 leading-tight">{heroStats.stat2_label}</p>
            </div>

            <div className="transition-transform hover:-translate-y-0.5">
              <p className="text-base sm:text-xl md:text-2xl font-black text-slate-900 flex items-center justify-center gap-0.5 sm:gap-1">
                <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400 text-amber-400 inline shrink-0" />
                <span>{heroStats.stat3_value}</span>
              </p>
              <p className="text-[10px] sm:text-xs text-slate-500 font-semibold mt-0.5 leading-tight">{heroStats.stat3_label}</p>
            </div>
          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 1.5. LIVE RECIPROCAL EXCHANGE SIMULATION WIDGET (Directly Below Hero) */}
      {/* ------------------------------------------------------------- */}
      <section className="-mt-12 mb-16 relative z-20 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xl space-y-6">
          
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 mr-2">
                <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              </div>
              <span className="text-xs sm:text-sm font-black text-slate-900 tracking-wider uppercase">
                LIVE RECIPROCAL EXCHANGE SIMULATION
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-extrabold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Live Mutual Synergy: {currentPair.synergy}</span>
              </div>

              <button
                onClick={handleNextMatch}
                className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-extrabold border border-blue-200/80 transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95"
              >
                <Repeat className="w-3.5 h-3.5" />
                <span>Next Match</span>
              </button>
            </div>
          </div>

          {/* Cards Pair Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-2">
            
            {/* Left Swapper Card */}
            <div className="md:col-span-5 bg-slate-50/80 rounded-2xl p-5 border border-slate-200/80 space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={currentPair.user1.picture}
                  alt={currentPair.user1.name}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-blue-500/20 bg-blue-50"
                />
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-1">
                    {currentPair.user1.name}
                    <CheckCircle2 className="w-4 h-4 text-blue-600 fill-blue-100" />
                  </h4>
                  <p className="text-[11px] text-slate-500 font-semibold">{currentPair.user1.role}</p>
                  <p className="text-[10px] text-rose-600 font-bold flex items-center gap-1 mt-0.5">
                    📍 {currentPair.user1.location}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2 sm:p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-800 font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-[9px] sm:text-[10px] uppercase font-black tracking-wider text-emerald-600 shrink-0">TEACHING:</span>
                  <span className="text-xs truncate">{currentPair.user1.teaching}</span>
                </div>
                <div className="p-2 sm:p-2.5 rounded-xl bg-blue-50 border border-blue-200/60 text-blue-800 font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-[9px] sm:text-[10px] uppercase font-black tracking-wider text-blue-600 shrink-0">LEARNING:</span>
                  <span className="text-xs truncate">{currentPair.user1.learning}</span>
                </div>
              </div>
            </div>

            {/* Center Connection Indicator */}
            <div className="md:col-span-2 text-center py-2 space-y-1">
              <div className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 text-white text-[10px] font-black shadow-md border border-slate-700">
                <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span>Zero-Cost Barter</span>
              </div>
              <p className="text-[9px] uppercase font-black text-slate-400 tracking-wider">
                MUTUAL 1:1 CO-MENTORSHIP
              </p>
            </div>

            {/* Right Swapper Card */}
            <div className="md:col-span-5 bg-slate-50/80 rounded-2xl p-5 border border-slate-200/80 space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={currentPair.user2.picture}
                  alt={currentPair.user2.name}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-emerald-500/20 bg-emerald-50"
                />
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-1">
                    {currentPair.user2.name}
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                  </h4>
                  <p className="text-[11px] text-slate-500 font-semibold">{currentPair.user2.role}</p>
                  <p className="text-[10px] text-rose-600 font-bold flex items-center gap-1 mt-0.5">
                    📍 {currentPair.user2.location}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2 sm:p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-800 font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-[9px] sm:text-[10px] uppercase font-black tracking-wider text-emerald-600 shrink-0">TEACHING:</span>
                  <span className="text-xs truncate">{currentPair.user2.teaching}</span>
                </div>
                <div className="p-2 sm:p-2.5 rounded-xl bg-blue-50 border border-blue-200/60 text-blue-800 font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-[9px] sm:text-[10px] uppercase font-black tracking-wider text-blue-600 shrink-0">LEARNING:</span>
                  <span className="text-xs truncate">{currentPair.user2.learning}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Features Pill Row */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 font-bold border border-amber-200/60 flex items-center gap-1">
                🎓 Real-time HD Video Classroom
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-800 font-bold border border-rose-200/60 flex items-center gap-1">
                📝 Real-time Notes & Scratchpad
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-cyan-50 text-cyan-800 font-bold border border-cyan-200/60 flex items-center gap-1">
                💻 Live Multi-Lang Code Sandbox
              </span>
            </div>

            <Link
              to="/explore"
              className="text-xs font-black text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline"
            >
              <span>Experience Live Synergy</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 2. WORKING OF SKILLSWAP (DIRECTLY BELOW HERO SECTION) */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 bg-[#fdfbf7]">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-black uppercase tracking-wider">
            System Architecture
          </span>
          <h2 className="text-3xl font-serif font-black text-slate-900">Working of SkillSwap</h2>
          <p className="text-slate-600 text-sm font-medium">Four simple steps to barter knowledge and accelerate your skills for free.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 01: Profile Setup */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 space-y-4 group hover:-translate-y-1 relative flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-serif font-black text-blue-600/30 group-hover:text-blue-600 transition-colors">
                  01
                </span>
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-2xs">
                  <UserCheck className="w-5 h-5" />
                </div>
              </div>

              {/* Visual Step Illustration 1: Boy Tech Persona Profile Card */}
              <div className="h-36 rounded-2xl bg-gradient-to-br from-blue-50/90 via-indigo-50/50 to-slate-50 border border-blue-100/80 relative overflow-hidden flex items-end justify-center p-2">
                <div className="absolute top-2 left-2 z-20 flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-black shadow-xs">
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-200" />
                  <span>Verified Profile</span>
                </div>
                
                {/* Floating skill tags */}
                <div className="absolute top-7 right-1.5 z-20 px-2 py-0.5 rounded-md bg-white/95 border border-blue-200/80 text-blue-700 text-[8px] font-extrabold shadow-2xs animate-float">
                  Teaches: Python & ML 🐍
                </div>
                <div className="absolute top-14 left-1.5 z-20 px-2 py-0.5 rounded-md bg-white/95 border border-amber-200/80 text-amber-800 text-[8px] font-extrabold shadow-2xs animate-float" style={{ animationDelay: "1s" }}>
                  Wants: UI/UX Design 🎨
                </div>

                {/* Boy Avatar */}
                <img
                  src={heroConfig?.boy_image || "/hero/boy-tech.webp"}
                  alt="Aarav Setup"
                  className="h-28 w-auto object-contain object-bottom drop-shadow-sm group-hover:scale-105 transition-transform duration-300 relative z-10 pointer-events-none"
                  loading="lazy"
                />
                <div className="absolute bottom-0 w-24 h-2 bg-slate-900/10 rounded-full blur-xs" />
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors mb-1">
                  Set Up Your Skill Profile
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  List the skills you have mastered and teach alongside the topics you want to learn. No fees, courses, or middleman fees.
                </p>
              </div>
            </div>
            
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-blue-600">
              <span>Setup: ~60 Seconds</span>
              <span className="text-emerald-600">100% Free</span>
            </div>
          </div>

          {/* Step 02: Bilateral Match Discovery */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 space-y-4 group hover:-translate-y-1 relative flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-serif font-black text-indigo-600/30 group-hover:text-indigo-600 transition-colors">
                  02
                </span>
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-2xs">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>

              {/* Visual Step Illustration 2: 2-Way Match Animation */}
              <div className="h-36 rounded-2xl bg-gradient-to-br from-indigo-50/90 via-purple-50/50 to-slate-50 border border-indigo-100/80 relative overflow-hidden flex items-center justify-between px-2 py-2">
                {/* Left Mini Avatar (Boy) */}
                <div className="flex flex-col items-center z-10 w-12">
                  <img
                    src={heroConfig?.boy_image || "/hero/boy-tech.webp"}
                    alt="Boy Swapper"
                    className="h-16 w-auto object-contain object-bottom drop-shadow-xs"
                    loading="lazy"
                  />
                  <span className="text-[8px] font-black text-slate-800 bg-white/90 px-1 rounded border border-slate-200">Tech</span>
                </div>

                {/* Center Broker & Synergy */}
                <div className="flex flex-col items-center justify-center z-10 space-y-1">
                  <div className="px-2 py-0.5 rounded-full bg-slate-900 text-white text-[8px] font-black flex items-center gap-1 shadow-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>99.4% Match</span>
                  </div>
                  
                  {/* Bilateral Trade Arrows */}
                  <div className="w-20 space-y-0.5 text-center">
                    <div className="flex items-center justify-center gap-1 text-[7px] font-bold text-blue-700 bg-blue-100/80 py-0.5 rounded px-1">
                      <span>Python</span>
                      <span>➔</span>
                    </div>
                    <div className="flex items-center justify-center gap-1 text-[7px] font-bold text-violet-700 bg-violet-100/80 py-0.5 rounded px-1">
                      <span>⬅</span>
                      <span>UI/UX</span>
                    </div>
                  </div>
                </div>

                {/* Right Mini Avatar (Girl) */}
                <div className="flex flex-col items-center z-10 w-12">
                  <img
                    src={heroConfig?.girl_image || "/hero/girl-creative.png"}
                    alt="Girl Swapper"
                    className="h-16 w-auto object-contain object-bottom drop-shadow-xs"
                    loading="lazy"
                  />
                  <span className="text-[8px] font-black text-slate-800 bg-white/90 px-1 rounded border border-slate-200">Design</span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors mb-1">
                  Bilateral Match Discovery
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Our algorithm matches you directly with peers where what you teach fulfills their goal, and what they teach fulfills yours.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-indigo-600">
              <span>Synergy: Direct 2-Way</span>
              <span className="text-indigo-600">Smart Broker</span>
            </div>
          </div>

          {/* Step 03: Proposal & Mutual Agreement */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 space-y-4 group hover:-translate-y-1 relative flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-serif font-black text-violet-600/30 group-hover:text-violet-600 transition-colors">
                  03
                </span>
                <div className="w-10 h-10 rounded-2xl bg-violet-50 text-violet-600 border border-violet-200 flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition-all shadow-2xs">
                  <Repeat className="w-5 h-5" />
                </div>
              </div>

              {/* Visual Step Illustration 3: Girl Persona with Accepted Proposal */}
              <div className="h-36 rounded-2xl bg-gradient-to-br from-violet-50/90 via-pink-50/50 to-slate-50 border border-violet-100/80 relative overflow-hidden flex items-end justify-center p-2">
                <div className="absolute top-2 left-2 z-20 flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-600 text-white text-[9px] font-black shadow-xs">
                  <Repeat className="w-2.5 h-2.5 text-blue-200" />
                  <span>Proposal Accepted</span>
                </div>

                {/* Floating proposal preview */}
                <div className="absolute top-8 right-2 z-20 p-1.5 rounded-lg bg-white/95 border border-slate-200 text-left shadow-md max-w-[130px]">
                  <p className="text-[8px] font-black text-slate-900 leading-tight">Trade Agreement</p>
                  <p className="text-[7px] text-slate-500 font-medium mt-0.5">Python ⇄ UI/UX Design</p>
                  <div className="flex items-center gap-1 text-[7px] text-emerald-600 font-bold mt-1">
                    <Check className="w-2.5 h-2.5" />
                    <span>Room Confirmed</span>
                  </div>
                </div>

                {/* Girl Avatar */}
                <img
                  src={heroConfig?.girl_image || "/hero/girl-creative.png"}
                  alt="Ananya Proposal"
                  className="h-28 w-auto object-contain object-bottom drop-shadow-sm group-hover:scale-105 transition-transform duration-300 relative z-10 pointer-events-none"
                  loading="lazy"
                />
                <div className="absolute bottom-0 w-24 h-2 bg-slate-900/10 rounded-full blur-xs" />
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900 group-hover:text-violet-600 transition-colors mb-1">
                  Proposal & Agreement
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Send a 1-click swap proposal with your desired topic and timeslot. Once both peers accept, your barter room unlocks.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-violet-600">
              <span>Mutual Consent</span>
              <span className="text-emerald-600">Instant Room</span>
            </div>
          </div>

          {/* Step 04: Live Video Classroom & Review */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 space-y-4 group hover:-translate-y-1 relative flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-serif font-black text-emerald-600/30 group-hover:text-emerald-600 transition-colors">
                  04
                </span>
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-2xs">
                  <Video className="w-5 h-5" />
                </div>
              </div>

              {/* Visual Step Illustration 4: Video Classroom Preview */}
              <div className="h-36 rounded-2xl bg-slate-900 border border-slate-700/80 relative overflow-hidden flex flex-col justify-between p-2">
                {/* Header status */}
                <div className="flex items-center justify-between text-[8px] font-black text-slate-300 border-b border-slate-800 pb-1">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    HD Classroom Live
                  </span>
                  <span className="text-slate-400">45:00 min</span>
                </div>

                {/* Split Video Mock Tiles */}
                <div className="grid grid-cols-2 gap-1.5 my-auto">
                  <div className="h-16 rounded-lg bg-slate-800 border border-slate-700 overflow-hidden relative flex items-center justify-center">
                    <img src={heroConfig?.boy_image || "/hero/boy-tech.webp"} alt="Boy video" className="h-14 w-auto object-contain" />
                    <span className="absolute bottom-1 left-1 bg-black/70 text-[7px] text-white px-1 rounded font-bold">Aarav (Tech)</span>
                  </div>
                  <div className="h-16 rounded-lg bg-slate-800 border border-slate-700 overflow-hidden relative flex items-center justify-center">
                    <img src={heroConfig?.girl_image || "/hero/girl-creative.png"} alt="Girl video" className="h-14 w-auto object-contain" />
                    <span className="absolute bottom-1 left-1 bg-black/70 text-[7px] text-white px-1 rounded font-bold">Ananya (Design)</span>
                  </div>
                </div>

                {/* Rating Footer */}
                <div className="flex items-center justify-between text-[8px] font-bold text-amber-300 pt-1 border-t border-slate-800">
                  <span className="flex items-center gap-0.5">
                    <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                    <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                    <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                    <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                    <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                  </span>
                  <span className="text-emerald-400 font-extrabold">+10 Karma Score</span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors mb-1">
                  Live Classroom & Karma
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Learn face-to-face via built-in video, screen share, and collaborative code sandbox. Exchange reviews to elevate reputation.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-emerald-600">
              <span>HD Video & Sandbox</span>
              <span className="text-amber-600">Karma Ratings</span>
            </div>
          </div>
        </div>

        <div className="text-center mt-10">
          <Link
            to="/how-it-works"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-extrabold shadow-md shadow-blue-500/20 transition-all hover:scale-105"
          >
            <span>Explore Complete Working Guide</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 3. WHY SKILLSWAP IS USEFUL SECTION */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 bg-[#fdfbf7]">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider">
            Core Benefits
          </span>
          <h2 className="text-3xl font-serif font-black text-slate-900">Why SkillSwap is Exceptionally Useful</h2>
          <p className="text-slate-600 text-sm font-medium">Experience a smarter, faster, and more personal way to master any skill.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyUseful.map((u, i) => {
            const Icon = u.icon;
            return (
              <div key={i} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 space-y-3 group hover:-translate-y-1">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${u.color} text-white flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {u.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {u.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 4. HOW SKILLSWAP SOLVES KEY PROBLEMS */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 bg-slate-100/70 border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-black uppercase tracking-wider">
              Problem vs Solution
            </span>
            <h2 className="text-3xl font-serif font-black text-slate-900">Solving Real Learning Bottlenecks</h2>
            <p className="text-slate-600 text-sm font-medium">Here is how SkillSwap replaces traditional education flaws with reciprocal barter.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {problemSolutions.map((ps, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5 flex flex-col justify-between hover:shadow-md transition-shadow">
                
                {/* Problem Block */}
                <div className="bg-rose-50/80 p-4 rounded-2xl border border-rose-200/80 space-y-2">
                  <div className="flex items-center gap-2 text-rose-700 font-extrabold text-xs">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>THE PROBLEM</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{ps.problemTitle}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{ps.problemDesc}</p>
                </div>

                {/* Solution Block */}
                <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200/80 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-700 font-extrabold text-xs">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>SKILLSWAP SOLUTION</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{ps.solutionTitle}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{ps.solutionDesc}</p>
                </div>

              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 5. POPULAR SKILL FIELDS */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 bg-[#fdfbf7]">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <h2 className="text-3xl font-serif font-black text-slate-900">Explore Popular Fields</h2>
          <p className="text-slate-600 text-sm font-medium">Browse verified mentors offering 1-on-1 skill exchanges across top domains.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${cat.color} text-white flex items-center justify-center mb-5 shadow-md shadow-slate-200 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">{cat.desc}</p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs">
                  <span className="font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                    {cat.count}
                  </span>
                  <Link to="/explore" className="font-bold text-slate-400 group-hover:text-blue-600 flex items-center gap-1 transition-colors">
                    Browse <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 6. COMPARISON TABLE */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 bg-[#fdfbf7]">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <h2 className="text-3xl font-serif font-black text-slate-900">Why Peer Barter Beats Paid Courses</h2>
          <p className="text-slate-600 text-sm font-medium">Compare traditional video platforms with bilateral 1-on-1 co-learning.</p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-x-auto">
          <div className="min-w-[500px]">
            <div className="grid grid-cols-12 bg-slate-900 text-white p-4 font-bold text-xs uppercase tracking-wider">
              <div className="col-span-4">Aspect</div>
              <div className="col-span-4 text-slate-400">Traditional Paid Courses</div>
              <div className="col-span-4 text-blue-400 font-black">SkillSwap Peer Barter</div>
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
        </div>

        <div className="text-center mt-6">
          <Link to="/features" className="text-xs font-extrabold text-blue-600 hover:underline inline-flex items-center gap-1">
            View All Features & Tech Architecture <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 7. VERIFIED SWAPPER TESTIMONIALS (LIVE ADMIN SYNCHRONIZED) */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 bg-[#fdfbf7]">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5">
            <MessageSquareQuote className="w-3.5 h-3.5 text-indigo-600" />
            <span>Community Stories</span>
          </span>
          <h2 className="text-3xl font-serif font-black text-slate-900">What Our Swappers Say</h2>
          <p className="text-slate-600 text-sm font-medium">Real experiences from students, scholars, and verified peer mentors worldwide.</p>
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
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
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
                  <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-1">
                    {t.author_name}
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 fill-blue-100" />
                  </h4>
                  <p className="text-[11px] text-slate-500 font-semibold">{t.author_role}</p>
                  <p className="text-[10px] text-indigo-600 font-bold mt-0.5">{t.skill_traded}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 8. FAQ PREVIEW SNIPPET */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-[#fdfbf7]">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <h2 className="text-3xl font-serif font-black text-slate-900">Frequently Asked Questions</h2>
          <p className="text-slate-600 text-sm font-medium">Got questions about reciprocal peer barter? We've got answers.</p>
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
                  <span className="text-base font-extrabold text-slate-900">{faq.q}</span>
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
          <Link to="/faq" className="text-xs font-extrabold text-blue-600 hover:underline inline-flex items-center gap-1">
            Browse All FAQs in Help Center <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 9. BOTTOM HERO CONVERSION BANNER (FEATURING BOY & GIRL CO-LEARNERS) */}
      {/* ------------------------------------------------------------- */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl sm:rounded-4xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-slate-800/80 shadow-2xl overflow-hidden p-6 sm:p-10 lg:p-12">
          
          {/* Ambient Lighting Gradients */}
          <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-violet-500/20 blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

          {/* Grid Container */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Figure: Boy Tech Persona */}
            <div className="hidden lg:flex lg:col-span-3 flex-col items-center justify-end relative">
              <div className="relative w-full max-w-[210px] aspect-[3/4] flex items-end justify-center">
                {/* Floating Skill Badge */}
                <div className="absolute -top-3 left-0 z-20 px-3 py-1.5 rounded-xl bg-slate-800/95 backdrop-blur-md border border-blue-500/40 text-blue-300 text-xs font-bold shadow-lg flex items-center gap-1.5 animate-float">
                  <Laptop className="w-3.5 h-3.5 text-blue-400" />
                  <span>Teaches: Python & ML</span>
                </div>
                
                {/* Boy Image with breathing animation */}
                <img
                  src={heroConfig?.boy_image || "/hero/boy-tech.webp"}
                  alt="Aarav Sharma Tech Partner"
                  className="w-full h-full object-contain object-bottom drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] animate-boy-breathe relative z-10 pointer-events-none"
                  loading="lazy"
                />

                {/* Contact shadow */}
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-3 bg-black/40 rounded-full blur-xs" />
              </div>

              {/* Tag below */}
              <div className="mt-2 text-center">
                <span className="text-xs font-extrabold text-slate-200 block">{heroConfig?.boy_name || "Aarav Sharma"}</span>
                <span className="text-[10px] text-blue-400 font-semibold">{heroConfig?.boy_role || "AI & ML Specialist"}</span>
              </div>
            </div>

            {/* Center Content: Action & Messaging */}
            <div className="lg:col-span-6 text-center space-y-6">
              
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-extrabold">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                <span>Zero Tuition • 100% Peer Reciprocal Learning</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-3">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-white tracking-tight leading-tight">
                  Ready to Barter Your Knowledge?
                </h2>
                <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
                  Connect 1-on-1 with verified peers. Teach what you excel at, learn what you desire, and accelerate your growth without spending a single rupee or dollar.
                </p>
              </div>

              {/* Mobile/Tablet Avatars Row (shown when left/right columns are hidden on small screens) */}
              <div className="flex lg:hidden items-center justify-center gap-4 py-2">
                <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/80 rounded-2xl p-2 pr-3">
                  <img src={heroConfig?.boy_image || "/hero/boy-tech.webp"} alt="Boy" className="w-10 h-10 rounded-xl object-cover bg-blue-950" />
                  <div className="text-left">
                    <span className="text-[11px] font-black text-white block">Tech Partner</span>
                    <span className="text-[9px] text-blue-400 font-bold">Teaches Python</span>
                  </div>
                </div>

                <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <Repeat className="w-3.5 h-3.5" />
                </div>

                <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/80 rounded-2xl p-2 pr-3">
                  <img src={heroConfig?.girl_image || "/hero/girl-creative.png"} alt="Girl" className="w-10 h-10 rounded-xl object-cover bg-violet-950" />
                  <div className="text-left">
                    <span className="text-[11px] font-black text-white block">Creative Partner</span>
                    <span className="text-[9px] text-violet-400 font-bold">Teaches UI/UX</span>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link
                  to={isAuthenticated ? "/explore" : "/register"}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-black text-xs sm:text-sm shadow-xl shadow-blue-500/25 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>Start Swapping Today</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/explore"
                  className="w-full sm:w-auto px-8 py-4 bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 rounded-2xl font-black text-xs sm:text-sm border border-slate-700 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4 text-slate-400" />
                  <span>Explore Skills Directory</span>
                </Link>
              </div>

              {/* Trust Checkmarks */}
              <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-400 font-semibold">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>100% Free Peer Barter</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  <span>Integrated HD Video & Sandbox</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-violet-400" />
                  <span>Verified Mentor Karma Scores</span>
                </span>
              </div>

            </div>

            {/* Right Figure: Girl Creative Persona */}
            <div className="hidden lg:flex lg:col-span-3 flex-col items-center justify-end relative">
              <div className="relative w-full max-w-[210px] aspect-[3/4] flex items-end justify-center">
                {/* Floating Skill Badge */}
                <div className="absolute -top-3 right-0 z-20 px-3 py-1.5 rounded-xl bg-slate-800/95 backdrop-blur-md border border-violet-500/40 text-violet-300 text-xs font-bold shadow-lg flex items-center gap-1.5 animate-float" style={{ animationDelay: "1s" }}>
                  <Tablet className="w-3.5 h-3.5 text-violet-400" />
                  <span>Teaches: UI/UX & Design</span>
                </div>

                {/* Girl Image with breathing animation */}
                <img
                  src={heroConfig?.girl_image || "/hero/girl-creative.png"}
                  alt="Ananya Iyer Creative Partner"
                  className="w-full h-full object-contain object-bottom drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] animate-girl-breathe relative z-10 pointer-events-none"
                  loading="lazy"
                />

                {/* Contact shadow */}
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-3 bg-black/40 rounded-full blur-xs" />
              </div>

              {/* Tag below */}
              <div className="mt-2 text-center">
                <span className="text-xs font-extrabold text-slate-200 block">{heroConfig?.girl_name || "Ananya Iyer"}</span>
                <span className="text-[10px] text-violet-400 font-semibold">{heroConfig?.girl_role || "Product & UI/UX Designer"}</span>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
