import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, TrendingUp, Award, Clock, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { getWeeklyStats } from '../utils/analysis';
import { AbilityRadar } from '../components/AbilityRadar';

export function WeeklyReport() {
  const navigate = useNavigate();
  const { activityLogs } = useStore();
  
  const stats = useMemo(() => getWeeklyStats(activityLogs), [activityLogs]);

  return (
    <div className="fixed inset-0 bg-[#FDFCF0] z-50 overflow-y-auto font-sans pb-12">
      <header className="sticky top-0 bg-white/80 backdrop-blur-md p-6 flex items-center gap-4 z-20 border-b border-slate-100">
        <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
          <ArrowLeft size={20} className="text-slate-400" />
        </button>
        <div>
          <h2 className="text-xl font-black text-slate-800">本周成长周报</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Weekly Progress Report</p>
        </div>
      </header>

      <main className="p-6 space-y-8">
        {/* 核心概览 */}
        <section className="grid grid-cols-2 gap-4">
          <StatCard 
            icon={<TrendingUp className="text-brand-sprout" />} 
            label="本周获得 EXP" 
            value={stats.thisWeekExp} 
            trend={stats.expGrowth > 0 ? `+${stats.expGrowth}%` : '稳定'}
          />
          <StatCard 
            icon={<Star className="text-yellow-400" />} 
            label="本周星星" 
            value={stats.thisWeekStars} 
          />
        </section>

        {/* 深度分析：能力分布 */}
        <section>
          <SectionTitle title="能力维度分析" />
          <div className="mt-4">
            <AbilityRadar logs={activityLogs.filter(l => new Date(l.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))} />
          </div>
        </section>

        {/* 宝贝最爱 */}
        <section>
          <SectionTitle title="最爱的探索" />
          <div className="mt-4 space-y-3">
            {stats.favoriteActivities.length > 0 ? stats.favoriteActivities.map((act, i) => (
              <div key={i} className="bg-white p-4 rounded-2xl flex items-center justify-between border border-slate-50 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-sky/10 rounded-xl flex items-center justify-center text-brand-sky">
                    <Award size={20} />
                  </div>
                  <span className="font-bold text-slate-700">{act.name}</span>
                </div>
                <span className="text-xs font-black text-slate-300 uppercase">{act.count} 次</span>
              </div>
            )) : (
              <p className="text-center text-sm text-slate-300 italic py-4">本周还没有开始探索哦</p>
            )}
          </div>
        </section>

        {/* 学习时长建议 */}
        <section className="bg-brand-sky/10 p-6 rounded-[2.5rem] border-2 border-white">
          <h4 className="font-black text-brand-sky flex items-center gap-2 mb-2 text-sm">
            <Clock size={18} /> 合伙人建议
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            {stats.thisWeekExp > 100 
              ? "宝贝本周表现非常活跃！建议下周可以多尝试【创意艺术】类活动，平衡左右脑发展。" 
              : "本周探索次数较少，可以每天抽 10 分钟陪宝贝玩玩【数字森林】，建立数感习惯。"}
          </p>
        </section>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, trend }) {
  return (
    <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-50 relative overflow-hidden">
      <div className="mb-3">{icon}</div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{label}</p>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-black text-slate-800">{value}</span>
        {trend && <span className="text-[10px] font-black text-green-500 mb-1">{trend}</span>}
      </div>
    </div>
  );
}

function SectionTitle({ title }) {
  return (
    <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
      <div className="w-2 h-2 bg-brand-sprout rounded-full" />
      {title}
    </h3>
  );
}