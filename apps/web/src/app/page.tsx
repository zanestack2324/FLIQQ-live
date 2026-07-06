'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Sparkles, LogIn } from 'lucide-react'

const linkBase =
  'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black'
const primaryLink =
  'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/25 px-8 py-4 text-lg rounded-2xl'
const outlineLink =
  'border border-purple-500 text-purple-400 hover:bg-purple-500/10 px-8 py-4 text-lg rounded-2xl'

export default function HomePage() {
  const [showButtons, setShowButtons] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowButtons(true), 2800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative min-h-screen bg-black flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-pink-600/15 rounded-full blur-[96px] pointer-events-none" />

      <div
        className={`flex flex-col items-center transition-all duration-700 ${
          showButtons ? 'scale-75 translate-y-[-30px] opacity-40' : ''
        }`}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-full blur-3xl opacity-30 animate-pulse" />
          <Image
            src="/fliqq-logo.png"
            alt="FLIQQ"
            width={200}
            height={200}
            className={`object-contain drop-shadow-[0_0_40px_rgba(168,85,247,0.5)] transition-all duration-700 ${
              showButtons ? 'w-24 h-24' : 'animate-breathe'
            }`}
            priority
          />
        </div>

        <h1
          className={`mt-8 font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent transition-all duration-700 ${
            showButtons ? 'text-3xl' : 'text-5xl'
          }`}
        >
          FLIQQ
        </h1>
        <p className="mt-2 text-sm text-gray-500 tracking-widest uppercase">
          Live Streaming
        </p>
      </div>

      <div
        className={`flex flex-col sm:flex-row items-center gap-4 transition-all duration-500 delay-300 ${
          showButtons ? 'opacity-100 mt-10' : 'opacity-0'
        }`}
      >
        <Link href="/signup" className={`${linkBase} ${primaryLink}`}>
          <Sparkles size={20} />
          Get Started Free
        </Link>
        <Link href="/login" className={`${linkBase} ${outlineLink}`}>
          <LogIn size={20} />
          Sign In
        </Link>
      </div>
    </div>
  )
}
