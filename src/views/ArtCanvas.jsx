import React, { useRef, useState, useEffect } from 'react';
import { ArrowLeft, Eraser, Download, Palette, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store';
import { playSfx } from '../utils/sfx';

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#000000'];

export function ArtCanvas({ onBack }) {
  const canvasRef = useRef(null);
  const [color, setColor] = useState('#ef4444');
  const [isDrawing, setIsDrawing] = useState(false);
  const { completeActivity } = useStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 8;
  }, []);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = getPos(nativeEvent);
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    ctx.strokeStyle = color;
    setIsDrawing(true);
    playSfx('pop');
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = getPos(nativeEvent);
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      completeActivity(3, 5); // 每次画画都给一点点经验
    }
  };

  const getPos = (e) => {
    if (e.touches && e.touches[0]) {
      return { 
        offsetX: e.touches[0].clientX, 
        offsetY: e.touches[0].clientY 
      };
    }
    return { offsetX: e.offsetX, offsetY: e.offsetY };
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    playSfx('delete');
  };

  return (
    <div className="fixed inset-0 bg-white z-50 touch-none">
      <canvas
        ref={canvasRef}
        className="block w-full h-full cursor-crosshair"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />

      <header className="absolute top-6 left-6 right-6 flex justify-between pointer-events-none">
        <button onClick={onBack} className="p-3 bg-white rounded-2xl shadow-md pointer-events-auto">
          <ArrowLeft size={24} className="text-slate-500" />
        </button>
        <div className="flex gap-2 pointer-events-auto">
          <button onClick={clearCanvas} className="p-3 bg-white rounded-2xl shadow-md text-red-400">
            <Trash2 size={24} />
          </button>
        </div>
      </header>

      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 pointer-events-auto">
        <div className="bg-white p-2 rounded-[2rem] shadow-xl flex gap-2 border border-slate-100">
          {COLORS.map(c => (
            <motion.button
              key={c}
              whileTap={{ scale: 0.8 }}
              onClick={() => setColor(c)}
              className={`w-10 h-10 rounded-full border-4 ${color === c ? 'border-slate-200 scale-110' : 'border-transparent'}`}
              style={{ backgroundColor: c }}
            />
          ))}
          <div className="w-px bg-slate-200 mx-1" />
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={() => setColor('#FFFFFF')}
            className={`w-10 h-10 rounded-full border-4 flex items-center justify-center ${color === '#FFFFFF' ? 'border-slate-200 bg-slate-100' : 'border-transparent bg-white'}`}
          >
            <Eraser size={20} className="text-slate-500" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
