-- ============================================================
-- Migration 004 — User Paths + Rank System + Community Likes Fix
-- Run in: Supabase Dashboard > SQL Editor > New Query
-- ============================================================

-- ── Kullanıcı yol haritaları ──────────────────────────────────
CREATE TABLE IF NOT EXISTS user_paths (
  id          uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id     uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
  title       text NOT NULL,
  description text DEFAULT '' NOT NULL,
  icon        text DEFAULT '🗺️' NOT NULL,
  steps       jsonb DEFAULT '[]' NOT NULL,
  likes_count integer DEFAULT 0 NOT NULL,
  views_count integer DEFAULT 0 NOT NULL,
  is_public   boolean DEFAULT true NOT NULL,
  created_at  timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE user_paths ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_paths_select" ON user_paths FOR SELECT
  USING (is_public = true OR auth.uid() = user_id);
CREATE POLICY "user_paths_insert" ON user_paths FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_paths_update" ON user_paths FOR UPDATE
  USING (auth.uid() = user_id);
CREATE POLICY "user_paths_delete" ON user_paths FOR DELETE
  USING (auth.uid() = user_id);

-- ── User path beğenileri ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_path_likes (
  id         uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  path_id    uuid REFERENCES user_paths ON DELETE CASCADE NOT NULL,
  user_id    uuid REFERENCES profiles   ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE (path_id, user_id)
);

ALTER TABLE user_path_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_path_likes_select" ON user_path_likes FOR SELECT USING (true);
CREATE POLICY "user_path_likes_insert" ON user_path_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_path_likes_delete" ON user_path_likes FOR DELETE
  USING (auth.uid() = user_id);

-- ── RPC: path beğeni toggle ──────────────────────────────────
CREATE OR REPLACE FUNCTION toggle_path_like(p_path_id uuid, p_user_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  existing_id uuid;
  new_count   integer;
BEGIN
  SELECT id INTO existing_id FROM user_path_likes
  WHERE path_id = p_path_id AND user_id = p_user_id;

  IF existing_id IS NOT NULL THEN
    DELETE FROM user_path_likes WHERE id = existing_id;
    UPDATE user_paths SET likes_count = GREATEST(0, likes_count - 1) WHERE id = p_path_id;
  ELSE
    INSERT INTO user_path_likes (path_id, user_id) VALUES (p_path_id, p_user_id);
    UPDATE user_paths SET likes_count = likes_count + 1 WHERE id = p_path_id;
  END IF;

  SELECT likes_count INTO new_count FROM user_paths WHERE id = p_path_id;
  RETURN jsonb_build_object('liked', existing_id IS NULL, 'likes_count', new_count);
END;
$$;

-- ── RPC: path görüntülenme artır ─────────────────────────────
CREATE OR REPLACE FUNCTION increment_path_views(p_path_id uuid)
RETURNS void LANGUAGE sql SECURITY DEFINER AS $$
  UPDATE user_paths SET views_count = views_count + 1 WHERE id = p_path_id;
$$;

-- ── RPC: post beğeni toggle (community fix) ───────────────────
CREATE OR REPLACE FUNCTION toggle_post_like(p_post_id uuid, p_user_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  existing_id uuid;
  new_count   integer;
BEGIN
  SELECT id INTO existing_id FROM post_likes
  WHERE post_id = p_post_id AND user_id = p_user_id;

  IF existing_id IS NOT NULL THEN
    DELETE FROM post_likes WHERE id = existing_id;
    UPDATE posts SET likes_count = GREATEST(0, likes_count - 1) WHERE id = p_post_id;
  ELSE
    INSERT INTO post_likes (post_id, user_id) VALUES (p_post_id, p_user_id);
    UPDATE posts SET likes_count = likes_count + 1 WHERE id = p_post_id;
  END IF;

  SELECT likes_count INTO new_count FROM posts WHERE id = p_post_id;
  RETURN jsonb_build_object('liked', existing_id IS NULL, 'likes_count', new_count);
END;
$$;

-- posts tablosuna update izni (likes_count için)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename='posts' AND policyname='posts_update_likes'
  ) THEN
    CREATE POLICY "posts_update_likes" ON posts FOR UPDATE USING (true) WITH CHECK (true);
  END IF;
END $$;
