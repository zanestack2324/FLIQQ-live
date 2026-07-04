'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency, formatNumber } from '@/lib/utils'
import {
  Wallet,
  Gem,
  Coins,
  ArrowUpRight,
  ArrowDownLeft,
  History,
  CreditCard,
  DollarSign,
  Gift,
  Trophy,
  RefreshCw,
} from 'lucide-react'

const transactionHistory = [
  { id: '1', type: 'GIFT_SENT', amount: -25.00, coinAmount: -500, description: 'Sent "Rocket" gift to Luna', status: 'COMPLETED', createdAt: '2026-07-04T12:00:00Z' },
  { id: '2', type: 'DEPOSIT', amount: 50.00, coinAmount: 1000, description: 'Coin package purchase', status: 'COMPLETED', createdAt: '2026-07-03T10:00:00Z' },
  { id: '3', type: 'GIFT_RECEIVED', amount: 12.50, diamondAmount: 250, description: 'Received "Crown" gift from Viewer', status: 'COMPLETED', createdAt: '2026-07-02T15:30:00Z' },
  { id: '4', type: 'SUBSCRIPTION', amount: -9.99, description: 'Subscription to Luna - Tier 1', status: 'COMPLETED', createdAt: '2026-07-01T08:00:00Z' },
  { id: '5', type: 'WITHDRAWAL', amount: -100.00, description: 'Withdrawal to PayPal', status: 'PENDING', createdAt: '2026-06-30T20:00:00Z' },
]

const coinPackages = [
  { name: 'Starter', coins: 100, bonus: 0, price: 4.99 },
  { name: 'Popular', coins: 500, bonus: 50, price: 24.99, popular: true },
  { name: 'Gamer', coins: 1200, bonus: 200, price: 59.99 },
  { name: 'Pro', coins: 3000, bonus: 750, price: 149.99 },
]

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState<'wallet' | 'history' | 'buy'>('wallet')

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Wallet</h1>
        <p className="text-gray-400 mt-1">Manage your coins, diamonds, and earnings</p>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card className="p-6 bg-gradient-to-br from-purple-600/20 to-pink-600/10 border-purple-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Gem size={20} className="text-purple-400" />
            </div>
            <Badge variant="primary" size="sm">Coins</Badge>
          </div>
          <p className="text-3xl font-bold text-white">{formatNumber(1250)}</p>
          <p className="text-sm text-gray-400 mt-1">~$12.50 value</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-amber-600/20 to-yellow-600/10 border-amber-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Trophy size={20} className="text-amber-400" />
            </div>
            <Badge variant="premium" size="sm">Diamonds</Badge>
          </div>
          <p className="text-3xl font-bold text-white">{formatNumber(3420)}</p>
          <p className="text-sm text-gray-400 mt-1">Earnings for creators</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-600/20 to-emerald-600/10 border-green-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <DollarSign size={20} className="text-green-400" />
            </div>
            <Badge variant="success" size="sm">Balance</Badge>
          </div>
          <p className="text-3xl font-bold text-white">{formatCurrency(428.50)}</p>
          <p className="text-sm text-gray-400 mt-1">Available for withdrawal</p>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6">
        {([
          { value: 'wallet', label: 'Overview', icon: Wallet },
          { value: 'history', label: 'History', icon: History },
          { value: 'buy', label: 'Buy Coins', icon: CreditCard },
        ] as const).map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === tab.value
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'wallet' && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-center">
              <Gift size={24} className="mx-auto text-purple-400 mb-2" />
              <span className="text-sm text-white">Send Gift</span>
            </button>
            <button className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-center">
              <ArrowUpRight size={24} className="mx-auto text-green-400 mb-2" />
              <span className="text-sm text-white">Deposit</span>
            </button>
            <button className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-center">
              <ArrowDownLeft size={24} className="mx-auto text-amber-400 mb-2" />
              <span className="text-sm text-white">Withdraw</span>
            </button>
            <button className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-center">
              <RefreshCw size={24} className="mx-auto text-blue-400 mb-2" />
              <span className="text-sm text-white">Convert</span>
            </button>
          </div>
        </Card>
      )}

      {activeTab === 'history' && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Transaction History</h2>
          {transactionHistory.length === 0 ? (
            <div className="text-center py-12">
              <History size={48} className="mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactionHistory.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      tx.amount > 0 ? 'bg-green-500/10' : 'bg-red-500/10'
                    }`}>
                      {tx.amount > 0
                        ? <ArrowUpRight size={18} className="text-green-400" />
                        : <ArrowDownLeft size={18} className="text-red-400" />
                      }
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{tx.description}</p>
                      <p className="text-xs text-gray-500">{new Date(tx.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                    </p>
                    <Badge variant={tx.status === 'COMPLETED' ? 'success' : 'warning'} size="sm">
                      {tx.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {activeTab === 'buy' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {coinPackages.map((pkg) => (
            <Card key={pkg.name} className={`p-6 text-center relative ${pkg.popular ? 'border-purple-500' : ''}`}>
              {pkg.popular && (
                <Badge variant="primary" className="absolute -top-2 left-1/2 -translate-x-1/2">
                  Best Value
                </Badge>
              )}
              <Coins size={32} className="mx-auto text-yellow-400 mb-3" />
              <h3 className="text-lg font-bold text-white">{formatNumber(pkg.coins)}</h3>
              {pkg.bonus > 0 && (
                <p className="text-xs text-green-400">+{formatNumber(pkg.bonus)} bonus</p>
              )}
              <p className="text-sm text-gray-400 mt-1">{formatCurrency(pkg.price)}</p>
              <Button fullWidth size="sm" className="mt-4">Buy Now</Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
