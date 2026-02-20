import { useEffect, useRef, useState } from 'react'
import { ExternalLink, Globe, WifiOff } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// ── ロード状態の定義 ─────────────────────────────
// 'loading'  : スケルトン表示中
// 'loaded'   : iframe表示済み
// 'error'    : タイムアウト → エラープレースホルダー表示
const TIMEOUT_MS = 8000 // このミリ秒内に onLoad が来なければエラー扱い

// ── スケルトンブロック ─────────────────────────
function SkeletonBlock({ className }) {
  return <div className={`skeleton rounded-xl ${className}`} />
}

function SkeletonScreen() {
  return (
    <div className="absolute inset-0 bg-gray-950 overflow-hidden flex flex-col">
      {/* ブラウザ風ヘッダー */}
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-900/80 border-b border-white/5 flex-shrink-0">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-white/10" />
          <div className="w-3 h-3 rounded-full bg-white/10" />
          <div className="w-3 h-3 rounded-full bg-white/10" />
        </div>
        <SkeletonBlock className="flex-1 h-6" />
        <SkeletonBlock className="w-20 h-6" />
      </div>

      {/* コンテンツエリア */}
      <div className="flex-1 p-5 space-y-3.5 overflow-hidden">
        {/* ヒーロー画像 */}
        <SkeletonBlock className="w-full h-40" />
        {/* 見出し */}
        <SkeletonBlock className="w-3/5 h-5" />
        {/* テキスト行 */}
        <SkeletonBlock className="w-full h-3.5" />
        <SkeletonBlock className="w-4/5 h-3.5" />
        <SkeletonBlock className="w-full h-3.5" />
        <div className="pt-2 space-y-3">
          {/* カード群 */}
          <div className="flex gap-3">
            <SkeletonBlock className="w-1/2 h-24" />
            <SkeletonBlock className="w-1/2 h-24" />
          </div>
          <SkeletonBlock className="w-full h-3.5" />
          <SkeletonBlock className="w-2/3 h-3.5" />
        </div>
      </div>
    </div>
  )
}

// ── エラープレースホルダー ──────────────────────
function BlockedPlaceholder({ site }) {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-black
      flex flex-col items-center justify-center px-8">

      {/* 背景装飾 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 rounded-full
          bg-gradient-to-br from-white/[0.02] to-transparent blur-3xl" />
        <div className="absolute bottom-1/4 -right-1/4 w-80 h-80 rounded-full
          bg-gradient-to-bl from-white/[0.03] to-transparent blur-3xl" />
      </div>

      {/* カード */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1,  y: 0  }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="relative z-10 w-full max-w-xs glass rounded-3xl px-7 py-8 text-center
          shadow-2xl shadow-black/60"
      >
        {/* アイコン */}
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10
          flex items-center justify-center mx-auto mb-5">
          <WifiOff size={28} className="text-white/30" />
        </div>

        {/* タイトル */}
        <h3 className="text-white font-bold text-lg leading-snug mb-2">
          外部ブラウザを推奨
        </h3>
        <p className="text-white/45 text-sm leading-relaxed mb-1">
          このサイトはセキュリティポリシーにより
        </p>
        <p className="text-white/45 text-sm leading-relaxed mb-6">
          iframe 内での表示をブロックしています
        </p>

        {/* ドメイン表示 */}
        <div className="flex items-center justify-center gap-1.5 mb-6">
          <Globe size={12} className="text-white/30" />
          <span className="text-white/30 text-xs truncate max-w-[200px]">
            {(() => { try { return new URL(site.url).hostname } catch { return site.url } })()}
          </span>
        </div>

        {/* CTA ボタン */}
        <a
          href={site.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center justify-center gap-2
            bg-white text-black font-semibold text-sm
            rounded-2xl px-6 py-3.5 w-full
            hover:bg-white/90 active:scale-95
            transition-all duration-150 shadow-lg shadow-white/10"
        >
          <ExternalLink size={16} />
          ブラウザで開く
        </a>
      </motion.div>
    </div>
  )
}

// ── カテゴリバッジの色 ──────────────────────────
const categoryColor = {
  Tools: 'bg-sky-500/20 text-sky-300 border-sky-500/20',
  News:  'bg-rose-500/20 text-rose-300 border-rose-500/20',
  Maps:  'bg-emerald-500/20 text-emerald-300 border-emerald-500/20',
  Games: 'bg-violet-500/20 text-violet-300 border-violet-500/20',
  Idea:  'bg-amber-500/20 text-amber-300 border-amber-500/20',
}

