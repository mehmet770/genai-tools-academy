'use client'

import { motion } from 'framer-motion'
import { Sparkles, Zap } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      {/* Pastel animated blobs (aydınlık tema) */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          animate={{ x: [0, 30, -20, 0], y: [0, -35, 22, 0], scale: [1, 1.10, 0.94, 1] }}
          transition={{ duration: 18, ease: 'easeInOut', repeat: Infinity }}
          className="absolute left-1/4 top-0 h-[600px] w-[600px] -translate-y-1/2 rounded-full"
          style={{ background: 'radial-gradient(circle, #bfdbfe 0%, transparent 65%)', filter: 'blur(80px)', opacity: 0.7 }}
        />
        <motion.div
          animate={{ x: [0, -20, 35, 0], y: [0, 30, -18, 0], scale: [1, 0.92, 1.08, 1] }}
          transition={{ duration: 22, ease: 'easeInOut', repeat: Infinity, delay: 3 }}
          className="absolute -right-24 top-1/3 h-[500px] w-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, #fbcfe8 0%, transparent 65%)', filter: 'blur(80px)', opacity: 0.65 }}
        />
        <motion.div
          animate={{ x: [0, 18, -28, 0], y: [0, -20, 14, 0], scale: [1, 1.06, 0.96, 1] }}
          transition={{ duration: 26, ease: 'easeInOut', repeat: Infinity, delay: 6 }}
          className="absolute -left-20 bottom-0 h-[450px] w-[450px] rounded-full"
          style={{ background: 'radial-gradient(circle, #a7f3d0 0%, transparent 65%)', filter: 'blur(80px)', opacity: 0.55 }}
        />
      </div>

      {/* Dot grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
        >
          <div className="animate-float mb-7 inline-flex items-center gap-2 rounded-full border border-indigo-200/70 bg-white/60 px-4 py-2 text-sm font-medium text-indigo-600 shadow-sm shadow-indigo-100/50 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            <span>En İyi AI Araçları Burada</span>
          </div>

          <h1 className="mb-6 text-5xl font-bold tracking-tight text-slate-900 sm:text-7xl">
            Yapay Zekayı{' '}
            <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 bg-clip-text text-transparent">
              Keşfet
            </span>
          </h1>

          <p className="mx-auto max-w-xl text-lg leading-relaxed text-slate-500">
            Metin, görsel, kod ve daha fazlası için en iyi AI araçlarını
            keşfet, öğren ve topluluğumuza katıl.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.2, ease: 'easeOut' }}
          className="mt-10 flex flex-wrap items-center justify-center gap-2.5 text-sm text-slate-500"
        >
          {['Metin', 'Görsel', 'Ses', 'Video', 'Kod', 'Veri'].map((cat) => (
            <span
              key={cat}
              className="flex items-center gap-1.5 rounded-full border border-slate-200/70 bg-white/50 px-3 py-1.5 shadow-sm backdrop-blur-sm"
            >
              <Zap className="h-3 w-3 text-indigo-400" />
              {cat}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
