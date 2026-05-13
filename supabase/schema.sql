-- ============================================================
-- GENAI Tools Academy — Supabase Schema
-- Run this in: Supabase Dashboard > SQL Editor > New Query
-- ============================================================

-- Extensions
create extension if not exists "uuid-ossp";

-- ─── PROFILES ────────────────────────────────────────────────
create table if not exists profiles (
  id          uuid references auth.users on delete cascade primary key,
  username    text unique not null,
  avatar_url  text,
  bio         text,
  created_at  timestamptz default now() not null
);

-- Auto-create a profile row when a new user signs up
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ─── TOOLS ───────────────────────────────────────────────────
-- robot_options: JSONB array of { id, label, content } objects
-- that drive the typing-effect interaction on the detail page.
create table if not exists tools (
  id             uuid default uuid_generate_v4() primary key,
  slug           text unique not null,
  name           text not null,
  tagline        text not null,
  description    text default '' not null,
  category       text not null
                   check (category in ('text','image','audio','video','code','data','multimodal')),
  logo_url       text default '' not null,
  website_url    text default '' not null,
  features       text[] default '{}' not null,
  robot_options  jsonb default '[]' not null,
  created_at     timestamptz default now() not null
);

-- ─── COMMENTS ────────────────────────────────────────────────
create table if not exists comments (
  id          uuid default uuid_generate_v4() primary key,
  tool_id     uuid references tools on delete cascade not null,
  user_id     uuid references profiles on delete cascade not null,
  content     text not null,
  created_at  timestamptz default now() not null
);

-- ─── POST COMMENTS ───────────────────────────────────────────
create table if not exists post_comments (
  id          uuid default uuid_generate_v4() primary key,
  post_id     uuid references posts on delete cascade not null,
  user_id     uuid references profiles on delete cascade not null,
  content     text not null,
  created_at  timestamptz default now() not null
);

-- ─── POSTS (community feed) ───────────────────────────────────
create table if not exists posts (
  id          uuid default uuid_generate_v4() primary key,
  user_id     uuid references profiles on delete cascade not null,
  image_url   text not null,
  caption     text,
  likes_count integer default 0 not null,
  created_at  timestamptz default now() not null
);

-- ─── POST LIKES (unique per user/post) ───────────────────────
create table if not exists post_likes (
  id        uuid default uuid_generate_v4() primary key,
  post_id   uuid references posts on delete cascade not null,
  user_id   uuid references profiles on delete cascade not null,
  created_at timestamptz default now() not null,
  unique (post_id, user_id)
);

-- ─── ROW LEVEL SECURITY ──────────────────────────────────────
alter table profiles   enable row level security;
alter table tools      enable row level security;
alter table comments   enable row level security;
alter table posts      enable row level security;
alter table post_likes enable row level security;

-- Profiles
create policy "profiles_select" on profiles for select using (true);
create policy "profiles_update" on profiles for update using (auth.uid() = id);

-- Tools (read-only for all)
create policy "tools_select"   on tools for select using (true);

-- Comments
create policy "comments_select" on comments for select using (true);
create policy "comments_insert" on comments for insert with check (auth.uid() = user_id);
create policy "comments_delete" on comments for delete using (auth.uid() = user_id);

-- Post comments
alter table post_comments enable row level security;
create policy "post_comments_select" on post_comments for select using (true);
create policy "post_comments_insert" on post_comments for insert with check (auth.uid() = user_id);
create policy "post_comments_delete" on post_comments for delete using (auth.uid() = user_id);

-- Posts
create policy "posts_select" on posts for select using (true);
create policy "posts_insert" on posts for insert with check (auth.uid() = user_id);
create policy "posts_delete" on posts for delete using (auth.uid() = user_id);

-- Post likes
create policy "likes_select" on post_likes for select using (true);
create policy "likes_insert" on post_likes for insert with check (auth.uid() = user_id);
create policy "likes_delete" on post_likes for delete using (auth.uid() = user_id);

-- ─── NEWS ITEMS ──────────────────────────────────────────────
create table if not exists news_items (
  id           uuid default uuid_generate_v4() primary key,
  title        text not null,
  description  text,
  url          text unique not null,
  source       text not null,
  image_url    text,
  published_at timestamptz,
  category     text default 'ai' not null,
  created_at   timestamptz default now() not null
);

alter table news_items enable row level security;
create policy "news_items_select" on news_items for select using (true);
-- Insert/update open: RSS fetch runs server-side without user auth
create policy "news_items_insert" on news_items for insert with check (true);
create policy "news_items_update" on news_items for update using (true) with check (true);

-- ─── FAVORITES ───────────────────────────────────────────────
create table if not exists favorites (
  id         uuid default uuid_generate_v4() primary key,
  user_id    uuid references profiles on delete cascade not null,
  tool_id    uuid references tools on delete cascade not null,
  created_at timestamptz default now() not null,
  unique (user_id, tool_id)
);

