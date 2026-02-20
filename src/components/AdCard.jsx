/**
 * 広告カード（5サイトごとに挿入）
 *
 * Google AdSense 設定手順:
 *  1. https://adsense.google.com で承認を取得
 *  2. index.html <head> に adsbygoogle.js を追加
 *  3. 下記コメントアウト部分を実際のスニペットに差し替え
 */
export default function AdCard({ adId }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-black flex flex-col items-center justify-center">

      {/* 背景グラデーション */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]" />

      {/* 背景装飾ブラー */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-56 h-56 rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      {/* 広告ラベル */}
      <div className="absolute top-4 left-4 z-10">
        <span className="glass text-white/40 text-[10px] font-medium px-2.5 py-1 rounded-full border border-white/10">
          広告
        </span>
      </div>

      {/* AdSense スロット */}
      <div className="relative z-10 w-full max-w-sm px-6">

        {/* ──── Google AdSense コードをここに貼り付ける ────
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot="XXXXXXXXXX"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
        ──────────────────────────────────────────────── */}

        {/* AdSense 未設定時のプレースホルダー */}
        <div className="
          glass rounded-3xl px-8 py-10
          flex flex-col items-center gap-5
          shadow-2xl shadow-black/50
        ">
          {/* アイコン */}
          <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10
            flex items-center justify-center">
            <span className="text-white/25 text-4xl font-black tracking-tighter">Ad</span>
          </div>

          <div className="text-center space-y-1.5">
            <p className="text-white/50 text-base font-semibold">Google AdSense</p>
            <p className="text-white/25 text-xs">広告スロット #{adId}</p>
          </div>

          <p className="text-white/20 text-xs text-center leading-relaxed max-w-[200px]">
            <code className="font-mono">AdCard.jsx</code> のコメント部分に
            承認済みの AdSense コードを貼り付けてください
          </p>
        </div>
      </div>

      {/* 下部情報 */}
      <div className="absolute bottom-0 left-0 right-16 z-10 pointer-events-none
        bg-gradient-to-t from-black/80 to-transparent pt-16 pb-8 px-5">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full
          text-[10px] font-semibold border bg-amber-500/15 text-amber-300 border-amber-500/20 mb-2">
          スポンサード
        </span>
        <p className="text-white/50 text-sm font-medium">広告スペース</p>
      </div>
    </div>
  )
}
