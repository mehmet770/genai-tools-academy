import type { PathRankTier } from '@/lib/types'

interface RankConfig {
  label: PathRankTier
  emoji: string
  description: string
  minScore: number
  bg: string
  text: string
  border: string
  glow: string
}

export const RANK_CONFIGS: RankConfig[] = [
  {
    label: 'Architect',
    emoji: '🏛️',
    description: '500+ puan',
    minScore: 500,
    bg: 'bg-gradient-to-br from-amber-50 to-yellow-50',
    text: 'text-amber-700',
    border: 'border-amber-300/70',
    glow: 'shadow-amber-200/60',
  },
  {
    label: 'Promptsmith',
    emoji: '⚡',
    description: '100+ puan',
    minScore: 100,
    bg: 'bg-gradient-to-br from-violet-50 to-purple-50',
    text: 'text-violet-700',
    border: 'border-violet-300/70',
    glow: 'shadow-violet-200/60',
  },
  {
    label: 'Compiler',
    emoji: '⚙️',
    description: '20+ puan',
    minScore: 20,
    bg: 'bg-gradient-to-br from-indigo-50 to-blue-50',
    text: 'text-indigo-700',
    border: 'border-indigo-300/70',
    glow: 'shadow-indigo-200/60',
  },
  {
    label: 'Explorer',
    emoji: '🧭',
    description: 'Başlangıç',
    minScore: 0,
    bg: 'bg-gradient-to-br from-slate-50 to-slate-100',
    text: 'text-slate-600',
    border: 'border-slate-300/70',
    glow: 'shadow-slate-200/30',
  },
]

// score = likes*3 + floor(views/5) + pathCount*10
export function computePathRank(
  totalLikes: number,
  totalViews: number,
  pathCount: number,
): PathRankTier {
  const score = totalLikes * 3 + Math.floor(totalViews / 5) + pathCount * 10
  if (score >= 500) return 'Architect'
  if (score >= 100) return 'Promptsmith'
  if (score >= 20)  return 'Compiler'
  return 'Explorer'
}

export function rankScore(totalLikes: number, totalViews: number, pathCount: number) {
  return totalLikes * 3 + Math.floor(totalViews / 5) + pathCount * 10
}

interface PathRankBadgeProps {
  tier: PathRankTier
  size?: 'xs' | 'sm' | 'md'
  showScore?: number
}

export function PathRankBadge({ tier, size = 'sm', showScore }: PathRankBadgeProps) {
  const cfg = RANK_CONFIGS.find((r) => r.label === tier) ?? RANK_CONFIGS[3]

  if (size === 'xs') {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold shadow-sm ${cfg.bg} ${cfg.text} ${cfg.border}`}>
        {cfg.emoji} {cfg.label}
      </span>
    )
  }

  if (size === 'sm') {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold shadow-sm ${cfg.bg} ${cfg.text} ${cfg.border} ${cfg.glow}`}>
        {cfg.emoji} {cfg.label}
        {showScore !== undefined && (
          <span className="opacity-60">· {showScore} puan</span>
        )}
      </span>
    )
  }

  return (
    <div className={`inline-flex items-center gap-2.5 rounded-2xl border px-4 py-2.5 shadow-md ${cfg.bg} ${cfg.border} ${cfg.glow}`}>
      <span className="text-2xl">{cfg.emoji}</span>
      <div>
        <p className={`text-sm font-bold ${cfg.text}`}>{cfg.label}</p>
        <p className="text-[10px] text-slate-400">
          {cfg.description}
          {showScore !== undefined && ` · ${showScore} puan`}
        </p>
      </div>
    </div>
  )
}

// Progress bar to next rank
export function RankProgress({ score }: { score: number }) {
  const ranks = [...RANK_CONFIGS].reverse() // ascending order
  const currentIdx = ranks.findIndex((r) => score >= r.minScore && (ranks[ranks.indexOf(r) + 1]?.minScore ?? Infinity) > score)
  const current = ranks[currentIdx] ?? ranks[0]
  const next    = ranks[currentIdx + 1]

  if (!next) {
    return (
      <div className="text-xs text-amber-600 font-medium">
        {current.emoji} Maksimum rütbeye ulaştınız!
      </div>
    )
  }

  const progress = Math.min(100, Math.round(((score - current.minScore) / (next.minScore - current.minScore)) * 100))

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[11px] text-slate-500">
        <span>{current.emoji} {current.label}</span>
        <span>{next.emoji} {next.label} için {next.minScore - score} puan kaldı</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            next.label === 'Architect' ? 'bg-amber-400' :
            next.label === 'Promptsmith' ? 'bg-violet-500' : 'bg-indigo-500'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
