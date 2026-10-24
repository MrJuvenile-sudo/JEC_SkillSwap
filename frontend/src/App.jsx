import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import LoadingSpinner from "./Components/LoadingSpinner";
import SplashScreen from "./Components/SplashScreen";

import Home from "./Pages/Home";
import Features from "./Pages/Features";
import HowItWorks from "./Pages/HowItWorks";
import FAQ from "./Pages/FAQ";

import Explore from "./Pages/Explore";
import LiveSessions from "./Pages/LiveSessions";
import Requests from "./Pages/Requests";
import Exchanges from "./Pages/Exchanges";
import Profile from "./Pages/Profile";
import UserProfileView from "./Pages/UserProfileView";
import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Admin from "./Pages/Admin";

// Protected Route Wrapper Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner label="Authenticating session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Global Scroll To Top on every refresh and route transition
function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  React.useEffect(() => {
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  }, [pathname, search, hash]);

  React.useEffect(() => {
    const handleReset = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    };

    window.addEventListener("load", handleReset);
    window.addEventListener("pageshow", handleReset);
    handleReset();

    return () => {
      window.removeEventListener("load", handleReset);
      window.removeEventListener("pageshow", handleReset);
    };
  }, []);

  return null;
}

function AppRoutes() {
  const { loading } = useAuth();
  const location = useLocation();
  const isAdminRoute = location.pathname === "/admin";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <LoadingSpinner label="Launching SkillSwap..." />
      </div>
    );
  }

  if (isAdminRoute) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900">
        <Routes>
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/faq" element={<FAQ />} />

          <Route path="/explore" element={<Explore />} />
          <Route path="/live" element={<LiveSessions />} />
          <Route path="/live-sessions" element={<Navigate to="/live" replace />} />
          <Route path="/classes" element={<Navigate to="/live" replace />} />
          <Route path="/profile/:id" element={<UserProfileView />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route path="/matches" element={<Navigate to="/explore" replace />} />
          <Route
            path="/requests"
            element={
              <ProtectedRoute>
                <Requests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exchanges"
            element={
              <ProtectedRoute>
                <Exchanges />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}