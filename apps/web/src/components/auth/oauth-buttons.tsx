'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Chrome, Apple } from 'lucide-react'

interface OAuthButtonsProps {
  onGoogleLogin?: () => void
  onAppleLogin?: () => void
  isLoading?: boolean
}

export function OAuthButtons({ onGoogleLogin, onAppleLogin, isLoading }: OAuthButtonsProps) {
  const [providers, setProviders] = useState<{ google: boolean; apple: boolean }>({ google: false, apple: false })

  useEffect(() => {
    fetch('/api/auth/providers')
      .then(r => r.json())
      .then(setProviders)
      .catch(() => {})
  }, [])

  const hasAny = providers.google || providers.apple
  if (!hasAny) return null

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-gray-950 text-gray-400">Or continue with</span>
        </div>
      </div>

      <div className={`grid gap-3 ${providers.google && providers.apple ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {providers.google && (
          <Button
            variant="secondary"
            size="lg"
            onClick={onGoogleLogin}
            loading={isLoading}
            className="w-full"
          >
            <Chrome size={18} />
            Google
          </Button>
        )}
        {providers.apple && (
          <Button
            variant="secondary"
            size="lg"
            onClick={onAppleLogin}
            loading={isLoading}
            className="w-full"
          >
            <Apple size={18} />
            Apple
          </Button>
        )}
      </div>
    </div>
  )
}
