import { motion } from 'framer-motion'

const MESSAGES = [
  'あなたの好みを学習中...',
  'おすすめを更新中...',
  'フィードをパーソナライズ中...',
  'あなたへのおすすめを構築中...',
]

/**
 * スワイプの隙間に挟むアルゴリズム演出オーバーレイ
 * App.jsx から AnimatePresence 内で描画してください
 */
export default function AlgorithmLoader() {
  const msg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="absolute inset-0 z-[45] bg-black flex flex-col items-center justify-center gap-5"
    >
      {/* スピナー */}
      <div className="relative w-12 h-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-white/60"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-1 rounded-full border-2 border-transparent border-t-white/25"
        />
      </div>

      {/* テキスト */}
      <motion.p
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="text-white/50 text-sm font-medium tracking-wide"
      >
        {msg}
      </motion.p>

      {/* プログレスバー */}
      <motion.div
        className="w-32 h-0.5 bg-white/10 rounded-full overflow-hidden"
      >
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 1.0, ease: 'easeInOut', repeat: Infinity }}
          className="w-1/2 h-full bg-white/40 rounded-full"
        />
      </motion.div>
    </motion.div>
  )
}
