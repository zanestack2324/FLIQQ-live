'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { formatNumber } from '@/lib/utils'
import { Play, Users } from 'lucide-react'

type StreamCardProps = {
  stream: {
    id: string
    title: string
    displayName: string
    username: string
    category: string | null
    viewerCount: number
    thumbnailUrl: string | null
    avatarUrl: string | null
    isVerified?: boolean
    tags?: string[]
    isLive?: boolean
  }
}

export function StreamCard({ stream }: StreamCardProps) {
  return (
    <Link href={`/live/${stream.id}`}>
      <Card hover className="group h-full">
        <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <Play size={48} className="text-white/20 group-hover:text-white/60 transition-all group-hover:scale-110" />
          <div className="absolute top-2 left-2 flex items-center gap-1.5">
            {stream.isLive && (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded-md">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                LIVE
              </span>
            )}
            <span className="flex items-center gap-1 px-2 py-0.5 bg-black/70 text-white text-xs rounded-md">
              <Users size={12} />
              {formatNumber(stream.viewerCount)}
            </span>
          </div>
          {stream.category && (
            <Badge variant="default" className="absolute bottom-2 left-2 text-xs">
              {stream.category}
            </Badge>
          )}
        </div>
        <div className="p-3">
          <div className="flex items-start gap-3">
            <Avatar src={stream.avatarUrl} alt={stream.displayName} size="md" isVerified={stream.isVerified} />
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-white truncate group-hover:text-purple-300 transition-colors text-sm">
                {stream.title}
              </h3>
              <p className="text-sm text-gray-400 truncate">{stream.displayName}</p>
              <p className="text-xs text-gray-500">{formatNumber(stream.viewerCount)} viewers</p>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}

export function StreamCardSkeleton() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
      <div className="aspect-video bg-gray-800 animate-pulse" />
      <div className="p-3 space-y-2">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-800 animate-pulse shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-800 rounded animate-pulse w-full" />
            <div className="h-3 bg-gray-800 rounded animate-pulse w-2/3" />
          </div>
        </div>
      </div>
    </div>
  )
}
