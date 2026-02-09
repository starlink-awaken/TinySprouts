import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Trophy } from 'lucide-react';
import { useStore } from '../store';
import { activities } from '../data/activities';
import { ActivityCard } from '../components/ActivityCard';

export function HomeView({ onStartActivity }) {
  const { user, level, exp } = useStore();
  const nextLevelExp = level * 100;
  
  const dailyActivities = activities.slice(0, 3);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Profile Summary */}
      <section className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-brand-sprout/10 mb-8 border border-brand-sprout/10 relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 bg-brand-sprout/20 rounded-2xl flex items-center justify-center text-3xl">
            {user.avatar}
          </div>
          <div className="flex-1">
            <h2 className="font-black text-slate-800 text-xl tracking-tight">早上好, {user.name}!</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-brand-sprout text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">
                LV.{level} 萌芽期
              </span>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(exp / nextLevelExp) * 100}%` }}
                  className="h-full bg-brand-sprout"
                />
              </div>
            </div>
          </div>
        </div>
        <Sparkles className="absolute -right-4 -bottom-4 text-brand-sprout/10" size={100} />
      </section>

      {/* Stats Quick View */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-brand-sky/10 p-4 rounded-3xl flex items-center gap-3">
          <div className="bg-brand-sky p-2 rounded-xl text-white">
            <Trophy size={18} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">今日勋章</p>
            <p className="text-lg font-black text-slate-700">3 枚</p>
          </div>
        </div>
        <div className="bg-brand-pink/10 p-4 rounded-3xl flex items-center gap-3">
          <div className="bg-brand-pink p-2 rounded-xl text-white">
            <Sparkles size={18} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">能量值</p>
            <p className="text-lg font-black text-slate-700">85%</p>
          </div>
        </div>
      </div>

      <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
        <div className="w-2 h-2 bg-brand-sprout rounded-full" />
        今日探索
      </h3>
      
      <div className="space-y-4">
        {dailyActivities.map(activity => (
          <ActivityCard key={activity.id} activity={activity} onClick={onStartActivity} />
        ))}
      </div>
    </motion.div>
  );
}
