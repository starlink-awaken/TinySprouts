import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set) => ({
      level: 1,
      exp: 0,
      activeTab: 'home',
      completedActivities: [], // 记录已完成的活动 ID

      addExp: (points) => set((state) => {
        let newExp = state.exp + points;
        let newLevel = state.level;
        
        // 升级逻辑
        if (newExp >= 100) {
          newLevel += 1;
          newExp -= 100;
        }
        
        return { 
          exp: newExp, 
          level: newLevel 
        };
      }),

      setActiveTab: (tab) => set({ activeTab: tab }),

      // 重置账户 (用于调试)
      resetProgress: () => set({ level: 1, exp: 0, completedActivities: [] }),
    }),
    {
      name: 'tinysprouts-storage', // localStorage 的 key
    }
  )
);
