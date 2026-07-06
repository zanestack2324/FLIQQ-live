'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { Heart, Crown, Star, Gift, CheckCircle, Sparkles } from 'lucide-react'

const MOCK_PLANS = [
  { tier: 'TIER_1', name: 'Tier 1', price: 4.99, benefits: ['Subscriber badge', 'Exclusive emotes', 'Ad-free viewing'], icon: Star },
  { tier: 'TIER_2', name: 'Tier 2', price: 9.99, benefits: ['Everything in Tier 1', 'Custom emote slot', 'Priority chat', 'Subscriber-only streams'], icon: Heart },
  { tier: 'TIER_3', name: 'Tier 3', price: 24.99, benefits: ['Everything in Tier 2', 'Personalized shoutout', 'Direct message access', 'Behind-the-scenes content', 'Monthly Q&A session'], icon: Crown },
]

const MOCK_SUBS = [
  { creator: 'Ariana K.', username: 'ArianaK_Official', tier: 'TIER_2', price: 9.99, renews: 'Aug 6, 2026' },
  { creator: 'DJ Vibez', username: 'DJ_Vibez', tier: 'TIER_1', price: 4.99, renews: 'Jul 28, 2026' },
]

export default function SubscriptionsPage() {
  const [activeTab, setActiveTab] = useState<'mine' | 'browse'>('mine')

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Subscriptions</h1>
          <p className="text-gray-400 mt-1">Support your favorite creators</p>
        </div>
        <Heart size={24} className="text-purple-400" />
      </div>

      <div className="flex items-center gap-2 mb-6">
        {(['mine', 'browse'] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === tab ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}
          >
            {tab === 'mine' ? 'My Subscriptions' : 'Browse Plans'}
          </button>
        ))}
      </div>

      {activeTab === 'mine' ? (
        <div className="space-y-3">
          {MOCK_SUBS.map((sub) => (
            <Card key={sub.username} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-white">{sub.username[0]}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{sub.creator}</span>
                    <Badge variant="primary" size="sm">{sub.tier.replace('_', ' ')}</Badge>
                  </div>
                  <p className="text-sm text-gray-400">{formatCurrency(sub.price)}/mo · Renews {sub.renews}</p>
                </div>
              </div>
              <Button variant="secondary" size="sm">Cancel</Button>
            </Card>
          ))}
          {MOCK_SUBS.length === 0 && (
            <div className="text-center py-16">
              <Heart size={48} className="mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400">No subscriptions yet</p>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_PLANS.map((plan) => {
            const Icon = plan.icon
            return (
              <Card key={plan.tier} className={`p-6 relative ${plan.tier === 'TIER_2' ? 'border-purple-500' : ''}`}>
                {plan.tier === 'TIER_2' && (
                  <Badge variant="primary" className="absolute -top-2 left-1/2 -translate-x-1/2">Popular</Badge>
                )}
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
                  <Icon size={24} className="text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-3xl font-bold text-white mb-4">{formatCurrency(plan.price)}<span className="text-sm text-gray-400 font-normal">/mo</span></p>
                <div className="space-y-2 mb-6">
                  {plan.benefits.map((b, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle size={16} className="text-purple-400 mt-0.5 shrink-0" />
                      <span className="text-sm text-gray-300">{b}</span>
                    </div>
                  ))}
                </div>
                <Button fullWidth variant={plan.tier === 'TIER_3' ? 'primary' : 'secondary'}>
                  Subscribe {formatCurrency(plan.price)}/mo
                </Button>
              </Card>
            )
          })}
        </div>
      )}

      <Card className="mt-8 p-4 border-orange-500/30 bg-gradient-to-r from-orange-500/5 to-purple-500/5">
        <div className="flex items-center gap-3">
          <Sparkles size={24} className="text-orange-400" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">FLIQQ Premium</p>
            <p className="text-xs text-gray-400">Unlock app-wide benefits with a premium subscription</p>
          </div>
          <Button size="sm">View Plans</Button>
        </div>
      </Card>
    </div>
  )
}
