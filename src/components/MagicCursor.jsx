import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function MagicCursor() {
  const [clicks, setClicks] = useState([]);

  useEffect(() => {
    const handleClick = (e) => {
      const id = Date.now();
      setClicks(prev => [...prev, { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => {
        setClicks(prev => prev.filter(c => c.id !== id));
      }, 800);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      <AnimatePresence>
        {clicks.map(click => (
          <React.Fragment key={click.id}>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ x: click.x, y: click.y, scale: 0, opacity: 1 }}
                animate={{ 
                  x: click.x + (Math.random() - 0.5) * 100, 
                  y: click.y + (Math.random() - 0.5) * 100, 
                  opacity: 0,
                  scale: Math.random() * 1.5 
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute w-3 h-3 rounded-full"
                style={{ 
                  backgroundColor: ['#94C973', '#A1C3D1', '#FCD34D', '#F472B6'][Math.floor(Math.random() * 4)] 
                }}
              />
            ))}
          </React.Fragment>
        ))}
      </AnimatePresence>
    </div>
  );
}
