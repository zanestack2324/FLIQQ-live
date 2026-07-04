'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { SplashScreen } from '@/components/splash-screen'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [showSplash, setShowSplash] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const seen = sessionStorage.getItem('fliqqSplashSeen')
    if (seen) {
      setShowSplash(false)
    }
    setMounted(true)
  }, [])

  const handleFinish = () => {
    setShowSplash(false)
    sessionStorage.setItem('fliqqSplashSeen', 'true')
  }

  if (!mounted || showSplash) {
    return <SplashScreen onFinish={handleFinish} />
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20 pointer-events-none" />
      <div className="relative flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2">
              <Image src="/fliqq-logo.png" alt="FLIQQ" width={40} height={40} />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                FLIQQ
              </span>
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
