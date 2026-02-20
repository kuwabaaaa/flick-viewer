import { useState, useEffect } from 'react'
import { X, Globe, Link2, ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { CATEGORIES } from '../data/sites'

const WALLET_COINS = ['BTC', 'ETH', 'SOL']

/**
 * URL投稿モーダル
 *
 * onSubmit(url, title, category, authorWallet) コールバックで親へ通知します。
 * authorWallet: { [coin]: address } | null
 */
export default function UrlSubmitModal({ onClose, onSubmit }) {
  const [url, setUrl] = useState('https://')
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Tools')
  const [error, setError] = useState('')
  const [urlMeta, setUrlMeta] = useState({ hostname: '', favicon: '' })

  // 投げ銭受け取り設定
  const [showWallet,   setShowWallet]   = useState(false)
  const [walletCoin,   setWalletCoin]   = useState('ETH')
  const [walletAddress, setWalletAddress] = useState('')

  // URLが変わるたびにホスト名とファビコンを抽出
  useEffect(() => {
    try {
      const parsed = new URL(url)
      if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error()
      const hostname = parsed.hostname
      setUrlMeta({
        hostname,
        favicon: `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`,
      })
    } catch {
      setUrlMeta({ hostname: '', favicon: '' })
    }
  }, [url])

  const validate = (value) => {
    try {
      const parsed = new URL(value)
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        return 'https:// または http:// で始まるURLを入力してください'
      }
      return ''
    } catch {
      return '有効なURLを入力してください（例: https://example.com）'
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const err = validate(url)
    if (err) { setError(err); return }
    const hostname = (() => { try { return new URL(url).hostname } catch { return url } })()
    const authorWallet = (showWallet && walletAddress.trim())
      ? { [walletCoin]: walletAddress.trim() }
      : null
    onSubmit(url.trim(), title.trim() || hostname, category, authorWallet)
  }

  const categoryColors = {
    Tools: 'border-sky-500 bg-sky-600 text-white',
    News:  'border-rose-500 bg-rose-600 text-white',
    Maps:  'border-emerald-500 bg-emerald-600 text-white',
    Games: 'border-violet-500 bg-violet-600 text-white',
    Idea:  'border-amber-500 bg-amber-600 text-white',
  }
  const inactiveClass = 'border-white/10 bg-white/5 text-white/50 hover:bg-white/10'

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md
        flex items-end sm:items-center justify-center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0,  opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
        className="w-full sm:max-w-md
          bg-gray-900/95 backdrop-blur-2xl
          border border-white/10
          rounded-t-3xl sm:rounded-3xl
          p-6 shadow-2xl"
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl glass flex items-center justify-center">
              <Globe size={17} className="text-sky-400" />
            </div>
            <h2 className="text-white font-bold text-lg">URLを投稿</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full
              bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X size={15} className="text-white/70" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* URL入力 */}
          <div>
            <label className="text-white/55 text-xs font-medium mb-1.5 block uppercase tracking-wider">
              URL <span className="text-rose-400 normal-case tracking-normal">*</span>
            </label>
            <div className="relative">
              <Link2 size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
              <input
                type="text"
                value={url}
                onChange={(e) => { setUrl(e.target.value); setError('') }}
                placeholder="https://example.com"
                autoComplete="url"
                className="w-full glass text-white rounded-xl pl-9 pr-4 py-3 text-sm
                  placeholder-white/20 outline-none
                  focus:border-sky-500/60 focus:bg-white/10 transition-all"
              />
            </div>
            {error && (
              <p className="text-rose-400 text-xs mt-1.5">{error}</p>
            )}
          </div>

          {/* URL プレビュー（ホスト名 + ファビコン） */}
          <AnimatePresence>
            {urlMeta.hostname && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.22 }}
                className="overflow-hidden"
              >
                <div className="glass rounded-2xl px-4 py-3 border border-white/8
                  flex items-center gap-3">
                  <img
                    src={urlMeta.favicon}
                    alt=""
                    className="w-7 h-7 rounded-lg flex-shrink-0 bg-white/10"
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                  />
                  <span className="flex-1 text-white/55 text-sm font-mono truncate">
                    {urlMeta.hostname}
                  </span>
                  {!title && (
                    <button
                      type="button"
                      onClick={() => setTitle(urlMeta.hostname)}
                      className="text-sky-400 text-xs font-semibold
                        hover:text-sky-300 transition-colors flex-shrink-0"
                    >
                      タイトルに使う
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* タイトル */}
          <div>
            <label className="text-white/55 text-xs font-medium mb-1.5 block uppercase tracking-wider">
              タイトル <span className="text-white/25 normal-case tracking-normal font-normal">（省略可）</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="わかりやすい名前（省略時はドメイン名）"
              maxLength={60}
              className="w-full glass text-white rounded-xl px-4 py-3 text-sm
                placeholder-white/20 outline-none
                focus:border-sky-500/60 focus:bg-white/10 transition-all"
            />
          </div>

          {/* カテゴリ選択 */}
          <div>
            <label className="text-white/55 text-xs font-medium mb-2 block uppercase tracking-wider">
              カテゴリ
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold
                    border transition-all duration-150
                    ${category === cat ? categoryColors[cat] : inactiveClass}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* 投げ銭受け取り設定（任意） */}
          <div>
            <button
              type="button"
              onClick={() => setShowWallet((v) => !v)}
              className="flex items-center gap-2 text-white/40 hover:text-white/70
                text-xs font-medium transition-colors"
            >
              {showWallet ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              投げ銭を受け取る（任意）
            </button>
            <AnimatePresence>
              {showWallet && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 space-y-2">
                    {/* コイン選択 */}
                    <div className="flex gap-2">
                      {WALLET_COINS.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setWalletCoin(c)}
                          className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all
                            ${walletCoin === c
                              ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                              : 'glass border-white/10 text-white/35 hover:text-white/60'}`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                    {/* アドレス入力 */}
                    <input
                      type="text"
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      placeholder={`${walletCoin} ウォレットアドレス`}
                      className="w-full glass text-white/80 rounded-xl px-4 py-2.5 text-xs font-mono
                        placeholder-white/20 outline-none
                        focus:border-amber-500/40 focus:bg-white/10 transition-all"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 注意書き */}
          <div className="glass rounded-xl px-3.5 py-2.5 border border-white/5">
            <p className="text-white/25 text-xs leading-relaxed">
              ※ セキュリティポリシー（X-Frame-Options / CSP）により
              一部のサイトはiframe表示できません。その場合はエラー画面から外部で開けます。
            </p>
          </div>

          {/* ボタン */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl border border-white/10 text-white/55
                hover:bg-white/5 transition-colors text-sm font-medium"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-2xl bg-sky-600 hover:bg-sky-500
                active:scale-95 text-white transition-all text-sm font-bold
                shadow-lg shadow-sky-900/40"
            >
              投稿する
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
