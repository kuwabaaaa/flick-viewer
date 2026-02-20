import { createContext, useContext, useState } from 'react'

const STRINGS = {
  ja: {
    // FloatingPanel
    like: 'いいね', save: '保存', saved: '保存済',
    share: 'シェア', post: '投稿',
    tap: 'タップ', operating: '操作中',
    report: '報告', reported: '報告済', unreport: '報告済',
    // MyPage
    myPage: 'マイページ', logout: 'ログアウト',
    profile: 'プロフィール', myPosts: '自分の投稿',
    favorites: 'お気に入り', settings: '設定',
    username: 'ユーザー名',
    walletAddress: 'ウォレットアドレス',
    saveProfile: 'プロフィールを保存',
    saving: '保存中...', saveDone: '✓ 保存しました',
    noPostsYet: 'まだ投稿がありません',
    noPostsHint: '右パネルの「＋」から投稿できます',
    noFavYet: '保存済みサイトがありません',
    noFavHint: '右パネルの「🔖」で保存できます',
    tapToDelete: 'もう一度タップで削除します',
    loading: '読み込み中...',
    skip: 'スキップ',
    count: '件',
    // Settings
    language: '言語',
    appearance: '表示',
    // hint
    swipeHint: '↑↓ スワイプ / ダブルタップで操作モード',
  },
  en: {
    // FloatingPanel
    like: 'Like', save: 'Save', saved: 'Saved',
    share: 'Share', post: 'Post',
    tap: 'Tap', operating: 'Active',
    report: 'Report', reported: 'Done', unreport: 'Done',
    // MyPage
    myPage: 'My Page', logout: 'Logout',
    profile: 'Profile', myPosts: 'My Posts',
    favorites: 'Favorites', settings: 'Settings',
    username: 'Username',
    walletAddress: 'Wallet Address',
    saveProfile: 'Save Profile',
    saving: 'Saving...', saveDone: '✓ Saved',
    noPostsYet: 'No posts yet',
    noPostsHint: 'Use "+" on the right panel to post',
    noFavYet: 'No saved sites yet',
    noFavHint: 'Use "🔖" on the right panel to save',
    tapToDelete: 'Tap again to delete',
    loading: 'Loading...',
    skip: 'Skip',
    count: '',
    // Settings
    language: 'Language',
    appearance: 'Display',
    // hint
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
