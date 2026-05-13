'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const supabase = createClient()
    if (!supabase) {
      setError('Supabase yapılandırılmamış. Lütfen .env.local dosyasını kontrol et.')
      return
    }

    setLoading(true)
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)

    if (authError) {
      setError('E-posta veya şifre hatalı.')
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="E-posta"
        type="email"
        placeholder="sen@ornek.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        label="Şifre"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {error && (
        <p className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      <Button type="submit" loading={loading} size="lg" className="mt-1 w-full">
        Giriş Yap
      </Button>

      <p className="text-center text-sm text-[var(--muted-foreground)]">
        Hesabın yok mu?{' '}
        <Link
          href="/register"
          className="font-medium text-[var(--accent)] hover:underline"
        >
          Kayıt Ol
        </Link>
      </p>
    </form>
  )
}
