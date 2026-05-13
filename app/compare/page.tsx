import { createClient } from '@/lib/supabase/server'
import { GitCompare } from 'lucide-react'
import { CompareSection } from '@/components/compare/CompareSection'
import type { AITool } from '@/lib/types'

export const metadata = { title: 'Araç Karşılaştır' }

async function getTools(): Promise<AITool[]> {
  const supabase = await createClient()
  if (!supabase) return []
  const { data } = await supabase.from('tools').select('*').order('name')
  return (data ?? []) as AITool[]
}

export default async function ComparePage() {
  const tools = await getTools()

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500">
            <GitCompare className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Araç Karşılaştır</h1>
            <p className="text-sm text-slate-400">
              İki AI aracını yan yana karşılaştır, doğru seçimi yap
            </p>
          </div>
        </div>
      </div>

      {tools.length < 2 ? (
        <div className="flex flex-col items-center gap-3 py-24 text-center">
          <p className="text-slate-400">
            Karşılaştırma için en az 2 araç gerekli. Önce araçları ekle.
          </p>
        </div>
      ) : (
        <CompareSection tools={tools} />
      )}
    </div>
  )
}
