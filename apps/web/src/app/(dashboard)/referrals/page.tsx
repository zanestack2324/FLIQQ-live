'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { Users, Gift, Copy, Share2, CheckCircle, Clock, DollarSign } from 'lucide-react'

const MOCK_REFERRALS = [
  { username: 'new_user_42', status: 'COMPLETED', bonus: 5.00, date: '2 days ago' },
  { username: 'streamer_99', status: 'QUALIFIED', bonus: 2.50, date: '1 week ago' },
  { username: 'fan_101', status: 'PENDING', bonus: 0, date: 'Just now' },
]

export default function ReferralsPage() {
  const [code] = useState('FLIQQ-ABC123')

  const statusConfig = {
    COMPLETED: { label: 'Completed', variant: 'success' as const },
    QUALIFIED: { label: 'Qualified', variant: 'warning' as const },
    PENDING: { label: 'Pending', variant: 'secondary' as const },
  }

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Refer & Earn</h1>
          <p className="text-gray-400 mt-1">Invite friends and earn rewards</p>
        </div>
        <Gift size={24} className="text-orange-400" />
      </div>

      <Card className="p-6 mb-6 border-orange-500/30 bg-gradient-to-r from-orange-500/5 to-purple-500/5 text-center">
        <p className="text-sm text-gray-400 mb-1">Total Earnings</p>
        <p className="text-4xl font-bold text-white mb-2">{formatCurrency(12.50)}</p>
        <p className="text-sm text-gray-400">5% bonus on every referred friend&apos;s first purchase</p>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Your Referral Code</h2>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 bg-white/5 rounded-lg px-4 py-3 border border-white/10">
              <p className="text-lg font-bold text-white text-center tracking-widest">{code}</p>
            </div>
            <button className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
              <Copy size={18} className="text-purple-400" />
            </button>
          </div>
          <Button fullWidth icon={<Share2 size={16} />}>Share Your Link</Button>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Have a Code?</h2>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Enter referral code"
              className="flex-1 bg-white/5 rounded-lg px-4 py-3 border border-white/10 text-white text-sm"
            />
            <Button>Redeem</Button>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-white">12</p>
          <p className="text-xs text-gray-400 mt-1">Total Referrals</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-white">8</p>
          <p className="text-xs text-gray-400 mt-1">Completed</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-white">{formatCurrency(12.50)}</p>
          <p className="text-xs text-gray-400 mt-1">Earned</p>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Recent Referrals</h2>
        <div className="space-y-3">
          {MOCK_REFERRALS.map((ref) => {
            const config = statusConfig[ref.status as keyof typeof statusConfig]
            return (
              <div key={ref.username} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-white">{ref.username[0]}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{ref.username}</p>
                    <p className="text-xs text-gray-500">{ref.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={config.variant} size="sm">{config.label}</Badge>
                  {ref.status !== 'PENDING' && (
                    <span className="text-sm font-semibold text-green-400">+{formatCurrency(ref.bonus)}</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
