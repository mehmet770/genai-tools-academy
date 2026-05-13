'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GitCompare, ExternalLink, Check, Minus } from 'lucide-react'
import Link from 'next/link'
import type { AITool } from '@/lib/types'

const CATEGORY_LABELS: Record<string, string> = {
  text: 'Metin', image: 'Görsel', audio: 'Ses',
  video: 'Video', code: 'Kod', data: 'Veri', multimodal: 'Çok Modlu',
}

interface CompareSectionProps {
  tools: AITool[]
}

export function CompareSection({ tools }: CompareSectionProps) {
  const [leftSlug, setLeftSlug] = useState<string>(tools[0]?.slug ?? '')
  const [rightSlug, setRightSlug] = useState<string>(tools[1]?.slug ?? '')

  const left = tools.find((t) => t.slug === leftSlug) ?? null
  const right = tools.find((t) => t.slug === rightSlug) ?? null

  const maxFeatures = Math.max(left?.features.length ?? 0, right?.features.length ?? 0)

  return (
    <div>
      {/* Selectors */}
      <div className="mb-8 grid grid-cols-2 gap-4">
        {([['left', leftSlug, setLeftSlug], ['right', rightSlug, setRightSlug]] as const).map(
          ([side, value, setter]) => (
            <div key={side}>
              <label className="mb-1.5 block text-xs font-medium text-slate-500">
                {side === 'left' ? 'Birinci Araç' : 'İkinci Araç'}
              </label>
              <select
                value={value}
                onChange={(e) => setter(e.target.value)}
                className="w-full rounded-xl border border-slate-200/60 bg-white/60 px-3.5 py-2.5 text-sm text-slate-800 outline-none backdrop-blur-sm transition-all focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
              >
                {tools.map((t) => (
                  <option key={t.id} value={t.slug}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          )
        )}
      </div>

      <AnimatePresence mode="wait">
        {left && right ? (
          <motion.div
            key={`${leftSlug}-${rightSlug}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.22 }}
          >
            {/* Tool headers */}
            <div className="mb-4 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
              {[left, right].map((tool, i) => (
                <div
                  key={tool.id}
                  className={`rounded-2xl border border-white/65 bg-white/45 p-5 shadow-sm shadow-slate-200/30 backdrop-blur-xl ${
                    i === 1 ? 'col-start-3' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
                      {tool.logo_url ? (
                        <img src={tool.logo_url} alt={tool.name} className="h-8 w-8 object-contain" />
                      ) : (
                        <span className="text-xl">🤖</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate font-bold text-slate-800">{tool.name}</h3>
                      <span className="inline-block rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-600">
                        {CATEGORY_LABELS[tool.category]}
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-slate-500">
                    {tool.tagline}
                  </p>
                  <a
                    href={tool.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-indigo-500 hover:text-indigo-600"
                  >
                    Website <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              ))}
              <div className="col-start-2 flex h-10 w-10 items-center justify-center self-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500">
                <GitCompare className="h-5 w-5 text-white" />
              </div>
            </div>

            {/* Comparison table */}
            <div className="overflow-hidden rounded-2xl border border-white/65 bg-white/45 shadow-sm shadow-slate-200/30 backdrop-blur-xl">
              {/* Category row */}
              <div className="grid grid-cols-[1fr_auto_1fr] border-b border-slate-100/80">
                <div className="px-5 py-3.5">
                  <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">
                    {CATEGORY_LABELS[left.category]}
                  </span>
                </div>
                <div className="flex items-center border-x border-slate-100/80 px-4 py-3.5">
                  <span className="text-xs font-semibold text-slate-400">KATEGORİ</span>
                </div>
                <div className="px-5 py-3.5">
                  <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">
                    {CATEGORY_LABELS[right.category]}
                  </span>
                </div>
              </div>

              {/* Features rows */}
              <div className="border-b border-slate-100/80 px-5 py-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Özellikler
                </span>
              </div>
              {Array.from({ length: maxFeatures }).map((_, i) => {
                const lFeat = left.features[i]
                const rFeat = right.features[i]
                const same =
                  lFeat && rFeat && lFeat.toLowerCase() === rFeat.toLowerCase()
                return (
                  <div
                    key={i}
                    className={`grid grid-cols-[1fr_auto_1fr] border-b border-slate-100/60 last:border-0 ${
                      same ? 'bg-emerald-50/30' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2 px-5 py-3">
                      {lFeat ? (
                        <>
                          <Check className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                          <span className="text-sm text-slate-700">{lFeat}</span>
                        </>
                      ) : (
                        <Minus className="h-3.5 w-3.5 text-slate-300" />
                      )}
                    </div>
                    <div className="w-px bg-slate-100/80" />
                    <div className="flex items-center gap-2 px-5 py-3">
                      {rFeat ? (
                        <>
                          <Check className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                          <span className="text-sm text-slate-700">{rFeat}</span>
                        </>
                      ) : (
                        <Minus className="h-3.5 w-3.5 text-slate-300" />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* CTA row */}
            <div className="mt-4 grid grid-cols-2 gap-4">
              {[left, right].map((tool) => (
                <Link
                  key={tool.id}
                  href={`/tools/${tool.slug}`}
                  className="flex items-center justify-center gap-2 rounded-xl border border-indigo-200/60 bg-indigo-50/60 py-2.5 text-sm font-medium text-indigo-600 backdrop-blur-sm transition-all hover:bg-indigo-100/80"
                >
                  {tool.name} hakkında daha fazla →
                </Link>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-24 text-center">
            <GitCompare className="h-10 w-10 text-slate-200" />
            <p className="text-sm text-slate-400">İki araç seçerek karşılaştırmaya başla.</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
