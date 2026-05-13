'use client'

import { useState } from 'react'
import { Heart, Calendar } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/contexts/ToastContext'
import type { Post } from '@/lib/types'
import { PostComments } from '@/components/community/PostComments'

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'az önce'
  if (mins < 60) return `${mins} dk önce`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} sa önce`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} gün önce`
  return new Date(dateStr).toLocaleDateString('tr-TR')
}

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const initial = post.profiles?.username?.charAt(0).toUpperCase() ?? '?'
  const [likes, setLikes]   = useState(post.likes_count)
  const [liked, setLiked]   = useState(false)
  const [liking, setLiking] = useState(false)
  const { addToast } = useToast()

  async function handleLike() {
    if (liking) return

    const supabase = createClient()
    if (!supabase) { addToast('Bağlantı kurulamadı', 'error'); return }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/login'; return }

    setLiking(true)
    try {
      const res = await fetch('/api/community/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: post.id }),
      })

      const json = await res.json()

      if (!res.ok) {
        addToast(json?.error ?? 'Beğeni kaydedilemedi', 'error')
        return
      }

      setLikes(json.likes_count)
      setLiked(json.liked)
    } catch {
      addToast('Bağlantı hatası, tekrar deneyin', 'error')
    } finally {
      setLiking(false)
    }
  }

  return (
    <article className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--muted)]">
      {/* Post image */}
      <div className="relative aspect-square w-full bg-[var(--background)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.image_url}
          alt={post.caption ?? 'Paylaşım'}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="p-4">
        {/* Author */}
        <div className="mb-3 flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/15 text-xs font-bold text-[var(--accent)]">
            {initial}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-[var(--foreground)]">
              {post.profiles?.username ?? 'Kullanıcı'}
            </p>
            <p className="flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
              <Calendar className="h-3 w-3" />
              {timeAgo(post.created_at)}
            </p>
          </div>
        </div>

        {post.caption && (
          <p className="mb-3 line-clamp-2 text-sm text-[var(--muted-foreground)]">{post.caption}</p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleLike}
            disabled={liking}
            aria-label="Beğen"
            className={`flex items-center gap-1.5 text-sm transition-all disabled:opacity-50 ${
              liked ? 'text-pink-500' : 'text-[var(--muted-foreground)] hover:text-pink-500'
            }`}
          >
            <Heart
              className={`h-4 w-4 transition-transform active:scale-125 ${
                liked ? 'fill-pink-500 text-pink-500' : ''
              }`}
            />
            <span>{likes}</span>
          </button>
          <PostComments postId={post.id} />
        </div>
      </div>
    </article>
  )
}
