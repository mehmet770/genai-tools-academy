'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, Send, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface PostComment {
  id: string
  content: string
  created_at: string
  profiles: { username: string }
}

interface PostCommentsProps {
  postId: string
}

export function PostComments({ postId }: PostCommentsProps) {
  const [comments, setComments] = useState<PostComment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fetchError, setFetchError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    if (!supabase) return
    supabase.auth.getUser().then(({ data }) => setIsLoggedIn(!!data.user))
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const supabase = createClient()
    if (!supabase) { setFetchError('Bağlantı kurulamadı'); return }

    setFetchError('')
    supabase
      .from('post_comments')
      .select('*, profiles!user_id(username)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          setFetchError('Yorumlar yüklenemedi: ' + error.message)
        } else {
          setComments((data ?? []) as PostComment[])
        }
      })
  }, [isOpen, postId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!newComment.trim()) return
    setSubmitError('')
    setLoading(true)

    const supabase = createClient()
    if (!supabase) { setSubmitError('Bağlantı kurulamadı'); setLoading(false); return }

    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) { setSubmitError('Yorum yazmak için giriş yapmalısın'); setLoading(false); return }

    const { data, error } = await supabase
      .from('post_comments')
      .insert({ post_id: postId, user_id: userData.user.id, content: newComment.trim() })
      .select('*, profiles!user_id(username)')
      .single()

    if (error) {
      setSubmitError('Yorum gönderilemedi: ' + error.message)
    } else if (data) {
      setComments((prev) => [...prev, data as PostComment])
      setNewComment('')
    }
    setLoading(false)
  }

  return (
    <div>
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
      >
        <MessageCircle className="h-4 w-4" />
        {isOpen ? 'Gizle' : `Yorumlar${comments.length > 0 ? ` (${comments.length})` : ''}`}
      </button>

      {isOpen && (
        <div className="mt-3 flex flex-col gap-2.5">
          {fetchError && (
            <div className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              {fetchError}
            </div>
          )}

          {!fetchError && comments.length === 0 && (
            <p className="text-xs text-[var(--muted-foreground)]">Henüz yorum yok.</p>
          )}

          {comments.map((c) => (
            <div key={c.id} className="flex gap-1.5 text-sm">
              <span className="font-medium text-[var(--foreground)]">
                {c.profiles?.username ?? 'Kullanıcı'}:
              </span>
              <span className="text-[var(--muted-foreground)]">{c.content}</span>
            </div>
          ))}

          {submitError && (
            <div className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              {submitError}
            </div>
          )}

          {isLoggedIn ? (
            <form onSubmit={handleSubmit} className="mt-1 flex gap-2">
              <input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Yorum yaz..."
                className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] outline-none focus:border-[var(--accent)] transition-colors"
              />
              <button
                type="submit"
                disabled={loading || !newComment.trim()}
                className="rounded-lg border border-[var(--accent)] bg-[var(--accent)]/10 px-2.5 py-1.5 text-[var(--accent)] disabled:opacity-50 transition-colors hover:bg-[var(--accent)]/20"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          ) : (
            <p className="text-xs text-[var(--muted-foreground)]">
              Yorum yazmak için{' '}
              <a href="/login" className="text-[var(--accent)] hover:underline">giriş yapmalısın</a>.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
