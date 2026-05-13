import { Bot } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] mt-auto">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
          <Bot className="h-4 w-4" />
          <span>GENAI Academy</span>
        </div>
        <p className="text-xs text-[var(--muted-foreground)]">
          {new Date().getFullYear()} — Yapay zeka araçlarını keşfet
        </p>
      </div>
    </footer>
  )
}
