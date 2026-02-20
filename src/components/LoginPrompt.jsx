import { motion } from 'framer-motion'
import { Lock, X } from 'lucide-react'

const ACTION_MESSAGES = {
  like:     { emoji: '❤️', title: 'いいねするには', desc: 'ログインしてお気に入りのサイトをサポートしよう' },
  favorite: { emoji: '🔖', title: 'お気に入り保存には', desc: 'ログインしてサイトをコレクションに追加しよう' },
  submit:   { emoji: '🌐', title: 'サイト投稿には', desc: 'ログインして面白いサイトをみんなにシェアしよう' },
  tip:      { emoji: '₿',  title: '投げ銭を送るには', desc: 'ログインしてクリエイターを直接サポートしよう' },
}

/**
 * Props:
 *   action    : 'like' | 'favorite' | 'submit' | 'tip'
 *   onLogin   : fn — AuthModal を開く
 *   onDismiss : fn — 閉じる
 */
export default function LoginPrompt({ action = 'like', onLogin, onDismiss }) {
  const msg = ACTION_MESSAGES[action] ?? ACTION_MESSAGES.like

  return (
    <div className="fixed inset-0 z-[55] flex items-end justify-center"
      onClick={(e) => e.target === e.currentTarget && onDismiss()}>

      {/* 薄いスクリム */}
      <motion.div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onDismiss}
      />

      {/* ドロワー */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 34 }}
        className="relative z-10 w-full max-w-sm mx-auto
          bg-gray-900/98 backdrop-blur-2xl
          border border-white/10 border-b-0
          rounded-t-3xl px-6 pt-6 pb-8
          shadow-2xl shadow-black/80"
      >
        {/* ドラッグハンドル */}
        <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-5" />

        {/* 閉じるボタン */}
        <button onClick={onDismiss}
          className="absolute right-4 top-4 w-8 h-8 flex items-center justify-center
            rounded-full bg-white/10 hover:bg-white/20 transition-colors">
          <X size={15} className="text-white/60" />
        </button>

        {/* コンテンツ */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl glass border border-white/10
            flex items-center justify-center mx-auto mb-4 text-3xl">
            {msg.emoji}
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Lock size={13} className="text-white/40" />
            <h3 className="text-white font-bold text-base">{msg.title}</h3>
          </div>
          <p className="text-white/40 text-sm leading-relaxed">{msg.desc}</p>
        </div>

        {/* ボタン */}
        <div className="space-y-2.5">
          <motion.button
            onClick={onLogin} whileTap={{ scale: 0.97 }}
            className="w-full py-3.5 rounded-2xl bg-white text-black
              font-bold text-sm hover:bg-white/90 transition-all
              shadow-lg shadow-white/10"
          >
            ログイン / 新規登録
          </motion.button>
          <button onClick={onDismiss}
            className="w-full py-3 text-white/35 text-sm font-medium hover:text-white/60 transition-colors">
            後で
          </button>
        </div>
      </motion.div>
    </div>
  )
}
