import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: 'No DB' }, { status: 500 })

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { path_id } = await request.json()
  if (!path_id) return NextResponse.json({ error: 'path_id gerekli' }, { status: 400 })

  const { data, error } = await supabase.rpc('toggle_path_like', {
    p_path_id: path_id,
    p_user_id: user.id,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
