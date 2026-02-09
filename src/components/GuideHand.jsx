import React from 'react';
import { motion } from 'framer-motion';
import { Pointer } from 'lucide-react';

export function GuideHand() {
  return (
    <motion.div
      initial={{ x: 100, y: 500, opacity: 0 }}
      animate={{ 
        x: [100, 100, 100], 
        y: [500, 200, 500],
        opacity: [0, 1, 0]
      }}
      transition={{ 
        repeat: Infinity, 
        duration: 2.5,
        times: [0, 0.5, 1],
        ease: "easeInOut"
      }}
      className="fixed pointer-events-none z-[110] text-[#94C973]"
    >
      <div className="flex flex-col items-center">
        <Pointer size={48} fill="currentColor" stroke="white" strokeWidth={2} />
        <div className="bg-white/80 px-3 py-1 rounded-full text-[10px] font-black shadow-lg mt-2 border border-brand-sprout/20 uppercase tracking-widest text-[#94C973]">
          拖拽物品
        </div>
      </div>
    </motion.div>
  );
}
