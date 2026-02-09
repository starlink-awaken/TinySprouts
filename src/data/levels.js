import { Apple, Leaf, Circle, Square, Triangle, Palette, Sun, Moon } from 'lucide-react';

export const levels = [
  {
    id: 1,
    title: "分类小达人",
    instruction: "把水果和蔬菜放进篮子吧",
    items: [
      { id: 'l1-1', category: 'target1', name: '苹果', icon: Apple, color: 'text-red-500' },
      { id: 'l1-2', category: 'target2', name: '青菜', icon: Leaf, color: 'text-green-500' },
      { id: 'l1-3', category: 'target1', name: '橙子', icon: Apple, color: 'text-orange-400' },
      { id: 'l1-4', category: 'target2', name: '西兰花', icon: Leaf, color: 'text-emerald-600' },
    ],
    targets: [
      { type: 'target1', label: '水果篮', icon: '🧺' },
      { type: 'target2', label: '蔬菜筐', icon: '📦' }
    ]
  },
  {
    id: 2,
    title: "色彩对对碰",
    instruction: "把相同颜色的东西放在一起",
    items: [
      { id: 'l2-1', category: 'red', name: '红色的', icon: Sun, color: 'text-red-500' },
      { id: 'l2-2', category: 'blue', name: '蓝色的', icon: Moon, color: 'text-blue-500' },
      { id: 'l2-3', category: 'red', name: '红球', icon: Circle, color: 'text-red-400' },
      { id: 'l2-4', category: 'blue', name: '蓝球', icon: Circle, color: 'text-blue-400' },
    ],
    targets: [
      { type: 'red', label: '红色区', icon: '🔴' },
      { type: 'blue', label: '蓝色区', icon: '🔵' }
    ]
  },
  {
    id: 3,
    title: "形状乐园",
    instruction: "帮形状宝宝找到家",
    items: [
      { id: 'l3-1', category: 'circle', name: '圆圈', icon: Circle, color: 'text-slate-700' },
      { id: 'l3-2', category: 'square', name: '方块', icon: Square, color: 'text-slate-700' },
      { id: 'l3-3', category: 'triangle', name: '三角', icon: Triangle, color: 'text-slate-700' },
    ],
    targets: [
      { type: 'circle', label: '圆点家', icon: '⭕' },
      { type: 'square', label: '方块家', icon: '⬜' },
      { type: 'triangle', label: '三角家', icon: '🔼' }
    ]
  }
];