alter table favorites enable row level security;
create policy "favorites_select" on favorites for select using (auth.uid() = user_id);
create policy "favorites_insert" on favorites for insert with check (auth.uid() = user_id);
create policy "favorites_delete" on favorites for delete using (auth.uid() = user_id);

-- ─── PROMPTS ─────────────────────────────────────────────────
create table if not exists prompts (
  id           uuid default uuid_generate_v4() primary key,
  tool_id      uuid references tools on delete cascade not null,
  user_id      uuid references profiles on delete cascade not null,
  title        text not null,
  content      text not null,
  copies_count integer default 0 not null,
  created_at   timestamptz default now() not null
);

alter table prompts enable row level security;
create policy "prompts_select" on prompts for select using (true);
create policy "prompts_insert" on prompts for insert with check (auth.uid() = user_id);
create policy "prompts_delete" on prompts for delete using (auth.uid() = user_id);
-- Allow any authenticated user to increment copies_count via RPC
create policy "prompts_update_copies" on prompts for update using (true) with check (true);

-- RPC: safely increment copies_count without exposing full update
create or replace function increment_prompt_copies(p_id uuid)
returns void language sql security definer as $$
  update prompts set copies_count = copies_count + 1 where id = p_id;
$$;

-- ─── TOOL VIEWS (recent history) ─────────────────────────────
create table if not exists tool_views (
  id        uuid default uuid_generate_v4() primary key,
  user_id   uuid references profiles on delete cascade,
  tool_id   uuid references tools on delete cascade not null,
  viewed_at timestamptz default now() not null
);

alter table tool_views enable row level security;
create policy "tool_views_select" on tool_views for select using (auth.uid() = user_id);
create policy "tool_views_insert" on tool_views for insert with check (true);

