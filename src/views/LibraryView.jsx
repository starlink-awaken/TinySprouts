import React from 'react';
import { motion } from 'framer-motion';
import { activities } from '../data/activities';
import { PlayCircle, CheckCircle2, Lock } from 'lucide-react';
import { useStore } from '../store';

export function LibraryView({ onStartActivity }) {
  const { completedActivityIds } = useStore();

  return (
    <div className="pb-24 px-1">
      <div className="flex items-center justify-between mb-8 px-1">
        <h2 className="text-2xl font-black text-slate-800">活动实验室</h2>
        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
          {completedActivityIds.length} / {activities.length} 已完成
        </span>
      </div>

      <div className="space-y-5">
        {activities.map((item, index) => {
          const Icon = item.icon;
          const isDone = completedActivityIds.includes(item.id);
          
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onStartActivity(item)}
              className={`relative bg-white p-5 rounded-[2rem] shadow-sm border-2 transition-all cursor-pointer ${
                isDone ? 'border-[#94C973]/30 bg-[#94C973]/5' : 'border-slate-50 hover:border-slate-200'
              }`}
            >
              <div className="flex items-center gap-5">
                <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                  <Icon size={32} strokeWidth={2.5} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded-lg uppercase tracking-tight">
                      {item.category}
                    </span>
                    <span className="text-[10px] font-black text-slate-300">
                      {item.age}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-800 tracking-tight">
                    {item.title}
                  </h3>
                </div>

                <div className="flex items-center justify-center">
                  {isDone ? (
                    <div className="bg-[#94C973] text-white p-2 rounded-full shadow-inner">
                      <CheckCircle2 size={24} />
                    </div>
                  ) : (
                    <PlayCircle className="text-slate-200 hover:text-brand-sprout" size={32} strokeWidth={2.5} />
                  )}
                </div>
              </div>
              
              {/* Progress Dot */}
              <div className="absolute top-4 right-4 flex gap-1">
                {[...Array(item.difficulty)].map((_, i) => (
                  <div key={i} className={`w-1.5 h-1.5 rounded-full ${isDone ? 'bg-[#94C973]' : 'bg-slate-200'}`} />
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}