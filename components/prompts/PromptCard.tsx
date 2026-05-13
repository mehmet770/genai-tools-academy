'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, BookOpen, Eye } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/contexts/ToastContext'
import { PromptDetailModal } from '@/components/prompts/PromptDetailModal'
import type { Prompt } from '@/lib/types'

type PromptWithRelations = Prompt & {
  profiles?: { username: string; avatar_url: string | null }
  tools?: { slug: string; name: string; logo_url: string }
}

interface PromptCardProps {
  prompt: PromptWithRelations
  index?: number
}

export function PromptCard({ prompt, index = 0 }: PromptCardProps) {
  const [copied, setCopied] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const { addToast } = useToast()

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
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
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: index * 0.04, ease: 'easeOut' }}
        onClick={() => setModalOpen(true)}
        className="group relative flex cursor-pointer flex-col gap-3 overflow-hidden rounded-2xl border border-white/65 bg-white/45 p-5 shadow-sm shadow-slate-200/30 backdrop-blur-xl transition-all duration-300 hover:border-white/80 hover:shadow-lg hover:shadow-slate-200/50"
      >
        {/* Light leak */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            {prompt.tools && (
              <Link
                href={`/tools/${prompt.tools.slug}`}
                onClick={(e) => e.stopPropagation()}
                className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100 transition-opacity hover:opacity-80"
              >
                {prompt.tools.logo_url ? (
                  <img
                    src={prompt.tools.logo_url}
                    alt={prompt.tools.name}
                    className="h-5 w-5 object-contain"
                  />
                ) : (
                  <BookOpen className="h-4 w-4 text-slate-400" />
                )}
              </Link>
            )}
            <div>
              <h3 className="text-sm font-semibold leading-tight text-slate-800">{prompt.title}</h3>
              {prompt.tools && (
                <p className="text-[11px] text-slate-400">{prompt.tools.name}</p>
              )}
            </div>
          </div>

          {/* Copy button — top-right, copies hidden content */}
          <motion.button
            onClick={handleCopy}
            whileTap={{ scale: 0.88 }}
            className={`flex shrink-0 items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-medium transition-all ${
              copied
                ? 'bg-emerald-50 text-emerald-600'
                : 'border border-slate-200/60 bg-white/60 text-slate-500 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600'
            }`}
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Kopyalandı' : 'Kopyala'}
          </motion.button>
        </div>

        {/* Public description (not the raw prompt) */}
        <p className="line-clamp-3 text-sm leading-relaxed text-slate-600">
          {prompt.description || (
            <span className="italic text-slate-400">Açıklama eklenmemiş — detaylar için tıkla.</span>
          )}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>{prompt.profiles?.username ?? 'Anonim'}</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" /> {prompt.views_count ?? 0}
            </span>
            <span className="flex items-center gap-1">
              <Copy className="h-3 w-3" /> {prompt.copies_count}
            </span>
          </div>
        </div>

        {/* "Detaylar" hint */}
        <div className="pointer-events-none absolute bottom-3 right-3 rounded-lg bg-slate-100/0 px-2 py-1 text-[10px] font-medium text-slate-300 opacity-0 transition-all duration-200 group-hover:bg-slate-100/80 group-hover:text-slate-500 group-hover:opacity-100">
          Detaylar →
        </div>
      </motion.div>

      <PromptDetailModal prompt={modalOpen ? prompt : null} onClose={() => setModalOpen(false)} />
    </>
  )
}
