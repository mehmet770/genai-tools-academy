import { createClient } from '@/lib/supabase/server'
import { NewsGrid } from './NewsGrid'
import { Newspaper, RefreshCw } from 'lucide-react'

export const metadata = { title: 'AI Haberleri' }
export const revalidate = 300 // 5 dakikada bir revalidate

async function getNews() {
  const supabase = await createClient()
  if (!supabase) return []

  const { data } = await supabase
    .from('news_items')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(30)

  return data ?? []
}

export default async function NewsPage() {
  const news = await getNews()

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500">
            <Newspaper className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">AI Haberleri</h1>
            <p className="text-sm text-slate-400">TechCrunch, VentureBeat ve daha fazlasından</p>
          </div>
        </div>
      </div>

      {/* Haber çekme butonu (server action) */}
      <form action={async () => {
        'use server'
        try {
          await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/api/news/fetch`, { method: 'POST' })
        } catch {}
      }} className="mb-8">
        <button
          type="submit"
          className="flex items-center gap-2 rounded-xl border border-slate-200/60 bg-white/50 px-4 py-2 text-sm text-slate-600 shadow-sm backdrop-blur-sm transition-all hover:bg-white/80 hover:shadow-md"
        >
          <RefreshCw className="h-4 w-4" /> Haberleri Yenile
        </button>
      </form>

      <NewsGrid initialNews={news} />
    </div>
  )
}
