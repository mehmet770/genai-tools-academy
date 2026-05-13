'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Heart } from 'lucide-react'
import { useFavorites } from '@/contexts/FavoritesContext'
import { useToast } from '@/contexts/ToastContext'

interface FavoriteButtonProps {
  toolId: string
  toolName: string
  className?: string
}

export function FavoriteButton({ toolId, toolName, className = '' }: FavoriteButtonProps) {
  const { isFavorited, toggle, loading } = useFavorites()
  const { addToast } = useToast()
  const favorited = isFavorited(toolId)

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const result = await toggle(toolId)
    if (result === null) {
      addToast('Giriş yapman gerekiyor.', 'warning')
    } else if (result.action === 'added') {
      addToast(`${toolName} favorilere eklendi!`, 'success')
    } else {
      addToast(`${toolName} favorilerden kaldırıldı.`, 'info')
    }
  }

  return (
    <motion.button
      onClick={handleClick}
      disabled={loading}
      whileTap={{ scale: 0.85 }}
      className={`relative flex h-8 w-8 items-center justify-center rounded-xl border transition-all duration-200 ${
        favorited
          ? 'border-pink-200 bg-pink-50 text-pink-500 hover:bg-pink-100'
          : 'border-slate-200/60 bg-white/50 text-slate-400 hover:border-pink-200 hover:bg-pink-50 hover:text-pink-400'
      } ${className}`}
      aria-label={favorited ? 'Favorilerden kaldır' : 'Favorilere ekle'}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={String(favorited)}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1,   opacity: 1 }}
          exit={{    scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <Heart
            className={`h-4 w-4 transition-all ${favorited ? 'fill-pink-500 stroke-pink-500' : ''}`}
          />
        </motion.span>
      </AnimatePresence>
    </motion.button>
  )
}
