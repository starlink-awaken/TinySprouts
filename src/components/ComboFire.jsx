import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame } from 'lucide-react';

export function ComboFire({ streak }) {
  if (streak < 3) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0, opacity: 0, y: 20 }}
        className="fixed bottom-32 right-6 z-[100] flex flex-col items-center"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [-5, 5, -5]
          }}
          transition={{ repeat: Infinity, duration: 0.5 }}
          className="relative"
        >
          <Flame size={64} className="text-orange-500 fill-orange-500 filter drop-shadow-[0_0_15px_rgba(249,115,22,0.8)]" />
          <motion.div
            animate={{ opacity: [0, 1, 0], y: [-20, -40] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="absolute top-0 left-1/2 -translate-x-1/2 text-orange-400 font-bold"
          >
            🔥
          </motion.div>
        </motion.div>
        
        <div className="bg-orange-500 text-white px-4 py-1 rounded-full text-xl font-black shadow-lg -mt-2 border-2 border-white">
          {streak} 连击!
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
