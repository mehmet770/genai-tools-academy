import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limit = Number(searchParams.get('limit') ?? 20)

  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ news: [] })

  const { data } = await supabase
    .from('news_items')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(limit)

  return NextResponse.json({ news: data ?? [] })
}
