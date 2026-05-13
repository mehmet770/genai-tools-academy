import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Clock, CheckCircle2, ChevronRight, Target, BookOpen } from 'lucide-react'
import { LEARNING_PATHS } from '@/lib/academic-data'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const path = LEARNING_PATHS.find((p) => p.slug === slug)
  if (!path) return { title: 'Yol Haritası Bulunamadı' }
  return { title: path.title, description: path.description }
}

const LEVEL_COLORS = {
  'Başlangıç': 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
  'Orta': 'bg-amber-50 text-amber-700 border-amber-200/60',
  'İleri': 'bg-violet-50 text-violet-700 border-violet-200/60',
}

const COLOR_ACCENTS: Record<string, { gradient: string; ring: string; text: string; bg: string }> = {
  indigo: { gradient: 'from-indigo-500 to-blue-500', ring: 'ring-indigo-200', text: 'text-indigo-600', bg: 'bg-indigo-50' },
  violet: { gradient: 'from-violet-500 to-indigo-500', ring: 'ring-violet-200', text: 'text-violet-600', bg: 'bg-violet-50' },
  pink: { gradient: 'from-pink-500 to-rose-500', ring: 'ring-pink-200', text: 'text-pink-600', bg: 'bg-pink-50' },
  emerald: { gradient: 'from-emerald-500 to-teal-500', ring: 'ring-emerald-200', text: 'text-emerald-600', bg: 'bg-emerald-50' },
}

export default async function PathDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const path = LEARNING_PATHS.find((p) => p.slug === slug)
  if (!path) notFound()

  const accent = COLOR_ACCENTS[path.color] ?? COLOR_ACCENTS.indigo

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      {/* Back */}
      <Link
        href="/paths"
        className="mb-8 inline-flex items-center gap-1.5 rounded-xl border border-slate-200/60 bg-white/50 px-3 py-2 text-sm text-slate-500 backdrop-blur-sm transition-all hover:bg-white/80 hover:text-slate-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Tüm Yol Haritaları
      </Link>

      {/* Hero */}
      <div className="mb-8 overflow-hidden rounded-3xl border border-white/65 bg-white/45 p-8 shadow-sm backdrop-blur-xl">
        <div className="flex items-start gap-5">
          <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${accent.gradient} text-3xl shadow-lg`}>
            {path.icon}
          </div>
          <div className="flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${LEVEL_COLORS[path.level]}`}>
                {path.level}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Clock className="h-3.5 w-3.5" />
                {path.duration}
              </span>
              <span className="text-xs text-slate-400">{path.steps.length} adım</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-800">{path.title}</h1>
            <p className={`font-medium ${accent.text}`}>{path.subtitle}</p>
          </div>
        </div>

        <p className="mt-5 leading-relaxed text-slate-600">{path.description}</p>

        {/* Target audience */}
        <div className={`mt-5 flex items-center gap-2 rounded-xl border ${accent.ring.replace('ring', 'border')} ${accent.bg} px-4 py-3`}>
          <BookOpen className={`h-4 w-4 ${accent.text}`} />
          <span className="text-sm text-slate-700">
            <span className="font-semibold">Hedef Kitle:</span> {path.targetAudience}
          </span>
        </div>
      </div>

      {/* Prerequisites */}
      {path.prerequisites.length > 0 && (
        <div className="mb-6 rounded-2xl border border-amber-200/60 bg-amber-50/40 px-5 py-4 backdrop-blur-xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-amber-700">Ön Koşullar</p>
          <div className="flex flex-wrap gap-2">
            {path.prerequisites.map((p) => (
              <span key={p} className="rounded-full border border-amber-200/60 bg-white/60 px-3 py-1 text-xs text-amber-800">
                {p}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Steps */}
      <div className="mb-8">
        <h2 className="mb-5 text-base font-bold text-slate-800">Adım Adım Rehber</h2>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-200/80" />

          <div className="space-y-4">
            {path.steps.map((step, i) => (
              <div key={i} className="relative flex gap-5">
                {/* Step number */}
                <div className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${accent.gradient} text-sm font-bold text-white shadow-md`}>
                  {i + 1}
                </div>

                {/* Step content */}
                <div className="flex-1 overflow-hidden rounded-2xl border border-white/65 bg-white/45 p-5 shadow-sm backdrop-blur-xl">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <Link
                      href={`/tools/${step.toolSlug}`}
                      className={`font-semibold text-sm ${accent.text} hover:underline`}
                    >
                      {step.toolName}
                    </Link>
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Clock className="h-3 w-3" />
                      {step.duration}
                    </span>
                  </div>

                  <p className="mb-3 text-sm leading-relaxed text-slate-700">{step.action}</p>

                  <div className={`flex items-start gap-2 rounded-xl ${accent.bg} px-3 py-2`}>
                    <Target className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${accent.text}`} />
                    <span className="text-xs text-slate-700">
                      <span className="font-medium">Çıktı:</span> {step.outcome}
                    </span>
                  </div>

                  {step.promptHint && (
                    <div className="mt-2 flex items-start gap-2 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2">
                      <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
                      <span className="font-mono text-xs text-slate-600">{step.promptHint}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Outcomes */}
      <div className="rounded-2xl border border-white/65 bg-white/45 p-6 shadow-sm backdrop-blur-xl">
        <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-800">
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          Bu Yol Haritasını Tamamlayınca
        </h2>
        <ul className="space-y-3">
          {path.outcomes.map((outcome, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              <span className="text-sm leading-relaxed text-slate-700">{outcome}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
