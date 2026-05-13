'use client'

import { motion } from 'framer-motion'
import { Layers, Type, Image, Music, Video, Code2, Database, Cpu, FlaskConical, PenLine } from 'lucide-react'
import type { AIToolCategory } from '@/lib/types'

const CATEGORIES: { key: AIToolCategory | 'all'; label: string; icon: React.ComponentType<{ className?: string }>; color: string }[] = [
  { key: 'all',        label: 'Tümü',     icon: Layers,   color: 'text-slate-600 hover:bg-slate-100' },
  { key: 'text',       label: 'Metin',    icon: Type,     color: 'text-blue-600   hover:bg-blue-50' },
  { key: 'image',      label: 'Görsel',   icon: Image,    color: 'text-pink-600   hover:bg-pink-50' },
  { key: 'audio',      label: 'Ses',      icon: Music,    color: 'text-emerald-600 hover:bg-emerald-50' },
  { key: 'video',      label: 'Video',    icon: Video,    color: 'text-orange-600 hover:bg-orange-50' },
  { key: 'code',       label: 'Kod',      icon: Code2,    color: 'text-amber-600  hover:bg-amber-50' },
  { key: 'data',       label: 'Veri',     icon: Database, color: 'text-cyan-600   hover:bg-cyan-50' },
  { key: 'multimodal', label: 'Çok Modlu',   icon: Cpu,          color: 'text-violet-600  hover:bg-violet-50' },
  { key: 'research',   label: 'Araştırma',   icon: FlaskConical, color: 'text-indigo-600  hover:bg-indigo-50' },
  { key: 'writing',    label: 'Yazı',        icon: PenLine,      color: 'text-rose-600    hover:bg-rose-50' },
]

const ACTIVE_COLORS: Record<string, string> = {
  all:        'bg-slate-800 text-white shadow-slate-300/60',
  text:       'bg-blue-500 text-white shadow-blue-200/60',
  image:      'bg-pink-500 text-white shadow-pink-200/60',
  audio:      'bg-emerald-500 text-white shadow-emerald-200/60',
  video:      'bg-orange-500 text-white shadow-orange-200/60',
  code:       'bg-amber-500 text-white shadow-amber-200/60',
  data:       'bg-cyan-500 text-white shadow-cyan-200/60',
  multimodal: 'bg-violet-500 text-white shadow-violet-200/60',
  research:   'bg-indigo-500 text-white shadow-indigo-200/60',
  writing:    'bg-rose-500   text-white shadow-rose-200/60',
}

interface FilterBarProps {
  active: AIToolCategory | 'all'
  onSelect: (cat: AIToolCategory | 'all') => void
  count: number
}

export function FilterBar({ active, onSelect, count }: FilterBarProps) {
  return (
    <div className="mb-8 rounded-2xl border border-white/60 bg-white/40 p-2 shadow-sm shadow-slate-200/30 backdrop-blur-xl">
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
        {CATEGORIES.map(({ key, label, icon: Icon, color }) => {
          const isActive = active === key
          return (
            <motion.button
              key={key}
              onClick={() => onSelect(key)}
              whileTap={{ scale: 0.96 }}
              className={`relative flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-all ${
                isActive ? `${ACTIVE_COLORS[key]} shadow-md` : `${color} text-slate-500`
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
              {isActive && key !== 'all' && (
                <span className="ml-0.5 rounded-full bg-white/25 px-1.5 py-0.5 text-[10px] font-semibold">
                  {count}
                </span>
              )}
            </motion.button>
          )
        })}
        <div className="ml-auto shrink-0 pr-1 text-xs text-slate-400">
          {count} araç
        </div>
      </div>
    </div>
  )
}
