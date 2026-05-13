'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GraduationCap, ChevronDown, BookOpen, ClipboardList, FileSearch, Users, Lightbulb, Copy, Check } from 'lucide-react'
import { ACADEMIC_SCENARIOS } from '@/lib/academic-data'
import type { AcademicScenario } from '@/lib/types'

const DIFFICULTY_COLORS = {
  'Başlangıç': 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
  'Orta': 'bg-amber-50 text-amber-700 border-amber-200/60',
  'İleri': 'bg-violet-50 text-violet-700 border-violet-200/60',
}

const SCENARIO_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'lesson-plan': BookOpen,
  'exam-questions': ClipboardList,
  'paper-analysis': FileSearch,
  'student-assessment': Users,
  default: Lightbulb,
}

function ScenarioCard({ scenario }: { scenario: AcademicScenario }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const Icon = SCENARIO_ICONS[scenario.id] ?? SCENARIO_ICONS.default

  const handleCopy = async () => {
    if (!scenario.promptExample) return
    await navigator.clipboard.writeText(scenario.promptExample)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/65 bg-white/40 shadow-sm shadow-slate-200/30 backdrop-blur-xl transition-all duration-300 hover:border-white/80 hover:shadow-md">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 px-5 py-4 text-left"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
          <Icon className="h-5 w-5 text-indigo-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm text-slate-800">{scenario.title}</span>
            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${DIFFICULTY_COLORS[scenario.difficulty]}`}>
              {scenario.difficulty}
            </span>
            {scenario.discipline && (
              <span className="rounded-full border border-slate-200/60 bg-slate-50 px-2 py-0.5 text-[10px] text-slate-500">
                {scenario.discipline}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-slate-500 line-clamp-1">{scenario.description}</p>
        </div>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="border-t border-slate-100/80 px-5 pb-5 pt-4">
              {/* Steps */}
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Adımlar</p>
              <ol className="space-y-2">
                {scenario.steps.map((step, i) => (
                  <li key={i} className="flex gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-600">
                      {i + 1}
                    </span>
                    <span className="text-sm leading-relaxed text-slate-700">{step}</span>
                  </li>
                ))}
              </ol>

              {/* Prompt example */}
              {scenario.promptExample && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Örnek Prompt</p>
                    <button
                      onClick={handleCopy}
                      className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition-all ${
                        copied
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-slate-50 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600'
                      }`}
                    >
                      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      {copied ? 'Kopyalandı' : 'Kopyala'}
                    </button>
                  </div>
                  <pre className="whitespace-pre-wrap rounded-xl border border-slate-100 bg-slate-50/80 p-3 font-mono text-xs leading-relaxed text-slate-600">
                    {scenario.promptExample}
                  </pre>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface AcademicUseCasesProps {
  toolSlug: string
  toolName: string
}

export function AcademicUseCases({ toolSlug, toolName }: AcademicUseCasesProps) {
  const scenarios = ACADEMIC_SCENARIOS[toolSlug]
  if (!scenarios?.length) return null

  return (
    <section className="mt-8">
      {/* Section header */}
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500">
          <GraduationCap className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-800">Eğitimde Nasıl Kullanılır?</h2>
          <p className="text-xs text-slate-400">{toolName} ile akademik senaryolar — adım adım rehber</p>
        </div>
      </div>

      <div className="space-y-3">
        {scenarios.map((scenario) => (
          <ScenarioCard key={scenario.id} scenario={scenario} />
        ))}
      </div>
    </section>
  )
}
