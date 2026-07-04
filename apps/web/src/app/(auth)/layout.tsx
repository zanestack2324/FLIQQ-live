import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'

const SplashWrapper = dynamic(() => import('@/components/splash-wrapper'), { ssr: false })

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <SplashWrapper>
        <div className="min-h-screen bg-black flex flex-col">
          <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20 pointer-events-none" />
          <div className="relative flex-1 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
              <div className="text-center mb-8">
                <Link href="/" className="inline-flex items-center gap-2">
                  <Image src="/fliqq-logo.png" alt="FLIQQ" width={40} height={40} />
                  <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    FLIQQ
                  </span>
                </Link>
              </div>
              {children}
            </div>
          </div>
        </div>
      </SplashWrapper>
    </>
  )
}
