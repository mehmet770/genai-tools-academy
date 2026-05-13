'use client'

import { ToastProvider } from '@/contexts/ToastContext'
import { FavoritesProvider } from '@/contexts/FavoritesContext'
import { ToastContainer } from '@/components/ui/Toast'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <FavoritesProvider>
        {children}
        <ToastContainer />
      </FavoritesProvider>
    </ToastProvider>
  )
}
