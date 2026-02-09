import { BookOpen, Palette, Gamepad2, Sun, Moon } from 'lucide-react';

export const activities = [
  {
    id: 1,
    title: "影子捉迷藏",
    type: "game",
    age: "18m+",
    duration: "10min",
    icon: Sun,
    color: "bg-amber-400",
    desc: "只需要一个手电筒，在墙上变出小兔子、老鹰，锻炼宝宝的视觉追踪能力。",
    exp: 20
  },
  {
    id: 2,
    title: "晚安，月亮",
    type: "story",
    age: "6m+",
    duration: "5min",
    icon: Moon,
    color: "bg-indigo-400",
    desc: "经典的睡前绘本共读，通过寻找画面中的物品，建立睡前仪式感。",
    exp: 15
  },
  {
    id: 3,
    title: "手指画：春天的树",
    type: "art",
    age: "2y+",
    duration: "15min",
    icon: Palette,
    color: "bg-pink-400",
    desc: "准备无毒颜料，让宝宝用手指点出树叶，感受色彩混合的奥妙。",
    exp: 25
  },
  {
    id: 4,
    title: "分类大挑战",
    type: "game",
    age: "3y+",
    duration: "10min",
    icon: Gamepad2,
    color: "bg-emerald-400",
    desc: "把玩具按颜色或大小分类，培养逻辑思维和秩序感。",
    exp: 20
  },
  {
    id: 5,
    title: "猜猜我是谁",
    type: "game",
    age: "4y+",
    duration: "10min",
    icon: Gamepad2,
    color: "bg-sky-400",
    desc: "家长模仿动物叫声或动作，让孩子猜动物名字。",
    exp: 15
  }
];
