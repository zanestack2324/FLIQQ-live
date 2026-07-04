'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { OAuthButtons } from '@/components/auth/oauth-buttons'
import { Mail, Lock, User, Eye, EyeOff, Sparkles, Check } from 'lucide-react'
import { toast } from 'sonner'
import api from '@/lib/api'

export default function SignupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    displayName: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.username) errs.username = 'Username is required'
    else if (form.username.length < 3) errs.username = 'Username must be at least 3 characters'
    else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) errs.username = 'Username can only contain letters, numbers, and underscores'
    if (!form.email) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Please enter a valid email'
    if (!form.password) errs.password = 'Password is required'
    else if (form.password.length < 8) errs.password = 'Password must be at least 8 characters'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    try {
      await api.post('/auth/signup', form)
      toast.success('Account created successfully!')
      const result = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      })
      if (result?.error) {
        toast.success('Please sign in to continue.')
        router.push('/login')
      } else {
        router.push('/feed')
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create account'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black border border-white/10 rounded-2xl p-8 shadow-2xl shadow-purple-500/5">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Create Your Account</h1>
        <p className="text-gray-400">Join the FLIQQ community</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Username"
          placeholder="Choose a username"
          icon={<User size={16} />}
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          error={errors.username}
        />
        <Input
          label="Display Name"
          placeholder="Your display name"
          value={form.displayName}
          onChange={(e) => setForm({ ...form, displayName: e.target.value })}
        />
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          icon={<Mail size={16} />}
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          error={errors.email}
        />
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Create a strong password"
          icon={<Lock size={16} />}
          rightIcon={
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-white">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          error={errors.password}
        />

        <div className="space-y-2 text-sm text-gray-400">
          <p className="flex items-center gap-2">
            <Check size={14} className="text-green-400" />
            At least 8 characters
          </p>
          <p className="flex items-center gap-2">
            <Check size={14} className="text-green-400" />
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>

        <Button type="submit" fullWidth size="lg" loading={isLoading}>
          <Sparkles size={18} />
          Create Account
        </Button>
      </form>

      <div className="mt-6">
        <OAuthButtons
          onGoogleLogin={() => signIn('google', { callbackUrl: '/feed' })}
          onAppleLogin={() => signIn('apple', { callbackUrl: '/feed' })}
        />
      </div>

      <p className="mt-6 text-center text-sm text-gray-400">
        Already have an account?{' '}
        <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium">
          Sign in
        </Link>
      </p>
    </div>
  )
}
