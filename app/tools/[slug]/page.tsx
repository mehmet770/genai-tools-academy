import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { ToolInteraction } from '@/components/ai/ToolInteraction'
import { ToolComments } from '@/components/tools/ToolComments'
import { AcademicUseCases } from '@/components/tools/AcademicUseCases'
import { ProConTable } from '@/components/tools/ProConTable'
import { ACADEMIC_SCENARIOS, PRO_CON_DATA } from '@/lib/academic-data'
import type { AITool } from '@/lib/types'

async function getTool(slug: string): Promise<AITool | null> {
  const supabase = await createClient()
  if (!supabase) return null

  const { data } = await supabase
    .from('tools')
    .select('*')
    .eq('slug', slug)
    .single()

  return data as AITool | null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const tool = await getTool(slug)
  if (!tool) return { title: 'Araç Bulunamadı' }
  return { title: tool.name, description: tool.tagline }
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const tool = await getTool(slug)
  if (!tool) notFound()

  const hasAcademicData = !!ACADEMIC_SCENARIOS[slug]
  const hasProCon = !!PRO_CON_DATA[slug]

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1.5 rounded-xl border border-slate-200/60 bg-white/50 px-3 py-2 text-sm text-slate-500 backdrop-blur-sm transition-all hover:bg-white/80 hover:text-slate-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Tüm Araçlar
      </Link>

      {/* Interactive robot card */}
      <ToolInteraction tool={tool} />

      {/* Academic use cases */}
      {hasAcademicData && (
        <AcademicUseCases toolSlug={slug} toolName={tool.name} />
      )}

      {/* Pro/con academic evaluation */}
      {hasProCon && (
        <ProConTable toolSlug={slug} />
      )}

      {/* Comments */}
      <ToolComments toolId={tool.id} />
    </div>
  )
}
