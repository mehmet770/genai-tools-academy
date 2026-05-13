'use client'

import { useState } from 'react'
import { ExternalLink, GitBranch, Lock, Globe, Cpu, Sparkles, ArrowRight, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ALT_CATEGORIES, type Alternative, type AltCategory } from '@/lib/alternatives-data'

// ── Styles ────────────────────────────────────────────────────────────────────

const TAG_COLORS: Record<string, string> = {
  'Ücretsiz':         'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Açık Kaynak':      'bg-indigo-100 text-indigo-700 border-indigo-200',
  'Yerel Çalışır':    'bg-violet-100 text-violet-700 border-violet-200',
  'Gizlilik Odaklı':  'bg-slate-100  text-slate-700  border-slate-200',
  'Türkçe Destekli':  'bg-red-100    text-red-700    border-red-200',
  'Akademik':         'bg-blue-100   text-blue-700   border-blue-200',
  'Hızlı':            'bg-amber-100  text-amber-700  border-amber-200',
  'Çok Dilli':        'bg-teal-100   text-teal-700   border-teal-200',
  'Ücretli':          'bg-orange-100 text-orange-700 border-orange-200',
  'API':              'bg-purple-100 text-purple-700 border-purple-200',
  'Tarayıcı':         'bg-sky-100    text-sky-700    border-sky-200',
  'Mobil':            'bg-pink-100   text-pink-700   border-pink-200',
  'Kurumsal':         'bg-gray-100   text-gray-700   border-gray-200',
}

const CARD_GRADIENT: Record<string, string> = {
  sohbet:        'from-blue-50   to-cyan-50/60   border-blue-200/70',
  kod:           'from-amber-50  to-yellow-50/60 border-amber-200/70',
  gorsel:        'from-pink-50   to-rose-50/60   border-pink-200/70',
  ses:           'from-emerald-50 to-teal-50/60  border-emerald-200/70',
  yerel:         'from-violet-50 to-purple-50/60 border-violet-200/70',
  'acik-kaynak': 'from-indigo-50 to-blue-50/60  border-indigo-200/70',
  arastirma:     'from-cyan-50   to-sky-50/60   border-cyan-200/70',
}

const PICKER_SELECTED: Record<string, string> = {
  sohbet:        'ring-blue-400   bg-blue-600   text-white',
  kod:           'ring-amber-400  bg-amber-500  text-white',
  gorsel:        'ring-pink-400   bg-pink-500   text-white',
  ses:           'ring-emerald-400 bg-emerald-600 text-white',
  yerel:         'ring-violet-400 bg-violet-600 text-white',
  'acik-kaynak': 'ring-indigo-400 bg-indigo-600 text-white',
  arastirma:     'ring-cyan-400   bg-cyan-600   text-white',
}

const PICKER_ICON_BG: Record<string, string> = {
  sohbet:        'bg-blue-100',
  kod:           'bg-amber-100',
  gorsel:        'bg-pink-100',
  ses:           'bg-emerald-100',
  yerel:         'bg-violet-100',
  'acik-kaynak': 'bg-indigo-100',
  arastirma:     'bg-cyan-100',
}

// ── Alternative card ──────────────────────────────────────────────────────────

function AlternativeCard({ alt }: { alt: Alternative }) {
  return (
    <div className={`flex flex-col gap-3 rounded-2xl border bg-gradient-to-br p-5 transition-all duration-200 hover:shadow-md ${CARD_GRADIENT[alt.category] ?? ''}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-col">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-sm font-semibold text-slate-800">{alt.name}</span>
            {alt.addedByUs && (
              <span className="flex shrink-0 items-center gap-0.5 rounded-full bg-[var(--accent)]/10 px-1.5 py-0.5 text-[10px] font-medium text-[var(--accent)]">
                <Sparkles className="h-2.5 w-2.5" /> Yeni
              </span>
            )}
          </div>
          <p className="mt-0.5 text-[11px] font-medium text-[var(--accent)]">{alt.highlight}</p>
        </div>
        <a
          href={alt.website}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-lg border border-slate-200 bg-white/80 p-1.5 text-slate-400 transition hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
          aria-label={`${alt.name} web sitesi`}
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      <p className="text-xs leading-relaxed text-slate-600">{alt.description}</p>

      <div className="flex flex-wrap gap-1.5">
        {alt.tags.map((tag) => (
          <span
            key={tag}
            className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${TAG_COLORS[tag] ?? 'bg-slate-100 text-slate-600 border-slate-200'}`}
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-3 pt-0.5">
        {alt.openSource && (
          <span className="flex items-center gap-1 text-[10px] text-slate-400">
            <GitBranch className="h-3 w-3" /> Açık kaynak
          </span>
        )}
        {alt.tags.includes('Yerel Çalışır') && (
          <span className="flex items-center gap-1 text-[10px] text-slate-400">
            <Cpu className="h-3 w-3" /> Yerel
          </span>
        )}
        {alt.tags.includes('Gizlilik Odaklı') && (
          <span className="flex items-center gap-1 text-[10px] text-slate-400">
            <Lock className="h-3 w-3" /> Gizlilik
          </span>
        )}
        {!alt.tags.includes('Yerel Çalışır') && !alt.openSource && (
          <span className="flex items-center gap-1 text-[10px] text-slate-400">
            <Globe className="h-3 w-3" /> Bulut
          </span>
        )}
      </div>
    </div>
  )
}

