import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set) => ({
      user: {
        name: '小萌友',
        avatar: '🌱',
        joinedAt: new Date().toISOString(),
      },
      level: 1,
      exp: 0,
      stars: 0,
      streak: 0,
      maxStreak: 0,
      completedActivities: [],
      activityLogs: [], // 存储每次游戏的详细记录

      addExp: (amount) => set((state) => {
        const newExp = state.exp + amount;
        const nextLevelExp = state.level * 100;
        if (newExp >= nextLevelExp) {
          return { exp: newExp - nextLevelExp, level: state.level + 1 };
        }
        return { exp: newExp };
      }),

      updateStreak: (isCorrect) => set((state) => {
        if (isCorrect) {
          const newStreak = state.streak + 1;
          return { streak: newStreak, maxStreak: Math.max(state.maxStreak, newStreak) };
        }
        return { streak: 0 };
      }),

      completeActivity: (id, expPoints, category = '其他') => set((state) => {
        const isAlreadyDone = state.completedActivities.includes(id);
        const logEntry = {
          id: Date.now(),
          activityId: id,
          category,
          exp: expPoints,
          timestamp: new Date().toISOString()
        };

        const newState = {
          stars: state.stars + 1,
          completedActivities: isAlreadyDone 
            ? state.completedActivities 
            : [...state.completedActivities, id],
          activityLogs: [...state.activityLogs, logEntry]
        };
        
        const nextLevelExp = state.level * 100;
        const totalExp = state.exp + expPoints;
        
        if (totalExp >= nextLevelExp) {
          newState.level = state.level + 1;
          newState.exp = totalExp - nextLevelExp;
        } else {
          newState.exp = totalExp;
        }

        return newState;
      }),

      resetProgress: () => set({
        level: 1,
        exp: 0,
        stars: 0,
        streak: 0,
        maxStreak: 0,
        completedActivities: [],
        activityLogs: []
      })
    }),
    {
      name: 'tinysprouts-storage',
    }
  )
);