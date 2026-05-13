'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { GraduationCap, Save, Loader2, BookOpen, FlaskConical, Lightbulb, Map } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/contexts/ToastContext'
import Link from 'next/link'
import { LEARNING_PATHS, EDUCATOR_TIPS } from '@/lib/academic-data'

interface EducatorPanelProps {
  userId: string
  initialMode: boolean
  initialInstitution?: string | null
  initialDiscipline?: string | null
}

const DISCIPLINES = [
  'Eğitim Bilimleri', 'Sosyal Bilimler', 'Fen Bilimleri', 'Matematik',
  'Dil ve Edebiyat', 'Tarih', 'Sağlık Bilimleri', 'Mühendislik',
  'Sanat ve Tasarım', 'Hukuk', 'İşletme', 'Diğer',
]

const QUICK_LINKS = [
  { href: '/paths/akademik-uretkenlik', label: 'Akademik Üretkenlik', icon: BookOpen, color: 'text-indigo-500 bg-indigo-50' },
  { href: '/paths/bilimsel-arastirma-yontemleri', label: 'Araştırma Yöntemleri', icon: FlaskConical, color: 'text-violet-500 bg-violet-50' },
  { href: '/paths/yaratici-mufredat-tasarimi', label: 'Müfredat Tasarımı', icon: Lightbulb, color: 'text-pink-500 bg-pink-50' },
  { href: '/paths', label: 'Tüm Yol Haritaları', icon: Map, color: 'text-emerald-500 bg-emerald-50' },
]

export function EducatorPanel({ userId, initialMode, initialInstitution, initialDiscipline }: EducatorPanelProps) {
  const [educatorMode, setEducatorMode] = useState(initialMode)
  const [institution, setInstitution] = useState(initialInstitution ?? '')
  const [discipline, setDiscipline] = useState(initialDiscipline ?? '')
  const [saving, setSaving] = useState(false)
  const { addToast } = useToast()

  const handleSave = async () => {
    setSaving(true)
    const supabase = createClient()
    if (!supabase) { setSaving(false); return }

    const { error } = await supabase
      .from('profiles')
      .update({ educator_mode: educatorMode, institution: institution || null, discipline: discipline || null })
      .eq('id', userId)

    if (error) addToast('Kayıt başarısız: ' + error.message, 'error')
    else addToast('Eğitimci profili güncellendi!', 'success')
    setSaving(false)
  }

  const activeTips = EDUCATOR_TIPS['research'] ?? []

  return (
    <div className="space-y-5">
      {/* Toggle card */}
      <div className="rounded-2xl border border-white/65 bg-white/45 p-6 shadow-sm backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Eğitimci Modu</h3>
              <p className="text-xs text-slate-400">Akademik içerikleri ve yol haritalarını etkinleştir</p>
            </div>
          </div>

          {/* Toggle */}
          <button
            onClick={() => setEducatorMode((m) => !m)}
            className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${
              educatorMode ? 'bg-indigo-500' : 'bg-slate-200'
            }`}
          >
            <motion.div
              animate={{ x: educatorMode ? 20 : 2 }}
              transition={{ duration: 0.2 }}
              className="absolute top-1 h-4 w-4 rounded-full bg-white shadow"
            />
          </button>
        </div>

        {educatorMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-5 space-y-4 overflow-hidden"
          >
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-500">Kurum / Okul</label>
              <input
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="İstanbul Üniversitesi, Eğitim Fakültesi..."
                className="w-full rounded-xl border border-slate-200/60 bg-white/60 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-300 outline-none backdrop-blur-sm transition-all focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-500">Uzmanlık Alanı</label>
              <select
                value={discipline}
                onChange={(e) => setDiscipline(e.target.value)}
                className="w-full rounded-xl border border-slate-200/60 bg-white/60 px-3.5 py-2.5 text-sm text-slate-800 outline-none backdrop-blur-sm transition-all focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">Alan seç...</option>
                {DISCIPLINES.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </motion.div>
        )}

        <motion.button
          onClick={handleSave}
          disabled={saving}
          whileTap={{ scale: 0.97 }}
          className="mt-4 flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-indigo-200/50 transition-all hover:bg-indigo-600 disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? 'Kaydediliyor...' : 'Kaydet'}
        </motion.button>
      </div>

      {/* Quick links to learning paths */}
      {educatorMode && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/65 bg-white/45 p-5 shadow-sm backdrop-blur-xl"
        >
          <h3 className="mb-4 text-sm font-semibold text-slate-700">Hızlı Erişim — Yol Haritaları</h3>
          <div className="grid grid-cols-2 gap-3">
            {QUICK_LINKS.map(({ href, label, icon: Icon, color }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2.5 rounded-xl border border-slate-100/80 bg-white/60 p-3 text-sm transition-all hover:border-indigo-200/60 hover:bg-indigo-50/40 hover:text-indigo-700"
              >
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-xs font-medium text-slate-700">{label}</span>
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      {/* Educator tips */}
      {educatorMode && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-amber-200/60 bg-amber-50/40 p-5 backdrop-blur-xl"
        >
          <h3 className="mb-3 text-sm font-semibold text-amber-800">Eğitimci İpuçları</h3>
          <ul className="space-y-2">
            {activeTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-200/60 text-[10px] font-bold text-amber-700">
                  {i + 1}
                </span>
                <span className="text-sm text-amber-900">{tip}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  )
}
