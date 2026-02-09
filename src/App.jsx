import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, NavLink } from 'react-router-dom';
import { Sprout, Heart, PlusCircle, BookOpen, Settings, Sparkles, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from './store';
import confetti from 'canvas-confetti';

// Views
import { HomeView } from './views/HomeView';
import { LibraryView } from './views/LibraryView';
import { ProfileView } from './views/ProfileView';
import { WisdomIsland } from './views/WisdomIsland';

function App() {
  const { level, completeActivity } = useStore();
  const [showToast, setShowToast] = useState(false);
  const [lastAction, setLastAction] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (level > 1) {
      setLastAction(`恭喜升到 LV.${level}! 🎉`);
      setShowToast(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, zIndex: 200 });
      setTimeout(() => setShowToast(false), 3000);
    }
  }, [level]);

  const handleStartActivity = (activity) => {
    if (activity.type === 'game') {
      navigate('/game');
    } else {
      const points = activity.exp || 15;
      setLastAction(`完成 "${activity.title}" +${points}EXP`);
      completeActivity(activity.id, points);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-6 max-w-md mx-auto font-sans relative overflow-hidden bg-[#FDFCF0]">
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-0 left-0 right-0 z-[200] flex justify-center pointer-events-none"
          >
            <div className="bg-[#94C973] text-white px-5 py-2.5 rounded-full shadow-xl flex items-center gap-2 text-sm font-bold border-2 border-white backdrop-blur-md">
              <Sparkles size={16} /> {lastAction}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="flex justify-between items-center mb-8 sticky top-0 z-40 py-2 bg-[#FDFCF0]/80 backdrop-blur-sm">
        <div>
          <h1 className="text-2xl font-black text-[#94C973] tracking-tight flex items-center gap-2">
            TinySprouts <Sprout fill="#94C973" />
          </h1>
          <p className="text-slate-400 text-xs mt-1 font-medium italic">Love grows here.</p>
        </div>
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/game')}
          className="bg-brand-sprout/10 p-2 rounded-xl text-brand-sprout"
        >
          <Brain size={24} />
        </motion.button>
      </header>

      <main className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomeView onStartActivity={handleStartActivity} />} />
            <Route path="/lib" element={<LibraryView onStartActivity={handleStartActivity} />} />
            <Route path="/profile" element={<ProfileView />} />
            <Route path="/game" element={<WisdomIsland onBack={() => navigate('/')} />} />
            <Route path="/fav" element={
               <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                  <Heart size={48} className="mb-4 opacity-20" />
                  <p className="text-sm font-medium">收藏夹暂空</p>
               </div>
            } />
          </Routes>
        </AnimatePresence>
      </main>

      {/* Navigation Footer */}
      {!location.pathname.includes('/game') && (
        <nav className="fixed bottom-8 left-8 right-8 max-w-md mx-auto bg-white/90 backdrop-blur-xl rounded-[1.5rem] p-3 shadow-2xl border border-white/50 flex justify-around items-center z-40">
          <NavBtn to="/" icon={<PlusCircle size={26} />} />
          <NavBtn to="/lib" icon={<BookOpen size={26} />} />
          <NavBtn to="/fav" icon={<Heart size={26} />} />
          <NavBtn to="/profile" icon={<Settings size={26} />} />
        </nav>
      )}
    </div>
  );
}

function NavBtn({ to, icon }) {
  return (
    <NavLink 
      to={to}
      className={({ isActive }) => `
        p-3.5 rounded-2xl transition-all duration-300
        ${isActive ? 'text-[#94C973] bg-[#94C973]/10 shadow-inner' : 'text-slate-300 hover:bg-slate-50'}
      `}
    >
      <motion.div whileTap={{ scale: 0.8 }}>{icon}</motion.div>
    </NavLink>
  );
}

export default App;
