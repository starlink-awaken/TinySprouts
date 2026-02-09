import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const CATEGORY_MAP = {
  '数理逻辑': 'Logic',
  '创意艺术': 'Art',
  '社会情感': 'Social',
  '自然认知': 'Nature',
  '其他': 'Other'
};

export function AbilityRadar({ logs }) {
  // 汇总各维度得分
  const scores = logs.reduce((acc, log) => {
    const cat = log.category || '其他';
    acc[cat] = (acc[cat] || 0) + log.exp;
    return acc;
  }, {});

  const data = Object.keys(CATEGORY_MAP).map(key => ({
    subject: key,
    A: scores[key] || 0,
    fullMark: 500
  }));

  const hasData = logs.length > 0;

  return (
    <div className="w-full h-64 bg-white/50 rounded-[2.5rem] p-4 border border-slate-100 shadow-inner overflow-hidden">
      {!hasData ? (
        <div className="h-full flex flex-col items-center justify-center text-slate-300">
          <p className="text-xs font-black uppercase tracking-widest">暂无数据</p>
          <p className="text-[10px] mt-1 italic">让宝贝开始探索吧</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} 
            />
            <Radar
              name="能力"
              dataKey="A"
              stroke="#94C973"
              fill="#94C973"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
