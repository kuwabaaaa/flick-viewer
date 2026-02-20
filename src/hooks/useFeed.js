/**
 * スマートフィード — カテゴリ嗜好学習 + スコアベース並び替え
 *
 * Score = (likes_count × 2) + watch_bonus + recency_bonus + category_bonus − skip_penalty
 */

const PREFS_KEY = 'flickview_category_prefs_v1'

// ── カテゴリ嗜好の読み書き ────────────────────────────────────
export function getCategoryPrefs() {
  try { return JSON.parse(localStorage.getItem(PREFS_KEY) ?? '{}') }
  catch { return {} }
}

export function recordCategoryWatch(category, seconds) {
  if (!category || seconds < 3) return
  const prefs = getCategoryPrefs()
  prefs[category] = (prefs[category] ?? 0) + seconds
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs))
}

// ── 個別スコア計算 ───────────────────────────────────────────
function calcScore(site, prefs) {
  const msPerDay     = 86_400_000
  const daysSince    = (Date.now() - new Date(site.created_at ?? 0).getTime()) / msPerDay
  const recency      = Math.max(0, 10 - daysSince)
  const watchBonus   = Math.min(20, ((site.avg_watch_seconds ?? 0) / 5))
  // log1p でロングテール: 5秒 ≒ 1.8pt、60秒 ≒ 12.7pt
  const catBonus     = Math.log1p(prefs[site.category] ?? 0) * 3
  const skipPenalty  = (site.skip_count ?? 0) * 1.5

  return (site.likes_count ?? 0) * 2 + watchBonus + recency + catBonus - skipPenalty
}

/**
 * スコアに基づいてフィードを並び替え
 * shuffle=true のとき ±2pt のランダムノイズを加算（単調化を防ぐ）
 */
export function buildScoredFeed(sites, prefs = {}, shuffle = true) {
  return [...sites]
    .map((s) => ({ ...s, _score: calcScore(s, prefs) + (shuffle ? (Math.random() - 0.5) * 4 : 0) }))
    .sort((a, b) => b._score - a._score)
}

// ── 閲覧時間トラッキング用ユーティリティ ────────────────────
let _watchStart = null
let _watchSite  = null

export function startWatch(site) {
  _watchStart = Date.now()
  _watchSite  = site
}

export function endWatch(skipped = false) {
  if (!_watchStart || !_watchSite) return null
  const seconds = Math.round((Date.now() - _watchStart) / 1000)
  const site    = _watchSite
  _watchStart   = null
  _watchSite    = null
  return { site, seconds, skipped }
}
