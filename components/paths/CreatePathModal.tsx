'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Trash2, Loader2, GripVertical } from 'lucide-react'
import { useToast } from '@/contexts/ToastContext'
import { useRouter } from 'next/navigation'
import type { UserPathStep } from '@/lib/types'

const ICON_OPTIONS = ['🗺️', '🚀', '📚', '🎯', '💡', '🔬', '🛠️', '🌱', '🎓', '⚗️', '🧩', '📊']

interface CreatePathModalProps {
  open: boolean
  onClose: () => void
}

const emptyStep = (n: number): UserPathStep => ({
  step: n,
  title: '',
  description: '',
  tool: '',
  duration: '',
})

export function CreatePathModal({ open, onClose }: CreatePathModalProps) {
  const [title, setTitle]       = useState('')
  const [description, setDesc]  = useState('')
  const [icon, setIcon]         = useState('🗺️')
  const [steps, setSteps]       = useState<UserPathStep[]>([emptyStep(1), emptyStep(2)])
  const [saving, setSaving]     = useState(false)
  const { addToast }            = useToast()
  const router                  = useRouter()

  function addStep() {
    setSteps((s) => [...s, emptyStep(s.length + 1)])
  }

  function removeStep(i: number) {
    setSteps((s) => s.filter((_, idx) => idx !== i).map((step, idx) => ({ ...step, step: idx + 1 })))
  }

  function updateStep(i: number, field: keyof UserPathStep, value: string | number) {
    setSteps((s) => s.map((step, idx) => idx === i ? { ...step, [field]: value } : step))
  }

  async function handleSubmit() {
    if (!title.trim()) { addToast('Başlık gerekli', 'warning'); return }
    if (steps.some((s) => !s.title.trim())) { addToast('Tüm adım başlıkları dolu olmalı', 'warning'); return }

    setSaving(true)
    try {
      const res = await fetch('/api/paths', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, icon, steps }),
      })
      const json = await res.json()
      if (!res.ok) { addToast(json.error ?? 'Bir hata oluştu', 'error'); return }
      addToast('Yol haritanız paylaşıldı!', 'success')
      onClose()
      setTitle(''); setDesc(''); setIcon('🗺️')
      setSteps([emptyStep(1), emptyStep(2)])
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/25 px-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 14 }}
            transition={{ duration: 0.22 }}
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/65 bg-white/95 shadow-2xl shadow-slate-300/30 backdrop-blur-2xl"
          >
            {/* Modal header */}
            <div className="flex shrink-0 items-center justify-between border-b border-slate-100/80 px-6 py-4">
              <h2 className="font-semibold text-slate-800">Yol Haritası Oluştur</h2>
              <button onClick={onClose} className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="overflow-y-auto">
              <div className="space-y-5 p-6">
                {/* Icon + Title row */}
                <div className="flex gap-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-500">İkon</label>
                    <div className="flex flex-wrap gap-1.5">
                      {ICON_OPTIONS.map((em) => (
                        <button
                          key={em}
                          onClick={() => setIcon(em)}
                          className={`h-9 w-9 rounded-xl text-lg transition-all ${
                            icon === em
                              ? 'bg-indigo-100 ring-2 ring-indigo-300'
                              : 'bg-slate-50 hover:bg-slate-100'
                          }`}
                        >
                          {em}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-500">Başlık *</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Örn: Akademik Makale Yazım Sürecim"
                    className="w-full rounded-xl border border-slate-200/60 bg-white/60 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-300 outline-none backdrop-blur-sm transition-all focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-500">Açıklama</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="Bu yol haritası ne için? Kime hitap ediyor?"
                    rows={2}
                    className="w-full resize-none rounded-xl border border-slate-200/60 bg-white/60 px-3.5 py-2.5 text-sm text-slate-700 placeholder-slate-300 outline-none backdrop-blur-sm transition-all focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                {/* Steps */}
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <label className="text-xs font-medium text-slate-500">Adımlar *</label>
                    <button
                      onClick={addStep}
                      className="flex items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs text-indigo-600 hover:bg-indigo-100 transition-colors"
                    >
                      <Plus className="h-3 w-3" /> Adım Ekle
                    </button>
                  </div>

                  <div className="space-y-3">
                    {steps.map((step, i) => (
                      <div key={i} className="group flex gap-2">
                        <div className="mt-2.5 shrink-0 text-slate-300">
                          <GripVertical className="h-4 w-4" />
                        </div>
                        <div className="flex-1 rounded-xl border border-slate-200/60 bg-slate-50/60 p-3 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-600">
                              {step.step}
                            </span>
                            <input
                              value={step.title}
                              onChange={(e) => updateStep(i, 'title', e.target.value)}
                              placeholder="Adım başlığı *"
                              className="flex-1 rounded-lg border border-slate-200/60 bg-white px-2.5 py-1.5 text-xs text-slate-700 placeholder-slate-300 outline-none focus:border-indigo-300"
                            />
                          </div>
                          <input
                            value={step.description}
                            onChange={(e) => updateStep(i, 'description', e.target.value)}
                            placeholder="Bu adımda ne yapılır? (opsiyonel)"
                            className="w-full rounded-lg border border-slate-200/60 bg-white px-2.5 py-1.5 text-xs text-slate-600 placeholder-slate-300 outline-none focus:border-indigo-300"
                          />
                          <div className="flex gap-2">
                            <input
                              value={step.tool}
                              onChange={(e) => updateStep(i, 'tool', e.target.value)}
                              placeholder="Araç (ChatGPT, Notion...)"
                              className="flex-1 rounded-lg border border-slate-200/60 bg-white px-2.5 py-1.5 text-xs text-slate-600 placeholder-slate-300 outline-none focus:border-indigo-300"
                            />
                            <input
                              value={step.duration}
                              onChange={(e) => updateStep(i, 'duration', e.target.value)}
                              placeholder="Süre (30 dk)"
                              className="w-28 rounded-lg border border-slate-200/60 bg-white px-2.5 py-1.5 text-xs text-slate-600 placeholder-slate-300 outline-none focus:border-indigo-300"
                            />
                          </div>
                        </div>
                        {steps.length > 1 && (
                          <button
                            onClick={() => removeStep(i)}
                            className="mt-2.5 shrink-0 rounded-lg p-1 text-slate-300 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="shrink-0 border-t border-slate-100/80 px-6 py-4">
              <motion.button
                onClick={handleSubmit}
                disabled={saving}
                whileTap={{ scale: 0.97 }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] py-2.5 text-sm font-medium text-white shadow-md shadow-indigo-200/50 transition-all hover:bg-[var(--accent-hover)] disabled:opacity-60"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                {saving ? 'Paylaşılıyor...' : 'Yol Haritasını Paylaş'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
