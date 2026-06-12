import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import NavBar from './components/layout/NavBar';
import Footer from './components/layout/Footer';

const HomePage    = lazy(() => import('./pages/HomePage'));
const GamesPage   = lazy(() => import('./pages/GamesPage'));
const DevLabPage  = lazy(() => import('./pages/DevLabPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const ChatBot     = lazy(() => import('./components/organisms/ChatBot'));

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      >
        <Suspense fallback={<PageLoader />}>
          <Routes location={location}>
            <Route path="/"        element={<HomePage />} />
            <Route path="/games"   element={<GamesPage />} />
            <Route path="/lab"     element={<DevLabPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*"        element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
};

const PageLoader = () => {
  const { isDark } = useTheme();
  return (
    <div className={`min-h-screen flex items-center justify-center ${isDark ? 'text-purple-400' : 'text-[#5500CC]'}`}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-mono uppercase tracking-widest opacity-60">Loading…</span>
      </div>
    </div>
  );
};

const MainLayout = () => {
  const { isDark } = useTheme();
  return (
    <Router>
      <div className={`min-h-screen font-sans transition-colors duration-500 relative ${isDark ? 'bg-[#08080f] text-gray-200' : 'bg-[#FFF6EE] text-gray-900'}`}>
        <style>{`
          @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
          @keyframes speedStreak { 0%{transform:translateX(-100%) skewX(-15deg);opacity:0;} 50%{opacity:0.12;} 100%{transform:translateX(200%) skewX(-15deg);opacity:0;} }
          @keyframes leoBubbleShrink { from{transform:scaleX(1);} to{transform:scaleX(0);} }
          .clip-path-polygon { clip-path: polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px); }
          .speed-streak { animation: speedStreak 4s ease-in-out infinite; }
        `}</style>

        <div className={`fixed inset-0 pointer-events-none z-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] ${isDark ? 'mix-blend-overlay' : 'mix-blend-multiply'}`} />

        {isDark ? (
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <div className="absolute top-[-10%] left-[10%] w-[500px] h-[500px] bg-purple-900/10 blur-[150px] rounded-full" />
            <div className="absolute top-[30%] right-[-5%] w-[400px] h-[400px] bg-orange-900/8 blur-[120px] rounded-full" />
            <div className="absolute top-[15%] left-0 w-[50%] h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent speed-streak" style={{animationDelay:'0s'}} />
            <div className="absolute top-[65%] left-0 w-[35%] h-[1px] bg-gradient-to-r from-transparent via-orange-400/15 to-transparent speed-streak" style={{animationDelay:'2s'}} />
          </div>
        ) : (
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <div className="absolute top-[-5%] right-[5%] w-[400px] h-[400px] bg-orange-200/30 blur-[120px] rounded-full" />
            <div className="absolute bottom-[10%] left-[5%] w-[300px] h-[300px] bg-purple-100/20 blur-[100px] rounded-full" />
          </div>
        )}

        <NavBar />
        <main className="relative z-10">
          <AnimatedRoutes />
        </main>
        <Suspense fallback={null}><ChatBot /></Suspense>
        <Footer />
      </div>
    </Router>
  );
};

export default function App() {
  return <ThemeProvider><MainLayout /></ThemeProvider>;
}
