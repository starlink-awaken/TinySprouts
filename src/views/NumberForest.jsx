import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rabbit, Bird, Squirrel, ArrowLeft, Star, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStore } from '../store';
import { speak } from '../utils/voice';
import { playSfx } from '../utils/sfx';

const ANIMALS = [
  { id: 'rabbit', icon: Rabbit, color: 'text-pink-400' },
  { id: 'bird', icon: Bird, color: 'text-blue-400' },
  { id: 'squirrel', icon: Squirrel, color: 'text-orange-400' },
];

export function NumberForest({ onBack }) {
  const [targets, setTargets] = useState([]);
  const [count, setCount] = useState(0);
  const [targetCount, setTargetCount] = useState(5);
  const { completeActivity } = useStore();

  const initGame = () => {
    setCount(0);
    const newTargets = Array.from({ length: targetCount }).map((_, i) => ({
      id: i,
      ...ANIMALS[Math.floor(Math.random() * ANIMALS.length)],
      x: Math.random() * 80 + 10, // 10% - 90%
      y: Math.random() * 60 + 20, // 20% - 80%
      delay: Math.random() * 2
    }));
    setTargets(newTargets);
    speak(`请帮我找出 ${targetCount} 只小动物！`);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleTap = (id) => {
    playSfx('pop');
    setCount(c => {
      const next = c + 1;
      speak(next.toString());
      if (next === targetCount) {
        setTimeout(() => {
          playSfx('win');
          speak("太棒了！你数对了！");
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
          completeActivity(2, 20, '数理逻辑');
        }, 500);
      }
      return next;
    });
    setTargets(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="fixed inset-0 bg-[#ecfccb] z-50 flex flex-col font-sans overflow-hidden">
      <header className="p-6 flex justify-between items-center z-10">
        <button onClick={onBack} className="p-3 bg-white/80 rounded-2xl shadow-sm backdrop-blur">
          <ArrowLeft size={24} className="text-slate-500" />
        </button>
        <div className="bg-white/80 px-6 py-2 rounded-full shadow-sm backdrop-blur">
          <span className="text-2xl font-black text-brand-sprout">{count} / {targetCount}</span>
        </div>
      </header>

      {/* Game Area */}
      <div className="absolute inset-0">
        <AnimatePresence>
          {targets.map((t) => {
            const Icon = t.icon;
            return (
              <motion.button
                key={t.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  y: [0, -10, 0],
                  x: [0, 5, 0]
                }}
                exit={{ scale: 1.5, opacity: 0 }}
                transition={{ 
                  delay: t.delay,
                  y: { repeat: Infinity, duration: 2, ease: "easeInOut" },
                  x: { repeat: Infinity, duration: 3, ease: "easeInOut" }
                }}
                style={{ left: `${t.x}%`, top: `${t.y}%` }}
                className="absolute p-4 bg-white rounded-full shadow-lg cursor-pointer active:scale-90 transition-transform"
                onClick={() => handleTap(t.id)}
              >
                <Icon size={40} className={t.color} />
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {count === targetCount && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute bottom-10 left-0 right-0 flex justify-center z-20"
        >
          <button 
            onClick={initGame}
            className="bg-[#94C973] text-white px-8 py-4 rounded-full text-xl font-black shadow-xl flex items-center gap-2"
          >
            <RefreshCw /> 再玩一次
          </button>
        </motion.div>
      )}
    </div>
  );
}
