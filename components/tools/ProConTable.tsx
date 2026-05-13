import { CheckCircle2, XCircle, Target, DollarSign, Shield } from 'lucide-react'
import { PRO_CON_DATA } from '@/lib/academic-data'

interface ProConTableProps {
  toolSlug: string
}

export function ProConTable({ toolSlug }: ProConTableProps) {
  const data = PRO_CON_DATA[toolSlug]
  if (!data) return null

  return (
    <section className="mt-8">
      <h2 className="mb-5 flex items-center gap-2 text-base font-bold text-slate-800">
        <Target className="h-5 w-5 text-indigo-500" />
        Akademik Değerlendirme
      </h2>

      {/* Pro/Con grid */}
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Pros */}
        <div className="rounded-2xl border border-emerald-200/60 bg-emerald-50/40 p-5 backdrop-blur-xl">
          <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
            Güçlü Yanlar
          </p>
          <ul className="space-y-2">
            {data.pros.map((p, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                <span className="text-sm text-slate-700">{p}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cons */}
        <div className="rounded-2xl border border-red-200/60 bg-red-50/40 p-5 backdrop-blur-xl">
          <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-red-600">
            <XCircle className="h-4 w-4" />
            Sınırlılıklar
          </p>
          <ul className="space-y-2">
            {data.cons.map((c, i) => (
              <li key={i} className="flex items-start gap-2">
                <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-400" />
                <span className="text-sm text-slate-700">{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Meta info row */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-white/65 bg-white/45 p-4 backdrop-blur-xl">
          <p className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            <Target className="h-3.5 w-3.5" />
            En İyi Kullanım
          </p>
          <div className="flex flex-wrap gap-1">
            {data.bestFor.map((b) => (
              <span
                key={b}
                className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-700"
              >
                {b}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-white/65 bg-white/45 p-4 backdrop-blur-xl">
          <p className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            <DollarSign className="h-3.5 w-3.5" />
            Maliyet
          </p>
          <p className="text-sm text-slate-700">{data.costModel}</p>
        </div>

        <div className="rounded-xl border border-white/65 bg-white/45 p-4 backdrop-blur-xl">
          <p className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            <Shield className="h-3.5 w-3.5" />
            Gizlilik Notu
          </p>
          <p className="text-xs leading-relaxed text-slate-600">{data.privacyNote}</p>
        </div>
      </div>
    </section>
  )
}
