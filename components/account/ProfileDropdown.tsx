'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, Heart, LogOut, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface ProfileDropdownProps {
  user: SupabaseUser
  onSignOut: () => void
}

export function ProfileDropdown({ user, onSignOut }: ProfileDropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const initial = user.email?.charAt(0).toUpperCase() ?? 'U'

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-xl border border-slate-200/60 bg-white/50 px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm backdrop-blur-md transition-all hover:bg-white/70 hover:shadow-md"
      >
        {/* Avatar */}
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-xs font-bold text-white">
          {initial}
        </span>
        <span className="hidden max-w-[120px] truncate sm:block">{user.email}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 top-full mt-2 w-52 overflow-hidden rounded-2xl border border-white/60 bg-white/70 shadow-xl shadow-slate-200/60 backdrop-blur-xl"
          >
            {/* Kullanici bilgisi */}
            <div className="border-b border-slate-100/80 px-4 py-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-bold text-white">
                  {initial}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-slate-800">{user.email}</p>
                  <p className="text-[10px] text-slate-400">Uye</p>
                </div>
              </div>
            </div>

            {/* Menu ogeleri */}
            <div className="p-1.5">
              <Link
                href="/account"
                onClick={() => setOpen(false)}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
              >
                <Settings className="h-4 w-4" />
                Hesap Ayarları
              </Link>
              <Link
                href="/favorites"
                onClick={() => setOpen(false)}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-pink-50 hover:text-pink-600"
              >
                <Heart className="h-4 w-4" />
                Favori Araçlarım
              </Link>
            </div>

            <div className="border-t border-slate-100/80 p-1.5">
              <button
                onClick={() => { setOpen(false); onSignOut() }}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
              >
                <LogOut className="h-4 w-4" />
                Cikis Yap
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
