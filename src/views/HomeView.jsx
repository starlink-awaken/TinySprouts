import React from 'react';
import { Sprout, PlayCircle, BookOpen, Palette, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store';
import { activities } from '../data/activities';

export function HomeView({ onStartActivity }) {
  const { exp, level } = useStore();
  const featured = activities[0];

  return (
    <div className="space-y-8 pb-24">
      {/* Hero Card */}
      <motion.div 
        layout
        className="bg-[#A1C3D1]/20 rounded-[2rem] p-7 relative overflow-hidden border-2 border-[#A1C3D1]/10"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-[#A1C3D1] text-white text-[10px] px-2.5 py-1 rounded-lg font-black tracking-wider uppercase">Today's Pick</span>
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">{featured.title}</h2>
          <p className="text-sm text-slate-500 mb-8 leading-relaxed font-medium">
            {featured.desc}
          </p>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onStartActivity(featured)}
            className="bg-[#94C973] text-white px-8 py-4 rounded-2xl text-base font-black flex items-center gap-3 shadow-lg shadow-[#94C973]/30"
          >
            开始互动 <PlayCircle size={20} strokeWidth={3} />
          </motion.button>
        </div>
        <Sprout className="absolute -right-8 -bottom-8 text-[#94C973]/10 w-48 h-48 transform rotate-12" />
      </motion.div>

      {/* Progress Section */}
      <section className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm relative">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-[#94C973]/10 p-3 rounded-2xl">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              <Sprout className="text-[#94C973]" size={32} />
            </motion.div>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-end mb-1.5">
              <h4 className="text-base font-black text-slate-700">成长之树</h4>
              <span className="text-[11px] font-bold text-slate-400">{exp} / 100</span>
            </div>
            
            <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-50">
              <motion.div 
                initial={false}
                animate={{ width: `${exp}%` }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="h-full bg-gradient-to-r from-[#94C973] to-[#b8e0a1] rounded-full shadow-sm"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-2 border-t border-slate-50">
          <div className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
            <Sparkles size={12} /> 每一天都在成长
          </div>
          <div className="flex flex-col items-end">
             <span className="text-[10px] font-black text-slate-300 tracking-tighter uppercase leading-none mb-1">Level</span>
             <motion.span 
               key={level}
               initial={{ scale: 1.5, color: "#f59e0b" }}
               animate={{ scale: 1, color: "#94C973" }}
               className="text-2xl font-black leading-none"
             >
               {level}
             </motion.span>
          </div>
        </div>
      </section>
    </div>
  );
}
