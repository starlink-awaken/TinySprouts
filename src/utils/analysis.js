// TinySprouts 数据分析引擎 V2.1

/**
 * 获取每周成长统计
 */
export const getWeeklyStats = (logs) => {
  if (!logs || logs.length === 0) return [];

  // 获取最近 7 天的日期
  const days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  // 按天聚合 EXP
  return days.map(day => {
    const dayTotal = logs
      .filter(log => log.timestamp.startsWith(day))
      .reduce((sum, log) => sum + log.exp, 0);
    
    return {
      name: day.split('-').slice(1).join('/'), // 格式化为 MM/DD
      exp: dayTotal
    };
  });
};

/**
 * 获取详细的能力维度分布
 */
export const getAbilityDetails = (logs) => {
  const categories = ['数理逻辑', '创意艺术', '社会情感', '自然认知', '其他'];
  
  const stats = categories.map(cat => {
    const catLogs = logs.filter(l => l.category === cat);
    const count = catLogs.length;
    const totalExp = catLogs.reduce((sum, l) => sum + l.exp, 0);
    
    return {
      label: cat,
      count,
      exp: totalExp,
      percentage: count > 0 ? Math.min(Math.round((totalExp / 500) * 100), 100) : 0
    };
  });

  return stats.sort((a, b) => b.exp - a.exp);
};
