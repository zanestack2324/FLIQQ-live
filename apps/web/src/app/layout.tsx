import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import { Providers } from '@/components/layout/providers'
import '@/styles/globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const display = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'FLIQQ - Live Streaming Platform',
    template: '%s | FLIQQ',
  },
  description: 'Discover and stream live content on FLIQQ. Join millions of viewers and creators worldwide.',
  keywords: ['live streaming', 'streaming platform', 'fliqq', 'live video', 'creator'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'FLIQQ',
    title: 'FLIQQ - Live Streaming Platform',
    description: 'Discover and stream live content on FLIQQ.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FLIQQ - Live Streaming Platform',
    description: 'Discover and stream live content on FLIQQ.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${display.variable} font-sans bg-black text-white antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
