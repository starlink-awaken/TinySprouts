import React from 'react';
import { Sprout, PlayCircle, Star, Award, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store';
import { activities } from '../data/activities';

export function HomeView({ onStartActivity }) {
  const { exp, level, stars, completedActivityIds } = useStore();
  
  // 筛选一个未完成的高质量任务作为 featured
  const featured = activities.find(a => !completedActivityIds.includes(a.id)) || activities[0];

  return (
    <div className="space-y-8 pb-24 px-1">
      {/* Achievement Stats */}
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 no-scrollbar">
        <StatPill icon={<Star className="fill-yellow-400 text-yellow-400" size={14} />} value={stars} label="奖章" color="bg-yellow-50" />
        <StatPill icon={<Award className="text-purple-500" size={14} />} value={level} label="成就" color="bg-purple-50" />
      </div>

      {/* Hero Card */}
      <motion.div 
        layout
        className="bg-[#A1C3D1]/20 rounded-[2.5rem] p-8 relative overflow-hidden border-2 border-[#A1C3D1]/10 shadow-sm"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-[#A1C3D1] text-white text-[10px] px-3 py-1 rounded-full font-black tracking-widest uppercase">
              启蒙任务
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-3">{featured.title}</h2>
          <p className="text-sm text-slate-500 mb-8 leading-relaxed font-bold opacity-80">
            {featured.desc}
          </p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onStartActivity(featured)}
            className="bg-[#94C973] text-white px-8 py-4 rounded-3xl text-base font-black flex items-center gap-3 shadow-xl shadow-[#94C973]/30"
          >
            现在出发 <PlayCircle size={22} strokeWidth={3} />
          </motion.button>
        </div>
        <Sprout className="absolute -right-10 -bottom-10 text-[#94C973]/10 w-56 h-56 transform rotate-12" />
      </motion.div>

      {/* Daily Progress */}
      <section className="bg-white rounded-[2.5rem] p-7 border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-5">
          <div className="bg-[#94C973]/10 p-4 rounded-3xl">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Sprout className="text-[#94C973]" size={36} />
            </motion.div>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-end mb-2.5">
              <h4 className="text-lg font-black text-slate-700">智慧之树</h4>
              <span className="text-xs font-black text-[#94C973] bg-[#94C973]/10 px-2 py-0.5 rounded-lg">LV.{level}</span>
            </div>
            <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden p-1">
              <motion.div 
                initial={false}
                animate={{ width: `${exp}%` }}
                transition={{ type: "spring", stiffness: 60 }}
                className="h-full bg-gradient-to-r from-[#94C973] to-[#b8e0a1] rounded-full"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatPill({ icon, value, label, color }) {
  return (
    <div className={`${color} px-4 py-2 rounded-2xl flex items-center gap-2 border border-white shadow-sm flex-shrink-0`}>
      {icon}
      <span className="text-sm font-black text-slate-700">{value}</span>
      <span className="text-[10px] font-bold text-slate-400">{label}</span>
    </div>
  );
}