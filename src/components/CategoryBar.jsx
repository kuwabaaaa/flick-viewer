import { useRef } from 'react'
import { motion } from 'framer-motion'

/**
 * カテゴリ選択チップバー
 *
 * - layoutId="activePill" による滑らかなアクティブ表示スライドアニメーション
 * - 横スクロール可能（no-scrollbar でバーを非表示）
 * - 上部に配置し、CategoryBar の高さ分だけコンテンツをオフセット
 */
export default function CategoryBar({ categories, active, onChange }) {
  const scrollRef = useRef(null)

  const handleClick = (cat) => {
    onChange(cat)
    // アクティブなチップを中央へスクロール
    const btn = scrollRef.current?.querySelector(`[data-cat="${cat}"]`)
    btn?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }

  return (
    <div className="absolute top-0 left-0 right-0 z-40 pt-2">
      {/* 上部フェードグラデーション */}
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/70 to-transparent pointer-events-none" />

      <div
        ref={scrollRef}
        className="relative flex gap-2 pl-4 pr-14 pb-2 overflow-x-auto no-scrollbar"
      >
        {categories.map((cat) => {
          const isActive = active === cat
          return (
            <motion.button
              key={cat}
              data-cat={cat}
              onClick={() => handleClick(cat)}
              whileTap={{ scale: 0.93 }}
              className={`
                relative flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold
                transition-colors duration-150 outline-none
                ${isActive
                  ? 'text-black'
                  : 'text-white/65 glass hover:text-white/90'
                }
              `}
            >
              {/* アクティブ時の白い背景ピル（layoutId でアニメーション） */}
              {isActive && (
                <motion.span
                  layoutId="activePill"
                  className="absolute inset-0 rounded-full bg-white"
                  style={{ zIndex: -1 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                />
              )}
              {cat}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
