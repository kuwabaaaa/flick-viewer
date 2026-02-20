/**
 * Supabase データ操作レイヤー
 * Supabase が未設定の場合は空配列・null を返してグレースフルにデグレードします。
 */
import { supabase, isSupabaseConfigured } from '../lib/supabase'

// ─────────────────────────────────────────────────────────────────
// サイト一覧（ユーザー投稿 + スコアフィールド）
// ─────────────────────────────────────────────────────────────────
export async function fetchUserSites() {
  if (!isSupabaseConfigured) return []
  const { data } = await supabase
    .from('sites')
    .select('*, author:author_id(username, avatar_url)')
    .order('created_at', { ascending: false })
  return data ?? []
}

// ─────────────────────────────────────────────────────────────────
// サイト投稿
// ─────────────────────────────────────────────────────────────────
export async function saveSiteToSupabase({ url, title, category, description = '', authorWallet = null, authorId }) {
  if (!isSupabaseConfigured) throw new Error('Supabase が設定されていません')
  const { data, error } = await supabase
    .from('sites')
    .insert({ url, title, category, description, author_wallet: authorWallet, author_id: authorId })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

// ─────────────────────────────────────────────────────────────────
// サイト編集 / 削除
// ─────────────────────────────────────────────────────────────────
export async function updateSite(siteId, updates) {
  if (!isSupabaseConfigured) return null
  const { data, error } = await supabase
    .from('sites').update(updates).eq('id', siteId).select().single()
  if (error) throw new Error(error.message)
  return data
}

export async function deleteSite(siteId) {
  if (!isSupabaseConfigured) return
  const { error } = await supabase.from('sites').delete().eq('id', siteId)
  if (error) throw new Error(error.message)
}

// ─────────────────────────────────────────────────────────────────
// いいね（トグル）
// ─────────────────────────────────────────────────────────────────
export async function toggleLike(userId, siteId) {
  if (!isSupabaseConfigured) return false
  const { data: existing } = await supabase
    .from('likes').select('user_id').eq('user_id', userId).eq('site_id', siteId).single()

  if (existing) {
    await supabase.from('likes').delete().eq('user_id', userId).eq('site_id', siteId)
    await supabase.rpc('decrement_likes', { p_site_id: siteId })
    return false
  } else {
    await supabase.from('likes').insert({ user_id: userId, site_id: siteId })
    await supabase.rpc('increment_likes', { p_site_id: siteId })
    return true
  }
}

// ─────────────────────────────────────────────────────────────────
// お気に入り（トグル）
// ─────────────────────────────────────────────────────────────────
export async function toggleFavorite(userId, siteId) {
  if (!isSupabaseConfigured) return false
  const { data: existing } = await supabase
    .from('favorites').select('user_id').eq('user_id', userId).eq('site_id', siteId).single()

  if (existing) {
    await supabase.from('favorites').delete().eq('user_id', userId).eq('site_id', siteId)
    return false
  } else {
    await supabase.from('favorites').insert({ user_id: userId, site_id: siteId })
    return true
  }
}

// ─────────────────────────────────────────────────────────────────
// ユーザーのいいね / お気に入りサイトID取得
// ─────────────────────────────────────────────────────────────────
export async function getUserLikedIds(userId) {
  if (!isSupabaseConfigured) return []
  const { data } = await supabase.from('likes').select('site_id').eq('user_id', userId)
  return data?.map((r) => r.site_id) ?? []
}

export async function getUserFavoriteIds(userId) {
  if (!isSupabaseConfigured) return []
  const { data } = await supabase.from('favorites').select('site_id').eq('user_id', userId)
  return data?.map((r) => r.site_id) ?? []
}

// ─────────────────────────────────────────────────────────────────
// ユーザーの投稿サイト取得
// ─────────────────────────────────────────────────────────────────
export async function getAuthorSites(userId) {
  if (!isSupabaseConfigured) return []
  const { data } = await supabase
    .from('sites').select('*').eq('author_id', userId).order('created_at', { ascending: false })
  return data ?? []
}

// ─────────────────────────────────────────────────────────────────
// お気に入りサイト取得
// ─────────────────────────────────────────────────────────────────
export async function getFavoriteSites(userId) {
  if (!isSupabaseConfigured) return []
  const { data } = await supabase
    .from('favorites').select('site:site_id(*)').eq('user_id', userId).order('created_at', { ascending: false })
  return data?.map((r) => r.site).filter(Boolean) ?? []
}

// ─────────────────────────────────────────────────────────────────
// 閲覧アナリティクス記録
// ─────────────────────────────────────────────────────────────────
export async function recordView(siteId, userId, watchSeconds, skipped) {
  if (!isSupabaseConfigured || !siteId) return
  await supabase.from('site_analytics').insert({
    site_id: siteId, user_id: userId ?? null, watch_seconds: watchSeconds, skipped,
  })
  if (skipped) await supabase.rpc('increment_skips', { p_site_id: siteId })
  else if (watchSeconds >= 2) await supabase.rpc('increment_views', { p_site_id: siteId })
}
