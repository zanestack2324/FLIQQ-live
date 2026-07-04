'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import api from '@/lib/api'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast.error('Please enter your email')
      return
    }
    setIsLoading(true)
    try {
      await api.post('/auth/forgot-password', { email })
      setIsSent(true)
      toast.success('Password reset link sent to your email')
    } catch {
      toast.success('If an account exists, a reset link has been sent')
      setIsSent(true)
    } finally {
      setIsLoading(false)
    }
  }

  if (isSent) {
    return (
      <div className="bg-gradient-to-b from-gray-900 to-black border border-white/10 rounded-2xl p-8 shadow-2xl shadow-purple-500/5 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
          <CheckCircle size={32} className="text-green-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Check Your Email</h1>
        <p className="text-gray-400 mb-2">
          We&apos;ve sent a password reset link to:
        </p>
        <p className="text-purple-400 font-medium mb-6">{email}</p>
        <p className="text-sm text-gray-500 mb-6">
          Didn&apos;t receive it? Check your spam folder or try again in a few minutes.
        </p>
        <Link href="/login">
          <Button variant="ghost">
            <ArrowLeft size={16} />
            Back to Sign In
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black border border-white/10 rounded-2xl p-8 shadow-2xl shadow-purple-500/5">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
        <p className="text-gray-400">
          Enter your email and we&apos;ll send you a reset link
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          icon={<Mail size={16} />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button type="submit" fullWidth size="lg" loading={isLoading}>
          <Send size={18} />
          Send Reset Link
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link href="/login" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={14} />
          Back to Sign In
        </Link>
      </div>
    </div>
  )
}
