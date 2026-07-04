import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'premium'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
  size?: 'sm' | 'md'
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-white/10 text-gray-300',
  primary: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
  success: 'bg-green-500/20 text-green-300 border border-green-500/30',
  warning: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
  danger: 'bg-red-500/20 text-red-300 border border-red-500/30',
  premium: 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-500/30',
}

export function Badge({ children, variant = 'default', className, size = 'sm' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium rounded-full',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
