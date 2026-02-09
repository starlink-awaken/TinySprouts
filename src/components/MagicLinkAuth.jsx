import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Check, Loader2, X } from 'lucide-react';
import { supabase } from '../utils/supabase';

export function MagicLinkAuth({ onSuccess, onCancel }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) throw error;
      setSent(true);
    } catch (err) {
      setError(err.message || '登录失败，请检查邮箱');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="p-8 text-center bg-white rounded-[2rem]">
        <div className="bg-[#ecfdf5] p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-[#10b981]">
          <Mail size={32} />
        </div>
        <h3 className="text-xl font-black text-slate-800 mb-2">邮件已发送!</h3>
        <p className="text-sm text-slate-500 mb-6">
          请检查你的邮箱 <strong>{email}</strong><br/>
          点击邮件中的链接即可完成登录。
        </p>
        <button onClick={onCancel} className="text-slate-400 text-xs font-bold underline">
          返回
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-[2rem] w-full relative">
      <button onClick={onCancel} className="absolute top-4 right-4 text-slate-300">
        <X size={20} />
      </button>
      
      <div className="text-center mb-6">
        <h3 className="text-xl font-black text-slate-800">云端同步</h3>
        <p className="text-xs text-slate-400 mt-1">登录后可跨设备保存成长记录</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="家长邮箱地址"
              className="w-full bg-slate-50 pl-12 pr-4 py-4 rounded-2xl outline-none border-2 border-transparent focus:border-brand-sky font-bold text-slate-700 transition-colors"
            />
          </div>
          {error && <p className="text-red-400 text-xs font-bold mt-2 ml-2">{error}</p>}
        </div>

        <button
          disabled={loading}
          type="submit"
          className="w-full bg-brand-sky text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-brand-sky/20 flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {loading ? <Loader2 className="animate-spin" /> : <>发送登录链接 <ArrowRight size={20} /></>}
        </button>
      </form>
    </div>
  );
}
