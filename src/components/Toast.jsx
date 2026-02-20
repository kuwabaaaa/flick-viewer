import { Check, AlertCircle } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

/**
 * Toast — ふわっと出て数秒後に消えるトースト通知
 *
 * Props:
 *   message : string  — 表示するテキスト
 *   visible : boolean — 表示フラグ
 *   type    : 'success' | 'error'  (デフォルト: 'success')
 */
export default function Toast({ message, visible, type = 'success' }) {
  const isError = type === 'error'

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={message}
          initial={{ opacity: 0, y: 20, scale: 0.88 }}
          animate={{ opacity: 1, y: 0,  scale: 1    }}
          exit={{    opacity: 0, y: 16, scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 420, damping: 30 }}
          className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[60]
            pointer-events-none max-w-[90vw]"
        >
          <div className="
            flex items-center gap-2.5
            glass border border-white/15
            rounded-full px-4 py-2.5
            shadow-2xl shadow-black/60
            whitespace-nowrap
          ">
            {/* アイコン */}
            <div className={`
              w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 border
              ${isError
                ? 'bg-rose-500/20 border-rose-500/40'
                : 'bg-emerald-500/20 border-emerald-500/40'
              }
            `}>
              {isError
                ? <AlertCircle size={11} className="text-rose-400" />
                : <Check       size={11} className="text-emerald-400" />
              }
            </div>

            {/* テキスト */}
            <span className="text-white/90 text-sm font-medium">
              {message}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
