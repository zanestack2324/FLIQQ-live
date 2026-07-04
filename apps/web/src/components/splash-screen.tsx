'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

export function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [phase, setPhase] = useState<'logo' | 'fade'>('logo')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('fade'), 2500)
    const t2 = setTimeout(() => onFinish(), 3200)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [onFinish])

  return (
    <AnimatePresence>
      {phase === 'logo' && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-full blur-3xl opacity-30 animate-pulse" />
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="relative"
            >
              <Image
                src="/fliqq-logo.png"
                alt="FLIQQ"
                width={180}
                height={180}
                className="object-contain drop-shadow-[0_0_40px_rgba(168,85,247,0.5)]"
                priority
              />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-8 text-center"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              FLIQQ
            </h1>
            <p className="mt-2 text-sm text-gray-500 tracking-widest uppercase">
              Live Streaming
            </p>
          </motion.div>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 200 }}
            transition={{ delay: 1.2, duration: 1.3, ease: 'easeInOut' }}
            className="mt-8 h-0.5 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
