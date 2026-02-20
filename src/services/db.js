/**
 * src/services/db.js — データ永続化レイヤー
 *
 * 現在は localStorage をバックエンドとして使用。
 * Supabase / Firebase に移行する場合は、この関数の実装だけを差し替えてください。
 * 呼び出し元（App.jsx）は変更不要です。
 *
 * Supabase 移行例:
 *   export async function getSites() {
 *     const { data } = await supabase.from('sites').select('*').order('created_at', { ascending: false })
 *     return data ?? []
 *   }
 *   export async function saveSite(site) {
 *     const { data, error } = await supabase.from('sites').insert(site).select().single()
 *     if (error) throw new Error(error.message)
 *     return data
 *   }
 */

const STORAGE_KEY  = 'flickview_sites_v1'
const HIDDEN_KEY   = 'flickview_hidden_v1'
const REPORTS_KEY  = 'flickview_reports_v1'

const REPORT_THRESHOLD = 3 // この回数報告されたら自動非表示

// ─────────────────────────────────────────────────────────
// getSites — 保存済みサイト一覧を取得（新しい順）
// ─────────────────────────────────────────────────────────
export async function getSites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

// ─────────────────────────────────────────────────────────
// saveSite — サイトを保存
// - 同一 URL の重複投稿をチェック
// - id, isUserSubmitted, createdAt を自動付与
// ─────────────────────────────────────────────────────────
export async function saveSite({ url, title, category, description = '', authorWallet = null }) {
  const existing = await getSites()

  if (existing.some((s) => s.url === url)) {
    throw new Error('このURLはすでに登録されています')
  }

  const newSite = {
    id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    url,
    title,
    category,
    description,
    authorWallet,
    isUserSubmitted: true,
    createdAt: new Date().toISOString(),
  }

  const updated = [newSite, ...existing]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  return newSite
}

// ─────────────────────────────────────────────────────────
// removeSite — IDでサイトを削除（将来の管理画面用）
// ─────────────────────────────────────────────────────────
export async function removeSite(id) {
  const existing = await getSites()
  const updated = existing.filter((s) => s.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

// ─────────────────────────────────────────────────────────
// clearAllUserSites — ユーザー投稿を全削除（デバッグ用）
// ─────────────────────────────────────────────────────────
export async function clearAllUserSites() {
  localStorage.removeItem(STORAGE_KEY)
}

// ─────────────────────────────────────────────────────────
// getHiddenSiteIds — 非表示サイトIDリストを取得
// ─────────────────────────────────────────────────────────
export async function getHiddenSiteIds() {
  try {
    return JSON.parse(localStorage.getItem(HIDDEN_KEY) ?? '[]')
  } catch {
    return []
  }
}

// ─────────────────────────────────────────────────────────
// hideSite — サイトを非表示リストに追加
// ─────────────────────────────────────────────────────────
export async function hideSite(id) {
  const hidden = await getHiddenSiteIds()
  if (!hidden.includes(id)) {
    localStorage.setItem(HIDDEN_KEY, JSON.stringify([...hidden, id]))
  }
}

// ─────────────────────────────────────────────────────────
// reportSite — サイトを報告。REPORT_THRESHOLD 件で自動非表示
// 戻り値: true = 自動非表示になった, false = カウントアップのみ
// ─────────────────────────────────────────────────────────
export async function reportSite(id) {
  let reports = {}
  try {
    reports = JSON.parse(localStorage.getItem(REPORTS_KEY) ?? '{}')
  } catch {}

  reports[id] = (reports[id] ?? 0) + 1
  localStorage.setItem(REPORTS_KEY, JSON.stringify(reports))

  if (reports[id] >= REPORT_THRESHOLD) {
    await hideSite(id)
    return true
  }
  return false
}

// ─────────────────────────────────────────────────────────
// getReportCount — サイトの報告数を取得
// ─────────────────────────────────────────────────────────
export function getReportCount(id) {
  try {
    const reports = JSON.parse(localStorage.getItem(REPORTS_KEY) ?? '{}')
    return reports[id] ?? 0
  } catch {
    return 0
  }
}
