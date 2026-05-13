import type { Metadata } from 'next'
import { Bot } from 'lucide-react'
import { LoginForm } from '@/components/auth/LoginForm'

export const metadata: Metadata = {
  title: 'Giriş Yap',
}

export default function LoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/10">
            <Bot className="h-6 w-6 text-[var(--accent)]" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-semibold text-[var(--foreground)]">
              Tekrar hoş geldin
            </h1>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Hesabına giriş yap
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--muted)] p-6">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
