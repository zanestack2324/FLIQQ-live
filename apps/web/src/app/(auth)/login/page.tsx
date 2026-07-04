'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { OAuthButtons } from '@/components/auth/oauth-buttons'
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      toast.error('Please fill in all fields')
      return
    }
    setIsLoading(true)
    try {
      const result = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      })
      if (result?.error) {
        toast.error(result.error === 'CredentialsSignin' ? 'Invalid email or password' : result.error)
      } else {
        toast.success('Welcome back!')
        router.push('/feed')
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black border border-white/10 rounded-2xl p-8 shadow-2xl shadow-purple-500/5">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
        <p className="text-gray-400">Sign in to continue to FLIQQ</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          icon={<Mail size={16} />}
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter your password"
          icon={<Lock size={16} />}
          rightIcon={
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-white">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <div className="flex items-center justify-end">
          <Link href="/forgot-password" className="text-sm text-purple-400 hover:text-purple-300">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" fullWidth size="lg" loading={isLoading}>
          <LogIn size={18} />
          Sign In
        </Button>
      </form>

      <div className="mt-6">
        <OAuthButtons
          onGoogleLogin={() => signIn('google', { callbackUrl: '/feed' })}
          onAppleLogin={() => signIn('apple', { callbackUrl: '/feed' })}
        />
      </div>

      <p className="mt-6 text-center text-sm text-gray-400">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-purple-400 hover:text-purple-300 font-medium">
          Sign up
        </Link>
      </p>
    </div>
  )
}
