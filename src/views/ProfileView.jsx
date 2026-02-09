import React from 'react';
import { useStore } from '../store';
import { RotateCcw, Award, Star, Trophy, ShieldCheck, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export function ProfileView() {
  const { level, exp, resetProgress, stars, completedActivityIds } = useStore();

  const handleReset = () => {
    if (confirm('确定要重置所有进度吗？这将无法撤销。')) {
      resetProgress();
    }
  };

  return (
    <div className="pb-32 px-1">
      {/* Profile Header */}
      <div className="flex flex-col items-center mb-10 pt-4 text-center">
        <div className="relative">
          <div className="w-32 h-32 bg-[#94C973]/20 rounded-[3rem] flex items-center justify-center mb-6 border-4 border-white shadow-2xl overflow-hidden">
             <span className="text-6xl scale-110">👶</span>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-white p-2.5 rounded-2xl shadow-lg border-4 border-[#FDFCF0]">
            <Trophy size={20} fill="white" />
          </div>
        </div>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">小小探险家</h2>
        <p className="text-sm text-slate-400 font-bold bg-slate-100/50 px-4 py-1 rounded-full mt-2 inline-block">
          3-6岁启蒙阶段
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 gap-5 mb-10">
        <StatBox icon={<Award className="text-purple-500" size={32} />} value={level} label="等级勋章" color="bg-purple-50" />
        <StatBox icon={<Star className="text-yellow-500 fill-yellow-500" size={32} />} value={stars} label="获得星星" color="bg-yellow-50" />
      </div>

      {/* Badge Wall */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm mb-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            我的成就墙 <ShieldCheck size={16} />
          </h3>
          <span className="text-[10px] font-bold text-slate-300 italic">{completedActivityIds.length} 项突破</span>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className={`aspect-square rounded-2xl flex items-center justify-center text-xl shadow-inner ${
              i <= completedActivityIds.length ? 'bg-brand-sprout/10' : 'bg-slate-50'
            }`}>
              {i <= completedActivityIds.length ? "🎖️" : "🔒"}
            </div>
          ))}
        </div>
      </div>

      {/* Settings List */}
      <div className="space-y-4">
        <motion.button 
          whileTap={{ scale: 0.98 }}
          onClick={handleReset}
          className="w-full bg-slate-50 text-slate-400 p-5 rounded-[2rem] font-bold flex items-center justify-center gap-3 border border-slate-100/50 hover:bg-red-50 hover:text-red-400 transition-colors"
        >
          <RotateCcw size={18} /> 重置所有学习数据
        </motion.button>
        <p className="text-[10px] text-center text-slate-300 font-medium px-10">
          TinySprouts 为您的隐私负责。所有数据仅保存在本地设备中。
        </p>
      </div>
    </div>
  );
}

function StatBox({ icon, value, label, color }) {
  return (
    <div className={`${color} p-6 rounded-[2.5rem] flex flex-col items-center border border-white shadow-sm`}>
      <div className="mb-3">{icon}</div>
      <span className="text-3xl font-black text-slate-800 mb-1">{value}</span>
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{label}</span>
    </div>
  );
}