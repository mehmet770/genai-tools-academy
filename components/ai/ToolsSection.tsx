'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FilterBar } from '@/components/ui/FilterBar'
import { ToolCard } from '@/components/ai/ToolCard'
import type { AITool, AIToolCategory } from '@/lib/types'

export function ToolsSection({ tools }: { tools: AITool[] }) {
  const [activeCategory, setActiveCategory] = useState<AIToolCategory | 'all'>('all')

  const filtered = activeCategory === 'all'
    ? tools
    : tools.filter((t) => t.category === activeCategory)

  return (
    <div>
      <FilterBar active={activeCategory} onSelect={setActiveCategory} count={filtered.length} />
      <motion.div
        layout
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((tool) => (
            <motion.div
              key={tool.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <ToolCard tool={tool} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
