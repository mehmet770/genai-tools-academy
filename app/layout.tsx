import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/layout/Providers'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { MeshBackground } from '@/components/layout/MeshBackground'
import { SupportButton } from '@/components/support/SupportButton'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'GENAI Tools Academy',
    template: '%s | GENAI Academy',
  },
  description: 'Yapay zeka araçlarını interaktif 3D deneyimle keşfet, öğren ve topluluğa katıl.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col text-[var(--foreground)]">
        <MeshBackground />
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <SupportButton />
        </Providers>
      </body>
    </html>
  )
}
