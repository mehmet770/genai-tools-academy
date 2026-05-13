import { BookOpen, Copy, Eye, Heart, MessageSquare } from 'lucide-react'

interface Stat {
  label: string
  value: number
  icon: typeof BookOpen
  colorText: string
  colorBg: string
}

interface ProfileStatsProps {
  promptCount:  number
  totalCopies:  number
  totalViews:   number
  favCount:     number
  commentCount: number
}

export function ProfileStats({
  promptCount,
  totalCopies,
  totalViews,
  favCount,
  commentCount,
}: ProfileStatsProps) {
  const stats: Stat[] = [
    { label: 'Paylaşılan Prompt', value: promptCount,  icon: BookOpen,      colorText: 'text-violet-500',  colorBg: 'bg-violet-50' },
    { label: 'Toplam Kopyalanma', value: totalCopies,  icon: Copy,         colorText: 'text-indigo-500',  colorBg: 'bg-indigo-50' },
    { label: 'Toplam Görüntülenme',value: totalViews,  icon: Eye,          colorText: 'text-cyan-500',    colorBg: 'bg-cyan-50'   },
    { label: 'Favori Araç',        value: favCount,    icon: Heart,        colorText: 'text-pink-500',    colorBg: 'bg-pink-50'   },
    { label: 'Yorum',              value: commentCount, icon: MessageSquare, colorText: 'text-emerald-500', colorBg: 'bg-emerald-50' },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {stats.map(({ label, value, icon: Icon, colorText, colorBg }) => (
        <div
          key={label}
          className="rounded-2xl border border-white/65 bg-white/45 p-4 text-center shadow-sm shadow-slate-200/30 backdrop-blur-xl"
        >
          <div className={`mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-xl ${colorBg}`}>
            <Icon className={`h-5 w-5 ${colorText}`} />
          </div>
          <p className="text-2xl font-bold text-slate-800">{value.toLocaleString('tr-TR')}</p>
          <p className="mt-0.5 text-[11px] text-slate-400">{label}</p>
        </div>
      ))}
    </div>
  )
}
