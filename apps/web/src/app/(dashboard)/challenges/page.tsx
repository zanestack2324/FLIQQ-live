'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import {
  Trophy,
  Users,
  Clock,
  Crown,
  Megaphone,
  Music,
  Drama,
  UtensilsCrossed,
  Sparkles,
  Loader,
} from 'lucide-react'

type TabType = 'active' | 'upcoming' | 'past'

const MOCK_CHALLENGES = {
  active: [
    {
      id: '1', title: '30-Second Comedy Challenge', description: 'Make us laugh in 30 seconds! Best comedy clip wins 50,000 NGN.',
      type: 'Comedy', prize: 50000, currency: 'NGN',
      participants: 47, maxParticipants: 100, endsAt: '2 days left',
      icon: Drama,
    },
    {
      id: '2', title: 'Afrobeat Dance Battle', description: 'Show us your best Afrobeat moves. Winner gets featured on our homepage!',
      type: 'Dance', prize: 100000, currency: 'NGN',
      participants: 82, maxParticipants: 200, endsAt: '5 days left',
      icon: Music,
    },
    {
      id: '3', title: 'Jollof Face-Off', description: 'Who makes the best Jollof rice? Show us your recipe and cooking process.',
      type: 'Cooking', prize: 30000, currency: 'NGN',
      participants: 35, maxParticipants: 50, endsAt: '1 week left',
      icon: UtensilsCrossed,
    },
  ],
  upcoming: [
    {
      id: '4', title: 'Naija Music Battle', description: 'Original songs only. Showcase your talent to win a recording session!',
      type: 'Music Battle', prize: 200000, currency: 'NGN',
      participants: 0, maxParticipants: 50, endsAt: 'Starts in 3 days',
      icon: Music,
    },
  ],
  past: [
    {
      id: '5', title: 'TikTok Dance Challenge', description: 'Create a viral dance routine.',
      type: 'Dance', prize: 25000, currency: 'NGN',
      participants: 156, maxParticipants: 200, endsAt: 'Ended 2 weeks ago',
      icon: Music,
      winner: '@DJ_Vibez',
    },
  ],
}

function ChallengeCard({ challenge, tab }: { challenge: any; tab: TabType }) {
  const Icon = challenge.icon
  const isPast = tab === 'past'

  return (
    <Card className="p-6 hover:border-purple-500/30 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <Icon size={20} className="text-purple-400" />
          </div>
          <div>
            <Badge variant="primary" size="sm">{challenge.type}</Badge>
          </div>
        </div>
        <Trophy size={20} className="text-yellow-400" />
      </div>

      <h3 className="text-lg font-bold text-white mb-2">{challenge.title}</h3>
      <p className="text-sm text-gray-400 mb-4 line-clamp-2">{challenge.description}</p>

      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="flex items-center gap-1.5">
          <Trophy size={14} className="text-orange-400" />
          <span className="text-sm text-gray-300 font-medium">{formatCurrency(challenge.prize)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Users size={14} className="text-gray-500" />
          <span className="text-sm text-gray-400">{challenge.participants}/{challenge.maxParticipants ?? '∞'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock size={14} className="text-gray-500" />
          <span className="text-sm text-gray-400">{challenge.endsAt}</span>
        </div>
      </div>

      {isPast && challenge.winner && (
        <div className="flex items-center gap-1.5 mb-4">
          <Crown size={14} className="text-orange-400" />
          <span className="text-sm text-orange-400 font-medium">Winner: {challenge.winner}</span>
        </div>
      )}

      {!isPast && (
        <Button fullWidth variant="primary">
          {tab === 'active' ? 'Join Challenge' : 'Notify Me'}
        </Button>
      )}
    </Card>
  )
}

export default function ChallengesPage() {
  const [activeTab, setActiveTab] = useState<TabType>('active')

  const challenges = MOCK_CHALLENGES[activeTab]

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Challenges</h1>
          <p className="text-gray-400 mt-1">Compete, win prizes, and showcase your talent</p>
        </div>
        <Sparkles size={24} className="text-purple-400" />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6">
        {(['active', 'upcoming', 'past'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === tab
                ? 'bg-purple-600 text-white'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            {tab === 'active' && <Loader size={16} />}
            {tab === 'upcoming' && <Clock size={16} />}
            {tab === 'past' && <Trophy size={16} />}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Featured Banner */}
      <Card className="p-4 mb-6 border-orange-500/30 bg-gradient-to-r from-orange-500/5 to-purple-500/5">
        <div className="flex items-center gap-3">
          <Megaphone size={24} className="text-orange-400" />
          <div>
            <p className="text-sm font-semibold text-white">Weekly Challenge</p>
            <p className="text-xs text-gray-400">Win up to 200,000 NGN in prizes every week!</p>
          </div>
        </div>
      </Card>

      {/* Challenge Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map((challenge) => (
          <ChallengeCard key={challenge.id} challenge={challenge} tab={activeTab} />
        ))}
      </div>

      {challenges.length === 0 && (
        <div className="text-center py-16">
          <Trophy size={48} className="mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400">No {activeTab} challenges right now</p>
          <p className="text-sm text-gray-500 mt-1">Check back soon for new challenges!</p>
        </div>
      )}
    </div>
  )
}
