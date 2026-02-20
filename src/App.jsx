import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import {
  AnimatePresence, motion,
  useMotionValue, useTransform, animate,
} from 'framer-motion'
import { User } from 'lucide-react'

import { sites, CATEGORIES } from './data/sites'
import { getSites, saveSite, getHiddenSiteIds, hideSite, reportSite, unreportSite } from './services/db'
import { recordView, toggleLike, toggleFavorite, getUserLikedIds, getUserFavoriteIds, saveSiteToSupabase, reportSiteSupabase } from './services/supabaseDb'
import { getCategoryPrefs, recordCategoryWatch, buildScoredFeed, startWatch, endWatch } from './hooks/useFeed'
import { useAuth } from './context/AuthContext'
import { useLang } from './context/LangContext'
import { isSupabaseConfigured } from './lib/supabase'

import SiteCard         from './components/SiteCard'
import FloatingPanel    from './components/FloatingPanel'
import ReportModal      from './components/ReportModal'
import UrlSubmitModal   from './components/UrlSubmitModal'
import CategoryBar      from './components/CategoryBar'
import Toast            from './components/Toast'
import HelpModal        from './components/HelpModal'
import AuthModal        from './components/AuthModal'
import LoginPrompt      from './components/LoginPrompt'
import AlgorithmLoader  from './components/AlgorithmLoader'
import MyPage           from './components/MyPage'

// ─────────────────────────────────────────────────────────────
// フィード構築
// ─────────────────────────────────────────────────────────────
function buildFeed(siteList) {
  return siteList.map((site) => ({ type: 'site', ...site }))
}

// スワイプしきい値
const SWIPE_PX  = 65
const SWIPE_VEL = 380

// カードバリアント
const cardVariants = {
  enter:  (dir) => ({ y: dir >= 0 ? '100%' : '-100%', opacity: 0.5, scale: 0.98 }),
  center: { y: 0, opacity: 1, scale: 1 },
  exit:   (dir) => ({ y: dir >= 0 ? '-100%' : '100%', opacity: 0,   scale: 0.96 }),
}
const cardTransition = {
  y:       { type: 'spring', stiffness: 310, damping: 33, mass: 0.9 },
  opacity: { duration: 0.18 },
  scale:   { duration: 0.22 },
}

// カテゴリカラー
const CATEGORY_COLOR = {
  Tools: 'text-sky-400', News: 'text-rose-400',
  Maps: 'text-emerald-400', Games: 'text-violet-400', Idea: 'text-amber-400',
}

