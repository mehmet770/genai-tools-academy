import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Likes toggle — no RPC needed; uses existing post_likes RLS policies
export async function POST(request: Request) {
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: 'No DB' }, { status: 500 })

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Giriş yapmalısın' }, { status: 401 })

  const body = await request.json().catch(() => ({}))
  const { post_id } = body
  if (!post_id) return NextResponse.json({ error: 'post_id gerekli' }, { status: 400 })

  // Check existing like
  const { data: existing } = await supabase
    .from('post_likes')
    .select('id')
    .eq('post_id', post_id)
    .eq('user_id', user.id)
    .maybeSingle()

  let liked: boolean
  if (existing) {
    const { error } = await supabase
      .from('post_likes')
      .delete()
      .eq('post_id', post_id)
      .eq('user_id', user.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    liked = false
  } else {
    const { error } = await supabase
      .from('post_likes')
      .insert({ post_id, user_id: user.id })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    liked = true
  }

  // Real count from post_likes (no posts UPDATE policy needed)
  const { count } = await supabase
    .from('post_likes')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', post_id)

  const likes_count = count ?? 0

  // Best-effort sync to posts.likes_count (ignored if no UPDATE policy yet)
  await supabase.from('posts').update({ likes_count }).eq('id', post_id)

  return NextResponse.json({ liked, likes_count })
}
