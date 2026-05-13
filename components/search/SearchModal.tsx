'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, ArrowRight, Loader2 } from 'lucide-react'
import Link from 'next/link'
import type { AITool } from '@/lib/types'

interface SearchModalProps {
  open: boolean
  onClose: () => void
}

const CATEGORY_LABELS: Record<string, string> = {
  text: 'Metin', image: 'Görsel', audio: 'Ses',
  video: 'Video', code: 'Kod', data: 'Veri', multimodal: 'Çok Modlu',
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<AITool[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const { tools } = await res.json()
        setResults(tools ?? [])
      } catch { setResults([]) }
      finally { setLoading(false) }
    }, 280)
    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    if (!open) { setQuery(''); setResults([]) }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onClose}
          className="fixed inset-0 z-[60] flex items-start justify-center bg-slate-900/20 pt-[12vh] backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/65 bg-white/80 shadow-2xl shadow-slate-300/40 backdrop-blur-2xl"
          >
            {/* Input */}
            <div className="flex items-center gap-3 border-b border-slate-100/80 px-4 py-3.5">
              <Search className="h-4.5 w-4.5 shrink-0 text-slate-400" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Araç ara... (ChatGPT, görsel, kod...)"
                className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none"
              />
              {loading && <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />}
              {query && !loading && (
                <button onClick={() => setQuery('')} className="text-slate-400 transition-colors hover:text-slate-600">
                  <X className="h-4 w-4" />
                </button>
              )}
              <kbd className="hidden rounded-lg border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 sm:block">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto p-2">
              {!loading && results.length === 0 && query && (
                <p className="py-10 text-center text-sm text-slate-400">
                  &quot;{query}&quot; için sonuç bulunamadı.
                </p>
              )}
              {!loading && !query && (
                <p className="py-8 text-center text-xs text-slate-400">
                  Araç adı, kategori veya özellik yaz
                  <span className="mt-1 block text-slate-300">⌘K / Ctrl+K ile aç</span>
                </p>
              )}
              {results.map((tool) => (
                <Link
                  key={tool.id}
                  href={`/tools/${tool.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-indigo-50/80"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-slate-100 to-slate-200">
                    {tool.logo_url ? (
                      <img
                        src={tool.logo_url}
                        alt={tool.name}
                        className="h-6 w-6 rounded object-contain"
                      />
                    ) : (
                      <span className="text-base">🤖</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800">{tool.name}</p>
                    <p className="truncate text-xs text-slate-400">{tool.tagline}</p>
                  </div>
                  <span className="shrink-0 rounded-full border border-slate-200/60 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-400">
                    {CATEGORY_LABELS[tool.category] ?? tool.category}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-300" />
                </Link>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
