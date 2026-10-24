import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  Repeat, 
  Search, 
  Sparkles, 
  Inbox, 
  Video, 
  User, 
  LogOut, 
  Menu, 
  X,
  LayoutDashboard,
  Compass,
  Zap,
  Home as HomeIcon,
  HelpCircle,
  BookOpen
} from "lucide-react";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-full font-sans">
      
      {/* 1. MAIN CRISP NAVBAR (Slim 56px on Mobile, 80px on Desktop) */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-20">
            
            {/* Logo Brand */}
            <Link 
              to="/" 
              onDoubleClick={(e) => {
                e.preventDefault();
                navigate("/admin");
              }}
              title="SkillSwap - Peer Learning Network"
              className="flex items-center gap-2 sm:gap-3 group cursor-pointer shrink-0"
            >
              <img 
                src="/logo.png" 
                alt="SkillSwap Logo" 
                className="w-7 h-7 sm:w-10 sm:h-10 object-contain rounded-lg sm:rounded-xl shadow-xs group-hover:scale-105 transition-transform" 
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="text-lg sm:text-2xl font-bold tracking-tight text-slate-900 leading-none">
                    SkillSwap
                  </span>
                  <span className="px-1 py-0.2 sm:px-1.5 sm:py-0.5 rounded text-[8px] sm:text-[10px] font-extrabold bg-blue-100 text-blue-800 border border-blue-200">
                    P2P
                  </span>
                </div>
                <span className="hidden sm:block text-[10px] text-slate-500 font-semibold tracking-wide mt-0.5">
                  Peer Learning Network
                </span>
              </div>
            </Link>

            {/* Center Navigation Pills (Desktop Only) */}
            <nav className="hidden md:flex items-center gap-1 bg-slate-100/90 p-1.5 rounded-full border border-slate-200 shadow-2xs">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/explore"
                    className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                      isActive("/explore") ? "bg-blue-600 text-white shadow-xs" : "text-slate-700 hover:text-blue-600 hover:bg-slate-200/60"
                    }`}
                  >
                    Explore Peers
                  </Link>

                  <Link
                    to="/how-it-works"
                    className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                      isActive("/how-it-works") ? "bg-blue-600 text-white shadow-xs" : "text-slate-700 hover:text-blue-600 hover:bg-slate-200/60"
                    }`}
                  >
                    How It Works
                  </Link>

                  <Link
                    to="/features"
                    className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                      isActive("/features") ? "bg-blue-600 text-white shadow-xs" : "text-slate-700 hover:text-blue-600 hover:bg-slate-200/60"
                    }`}
                  >
                    Features
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/dashboard"
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isActive("/dashboard") ? "bg-blue-600 text-white shadow-xs" : "text-slate-700 hover:text-blue-600 hover:bg-slate-200/60"
                    }`}
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    Dashboard
                  </Link>

                  <Link
                    to="/explore"
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                      isActive("/explore") ? "bg-blue-600 text-white shadow-xs" : "text-slate-700 hover:text-blue-600 hover:bg-slate-200/60"
                    }`}
                  >
                    Explore
                  </Link>

                  <Link
                    to="/requests"
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                      isActive("/requests") ? "bg-blue-600 text-white shadow-xs" : "text-slate-700 hover:text-blue-600 hover:bg-slate-200/60"
                    }`}
                  >
                    Swaps
                  </Link>

                  <Link
                    to="/exchanges"
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                      isActive("/exchanges") ? "bg-blue-600 text-white shadow-xs" : "text-slate-700 hover:text-blue-600 hover:bg-slate-200/60"
                    }`}
                  >
                    Sessions
                  </Link>
                </>
              )}
            </nav>

            {/* Right Auth Action Group & Mobile Menu Button */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Link 
                    to="/profile" 
                    className="flex items-center gap-2 bg-slate-50 hover:bg-blue-50/80 p-1 sm:p-1.5 sm:pr-3.5 rounded-full border border-slate-200 transition-all hover:border-blue-300 group shadow-2xs"
                  >
                    <img
                      src={user?.profile_picture || `https://api.dicebear.com/7.x/lorelei/svg?seed=${user?.name || 'Swapper'}`}
                      alt={user?.name}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-blue-500/30 group-hover:ring-blue-500"
                    />
                    <div className="flex flex-col text-left hidden sm:flex">
                      <span className="text-xs font-extrabold text-slate-900 max-w-[110px] truncate leading-tight">{user?.name}</span>
                      <span className="text-[10px] text-blue-600 font-semibold">{user?.city || user?.location || "Online"}</span>
                    </div>
                  </Link>

                  <button
                    onClick={handleLogout}
                    title="Logout"
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors hidden sm:block"
                  >
                    <LogOut className="w-4.5 h-4.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Link
                    to="/login"
                    className="px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="px-3.5 py-1.5 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-extrabold text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-xs transition-all flex items-center gap-1 hover:scale-[1.02] active:scale-95"
                  >
                    <span>Get Started</span>
                    <span>→</span>
                  </Link>
                </div>
              )}

              {/* Mobile Drawer Toggle Header Button */}
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-1.5 text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-colors ml-1"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* 2. NATIVE MOBILE BOTTOM NAVIGATION DOCK (Clean, Functional 5-Tab Bar) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-2xl py-2 px-2 flex items-center justify-around text-[10px] font-extrabold text-slate-600">
        {!isAuthenticated ? (
          <>
            <Link 
              to="/" 
              className={`flex flex-col items-center gap-1 transition-colors ${isActive('/') ? 'text-blue-600 font-black' : 'hover:text-blue-600'}`}
            >
              <HomeIcon className="w-5 h-5" />
              <span>Home</span>
            </Link>

            <Link 
              to="/explore" 
              className={`flex flex-col items-center gap-1 transition-colors ${isActive('/explore') ? 'text-blue-600 font-black' : 'hover:text-blue-600'}`}
            >
              <Compass className="w-5 h-5" />
              <span>Explore</span>
            </Link>

            <Link 
              to="/how-it-works" 
              className={`flex flex-col items-center gap-1 transition-colors ${isActive('/how-it-works') ? 'text-blue-600 font-black' : 'hover:text-blue-600'}`}
            >
              <BookOpen className="w-5 h-5" />
              <span>How It Works</span>
            </Link>

            <Link 
              to="/features" 
              className={`flex flex-col items-center gap-1 transition-colors ${isActive('/features') ? 'text-blue-600 font-black' : 'hover:text-blue-600'}`}
            >
              <Zap className="w-5 h-5" />
              <span>Features</span>
            </Link>

            <Link 
              to="/login" 
              className={`flex flex-col items-center gap-1 transition-colors ${isActive('/login') ? 'text-blue-600 font-black' : 'hover:text-blue-600'}`}
            >
              <User className="w-5 h-5" />
              <span>Log In</span>
            </Link>
          </>
        ) : (
          <>
            <Link 
              to="/dashboard" 
              className={`flex flex-col items-center gap-1 transition-colors ${isActive('/dashboard') ? 'text-blue-600 font-black' : 'hover:text-blue-600'}`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>

            <Link 
              to="/explore" 
              className={`flex flex-col items-center gap-1 transition-colors ${isActive('/explore') ? 'text-blue-600 font-black' : 'hover:text-blue-600'}`}
            >
              <Compass className="w-5 h-5" />
              <span>Explore</span>
            </Link>

            <Link 
              to="/requests" 
              className={`flex flex-col items-center gap-1 transition-colors ${isActive('/requests') ? 'text-blue-600 font-black' : 'hover:text-blue-600'}`}
            >
              <Repeat className="w-5 h-5" />
              <span>Swaps</span>
            </Link>

            <Link 
              to="/exchanges" 
              className={`flex flex-col items-center gap-1 transition-colors ${isActive('/exchanges') ? 'text-blue-600 font-black' : 'hover:text-blue-600'}`}
            >
              <Video className="w-5 h-5" />
              <span>Sessions</span>
            </Link>

            <Link 
              to="/profile" 
              className={`flex flex-col items-center gap-1 transition-colors ${isActive('/profile') ? 'text-blue-600 font-black' : 'hover:text-blue-600'}`}
            >
              {user?.profile_picture ? (
                <img 
                  src={user.profile_picture} 
                  alt="Profile" 
                  className="w-5 h-5 rounded-full object-cover ring-1 ring-blue-500/50" 
                />
              ) : (
                <User className="w-5 h-5" />
              )}
              <span>Profile</span>
            </Link>
          </>
        )}
      </nav>

      {/* 3. MOBILE BOTTOM APP DRAWER SHEET */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex flex-col justify-end">
          <div className="bg-white rounded-t-3xl p-6 shadow-2xl space-y-4 border-t border-slate-200 animate-in slide-in-from-bottom duration-300 max-h-[85vh] overflow-y-auto">
            
            {/* Handle & Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-3"></div>
              <div className="flex items-center gap-2.5 pt-2">
                <img src="/logo.png" alt="Logo" className="w-7 h-7 object-contain" />
                <span className="font-black text-slate-900 text-sm">SkillSwap Navigation</span>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Authenticated User Header Card in Drawer */}
            {isAuthenticated && (
              <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img 
                    src={user?.profile_picture || `https://api.dicebear.com/7.x/lorelei/svg?seed=${user?.name}`} 
                    alt={user?.name}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-blue-500/30"
                  />
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">{user?.name}</h4>
                    <p className="text-[11px] text-blue-600 font-semibold">{user?.profession || "SkillSwap Co-Learner"}</p>
                  </div>
                </div>

                <Link 
                  to="/profile" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-extrabold shadow-xs"
                >
                  Profile
                </Link>
              </div>
            )}

            {/* Links Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs font-bold pt-1">
              <Link 
                to="/" 
                onClick={() => setMobileMenuOpen(false)} 
                className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-800 flex items-center gap-2"
              >
                <HomeIcon className="w-4 h-4 text-blue-600" /> Home
              </Link>
              <Link 
                to="/explore" 
                onClick={() => setMobileMenuOpen(false)} 
                className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-800 flex items-center gap-2"
              >
                <Compass className="w-4 h-4 text-indigo-600" /> Explore Peers
              </Link>
              <Link 
                to="/features" 
                onClick={() => setMobileMenuOpen(false)} 
                className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-800 flex items-center gap-2"
              >
                <Zap className="w-4 h-4 text-amber-500" /> Platform Features
              </Link>
              <Link 
                to="/how-it-works" 
                onClick={() => setMobileMenuOpen(false)} 
                className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-800 flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-emerald-600" /> How It Works
              </Link>
              <Link 
                to="/faq" 
                onClick={() => setMobileMenuOpen(false)} 
                className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-800 flex items-center gap-2 col-span-2"
              >
                <HelpCircle className="w-4 h-4 text-purple-600" /> FAQ
              </Link>
            </div>

            {/* Authenticated Links */}
            {isAuthenticated ? (
              <div className="pt-2 border-t border-slate-100 space-y-2 text-xs font-extrabold">
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block py-2.5 px-4 bg-blue-50 text-blue-700 rounded-xl">
                  Dashboard
                </Link>
                <Link to="/requests" onClick={() => setMobileMenuOpen(false)} className="block py-2.5 px-4 bg-slate-50 text-slate-800 rounded-xl">
                  Swaps & Proposals
                </Link>
                <Link to="/exchanges" onClick={() => setMobileMenuOpen(false)} className="block py-2.5 px-4 bg-slate-50 text-slate-800 rounded-xl">
                  Video Sessions
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="w-full text-center py-3 bg-rose-50 text-rose-700 rounded-xl font-extrabold mt-2 cursor-pointer"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-slate-100 flex gap-3 text-xs font-extrabold">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex-1 text-center py-3 bg-slate-100 text-slate-800 rounded-2xl">
                  Log In
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="flex-1 text-center py-3 bg-blue-600 text-white rounded-2xl shadow-md">
                  Get Started →
                </Link>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
