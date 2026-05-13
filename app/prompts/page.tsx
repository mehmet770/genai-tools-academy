import { createClient } from '@/lib/supabase/server'
import { BookOpen } from 'lucide-react'
import { PromptCard } from '@/components/prompts/PromptCard'
import { NewPromptButton } from '@/components/prompts/NewPromptButton'
import type { Prompt, Profile } from '@/lib/types'

export const metadata = { title: 'Prompt Market' }
export const revalidate = 60

type PromptWithRelations = Prompt & {
  profiles?: { username: string; avatar_url: string | null }
  tools?: { slug: string; name: string; logo_url: string }
}

async function getPrompts(): Promise<PromptWithRelations[]> {
  const supabase = await createClient()
  if (!supabase) return []

  const { data } = await supabase
    .from('prompts')
    .select('*, profiles(username, avatar_url), tools(slug, name, logo_url)')
    .order('copies_count', { ascending: false })
    .limit(50)

  return (data ?? []) as PromptWithRelations[]
}

async function getTools() {
  const supabase = await createClient()
  if (!supabase) return []
  const { data } = await supabase.from('tools').select('id, name, slug').order('name')
  return data ?? []
}

export default async function PromptsPage() {
  const [prompts, tools] = await Promise.all([getPrompts(), getTools()])

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      {/* Header */}
      <div className="mb-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Prompt Market</h1>
            <p className="text-sm text-slate-400">
              Topluluktan hazır promptlar — kopyala, kullan, paylaş
            </p>
          </div>
        </div>
        <NewPromptButton tools={tools} />
      </div>

      {prompts.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-28 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-violet-50">
            <BookOpen className="h-8 w-8 text-violet-300" />
          </div>
          <p className="text-slate-500">Henüz prompt paylaşılmamış.</p>
          <p className="text-sm text-slate-400">İlk promptu sen ekle!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {prompts.map((p, i) => (
            <PromptCard key={p.id} prompt={p} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
