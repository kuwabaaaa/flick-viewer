/**
 * カテゴリ定義
 */
export const CATEGORIES = ['All', 'Games', 'Tools', 'News', 'Maps', 'Idea']

/**
 * シードデータ（20サイト）
 *
 * 選定基準:
 *  - X-Frame-Options / CSP で iframe ブロックされにくいサイト
 *  - 初見でも楽しめるコンテンツ（ゲーム・ツール・インタラクティブ）
 *
 * thumbnail: picsum.photos の seed ベース画像（仮）
 *   本番環境では OGP スクレイパー or スクリーンショットサービスの URL に差し替えてください。
 *
 * Firebase/Supabase 移行例:
 *   const { data: sites } = await supabase.from('sites').select('*').order('likes', { ascending: false })
 */
export const sites = [

  // ── Games ───────────────────────────────────────────────────────
  {
    id: 'g1',
    title: '2048',
    url: 'https://play2048.co',
    description: '数字タイルをスライドして合計 2048 を目指すパズルゲーム。シンプルなのに止まらない。',
    category: 'Games',
    thumbnail: 'https://picsum.photos/seed/puzzle2048/640/360',
  },
  {
    id: 'g2',
    title: 'Lichess — チェス',
    url: 'https://lichess.org',
    description: '完全無料・オープンソースのチェスプラットフォーム。AI対戦から世界中のプレイヤーと対局できる。',
    category: 'Games',
    thumbnail: 'https://picsum.photos/seed/chessgame/640/360',
  },
  {
    id: 'g3',
    title: 'Slither.io',
    url: 'https://slither.io',
    description: '世界中のプレイヤーとリアルタイムで競うスネークゲーム。大きな蛇を倒して世界一を目指せ。',
    category: 'Games',
    thumbnail: 'https://picsum.photos/seed/snakegame/640/360',
  },
  {
    id: 'g4',
    title: 'Diep.io',
    url: 'https://diep.io',
    description: 'タンクを強化しながら戦う多人数対戦シューター。クラスアップで自分だけのビルドを構築。',
    category: 'Games',
    thumbnail: 'https://picsum.photos/seed/tankgame/640/360',
  },
  {
    id: 'g5',
    title: 'Agar.io',
    url: 'https://agar.io',
    description: '細胞を大きくして他プレイヤーを吸収するブラウザゲームの古典。世界中で人気の元祖 .io ゲーム。',
    category: 'Games',
    thumbnail: 'https://picsum.photos/seed/cellgame/640/360',
  },

  // ── News ────────────────────────────────────────────────────────
  {
    id: 'n1',
    title: 'Hacker News',
    url: 'https://news.ycombinator.com',
    description: 'Y Combinator 運営のテック系ニュースアグリゲーター。スタートアップ・AI・プログラミングの話題が集まる。',
    category: 'News',
    thumbnail: 'https://picsum.photos/seed/technews/640/360',
  },

  // ── Tools ───────────────────────────────────────────────────────
  {
    id: 't1',
    title: 'MDN Web Docs',
    url: 'https://developer.mozilla.org/ja/',
    description: 'Mozilla 運営のWeb技術リファレンス（日本語対応）。HTML/CSS/JavaScript の信頼できる一次情報。',
    category: 'Tools',
    thumbnail: 'https://picsum.photos/seed/webdocs/640/360',
  },
  {
    id: 't2',
    title: 'Can I Use',
    url: 'https://caniuse.com',
    description: 'CSS・JS API のブラウザ互換性を一覧チェック。フロントエンド開発に欠かせないリファレンス。',
    category: 'Tools',
    thumbnail: 'https://picsum.photos/seed/browser/640/360',
  },
  {
    id: 't3',
    title: 'RegExr',
    url: 'https://regexr.com',
    description: '正規表現をリアルタイムで学習・テスト・デバッグできるインタラクティブツール。',
    category: 'Tools',
    thumbnail: 'https://picsum.photos/seed/regex/640/360',
  },
  {
    id: 't4',
    title: 'GitHub Trending',
    url: 'https://github.com/trending',
    description: '今日・今週の GitHub トレンドリポジトリ一覧。最新のOSSトレンドを毎日チェックしよう。',
    category: 'Tools',
    thumbnail: 'https://picsum.photos/seed/github/640/360',
  },
  {
    id: 't5',
    title: 'Example Domain',
    url: 'https://example.com',
    description: 'IANA管理の公式サンプルページ。iframe 動作確認や開発テストに使用できるシンプルなHTML。',
    category: 'Tools',
    thumbnail: 'https://picsum.photos/seed/minimal/640/360',
  },

  // ── Maps ────────────────────────────────────────────────────────
  {
    id: 'm1',
    title: 'OpenStreetMap — 東京',
    url: 'https://www.openstreetmap.org/export/embed.html?bbox=139.6917%2C35.6895%2C139.7917%2C35.7395&layer=mapnik',
    description: 'オープンソース地図サービス（東京・渋谷〜新宿エリア）。誰でも編集可能なWikipedia版地図。',
    category: 'Maps',
    thumbnail: 'https://picsum.photos/seed/tokyo/640/360',
  },
  {
    id: 'm2',
    title: 'OpenStreetMap — 大阪',
    url: 'https://www.openstreetmap.org/export/embed.html?bbox=135.4%2C34.6%2C135.6%2C34.75&layer=mapnik',
    description: 'オープンソース地図サービス（大阪・梅田〜難波エリア）。',
    category: 'Maps',
    thumbnail: 'https://picsum.photos/seed/osaka/640/360',
  },
  {
    id: 'm3',
    title: 'OpenStreetMap — 京都',
    url: 'https://www.openstreetmap.org/export/embed.html?bbox=135.7%2C34.95%2C135.85%2C35.1&layer=mapnik',
    description: 'オープンソース地図サービス（京都・祇園〜嵐山エリア）。',
    category: 'Maps',
    thumbnail: 'https://picsum.photos/seed/kyoto/640/360',
  },
  {
    id: 'm4',
    title: 'OpenStreetMap — New York',
    url: 'https://www.openstreetmap.org/export/embed.html?bbox=-74.02%2C40.70%2C-73.93%2C40.78&layer=mapnik',
    description: 'オープンソース地図サービス（ニューヨーク・マンハッタンエリア）。',
    category: 'Maps',
    thumbnail: 'https://picsum.photos/seed/newyork/640/360',
  },

  // ── Games (追加) ────────────────────────────────────────────────
  {
    id: 'g6',
    title: 'WebGL 流体シミュレーション',
    url: 'https://paveldogreat.github.io/WebGL-Fluid-Simulation/',
    description: 'GPU加速のリアルタイム流体シミュレーション。タップやドラッグで美しい液体の流れを生み出そう。',
    category: 'Games',
    thumbnail: 'https://picsum.photos/seed/fluid/640/360',
  },
  {
    id: 'g7',
    title: 'Cookie Clicker',
    url: 'https://orteil.dashnet.org/cookieclicker/',
    description: 'クッキーをクリックして無限に増やすアイドルゲームの原点。ゲームデザインの名作として世界中で愛される。',
    category: 'Games',
    thumbnail: 'https://picsum.photos/seed/cookie/640/360',
  },
  {
    id: 'g8',
    title: 'Floppy Bird',
    url: 'https://nebez.github.io/floppybird/',
    description: '伝説のスマホゲームをブラウザで再現。シンプルな操作で奥深い難しさ。タップで鳥を操って障害物をよけよう。',
    category: 'Games',
    thumbnail: 'https://picsum.photos/seed/flappy/640/360',
  },

  // ── Tools (追加) ────────────────────────────────────────────────
  {
    id: 't6',
    title: 'Desmos グラフ計算機',
    url: 'https://www.desmos.com/calculator',
    description: '高機能グラフ描画計算機。関数の可視化、スライダーアニメーション、方程式求解まで無料で使える。',
    category: 'Tools',
    thumbnail: 'https://picsum.photos/seed/graph/640/360',
  },
  {
    id: 't7',
    title: 'Regex101',
    url: 'https://regex101.com',
    description: '正規表現をリアルタイムでテスト・デバッグ。Perl/Python/JS/PHP 対応、マッチ説明付きで学習にも最適。',
    category: 'Tools',
    thumbnail: 'https://picsum.photos/seed/regex101/640/360',
  },
  {
    id: 't8',
    title: 'CSS Gradient Generator',
    url: 'https://cssgradient.io',
    description: 'ビジュアルエディタでCSSグラデーションをリアルタイム生成。コードをそのままコピーしてプロジェクトに活用。',
    category: 'Tools',
    thumbnail: 'https://picsum.photos/seed/gradient/640/360',
  },
  {
    id: 't9',
    title: 'JSONLint',
    url: 'https://jsonlint.com',
    description: 'JSON文法チェック・フォーマッタ。不正なJSONの原因箇所を即特定。APIレスポンスのデバッグに最適。',
    category: 'Tools',
    thumbnail: 'https://picsum.photos/seed/json/640/360',
  },
  {
    id: 't10',
    title: 'Windy — 風の地図',
    url: 'https://embed.windy.com/embed2.html?lat=35.676&lon=139.650&zoom=5&level=surface&overlay=wind&product=ecmwf&menu=&message=true&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=km%2Fh&metricTemp=%C2%B0C&radarRange=-1',
    description: 'リアルタイムの気象データを美しく可視化。風向・気温・降水量など世界の天気をインタラクティブに観察できる。',
    category: 'Tools',
    thumbnail: 'https://picsum.photos/seed/wind/640/360',
  },
  {
    id: 't11',
    title: 'Keybr — タイピング練習',
    url: 'https://www.keybr.com',
    description: 'AIが苦手キーを分析して最適な練習文を生成するタイピングトレーナー。毎日続けてタイピングを上達させよう。',
    category: 'Tools',
    thumbnail: 'https://picsum.photos/seed/typing/640/360',
  },
  {
    id: 't12',
    title: 'TradingView — BTC/USD',
    url: 'https://www.tradingview.com/chart/?symbol=BINANCE%3ABTCUSDT',
    description: 'ビットコイン/ドルのリアルタイムチャート。プロ仕様のテクニカル分析ツールで仮想通貨相場を把握しよう。',
    category: 'Tools',
    thumbnail: 'https://picsum.photos/seed/crypto/640/360',
  },

  // ── News (追加) ─────────────────────────────────────────────────
  {
    id: 'n2',
    title: 'Dev.to',
    url: 'https://dev.to',
    description: '世界中の開発者がプログラミング・技術・キャリアについて書くコミュニティブログ。実践的な知見が日々集まる。',
    category: 'News',
    thumbnail: 'https://picsum.photos/seed/devto/640/360',
  },
  {
    id: 'n3',
    title: 'Lobste.rs',
    url: 'https://lobste.rs',
    description: 'コンピューターサイエンス・プログラミング特化の招待制リンク共有コミュニティ。高品質な技術記事が揃う。',
    category: 'News',
    thumbnail: 'https://picsum.photos/seed/lobsters/640/360',
  },

  // ── Maps (追加) ─────────────────────────────────────────────────
  {
    id: 'm5',
    title: 'OpenStreetMap — Paris',
    url: 'https://www.openstreetmap.org/export/embed.html?bbox=2.29%2C48.83%2C2.42%2C48.90&layer=mapnik',
    description: 'オープンソース地図（パリ・エッフェル塔〜ルーヴル美術館エリア）。旅行前の下調べにも。',
    category: 'Maps',
    thumbnail: 'https://picsum.photos/seed/paris/640/360',
  },
  {
    id: 'm6',
    title: 'OpenStreetMap — London',
    url: 'https://www.openstreetmap.org/export/embed.html?bbox=-0.18%2C51.47%2C-0.06%2C51.53&layer=mapnik',
    description: 'オープンソース地図（ロンドン・ウェストミンスター〜シティエリア）。テムズ川沿いの名所を探索。',
    category: 'Maps',
    thumbnail: 'https://picsum.photos/seed/london/640/360',
  },
  {
    id: 'm7',
    title: 'OpenStreetMap — Sydney',
    url: 'https://www.openstreetmap.org/export/embed.html?bbox=151.18%2C-33.89%2C151.24%2C-33.85&layer=mapnik',
    description: 'オープンソース地図（シドニー・オペラハウス〜ハーバーブリッジエリア）。南半球最大の都市を俯瞰。',
    category: 'Maps',
    thumbnail: 'https://picsum.photos/seed/sydney/640/360',
  },

  // ── Idea ────────────────────────────────────────────────────────
  {
    id: 'i1',
    title: 'Wikipedia — 東京',
    url: 'https://ja.m.wikipedia.org/wiki/%E6%9D%B1%E4%BA%AC',
    description: 'ウィキペディア モバイル版 — 東京の記事。歴史・文化・地理を網羅した百科事典。',
    category: 'Idea',
    thumbnail: 'https://picsum.photos/seed/library/640/360',
  },
  {
    id: 'i2',
    title: 'Neal.fun — Deep Sea',
    url: 'https://neal.fun/deep-sea/',
    description: '海の深さをスクロールで体験する没入型ビジュアライゼーション。深海生物との出会いに驚く。',
    category: 'Idea',
    thumbnail: 'https://picsum.photos/seed/deepsea/640/360',
  },
  {
    id: 'i3',
    title: 'Neal.fun — Space Elevator',
    url: 'https://neal.fun/space-elevator/',
    description: '宇宙エレベーターで高度を上げながら宇宙の広さを体感。大気圏・静止軌道・月まで旅しよう。',
    category: 'Idea',
    thumbnail: 'https://picsum.photos/seed/space/640/360',
  },
  {
    id: 'i4',
    title: 'XKCD',
    url: 'https://xkcd.com',
    description: '数学・サイエンス・テクノロジーをテーマにした4コマ漫画。ギーク心をくすぐる知性派ユーモア。',
    category: 'Idea',
    thumbnail: 'https://picsum.photos/seed/comics/640/360',
  },
  {
    id: 'i5',
    title: "Conway's Game of Life",
    url: 'https://oimo.io/works/life/',
    description: 'セル・オートマトンの古典「ライフゲーム」をブラウザで体験。シンプルなルールから生まれる複雑な生命。',
    category: 'Idea',
    thumbnail: 'https://picsum.photos/seed/cellular/640/360',
  },

  // ── Idea (追加) ─────────────────────────────────────────────────
  {
    id: 'i6',
    title: 'Neal.fun — Spend',
    url: 'https://neal.fun/spend/',
    description: '億万長者のお金の使い道を体験。ジェフ・ベゾスの財産を好き放題使ってみよう。お金の規模感が変わる体験。',
    category: 'Idea',
    thumbnail: 'https://picsum.photos/seed/money/640/360',
  },
  {
    id: 'i7',
    title: 'Neal.fun — The Size of Space',
    url: 'https://neal.fun/the-size-of-space/',
    description: '宇宙の大きさをスクロールで実感。プランク長から観測可能な宇宙まで、桁外れな規模感を体験できる。',
    category: 'Idea',
    thumbnail: 'https://picsum.photos/seed/cosmos/640/360',
  },
  {
    id: 'i8',
    title: 'Neal.fun — Prime Clicker',
    url: 'https://neal.fun/prime-clicker/',
    description: '素数を集めていくクリッカーゲーム。数学の美しさと哲学的な奥深さを感じるアイドルゲーム体験。',
    category: 'Idea',
    thumbnail: 'https://picsum.photos/seed/prime/640/360',
  },
  {
    id: 'i9',
    title: 'Weavesilk — シルクアート',
    url: 'https://weavesilk.com',
    description: 'マウス/指の動きが美しい光の軌跡になる生成アートアプリ。癒やし系インタラクティブ体験。シェアして映える作品を。',
    category: 'Idea',
    thumbnail: 'https://picsum.photos/seed/silk/640/360',
  },
  {
    id: 'i10',
    title: 'Jackson Pollock Paint',
    url: 'https://jacksonpollock.org',
    description: 'マウスを動かすだけで現代アートが完成。ジャクソン・ポロックのアクション・ペインティングをブラウザで体験。',
    category: 'Idea',
    thumbnail: 'https://picsum.photos/seed/paint/640/360',
  },
  {
    id: 'i11',
    title: 'Wikipedia — 人工知能',
    url: 'https://ja.m.wikipedia.org/wiki/%E4%BA%BA%E5%B7%A5%E7%9F%A5%E8%83%BD',
    description: 'ウィキペディア モバイル版 — 人工知能の記事。AI・機械学習・ディープラーニングの概要を日本語で学ぶ。',
    category: 'Idea',
    thumbnail: 'https://picsum.photos/seed/ai/640/360',
  },
  {
    id: 'i12',
    title: 'Wikipedia — 宇宙',
    url: 'https://ja.m.wikipedia.org/wiki/%E5%AE%87%E5%AE%99',
    description: 'ウィキペディア モバイル版 — 宇宙の記事。ビッグバンから現在まで、宇宙の構造と歴史を網羅した記事。',
    category: 'Idea',
    thumbnail: 'https://picsum.photos/seed/universe/640/360',
  },
  {
    id: 'i13',
    title: 'Wikipedia — 数学',
    url: 'https://ja.m.wikipedia.org/wiki/%E6%95%B0%E5%AD%A6',
    description: 'ウィキペディア モバイル版 — 数学の記事。人類の知的遺産、数学の歴史・各分野・応用を網羅。',
    category: 'Idea',
    thumbnail: 'https://picsum.photos/seed/math/640/360',
  },
  {
    id: 'i14',
    title: 'Wikipedia EN — Philosophy',
    url: 'https://en.m.wikipedia.org/wiki/Philosophy',
    description: 'Wikipedia (English) — Philosophy. A comprehensive overview of philosophical thought, logic, and ethics across history.',
    category: 'Idea',
    thumbnail: 'https://picsum.photos/seed/philosophy/640/360',
  },
  {
    id: 'i15',
    title: 'Wikipedia EN — Internet',
    url: 'https://en.m.wikipedia.org/wiki/Internet',
    description: 'Wikipedia (English) — The Internet. History and architecture of the global network that connects billions of people.',
    category: 'Idea',
    thumbnail: 'https://picsum.photos/seed/internet/640/360',
  },
]
