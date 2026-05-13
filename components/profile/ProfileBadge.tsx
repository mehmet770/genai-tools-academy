import { Award, Star, Zap } from 'lucide-react'

export type BadgeTier = 'Usta' | 'Promptçu' | 'Katılımcı'

interface BadgeConfig {
  label: BadgeTier
  icon: typeof Award
  description: string
  bgClass: string
  textClass: string
  borderClass: string
  glowClass: string
}

const BADGES: Record<BadgeTier, BadgeConfig> = {
  Usta: {
    label: 'Usta',
    icon: Award,
    description: '15+ prompt, 300+ kopyalanma',
    bgClass:     'bg-gradient-to-br from-amber-50 to-yellow-50',
    textClass:   'text-amber-700',
    borderClass: 'border-amber-300/70',
    glowClass:   'shadow-amber-200/60',
  },
  Promptçu: {
    label: 'Promptçu',
    icon: Star,
    description: '5+ prompt veya 100+ kopyalanma',
    bgClass:     'bg-gradient-to-br from-indigo-50 to-violet-50',
    textClass:   'text-indigo-700',
    borderClass: 'border-indigo-300/70',
    glowClass:   'shadow-indigo-200/60',
  },
  Katılımcı: {
    label: 'Katılımcı',
    icon: Zap,
    description: 'Topluluk üyesi',
    bgClass:     'bg-gradient-to-br from-slate-50 to-slate-100',
    textClass:   'text-slate-600',
    borderClass: 'border-slate-300/70',
    glowClass:   'shadow-slate-200/30',
  },
}

export function computeBadge(promptCount: number, totalCopies: number): BadgeTier {
  if (promptCount >= 15 && totalCopies >= 300) return 'Usta'
  if (promptCount >= 5 || totalCopies >= 100)  return 'Promptçu'
  return 'Katılımcı'
}

interface ProfileBadgeProps {
  tier: BadgeTier
  size?: 'sm' | 'md'
}

export function ProfileBadge({ tier, size = 'md' }: ProfileBadgeProps) {
  const cfg = BADGES[tier]
  const Icon = cfg.icon

  if (size === 'sm') {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium shadow-sm ${cfg.bgClass} ${cfg.textClass} ${cfg.borderClass} ${cfg.glowClass}`}>
        <Icon className="h-3 w-3" />
        {cfg.label}
      </span>
    )
  }

  return (
    <div className={`inline-flex items-center gap-2.5 rounded-2xl border px-4 py-2.5 shadow-md ${cfg.bgClass} ${cfg.borderClass} ${cfg.glowClass}`}>
      <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${cfg.bgClass} shadow-inner`}>
        <Icon className={`h-4 w-4 ${cfg.textClass}`} />
      </div>
      <div>
        <p className={`text-sm font-bold ${cfg.textClass}`}>{cfg.label}</p>
        <p className="text-[10px] text-slate-400">{cfg.description}</p>
      </div>
    </div>
  )
}
