'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/stores/auth-store'
import { useUIStore } from '@/stores/ui-store'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import {
  Search,
  Bell,
  LogOut,
  User,
  Settings,
  CreditCard,
  Menu,
  X,
  Sun,
  Moon,
  Gem,
  Monitor,
  Sparkles,
  Video,
} from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

export function Navbar() {
  const pathname = usePathname()
  const { user, isAuthenticated } = useAuthStore()
  const { theme, toggleTheme, sidebarOpen, toggleSidebar, isMobile } = useUIStore()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showUserMenu, setShowUserMenu] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-black/80 backdrop-blur-xl border-b border-white/10">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        <div className="flex items-center gap-4">
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image src="/logo.svg" alt="FLIQQ" width={32} height={32} className="w-8 h-8" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent hidden sm:inline">
              FLIQQ
            </span>
          </Link>
        </div>

        <div className={cn('hidden md:flex items-center flex-1 max-w-xl mx-4', searchOpen && 'flex')}>
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search streams, creators, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 md:hidden"
          >
            <Search size={20} />
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {isAuthenticated ? (
            <>
              <Link
                href="/creator/go-live"
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                <Video size={16} />
                Go Live
              </Link>

              <Link
                href="/wallet"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 text-amber-300 text-sm font-medium rounded-xl hover:from-amber-500/30 hover:to-yellow-500/30 transition-all"
              >
                <Gem size={14} />
                <span className="hidden sm:inline">{user?.wallet?.coinBalance?.toLocaleString() || 0}</span>
              </Link>

              <button className="relative p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 rounded-lg hover:bg-white/5"
                >
                  <Avatar src={user?.avatarUrl} alt={user?.displayName || ''} size="sm" isOnline />
                </button>

                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                    <div className="absolute right-0 top-full mt-2 w-64 bg-gray-900 border border-white/10 rounded-xl shadow-2xl shadow-black/50 z-20 overflow-hidden animate-scale-in">
                      <div className="p-4 border-b border-white/10">
                        <p className="font-semibold text-white">{user?.displayName}</p>
                        <p className="text-sm text-gray-400">@{user?.username}</p>
                      </div>
                      <div className="p-2">
                        {[
                          { href: `/profile/${user?.id}`, label: 'Profile', icon: User },
                          { href: '/wallet', label: 'Wallet', icon: CreditCard },
                          { href: '/dashboard', label: 'Creator Dashboard', icon: Monitor },
                          { href: '/settings', label: 'Settings', icon: Settings },
                        ].map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                          >
                            <item.icon size={16} />
                            {item.label}
                          </Link>
                        ))}
                      </div>
                      <div className="p-2 border-t border-white/10">
                        <button
                          onClick={() => {
                            setShowUserMenu(false)
                            useAuthStore.getState().logout()
                          }}
                          className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <LogOut size={16} />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">Log In</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">
                  <Sparkles size={14} />
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
