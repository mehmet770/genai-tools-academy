'use client'

import { useState } from 'react'
import { Map, BookOpen, Users } from 'lucide-react'
import { PathCard } from '@/components/paths/PathCard'
import { CommunityPathsSection } from '@/components/paths/CommunityPathsSection'
import { LEARNING_PATHS } from '@/lib/academic-data'

type Tab = 'official' | 'community'

export default function PathsPage() {
  const [tab, setTab] = useState<Tab>('official')

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg shadow-indigo-200/50">
          <Map className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800">Yol Haritaları</h1>
        <p className="mx-auto mt-3 max-w-2xl text-slate-500">
          Uzman rehberlerini takip et ya da kendi AI iş akışını topluluğa paylaş.
          Beğeni ve görüntülenme kazanarak rütbe yükselt.
        </p>

        {/* Stats */}
        <div className="mx-auto mt-6 flex max-w-md flex-wrap justify-center gap-8">
          {[
            { label: 'Resmi Harita', value: LEARNING_PATHS.length },
            { label: 'Araç', value: '20+' },
            { label: 'Senaryo', value: '30+' },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-bold text-indigo-600">{value}</p>
              <p className="text-xs text-slate-400">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Rank legend */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {[
          { tier: '🧭 Explorer',     desc: 'Başlangıç' },
          { tier: '⚙️ Compiler',     desc: '20+ puan' },
          { tier: '⚡ Promptsmith',  desc: '100+ puan' },
          { tier: '🏛️ Architect',   desc: '500+ puan' },
        ].map(({ tier, desc }) => (
          <div
            key={tier}
            className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs text-slate-600 shadow-sm backdrop-blur-sm"
          >
            <span className="font-semibold">{tier}</span>
            <span className="text-slate-400">· {desc}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="mb-8 flex gap-2">
        <button
          onClick={() => setTab('official')}
          className={`flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
            tab === 'official'
              ? 'border-transparent bg-indigo-600 text-white shadow-md shadow-indigo-200'
              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          Resmi Haritalar
          <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${tab === 'official' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
            {LEARNING_PATHS.length}
          </span>
        </button>
        <button
          onClick={() => setTab('community')}
          className={`flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
            tab === 'community'
              ? 'border-transparent bg-indigo-600 text-white shadow-md shadow-indigo-200'
              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Users className="h-4 w-4" />
          Topluluk
        </button>
      </div>

      {/* Content */}
      {tab === 'official' ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {LEARNING_PATHS.map((path, i) => (
            <PathCard key={path.slug} path={path} index={i} />
          ))}
        </div>
      ) : (
        <CommunityPathsSection />
      )}
    </div>
  )
}
