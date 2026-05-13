import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Heart, ArrowLeft } from 'lucide-react'
import { ToolCard } from '@/components/ai/ToolCard'
import type { AITool } from '@/lib/types'

export const metadata = { title: 'Favorilerim' }

async function getFavoriteTools(userId: string): Promise<AITool[]> {
  const supabase = await createClient()
  if (!supabase) return []

  const { data: favRows } = await supabase
    .from('favorites')
    .select('tool_id')
    .eq('user_id', userId)

  if (!favRows?.length) return []

  const toolIds = favRows.map((r) => r.tool_id)
  const { data } = await supabase
    .from('tools')
    .select('*')
    .in('id', toolIds)

  return (data ?? []) as AITool[]
}

export default async function FavoritesPage() {
  const supabase = await createClient()
  if (!supabase) redirect('/login')

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const tools = await getFavoriteTools(user.id)

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      {/* Header */}
      <div className="mb-10 flex items-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-1.5 rounded-xl border border-slate-200/60 bg-white/50 px-3 py-2 text-sm text-slate-500 backdrop-blur-sm transition-all hover:bg-white/80 hover:text-slate-700"
        >
          <ArrowLeft className="h-4 w-4" /> Geri
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-pink-100">
              <Heart className="h-5 w-5 fill-pink-500 text-pink-500" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Favorilerim</h1>
          </div>
          <p className="mt-0.5 text-sm text-slate-500">{tools.length} araç kaydedildi</p>
        </div>
      </div>

      {tools.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-32 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-pink-50">
            <Heart className="h-8 w-8 text-pink-300" />
          </div>
          <p className="text-slate-500">Henüz favoriye eklediğin araç yok.</p>
          <Link href="/" className="rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-600">
            Araçları Keşfet
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => <ToolCard key={tool.id} tool={tool} />)}
        </div>
      )}
    </div>
  )
}
