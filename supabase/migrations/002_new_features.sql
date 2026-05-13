-- ============================================================
-- 002_new_features: favorites, news_items, prompts, tool_views
-- ============================================================

-- Favorites (user ↔ tool many-to-many)
CREATE TABLE IF NOT EXISTS favorites (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_id      UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, tool_id)
);
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users select own favorites"   ON favorites FOR SELECT  USING (auth.uid() = user_id);
CREATE POLICY "Users insert own favorites"   ON favorites FOR INSERT  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own favorites"   ON favorites FOR DELETE  USING (auth.uid() = user_id);

-- News items (AI haber akışı)
CREATE TABLE IF NOT EXISTS news_items (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title        TEXT NOT NULL,
  description  TEXT,
  url          TEXT NOT NULL UNIQUE,
  source       TEXT NOT NULL,
  image_url    TEXT,
  published_at TIMESTAMPTZ,
  category     TEXT DEFAULT 'ai',
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE news_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads news"    ON news_items FOR SELECT USING (true);
CREATE POLICY "Service inserts news" ON news_items FOR INSERT WITH CHECK (true);

-- Prompts (araç başına kullanıcı promptları)
CREATE TABLE IF NOT EXISTS prompts (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tool_id      UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  content      TEXT NOT NULL,
  copies_count INTEGER DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads prompts"   ON prompts FOR SELECT USING (true);
CREATE POLICY "Users insert prompts"   ON prompts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete prompts"   ON prompts FOR DELETE USING (auth.uid() = user_id);

-- Tool views (yakın zamanda görüntülenen araçlar)
CREATE TABLE IF NOT EXISTS tool_views (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_id    UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  viewed_at  TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE tool_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users select own views" ON tool_views FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own views" ON tool_views FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own views" ON tool_views FOR DELETE USING (auth.uid() = user_id);
