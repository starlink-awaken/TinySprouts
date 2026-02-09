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

      // 增加经验值并检查升级
      addExp: (amount) => set((state) => {
        const newExp = state.exp + amount;
        const nextLevelExp = state.level * 100;
        
        if (newExp >= nextLevelExp) {
          return { 
            exp: newExp - nextLevelExp, 
            level: state.level + 1 
          };
        }
        return { exp: newExp };
      }),

      // 记录连胜
      updateStreak: (isCorrect) => set((state) => {
        if (isCorrect) {
          const newStreak = state.streak + 1;
          return { 
            streak: newStreak,
            maxStreak: Math.max(state.maxStreak, newStreak)
          };
        }
        return { streak: 0 };
      }),

      // 完成活动逻辑
      completeActivity: (id, expPoints) => set((state) => {
        const isAlreadyDone = state.completedActivities.includes(id);
        const newState = {
          stars: state.stars + 1,
          completedActivities: isAlreadyDone 
            ? state.completedActivities 
            : [...state.completedActivities, id]
        };
        
        // 调用内部 addExp 逻辑
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

      updateUser: (newData) => set((state) => ({
        user: { ...state.user, ...newData }
      })),

      resetProgress: () => set({
        level: 1,
        exp: 0,
        stars: 0,
        streak: 0,
        maxStreak: 0,
        completedActivities: []
      })
    }),
    {
      name: 'tinysprouts-storage',
    }
  )
);
