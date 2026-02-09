import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile, Heart, Star, ArrowLeft, RefreshCw, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStore } from '../store';
import { speak } from '../utils/voice';
import { playSfx } from '../utils/sfx';

const ANIMALS = [
  { id: 'smile', icon: Smile, color: 'text-yellow-500', label: '开心' },
  { id: 'heart', icon: Heart, color: 'text-red-500', label: '爱心' },
  { id: 'sparkles', icon: Sparkles, color: 'text-blue-500', label: '星星' },
];

export function NumberForest({ onBack }) {
  const [targets, setTargets] = useState([]);
  const [count, setCount] = useState(0);
  const targetCount = 5;
  const { completeActivity } = useStore();

  const initGame = () => {
    setCount(0);
    const newTargets = Array.from({ length: targetCount }).map((_, i) => {
      const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
      return {
        id: `target-${Date.now()}-${i}`,
        ...animal,
        x: 20 + Math.random() * 60, // 20% to 80%
        y: 20 + Math.random() * 60, // 20% to 80%
        delay: i * 0.1
      };
    });
    setTargets(newTargets);
    speak(`请帮我找出 ${targetCount} 个小伙伴！`);
  };

  useEffect(() => {
    // 稍微延迟初始化，确保组件完全挂载
    const timer = setTimeout(initGame, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleTap = (id) => {
    playSfx('pop');
    setCount(c => {
      const next = c + 1;
      speak(next.toString());
      if (next === targetCount) {
        setTimeout(() => {
          playSfx('win');
          speak("太棒了！你找齐了！");
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
          completeActivity(2, 20, '数理逻辑');
        }, 500);
      }
      return next;
    });
    setTargets(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="fixed inset-0 bg-[#FDFCF0] z-50 flex flex-col font-sans overflow-hidden select-none">
      <header className="p-6 flex justify-between items-center z-30 relative bg-white/50 backdrop-blur-sm border-b border-slate-100">
        <motion.button 
          whileTap={{ scale: 0.8 }}
          onClick={onBack} 
          className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100"
        >
          <ArrowLeft size={24} className="text-slate-500" />
        </motion.button>
        <div className="bg-white px-6 py-2 rounded-full shadow-sm border border-slate-100 flex items-center gap-3">
          <Star size={20} className="text-yellow-400 fill-yellow-400" />
          <span className="text-2xl font-black text-slate-700">{count} / {targetCount}</span>
        </div>
      </header>

      <div className="flex-1 relative z-10 w-full bg-[#ecfccb]/30">
        <AnimatePresence>
          {targets.map((t) => {
            const Icon = t.icon;
            return (
              <motion.button
                key={t.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                whileTap={{ scale: 0.9 }}
                style={{ 
                  left: `${t.x}%`, 
                  top: `${t.y}%`,
                  position: 'absolute',
                  transform: 'translate(-50%, -50%)'
                }}
                className="p-5 bg-white rounded-[2.5rem] shadow-xl border-4 border-white cursor-pointer"
                onClick={() => handleTap(t.id)}
              >
                <div className="flex flex-col items-center">
                   <Icon size={48} className={t.color} strokeWidth={2.5} />
                   <span className="text-[10px] font-black text-slate-300 mt-1 uppercase tracking-widest">{t.label}</span>
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {count === targetCount && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute bottom-12 left-0 right-0 flex justify-center z-40"
        >
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={initGame}
            className="bg-[#94C973] text-white px-10 py-5 rounded-[2.5rem] text-xl font-black shadow-2xl flex items-center gap-3 border-4 border-white"
          >
            <RefreshCw size={24} strokeWidth={3} /> 再玩一次
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}