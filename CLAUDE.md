@AGENTS.md

---

# GENAI TOOLS ACADEMY — Oturum Yedeği

## Proje Özeti
Next.js 16 (App Router) + React 19 + Three.js + Supabase tabanlı AI araçları katalogu.  
**Çalışma dizini:** `/home/canmana/GENAI-TOOLS-ACADEMY`

---

## Teknoloji Yığını
- **Next.js 16.2.4** (App Router, Turbopack)
- **React 19.2.4**
- **Three.js 0.184.0** + `@react-three/fiber` 9.6.1 + `@react-three/drei` 10.7.7
- **Supabase** (`@supabase/ssr` 0.10.2, `@supabase/supabase-js` 2.105.1)
- **Framer Motion** 12.38.0
- **Tailwind CSS 4**
- **TypeScript 5**

---

## Dosya Yapısı (önemli dosyalar)

```
app/
  page.tsx                          ← Ana sayfa (araç listesi)
  community/page.tsx                ← Topluluk sayfası
  tools/[slug]/page.tsx             ← Araç detay sayfası (sadeleştirildi)
  (auth)/login/page.tsx
  (auth)/register/page.tsx

components/
  3d/RobotScene.tsx                 ← Three.js robot (wandering + emotion)
  ai/
    ToolInteraction.tsx             ← Araç kartı (robot overlay mimarisi)
    TypingText.tsx
    ToolCard.tsx
    HeroSection.tsx
  community/
    NewPostButton.tsx               ← Yeni paylaşım butonu (auth kontrollü)
    PostCard.tsx
    PostComments.tsx                ← Post yorumları (post_comments tablosu)
  tools/
    ToolComments.tsx                ← Araç yorumları (comments tablosu)
  auth/
    LoginForm.tsx
    RegisterForm.tsx
  layout/
    Header.tsx  Footer.tsx  Providers.tsx
  ui/
    Button.tsx  Card.tsx  Input.tsx

lib/
  supabase/client.ts                ← Browser Supabase client
  supabase/server.ts                ← Server Supabase client
  types.ts                          ← AITool, Post, Comment, PostComment, Profile

supabase/schema.sql                 ← Tam DB şeması (post_comments tablosu dahil)
tsconfig.json                       ← log-system/ exclude edildi
```

---

## Bu Oturumda Tamamlanan Görevler

### Görev 1 — Topluluk Paylaşım Sistemi
- `app/community/page.tsx`: disabled buton → `<NewPostButton />` client component'a dönüştürüldü
- `components/community/NewPostButton.tsx` **yeni oluşturuldu**:
  - Supabase auth kontrolü: giriş yapılmamışsa disabled, yapılmışsa modal açar
  - Modal: görsel URL + açıklama → `posts` tablosuna Supabase insert
- `components/community/PostComments.tsx` **yeni oluşturuldu**:
  - PostCard içindeki statik "Yorum yap" metni bu bileşene dönüştürüldü
  - `post_comments` tablosundan o posta ait yorumlar çekilir, yeni yorum insert edilir
- `supabase/schema.sql`: `post_comments` tablosu + RLS politikaları eklendi
- `lib/types.ts`: `PostComment` tipi eklendi

> ⚠️ **Yapılacak:** `post_comments` tablosunu Supabase Dashboard > SQL Editor'da çalıştır.

### Görev 2 — Araca Özel Yorum Kanalları
- `components/tools/ToolComments.tsx` **yeni oluşturuldu**:
  - `tool_id` ile filtrelenmiş yorumlar listelenir
  - Giriş yapmış kullanıcı `comments` tablosuna insert edebilir
  - Yorum sayısı + tarih formatlaması mevcut
- `app/tools/[slug]/page.tsx`: `<ToolComments toolId={tool.id} />` eklendi

### Görev 3 — Araç Detay Sayfası Görsel Hiyerarşi Yeniden Kurgusu
**`app/tools/[slug]/page.tsx`:**
- İki sütunlu grid tamamen kaldırıldı
- Statik içerik (logo, başlık, açıklama, özellikler, website butonu) `ToolInteraction.tsx`'e taşındı
- Sayfa: back-link → `<ToolInteraction>` (tam genişlik) → `<ToolComments>`

**`components/ai/ToolInteraction.tsx` — Tam yeniden kurgu:**
- Robot artık `absolute inset-0 z-10 pointer-events-none` → siyah kutu yok, karta overlay
- Ayrı speech bubble kaldırıldı → description alanı ile robot cevabı birleşti (`AnimatePresence`)
- Başlangıçta `tool.description` gösterilir; butona tıklanınca `TypingText` ile robot cevabı yazılır
- `flyTrigger` counter: her tıklamada artar → aynı butona tekrar tıklansa bile robot uçar
- İçerik `z-20`, robot canvas `z-10` → butonlar tıklanabilir, robot arkaplanda
- `backdrop-blur-sm` + yarı saydam arka planlar ile metin okunabilirliği korunur

**`components/3d/RobotScene.tsx`:**
- `WANDER_BOUNDS_X`: `1.0` → `2.2` (tam kart genişliğinde dolaşım)
- Yeni props: `targetX?: number`, `flyTrigger?: number`
- `useEffect([flyTrigger])` ile her tıklamada `flyTargetRef` güncellenir
- Fly modunda `lerp * 5` (hızlı süzülme), varınca yeni rastgele hedef alır
- Kamera `fov: 44`, `distance: 4.5`

### Düzeltmeler
- `tsconfig.json`: `"exclude": ["node_modules", "log-system"]` — log-system'den gelen TS hataları giderildi

---

## Supabase Veritabanı Durumu

Mevcut tablolar:
- `profiles` — kullanıcı profilleri
- `tools` — AI araçları (slug, robot_options JSONB dahil)
- `comments` — araç yorumları (`tool_id` foreign key)
- `posts` — topluluk paylaşımları
- `post_likes` — paylaşım beğenileri
- `post_comments` — **YENİ** (SQL çalıştırılması gerekiyor)

---

## Sonraki Adımlar (Yapılacaklar)

1. `post_comments` tablosunu Supabase'de oluştur (schema.sql'deki SQL'i çalıştır)
2. Test: Giriş yaparak `/community` sayfasında "Paylaşım Yap" butonunu test et
3. Test: `/tools/[slug]` sayfasında robot overlay + description→typing geçişini test et
4. Test: Araç yorumlarının `tool_id` ile doğru filtrelendiğini kontrol et
5. İsteğe bağlı: HeroSection.tsx'teki ana sayfa robotu da aynı emotion/wandering güncellemesiyle yenilenebilir
