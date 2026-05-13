'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check, X, Eye, BookOpen } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/contexts/ToastContext'
import type { Prompt } from '@/lib/types'

type PromptWithRelations = Prompt & {
  profiles?: { username: string; avatar_url: string | null }
  tools?: { slug: string; name: string; logo_url: string }
}

interface PromptDetailModalProps {
  prompt: PromptWithRelations | null
  onClose: () => void
}

export function PromptDetailModal({ prompt, onClose }: PromptDetailModalProps) {
  const [copied, setCopied] = useState(false)
  const { addToast } = useToast()

  // ── View tracking ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!prompt) return

    const trackView = async () => {
      const supabase = createClient()
      if (!supabase) return
      const { data: { user } } = await supabase.auth.getUser()
      await supabase.rpc('increment_prompt_views', {
        p_id: prompt.id,
        v_id: user?.id ?? null,
      })
    }

    trackView()
  }, [prompt?.id])

  const handleCopy = async () => {
    if (!prompt) return
    try {
      await navigator.clipboard.writeText(prompt.content)
      setCopied(true)
      addToast('Ham prompt kopyalandı!', 'success')
      setTimeout(() => setCopied(false), 2000)

      fetch('/api/prompts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: prompt.id }),
      }).catch(() => {})
    } catch {
      addToast('Kopyalama başarısız.', 'error')
    }
  }

  return (
    <AnimatePresence>
      {prompt && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/25 px-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 14 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/65 bg-white/90 shadow-2xl shadow-slate-300/30 backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100/80 px-6 py-4">
              <div className="flex items-center gap-2.5">
                {prompt.tools?.logo_url ? (
                  <img src={prompt.tools.logo_url} alt={prompt.tools.name} className="h-6 w-6 rounded-lg object-contain" />
                ) : (
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-violet-100">
                    <BookOpen className="h-3.5 w-3.5 text-violet-500" />
                  </div>
                )}
                <div>
                  <h2 className="text-sm font-semibold text-slate-800">{prompt.title}</h2>
                  {prompt.tools && (
                    <p className="text-[11px] text-slate-400">{prompt.tools.name}</p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-xl p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-5 p-6">
              {/* Public description */}
              {prompt.description ? (
                <div>
                  <p className="mb-1.5 text-xs font-medium text-slate-500">Açıklama</p>
                  <p className="rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-sm leading-relaxed text-slate-700">
                    {prompt.description}
                  </p>
                </div>
              ) : null}

              {/* Hidden raw prompt — copy only */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <p className="text-xs font-medium text-slate-500">
                    Ham Prompt
                    <span className="ml-1.5 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] text-amber-700">
                      Gizli — sadece kopyalanır
                    </span>
                  </p>
                  <motion.button
                    onClick={handleCopy}
                    whileTap={{ scale: 0.88 }}
                    className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                      copied
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]'
                    }`}
                  >
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? 'Kopyalandı!' : 'Kopyala'}
                  </motion.button>
                </div>
                {/* Blurred preview — content is hidden visually */}
                <div className="relative overflow-hidden rounded-xl border border-slate-100 bg-slate-50/80">
                  <pre className="select-none px-4 py-3 font-mono text-xs leading-relaxed text-slate-600 blur-sm">
                    {prompt.content}
                  </pre>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm backdrop-blur-sm">
                      <Copy className="h-3 w-3" />
                      İçeriği görmek için kopyala
                    </span>
                  </div>
                </div>
              </div>

              {/* Meta */}
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>
                  {prompt.profiles?.username ?? 'Anonim'} tarafından
                </span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" /> {prompt.views_count ?? 0} görüntülenme
                  </span>
                  <span className="flex items-center gap-1">
                    <Copy className="h-3 w-3" /> {prompt.copies_count} kopyalanma
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