// ── メインコンポーネント ────────────────────────
export default function SiteCard({ site, isInteractive, onBlocked, onAutoSkip }) {
  const [status, setStatus] = useState('loading') // 'loading' | 'loaded' | 'error'
  const timerRef = useRef(null)

  useEffect(() => {
    setStatus('loading')

    // タイムアウト: TIMEOUT_MS 内に onLoad が来なければエラー表示
    timerRef.current = setTimeout(() => {
      setStatus((s) => {
        if (s === 'loading') {
          // ユーザー投稿サイトのみ自動非表示コールバックを発火
          if (site.isUserSubmitted) onBlocked?.(site.id)
          return 'error'
        }
        return s
      })
    }, TIMEOUT_MS)

    return () => clearTimeout(timerRef.current)
  }, [site.url]) // eslint-disable-line react-hooks/exhaustive-deps

  // エラー表示から 3 秒後に自動スキップ
  useEffect(() => {
    if (status !== 'error') return
    const t = setTimeout(() => onAutoSkip?.(), 3000)
    return () => clearTimeout(t)
  }, [status]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleLoad = () => {
    clearTimeout(timerRef.current)
    setStatus('loaded')
  }

  const badgeClass = categoryColor[site.category] ?? 'bg-white/10 text-white/50 border-white/10'

  return (
    <div className="relative h-full w-full bg-gray-950 overflow-hidden">

      {/* ── スケルトンローディング ── */}
      <AnimatePresence>
        {status === 'loading' && (
          <motion.div
            key="skeleton"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-10"
          >
            <SkeletonScreen />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── エラープレースホルダー ── */}
      <AnimatePresence>
        {status === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-10"
          >
            <BlockedPlaceholder site={site} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── iframe（常にレンダリング、status で透明度制御） ── */}
      <iframe
        key={site.url}
        src={site.url}
        title={site.title}
        className={`h-full w-full border-0 transition-opacity duration-500
          ${status === 'loaded' ? 'opacity-100' : 'opacity-0'}
          ${!isInteractive ? 'pointer-events-none' : ''}`}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
        onLoad={handleLoad}
        onError={() => setStatus('error')}
      />

      {/* ── 下部情報オーバーレイ（スワイプモード時） ── */}
      <AnimatePresence>
        {!isInteractive && status !== 'error' && (
          <motion.div
            key="info-overlay"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-0 left-0 right-16 z-20 pointer-events-none
              bg-gradient-to-t from-black/95 via-black/60 to-transparent
              pt-24 pb-8 px-5"
          >
            {/* カテゴリバッジ */}
            {site.category && (
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full
                text-[10px] font-semibold border mb-2 ${badgeClass}`}>
                {site.category}
              </span>
            )}
            {/* タイトル */}
            <p className="text-white font-bold text-xl leading-tight drop-shadow-lg line-clamp-2 mb-1">
              {site.title}
            </p>
            {/* 説明文 */}
            {site.description && (
              <p className="text-white/60 text-sm leading-snug line-clamp-2 mb-1.5">
                {site.description}
              </p>
            )}
            {/* URL */}
            <p className="text-white/35 text-xs truncate">
              {(() => { try { return new URL(site.url).hostname } catch { return site.url } })()}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 外部リンクボタン（スワイプモード時、右下） ── */}
      {!isInteractive && status !== 'error' && (
        <a
          href={site.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-20 right-2 z-30
            w-9 h-9 glass rounded-full flex items-center justify-center
            hover:bg-white/20 transition-colors"
          title="新しいタブで開く"
        >
          <ExternalLink size={14} className="text-white/60" />
        </a>
      )}

      {/* ── インタラクティブモードバッジ ── */}
      <AnimatePresence>
        {isInteractive && (
          <motion.div
            key="interactive-badge"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-14 left-1/2 -translate-x-1/2 z-30
              flex items-center gap-1.5 pointer-events-none
              bg-emerald-500/90 backdrop-blur-sm text-white
              text-xs font-medium px-3 py-1 rounded-full shadow-lg"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            インタラクティブモード
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
