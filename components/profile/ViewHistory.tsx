'use client'

import { useEffect, useState } from 'react'
import { Eye, Loader2, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { PromptView } from '@/lib/types'

interface ViewRow extends PromptView {
  prompts?: { title: string }
}

export function ViewHistory() {
  const [rows, setRows] = useState<ViewRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      if (!supabase) { setLoading(false); return }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      // Fetch my prompts' view logs — RLS ensures only owner can read
      const { data } = await supabase
        .from('prompt_views')
        .select('*, prompts(title)')
        .in('prompt_id', (
          await supabase
            .from('prompts')
            .select('id')
            .eq('user_id', user.id)
        ).data?.map((p) => p.id) ?? [])
        .order('viewed_at', { ascending: false })
        .limit(50)

      setRows((data ?? []) as ViewRow[])
      setLoading(false)
    }

    load()
  }, [])

  function formatDate(iso: string) {
    return new Date(iso).toLocaleString('tr-TR', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
    })
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/65 bg-white/45 shadow-sm shadow-slate-200/30 backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-slate-100/80 px-5 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-50">
          <Eye className="h-4 w-4 text-cyan-500" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-800">İzlenme Geçmişi</h3>
          <p className="text-[11px] text-slate-400">Promptlarınızı kim inceledi</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-5 w-5 animate-spin text-slate-300" />
        </div>
      ) : rows.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-12 text-center">
          <Eye className="h-8 w-8 text-slate-200" />
          <p className="text-sm text-slate-400">Henüz izlenme kaydı yok.</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100/80">
          {rows.map((row) => (
            <div key={row.id} className="flex items-center gap-3 px-5 py-3">
              {/* Avatar bubble */}
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-50">
                <User className="h-3.5 w-3.5 text-indigo-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-slate-700">
                  {row.viewer_username ?? 'Anonim'}
                </p>
                {row.prompts?.title && (
                  <p className="truncate text-[11px] text-slate-400">
                    → {row.prompts.title}
                  </p>
                )}
              </div>
              <time className="shrink-0 text-[11px] text-slate-400">
                {formatDate(row.viewed_at)}
              </time>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
