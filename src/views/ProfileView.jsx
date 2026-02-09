import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Settings, LogOut, ShieldCheck, Mail, ChevronRight, BarChart3, Cloud, Trash2, ArrowLeft, RefreshCw, CheckCircle2, FileText } from 'lucide-react';
import { useStore } from '../store';
import { ParentalGate } from '../components/ParentalGate';
import { AbilityRadar } from '../components/AbilityRadar';
import { MagicLinkAuth } from '../components/MagicLinkAuth';
import { useSync } from '../hooks/useSync';

export function ProfileView() {
  const { user, level, stars, maxStreak, resetProgress, activityLogs } = useStore();
  const { isLoggedIn, userEmail, syncStatus, syncNow, logout } = useSync();
  const [isGateOpen, setIsGateOpen] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate();

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

      <AnimatePresence>
        {showAuth && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <MagicLinkAuth onCancel={() => setShowAuth(false)} onSuccess={() => setShowAuth(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!showAdmin ? (
          <motion.div key="user-view" exit={{ opacity: 0, x: -20 }}>
            <header className="flex flex-col items-center mb-8">
              <div className="w-24 h-24 bg-white rounded-[2.5rem] shadow-xl flex items-center justify-center text-5xl mb-4 border-4 border-brand-sprout/20">
                {user.avatar}
              </div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">{user.name}</h2>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
                加入时间: {new Date(user.joinedAt).toLocaleDateString()}
              </p>
            </header>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <StatItem label="等级" value={level} color="bg-brand-sprout" />
              <StatItem label="星星" value={stars} color="bg-yellow-400" />
              <StatItem label="最高连击" value={maxStreak} color="bg-orange-400" />
            </div>

            <button 
              onClick={() => setIsGateOpen(true)}
              className="w-full p-6 bg-white rounded-[2rem] flex items-center justify-between shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors group"
            >
              <div className="flex items-center gap-4 text-slate-700">
                <div className="p-2 bg-brand-sky/10 rounded-xl text-brand-sky group-hover:scale-110 transition-transform">
                  <ShieldCheck size={20} />
                </div>
                <div className="text-left">
                  <p className="font-bold">家长控制台</p>
                  <p className="text-[10px] text-slate-400">查看报告与云同步</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-300" />
            </button>
          </motion.div>
        ) : (
          <motion.div key="admin-view" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-4 mb-8">
              <button onClick={() => setShowAdmin(false)} className="p-2 bg-white rounded-xl shadow-sm">
                <ArrowLeft size={20} className="text-slate-400" />
              </button>
              <h2 className="text-xl font-black text-slate-800">成长报告中心</h2>
            </div>

            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2 mb-4">成长雷达图</h3>
            <AbilityRadar logs={activityLogs} />
            
            <div className="mt-8 space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">分析与管理</h3>
              <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 p-2">
                
                <AdminAction 
                  icon={<FileText />} 
                  label="详细周报" 
                  desc="查看本周成长足迹与建议" 
                  color="text-brand-pink" 
                  onClick={() => navigate('/admin/report')}
                />

                <div className="h-px bg-slate-100 my-2 mx-4" />

                {isLoggedIn ? (
                  <div className="p-4 bg-brand-sky/5 rounded-2xl mb-2">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-xs font-bold text-slate-500">{userEmail}</span>
                      </div>
                      <button onClick={logout} className="text-[10px] font-bold text-red-400">退出</button>
                    </div>
                    <button 
                      onClick={syncNow}
                      disabled={syncStatus === 'syncing'}
                      className="w-full bg-brand-sky text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-sky/20"
                    >
                      {syncStatus === 'syncing' && <RefreshCw size={16} className="animate-spin" />}
                      {syncStatus === 'success' && <CheckCircle2 size={16} />}
                      {syncStatus === 'idle' ? '立即同步数据' : syncStatus === 'syncing' ? '同步中...' : '同步完成'}
                    </button>
                  </div>
                ) : (
                  <AdminAction 
                    icon={<Cloud />} 
                    label="云端同步" 
                    desc="连接邮箱，保存成长进度" 
                    color="text-brand-sky" 
                    onClick={() => setShowAuth(true)}
                  />
                )}

                <div className="h-px bg-slate-100 my-2 mx-4" />
                
                <button 
                  onClick={() => {
                    if(confirm('确定要清除所有数据重新开始吗？')) {
                      resetProgress();
                      setShowAdmin(false);
                    }
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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

function AdminAction({ icon, label, desc, color, onClick }) {
  return (
    <button onClick={onClick} className="w-full p-4 flex items-center gap-4 hover:bg-slate-50 rounded-2xl transition-colors text-left group">
      <div className={`p-2 rounded-xl bg-slate-50 ${color} group-hover:scale-110 transition-transform`}>
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <div className="flex-1">
        <p className="font-bold text-sm text-slate-700">{label}</p>
        <p className="text-[10px] text-slate-400 font-medium">{desc}</p>
      </div>
      <ChevronRight size={16} className="text-slate-200" />
    </button>
  );
}