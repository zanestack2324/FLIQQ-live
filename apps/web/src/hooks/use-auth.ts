'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useAuthStore } from '@/stores/auth-store'
import { useEffect } from 'react'

export function useAuth() {
  const { data: session, status } = useSession()
  const { user, setUser, setLoading, logout: storeLogout } = useAuthStore()

  useEffect(() => {
    if (status === 'loading') {
      setLoading(true)
      return
    }

    if (session?.user) {
      const u = session.user as Record<string, unknown>
      setUser({
        id: u.id as string,
        email: (u.email as string) || '',
        username: (u.username as string) || '',
        displayName: (u.displayName as string) || (u.name as string) || '',
        avatarUrl: (u.avatarUrl as string) || (u.image as string) || null,
        bannerUrl: null,
        bio: null,
        role: (u.role as string) || 'USER',
        isVerifiedBadge: !!(u.isVerifiedBadge),
        isOnline: true,
      })
    } else {
      setUser(null)
    }
  }, [session, status, setUser, setLoading])

  return {
    user,
    isAuthenticated: !!user,
    isLoading: status === 'loading',
    login: (provider?: string) =>
      provider ? signIn(provider, { callbackUrl: '/' }) : signIn('credentials', { callbackUrl: '/' }),
    loginWithGoogle: () => signIn('google', { callbackUrl: '/' }),
    loginWithApple: () => signIn('apple', { callbackUrl: '/' }),
    logout: async () => {
      storeLogout()
      await signOut({ callbackUrl: '/' })
    },
  }
}
