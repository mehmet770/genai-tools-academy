import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('user_id')

  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ paths: [] })

  let query = supabase
    .from('user_paths')
    .select('*, profiles(username, avatar_url)')
    .eq('is_public', true)
    .order('likes_count', { ascending: false })
    .limit(50)

  if (userId) query = query.eq('user_id', userId)

  const { data } = await query
  return NextResponse.json({ paths: data ?? [] })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: 'No DB' }, { status: 500 })

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { title, description, icon, steps } = body

  if (!title?.trim() || !Array.isArray(steps) || steps.length === 0) {
    return NextResponse.json({ error: 'Başlık ve en az 1 adım gerekli' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('user_paths')
    .insert({
      user_id: user.id,
      title: title.trim(),
      description: (description ?? '').trim(),
      icon: icon ?? '🗺️',
      steps,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ path: data })
}

export async function DELETE(request: Request) {
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: 'No DB' }, { status: 500 })

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await request.json()
  if (!id) return NextResponse.json({ error: 'id gerekli' }, { status: 400 })

  const { error } = await supabase
    .from('user_paths')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
