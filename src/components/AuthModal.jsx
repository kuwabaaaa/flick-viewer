import { useState } from 'react'
import { X, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { isSupabaseConfigured } from '../lib/supabase'

// Google ロゴ（SVG インライン）
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

export default function AuthModal({ onClose }) {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth()
  const [tab,      setTab]      = useState('login')   // 'login' | 'signup'
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [done,     setDone]     = useState(false)    // signup confirmation

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (tab === 'login') {
        const { error: err } = await signInWithEmail(email, password)
        if (err) throw err
        onClose()
      } else {
        const { error: err } = await signUpWithEmail(email, password)
        if (err) throw err
        setDone(true)
      }
    } catch (err) {
      setError(err.message ?? 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setError('')
    const { error: err } = await signInWithGoogle() ?? {}
    if (err) setError(err.message)
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-sm bg-gray-900/95 border border-white/10 rounded-3xl p-8 text-center">
          <p className="text-white/70 mb-2 font-semibold">Supabase 未設定</p>
          <p className="text-white/35 text-sm">
            <code className="text-amber-400">.env.local</code> に<br/>
            VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY を設定してください
          </p>
          <button onClick={onClose} className="mt-6 text-white/40 text-sm underline">閉じる</button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div
        initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 360, damping: 32 }}
        className="w-full sm:max-w-sm bg-gray-900/97 backdrop-blur-2xl
          border border-white/10 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl"
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-bold text-lg">
            {tab === 'login' ? 'ログイン' : 'アカウント作成'}
          </h2>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
            <X size={15} className="text-white/70" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {done ? (
            <motion.div key="done"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="text-center py-6">
              <p className="text-2xl mb-3">📬</p>
              <p className="text-white font-semibold mb-1">確認メールを送信しました</p>
              <p className="text-white/45 text-sm">メールのリンクをクリックしてアカウントを有効化してください</p>
              <button onClick={onClose}
                className="mt-6 w-full py-3 rounded-2xl bg-white text-black font-bold text-sm">
                閉じる
              </button>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* タブ */}
              <div className="flex glass rounded-2xl p-1 mb-5 gap-1">
                {['login', 'signup'].map((t) => (
                  <button key={t} onClick={() => { setTab(t); setError('') }}
                    className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all
                      ${tab === t ? 'bg-white text-black' : 'text-white/45 hover:text-white/70'}`}>
                    {t === 'login' ? 'ログイン' : '新規登録'}
                  </button>
                ))}
              </div>

              {/* エラー */}
              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 bg-rose-500/15 border border-rose-500/30
                      rounded-xl px-3 py-2.5 mb-4">
                    <AlertCircle size={14} className="text-rose-400 flex-shrink-0" />
                    <p className="text-rose-300 text-xs">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* フォーム */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="relative">
                  <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="メールアドレス" required autoComplete="email"
                    className="w-full glass text-white rounded-xl pl-9 pr-4 py-3 text-sm
                      placeholder-white/25 outline-none focus:border-white/30 focus:bg-white/10 transition-all" />
                </div>
                <div className="relative">
                  <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                  <input type={showPw ? 'text' : 'password'} value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="パスワード（6文字以上）" required minLength={6}
                    autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                    className="w-full glass text-white rounded-xl pl-9 pr-10 py-3 text-sm
                      placeholder-white/25 outline-none focus:border-white/30 focus:bg-white/10 transition-all" />
                  <button type="button" onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>

                <motion.button type="submit" disabled={loading} whileTap={{ scale: 0.97 }}
                  className="w-full py-3.5 rounded-2xl bg-white text-black font-bold text-sm
                    hover:bg-white/90 active:scale-95 transition-all disabled:opacity-60">
                  {loading ? '処理中...' : tab === 'login' ? 'ログイン →' : 'アカウントを作成 →'}
                </motion.button>
              </form>

              {/* セパレーター */}
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-white/25 text-xs">または</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Google */}
              <motion.button onClick={handleGoogle} whileTap={{ scale: 0.97 }}
                className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl
                  glass border border-white/10 text-white/80 text-sm font-medium
                  hover:bg-white/10 transition-all">
                <GoogleIcon />
                Google でログイン
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
