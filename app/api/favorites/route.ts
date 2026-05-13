import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ favorites: [] })

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ favorites: [] })

  const { data } = await supabase
    .from('favorites')
    .select('tool_id')
    .eq('user_id', user.id)

  return NextResponse.json({ favorites: data?.map((f) => f.tool_id) ?? [] })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: 'No DB' }, { status: 500 })

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { tool_id } = await request.json()
  const { error } = await supabase.from('favorites').insert({ user_id: user.id, tool_id })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function DELETE(request: Request) {
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: 'No DB' }, { status: 500 })

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { tool_id } = await request.json()
  const { error } = await supabase
    .from('favorites').delete()
    .eq('user_id', user.id).eq('tool_id', tool_id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
