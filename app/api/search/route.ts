import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = (searchParams.get('q') ?? '').trim()

  if (!q) return NextResponse.json({ tools: [] })

  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ tools: [] })

  // Parse natural-language shortcuts
  const categoryMap: Record<string, string> = {
    metin: 'text', yazı: 'text', text: 'text',
    görsel: 'image', resim: 'image', image: 'image',
    ses: 'audio', müzik: 'audio', audio: 'audio',
    video: 'video', film: 'video',
    kod: 'code', yazılım: 'code', code: 'code',
    veri: 'data', data: 'data',
    'çok modlu': 'multimodal', multimodal: 'multimodal',
  }

  const detectedCategory = Object.entries(categoryMap).find(([keyword]) =>
    q.toLowerCase().includes(keyword)
  )?.[1]

  let query = supabase.from('tools').select('*')

  if (detectedCategory) {
    query = query.eq('category', detectedCategory)
  } else {
    query = query.or(
      `name.ilike.%${q}%,tagline.ilike.%${q}%,description.ilike.%${q}%`
    )
  }

  const { data } = await query.limit(12)
  return NextResponse.json({ tools: data ?? [] })
}
