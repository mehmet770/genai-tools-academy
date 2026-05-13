'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, Send } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface ToolComment {
  id: string
  content: string
  created_at: string
  profiles: { username: string }
}

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

interface ToolCommentsProps {
  toolId: string
}

export function ToolComments({ toolId }: ToolCommentsProps) {
  const [comments, setComments] = useState<ToolComment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    if (!supabase) return

    supabase.auth.getUser().then(({ data }) => setIsLoggedIn(!!data.user))

    supabase
      .from('comments')
      .select('*, profiles!user_id(username)')
      .eq('tool_id', toolId)
      .order('created_at', { ascending: false })
      .then(({ data }) => setComments((data ?? []) as ToolComment[]))
  }, [toolId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!newComment.trim()) return
    setLoading(true)
    const supabase = createClient()
    if (!supabase) { setLoading(false); return }
    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) { setLoading(false); return }
    const { data, error } = await supabase
      .from('comments')
      .insert({ tool_id: toolId, user_id: userData.user.id, content: newComment.trim() })
      .select('*, profiles!user_id(username)')
      .single()
    if (!error && data) {
      setComments((prev) => [data as ToolComment, ...prev])
      setNewComment('')
    }
    setLoading(false)
  }

  return (
    <section className="mt-12 border-t border-[var(--border)] pt-10">
      <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-[var(--foreground)]">
        <MessageCircle className="h-5 w-5 text-[var(--accent)]" />
        Yorumlar
        {comments.length > 0 && (
          <span className="ml-1 text-sm font-normal text-[var(--muted-foreground)]">
            ({comments.length})
          </span>
        )}
      </h2>

      {isLoggedIn ? (
        <form onSubmit={handleSubmit} className="mb-8 flex gap-3">
          <input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Bu araç hakkında düşüncelerini paylaş..."
            className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--muted)] px-4 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] outline-none focus:border-[var(--accent)] transition-colors"
          />
          <button
            type="submit"
            disabled={loading || !newComment.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--accent-hover)] disabled:opacity-50 transition-colors"
          >
            <Send className="h-4 w-4" />
            Gönder
          </button>
        </form>
      ) : (
        <p className="mb-6 rounded-xl border border-[var(--border)] bg-[var(--muted)] p-4 text-sm text-[var(--muted-foreground)]">
          Yorum yazmak için{' '}
          <a href="/login" className="text-[var(--accent)] hover:underline">
            giriş yapmalısın
          </a>
          .
        </p>
      )}

      {comments.length === 0 ? (
        <p className="text-sm text-[var(--muted-foreground)]">
          Henüz yorum yok. İlk yorumu sen yaz!
        </p>
      ) : (
        <div className="flex flex-col gap-5">
          {comments.map((c) => (
            <article key={c.id} className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/15 text-xs font-bold text-[var(--accent)]">
                {c.profiles?.username?.charAt(0).toUpperCase() ?? '?'}
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[var(--foreground)]">
                    {c.profiles?.username ?? 'Kullanıcı'}
                  </span>
                  <span className="text-xs text-[var(--muted-foreground)]">
                    {timeAgo(c.created_at)}
                  </span>
                </div>
                <p className="text-sm text-[var(--muted-foreground)]">{c.content}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
