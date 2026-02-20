import { useState, useEffect, useCallback } from 'react'
import {
  X, User, Wallet, LayoutGrid, Heart, Bookmark,
  Pencil, Trash2, Save, Eye, SkipForward, ExternalLink, LogOut,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import {
  getAuthorSites, getFavoriteSites, updateSite, deleteSite,
} from '../services/supabaseDb'
import { CATEGORIES } from '../data/sites'

// ── セクションヘッダー ────────────────────────────────────────
function SectionHeader({ icon: Icon, label, count }) {
  return (
    <div className="flex items-center gap-2 mb-3 px-1">
      <Icon size={15} className="text-white/50" />
      <span className="text-white/70 text-sm font-semibold">{label}</span>
      {count != null && (
        <span className="text-white/30 text-xs ml-auto">{count}件</span>
      )}
    </div>
  )
}

// ── ウォレット入力行 ──────────────────────────────────────────
function WalletRow({ label, coin, value, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] font-bold text-white/40 w-8 flex-shrink-0">{coin}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`${label} アドレス`}
        className="flex-1 glass text-white/80 rounded-xl px-3 py-2.5 text-xs font-mono
          placeholder-white/20 outline-none focus:border-white/30 transition-all"
      />
    </div>
  )
}

// ── 投稿サイトカード（編集・削除・アナリティクス） ─────────────
function AuthorSiteCard({ site, onUpdated, onDeleted }) {
  const [editing, setEditing]   = useState(false)
  const [title,   setTitle]     = useState(site.title)
  const [saving,  setSaving]    = useState(false)
  const [confirm, setConfirm]   = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateSite(site.id, { title })
      onUpdated({ ...site, title })
      setEditing(false)
    } catch { /* ignore */ }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!confirm) { setConfirm(true); return }
    try {
      await deleteSite(site.id)
      onDeleted(site.id)
    } catch { /* ignore */ }
  }

  const views  = site.view_count  ?? 0
  const likes  = site.likes_count ?? 0
  const skips  = site.skip_count  ?? 0
  const total  = views + skips
  const skipRate = total > 0 ? Math.round((skips / total) * 100) : 0

  const hostname = (() => { try { return new URL(site.url).hostname } catch { return site.url } })()

  return (
    <motion.div
      layout
      className="glass rounded-2xl p-4 border border-white/8"
    >
      {/* タイトル行 */}
      {editing ? (
        <div className="flex gap-2 mb-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 glass text-white rounded-xl px-3 py-1.5 text-sm
              outline-none focus:border-white/30 transition-all"
            autoFocus
          />
          <button onClick={handleSave} disabled={saving}
            className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all">
            <Save size={13} />
          </button>
          <button onClick={() => { setEditing(false); setTitle(site.title) }}
            className="px-2 py-1.5 rounded-xl glass text-white/50 text-xs">
            <X size={13} />
          </button>
        </div>
      ) : (
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="min-w-0">
            <p className="text-white font-semibold text-sm truncate">{title}</p>
            <p className="text-white/30 text-xs truncate mt-0.5">{hostname}</p>
          </div>
          <div className="flex gap-1.5 flex-shrink-0">
            <a href={site.url} target="_blank" rel="noopener noreferrer"
              className="w-7 h-7 glass rounded-xl flex items-center justify-center hover:bg-white/15 transition-colors">
              <ExternalLink size={12} className="text-white/40" />
            </a>
            <button onClick={() => setEditing(true)}
              className="w-7 h-7 glass rounded-xl flex items-center justify-center hover:bg-white/15 transition-colors">
              <Pencil size={12} className="text-white/40" />
            </button>
            <button onClick={handleDelete}
              className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all
                ${confirm ? 'bg-rose-500/30 border border-rose-500/40' : 'glass hover:bg-rose-500/15'}`}>
              <Trash2 size={12} className={confirm ? 'text-rose-400' : 'text-white/40'} />
            </button>
          </div>
        </div>
      )}

      {confirm && (
        <p className="text-rose-400 text-xs mb-2">もう一度タップで削除します</p>
      )}

      {/* アナリティクスバー */}
      <div className="flex items-center gap-4 text-[11px] text-white/35">
        <span className="flex items-center gap-1">
          <Eye size={11} className="text-sky-400/60" /> {views}
        </span>
        <span className="flex items-center gap-1">
          <Heart size={11} className="text-rose-400/60" /> {likes}
        </span>
        <span className="flex items-center gap-1">
          <SkipForward size={11} className="text-white/30" /> スキップ {skipRate}%
        </span>
        {/* スキップ率バー */}
        <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden ml-auto">
          <div
            className="h-full bg-gradient-to-r from-sky-500 to-rose-500 rounded-full"
            style={{ width: `${Math.min(100, (likes / Math.max(1, views)) * 200)}%` }}
          />
        </div>
      </div>
    </motion.div>
  )
}

// ── お気に入り / いいねサイトカード ──────────────────────────
function SiteListCard({ site }) {
  const hostname = (() => { try { return new URL(site.url).hostname } catch { return site.url } })()
  return (
    <div className="glass rounded-2xl px-4 py-3 border border-white/8 flex items-center gap-3">
      <div className="min-w-0 flex-1">
        <p className="text-white/80 text-sm font-medium truncate">{site.title}</p>
        <p className="text-white/30 text-xs truncate">{hostname}</p>
      </div>
      <a href={site.url} target="_blank" rel="noopener noreferrer"
        className="w-7 h-7 glass rounded-xl flex items-center justify-center hover:bg-white/15 transition-colors flex-shrink-0">
        <ExternalLink size={12} className="text-white/40" />
      </a>
    </div>
  )
}

// ── タブ定義 ──────────────────────────────────────────────────
const TABS = [
  { id: 'profile',   label: 'プロフィール', icon: User },
  { id: 'posts',     label: '自分の投稿',   icon: LayoutGrid },
  { id: 'favorites', label: 'お気に入り',   icon: Bookmark },
]

// ── メインコンポーネント ──────────────────────────────────────
export default function MyPage({ onClose }) {
  const { user, profile, updateProfile, signOut } = useAuth()
  const [tab,       setTab]       = useState('profile')
  const [btc,       setBtc]       = useState(profile?.btc_wallet ?? '')
  const [eth,       setEth]       = useState(profile?.eth_wallet ?? '')
  const [sol,       setSol]       = useState(profile?.sol_wallet ?? '')
  const [username,  setUsername]  = useState(profile?.username ?? '')
  const [saving,    setSaving]    = useState(false)
  const [saved,     setSaved]     = useState(false)
  const [authorSites,   setAuthorSites]   = useState([])
  const [favoriteSites, setFavoriteSites] = useState([])
  const [loadingData,   setLoadingData]   = useState(false)

  // 投稿サイト & お気に入りを取得
  useEffect(() => {
    if (!user) return
    setLoadingData(true)
    Promise.all([
      getAuthorSites(user.id),
      getFavoriteSites(user.id),
    ]).then(([posts, favs]) => {
      setAuthorSites(posts)
      setFavoriteSites(favs)
    }).finally(() => setLoadingData(false))
  }, [user])

  const handleSaveProfile = useCallback(async () => {
    setSaving(true)
    await updateProfile({
      username:   username.trim() || null,
      btc_wallet: btc.trim() || null,
      eth_wallet: eth.trim() || null,
      sol_wallet: sol.trim() || null,
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }, [username, btc, eth, sol, updateProfile])

  const handleSignOut = async () => {
    await signOut()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 34 }}
        className="flex flex-col h-full sm:h-auto sm:max-h-[92vh]
          sm:max-w-md sm:mx-auto sm:mt-auto w-full
          bg-gray-950 sm:rounded-t-3xl overflow-hidden"
      >
        {/* ── ヘッダー ── */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 flex-shrink-0
          border-b border-white/5">
          <div>
            <h2 className="text-white font-bold text-lg">マイページ</h2>
            <p className="text-white/30 text-xs mt-0.5 truncate max-w-[220px]">
              {user?.email}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleSignOut}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass
                text-white/40 hover:text-white/70 text-xs transition-colors">
              <LogOut size={12} /> ログアウト
            </button>
            <button onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
              <X size={15} className="text-white/70" />
            </button>
          </div>
        </div>

        {/* ── タブバー ── */}
        <div className="flex gap-1 px-4 py-2.5 flex-shrink-0 border-b border-white/5 overflow-x-auto no-scrollbar">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold
                whitespace-nowrap transition-all
                ${tab === t.id ? 'bg-white/10 text-white' : 'text-white/35 hover:text-white/60'}`}>
              <t.icon size={13} />
              {t.label}
            </button>
          ))}
        </div>

        {/* ── コンテンツ ── */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <AnimatePresence mode="wait">

            {/* ─── プロフィールタブ ─── */}
            {tab === 'profile' && (
              <motion.div key="profile"
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }}
                className="p-5 space-y-5"
              >
                {/* ユーザー名 */}
                <div>
                  <SectionHeader icon={User} label="ユーザー名" />
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="表示名（未設定）"
                    maxLength={30}
                    className="w-full glass text-white rounded-2xl px-4 py-3 text-sm
                      placeholder-white/20 outline-none focus:border-white/30 transition-all"
                  />
                </div>

                {/* ウォレット設定 */}
                <div>
                  <SectionHeader icon={Wallet} label="ウォレットアドレス" />
                  <div className="space-y-2.5">
                    <WalletRow label="Bitcoin"  coin="BTC" value={btc} onChange={setBtc} />
                    <WalletRow label="Ethereum" coin="ETH" value={eth} onChange={setEth} />
                    <WalletRow label="Solana"   coin="SOL" value={sol} onChange={setSol} />
                  </div>
                  <p className="text-white/20 text-xs mt-2 px-1">
                    ※ 自分の投稿サイトへの投げ銭受取に使用されます
                  </p>
                </div>

                {/* 保存ボタン */}
                <motion.button
                  onClick={handleSaveProfile} disabled={saving} whileTap={{ scale: 0.97 }}
                  className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all
                    ${saved
                      ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                      : 'bg-white text-black hover:bg-white/90'}`}
                >
                  {saving ? '保存中...' : saved ? '✓ 保存しました' : 'プロフィールを保存'}
                </motion.button>
              </motion.div>
            )}

            {/* ─── 自分の投稿タブ ─── */}
            {tab === 'posts' && (
              <motion.div key="posts"
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }}
                className="p-5"
              >
                <SectionHeader icon={LayoutGrid} label="投稿サイト" count={authorSites.length} />
                {loadingData ? (
                  <p className="text-white/25 text-sm text-center py-8">読み込み中...</p>
                ) : authorSites.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-white/25 text-sm">まだ投稿がありません</p>
                    <p className="text-white/15 text-xs mt-1">右パネルの「＋」から投稿できます</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <AnimatePresence>
                      {authorSites.map((s) => (
                        <AuthorSiteCard
                          key={s.id}
                          site={s}
                          onUpdated={(updated) =>
                            setAuthorSites((prev) => prev.map((x) => x.id === updated.id ? updated : x))}
                          onDeleted={(id) =>
                            setAuthorSites((prev) => prev.filter((x) => x.id !== id))}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>
            )}

            {/* ─── お気に入りタブ ─── */}
            {tab === 'favorites' && (
              <motion.div key="favorites"
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }}
                className="p-5"
              >
                <SectionHeader icon={Bookmark} label="お気に入り" count={favoriteSites.length} />
                {loadingData ? (
                  <p className="text-white/25 text-sm text-center py-8">読み込み中...</p>
                ) : favoriteSites.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-white/25 text-sm">保存済みサイトがありません</p>
                    <p className="text-white/15 text-xs mt-1">右パネルの「🔖」で保存できます</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {favoriteSites.map((s) => (
                      <SiteListCard key={s.id} site={s} />
                    ))}
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
