import { Heart, PlusCircle, MousePointer2, Share2, Flag, Bookmark } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '../context/LangContext'

function Divider() {
  return <div className="w-8 h-px bg-white/[0.15] mx-auto flex-shrink-0" />
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
  active    = false,
  iconClass = 'text-white/80',
  glowClass = '',
  badge     = null,
}) {
  return (
    <motion.div
      className="flex flex-col items-center gap-1 px-3 py-2.5 rounded-2xl
        cursor-pointer hover:bg-white/15 transition-colors duration-150 relative"
      whileTap={{ scale: 0.88 }}
      onClick={onClick}
    >
      <div className="relative">
        <Icon
          size={24}
          className={`${iconClass} ${active ? glowClass : ''} transition-all duration-200`}
          strokeWidth={active ? 2.5 : 1.8}
        />
        <AnimatePresence>
          {badge != null && badge > 0 && (
            <motion.span
              key={badge}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1,   opacity: 1 }}
              exit={{    scale: 0.5, opacity: 0 }}
              className="absolute -top-1.5 -right-2
                bg-rose-500 text-white text-[9px] font-bold
                rounded-full min-w-[16px] h-4
                flex items-center justify-center px-0.5"
            >
              {badge > 99 ? '99+' : badge}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <span className={`text-[10px] font-medium leading-none tracking-wide
        ${active ? 'text-white/90' : 'text-white/45'}`}>
        {label}
      </span>
    </motion.div>
  )
}

export default function FloatingPanel({
  isInteractive,
  onToggleInteractive,
  liked      = false,
  likeCount  = 0,
  onLike,
  favorited  = false,
  onFavorite,
  onUrlSubmit,
  onShare,
  onReport,
  onUnreport,
  reported   = false,
  canReport,
}) {
  const { t } = useLang()

  const handleReport = () => {
    if (reported) onUnreport?.()
    else onReport?.()
  }

  return (
    <div className="absolute right-3 bottom-20 z-30">
      <div className="
        flex flex-col items-stretch py-1.5
        bg-gray-900/80 backdrop-blur-2xl
        border border-white/[0.18]
        rounded-[28px]
        shadow-2xl shadow-black/80
      ">

        {/* ❤️ いいね */}
        <ActionButton
          icon={Heart}
          label={likeCount > 0 ? String(likeCount) : t('like')}
          iconClass={liked
            ? 'text-rose-400 fill-rose-400 icon-glow-rose'
            : 'text-white/75'}
          glowClass="icon-glow-rose"
          active={liked}
          badge={likeCount > 0 ? likeCount : null}
          onClick={onLike}
        />

        <Divider />

        {/* 🔖 お気に入り */}
        <ActionButton
          icon={Bookmark}
          label={favorited ? t('saved') : t('save')}
          iconClass={favorited ? 'text-sky-400 fill-sky-400' : 'text-white/70'}
          active={favorited}
          onClick={onFavorite}
        />

        <Divider />

        {/* 🔗 シェア */}
        <ActionButton
          icon={Share2}
          label={t('share')}
          iconClass="text-white/70"
          onClick={onShare}
        />

        <Divider />

        {/* ＋ URL投稿 */}
        <ActionButton
          icon={PlusCircle}
          label={t('post')}
          iconClass="text-sky-400"
          glowClass="icon-glow-sky"
          onClick={onUrlSubmit}
        />

        <Divider />

        {/* ⌖ インタラクティブモード切替 */}
        <ActionButton
          icon={MousePointer2}
          label={isInteractive ? t('operating') : t('tap')}
          iconClass={isInteractive ? 'text-emerald-400' : 'text-white/50'}
          glowClass="icon-glow-green"
          active={isInteractive}
          onClick={onToggleInteractive}
        />

        {/* 🚩 報告（トグル可能） */}
        {canReport && (
          <>
            <Divider />
            <ActionButton
              icon={Flag}
              label={reported ? t('reported') : t('report')}
              iconClass={reported ? 'text-rose-400 fill-rose-400' : 'text-white/30'}
              active={reported}
              onClick={handleReport}
            />
          </>
        )}
      </div>
    </div>
  )
}
