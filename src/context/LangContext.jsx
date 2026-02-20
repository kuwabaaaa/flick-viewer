import { createContext, useContext, useState } from 'react'

const STRINGS = {
  ja: {
    // FloatingPanel
    like: 'いいね', save: '保存', saved: '保存済',
    share: 'シェア', post: '投稿',
    tap: 'タップ', operating: '操作中',
    report: '報告', reported: '報告済', unreport: '報告済',
    // MyPage tabs
    myPage: 'マイページ', logout: 'ログアウト',
    profile: 'プロフィール', myPosts: '自分の投稿',
    favorites: 'お気に入り', settings: '設定',
    // MyPage content
    username: 'ユーザー名',
    walletAddress: 'ウォレットアドレス',
    walletNote: '自分の投稿サイトへの投げ銭受取に使用されます',
    displayNamePlaceholder: '表示名（未設定）',
    saveProfile: 'プロフィールを保存',
    saving: '保存中...', saveDone: '✓ 保存しました',
    postSites: '投稿サイト',
    noPostsYet: 'まだ投稿がありません',
    noPostsHint: '右パネルの「＋」から投稿できます',
    noFavYet: '保存済みサイトがありません',
    noFavHint: '右パネルの「🔖」で保存できます',
    tapToDelete: 'もう一度タップで削除します',
    loading: '読み込み中...',
    skip: 'スキップ',
    skipPct: 'スキップ',
    count: '件',
    selectedMark: '✓ 選択中',
    // Settings
    language: '言語',
    appearance: '表示',
    // Report modal
    reportTitle: '報告する理由を選択',
    reportSubmit: '報告する',
    reasonBroken: 'リンク切れ・表示されない',
    reasonInappropriate: '不適切なコンテンツ',
    reasonSpam: 'スパム・詐欺',
    reasonCopyright: '著作権違反',
    reasonOther: 'その他',
    // Help modal
    helpTitle: 'FlickView 使い方',
    helpSubtitle: 'スワイプしてサイトを探索しよう',
    helpStart: 'さあ、始めよう →',
    helpFooter: 'いつでも右上の ? ボタンで再表示できます',
    helpSwipeTitle: '上下スワイプ',
    helpSwipeDesc: '画面を上下にスワイプ、または ↑↓ キーで次々とサイトを切り替えましょう。',
    helpDblTapTitle: 'ダブルタップ',
    helpDblTapDesc: 'サイトを直接スクロール・クリックしたいときはダブルタップ。もう一度でスワイプに戻ります。',
    helpLikeTitle: 'いいね',
    helpLikeDesc: '気に入ったサイトにいいねして応援しましょう。',
    helpShareTitle: 'URLシェア',
    helpShareDesc: '現在表示中のサイトのURLをワンタップでクリップボードにコピーできます。',
    helpTipTitle: '投げ銭',
    helpTipDesc: 'BTC / ETH / SOL のウォレット QR コードを表示。スマホでスキャンして即送金できます。',
    helpPostTitle: 'URL を投稿',
    helpPostDesc: '面白いサイトを発見したらフィードに投稿しよう。カテゴリを付けてシェアできます。',
    // URL submit modal
    postUrl: 'URLを投稿',
    titleLabel: 'タイトル',
    titleOpt: '（省略可）',
    titlePlaceholder: 'わかりやすい名前（省略時はドメイン名）',
    useAsTitle: 'タイトルに使う',
    categoryLabel: 'カテゴリ',
    urlError1: 'https:// または http:// で始まるURLを入力してください',
    urlError2: '有効なURLを入力してください（例: https://example.com）',
    cancel: 'キャンセル',
    submitBtn: '投稿する',
    iframeNote: 'セキュリティポリシー（X-Frame-Options / CSP）により一部のサイトはiframe表示できません。その場合はエラー画面から外部で開けます。',
    // Toast messages
    favAdded: 'お気に入りに追加しました',
    favRemoved: 'お気に入りを解除しました',
    siteHidden: 'サイトを非表示にしました',
    reportedMsg: '報告しました。ありがとうございます',
    unreportedMsg: '報告を取り消しました',
    postedMsg: 'サイトを投稿しました！',
    postError: '投稿に失敗しました',
    copiedMsg: 'URLをコピーしました！',
    copyError: 'コピーに失敗しました',
    // App
    emptyFeed: '「%s」のサイトはまだありません',
    showAll: 'すべて表示',
    swipeHint: '↑↓ スワイプ / ダブルタップで操作モード',
  },
  en: {
    // FloatingPanel
    like: 'Like', save: 'Save', saved: 'Saved',
    share: 'Share', post: 'Post',
    tap: 'Tap', operating: 'Active',
    report: 'Report', reported: 'Done', unreport: 'Done',
    // MyPage tabs
    myPage: 'My Page', logout: 'Logout',
    profile: 'Profile', myPosts: 'My Posts',
    favorites: 'Favorites', settings: 'Settings',
    // MyPage content
    username: 'Username',
    walletAddress: 'Wallet Address',
    walletNote: 'Used for receiving tips on your posted sites',
    displayNamePlaceholder: 'Display name (optional)',
    saveProfile: 'Save Profile',
    saving: 'Saving...', saveDone: '✓ Saved',
    postSites: 'My Posts',
    noPostsYet: 'No posts yet',
    noPostsHint: 'Use "+" on the right panel to post',
    noFavYet: 'No saved sites yet',
    noFavHint: 'Use "🔖" on the right panel to save',
    tapToDelete: 'Tap again to delete',
    loading: 'Loading...',
    skip: 'Skip',
    skipPct: 'Skip',
    count: '',
    selectedMark: '✓ Active',
    // Settings
    language: 'Language',
    appearance: 'Display',
    // Report modal
    reportTitle: 'Select a reason to report',
    reportSubmit: 'Report',
    reasonBroken: 'Broken link / not loading',
    reasonInappropriate: 'Inappropriate content',
    reasonSpam: 'Spam / Scam',
    reasonCopyright: 'Copyright violation',
    reasonOther: 'Other',
    // Help modal
    helpTitle: 'How to Use FlickView',
    helpSubtitle: 'Swipe to explore sites',
    helpStart: "Let's get started →",
    helpFooter: 'Tap the ? button anytime to re-open this guide',
    helpSwipeTitle: 'Swipe Up/Down',
    helpSwipeDesc: 'Swipe up or down, or use ↑↓ keys to browse sites.',
    helpDblTapTitle: 'Double-tap',
    helpDblTapDesc: 'Double-tap to scroll and interact with the site. Double-tap again to return to swipe mode.',
    helpLikeTitle: 'Like',
    helpLikeDesc: 'Like sites you enjoy to show your support.',
    helpShareTitle: 'Share URL',
    helpShareDesc: 'Tap to copy the current site URL to clipboard instantly.',
    helpTipTitle: 'Tip',
    helpTipDesc: 'Shows wallet QR codes for BTC/ETH/SOL. Scan with your phone to send a tip.',
    helpPostTitle: 'Post a URL',
    helpPostDesc: 'Found an interesting site? Post it to the feed with a category.',
    // URL submit modal
    postUrl: 'Post a URL',
    titleLabel: 'Title',
    titleOpt: '(optional)',
    titlePlaceholder: 'Friendly name (uses domain if blank)',
    useAsTitle: 'Use as title',
    categoryLabel: 'Category',
    urlError1: 'URL must start with https:// or http://',
    urlError2: 'Enter a valid URL (e.g. https://example.com)',
    cancel: 'Cancel',
    submitBtn: 'Post',
    iframeNote: 'Some sites block iframe embedding (X-Frame-Options / CSP). You can open them externally from the error screen.',
    // Toast messages
    favAdded: 'Added to favorites',
    favRemoved: 'Removed from favorites',
    siteHidden: 'Site hidden',
    reportedMsg: 'Reported. Thank you!',
    unreportedMsg: 'Report cancelled',
    postedMsg: 'Site posted!',
    postError: 'Post failed',
    copiedMsg: 'URL copied!',
    copyError: 'Copy failed',
    // App
    emptyFeed: 'No sites in "%s" yet',
    showAll: 'Show all',
    swipeHint: '↑↓ Swipe / Double-tap for interactive mode',
  },
}

const LangContext = createContext({
  lang: 'ja',
  setLang: () => {},
  t: (k) => k,
})

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(
    () => localStorage.getItem('flickview_lang') || 'ja',
  )

  const setLang = (l) => {
    localStorage.setItem('flickview_lang', l)
    setLangState(l)
  }

  const t = (key) => STRINGS[lang]?.[key] ?? STRINGS.ja[key] ?? key

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)
