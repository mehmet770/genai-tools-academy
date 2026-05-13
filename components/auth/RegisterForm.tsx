'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export function RegisterForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.')
      return
    }

    const supabase = createClient()
    if (!supabase) {
      setError('Supabase yapılandırılmamış. Lütfen .env.local dosyasını kontrol et.')
      return
    }

    setLoading(true)
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    })
    setLoading(false)

    if (authError) {
      setError(authError.message)
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Kullanıcı Adı"
        type="text"
        placeholder="kullanici_adiniz"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
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
        placeholder="En az 6 karakter"
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
        Kayıt Ol
      </Button>

      <p className="text-center text-sm text-[var(--muted-foreground)]">
        Zaten hesabın var mı?{' '}
        <Link
          href="/login"
          className="font-medium text-[var(--accent)] hover:underline"
        >
          Giriş Yap
        </Link>
      </p>
    </form>
  )
}
