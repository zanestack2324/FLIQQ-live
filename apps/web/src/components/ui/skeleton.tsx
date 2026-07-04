import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
}

export function Skeleton({ className, variant = 'text', width, height }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-white/10',
        variant === 'circular' && 'rounded-full',
        variant === 'text' && 'rounded-md h-4',
        variant === 'rectangular' && 'rounded-lg',
        className
      )}
      style={{ width, height }}
    />
  )
}

export function StreamCardSkeleton() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
      <Skeleton variant="rectangular" className="w-full aspect-video" />
      <div className="p-3 space-y-2">
        <div className="flex items-start gap-3">
          <Skeleton variant="circular" className="w-10 h-10 shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      </div>
    </div>
  )
}
