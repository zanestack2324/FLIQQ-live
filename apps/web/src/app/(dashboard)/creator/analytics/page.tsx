'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, TrendingUp, Users, Eye, Heart, DollarSign, Clock, Calendar } from 'lucide-react'
import Link from 'next/link'

const stats = [
  { label: 'Total Views', value: '128.5K', change: '+12.3%', icon: Eye, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { label: 'Unique Viewers', value: '45.2K', change: '+8.1%', icon: Users, color: 'text-green-400', bg: 'bg-green-500/10' },
  { label: 'Followers', value: '12.8K', change: '+5.4%', icon: Heart, color: 'text-red-400', bg: 'bg-red-500/10' },
  { label: 'Revenue', value: '$8,420', change: '+22.7%', icon: DollarSign, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
]

const recentStreams = [
  { title: 'Late Night Chill & Vibes', date: '2026-07-04', viewers: 12543, newFollowers: 234, revenue: 520 },
  { title: 'Weekend Gaming Marathon', date: '2026-07-03', viewers: 8921, newFollowers: 156, revenue: 380 },
  { title: 'Piano Improvisation Session', date: '2026-07-02', viewers: 3456, newFollowers: 89, revenue: 210 },
]

export default function AnalyticsPage() {
  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-4">
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <p className="text-gray-400 mt-1">Track your performance and growth</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <Icon size={20} className={stat.color} />
                </div>
                <Badge variant="success" size="sm">{stat.change}</Badge>
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-gray-400">{stat.label}</p>
            </Card>
          )
        })}
      </div>

      {/* Chart Placeholder */}
      <Card className="p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Viewer Trends</h2>
          <select className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
        <div className="h-64 bg-gradient-to-b from-purple-500/5 to-transparent rounded-xl flex items-center justify-center">
          <div className="text-center">
            <TrendingUp size={32} className="mx-auto text-gray-600 mb-2" />
            <p className="text-sm text-gray-500">Chart visualization will appear here</p>
          </div>
        </div>
      </Card>

      {/* Recent Streams */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Recent Streams</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-sm text-gray-500 border-b border-white/10">
                <th className="text-left pb-3 font-medium">Stream</th>
                <th className="text-left pb-3 font-medium">Date</th>
                <th className="text-right pb-3 font-medium">Viewers</th>
                <th className="text-right pb-3 font-medium">New Followers</th>
                <th className="text-right pb-3 font-medium">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {recentStreams.map((stream) => (
                <tr key={stream.title} className="border-b border-white/5 text-sm">
                  <td className="py-3 text-white">{stream.title}</td>
                  <td className="py-3 text-gray-400">{new Date(stream.date).toLocaleDateString()}</td>
                  <td className="py-3 text-right text-gray-300">{stream.viewers.toLocaleString()}</td>
                  <td className="py-3 text-right text-green-400">+{stream.newFollowers}</td>
                  <td className="py-3 text-right text-yellow-400">${stream.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
