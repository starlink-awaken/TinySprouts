import React from 'react';
import { useStore } from '../store';
import { RotateCcw, Award, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export function ProfileView() {
  const { level, exp, resetProgress } = useStore();

  const handleReset = () => {
    if (confirm('确定要重置所有进度吗？这将无法撤销。')) {
      resetProgress();
      alert('数据已重置');
    }
  };

  return (
    <div className="pb-24">
      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 bg-[#94C973]/20 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-xl">
           <span className="text-4xl">👶</span>
        </div>
        <h2 className="text-xl font-black text-slate-800">我家宝宝</h2>
        <p className="text-sm text-slate-400 font-medium">18 个月大 · 小探险家</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-4 rounded-3xl border border-slate-100 flex flex-col items-center">
          <Award className="text-orange-400 mb-2" size={32} />
          <span className="text-2xl font-black text-slate-800">{level}</span>
          <span className="text-xs text-slate-400 font-bold uppercase">当前等级</span>
        </div>
        <div className="bg-white p-4 rounded-3xl border border-slate-100 flex flex-col items-center">
          <Star className="text-yellow-400 mb-2" size={32} />
          <span className="text-2xl font-black text-slate-800">{exp}</span>
          <span className="text-xs text-slate-400 font-bold uppercase">当前经验</span>
        </div>
      </div>

      <h3 className="text-sm font-bold text-slate-400 mb-4 px-2 uppercase tracking-wider">设置</h3>
      <motion.button 
        whileTap={{ scale: 0.98 }}
        onClick={handleReset}
        className="w-full bg-red-50 text-red-500 p-4 rounded-2xl font-bold flex items-center justify-center gap-2 border border-red-100"
      >
        <RotateCcw size={18} /> 重置所有进度
      </motion.button>
    </div>
  );
}
