'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, User, FileText, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/contexts/ToastContext'
import type { Profile } from '@/lib/types'

interface ProfileEditorProps {
  profile: Profile | null
  userId: string
}

export function ProfileEditor({ profile, userId }: ProfileEditorProps) {
  const [username, setUsername] = useState(profile?.username ?? '')
  const [bio, setBio] = useState(profile?.bio ?? '')
  const [saving, setSaving] = useState(false)
  const { addToast } = useToast()

  const handleSave = async () => {
    if (!username.trim()) { addToast('Kullanıcı adı boş olamaz.', 'warning'); return }
    setSaving(true)
    const supabase = createClient()
    if (!supabase) { setSaving(false); return }

    const { error } = await supabase
      .from('profiles')
      .update({ username: username.trim(), bio: bio.trim() || null })
      .eq('id', userId)

    if (error) addToast('Kayıt başarısız: ' + error.message, 'error')
    else addToast('Profil güncellendi!', 'success')
    setSaving(false)
  }

  return (
    <div className="rounded-2xl border border-white/65 bg-white/45 p-6 shadow-sm shadow-slate-200/30 backdrop-blur-xl">
      <h2 className="mb-5 text-sm font-semibold text-slate-700">Profil Düzenle</h2>

      <div className="space-y-4">
        {/* Username */}
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <User className="h-3.5 w-3.5" />
            Kullanıcı Adı
          </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="kullanici_adi"
            className="w-full rounded-xl border border-slate-200/60 bg-white/60 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-300 outline-none backdrop-blur-sm transition-all focus:border-indigo-300 focus:bg-white/80 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <FileText className="h-3.5 w-3.5" />
            Hakkımda
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Kendinizden kısaca bahsedin..."
            rows={3}
            className="w-full resize-none rounded-xl border border-slate-200/60 bg-white/60 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-300 outline-none backdrop-blur-sm transition-all focus:border-indigo-300 focus:bg-white/80 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <motion.button
          onClick={handleSave}
          disabled={saving}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-indigo-200/50 transition-all hover:bg-indigo-600 disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? 'Kaydediliyor...' : 'Kaydet'}
        </motion.button>
      </div>
    </div>
  )
}
