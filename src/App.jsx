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
import { NumberForest } from './views/NumberForest';
import { ArtCanvas } from './views/ArtCanvas';
import { VoiceLab } from './views/VoiceLab';
import { EmotionMatch } from './views/EmotionMatch';
import { WeeklyReport } from './views/WeeklyReport';
import { MagicCursor } from './components/MagicCursor';

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
    switch(activity.id) {
      case 1: navigate('/game/wisdom'); break;
      case 2: navigate('/game/forest'); break;
      case 3: navigate('/game/art'); break;
      case 4: navigate('/game/emotion'); break;
      case 5: navigate('/game/voice'); break;
      default:
        const points = activity.exp || 15;
        setLastAction(`完成 "${activity.title}" +${points}EXP`);
        completeActivity(activity.id, points);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
    }
  };

  const isGameRoute = location.pathname.includes('/game');
  const isAdminRoute = location.pathname.includes('/admin');

  return (
    <div className="min-h-screen flex flex-col p-6 max-w-md mx-auto font-sans relative overflow-hidden bg-[#FDFCF0]">
      <MagicCursor />
      
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 20 }} exit={{ opacity: 0, y: -50 }}
            className="fixed top-0 left-0 right-0 z-[200] flex justify-center pointer-events-none"
          >
            <div className="bg-[#94C973] text-white px-5 py-2.5 rounded-full shadow-xl flex items-center gap-2 text-sm font-bold border-2 border-white backdrop-blur-md">
              <Sparkles size={16} /> {lastAction}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className={`flex justify-between items-center mb-8 sticky top-0 z-40 py-2 bg-[#FDFCF0]/80 backdrop-blur-sm ${isGameRoute || isAdminRoute ? 'hidden' : ''}`}>
        <div>
          <h1 className="text-2xl font-black text-[#94C973] tracking-tight flex items-center gap-2">
            TinySprouts <Sprout fill="#94C973" />
          </h1>
          <p className="text-slate-400 text-xs mt-1 font-medium italic">Love grows here.</p>
        </div>
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/game/wisdom')}
          className="bg-brand-sprout/10 p-2 rounded-xl text-brand-sprout"
        >
          <Brain size={24} />
        </motion.button>
      </header>

      <main className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route index element={<PageWrapper><HomeView onStartActivity={handleStartActivity} /></PageWrapper>} />
            <Route path="lib" element={<PageWrapper><LibraryView onStartActivity={handleStartActivity} /></PageWrapper>} />
            <Route path="profile" element={<PageWrapper><ProfileView /></PageWrapper>} />
            
            {/* Game Routes */}
            <Route path="game/wisdom" element={<WisdomIsland onBack={() => navigate('/')} />} />
            <Route path="game/forest" element={<NumberForest onBack={() => navigate('/')} />} />
            <Route path="game/art" element={<ArtCanvas onBack={() => navigate('/')} />} />
            <Route path="game/voice" element={<VoiceLab onBack={() => navigate('/')} />} />
            <Route path="game/emotion" element={<EmotionMatch onBack={() => navigate('/')} />} />

            {/* Admin Routes */}
            <Route path="admin/report" element={<WeeklyReport onBack={() => navigate('/profile')} />} />
            
            <Route path="/fav" element={
               <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                  <Heart size={48} className="mb-4 opacity-20" />
                  <p className="text-sm font-medium">收藏夹暂空</p>
               </div>
            } />
          </Routes>
        </AnimatePresence>
      </main>

      {!isGameRoute && !isAdminRoute && (
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

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
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