import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const toolId = searchParams.get('tool_id')

  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ prompts: [] })

  let query = supabase
    .from('prompts')
    .select('*, profiles(username, avatar_url), tools(slug, name, logo_url)')
    .order('copies_count', { ascending: false })
    .limit(50)

  if (toolId) query = query.eq('tool_id', toolId)

  const { data } = await query
  return NextResponse.json({ prompts: data ?? [] })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: 'No DB' }, { status: 500 })

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { tool_id, title, description, content } = body

  if (!tool_id || !title?.trim() || !content?.trim()) {
    return NextResponse.json({ error: 'Eksik alan' }, { status: 400 })
  }

  // Try with description first; fall back without it if the column doesn't exist yet
  let result = await supabase
    .from('prompts')
    .insert({
      tool_id,
      user_id: user.id,
      title: title.trim(),
      description: (description ?? '').trim(),
      content: content.trim(),
    })
    .select()
    .single()

  // PostgreSQL error 42703 = "column does not exist" (migration 003 not yet run)
  if (result.error?.code === '42703' || result.error?.message?.includes('column')) {
    result = await supabase
      .from('prompts')
      .insert({
        tool_id,
        user_id: user.id,
        title: title.trim(),
        content: content.trim(),
      })
      .select()
      .single()
  }

  if (result.error) return NextResponse.json({ error: result.error.message }, { status: 500 })
  return NextResponse.json({ prompt: result.data })
}

export async function PATCH(request: Request) {
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: 'No DB' }, { status: 500 })

  const { id } = await request.json()
  if (!id) return NextResponse.json({ error: 'id gerekli' }, { status: 400 })

  // Try RPC first, fall back to direct update if RPC doesn't exist yet
  const { error: rpcError } = await supabase.rpc('increment_prompt_copies', { p_id: id })

  if (rpcError) {
    // Fallback: direct increment via select+update
    const { data: row } = await supabase.from('prompts').select('copies_count').eq('id', id).single()
    if (row) {
      await supabase.from('prompts').update({ copies_count: (row.copies_count ?? 0) + 1 }).eq('id', id)
    }
  }

  return NextResponse.json({ success: true })
}
