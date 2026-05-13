'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, HelpCircle, Info, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react'

const FAQ_ITEMS = [
  { q: 'Araçları nasıl favorilere eklerim?', a: 'Araç kartına tıklayarak detay sayfasına git ve kalp ikonuna tıkla.' },
  { q: 'Yorum yapabilmek için giriş gerekli mi?', a: 'Evet, yorum yapmak ve toplulukla etkileşime geçmek için hesap oluşturman gerekiyor.' },
  { q: 'Yeni araç önermek mümkün mü?', a: 'Topluluk sayfasından paylaşım yaparak araç önerebilirsin.' },
  { q: 'Tüm araçlar ücretsiz mi?', a: 'Araçların ücretlendirmesi kendi platformlarına bağlıdır; GENAI Academy ücretsiz bir katalogdur.' },
]

type TabKey = 'faq' | 'about' | 'ask'

export function SupportButton() {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<TabKey>('faq')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.97 }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl border border-white/60 bg-white/55 px-4 py-3 text-sm font-medium text-slate-700 shadow-lg shadow-slate-200/50 backdrop-blur-xl transition-shadow hover:shadow-xl hover:shadow-slate-300/40"
      >
        <MessageCircle className="h-4 w-4 text-indigo-500" />
        <span>Destek</span>
      </motion.button>

      {/* Modal Overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-slate-900/20 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed bottom-20 right-6 z-50 w-[360px] max-h-[520px] overflow-hidden rounded-3xl border border-white/65 bg-white/70 shadow-2xl shadow-slate-300/40 backdrop-blur-2xl flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100/70 px-5 py-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-indigo-100">
                    <MessageCircle className="h-4 w-4 text-indigo-600" />
                  </div>
                  <span className="font-semibold text-slate-800">Destek Merkezi</span>
                </div>
                <button onClick={() => setOpen(false)} className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-slate-100/70 px-5 gap-1 pt-2">
                {([
                  { key: 'faq', label: 'SSS', icon: HelpCircle },
                  { key: 'about', label: 'Hakkımızda', icon: Info },
                  { key: 'ask', label: 'Soru Sor', icon: Lightbulb },
                ] as { key: TabKey; label: string; icon: React.ComponentType<{ className?: string }> }[]).map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setTab(key)}
                    className={`flex items-center gap-1.5 rounded-t-lg px-3 py-2 text-xs font-medium transition-colors ${
                      tab === key
                        ? 'border-b-2 border-indigo-500 text-indigo-600'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-5">
                {tab === 'faq' && (
                  <div className="space-y-2">
                    {FAQ_ITEMS.map((item, i) => (
                      <div key={i} className="rounded-2xl border border-slate-100 bg-white/60 overflow-hidden">
                        <button
                          onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                          className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-slate-700"
                        >
                          {item.q}
                          {expandedFaq === i ? <ChevronUp className="h-4 w-4 text-slate-400 shrink-0" /> : <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />}
                        </button>
                        <AnimatePresence>
                          {expandedFaq === i && (
                            <motion.div
                              initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <p className="border-t border-slate-100 px-4 py-3 text-sm text-slate-500">{item.a}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                )}

                {tab === 'about' && (
                  <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500">
                      <Info className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-base font-semibold text-slate-800">GENAI Tools Academy Nedir?</h3>
                    <p>Yapay zeka araçlarını keşfetmek, öğrenmek ve toplulukla paylaşmak için kurulmuş, ücretsiz ve bağımsız bir platformdur.</p>
                    <p>En iyi AI araçlarını tek çatı altında toplamayı ve her kullanıcının ihtiyacına uygun aracı kolayca bulmasını hedefliyoruz.</p>
                    <div className="rounded-2xl bg-indigo-50 p-4">
                      <p className="font-medium text-indigo-800">Bize ulaş</p>
                      <p className="text-indigo-600 text-xs mt-1">destek@genai-academy.com</p>
                    </div>
                  </div>
                )}

                {tab === 'ask' && (
                  <div className="space-y-3">
                    <p className="text-sm text-slate-500">Aklındaki soruyu veya öneriyi bize ilet.</p>
                    <textarea
                      rows={4}
                      placeholder="Sorunuzu veya önerinizi yazın..."
                      className="w-full rounded-2xl border border-slate-200 bg-white/70 p-3 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 resize-none"
                    />
                    <button className="w-full rounded-2xl bg-indigo-500 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-600">
                      Gönder
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
