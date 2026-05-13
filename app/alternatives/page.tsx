import type { Metadata } from 'next'
import { AlternativesSection } from '@/components/alternatives/AlternativesSection'

export const metadata: Metadata = {
  title: 'Alternatif Zekalar — GENAI Academy',
  description: 'ChatGPT, Midjourney, ElevenLabs ve daha fazlasının açık kaynak, ücretsiz ve yerel çalışan alternatifleri.',
}

export default function AlternativesPage() {
  return <AlternativesSection />
}
