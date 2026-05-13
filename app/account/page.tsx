import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ProfileEditor } from '@/components/account/ProfileEditor'
import { EducatorPanel } from '@/components/account/EducatorPanel'
import { ToolCard } from '@/components/ai/ToolCard'
import { ProfileStats } from '@/components/profile/ProfileStats'
import { ProfileBadge, computeBadge } from '@/components/profile/ProfileBadge'
import { PathRankBadge, computePathRank, rankScore, RankProgress } from '@/components/paths/PathRankBadge'
import { ViewHistory } from '@/components/profile/ViewHistory'
import { ArrowLeft, Heart } from 'lucide-react'
import type { AITool, Profile } from '@/lib/types'

export const metadata = { title: 'Hesabım' }

async function getAccountData(userId: string) {
  const supabase = await createClient()
  if (!supabase) return null

  const [profileRes, favRes, commentCountRes, promptsRes, userPathsRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).single(),
    supabase.from('favorites').select('tool_id').eq('user_id', userId),
    supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId),
    supabase
      .from('prompts')
      .select('id, copies_count, views_count')
      .eq('user_id', userId),
    supabase
      .from('user_paths')
      .select('id, likes_count, views_count')
      .eq('user_id', userId),
  ])

  let favoriteTools: AITool[] = []
  if (favRes.data?.length) {
    const ids = favRes.data.map((f) => f.tool_id)
    const { data: tools } = await supabase.from('tools').select('*').in('id', ids)
    favoriteTools = (tools ?? []) as AITool[]
  }

  const prompts   = promptsRes.data ?? []
  const userPaths = userPathsRes.data ?? []
  const totalCopies    = prompts.reduce((s, p) => s + (p.copies_count ?? 0), 0)
  const totalViews     = prompts.reduce((s, p) => s + (p.views_count  ?? 0), 0)
  const pathTotalLikes = userPaths.reduce((s, p) => s + (p.likes_count ?? 0), 0)
  const pathTotalViews = userPaths.reduce((s, p) => s + (p.views_count ?? 0), 0)

  return {
    profile:      profileRes.data as Profile | null,
    favCount:     favRes.data?.length ?? 0,
    commentCount: commentCountRes.count ?? 0,
    promptCount:  prompts.length,
    totalCopies,
    totalViews,
    pathCount:    userPaths.length,
    pathTotalLikes,
    pathTotalViews,
    favoriteTools,
  }
}

export default async function AccountPage() {
  const supabase = await createClient()
  if (!supabase) redirect('/login')

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const data = await getAccountData(user.id)
  const initial = user.email?.charAt(0).toUpperCase() ?? 'U'

  const badge     = computeBadge(data?.promptCount ?? 0, data?.totalCopies ?? 0)
  const pathTier  = computePathRank(data?.pathTotalLikes ?? 0, data?.pathTotalViews ?? 0, data?.pathCount ?? 0)
  const pathScore = rankScore(data?.pathTotalLikes ?? 0, data?.pathTotalViews ?? 0, data?.pathCount ?? 0)

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-12 sm:px-6">

      {/* Back */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/60 bg-white/50 px-3 py-2 text-sm text-slate-500 backdrop-blur-sm transition-all hover:bg-white/80 hover:text-slate-700"
      >
        <ArrowLeft className="h-4 w-4" /> Ana Sayfa
      </Link>

      {/* Profile Hero */}
      <div className="overflow-hidden rounded-3xl border border-white/65 bg-white/45 p-6 shadow-sm shadow-slate-200/30 backdrop-blur-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-2xl font-bold text-white shadow-lg shadow-indigo-200/50">
            {initial}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-slate-800">
              {data?.profile?.username ?? 'Kullanıcı'}
            </h1>
            <p className="text-sm text-slate-400">{user.email}</p>
            {data?.profile?.bio && (
              <p className="mt-1 text-sm text-slate-500">{data.profile.bio}</p>
            )}
          </div>
          {/* Badges */}
          <div className="flex shrink-0 flex-col gap-2">
            <ProfileBadge tier={badge} size="sm" />
            <PathRankBadge tier={pathTier} size="sm" showScore={pathScore} />
          </div>
        </div>
      </div>

      {/* Stats Dashboard */}
      <ProfileStats
        promptCount={data?.promptCount ?? 0}
        totalCopies={data?.totalCopies ?? 0}
        totalViews={data?.totalViews ?? 0}
        favCount={data?.favCount ?? 0}
        commentCount={data?.commentCount ?? 0}
      />

      {/* Profile editor */}
      <ProfileEditor profile={data?.profile ?? null} userId={user.id} />

      {/* Educator panel */}
      <EducatorPanel
        userId={user.id}
        initialMode={data?.profile?.educator_mode ?? false}
        initialInstitution={data?.profile?.institution}
        initialDiscipline={data?.profile?.discipline}
      />

      {/* Path rank progress */}
      <div className="rounded-2xl border border-white/65 bg-white/45 p-5 shadow-sm backdrop-blur-xl">
        <h3 className="mb-3 text-sm font-semibold text-slate-700">🗺️ Yol Haritası Rütbesi</h3>
        <RankProgress score={pathScore} />
        <p className="mt-2 text-[11px] text-slate-400">
          Puan = beğeni×3 + görüntülenme÷5 + harita×10
        </p>
      </div>

      {/* View History — client component, shows prompt view logs */}
      <ViewHistory />

      {/* Favorite tools */}
      {(data?.favoriteTools?.length ?? 0) > 0 && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Heart className="h-4 w-4 fill-pink-400 text-pink-400" />
              Favori Araçlarım
            </h2>
            <Link href="/favorites" className="text-xs text-indigo-500 hover:text-indigo-600">
              Tümünü Gör →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data!.favoriteTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