// ─────────────────────────────────────────────────────────────
// PeekCard（次のカードのプレビュー）
// ─────────────────────────────────────────────────────────────
function PeekCard({ item }) {
  if (!item) return <div className="absolute inset-0 bg-black" />
  return (
    <div className="absolute inset-0 bg-gray-950 overflow-hidden">
      {item.type === 'site' && item.thumbnail && (
        <img src={item.thumbnail} alt="" loading="lazy"
          className="absolute inset-0 w-full h-full object-cover opacity-25 blur-md scale-110" />
      )}
      <div className="absolute inset-0 flex flex-col justify-end px-6 pb-32 space-y-2">
        {item.type === 'site' && item.category && (
          <span className={`text-xs font-semibold ${CATEGORY_COLOR[item.category] ?? 'text-white/40'}`}>
            {item.category}
          </span>
        )}
        <p className="text-white/70 font-bold text-3xl leading-tight line-clamp-3">
          {item.type === 'site' ? item.title : '広告スペース'}
        </p>
        {item.type === 'site' && (
          <p className="text-white/30 text-sm truncate">
            {(() => { try { return new URL(item.url).hostname } catch { return item.url } })()}
          </p>
        )}
      </div>
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black to-transparent" />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// App
// ─────────────────────────────────────────────────────────────
export default function App() {
  const { user, profile } = useAuth()
  const { t } = useLang()

  // ── 1. localStorage + Supabase サイト取得 ──────────────────
  const [userSites,  setUserSites]  = useState([])
  const [hiddenIds,  setHiddenIds]  = useState([])
  const [likedIds,    setLikedIds]    = useState([])
  const [favoriteIds, setFavoriteIds] = useState([])
  const [reportedIds, setReportedIds] = useState(new Set())

  useEffect(() => {
    getSites().then(setUserSites)
    getHiddenSiteIds().then(setHiddenIds)
  }, [])

  useEffect(() => {
    if (!user || !isSupabaseConfigured) return
    getUserLikedIds(user.id).then(setLikedIds)
    getUserFavoriteIds(user.id).then(setFavoriteIds)
  }, [user])

  // ── 2. UI State ─────────────────────────────────────────────
  const [activeCategory,  setActiveCategory]  = useState('All')
  const [currentIndex,    setCurrentIndex]    = useState(0)
  const [direction,       setDirection]       = useState(1)
  const [isInteractive,   setIsInteractive]   = useState(false)
  const [showModal,       setShowModal]       = useState(false)
  const [showHelp,        setShowHelp]        = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [showAuthModal,   setShowAuthModal]   = useState(false)
  const [showMyPage,      setShowMyPage]      = useState(false)
  const [loginPromptAction, setLoginPromptAction] = useState(null) // null | 'like'|'favorite'|'submit'|'tip'
  const [showAlgorithmLoader, setShowAlgorithmLoader] = useState(false)
  const [hintVisible,     setHintVisible]     = useState(true)
  const swipeCountRef = useRef(0)

  // ── 3. Toast ────────────────────────────────────────────────
  const toastTimerRef = useRef(null)
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' })

  const showToast = useCallback((message, type = 'success') => {
    clearTimeout(toastTimerRef.current)
    setToast({ visible: true, message, type })
    toastTimerRef.current = setTimeout(() => {
      setToast((t) => ({ ...t, visible: false }))
    }, 2600)
  }, [])

  // ── ヒント自動非表示 ─────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setHintVisible(false), 5000)
    return () => clearTimeout(t)
  }, [])

  // ── 初回訪問時にヘルプを自動表示 ─────────────────────────────
  useEffect(() => {
    if (!localStorage.getItem('flickview_help_seen')) setShowHelp(true)
  }, [])

  // ── Motion values ─────────────────────────────────────────
  const dragY       = useMotionValue(0)
  const peekScale   = useTransform(dragY, [-280, 0], [1,    0.88])
  const peekCardY   = useTransform(dragY, [-280, 0], ['0%', '7%'])
  const peekOpacity = useTransform(dragY, [-100, 0], [0.80, 0.22])

  // ── 4. フィード構築（スコアベース） ──────────────────────────
  const allSites = useMemo(() => [...userSites, ...sites], [userSites])

  const filteredSites = useMemo(() => {
    const visible = allSites.filter((s) => !hiddenIds.includes(s.id))
    if (activeCategory === 'All') return visible
    return visible.filter((s) => s.category === activeCategory)
  }, [activeCategory, allSites, hiddenIds])

  const categoryPrefs = useMemo(() => getCategoryPrefs(), [])

  const feed = useMemo(
    () => buildFeed(buildScoredFeed(filteredSites, categoryPrefs)),
    [filteredSites, categoryPrefs],
  )

  // カテゴリ/フィード変更でリセット
  useEffect(() => {
    setCurrentIndex(0)
    setIsInteractive(false)
    dragY.set(0)
  }, [feed]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { setIsInteractive(false) }, [currentIndex])

  const currentItem = feed[currentIndex] ?? feed[0]
  const nextItem    = feed[currentIndex + 1]
  const canGoNext   = currentIndex < feed.length - 1
  const canGoPrev   = currentIndex > 0

  // ── 5. 閲覧時間トラッキング ──────────────────────────────────
  useEffect(() => {
    if (currentItem?.type === 'site') startWatch(currentItem)
    return () => {
      const result = endWatch(false)
      if (!result || result.seconds < 2) return
      // カテゴリ嗜好を学習
      if (result.site.category) recordCategoryWatch(result.site.category, result.seconds)
      // Supabase に記録（ログイン中のみ）
      if (user && isSupabaseConfigured) {
        recordView(result.site.id, user.id, result.seconds, false)
      }
    }
  }, [currentIndex]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── 6. ナビゲーション ────────────────────────────────────────
  const advance = useCallback((dir) => {
    setDirection(dir)
    setCurrentIndex((i) => i + dir)
  }, [])

  const goNext = useCallback(() => {
    if (!canGoNext) return
    swipeCountRef.current += 1
    // 7 回ごとにアルゴリズムローダーを挟む
    if (swipeCountRef.current % 7 === 0) {
      setShowAlgorithmLoader(true)
      setTimeout(() => {
        setShowAlgorithmLoader(false)
        advance(1)
      }, 1400)
      return
    }
    advance(1)
  }, [canGoNext, advance])

  const goPrev = useCallback(() => {
    if (!canGoPrev) return
    advance(-1)
  }, [canGoPrev, advance])

  // キーボード
  useEffect(() => {
    const onKey = (e) => {
      if (showModal || showAuthModal || loginPromptAction) return
      if (e.key === 'ArrowDown') goNext()
      else if (e.key === 'ArrowUp') goPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goNext, goPrev, showModal, showAuthModal, loginPromptAction])

  // マウスホイール（700ms スロットル）
  const lastWheelRef = useRef(0)
  useEffect(() => {
    const onWheel = (e) => {
      if (showModal || showAuthModal || loginPromptAction || showMyPage || showHelp) return
      const now = Date.now()
      if (now - lastWheelRef.current < 700) return
      lastWheelRef.current = now
      if (e.deltaY > 0) goNext()
      else if (e.deltaY < 0) goPrev()
    }
    window.addEventListener('wheel', onWheel, { passive: true })
    return () => window.removeEventListener('wheel', onWheel)
  }, [goNext, goPrev, showModal, showAuthModal, loginPromptAction, showMyPage, showHelp])

  // スワイプ終了
  const handleDragEnd = useCallback((_, info) => {
    const { offset, velocity } = info
    animate(dragY, 0, { type: 'spring', stiffness: 500, damping: 38 })
    if (offset.y < -SWIPE_PX || velocity.y < -SWIPE_VEL) goNext()
    else if (offset.y > SWIPE_PX || velocity.y > SWIPE_VEL) goPrev()
  }, [dragY, goNext, goPrev])

  // ── 7. 認証ゲートユーティリティ ──────────────────────────────
  const requireAuth = useCallback((action, fn) => {
    if (!user) { setLoginPromptAction(action); return }
    fn()
  }, [user])

  // ── 8. いいね ────────────────────────────────────────────────
  const handleLike = useCallback(() => {
    requireAuth('like', async () => {
      if (!currentItem || currentItem.type !== 'site') return
      const nowLiked = await toggleLike(user.id, currentItem.id)
      setLikedIds((prev) =>
        nowLiked ? [...prev, currentItem.id] : prev.filter((id) => id !== currentItem.id)
      )
    })
  }, [requireAuth, currentItem, user])

  // ── 9. お気に入り ────────────────────────────────────────────
  const handleFavorite = useCallback(() => {
    requireAuth('favorite', async () => {
      if (!currentItem || currentItem.type !== 'site') return
      const nowFav = await toggleFavorite(user.id, currentItem.id)
      setFavoriteIds((prev) =>
        nowFav ? [...prev, currentItem.id] : prev.filter((id) => id !== currentItem.id)
      )
      showToast(nowFav ? t('favAdded') : t('favRemoved'))
    })
  }, [requireAuth, currentItem, user, showToast])

  // ── 10. 報告 ─────────────────────────────────────────────────
  const handleOpenReport = useCallback(() => {
    if (!currentItem || currentItem.type !== 'site') return
    setShowReportModal(true)
  }, [currentItem])

  const handleSubmitReport = useCallback(async (reason) => {
    setShowReportModal(false)
    if (!currentItem || currentItem.type !== 'site') return
    // ローカル DB に記録
    const autoHiddenLocal = await reportSite(currentItem.id)
    // Supabase に記録（閾値超過で自動削除）
    const autoDeletedRemote = isSupabaseConfigured
      ? await reportSiteSupabase(currentItem.id, reason)
      : false
    setReportedIds((prev) => new Set([...prev, currentItem.id]))
    if (autoHiddenLocal || autoDeletedRemote) {
      setHiddenIds((prev) => [...prev, currentItem.id])
      showToast(t('siteHidden'))
      goNext()
    } else {
      showToast(t('reportedMsg'))
    }
  }, [currentItem, showToast, goNext])

  // ── 11. iframe ブロック自動非表示 ────────────────────────────
  const handleBlocked = useCallback(async (siteId) => {
    await hideSite(siteId)
    setHiddenIds((prev) => prev.includes(siteId) ? prev : [...prev, siteId])
  }, [])

  // ── 11b. エラー表示後の自動スキップ ──────────────────────────
  const handleAutoSkip = useCallback(() => {
    goNext()
  }, [goNext])

  // ── 11c. 報告取り消し ─────────────────────────────────────────
  const handleUnreport = useCallback(async () => {
    if (!currentItem || currentItem.type !== 'site') return
    await unreportSite(currentItem.id)
    setReportedIds((prev) => {
      const next = new Set(prev)
      next.delete(currentItem.id)
      return next
    })
    showToast(t('unreportedMsg'))
  }, [currentItem, showToast])

  // ── 12. HelpModal ────────────────────────────────────────────
  const closeHelp = useCallback(() => {
    localStorage.setItem('flickview_help_seen', '1')
    setShowHelp(false)
  }, [])

  // ── 13. URL 投稿 ─────────────────────────────────────────────
  const handleOpenSubmit = useCallback(() => {
    requireAuth('submit', () => setShowModal(true))
  }, [requireAuth])

  const handleUrlSubmit = useCallback(async (url, title, category, authorWallet = null) => {
    try {
      let newSite
      if (user && isSupabaseConfigured) {
        // ウォレット情報をプロフィールから補完
        const wallets = authorWallet ?? (profile ? {
          ...(profile.btc_wallet ? { BTC: profile.btc_wallet } : {}),
          ...(profile.eth_wallet ? { ETH: profile.eth_wallet } : {}),
          ...(profile.sol_wallet ? { SOL: profile.sol_wallet } : {}),
        } : null)
        newSite = await saveSiteToSupabase({ url, title, category, authorWallet: wallets, authorId: user.id })
      } else {
        newSite = await saveSite({ url, title, category, description: '', authorWallet })
      }
      setUserSites((prev) => [newSite, ...prev])
      showToast(t('postedMsg'))
    } catch (e) {
      showToast(e.message ?? t('postError'), 'error')
    }
    setShowModal(false)
  }, [user, profile, showToast])

  // ── 14. シェア ───────────────────────────────────────────────
  const handleShare = useCallback(async () => {
    if (!currentItem || currentItem.type !== 'site') return
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(currentItem.url)
      } else {
        const ta = document.createElement('textarea')
        ta.value = currentItem.url
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
      }
      showToast(t('copiedMsg'))
    } catch {
      showToast(t('copyError'), 'error')
    }
  }, [currentItem, showToast])

  // ── 現在サイトの状態 ─────────────────────────────────────────
  const currentSiteId    = currentItem?.type === 'site' ? currentItem.id : null
  const isLiked          = currentSiteId ? likedIds.includes(currentSiteId) : false
  const isFavorited      = currentSiteId ? favoriteIds.includes(currentSiteId) : false
  const isReported       = currentSiteId ? reportedIds.has(currentSiteId) : false
  const currentLikeCount = currentItem?.likes_count ?? 0

  // ─────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black select-none">

      {/* ══ Layer 0: Peek background ═══════════════════════════ */}
      <motion.div className="absolute inset-0 z-0 overflow-hidden"
        style={{ scale: peekScale, y: peekCardY, opacity: peekOpacity }}>
        <PeekCard item={nextItem} />
      </motion.div>

      {/* ══ Layer 1: Current card ══════════════════════════════ */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={`${activeCategory}-${currentIndex}`}
          custom={direction}
          variants={cardVariants}
          initial="enter" animate="center" exit="exit"
          transition={cardTransition}
          className="absolute inset-0 z-10"
        >
          {currentItem?.type === 'site' && (
            <SiteCard site={currentItem} isInteractive={isInteractive} onBlocked={handleBlocked} onAutoSkip={handleAutoSkip} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* ══ Layer 1b: アルゴリズムローダー ════════════════════════ */}
      <AnimatePresence>
        {showAlgorithmLoader && <AlgorithmLoader />}
      </AnimatePresence>

      {/* ══ Layer 2: 透明スワイプオーバーレイ（非インタラクティブ時） */}
      {!isInteractive && (
        <motion.div
          className="absolute inset-0 z-20"
          style={{ cursor: 'grab', touchAction: 'none' }}
          whileTap={{ cursor: 'grabbing' }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.14}
          dragTransition={{ bounceStiffness: 560, bounceDamping: 30 }}
          onDrag={(_, info) => dragY.set(info.offset.y)}
          onDragEnd={handleDragEnd}
          onDoubleClick={() => { if (currentItem?.type === 'site') setIsInteractive(true) }}
        />
      )}

      {/* ══ Layer 2b: 左端スワイプ安全地帯（インタラクティブ中も常時） */}
      {isInteractive && (
        <motion.div
          className="absolute inset-y-0 left-0 w-14 z-[25] touch-none"
          style={{ cursor: 'ns-resize', touchAction: 'none' }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.14}
          dragTransition={{ bounceStiffness: 560, bounceDamping: 30 }}
          onDrag={(_, info) => dragY.set(info.offset.y)}
          onDragEnd={handleDragEnd}
        />
      )}

      {/* ══ Layer 3: UI 要素 ════════════════════════════════════ */}

      {/* ユーザーボタン（右下 / TikTok スタイル） */}
      <button
        onClick={() => user ? setShowMyPage(true) : setShowAuthModal(true)}
        className="absolute right-4 bottom-8 z-50 w-10 h-10
          flex items-center justify-center rounded-full
          bg-gray-900/85 backdrop-blur-md
          border border-white/20 shadow-lg shadow-black/50
          text-white/75 hover:text-white active:scale-95 transition-all"
        aria-label={user ? 'マイページ' : 'ログイン'}
      >
        {user && profile?.username ? (
          <span className="text-sm font-bold text-white">
            {profile.username.slice(0, 1).toUpperCase()}
          </span>
        ) : (
          <User size={16} />
        )}
      </button>

      {/* ヘルプボタン（右上 / z-50 で CategoryBar より前面） */}
      <button
        onClick={() => setShowHelp(true)}
        className="absolute right-3 top-3 z-50 w-9 h-9
          flex items-center justify-center rounded-full
          bg-gray-900/85 backdrop-blur-md
          border border-white/20 shadow-lg shadow-black/50
          text-white/75 hover:text-white text-sm font-bold
          active:scale-95 transition-all"
        aria-label="使い方"
      >
        ?
      </button>

      {/* カテゴリバー */}
      <CategoryBar categories={CATEGORIES} active={activeCategory} onChange={setActiveCategory} />

      {/* フローティングパネル */}
      <FloatingPanel
        isInteractive={isInteractive}
        onToggleInteractive={() => { if (currentItem?.type === 'site') setIsInteractive((v) => !v) }}
        liked={isLiked}
        likeCount={currentLikeCount}
        onLike={handleLike}
        favorited={isFavorited}
        onFavorite={handleFavorite}
        onUrlSubmit={handleOpenSubmit}
        onShare={handleShare}
        onReport={handleOpenReport}
        onUnreport={handleUnreport}
        reported={isReported}
        canReport={currentItem?.type === 'site'}
      />

      {/* フィードが空のとき */}
      {feed.length === 0 && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3">
          <p className="text-white/40 text-base font-medium">
            {t('emptyFeed').replace('%s', activeCategory)}
          </p>
          <button onClick={() => setActiveCategory('All')}
            className="text-sky-400 text-sm underline underline-offset-2">{t('showAll')}</button>
        </div>
      )}

      {/* 操作ヒント */}
      <AnimatePresence>
        {hintVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }} transition={{ delay: 0.9, duration: 0.5 }}
            className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
          >
            <div className="glass rounded-full px-4 py-2 border-white/8
              text-white/40 text-xs text-center whitespace-nowrap">
              {t('swipeHint')}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ モーダル群 ══════════════════════════════════════════ */}

      <AnimatePresence>
        {showModal && (
          <UrlSubmitModal onClose={() => setShowModal(false)} onSubmit={handleUrlSubmit} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showHelp && <HelpModal onClose={closeHelp} />}
      </AnimatePresence>

      <AnimatePresence>
        {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {loginPromptAction && (
          <LoginPrompt
            action={loginPromptAction}
            onLogin={() => { setLoginPromptAction(null); setShowAuthModal(true) }}
            onDismiss={() => setLoginPromptAction(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMyPage && <MyPage onClose={() => setShowMyPage(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {showReportModal && (
          <ReportModal
            onSubmit={handleSubmitReport}
            onClose={() => setShowReportModal(false)}
          />
        )}
      </AnimatePresence>

      <Toast message={toast.message} visible={toast.visible} type={toast.type} />
    </div>
  )
}
