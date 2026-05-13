'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { AITool } from '@/lib/types'

const CATEGORY_LABELS: Record<AITool['category'], string> = {
  text: 'Metin', image: 'Görsel', audio: 'Ses', video: 'Video',
  code: 'Kod', data: 'Veri', multimodal: 'Çok Modlu',
  research: 'Araştırma', writing: 'Yazı',
}

const CATEGORY_STYLES: Record<AITool['category'], { badge: string; glow: string; logoRing: string }> = {
  text:       { badge: 'bg-blue-100 text-blue-700 border-blue-200',       glow: 'hover:shadow-blue-200/60',   logoRing: 'bg-blue-50 border-blue-200 text-blue-600' },
  image:      { badge: 'bg-pink-100 text-pink-700 border-pink-200',       glow: 'hover:shadow-pink-200/60',   logoRing: 'bg-pink-50 border-pink-200 text-pink-600' },
  audio:      { badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', glow: 'hover:shadow-emerald-200/60', logoRing: 'bg-emerald-50 border-emerald-200 text-emerald-600' },
  video:      { badge: 'bg-orange-100 text-orange-700 border-orange-200', glow: 'hover:shadow-orange-200/60', logoRing: 'bg-orange-50 border-orange-200 text-orange-600' },
  code:       { badge: 'bg-amber-100 text-amber-700 border-amber-200',    glow: 'hover:shadow-amber-200/60',  logoRing: 'bg-amber-50 border-amber-200 text-amber-600' },
  data:       { badge: 'bg-cyan-100 text-cyan-700 border-cyan-200',       glow: 'hover:shadow-cyan-200/60',   logoRing: 'bg-cyan-50 border-cyan-200 text-cyan-600' },
  multimodal: { badge: 'bg-violet-100 text-violet-700 border-violet-200', glow: 'hover:shadow-violet-200/60', logoRing: 'bg-violet-50 border-violet-200 text-violet-600' },
  research:   { badge: 'bg-indigo-100 text-indigo-700 border-indigo-200', glow: 'hover:shadow-indigo-200/60', logoRing: 'bg-indigo-50 border-indigo-200 text-indigo-600' },
  writing:    { badge: 'bg-rose-100 text-rose-700 border-rose-200',       glow: 'hover:shadow-rose-200/60',   logoRing: 'bg-rose-50 border-rose-200 text-rose-600' },
}

interface ToolCardProps { tool: AITool }

export function ToolCard({ tool }: ToolCardProps) {
  const styles = CATEGORY_STYLES[tool.category]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5, scale: 1.015 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="h-full"
    >
      <Link href={`/tools/${tool.slug}`} className="group block h-full">
        <div
          className={`glass relative flex h-full flex-col overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:shadow-xl ${styles.glow} hover:border-white/80`}
        >
          {/* Hover mesh light leak */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Logo + Category */}
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 ${styles.logoRing} text-lg font-bold shadow-sm`}>
              {tool.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={tool.logo_url} alt={tool.name} className="h-8 w-8 rounded-lg object-contain" />
              ) : (
                tool.name.charAt(0)
              )}
            </div>
            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles.badge}`}>
              {CATEGORY_LABELS[tool.category]}
            </span>
          </div>

          {/* Name + Tagline */}
          <h3 className="mb-1.5 font-semibold text-slate-800 transition-colors duration-200 group-hover:text-[var(--accent)]">
            {tool.name}
          </h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-slate-500">
            {tool.tagline}
          </p>

          {/* Feature tags */}
          {tool.features.length > 0 && (
            <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
              {tool.features.slice(0, 3).map((feature) => (
                <span
                  key={feature}
                  className="rounded-lg border border-slate-200/60 bg-slate-50/70 px-2 py-0.5 text-xs text-slate-500"
                >
                  {feature}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  )
}
