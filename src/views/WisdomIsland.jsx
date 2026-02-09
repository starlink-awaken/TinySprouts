import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star, Sparkles, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStore } from '../store';
import { levels } from '../data/levels';
import { speak } from '../utils/voice';
import { playSfx } from '../utils/sfx';
import { GuideHand } from '../components/GuideHand';

export function WisdomIsland({ onBack }) {
  const [levelIndex, setLevelLevelIndex] = useState(0);
  const currentLevel = levels[levelIndex];
  const [items, setItems] = useState(currentLevel.items);
  const [lastDrop, setLastDrop] = useState(null);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const { completeActivity } = useStore();

  // 关卡开始逻辑
  useEffect(() => {
    setItems(currentLevel.items);
    setShowLevelComplete(false);
    speak(currentLevel.instruction);
    
    // 3秒后显示引导手势
    const guideTimer = setTimeout(() => setShowGuide(true), 3000);
    return () => clearTimeout(guideTimer);
  }, [levelIndex]);

  const handleDragEnd = (event, info, item) => {
    setShowGuide(false); // 只要一操作，立即隐藏引导
    const dropY = info.point.y;
    const targetCount = currentLevel.targets.length;
    const dropIndex = Math.min(Math.floor(dropY / (600 / targetCount)), targetCount - 1);
    const target = currentLevel.targets[dropIndex];

    if (item.category === target.type) {
      playSfx('ding');
      setLastDrop(target.type);
      setItems(prev => prev.filter(i => i.id !== item.id));
      const praise = ["太棒了！", "真聪明！", "找对了！", "你是天才！"];
      speak(praise[Math.floor(Math.random() * praise.length)] + " 这是" + item.name);
      setTimeout(() => setLastDrop(null), 300);
    } else {
      playSfx('pop');
      const hints = ["哎呀，放错啦", "再试一次吧", "这个家不是它的哦"];
      speak(hints[Math.floor(Math.random() * hints.length)]);
    }
  };

  // 监听单关结束
  useEffect(() => {
    if (items.length === 0) {
      setShowGuide(false);
      playSfx('win');
      confetti({ particleCount: 80, spread: 50, origin: { y: 0.8 } });
      setShowLevelComplete(true);
      
      if (levelIndex === levels.length - 1) {
        completeActivity(1, 50);
        speak("恭喜你！完成了所有探险任务！");
      } else {
        speak("太棒了！我们去下一关吧。");
      }
    }
  }, [items]);

  return (
    <div className="fixed inset-0 bg-[#FDFCF0] z-50 p-6 flex flex-col font-sans">
      {showGuide && !showLevelComplete && <GuideHand />}
      
      <header className="flex items-center justify-between mb-6">
        <motion.button whileTap={{ scale: 0.8 }} onClick={onBack} className="p-3 bg-white rounded-2xl shadow-sm">
          <ArrowLeft size={24} className="text-slate-400" />
        </motion.button>
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-black text-slate-800">{currentLevel.title}</h2>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">关卡 {levelIndex + 1} / {levels.length}</span>
        </div>
        <div className="w-12 h-12 bg-brand-sprout/20 rounded-full flex items-center justify-center">
          <Star className="text-brand-sprout fill-brand-sprout" size={24} />
        </div>
      </header>

      <div className="flex-1 flex flex-col justify-around relative">
        {/* Drop Targets */}
        <div className="grid grid-cols-1 gap-4">
          {currentLevel.targets.map(target => (
            <motion.div 
              key={target.type}
              animate={lastDrop === target.type ? { scale: [1, 1.05, 1], backgroundColor: '#ecfdf5' } : {}}
              className="h-32 rounded-[2rem] border-4 border-dashed border-slate-200 bg-white/50 flex flex-col items-center justify-center relative overflow-hidden"
            >
              <span className="text-5xl mb-1 drop-shadow-sm">{target.icon}</span>
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">{target.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Draggable Items */}
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
                  whileDrag={{ scale: 1.2, zIndex: 100 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="w-20 h-20 bg-white rounded-3xl shadow-xl border border-slate-100 flex items-center justify-center cursor-grab active:cursor-grabbing p-2"
                >
                  <Icon className={item.color} size={40} />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Level Complete Overlay */}
        <AnimatePresence>
          {showLevelComplete && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-[#FDFCF0]/95 backdrop-blur-md rounded-[3rem]"
            >
              <div className="bg-white p-8 rounded-full shadow-2xl mb-6 relative">
                <Star className="text-yellow-400 fill-yellow-400 absolute -top-4 -right-4 rotate-12" size={32} />
                <Sparkles className="text-brand-sprout" size={64} />
              </div>
              <h3 className="text-3xl font-black text-slate-800 mb-8 text-center leading-tight px-6">
                {levelIndex === levels.length - 1 ? "恭喜你！\n完成所有探险" : "太棒了！\n关卡完成"}
              </h3>
              
              {levelIndex < levels.length - 1 ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setLevelLevelIndex(i => i + 1)}
                  className="bg-[#94C973] text-white px-10 py-5 rounded-[2.5rem] text-xl font-black flex items-center gap-3 shadow-xl shadow-[#94C973]/30"
                >
                  下一关 <ChevronRight size={24} strokeWidth={3} />
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onBack}
                  className="bg-[#A1C3D1] text-white px-10 py-5 rounded-[2.5rem] text-xl font-black shadow-xl shadow-[#A1C3D1]/30"
                >
                  回到基地
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="text-center bg-white/40 p-4 rounded-3xl mt-4 border border-white">
        <p className="text-sm font-black text-slate-500 tracking-tight">{currentLevel.instruction}</p>
      </div>
    </div>
  );
}