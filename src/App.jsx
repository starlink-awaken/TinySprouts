import React, { useState, useEffect } from 'react';
import { Sprout, Heart, PlusCircle, BookOpen, Settings, CheckCircle2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from './store';

// Views
import { HomeView } from './views/HomeView';
import { LibraryView } from './views/LibraryView';
import { ProfileView } from './views/ProfileView';

function App() {
  const { level, addExp, activeTab, setActiveTab } = useStore();
  const [showToast, setShowToast] = useState(false);
  const [lastAction, setLastAction] = useState('');

  // 监听等级变化
  useEffect(() => {
    if (level > 1) { // 只要升级就提示，不仅仅是 level > 2
      setLastAction(`恭喜升到 LV.${level}! 🎉`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  }, [level]);

  // 处理开始互动的通用逻辑
  const handleStartActivity = (activity) => {
    const points = activity.exp || 15;
    setLastAction(`完成 "${activity.title}" +${points}EXP`);
    addExp(points);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
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
            className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
          >
            <div className="bg-[#94C973] text-white px-5 py-2.5 rounded-full shadow-xl flex items-center gap-2 text-sm font-bold border-2 border-white backdrop-blur-md">
              <Sparkles size={16} /> {lastAction}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="flex justify-between items-center mb-8 sticky top-0 z-40 py-2 bg-[#FDFCF0]/80 backdrop-blur-sm">
        <div>
          <h1 className="text-2xl font-black text-[#94C973] tracking-tight flex items-center gap-2">
            TinySprouts <Sprout fill="#94C973" />
          </h1>
          <p className="text-slate-400 text-xs mt-1 font-medium italic">Love grows here.</p>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
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
            {/* Fav Tab Placeholder */}
            {activeTab === 'fav' && (
               <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                  <Heart size={48} className="mb-4 opacity-20" />
                  <p className="text-sm font-medium">收藏夹暂空</p>
               </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Fixed Bottom Nav */}
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