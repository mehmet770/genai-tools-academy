'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/contexts/ToastContext'
import { useRouter } from 'next/navigation'

interface Tool { id: string; name: string; slug: string }

export function NewPromptButton({ tools }: { tools: Tool[] }) {
  const [open, setOpen] = useState(false)
  const [toolId, setToolId] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)
  const { addToast } = useToast()
  const router = useRouter()

  const handleSubmit = async () => {
    const supabase = createClient()
    if (!supabase) { addToast('Veritabanı bağlantısı yok.', 'error'); return }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { addToast('Önce giriş yapmalısın.', 'warning'); return }

    if (!toolId || !title.trim() || !content.trim()) {
      addToast('Tüm alanları doldur.', 'warning')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool_id: toolId, title, description, content }),
      })

      const json = await res.json().catch(() => ({}))

      if (res.ok) {
        addToast('Prompt paylaşıldı!', 'success')
        setOpen(false)
        setToolId(''); setTitle(''); setDescription(''); setContent('')
        router.refresh()
      } else {
        addToast(json?.error ?? 'Bir hata oluştu.', 'error')
      }
    } catch {
      addToast('Bağlantı hatası, tekrar deneyin.', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        whileTap={{ scale: 0.96 }}
        className="flex items-center gap-2 rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-violet-200/50 transition-all hover:bg-violet-600"
      >
        <Plus className="h-4 w-4" />
        Prompt Ekle
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 px-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/65 bg-white/80 shadow-2xl shadow-slate-300/30 backdrop-blur-2xl"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between border-b border-slate-100/80 px-6 py-4">
                <h2 className="font-semibold text-slate-800">Prompt Paylaş</h2>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-xl p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Form */}
              <div className="space-y-4 p-6">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-500">Araç</label>
                  <select
                    value={toolId}
                    onChange={(e) => setToolId(e.target.value)}
                    className="w-full rounded-xl border border-slate-200/60 bg-white/60 px-3.5 py-2.5 text-sm text-slate-800 outline-none backdrop-blur-sm transition-all focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
                  >
                    <option value="">Araç seç...</option>
                    {tools.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-500">
                    Başlık
                  </label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Örn: SEO makale yazarı"
                    className="w-full rounded-xl border border-slate-200/60 bg-white/60 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-300 outline-none backdrop-blur-sm transition-all focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-500">
                    Açıklama <span className="text-slate-400">(herkes görür)</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Bu prompt ne işe yarar? Kısa açıklama..."
                    rows={2}
                    className="w-full resize-none rounded-xl border border-slate-200/60 bg-white/60 px-3.5 py-2.5 text-sm text-slate-700 placeholder-slate-300 outline-none backdrop-blur-sm transition-all focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-500">
                    Ham Prompt{' '}
                    <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] text-amber-700">
                      Gizli — sadece kopyalanır
                    </span>
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Sen deneyimli bir SEO uzmanısın..."
                    rows={5}
                    className="w-full resize-none rounded-xl border border-slate-200/60 bg-white/60 px-3.5 py-2.5 font-mono text-xs text-slate-700 placeholder-slate-300 outline-none backdrop-blur-sm transition-all focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
                  />
                </div>

                <motion.button
                  onClick={handleSubmit}
                  disabled={saving}
                  whileTap={{ scale: 0.97 }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-500 py-2.5 text-sm font-medium text-white shadow-md shadow-violet-200/50 transition-all hover:bg-violet-600 disabled:opacity-60"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  {saving ? 'Paylaşılıyor...' : 'Paylaş'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
