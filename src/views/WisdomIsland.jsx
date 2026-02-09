import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Apple, Leaf, Utensils, CheckCircle, ArrowLeft, Star, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStore } from '../store';

const CHALLENGE_DATA = {
  items: [
    { id: 'a1', icon: Apple, category: 'fruit', color: 'text-red-500', name: '苹果' },
    { id: 'a2', icon: Leaf, category: 'veggie', color: 'text-green-500', name: '青菜' },
    { id: 'a3', icon: Apple, category: 'fruit', color: 'text-orange-400', name: '橙子' },
    { id: 'a4', icon: Leaf, category: 'veggie', color: 'text-emerald-600', name: '西兰花' },
  ],
  targets: [
    { type: 'fruit', label: '水果篮', icon: '🧺' },
    { type: 'veggie', label: '蔬菜筐', icon: '📦' }
  ]
};

export function WisdomIsland({ onBack }) {
  const [items, setItems] = useState(CHALLENGE_DATA.items);
  const [lastDrop, setLastDrop] = useState(null); // 用于标记哪个篮子动了
  const { completeActivity } = useStore();

  const handleDragEnd = (event, info, item) => {
    const dropY = info.point.y;
    // 简单的碰撞区域模拟
    const isFruitArea = dropY < 400;
    const isVeggieArea = dropY >= 400;

    let success = false;
    if (item.category === 'fruit' && isFruitArea) {
      success = true;
      setLastDrop('fruit');
    } else if (item.category === 'veggie' && isVeggieArea) {
      success = true;
      setLastDrop('veggie');
    }

    if (success) {
      setItems(prev => prev.filter(i => i.id !== item.id));
      setTimeout(() => setLastDrop(null), 300);
    }
  };

  // 监听游戏结束
  useEffect(() => {
    if (items.length === 0) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#94C973', '#FDFCF0', '#A1C3D1']
      });
      // 这里的 ID 1 对应 activities.js 中的第一个任务
      completeActivity(1, 30);
      
      // 3秒后自动返回首页
      const timer = setTimeout(onBack, 3000);
      return () => clearTimeout(timer);
    }
  }, [items]);

  return (
    <div className="fixed inset-0 bg-[#FDFCF0] z-50 p-6 flex flex-col font-sans">
      <header className="flex items-center justify-between mb-10">
        <motion.button 
          whileTap={{ scale: 0.8 }}
          onClick={onBack} 
          className="p-3 bg-white rounded-2xl shadow-sm"
        >
          <ArrowLeft size={24} className="text-slate-400" />
        </motion.button>
        <div className="bg-white px-6 py-2 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-black text-slate-800">分类挑战</h2>
        </div>
        <div className="w-12 h-12 bg-brand-sprout/20 rounded-full flex items-center justify-center">
          <BrainIcon className="text-brand-sprout" />
        </div>
      </header>

      <div className="flex-1 flex flex-col justify-around">
        {/* Drop Targets */}
        <div className="space-y-6">
          {CHALLENGE_DATA.targets.map(target => (
            <motion.div 
              key={target.type}
              animate={lastDrop === target.type ? { scale: [1, 1.1, 1] } : {}}
              className={`h-40 rounded-[2.5rem] border-4 border-dashed flex flex-col items-center justify-center transition-colors ${
                target.type === 'fruit' 
                  ? 'border-orange-200 bg-orange-50/50' 
                  : 'border-green-200 bg-green-50/50'
              }`}
            >
              <span className="text-6xl mb-2 drop-shadow-sm">{target.icon}</span>
              <span className="text-sm font-black text-slate-400 uppercase tracking-widest">{target.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Draggable Items */}
        <div className="flex justify-center gap-8 h-24 items-center">
          <AnimatePresence>
            {items.map(item => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.id}
                  drag
                  dragSnapToOrigin
                  onDragEnd={(e, i) => handleDragEnd(e, i, item)}
                  whileHover={{ scale: 1.1 }}
                  whileDrag={{ scale: 1.3, rotate: 10, zIndex: 100 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className={`w-20 h-24 bg-white rounded-3xl shadow-xl border-2 border-slate-50 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing p-4`}
                >
                  <Icon className={`${item.color} mb-1`} size={40} />
                  <span className="text-[10px] font-bold text-slate-400">{item.name}</span>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {items.length === 0 && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-center"
            >
              <div className="bg-white p-6 rounded-full shadow-2xl mb-4 inline-block">
                <Star className="text-yellow-400 fill-yellow-400" size={48} />
              </div>
              <h3 className="text-2xl font-black text-[#94C973]">太棒了！</h3>
            </motion.div>
          )}
        </div>
      </div>

      <div className="bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-white mt-4 flex items-center gap-3">
        <Sparkles className="text-amber-400" size={20} />
        <p className="text-sm font-bold text-slate-500">
          {items.length > 0 ? "把好吃的拖进正确的篮子吧！" : "挑战完成，正在保存进度..."}
        </p>
      </div>
    </div>
  );
}

function BrainIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .52 8.105 3 3 0 1 0 5.127-2.927Z" />
      <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.52 8.105 3 3 0 1 1-5.127-2.927Z" />
      <path d="M9 14h6" />
      <path d="M12 11v3" />
      <path d="M12 17v3" />
    </svg>
  );
}