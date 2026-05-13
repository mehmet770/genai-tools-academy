'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import { Bot, Users, Compass, LogIn, Newspaper, BookOpen, Search, GitCompare, Map, Shuffle } from 'lucide-react'
import { ProfileDropdown } from '@/components/account/ProfileDropdown'
import { SearchModal } from '@/components/search/SearchModal'

const NAV_LINKS = [
  { href: '/',          label: 'Keşfet',    icon: Compass },
  { href: '/community', label: 'Topluluk',  icon: Users },
  { href: '/news',      label: 'Haberler',  icon: Newspaper },
  { href: '/prompts',   label: 'Promptlar', icon: BookOpen },
  { href: '/compare',   label: 'Karşılaştır',    icon: GitCompare },
  { href: '/paths',        label: 'Yol Haritaları', icon: Map },
  { href: '/alternatives', label: 'Alternatifler',  icon: Shuffle },
]

export function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getUser().then(({ data }) => setUser(data.user))

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const handleSignOut = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/60 shadow-sm shadow-slate-200/30 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 font-semibold text-[var(--foreground)]"
          >
            <Bot className="h-5 w-5 text-[var(--accent)]" />
            <span className="text-sm font-semibold tracking-tight text-slate-800">GENAI Academy</span>
          </Link>

          {/* Nav links — hidden on mobile */}
          <div className="hidden items-center gap-0.5 md:flex">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm text-slate-500 transition-colors hover:bg-slate-100/80 hover:text-slate-800"
              >
                <Icon className="h-4 w-4" />
                <span className="hidden lg:block">{label}</span>
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Search button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-slate-200/60 bg-white/50 px-3 py-1.5 text-sm text-slate-400 shadow-sm backdrop-blur-sm transition-all hover:bg-white/70 hover:text-slate-600 hover:shadow-md"
            >
              <Search className="h-4 w-4" />
              <span className="hidden text-xs sm:block">Ara</span>
              <kbd className="hidden rounded-md border border-slate-200 bg-slate-50 px-1 py-0.5 text-[10px] font-medium text-slate-300 lg:block">
                ⌘K
              </kbd>
            </button>

            {user ? (
              <ProfileDropdown user={user} onSignOut={handleSignOut} />
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-[var(--accent-hover)] hover:shadow-md"
              >
                <LogIn className="h-4 w-4" />
                Giriş Yap
              </Link>
            )}
          </div>
        </nav>
      </header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
