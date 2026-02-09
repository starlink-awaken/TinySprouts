import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export function ActivityCard({ activity, onClick }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onClick(activity)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95, rotateX: 0, rotateY: 0 }}
      className={`relative h-48 rounded-[2.5rem] p-6 cursor-pointer overflow-hidden shadow-xl border-4 border-white ${activity.color}`}
    >
      <div style={{ transform: "translateZ(50px)" }} className="relative z-10 h-full flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="bg-white/30 p-3 rounded-2xl backdrop-blur-md">
            <activity.icon size={32} className="text-white" />
          </div>
          <div className="bg-black/10 px-3 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-widest">
            {activity.category}
          </div>
        </div>
        
        <div>
          <h3 className="text-xl font-black text-white leading-tight mb-1">{activity.title}</h3>
          <p className="text-white/80 text-xs font-medium">{activity.desc}</p>
        </div>
      </div>

      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
      <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 bg-black/5 rounded-full blur-xl" />
    </motion.div>
  );
}
