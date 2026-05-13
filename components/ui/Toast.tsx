'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react'
import { useToast } from '@/contexts/ToastContext'

const ICON_MAP = {
  success: { Icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50 border-emerald-200/60' },
  error:   { Icon: XCircle,      color: 'text-red-500',     bg: 'bg-red-50 border-red-200/60' },
  info:    { Icon: Info,         color: 'text-indigo-500',  bg: 'bg-white/70 border-white/65' },
  warning: { Icon: AlertTriangle, color: 'text-amber-500',  bg: 'bg-amber-50 border-amber-200/60' },
}

export function ToastContainer() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[100] flex flex-col gap-2">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const { Icon, color, bg } = ICON_MAP[toast.type]
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 48, scale: 0.94 }}
              animate={{ opacity: 1, x: 0,  scale: 1    }}
              exit={{    opacity: 0, x: 48, scale: 0.94 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className={`pointer-events-auto flex w-72 items-start gap-3 rounded-2xl border px-4 py-3 shadow-lg shadow-slate-200/50 backdrop-blur-xl ${bg}`}
            >
              <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${color}`} />
              <p className="flex-1 text-sm leading-snug text-slate-700">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-auto rounded-lg p-0.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
