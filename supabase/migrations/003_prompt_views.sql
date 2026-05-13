-- ============================================================
-- Migration 003 — Gelişmiş Prompt Yönetimi + İzlenme Sistemi
-- Run in: Supabase Dashboard > SQL Editor > New Query
-- ============================================================

-- ── Prompts tablosuna yeni alanlar ───────────────────────────
ALTER TABLE prompts ADD COLUMN IF NOT EXISTS description text DEFAULT '' NOT NULL;
ALTER TABLE prompts ADD COLUMN IF NOT EXISTS views_count  integer DEFAULT 0  NOT NULL;

-- ── Prompt görüntülenme geçmişi ───────────────────────────────
CREATE TABLE IF NOT EXISTS prompt_views (
  id               uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  prompt_id        uuid REFERENCES prompts   ON DELETE CASCADE  NOT NULL,
  viewer_id        uuid REFERENCES profiles  ON DELETE SET NULL,
  viewer_username  text,
  viewed_at        timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE prompt_views ENABLE ROW LEVEL SECURITY;

-- Sadece prompt sahibi kendi promptlarının view loglarını görebilir
CREATE POLICY "prompt_views_owner_select" ON prompt_views
  FOR SELECT USING (
    prompt_id IN (SELECT id FROM prompts WHERE user_id = auth.uid())
  );

-- Herkes insert yapabilir (anonim izlenme de dahil)
CREATE POLICY "prompt_views_insert" ON prompt_views
  FOR INSERT WITH CHECK (true);

-- ── RPC: görüntülenmeyi atomik olarak artır + log tut ─────────
CREATE OR REPLACE FUNCTION increment_prompt_views(p_id uuid, v_id uuid DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE v_username text;
BEGIN
  UPDATE prompts SET views_count = views_count + 1 WHERE id = p_id;

  IF v_id IS NOT NULL THEN
    SELECT username INTO v_username FROM profiles WHERE id = v_id;
  END IF;

  INSERT INTO prompt_views (prompt_id, viewer_id, viewer_username)
  VALUES (p_id, v_id, COALESCE(v_username, 'Anonim'));
END;
$$;
