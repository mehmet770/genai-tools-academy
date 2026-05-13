'use client'

import { useState, useEffect } from 'react'
import { Plus, Loader2, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { UserPathCard } from '@/components/paths/UserPathCard'
import { CreatePathModal } from '@/components/paths/CreatePathModal'
import type { UserPath } from '@/lib/types'

export function CommunityPathsSection() {
  const [paths, setPaths]     = useState<UserPath[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModal] = useState(false)
  const [isLoggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    if (supabase) {
      supabase.auth.getUser().then(({ data }) => setLoggedIn(!!data.user))
    }

    fetch('/api/paths')
      .then((r) => r.json())
      .then(({ paths: data }) => setPaths(data ?? []))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* Section header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100">
            <Users className="h-5 w-5 text-indigo-500" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-800">Topluluk Yol Haritaları</h2>
            <p className="text-xs text-slate-400">Kullanıcıların oluşturduğu özel haritalar</p>
          </div>
        </div>
        <button
          onClick={() => isLoggedIn ? setModal(true) : window.location.href = '/login'}
          className="flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-indigo-200/50 transition-all hover:bg-[var(--accent-hover)]"
        >
          <Plus className="h-4 w-4" />
          Oluştur
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
        </div>
      ) : paths.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-white/65 bg-white/45 py-20 text-center shadow-sm backdrop-blur-xl">
          <span className="text-5xl">🗺️</span>
          <div>
            <p className="font-medium text-slate-700">Henüz topluluk yol haritası yok</p>
            <p className="mt-1 text-sm text-slate-400">İlk haritayı oluşturan sen ol!</p>
          </div>
          <button
            onClick={() => isLoggedIn ? setModal(true) : window.location.href = '/login'}
            className="flex items-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-[var(--accent-hover)]"
          >
            <Plus className="h-4 w-4" /> Yol Haritası Oluştur
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {paths.map((path, i) => (
            <UserPathCard key={path.id} path={path} index={i} />
          ))}
        </div>
      )}

      <CreatePathModal open={modalOpen} onClose={() => setModal(false)} />
    </div>
  )
}
