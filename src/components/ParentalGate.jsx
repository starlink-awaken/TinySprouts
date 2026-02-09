import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock } from 'lucide-react';

export function ParentalGate({ isOpen, onCancel, onConfirm }) {
  const [numbers, setNumbers] = useState({ a: 0, b: 0 });
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setNumbers({
        a: Math.floor(Math.random() * 10) + 1,
        b: Math.floor(Math.random() * 10) + 1
      });
      setAnswer('');
      setError(false);
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (parseInt(answer) === numbers.a + numbers.b) {
      onConfirm();
    } else {
      setError(true);
      setAnswer('');
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[300] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-white w-full max-w-sm rounded-[3rem] p-8 shadow-2xl relative"
          >
            <button onClick={onCancel} className="absolute top-6 right-6 p-2 text-slate-300 hover:text-slate-500">
              <X size={24} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="bg-brand-sky/10 p-4 rounded-3xl text-brand-sky mb-4">
                <Lock size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-2">家长验证</h3>
              <p className="text-sm text-slate-400 font-medium mb-8">请证明你是大人：算出结果即可进入</p>

              <div className="bg-slate-50 w-full py-6 rounded-3xl mb-6 border-2 border-slate-100">
                <span className="text-4xl font-black text-slate-700 tracking-widest">
                  {numbers.a} + {numbers.b} = ?
                </span>
              </div>

              <form onSubmit={handleSubmit} className="w-full">
                <motion.input
                  autoFocus
                  animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
                  type="number"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="输入答案"
                  className={`w-full bg-slate-100 p-5 rounded-2xl text-center text-2xl font-black outline-none border-2 transition-colors ${
                    error ? 'border-red-400 bg-red-50 text-red-500' : 'border-transparent focus:border-brand-sky'
                  }`}
                />
                <button
                  type="submit"
                  className="w-full bg-brand-sky text-white py-5 rounded-2xl mt-4 font-black text-lg shadow-xl shadow-brand-sky/20"
                >
                  确认进入
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
