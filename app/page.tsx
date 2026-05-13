import { createClient } from '@/lib/supabase/server'
import { HeroSection } from '@/components/ai/HeroSection'
import { ToolsSection } from '@/components/ai/ToolsSection'
import type { AITool } from '@/lib/types'

async function getTools(): Promise<AITool[]> {
  const supabase = await createClient()
  if (!supabase) return []

  const { data } = await supabase
    .from('tools')
    .select('*')
    .order('created_at', { ascending: false })

  return (data ?? []) as AITool[]
}

export default async function HomePage() {
  const tools = await getTools()

  return (
    <>
      <HeroSection />

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
        {tools.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
            <p className="text-slate-400">Henüz araç eklenmemiş.</p>
            <p className="text-sm text-slate-400">
              Supabase SQL Editor&apos;da{' '}
              <code className="rounded-lg border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600">
                supabase/schema.sql
              </code>{' '}
              dosyasını çalıştır.
            </p>
          </div>
        ) : (
          <ToolsSection tools={tools} />
        )}
      </section>
    </>
  )
}
