'use client'

import { useState } from 'react'
import { ExternalLink, Tag } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { RobotScene, type RobotEmotion } from '@/components/3d/RobotScene'
import { TypingText } from '@/components/ai/TypingText'
import type { AITool, RobotOption } from '@/lib/types'

const CATEGORY_LABELS: Record<string, string> = {
  text: 'Metin', image: 'Görsel', audio: 'Ses',
  video: 'Video', code: 'Kod', data: 'Veri', multimodal: 'Çok Modlu',
}

const CATEGORY_TR: Record<string, string> = {
  text: 'metin ve dil', image: 'görsel üretme', audio: 'ses ve müzik',
  video: 'video üretme', code: 'kod yazma ve geliştirme',
  data: 'veri analizi', multimodal: 'çok modlu yapay zeka',
}

const EMOTION_MAP: Record<string, RobotEmotion> = {
  intro: 'waving', features: 'happy', usecase: 'thinking', start: 'happy',
}

// 3D world-space X anchor near the description column (left side of card)
const ROBOT_ANCHOR_X = -1.4

function buildFallbackOptions(tool: AITool): RobotOption[] {
  return [
    {
      id: 'intro', label: 'Bu nedir?',
      content: `${tool.name} — ${tool.tagline}`,
    },
    {
      id: 'features', label: 'Özellikler',
      content: tool.features.length > 0
        ? `${tool.name} öne çıkan özellikleri: ${tool.features.join(', ')}.`
        : `${tool.name} hakkında özellik bilgisi henüz eklenmedi.`,
    },
    {
      id: 'usecase', label: 'Kimler için?',
      content: `${tool.name}, özellikle ${CATEGORY_TR[tool.category] ?? tool.category} alanında çalışanlar için idealdir.`,
    },
    {
      id: 'start', label: 'Nasıl başlarım?',
      content: `${tool.name} kullanmaya başlamak için: ${tool.website_url}`,
    },
  ]
}

interface ToolInteractionProps {
  tool: AITool
}

export function ToolInteraction({ tool }: ToolInteractionProps) {
  const options =
    tool.robot_options && tool.robot_options.length > 0
      ? tool.robot_options
      : buildFallbackOptions(tool)

  const [activeId, setActiveId] = useState<string | null>(null)
  const [activeText, setActiveText] = useState(tool.description || tool.tagline)
  const [emotion, setEmotion] = useState<RobotEmotion>('idle')
  // flyTrigger increments on every button click so robot always flies even when same button repeats
  const [flyTrigger, setFlyTrigger] = useState(0)

  function select(opt: RobotOption) {
    setActiveId(opt.id)
    setActiveText(opt.content)
    setEmotion(EMOTION_MAP[opt.id] ?? 'idle')
    setFlyTrigger((n) => n + 1)
  }

  return (
    // Outer wrapper gives the robot room to walk around the card on all sides
    <div className="relative px-10 py-12">

      {/* ── Robot walks around the card perimeter ─────────────── */}
      <RobotScene
        className="pointer-events-none absolute inset-0 z-0"
        emotion={emotion}
        perimeter
      />

      {/* ── Card: sits inside the outer wrapper ──────────────── */}
      <section className="relative z-10 min-h-[520px] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background)]">

      {/* ── Content layer ────────────────────────────────────── */}
      <div className="relative flex min-h-[520px] flex-col gap-6 p-6 sm:p-8 lg:p-10">

        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--muted)]/90 text-xl font-bold text-[var(--accent)] backdrop-blur-sm">
            {tool.name.charAt(0)}
          </div>
          <div>
            <div className="mb-1 flex items-center gap-2">
              <h1 className="text-2xl font-bold text-[var(--foreground)]">
                {tool.name}
              </h1>
              <span className="rounded-full border border-[var(--border)] bg-[var(--muted)]/80 px-2.5 py-0.5 text-xs text-[var(--muted-foreground)] backdrop-blur-sm">
                {CATEGORY_LABELS[tool.category] ?? tool.category}
              </span>
            </div>
            <p className="text-[var(--muted-foreground)]">{tool.tagline}</p>
          </div>
        </div>

        {/* Description / Robot response — unified typing area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeId ?? '__default'}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="min-h-[5.5rem] rounded-xl border border-[var(--accent)]/20 bg-[var(--muted)]/70 p-4 backdrop-blur-sm"
          >
            <p className="text-sm leading-relaxed text-[var(--foreground)]">
              {activeId ? <TypingText text={activeText} /> : activeText}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Feature chips */}
        {tool.features.length > 0 && (
          <div>
            <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-[var(--foreground)]">
              <Tag className="h-4 w-4 text-[var(--accent)]" />
              Özellikler
            </h2>
            <div className="flex flex-wrap gap-2">
              {tool.features.map((f) => (
                <span
                  key={f}
                  className="rounded-lg border border-[var(--border)] bg-[var(--muted)]/80 px-3 py-1.5 text-sm text-[var(--foreground)] backdrop-blur-sm"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Bottom bar */}
        <div className="mt-auto flex flex-wrap items-center gap-3 pt-2">
          <a
            href={tool.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)]"
          >
            <ExternalLink className="h-4 w-4" />
            Web Sitesini Aç
          </a>

          <div className="flex flex-wrap gap-2">
            {options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => select(opt)}
                className={[
                  'rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200 backdrop-blur-sm',
                  activeId === opt.id
                    ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]'
                    : 'border-[var(--border)] bg-[var(--muted)]/70 text-[var(--muted-foreground)] hover:border-[var(--accent)]/40 hover:text-[var(--foreground)]',
                ].join(' ')}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      </section>
    </div>
  )
}
