'use client'

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'

interface FavoritesContextValue {
  favorites: Set<string>
  isFavorited: (toolId: string) => boolean
  toggle: (toolId: string) => Promise<{ action: 'added' | 'removed' } | null>
  loading: boolean
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null)

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/favorites')
      .then((r) => r.json())
      .then(({ favorites: ids }: { favorites: string[] }) => {
        setFavorites(new Set(ids ?? []))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const isFavorited = useCallback((id: string) => favorites.has(id), [favorites])

  const toggle = useCallback(async (toolId: string) => {
    const isCurrentlyFav = favorites.has(toolId)
    const method = isCurrentlyFav ? 'DELETE' : 'POST'

    // Optimistic update
    setFavorites((prev) => {
      const next = new Set(prev)
      isCurrentlyFav ? next.delete(toolId) : next.add(toolId)
      return next
    })

    try {
      const res = await fetch('/api/favorites', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool_id: toolId }),
      })
      if (!res.ok) throw new Error()
      return { action: isCurrentlyFav ? 'removed' : 'added' } as { action: 'added' | 'removed' }
    } catch {
      // Revert on error
      setFavorites((prev) => {
        const next = new Set(prev)
        isCurrentlyFav ? next.add(toolId) : next.delete(toolId)
        return next
      })
      return null
    }
  }, [favorites])

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorited, toggle, loading }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be inside FavoritesProvider')
  return ctx
}
