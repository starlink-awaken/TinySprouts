import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 增加容错逻辑：如果没配置 URL，则不初始化客户端，防止白屏
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      auth: {
        getSession: async () => ({ data: { session: null } }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithOtp: async () => ({ error: { message: '请先配置 Supabase 环境变量' } }),
        signOut: async () => {}
      },
      from: () => ({
        select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }) }) }),
        upsert: async () => ({ error: null }),
        insert: async () => ({ error: null })
      })
    };

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ TinySprouts: Supabase keys missing. Running in Local-Only mode.");
}