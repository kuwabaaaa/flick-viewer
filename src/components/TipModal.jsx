import { useState } from 'react'
import { X, Copy, Check, Bitcoin, Heart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { PLATFORM_WALLETS, PLATFORM_NAME } from '../config/wallets'

// ── コインの定義 ───────────────────────────────────────────
const COINS = [
  {
    id:       'BTC',
    name:     'Bitcoin',
    symbol:   '₿',
    color:    'text-amber-400',
    activeBg: 'bg-amber-500/15 border-amber-500/40 shadow-amber-900/30',
  },
  {
    id:       'ETH',
    name:     'Ethereum',
    symbol:   'Ξ',
    color:    'text-sky-400',
    activeBg: 'bg-sky-500/15 border-sky-500/40 shadow-sky-900/30',
  },
  {
    id:       'SOL',
    name:     'Solana',
    symbol:   '◎',
    color:    'text-violet-400',
    activeBg: 'bg-violet-500/15 border-violet-500/40 shadow-violet-900/30',
  },
]

// ── コピーボタン ──────────────────────────────────────────
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="flex-shrink-0 w-9 h-9 glass rounded-xl flex items-center justify-center
        hover:bg-white/20 active:scale-90 transition-all duration-150"
      title="コピー"
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.div
            key="check"
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate:   0 }}
            exit={{    scale: 0, rotate:  15 }}
            transition={{ duration: 0.18 }}
          >
            <Check size={15} className="text-emerald-400" />
          </motion.div>
        ) : (
          <motion.div
            key="copy"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{    scale: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Copy size={15} className="text-white/50" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  )
}

// ── メインモーダル ─────────────────────────────────────────
/**
 * Props:
 *   onClose      : fn
 *   authorWallet : { BTC?: string, ETH?: string, SOL?: string } | null
 *                  サイト制作者のウォレット。存在する場合は受取人タブを表示。
 */
export default function TipModal({ onClose, authorWallet = null }) {
  const hasCreator = !!authorWallet && Object.keys(authorWallet).length > 0

  // 受取人: 'platform' | 'creator'
  const [recipient, setRecipient] = useState('platform')
  const [activeCoin, setActiveCoin] = useState('ETH')

  // 選択中の受取人が対応しているコインのみ表示
  const availableCoins = recipient === 'platform'
    ? COINS
    : COINS.filter((c) => authorWallet?.[c.id])

  // 受取人を切り替えたとき、対応コインが無い場合は最初の有効コインへリセット
  const handleSetRecipient = (r) => {
    setRecipient(r)
    const available = r === 'platform'
      ? COINS
      : COINS.filter((c) => authorWallet?.[c.id])
    if (available.length > 0 && !available.find((c) => c.id === activeCoin)) {
      setActiveCoin(available[0].id)
    }
  }

  const wallets = recipient === 'platform' ? PLATFORM_WALLETS : (authorWallet ?? {})
  const coin    = COINS.find((c) => c.id === activeCoin) ?? COINS[0]
  const address = wallets[activeCoin] ?? ''

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md
        flex items-end sm:items-center justify-center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.97 }}
        animate={{ y: 0,  opacity: 1, scale: 1    }}
        exit={{    y: 60, opacity: 0, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
        className="w-full sm:max-w-sm
          bg-gray-900/95 backdrop-blur-2xl
          border border-white/10
          rounded-t-3xl sm:rounded-3xl
          p-6 shadow-2xl shadow-black/70"
      >
        {/* ── ヘッダー ── */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl glass flex items-center justify-center">
              <Bitcoin size={18} className="text-amber-400" />
            </div>
            <div>
              <h2 className="text-white font-bold text-base leading-tight">
                Support with Crypto
              </h2>
              <p className="text-white/40 text-xs mt-0.5">
                暗号資産でサポートする
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full
              bg-white/10 hover:bg-white/20 transition-colors flex-shrink-0"
          >
            <X size={15} className="text-white/70" />
          </button>
        </div>

        {/* ── 受取人セレクター（制作者ウォレットがある場合のみ表示） ── */}
        {hasCreator && (
          <div className="flex gap-2 mb-4">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => handleSetRecipient('platform')}
              className={`flex-1 py-2.5 rounded-2xl text-sm font-semibold border
                transition-all duration-200
                ${recipient === 'platform'
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                  : 'glass border-white/10 text-white/40 hover:text-white/60'}`}
            >
              {PLATFORM_NAME}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => handleSetRecipient('creator')}
              className={`flex-1 py-2.5 rounded-2xl text-sm font-semibold border
                transition-all duration-200
                ${recipient === 'creator'
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                  : 'glass border-white/10 text-white/40 hover:text-white/60'}`}
            >
              制作者へ
            </motion.button>
          </div>
        )}

        {/* ── コインタブ ── */}
        <div className="flex gap-2 mb-5">
          {availableCoins.map((c) => {
            const isActive = activeCoin === c.id
            return (
              <motion.button
                key={c.id}
                onClick={() => setActiveCoin(c.id)}
                whileTap={{ scale: 0.94 }}
                className={`
                  flex-1 py-3 rounded-2xl border transition-all duration-200
                  flex flex-col items-center gap-1
                  ${isActive
                    ? `${c.activeBg} ${c.color} shadow-lg`
                    : 'glass text-white/35 border-white/10 hover:text-white/60'
                  }
                `}
              >
                <span className="text-xl font-bold leading-none">{c.symbol}</span>
                <span className="text-[10px] font-semibold leading-none">{c.name}</span>
              </motion.button>
            )
          })}
        </div>

        {/* ── ウォレットアドレスエリア ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${recipient}-${activeCoin}`}
            initial={{ opacity: 0, y: 8  }}
            animate={{ opacity: 1, y: 0  }}
            exit={{    opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-white/40 text-[10px] font-semibold uppercase tracking-widest mb-2">
              {recipient === 'creator' ? '制作者' : PLATFORM_NAME} — {coin.name} アドレス
            </p>

            {/* アドレス表示 + コピーボタン */}
            <div className="glass rounded-2xl p-3.5 flex items-center gap-3 border border-white/8">
              <div className={`text-lg font-bold flex-shrink-0 ${coin.color}`}>
                {coin.symbol}
              </div>
              <p className="flex-1 text-white/60 text-xs font-mono break-all leading-relaxed">
                {address}
              </p>
              <CopyButton text={address} />
            </div>

            {/* QRコード */}
            <div className="mt-3 flex justify-center">
              <div className="bg-white rounded-2xl p-3 shadow-lg shadow-black/40">
                <QRCodeSVG
                  value={address || ' '}
                  size={148}
                  bgColor="#ffffff"
                  fgColor="#111827"
                  level="M"
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── フッターメッセージ ── */}
        <div className="mt-5 flex items-center justify-center gap-2">
          <Heart size={12} className="text-rose-400/60 fill-rose-400/60 flex-shrink-0" />
          <p className="text-white/25 text-xs text-center leading-relaxed">
            {recipient === 'creator'
              ? 'サイト制作者を直接応援しよう'
              : 'プラットフォームの継続運営を支えます'}
          </p>
          <Heart size={12} className="text-rose-400/60 fill-rose-400/60 flex-shrink-0" />
        </div>
      </motion.div>
    </div>
  )
}
