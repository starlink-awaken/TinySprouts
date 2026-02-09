import React, { useState, useEffect } from 'react';
import { Sprout, Heart, PlusCircle, BookOpen, Settings, Sparkles, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from './store';

// Views
import { HomeView } from './views/HomeView';
import { LibraryView } from './views/LibraryView';
import { ProfileView } from './views/ProfileView';
import { WisdomIsland } from './views/WisdomIsland';

import confetti from 'canvas-confetti';

// ... (previous imports)

function App() {
  // ...
  useEffect(() => {
    if (level > 1) {
      setLastAction(`恭喜升到 LV.${level}! 🎉`);
      setShowToast(true);
      
      // 升级烟花
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        zIndex: 200
      });

      setTimeout(() => setShowToast(false), 3000);
    }
  }, [level]);

  const handleStartActivity = (activity) => {
    if (activity.type === 'game') {
      setShowGame(true);
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
      <AnimatePresence>
        {showGame && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="fixed inset-0 z-[100]"
          >
            <WisdomIsland onBack={() => setShowGame(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
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
          <p className="text-slate-400 text-xs mt-1 font-medium italic">Learning is an adventure.</p>
        </div>
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowGame(true)}
          className="bg-brand-sprout/10 p-2 rounded-xl text-brand-sprout"
        >
          <Brain size={24} />
        </motion.button>
      </header>

      <main className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'home' && <HomeView onStartActivity={handleStartActivity} />}
            {activeTab === 'lib' && <LibraryView onStartActivity={handleStartActivity} />}
            {activeTab === 'profile' && <ProfileView />}
            {activeTab === 'fav' && (
               <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                  <Heart size={48} className="mb-4 opacity-20" />
                  <p className="text-sm font-medium">收藏夹暂空</p>
               </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <nav className="fixed bottom-8 left-8 right-8 max-w-md mx-auto bg-white/90 backdrop-blur-xl rounded-[1.5rem] p-3 shadow-2xl border border-white/50 flex justify-around items-center z-40">
        <NavButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<PlusCircle size={26} />} />
        <NavButton active={activeTab === 'lib'} onClick={() => setActiveTab('lib')} icon={<BookOpen size={26} />} />
        <NavButton active={activeTab === 'fav'} onClick={() => setActiveTab('fav')} icon={<Heart size={26} />} />
        <NavButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={<Settings size={26} />} />
      </nav>
    </div>
  );
}

function NavButton({ active, icon, onClick }) {
  return (
    <motion.button 
      whileTap={{ scale: 0.8 }}
      onClick={onClick}
      className={`p-3.5 rounded-2xl transition-all duration-300 ${active ? 'text-[#94C973] bg-[#94C973]/10 shadow-inner' : 'text-slate-300'}`}
    >
      {icon}
    </motion.button>
  );
}

export default App;