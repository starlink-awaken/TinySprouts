import React from 'react';
import { motion } from 'framer-motion';
import { activities } from '../data/activities';
import { PlayCircle } from 'lucide-react';

export function LibraryView({ onStartActivity }) {
  return (
    <div className="pb-24">
      <h2 className="text-xl font-black text-slate-800 mb-6 px-1">探索活动库</h2>
      <div className="space-y-4">
        {activities.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onStartActivity(item)}
              className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 cursor-pointer"
            >
              <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center text-white shadow-md`}>
                <Icon size={24} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full uppercase">
                    {item.type}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    {item.age}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-800 leading-tight">
                  {item.title}
                </h3>
              </div>
              <button className="text-slate-300 hover:text-[#94C973] transition-colors">
                <PlayCircle size={28} />
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
