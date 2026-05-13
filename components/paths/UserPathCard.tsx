'use client'

import { useState, useEffect } from 'react'
import { Heart, Eye, ChevronDown, ChevronUp, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { PathRankBadge, computePathRank, rankScore } from '@/components/paths/PathRankBadge'
import type { UserPath } from '@/lib/types'

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days < 1) return 'bugün'
  if (days < 30) return `${days} gün önce`
  return new Date(dateStr).toLocaleDateString('tr-TR')
}

interface UserPathCardProps {
  path: UserPath
  index?: number
}

export function UserPathCard({ path, index = 0 }: UserPathCardProps) {
  const [likes, setLikes] = useState(path.likes_count)
  const [liked, setLiked] = useState(false)
  const [liking, setLiking] = useState(false)
  const [expanded, setExpanded] = useState(false)

  // track view once on mount
  useEffect(() => {
    const supabase = createClient()
    if (!supabase) return
    supabase.rpc('increment_path_views', { p_path_id: path.id }).then(() => {})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path.id])

  async function handleLike() {
    if (liking) return
    const supabase = createClient()
    if (!supabase) return
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/login'; return }

    setLiking(true)
    try {
      const res = await fetch('/api/paths/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path_id: path.id }),
      })
      if (res.ok) {
        const json = await res.json()
        setLikes(json.likes_count)
        setLiked(json.liked)
      }
    } finally {
      setLiking(false)
    }
  }

  const score = rankScore(likes, path.views_count, 1)
  const tier  = computePathRank(likes, path.views_count, 1)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05, ease: 'easeOut' }}
      className="group overflow-hidden rounded-2xl border border-white/65 bg-white/45 shadow-sm shadow-slate-200/30 backdrop-blur-xl transition-all duration-300 hover:border-white/80 hover:shadow-lg"
    >
      {/* Header */}
      <div className="flex items-start gap-3 p-5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 text-2xl">
          {path.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-slate-800 leading-snug">{path.title}</h3>
            <PathRankBadge tier={tier} size="xs" />
          </div>
          {path.description && (
            <p className="mt-1 line-clamp-2 text-xs text-slate-500">{path.description}</p>
          )}
          <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {path.profiles?.username ?? 'Anonim'}
            </span>
            <span>{timeAgo(path.created_at)}</span>
            <span>{path.steps.length} adım</span>
          </div>
        </div>
      </div>

      {/* Actions bar */}
      <div className="flex items-center gap-3 border-t border-slate-100/60 px-5 py-3">
        <button
          onClick={handleLike}
          disabled={liking}
          className={`flex items-center gap-1.5 text-sm transition-colors disabled:opacity-60 ${
            liked ? 'text-pink-500' : 'text-slate-400 hover:text-pink-500'
          }`}
        >
          <Heart className={`h-4 w-4 ${liked ? 'fill-pink-500' : ''}`} />
          {likes}
        </button>
        <span className="flex items-center gap-1.5 text-sm text-slate-400">
          <Eye className="h-4 w-4" /> {path.views_count}
        </span>
        <span className="ml-auto text-[11px] text-slate-400">{score} puan</span>
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs text-slate-500 transition hover:bg-slate-100"
        >
          {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          {expanded ? 'Gizle' : 'Adımları Gör'}
        </button>
      </div>

      {/* Steps */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <ol className="space-y-0 border-t border-slate-100/60 px-5 py-4">
              {path.steps.map((step, i) => (
                <li key={i} className="flex gap-3 pb-4 last:pb-0">
                  {/* Step line */}
                  <div className="flex flex-col items-center">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-600">
                      {step.step ?? i + 1}
                    </div>
                    {i < path.steps.length - 1 && (
                      <div className="mt-1 w-px flex-1 bg-indigo-100" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1 pb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-xs font-semibold text-slate-700">{step.title}</p>
                      {step.tool && (
                        <span className="rounded-full bg-indigo-50 px-1.5 py-0.5 text-[10px] text-indigo-600">
                          {step.tool}
                        </span>
                      )}
                      {step.duration && (
                        <span className="text-[10px] text-slate-400">{step.duration}</span>
                      )}
                    </div>
                    {step.description && (
                      <p className="mt-0.5 text-[11px] text-slate-500">{step.description}</p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
