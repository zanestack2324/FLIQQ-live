'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatNumber } from '@/lib/utils'
import { Trophy, Users, Clock, Rocket, Heart, Shield, Zap, UserPlus } from 'lucide-react'

const MOCK_BATTLES = [
  { id: '1', a: { name: 'Ariana K.', user: 'ArianaK_Official', score: 1520, viewers: 3400 }, b: { name: 'DJ Vibez', user: 'DJ_Vibez', score: 1340, viewers: 2800 }, prize: 50000, remaining: '2:45' },
  { id: '2', a: { name: 'Chef Maya', user: 'ChefMaya', score: 890, viewers: 2100 }, b: { name: 'Comedy King', user: 'ComedyKing', score: 920, viewers: 1900 }, prize: 25000, remaining: '1:30' },
]

const MOCK_RAIDS = [
  { from: 'TechGuru', viewers: 1200, target: 'FitWithLiz' },
]

export default function PKBattlesPage() {
  const [activeTab, setActiveTab] = useState<'battles' | 'raids'>('battles')

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">PK Battles</h1>
          <p className="text-gray-400 mt-1">Head-to-head streaming competitions</p>
        </div>
        <Zap size={24} className="text-orange-400" />
      </div>

      <div className="flex items-center gap-2 mb-6">
        {(['battles', 'raids'] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === tab ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}
          >
            {tab === 'battles' ? <Shield size={16} /> : <Rocket size={16} />}
            {tab === 'battles' ? 'Live Battles' : 'Raids'}
          </button>
        ))}
      </div>

      <Button fullWidth className="mb-6" icon={<Zap size={16} />}>
        {activeTab === 'battles' ? 'Challenge a Streamer' : 'Raid a Streamer'}
      </Button>

      {activeTab === 'battles' ? (
        <div className="space-y-4">
          {MOCK_BATTLES.map((battle) => {
            const total = battle.a.score + battle.b.score
            const pctA = total > 0 ? (battle.a.score / total) * 100 : 50
            return (
              <Card key={battle.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="danger" size="sm" icon={<div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}>LIVE</Badge>
                  <span className="text-sm text-gray-400">{battle.remaining} remaining</span>
                  <span className="text-sm text-orange-400 font-medium">🏆 {formatCurrency(battle.prize)}</span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-center flex-1">
                    <div className="w-16 h-16 rounded-full bg-purple-500/10 mx-auto flex items-center justify-center mb-2">
                      <span className="text-xl font-bold text-white">{battle.a.user[0]}</span>
                    </div>
                    <p className="text-sm font-semibold text-white">{battle.a.name}</p>
                    <p className="text-xs text-gray-400">{formatNumber(battle.a.viewers)} viewers</p>
                    <p className="text-2xl font-bold text-white mt-1">{formatNumber(battle.a.score)}</p>
                  </div>

                  <div className="px-6">
                    <p className="text-2xl font-bold text-orange-400">VS</p>
                  </div>

                  <div className="text-center flex-1">
                    <div className="w-16 h-16 rounded-full bg-purple-500/10 mx-auto flex items-center justify-center mb-2">
                      <span className="text-xl font-bold text-white">{battle.b.user[0]}</span>
                    </div>
                    <p className="text-sm font-semibold text-white">{battle.b.name}</p>
                    <p className="text-xs text-gray-400">{formatNumber(battle.b.viewers)} viewers</p>
                    <p className="text-2xl font-bold text-white mt-1">{formatNumber(battle.b.score)}</p>
                  </div>
                </div>

                <div className="w-full h-2 rounded-full bg-white/10 mb-4 overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full transition-all" style={{ width: `${pctA}%` }} />
                </div>

                <div className="flex gap-2">
                  <Button fullWidth variant="secondary" icon={<Heart size={14} />}>Vote {battle.a.name.split(' ')[0]}</Button>
                  <Button fullWidth variant="secondary" icon={<Heart size={14} />}>Vote {battle.b.name.split(' ')[0]}</Button>
                </div>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="space-y-4">
          {MOCK_RAIDS.map((raid) => (
            <Card key={raid.from} className="p-6 border-orange-500/30">
              <div className="flex items-center gap-3 mb-3">
                <Rocket size={20} className="text-orange-400" />
                <h3 className="text-lg font-semibold text-white">Incoming Raid!</h3>
              </div>
              <p className="text-gray-300 mb-4">
                <span className="text-purple-400 font-semibold">{raid.from}</span> is raiding with{' '}
                <span className="text-purple-400 font-semibold">{formatNumber(raid.viewers)}</span> viewers
              </p>
              <div className="flex gap-2">
                <Button fullWidth>Accept Raid</Button>
                <Button fullWidth variant="secondary">Decline</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
