import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // ── プロフィール取得（なければ自動作成） ──────────────────────
  const fetchProfile = useCallback(async (userId) => {
    if (!supabase) return
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (data) {
      setProfile(data)
    } else {
      const { data: created } = await supabase
        .from('profiles')
        .insert({ id: userId })
        .select()
        .single()
      setProfile(created ?? null)
    }
  }, [])

  useEffect(() => {
    if (!isSupabaseConfigured) { setLoading(false); return }

    // 初期セッション取得
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      setLoading(false)
    })

    // 認証状態の変化を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) fetchProfile(session.user.id)
        else setProfile(null)
      }
    )
    return () => subscription.unsubscribe()
  }, [fetchProfile])

  // ── プロフィール更新 ──────────────────────────────────────────
  const updateProfile = useCallback(async (updates) => {
    if (!user || !supabase) return null
    const { data } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()
    if (data) setProfile(data)
    return data
  }, [user])

  // ── 認証アクション ────────────────────────────────────────────
  const signInWithEmail = (email, password) =>
    supabase?.auth.signInWithPassword({ email, password })

  const signUpWithEmail = (email, password) =>
    supabase?.auth.signUp({ email, password })

  const signInWithGoogle = () =>
    supabase?.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })

  const signOut = () => supabase?.auth.signOut()

  return (
    <AuthContext.Provider value={{
      user, profile, loading,
      signInWithEmail, signUpWithEmail, signInWithGoogle,
      signOut, updateProfile,
      refreshProfile: () => user && fetchProfile(user.id),
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
