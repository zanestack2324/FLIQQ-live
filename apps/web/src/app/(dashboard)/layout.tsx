'use client'

import { useEffect } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Sidebar } from '@/components/layout/sidebar'
import { useUIStore } from '@/stores/ui-store'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { sidebarOpen, setSidebarOpen, setIsMobile, isMobile } = useUIStore()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth < 1024) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [setIsMobile, setSidebarOpen])

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <Sidebar isMobile={isMobile} />
      <main
        className={`pt-16 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'ml-0'}`}
      >
        {children}
      </main>
    </div>
  )
}
