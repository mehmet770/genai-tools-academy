'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Newspaper } from 'lucide-react'
import { NewsCard } from '@/components/news/NewsCard'
import type { NewsItem } from '@/lib/types'

const SOURCES = ['Tümü', 'TechCrunch', 'VentureBeat', 'Wired', 'AI News']

export function NewsGrid({ initialNews }: { initialNews: NewsItem[] }) {
  const [source, setSource] = useState('Tümü')

  const filtered =
    source === 'Tümü' ? initialNews : initialNews.filter((n) => n.source === source)

  return (
    <div>
      {/* Source filter */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {SOURCES.map((s) => (
          <button
            key={s}
            onClick={() => setSource(s)}
            className={`shrink-0 rounded-xl px-3 py-1.5 text-sm font-medium transition-all ${
              source === s
                ? 'bg-indigo-500 text-white shadow-md shadow-indigo-200/60'
                : 'border border-slate-200/60 bg-white/50 text-slate-500 backdrop-blur-sm hover:bg-white/80'
            }`}
          >
            {s}
          </button>
        ))}
        <span className="ml-auto shrink-0 self-center pr-1 text-xs text-slate-400">
          {filtered.length} haber
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-28 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100">
            <Newspaper className="h-7 w-7 text-slate-300" />
          </div>
          <p className="text-sm text-slate-400">
            Henüz haber yok — &quot;Haberleri Yenile&quot; butonuna bas.
          </p>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
              >
                <NewsCard item={item} index={i} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}