// ── Tool picker card ──────────────────────────────────────────────────────────

interface PickerCardProps {
  cat: typeof ALT_CATEGORIES[number]
  selected: boolean
  onClick: () => void
}

function PickerCard({ cat, selected, onClick }: PickerCardProps) {
  return (
    <button
      onClick={onClick}
      className={[
        'group relative flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition-all duration-200',
        selected
          ? `ring-2 ${PICKER_SELECTED[cat.id]} border-transparent shadow-lg`
          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:shadow-md',
      ].join(' ')}
    >
      {/* Icon bubble */}
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl transition-all ${selected ? 'bg-white/20' : PICKER_ICON_BG[cat.id]}`}>
        {cat.icon}
      </div>

      {/* Tool name */}
      <div>
        <p className={`text-sm font-bold leading-tight ${selected ? 'text-white' : 'text-slate-800'}`}>
          {cat.mainTool}
        </p>
        <p className={`mt-0.5 text-[10px] ${selected ? 'text-white/80' : 'text-slate-400'}`}>
          {cat.label}
        </p>
      </div>

      {/* Count badge */}
      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${selected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
        {cat.data.length} alternatif
      </span>

      {/* Arrow indicator when selected */}
      {selected && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-3 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="h-5 w-5 text-current drop-shadow" style={{ color: 'inherit' }} />
        </motion.div>
      )}
    </button>
  )
}

// ── Main section ──────────────────────────────────────────────────────────────

export function AlternativesSection() {
  const [activeId, setActiveId] = useState<AltCategory | null>(null)
  const activeCategory = ALT_CATEGORIES.find((c) => c.id === activeId)

  function handlePick(id: AltCategory) {
    setActiveId((prev) => (prev === id ? null : id))
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">

      {/* Page header */}
      <div className="mb-10 text-center">
        <h1 className="mb-3 text-3xl font-bold text-slate-900 sm:text-4xl">
          Alternatif Zekalar
        </h1>
        <p className="mx-auto max-w-2xl text-slate-500">
          Hangi aracın alternatifini arıyorsunuz? Aşağıdan seçin, en iyi alternatifleri listeleyelim.
        </p>
      </div>

      {/* Tool picker grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
        {ALT_CATEGORIES.map((cat) => (
          <PickerCard
            key={cat.id}
            cat={cat}
            selected={activeId === cat.id}
            onClick={() => handlePick(cat.id as AltCategory)}
          />
        ))}
      </div>

      {/* Alternatives panel */}
      <AnimatePresence mode="wait">
        {activeCategory && (
          <motion.div
            key={activeCategory.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="mt-10"
          >
            {/* Section header */}
            <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{activeCategory.icon}</span>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">
                    {activeCategory.mainTool} alternatifleri
                  </h2>
                  <p className="text-sm text-slate-500">{activeCategory.mainToolTagline}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {activeCategory.data.length} araç listelendi
                </span>
                {activeCategory.mainToolWebsite && (
                  <a
                    href={activeCategory.mainToolWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-500 transition hover:border-slate-300 hover:text-slate-800"
                  >
                    <ExternalLink className="h-3 w-3" />
                    {activeCategory.mainTool}
                    <ArrowRight className="h-3 w-3 opacity-50" />
                  </a>
                )}
              </div>
            </div>

            {/* Alternatives grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {activeCategory.data.map((alt) => (
                <AlternativeCard key={alt.name + alt.website} alt={alt} />
              ))}
            </div>

            {/* Footer note */}
            {activeCategory.data.some((a) => a.addedByUs) && (
              <p className="mt-6 text-center text-xs text-slate-400">
                <span className="mr-1 inline-flex items-center gap-0.5 rounded-full bg-[var(--accent)]/10 px-1.5 py-0.5 text-[10px] font-medium text-[var(--accent)]">
                  <Sparkles className="h-2.5 w-2.5" /> Yeni
                </span>
                işaretli araçlar kaynak listesine GENAI Academy tarafından eklenmiştir.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state — nothing selected yet */}
      {!activeCategory && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-12 flex flex-col items-center gap-2 text-center text-slate-400"
        >
          <span className="text-4xl">👆</span>
          <p className="text-sm">Yukarıdan bir araç seçin</p>
        </motion.div>
      )}

    </section>
  )
}
