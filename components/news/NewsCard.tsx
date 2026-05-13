'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Clock, Tag } from 'lucide-react'

interface NewsItem {
  id: string; title: string; description: string | null; url: string;
  source: string; image_url: string | null; published_at: string | null;
  category: string; created_at: string;
}

interface NewsCardProps { item: NewsItem; index?: number }

function timeAgo(date: string | null): string {
  if (!date) return ''
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}d önce`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}sa önce`
  return `${Math.floor(hrs / 24)}g önce`
}

export function NewsCard({ item, index = 0 }: NewsCardProps) {
  return (
    <motion.a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.04, ease: 'easeOut' }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/65 bg-white/45 p-5 shadow-sm shadow-slate-200/30 backdrop-blur-xl transition-all duration-300 hover:border-white/80 hover:shadow-lg hover:shadow-slate-200/50"
    >
      {/* Light leak on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Source + time */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 rounded-full border border-indigo-200/60 bg-indigo-50 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-600">
          <Tag className="h-2.5 w-2.5" />
          {item.source}
        </span>
        <span className="flex items-center gap-1 text-xs text-slate-400">
          <Clock className="h-3 w-3" />
          {timeAgo(item.published_at)}
        </span>
      </div>

      {/* Title */}
      <h3 className="mb-2 line-clamp-2 text-sm font-semibold leading-snug text-slate-800 transition-colors group-hover:text-indigo-600">
        {item.title}
      </h3>

      {/* Description */}
      {item.description && (
        <p className="mb-4 line-clamp-3 text-xs leading-relaxed text-slate-500">
          {item.description}
        </p>
      )}

      {/* Read more */}
      <div className="mt-auto flex items-center gap-1 text-xs font-medium text-indigo-500">
        Devamını Oku <ExternalLink className="h-3 w-3" />
      </div>
    </motion.a>
  )
}
