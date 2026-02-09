import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set) => ({
      level: 1,
      exp: 0,
      stars: 0,
      activeTab: 'home',
      completedActivityIds: [], 

      addExp: (points) => set((state) => {
        let newExp = state.exp + points;
        let newLevel = state.level;
        if (newExp >= 100) {
          newLevel += 1;
          newExp -= 100;
        }
        return { exp: newExp, level: newLevel };
      }),

      completeActivity: (id, expPoints) => set((state) => {
        if (state.completedActivityIds.includes(id)) return state;
        
        // 首次完成奖励星星
        const newStars = state.stars + 1;
        const newCompleted = [...state.completedActivityIds, id];
        
        // 调用 addExp 的逻辑
        let newExp = state.exp + expPoints;
        let newLevel = state.level;
        if (newExp >= 100) {
          newLevel += 1;
          newExp -= 100;
        }

        return { 
          completedActivityIds: newCompleted, 
          stars: newStars,
          exp: newExp,
          level: newLevel
        };
      }),

      setActiveTab: (tab) => set({ activeTab: tab }),
      resetProgress: () => set({ level: 1, exp: 0, stars: 0, completedActivityIds: [] }),
    }),
    {
      name: 'tinysprouts-storage',
    }
  )
);