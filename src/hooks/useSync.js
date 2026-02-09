import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { useStore } from '../store';

export function useSync() {
  const [status, setStatus] = useState('idle'); // idle, syncing, success, error
  const [userSession, setUserSession] = useState(null);
  const { activityLogs, level, exp, stars, maxStreak, completedActivities, resetProgress } = useStore();

  // 1. 监听 Auth 状态
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. 执行同步 (Push & Pull)
  const syncNow = async () => {
    if (!userSession || !import.meta.env.VITE_SUPABASE_URL) {
      if (!import.meta.env.VITE_SUPABASE_URL) alert('请先配置 Supabase 环境变量再同步');
      return;
    }
    setStatus('syncing');

    try {
      const { user } = userSession;

      // A. 同步 Profile (简单的 Last-Write-Wins 策略)
      // 先读取远程
      const { data: remoteProfile, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileErr && profileErr.code !== 'PGRST116') throw profileErr;

      // 如果远程有数据且比本地新(逻辑上)，或者本地是初始状态，则拉取
      // 这里简化处理：如果远程 Level 更高，就拉取远程覆盖本地
      if (remoteProfile && remoteProfile.level > level) {
        useStore.setState({
          level: remoteProfile.level,
          exp: remoteProfile.total_exp,
          stars: remoteProfile.total_stars,
          maxStreak: remoteProfile.max_streak
        });
      } else {
        // 否则，推送本地到远程
        await supabase.from('profiles').upsert({
          id: user.id,
          level,
          total_exp: exp,
          total_stars: stars,
          max_streak: maxStreak,
          updated_at: new Date().toISOString()
        });
      }

      // B. 同步日志 (Activity Logs) - 只做增量推送，不做全量拉取覆盖，防止大流量
      // 真实场景通常需要更复杂的 Merkle Tree 或 Cursor，这里简化为：
      // 查找远程没有的 Log ID (假设 id 是 timestamp 生成的)
      
      const { data: existingLogs } = await supabase
        .from('activity_logs')
        .select('id')
        .eq('user_id', user.id);
        
      const existingIds = new Set(existingLogs?.map(l => Number(l.id)) || []);
      
      const newLogs = activityLogs.filter(l => !existingIds.has(l.id)).map(l => ({
        id: l.id,
        user_id: user.id,
        activity_id: l.activityId,
        category: l.category,
        exp_gained: l.exp,
        completed_at: l.timestamp
      }));

      if (newLogs.length > 0) {
        const { error: logErr } = await supabase.from('activity_logs').insert(newLogs);
        if (logErr) throw logErr;
      }

      setStatus('success');
      setTimeout(() => setStatus('idle'), 2000);

    } catch (err) {
      console.error('Sync failed:', err);
      setStatus('error');
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUserSession(null);
    // 可选：登出时是否清空本地数据？为了安全通常不自动清空，除非用户显式重置
  };

  return {
    isLoggedIn: !!userSession,
    userEmail: userSession?.user?.email,
    syncStatus: status,
    syncNow,
    logout
  };
}
