import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Smile, Frown, Meh, Ghost, Heart, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { speak } from '../utils/voice';
import { playSfx } from '../utils/sfx';
import { useStore } from '../store';

const EMOTIONS = [
  { id: 'happy', icon: Smile, label: '开心', color: 'text-yellow-400', bg: 'bg-yellow-50', sound: '太棒了，你看起来很开心！' },
  { id: 'sad', icon: Frown, label: '难过', color: 'text-blue-400', bg: 'bg-blue-50', sound: '抱抱你，别难过哦。' },
  { id: 'neutral', icon: Meh, label: '平常', color: 'text-slate-400', bg: 'bg-slate-50', sound: '这是平静的一天。' },
  { id: 'surprised', icon: Ghost, label: '惊讶', color: 'text-purple-400', bg: 'bg-purple-50', sound: '哇！发生了什么惊奇的事？' },
];

export function EmotionMatch({ onBack }) {
  const [target, setTarget] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const { completeActivity } = useStore();

  const nextRound = () => {
    const randomTarget = EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)];
    setTarget(randomTarget);
    setOptions([...EMOTIONS].sort(() => Math.random() - 0.5));
    speak(`哪个是${randomTarget.label}？`);
  };

  useEffect(() => {
    nextRound();
  }, []);

  const handleSelect = (option) => {
    if (option.id === target.id) {
      playSfx('ding');
      setScore(s => s + 1);
      speak(target.sound);
      confetti({ particleCount: 40, spread: 30, origin: { y: 0.6 } });
      
      if (score >= 4) {
        setTimeout(() => {
          playSfx('win');
          completeActivity(4, 30, '社会情感');
          speak("你真是情绪识别小能手！");
        }, 500);
      } else {
        setTimeout(nextRound, 1500);
      }
    } else {
      playSfx('pop');
      speak("不对哦，再观察一下。");
    }
  };

  return (
    <div className="fixed inset-0 bg-[#FFF5F5] z-50 p-6 flex flex-col items-center">
      <header className="w-full flex justify-between items-center mb-10">
        <button onClick={onBack} className="p-3 bg-white rounded-2xl shadow-sm">
          <ArrowLeft size={24} className="text-slate-400" />
        </button>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={20} className={i < score ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'} />
          ))}
        </div>
      </header>

      <AnimatePresence mode="wait">
        {target && (
          <motion.div
            key={target.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="text-center mb-12"
          >
            <div className="bg-white w-32 h-32 rounded-[3rem] shadow-xl flex items-center justify-center mx-auto mb-4 border-4 border-brand-pink/10">
              <target.icon size={64} className={target.color} />
            </div>
            <h2 className="text-4xl font-black text-slate-800 tracking-tight">找一找：{target.label}</h2>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        {options.map((option) => (
          <motion.button
            key={option.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect(option)}
            className={`aspect-square ${option.bg} rounded-[2.5rem] flex flex-col items-center justify-center shadow-lg border-2 border-white`}
          >
            <option.icon size={48} className={option.color} />
            <span className="mt-2 font-black text-slate-500 uppercase tracking-widest text-[10px]">{option.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
