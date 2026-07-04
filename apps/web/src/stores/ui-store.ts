import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'dark' | 'light'

type UIState = {
  theme: Theme
  sidebarOpen: boolean
  mobileMenuOpen: boolean
  chatOpen: boolean
  isMobile: boolean
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  setMobileMenuOpen: (open: boolean) => void
  setChatOpen: (open: boolean) => void
  toggleChat: () => void
  setIsMobile: (isMobile: boolean) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'dark',
      sidebarOpen: true,
      mobileMenuOpen: false,
      chatOpen: true,
      isMobile: false,
      setTheme: (theme) => {
        if (typeof document !== 'undefined') {
          document.documentElement.classList.remove('light', 'dark')
          document.documentElement.classList.add(theme)
        }
        set({ theme })
      },
      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === 'dark' ? 'light' : 'dark'
          if (typeof document !== 'undefined') {
            document.documentElement.classList.remove('light', 'dark')
            document.documentElement.classList.add(newTheme)
          }
          return { theme: newTheme }
        }),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setMobileMenuOpen: (mobileMenuOpen) => set({ mobileMenuOpen }),
      setChatOpen: (chatOpen) => set({ chatOpen }),
      toggleChat: () => set((state) => ({ chatOpen: !state.chatOpen })),
      setIsMobile: (isMobile) => set({ isMobile }),
    }),
    {
      name: 'fliqq-ui',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
)
