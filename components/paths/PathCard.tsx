'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Clock, Users, ArrowRight, ChevronRight } from 'lucide-react'
import type { LearningPath } from '@/lib/types'

const LEVEL_COLORS = {
  'Başlangıç': 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
  'Orta': 'bg-amber-50 text-amber-700 border-amber-200/60',
  'İleri': 'bg-violet-50 text-violet-700 border-violet-200/60',
}

const COLOR_ACCENTS: Record<string, string> = {
  indigo: 'from-indigo-500 to-blue-500',
  violet: 'from-violet-500 to-indigo-500',
  pink: 'from-pink-500 to-rose-500',
  emerald: 'from-emerald-500 to-teal-500',
}

interface PathCardProps {
  path: LearningPath
  index?: number
}

export function PathCard({ path, index = 0 }: PathCardProps) {
  const gradient = COLOR_ACCENTS[path.color] ?? COLOR_ACCENTS.indigo

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.06, ease: 'easeOut' }}
    >
      <Link
        href={`/paths/${path.slug}`}
        className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/65 bg-white/45 p-6 shadow-sm shadow-slate-200/30 backdrop-blur-xl transition-all duration-300 hover:border-white/80 hover:shadow-lg hover:shadow-slate-200/50"
      >
        {/* Light leak */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Header */}
        <div className="mb-4 flex items-start gap-4">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-2xl shadow-md`}>
            {path.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">
              {path.title}
            </h3>
            <p className="text-sm text-slate-500">{path.subtitle}</p>
          </div>
        </div>

        <p className="mb-5 text-sm leading-relaxed text-slate-600 line-clamp-2">
          {path.description}
        </p>

        {/* Steps preview */}
        <div className="mb-5 flex items-center gap-1 overflow-hidden">
          {path.steps.slice(0, 4).map((step, i) => (
            <div key={i} className="flex items-center gap-1">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600">
                {i + 1}
              </span>
              <span className="hidden text-xs text-slate-500 sm:block line-clamp-1 max-w-[80px]">
                {step.toolName}
              </span>
              {i < Math.min(path.steps.length - 1, 3) && (
                <ChevronRight className="h-3 w-3 shrink-0 text-slate-300" />
              )}
            </div>
          ))}
          {path.steps.length > 4 && (
            <span className="ml-1 text-xs text-slate-400">+{path.steps.length - 4}</span>
          )}
        </div>

        {/* Meta */}
        <div className="mt-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${LEVEL_COLORS[path.level]}`}>
              {path.level}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Clock className="h-3.5 w-3.5" />
              {path.duration}
            </span>
          </div>
          <span className="flex items-center gap-1 text-xs font-medium text-indigo-500 opacity-0 transition-opacity group-hover:opacity-100">
            Başla <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </Link>
    </motion.div>
  )
}
