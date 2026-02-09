import { BookOpen, Palette, Gamepad2, Sun, Moon, Zap, Target, Users, Ghost } from 'lucide-react';

export const activities = [
  {
    id: 1,
    title: "影子捉迷藏",
    type: "game",
    age: "3-4岁",
    category: "科学探索",
    icon: Ghost,
    color: "bg-amber-400",
    desc: "在暗处观察影子，理解光与影的关系。找找大象的影子在哪？",
    exp: 20,
    difficulty: 1
  },
  {
    id: 2,
    title: "数字森林：数一数",
    type: "game",
    age: "3-4岁",
    category: "数理逻辑",
    icon: Target,
    color: "bg-indigo-400",
    desc: "森林里有几只小兔子？点击屏幕，训练点数能力和手眼协调。",
    exp: 15,
    difficulty: 1
  },
  {
    id: 3,
    title: "色彩小画家",
    type: "art",
    age: "3-6岁",
    category: "创意艺术",
    icon: Palette,
    color: "bg-pink-400",
    desc: "红色加蓝色会变出什么？通过虚拟调色盘，探索色彩叠加的奇妙。",
    exp: 25,
    difficulty: 2
  },
  {
    id: 4,
    title: "词语对对碰",
    type: "story",
    age: "4-5岁",
    category: "语言表达",
    icon: BookOpen,
    color: "bg-emerald-400",
    desc: "将图片与对应的文字连线。认识生活中的常用字词。",
    exp: 20,
    difficulty: 2
  },
  {
    id: 5,
    title: "情绪实验室",
    type: "social",
    age: "4-6岁",
    category: "社会情感",
    icon: Users,
    color: "bg-sky-400",
    desc: "小明难过了，该怎么安慰他？通过情景选择，建立同理心。",
    exp: 30,
    difficulty: 3
  }
];