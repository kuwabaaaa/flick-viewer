import { useState } from 'react'
import { X, Flag } from 'lucide-react'
import { motion } from 'framer-motion'
import { useLang } from '../context/LangContext'

const REASON_KEYS = ['reasonBroken', 'reasonInappropriate', 'reasonSpam', 'reasonCopyright', 'reasonOther']
const REASON_IDS  = ['broken', 'inappropriate', 'spam', 'copyright', 'other']

export default function ReportModal({ onSubmit, onClose }) {
  const { t } = useLang()
  const [selected, setSelected] = useState(null)

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 360, damping: 32 }}
        className="w-full sm:max-w-sm bg-gray-900/97 backdrop-blur-2xl
          border border-white/10 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl"
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Flag size={15} className="text-rose-400" />
            <h2 className="text-white font-bold">{t('reportTitle')}</h2>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
            <X size={14} className="text-white/70" />
          </button>
        </div>

        {/* 理由リスト */}
        <div className="space-y-2 mb-5">
          {REASON_IDS.map((id, i) => (
            <button
              key={id}
              onClick={() => setSelected(id)}
              className={`w-full text-left px-4 py-3.5 rounded-2xl text-sm font-medium transition-all
                ${selected === id
                  ? 'bg-rose-500/20 border border-rose-500/40 text-rose-300'
                  : 'glass text-white/60 hover:text-white/80 border border-white/8'}`}
            >
              {t(REASON_KEYS[i])}
            </button>
          ))}
        </div>

        {/* 送信ボタン */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          disabled={!selected}
          onClick={() => selected && onSubmit(selected)}
          className="w-full py-3.5 rounded-2xl bg-rose-500 text-white font-bold text-sm
            hover:bg-rose-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {t('reportSubmit')}
        </motion.button>
      </motion.div>
    </div>
  )
}
