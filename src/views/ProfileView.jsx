import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, LogOut, ShieldCheck, Mail, ChevronRight, BarChart3, Cloud, Trash2 } from 'lucide-react';
import { useStore } from '../store';
import { ParentalGate } from '../components/ParentalGate';

export function ProfileView() {
  const { user, level, stars, maxStreak, resetProgress } = useStore();
  const [isGateOpen, setIsGateOpen] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  const handleGateConfirm = () => {
    setIsGateOpen(false);
    setShowAdmin(true);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-24">
      <ParentalGate 
        isOpen={isGateOpen} 
        onCancel={() => setIsGateOpen(false)} 
        onConfirm={handleGateConfirm} 
      />

      <header className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 bg-white rounded-[2.5rem] shadow-xl flex items-center justify-center text-5xl mb-4 border-4 border-brand-sprout/20">
          {user.avatar}
        </div>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">{user.name}</h2>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
          加入时间: {new Date(user.joinedAt).toLocaleDateString()}
        </p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatItem label="等级" value={level} color="bg-brand-sprout" />
        <StatItem label="星星" value={stars} color="bg-yellow-400" />
        <StatItem label="最高连击" value={maxStreak} color="bg-orange-400" />
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">家长领地</h3>
        
        <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100">
          {!showAdmin ? (
            <button 
              onClick={() => setIsGateOpen(true)}
              className="w-full p-6 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-4 text-slate-700">
                <div className="p-2 bg-brand-sky/10 rounded-xl text-brand-sky">
                  <ShieldCheck size={20} />
                </div>
                <span className="font-bold">进入家长控制台</span>
              </div>
              <ChevronRight size={18} className="text-slate-300" />
            </button>
          ) : (
            <div className="p-4 space-y-2">
              <AdminAction icon={<Cloud />} label="云端同步" desc="连接邮箱，保存成长进度" color="text-brand-sky" />
              <AdminAction icon={<BarChart3 />} label="能力发展报告" desc="查看孩子逻辑与艺术分布" color="text-brand-sprout" />
              <div className="h-px bg-slate-100 my-2" />
              <button 
                onClick={() => {
                  if(confirm('确定要清除所有数据重新开始吗？')) resetProgress();
                }}
                className="w-full p-4 flex items-center gap-4 text-red-400 hover:bg-red-50 rounded-2xl transition-colors"
              >
                <Trash2 size={20} />
                <div className="text-left">
                  <p className="font-bold text-sm">重置所有进度</p>
                  <p className="text-[10px] opacity-60 italic">谨慎操作：不可撤销</p>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function StatItem({ label, value, color }) {
  return (
    <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-50 flex flex-col items-center">
      <span className="text-2xl font-black text-slate-800">{value}</span>
      <span className={`text-[10px] font-black text-white px-2 py-0.5 rounded-full mt-1 uppercase tracking-tighter ${color}`}>
        {label}
      </span>
    </div>
  );
}

function AdminAction({ icon, label, desc, color }) {
  return (
    <button className="w-full p-4 flex items-center gap-4 hover:bg-slate-50 rounded-2xl transition-colors text-left group">
      <div className={`p-2 rounded-xl bg-slate-50 ${color} group-hover:scale-110 transition-transform`}>
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <div>
        <p className="font-bold text-sm text-slate-700">{label}</p>
        <p className="text-[10px] text-slate-400 font-medium">{desc}</p>
      </div>
    </button>
  );
}
