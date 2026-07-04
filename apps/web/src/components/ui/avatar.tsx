'use client'

import { cn, getInitials } from '@/lib/utils'
import Image from 'next/image'

interface AvatarProps {
  src?: string | null
  alt?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  className?: string
  isOnline?: boolean
  isVerified?: boolean
}

const sizeStyles = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
  '2xl': 'w-24 h-24 text-2xl',
}

const onlineDotStyles = {
  sm: 'w-2.5 h-2.5 border',
  md: 'w-3 h-3 border-2',
  lg: 'w-3 h-3 border-2',
  xl: 'w-3.5 h-3.5 border-2',
  '2xl': 'w-4 h-4 border-2',
}

export function Avatar({ src, alt = '', size = 'md', className, isOnline, isVerified }: AvatarProps) {
  return (
    <div className={cn('relative inline-flex shrink-0', className)}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={96}
          height={96}
          className={cn('rounded-full object-cover', sizeStyles[size])}
        />
      ) : (
        <div
          className={cn(
            'rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center font-bold text-white',
            sizeStyles[size]
          )}
        >
          {getInitials(alt || 'U')}
        </div>
      )}
      {isOnline && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full bg-green-500 border-black',
            onlineDotStyles[size]
          )}
        />
      )}
      {isVerified && (
        <svg
          className="absolute -top-0.5 -right-0.5 w-4 h-4 text-blue-500"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
      )}
    </div>
  )
}