-- ─── SEED DATA ───────────────────────────────────────────────
insert into tools (slug, name, tagline, description, category, website_url, features, robot_options)
values
(
  'chatgpt',
  'ChatGPT',
  'OpenAI tarafından geliştirilmiş, dünyanın en popüler konuşma AI modeli.',
  'ChatGPT, OpenAI tarafından geliştirilen büyük bir dil modelidir. GPT-4 mimarisi üzerine inşa edilmiş olup metin anlama, kod yazma, analiz ve yaratıcı içerik üretme konularında üst düzey performans sunar.',
  'text',
  'https://chat.openai.com',
  array['Sohbet','Kod Yazma','Analiz','Çeviri','Özetleme'],
  '[
    {"id":"intro","label":"Bu nedir?","content":"ChatGPT, OpenAI tarafından geliştirilmiş güçlü bir dil modelidir. Metin anlama, sohbet ve içerik üretiminde dünya lideri konumundadır."},
    {"id":"features","label":"Özellikler","content":"ChatGPT; sohbet, kod yazma, analiz, çeviri ve özetleme gibi geniş bir yetenek yelpazesi sunar."},
    {"id":"usecase","label":"Kimler için?","content":"Yazarlar, geliştiriciler, öğrenciler ve her seviyeden profesyonel için idealdir."},
    {"id":"start","label":"Nasıl başlarım?","content":"chat.openai.com adresine giderek ücretsiz hesap oluşturabilir ve hemen kullanmaya başlayabilirsin."}
  ]'::jsonb
),
(
  'midjourney',
  'Midjourney',
  'Metinden nefes kesici görseller üreten lider AI görsel oluşturucusu.',
  'Midjourney, metin açıklamalarından yüksek kaliteli sanatsal görseller üreten bir yapay zeka aracıdır. Discord üzerinden erişilebilen bu araç, fotogerçekçiden soyut sanata geniş bir yelpazede içerik yaratabilir.',
  'image',
  'https://midjourney.com',
  array['Görsel Üretme','Stil Aktarımı','Upscale','Varyasyon'],
  '[
    {"id":"intro","label":"Bu nedir?","content":"Midjourney, metin komutlarından etkileyici AI görselleri üreten bir platform. Sanatçılar ve tasarımcıların gözdesi."},
    {"id":"features","label":"Özellikler","content":"Görsel üretme, stil aktarımı, çözünürlük artırma ve varyasyon oluşturma başlıca özellikleridir."},
    {"id":"usecase","label":"Kimler için?","content":"Grafik tasarımcılar, illüstratörler, konsept sanatçılar ve yaratıcı profesyoneller için idealdir."},
    {"id":"start","label":"Nasıl başlarım?","content":"Discord üzerinden Midjourney sunucusuna katılarak /imagine komutuyla görsel üretmeye hemen başlayabilirsin."}
  ]'::jsonb
),
(
  'github-copilot',
  'GitHub Copilot',
  'AI destekli kod tamamlama ile geliştirici verimliliğini katlayan araç.',
  'GitHub Copilot, OpenAI Codex modeli üzerine kurulu bir AI programlama asistanıdır. IDE entegrasyonuyla satır satır ve fonksiyon bazlı kod önerileri sunar.',
  'code',
  'https://github.com/features/copilot',
  array['Kod Tamamlama','Refactor','Test Üretme','Dokümantasyon'],
  '[
    {"id":"intro","label":"Bu nedir?","content":"GitHub Copilot, IDE içinde çalışan AI kod asistanıdır. Yazdığın kodu anlayarak en uygun devamı önerir."},
    {"id":"features","label":"Özellikler","content":"Otomatik kod tamamlama, test üretme, refactoring önerileri ve dokümantasyon yazma yetenekleri sunar."},
    {"id":"usecase","label":"Kimler için?","content":"Her seviyeden yazılım geliştiricisi için uygundur; özellikle VSCode ve JetBrains kullanıcıları için entegrasyon çok kolaydır."},
    {"id":"start","label":"Nasıl başlarım?","content":"github.com/features/copilot adresinden abonelik oluştur, ardından VS Code eklentisini yükleyerek kullanmaya başla."}
  ]'::jsonb
),
(
  'elevenlabs',
  'ElevenLabs',
  'Gerçekçi ses klonlama ve metin-sese dönüştürme teknolojisinin öncüsü.',
  'ElevenLabs, son derece gerçekçi yapay ses üretimi ve ses klonlama yetenekleri sunan bir AI ses platformudur. 29 dili destekleyen platform, içerik üreticileri ve geliştiriciler için güçlü API imkânları sağlar.',
  'audio',
  'https://elevenlabs.io',
  array['Ses Klonlama','TTS','Çoklu Dil','Ses Tasarımı'],
  '[
    {"id":"intro","label":"Bu nedir?","content":"ElevenLabs, gerçekçi yapay sesler üreten ve mevcut sesleri klonlayabilen gelişmiş bir AI ses platformudur."},
    {"id":"features","label":"Özellikler","content":"Ses klonlama, metin-sese dönüştürme, 29 dil desteği ve profesyonel ses tasarımı araçları sunar."},
    {"id":"usecase","label":"Kimler için?","content":"Podcast yapımcıları, oyun geliştiricileri, içerik üreticileri ve sesli kitap prodüksiyoncuları için idealdir."},
    {"id":"start","label":"Nasıl başlarım?","content":"elevenlabs.io adresine giderek ücretsiz hesap oluşturabilir, aylık 10.000 karakterle platformu deneyimleyebilirsin."}
  ]'::jsonb
),
(
  'runway',
  'Runway',
  'AI ile profesyonel kalitede video oluşturma ve düzenleme platformu.',
  'Runway, generatif AI kullanarak video üretimi, düzenleme ve efekt uygulama imkânı sunan yaratıcı bir platformdur. Gen-2 modeli ile metin ve görüntüden video oluşturulabilir.',
  'video',
  'https://runwayml.com',
  array['Video Üretme','İnpainting','Motion Brush','Green Screen'],
  '[
    {"id":"intro","label":"Bu nedir?","content":"Runway, AI gücüyle video oluşturma ve düzenleme imkânı sunan yaratıcı bir platformdur. Gen-2 modeli endüstri standardı haline geldi."},
    {"id":"features","label":"Özellikler","content":"Metin ve görselden video üretme, inpainting, Motion Brush ve yeşil perde efektleri en popüler özellikleridir."},
    {"id":"usecase","label":"Kimler için?","content":"Film yapımcıları, içerik üreticileri, sosyal medya tasarımcıları ve yaratıcı ajanslar için mükemmeldir."},
    {"id":"start","label":"Nasıl başlarım?","content":"runwayml.com üzerinden ücretsiz deneme hesabı açabilir, Gen-2 modeline erişim için temel planı seçebilirsin."}
  ]'::jsonb
),
(
  'claude',
  'Claude',
  'Anthropic''in güvenlik odaklı, uzun bağlam destekli gelişmiş AI asistanı.',
  'Claude, Anthropic''in Constitutional AI yöntemiyle geliştirdiği güvenli ve yardımsever bir yapay zeka asistanıdır. 200K token bağlam penceresiyle uzun belge analizi ve karmaşık görevlerde öne çıkar.',
  'multimodal',
  'https://claude.ai',
  array['Analiz','Uzun Bağlam','Kod','Araştırma','Yazı'],
  '[
    {"id":"intro","label":"Bu nedir?","content":"Claude, Anthropic tarafından güvenlik odaklı yaklaşımla geliştirilmiş güçlü bir AI asistanıdır. Uzun ve karmaşık görevlerde öne çıkar."},
    {"id":"features","label":"Özellikler","content":"200K token bağlam penceresi, belge analizi, kod yazma, araştırma destekleme ve yaratıcı yazı başlıca güçlü yönleridir."},
    {"id":"usecase","label":"Kimler için?","content":"Araştırmacılar, yazarlar, hukuk ve finans profesyonelleri ile uzun metin analizi yapması gerekenler için idealdir."},
    {"id":"start","label":"Nasıl başlarım?","content":"claude.ai adresine giderek ücretsiz hesap oluşturabilir ve hemen sohbete başlayabilirsin."}
  ]'::jsonb
)
on conflict (slug) do update set
  robot_options = excluded.robot_options,
  features      = excluded.features,
  description   = excluded.description;
