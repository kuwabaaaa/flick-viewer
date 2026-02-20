import { X, ArrowUpDown, Pointer, Heart, Share2, Bitcoin, PlusCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useLang } from '../context/LangContext'

function getFeatures(t) {
  return [
    {
      icon: ArrowUpDown,
      iconClass: 'text-white',
      iconBg: 'bg-white/15',
      cardBorder: 'border-white/10',
      title: t('helpSwipeTitle'),
      desc: t('helpSwipeDesc'),
    },
    {
      icon: Pointer,
      iconClass: 'text-emerald-400',
      iconBg: 'bg-emerald-500/15',
      cardBorder: 'border-emerald-500/15',
      title: t('helpDblTapTitle'),
      desc: t('helpDblTapDesc'),
    },
    {
      icon: Heart,
      iconClass: 'text-rose-400',
      iconBg: 'bg-rose-500/15',
      cardBorder: 'border-rose-500/15',
      title: t('helpLikeTitle'),
      desc: t('helpLikeDesc'),
    },
    {
      icon: Share2,
      iconClass: 'text-sky-400',
      iconBg: 'bg-sky-500/15',
      cardBorder: 'border-sky-500/15',
      title: t('helpShareTitle'),
      desc: t('helpShareDesc'),
    },
    {
      icon: Bitcoin,
      iconClass: 'text-amber-400',
      iconBg: 'bg-amber-500/15',
      cardBorder: 'border-amber-500/15',
      title: t('helpTipTitle'),
      desc: t('helpTipDesc'),
    },
    {
      icon: PlusCircle,
      iconClass: 'text-violet-400',
      iconBg: 'bg-violet-500/15',
      cardBorder: 'border-violet-500/15',
      title: t('helpPostTitle'),
      desc: t('helpPostDesc'),
    },
  ]
}

export default function HelpModal({ onClose }) {
  const { t } = useLang()
  const features = getFeatures(t)

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md
        flex items-end sm:items-center justify-center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0,  opacity: 1 }}
        exit={{    y: 60, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 360, damping: 32 }}
        className="w-full sm:max-w-md max-h-[92vh] flex flex-col
          bg-gray-900/97 backdrop-blur-2xl
          border border-white/10
          rounded-t-3xl sm:rounded-3xl
          shadow-2xl shadow-black/70
          overflow-hidden"
      >
        {/* ── ヘッダー ── */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 flex-shrink-0">
          <div>
            <h2 className="text-white font-bold text-xl tracking-tight">{t('helpTitle')}</h2>
            <p className="text-white/40 text-sm mt-0.5">{t('helpSubtitle')}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full
              bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X size={15} className="text-white/70" />
          </button>
        </div>

        {/* ── フィーチャーグリッド ── */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-2">
          <div className="grid grid-cols-2 gap-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y:  0 }}
                transition={{
                  delay: 0.05 + i * 0.07,
                  type: 'spring', stiffness: 400, damping: 30,
                }}
                className={`glass rounded-2xl p-4 border ${f.cardBorder}`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${f.iconBg}`}>
                  <f.icon size={18} className={f.iconClass} strokeWidth={1.8} />
                </div>
                <p className="text-white font-semibold text-sm mb-1.5 leading-tight">{f.title}</p>
                <p className="text-white/45 text-xs leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── フッター ── */}
        <div className="px-6 py-5 flex-shrink-0">
          <motion.button
            onClick={onClose}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="w-full py-3.5 rounded-2xl bg-white text-black
              font-bold text-sm tracking-wide
              hover:bg-white/90 active:scale-95 transition-all
              shadow-lg shadow-white/10"
          >
            {t('helpStart')}
          </motion.button>
          <p className="text-white/20 text-xs text-center mt-3">
            {t('helpFooter')}
          </p>
        </div>
      </motion.div>
    </div>
  )
}
