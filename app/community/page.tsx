import type { Metadata } from 'next'
import { Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { PostCard } from '@/components/community/PostCard'
import { NewPostButton } from '@/components/community/NewPostButton'
import type { Post } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Topluluk',
  description: 'AI araçları hakkında toplulukla deneyimlerini paylaş.',
}

async function getPosts(): Promise<Post[]> {
  const supabase = await createClient()
  if (!supabase) return []

  const { data } = await supabase
    .from('posts')
    .select('*, profiles!user_id(id, username, avatar_url, bio, created_at)')
    .order('created_at', { ascending: false })
    .limit(30)

  return (data ?? []) as Post[]
}

export default async function CommunityPage() {
  const posts = await getPosts()

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      {/* Header */}
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-[var(--foreground)]">
            <Users className="h-6 w-6 text-[var(--accent)]" />
            Topluluk
          </h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            AI araçlarıyla yaptıklarını topluluğa göster
          </p>
        </div>

        <NewPostButton />
      </div>

      {posts.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {posts.map((post) => (
            <div key={post.id} className="mb-4 break-inside-avoid">
              <PostCard post={post} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-32 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--muted)]">
        <Users className="h-8 w-8 text-[var(--muted-foreground)]" />
      </div>
      <div>
        <p className="font-medium text-[var(--foreground)]">
          Henüz paylaşım yok
        </p>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          İlk paylaşımı yapan sen ol!
        </p>
      </div>
    </div>
  )
}
