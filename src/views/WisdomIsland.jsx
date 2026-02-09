import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star, Sparkles, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStore } from '../store';
import { levels } from '../data/levels';
import { speak } from '../utils/voice';
import { playSfx } from '../utils/sfx';
import { GuideHand } from '../components/GuideHand';
import { ComboFire } from '../components/ComboFire';

export function WisdomIsland({ onBack }) {
  const [levelIndex, setLevelIndex] = useState(0);
  const currentLevel = levels[levelIndex];
  const [items, setItems] = useState(currentLevel.items);
  const [lastDrop, setLastDrop] = useState(null);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const { completeActivity, streak, updateStreak } = useStore();
  
  const targetRefs = useRef({});

  useEffect(() => {
    setItems(currentLevel.items);
    setShowLevelComplete(false);
    speak(currentLevel.instruction);
    const guideTimer = setTimeout(() => setShowGuide(true), 3000);
    return () => clearTimeout(guideTimer);
  }, [levelIndex]);

  const handleDragEnd = (event, info, item) => {
    setShowGuide(false);
    const { x, y } = info.point;
    
    let matchedTarget = null;
    for (const [type, ref] of Object.entries(targetRefs.current)) {
      if (!ref) continue;
      const rect = ref.getBoundingClientRect();
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        matchedTarget = type;
        break;
      }
    }

    if (matchedTarget === item.category) {
      playSfx('ding');
      updateStreak(true); // 连击+1
      setLastDrop(matchedTarget);
      setItems(prev => prev.filter(i => i.id !== item.id));
      const praise = ["太棒了！", "真聪明！", "找对了！", "真厉害！"];
      speak(praise[Math.floor(Math.random() * praise.length)] + " 这是" + item.name);
      setTimeout(() => setLastDrop(null), 300);
    } else {
      playSfx('pop');
      updateStreak(false); // 连击中断
      if (matchedTarget) speak("哎呀，这里不是它的家哦");
    }
  };

  useEffect(() => {
    if (items.length === 0) {
      setShowGuide(false);
      playSfx('win');
      confetti({ particleCount: 100, spread: 60, origin: { y: 0.7 } });
      setShowLevelComplete(true);
      
      if (levelIndex === levels.length - 1) {
        completeActivity(1, 50, '数理逻辑');
        speak("恭喜你！完成了所有探险任务！");
      } else {
        speak("太棒了！我们去下一关吧。");
      }
    }
  }, [items]);

  return (
    <div className="fixed inset-0 bg-[#FDFCF0] z-50 p-6 flex flex-col font-sans select-none overflow-hidden">
      <ComboFire streak={streak} />
      {showGuide && !showLevelComplete && <GuideHand />}
      
      <header className="flex items-center justify-between mb-6">
        <motion.button whileTap={{ scale: 0.8 }} onClick={onBack} className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
          <ArrowLeft size={24} className="text-slate-400" />
        </motion.button>
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-black text-slate-800 tracking-tight">{currentLevel.title}</h2>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter bg-white px-3 py-0.5 rounded-full mt-1 border border-slate-50 shadow-sm">
            关卡 {levelIndex + 1} / {levels.length}
          </span>
        </div>
        <div className="w-12 h-12 bg-brand-sprout/20 rounded-2xl flex items-center justify-center border border-brand-sprout/10">
          <Star className="text-brand-sprout fill-brand-sprout" size={24} />
        </div>
      </header>

      <div className="flex-1 flex flex-col justify-around relative">
        <div className="grid grid-cols-1 gap-4">
          {currentLevel.targets.map(target => (
            <motion.div 
              key={target.type}
              ref={el => targetRefs.current[target.type] = el}
              animate={lastDrop === target.type ? { scale: [1, 1.08, 1], backgroundColor: '#ecfdf5' } : {}}
              className="h-32 rounded-[2.5rem] border-4 border-dashed border-slate-200 bg-white/40 flex flex-col items-center justify-center relative overflow-hidden transition-colors"
            >
              <span className="text-5xl mb-1 drop-shadow-md">{target.icon}</span>
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{target.label}</span>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center gap-6 h-32 items-center flex-wrap px-4">
          <AnimatePresence>
            {!showLevelComplete && items.map(item => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.id}
                  drag
                  dragSnapToOrigin
                  onDragEnd={(e, i) => handleDragEnd(e, i, item)}
                  whileHover={{ scale: 1.1 }}
                  whileDrag={{ scale: 1.3, rotate: [0, -5, 5, 0], zIndex: 100 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="w-20 h-20 bg-white rounded-[2rem] shadow-xl border-2 border-slate-50 flex items-center justify-center cursor-grab active:cursor-grabbing p-2"
                >
                  <Icon className={item.color} size={44} strokeWidth={2.5} />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {showLevelComplete && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-[#FDFCF0]/95 backdrop-blur-xl rounded-[3rem]"
            >
              <div className="bg-white p-10 rounded-[3rem] shadow-2xl mb-8 relative border-4 border-brand-sprout/20">
                <Star className="text-yellow-400 fill-yellow-400 absolute -top-6 -right-6 rotate-12" size={48} />
                <Sparkles className="text-brand-sprout" size={80} />
              </div>
              <h3 className="text-3xl font-black text-slate-800 mb-10 text-center leading-tight">
                {levelIndex === levels.length - 1 ? "全关大通关！" : "关卡完成！"}
              </h3>
              
              <div className="space-y-4 w-full px-10">
                {levelIndex < levels.length - 1 ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setLevelIndex(i => i + 1)}
                    className="w-full bg-[#94C973] text-white py-5 rounded-[2.5rem] text-xl font-black flex items-center justify-center gap-3 shadow-xl shadow-[#94C973]/30"
                  >
                    下一关 <ChevronRight size={24} strokeWidth={3} />
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={onBack}
                    className="w-full bg-brand-sky text-white py-5 rounded-[2.5rem] text-xl font-black shadow-xl"
                  >
                    返回探险基地
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="bg-white/60 backdrop-blur-sm p-4 rounded-[2rem] mt-4 border border-white flex items-center justify-center gap-3">
        <div className="w-2 h-2 bg-brand-sprout rounded-full animate-pulse" />
        <p className="text-xs font-black text-slate-500 tracking-tight">{currentLevel.instruction}</p>
      </div>
    </div>
  );
}