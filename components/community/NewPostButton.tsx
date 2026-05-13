'use client'

import { useState, useEffect } from 'react'
import { ImagePlus, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function NewPostButton() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [caption, setCaption] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const supabase = createClient()
    if (!supabase) return
    supabase.auth.getUser().then(({ data }) => setIsLoggedIn(!!data.user))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    if (!supabase) { setLoading(false); return }
    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) { setError('Giriş yapmalısın'); setLoading(false); return }
    const { error: insertError } = await supabase.from('posts').insert({
      user_id: userData.user.id,
      image_url: imageUrl,
      caption: caption || null,
    })
    if (insertError) {
      setError(insertError.message)
    } else {
      setIsOpen(false)
      setImageUrl('')
      setCaption('')
      window.location.reload()
    }
    setLoading(false)
  }

  if (!isLoggedIn) {
    return (
      <button
        disabled
        title="Paylaşım yapmak için giriş yap"
        className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-medium text-[var(--muted-foreground)] opacity-60 cursor-not-allowed"
      >
        <ImagePlus className="h-4 w-4" />
        Paylaşım Yap
      </button>
    )
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl border border-[var(--accent)] bg-[var(--accent)]/10 px-4 py-2.5 text-sm font-medium text-[var(--accent)] hover:bg-[var(--accent)]/20 transition-colors"
      >
        <ImagePlus className="h-4 w-4" />
        Paylaşım Yap
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[var(--foreground)]">Yeni Paylaşım</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
                  Görsel URL *
                </label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/gorsel.jpg"
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--muted)] px-3.5 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] outline-none focus:border-[var(--accent)] transition-colors"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
                  Açıklama
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={3}
                  placeholder="Bu AI aracıyla ne yaptın?"
                  className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--muted)] px-3.5 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] outline-none focus:border-[var(--accent)] transition-colors"
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--accent-hover)] disabled:opacity-60 transition-colors"
              >
                {loading ? 'Paylaşılıyor...' : 'Paylaş'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
