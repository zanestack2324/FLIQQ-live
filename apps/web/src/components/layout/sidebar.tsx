'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUIStore } from '@/stores/ui-store'
import { cn } from '@/lib/utils'
import {
  Home,
  Flame,
  TrendingUp,
  Gamepad2,
  Music,
  Palette,
  MessageCircle,
  Trophy,
  Users,
  Radio,
  Podcast,
  Code,
  Compass,
  Heart,
  Clock,
  ThumbsUp,
  Medal,
  Sparkles,
  Crown,
  Gift,
  Zap,
  Film,
  Scissors,
} from 'lucide-react'

const mainLinks = [
  { href: '/feed', label: 'Home', icon: Home },
  { href: '/feed?sort=trending', label: 'Trending', icon: Flame },
  { href: '/feed?sort=popular', label: 'Popular', icon: TrendingUp },
  { href: '/leaderboard', label: 'Leaderboard', icon: Medal },
  { href: '/challenges', label: 'Challenges', icon: Sparkles },
]

const extrasLinks = [
  { href: '/subscriptions', label: 'Subscriptions', icon: Crown },
  { href: '/referrals', label: 'Refer & Earn', icon: Gift },
  { href: '/pk-battles', label: 'PK Battles', icon: Zap },
  { href: '/clips', label: 'Clips & VODs', icon: Scissors },
]

const categories = [
  { href: '/feed?category=gaming', label: 'Gaming', icon: Gamepad2 },
  { href: '/feed?category=music', label: 'Music', icon: Music },
  { href: '/feed?category=art', label: 'Art', icon: Palette },
  { href: '/feed?category=chatting', label: 'Chatting', icon: MessageCircle },
  { href: '/feed?category=sports', label: 'Sports', icon: Trophy },
  { href: '/feed?category=just-chatting', label: 'Just Chatting', icon: Users },
  { href: '/feed?category=irl', label: 'IRL', icon: Radio },
  { href: '/feed?category=podcast', label: 'Podcast', icon: Podcast },
  { href: '/feed?category=tech', label: 'Tech', icon: Code },
]

const discoverLinks = [
  { href: '/feed?sort=recommended', label: 'Recommended', icon: Compass },
  { href: '/feed?sort=followed', label: 'Followed', icon: Heart },
  { href: '/feed?sort=recent', label: 'Recent', icon: Clock },
  { href: '/feed?sort=most-liked', label: 'Most Liked', icon: ThumbsUp },
]

interface SidebarProps {
  isMobile?: boolean
}

export function Sidebar({ isMobile }: SidebarProps) {
  const pathname = usePathname()
  const { sidebarOpen, setSidebarOpen } = useUIStore()

  const sidebarContent = (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-thin">
      <div className="p-4 space-y-1">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">Main</p>
        {mainLinks.map((link) => (
          <SidebarLink key={link.href} {...link} current={pathname} />
        ))}
      </div>

      <div className="px-4 space-y-1">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">Categories</p>
        {categories.map((link) => (
          <SidebarLink key={link.href} {...link} current={pathname} />
        ))}
      </div>

      <div className="p-4 space-y-1">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">Discover</p>
        {discoverLinks.map((link) => (
          <SidebarLink key={link.href} {...link} current={pathname} />
        ))}
      </div>

      <div className="px-4 space-y-1">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">More</p>
        {extrasLinks.map((link) => (
          <SidebarLink key={link.href} {...link} current={pathname} />
        ))}
      </div>

      <div className="mt-auto p-4 border-t border-white/10">
        <p className="text-xs text-gray-500 text-center">
          &copy; 2026 FLIQQ. All rights reserved.
        </p>
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <>
        {sidebarOpen && (
          <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}
        <aside
          className={cn(
            'fixed top-16 left-0 bottom-0 z-30 w-64 bg-gray-950 border-r border-white/10 transform transition-transform duration-300 lg:hidden',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          {sidebarContent}
        </aside>
      </>
    )
  }

  return (
    <aside
      className={cn(
        'fixed top-16 left-0 bottom-0 z-20 bg-gray-950 border-r border-white/10 transition-all duration-300 overflow-hidden',
        sidebarOpen ? 'w-64' : 'w-0'
      )}
    >
      <div className={cn('w-64 h-full', !sidebarOpen && 'opacity-0 pointer-events-none')}>
        {sidebarContent}
      </div>
    </aside>
  )
}

function SidebarLink({
  href,
  label,
  icon: Icon,
  current,
}: {
  href: string
  label: string
  icon: React.ElementType
  current: string
}) {
  const isActive = current === href || current.startsWith(href.split('?')[0] + '/')
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-200',
        isActive
          ? 'bg-purple-500/10 text-purple-300 font-medium'
          : 'text-gray-400 hover:text-white hover:bg-white/5'
      )}
    >
      <Icon size={18} />
      {label}
    </Link>
  )
}
