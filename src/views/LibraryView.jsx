import React from 'react';
import { motion } from 'framer-motion';
import { activities } from '../data/activities';
import { useStore } from '../store';
import { ActivityCard } from '../components/ActivityCard';

export function LibraryView({ onStartActivity }) {
  const { completedActivities } = useStore();

  return (
    <div className="pb-24 px-1">
      <div className="flex items-center justify-between mb-8 px-1">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">活动实验室</h2>
        <span className="text-xs font-black text-slate-400 bg-slate-100 px-4 py-1.5 rounded-full uppercase tracking-widest">
          {completedActivities.length} / {activities.length} 完成
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {activities.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <ActivityCard activity={item} onClick={onStartActivity} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
