-- ===================================================================
-- FlickView — Supabase スキーマ
-- Supabase SQL Editor に貼り付けて実行してください
-- ===================================================================

-- ── テーブル ────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username    TEXT,
  avatar_url  TEXT,
  btc_wallet  TEXT,
  eth_wallet  TEXT,
  sol_wallet  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sites (
  id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  url           TEXT NOT NULL UNIQUE,
  title         TEXT NOT NULL,
  category      TEXT NOT NULL DEFAULT 'Tools',
  description   TEXT DEFAULT '',
  thumbnail     TEXT,
  author_id     UUID REFERENCES profiles(id) ON DELETE SET NULL,
  author_wallet JSONB,
  likes_count   INTEGER DEFAULT 0,
  view_count    INTEGER DEFAULT 0,
  skip_count    INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS likes (
  user_id    UUID REFERENCES auth.users ON DELETE CASCADE,
  site_id    TEXT REFERENCES sites(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, site_id)
);

CREATE TABLE IF NOT EXISTS favorites (
  user_id    UUID REFERENCES auth.users ON DELETE CASCADE,
  site_id    TEXT REFERENCES sites(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, site_id)
);

CREATE TABLE IF NOT EXISTS site_analytics (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id       TEXT REFERENCES sites(id) ON DELETE CASCADE,
  user_id       UUID REFERENCES auth.users ON DELETE SET NULL,
  watch_seconds INTEGER DEFAULT 0,
  skipped       BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── RLS の有効化 ────────────────────────────────────────────────

ALTER TABLE profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites          ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes          ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites      ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_analytics ENABLE ROW LEVEL SECURITY;

-- ── ポリシー: profiles ──────────────────────────────────────────

CREATE POLICY "profiles_public_read"  ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_owner_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_owner_update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- ── ポリシー: sites ─────────────────────────────────────────────

CREATE POLICY "sites_public_read"    ON sites FOR SELECT USING (true);
CREATE POLICY "sites_auth_insert"    ON sites FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "sites_owner_update"   ON sites FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "sites_owner_delete"   ON sites FOR DELETE USING (auth.uid() = author_id);

-- ── ポリシー: likes ─────────────────────────────────────────────

CREATE POLICY "likes_public_read"  ON likes FOR SELECT USING (true);
CREATE POLICY "likes_auth_insert"  ON likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "likes_own_delete"   ON likes FOR DELETE USING (auth.uid() = user_id);

-- ── ポリシー: favorites ─────────────────────────────────────────

CREATE POLICY "favorites_own_read"   ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "favorites_own_insert" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "favorites_own_delete" ON favorites FOR DELETE USING (auth.uid() = user_id);

-- ── ポリシー: site_analytics ────────────────────────────────────

CREATE POLICY "analytics_public_insert" ON site_analytics FOR INSERT WITH CHECK (true);
CREATE POLICY "analytics_public_read"   ON site_analytics FOR SELECT USING (true);

-- ── RPC 関数（アトミックなカウンター操作） ──────────────────────

CREATE OR REPLACE FUNCTION increment_likes(p_site_id TEXT)
RETURNS void LANGUAGE sql SECURITY DEFINER AS $$
  UPDATE sites SET likes_count = likes_count + 1 WHERE id = p_site_id;
$$;

CREATE OR REPLACE FUNCTION decrement_likes(p_site_id TEXT)
RETURNS void LANGUAGE sql SECURITY DEFINER AS $$
  UPDATE sites SET likes_count = GREATEST(0, likes_count - 1) WHERE id = p_site_id;
$$;

CREATE OR REPLACE FUNCTION increment_views(p_site_id TEXT)
RETURNS void LANGUAGE sql SECURITY DEFINER AS $$
  UPDATE sites SET view_count = view_count + 1 WHERE id = p_site_id;
$$;

CREATE OR REPLACE FUNCTION increment_skips(p_site_id TEXT)
RETURNS void LANGUAGE sql SECURITY DEFINER AS $$
  UPDATE sites SET skip_count = skip_count + 1 WHERE id = p_site_id;
$$;

-- ── トリガー: 新規ユーザー登録時にプロフィールを自動作成 ────────

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id) VALUES (NEW.id) ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();
