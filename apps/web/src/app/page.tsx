'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { formatNumber } from '@/lib/utils'
import {
  Play,
  Users,
  Gift,
  MessageCircle,
  Shield,
  Zap,
  Globe,
  Sparkles,
  ArrowRight,
  Star,
  Crown,
  ChevronRight,
  TrendingUp,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

const features = [
  {
    title: 'Low-Latency Streaming',
    description: 'Experience near-real-time interaction with ultra-low latency streaming technology.',
    icon: Zap,
  },
  {
    title: 'Global CDN',
    description: 'Reach audiences worldwide with our global content delivery network.',
    icon: Globe,
  },
  {
    title: 'AI-Powered Moderation',
    description: 'Keep your chat safe with automatic toxicity filtering and content moderation.',
    icon: Shield,
  },
  {
    title: 'Creator Economy',
    description: 'Monetize your content with subscriptions, gifts, ads, and brand partnerships.',
    icon: Sparkles,
  },
]

const featuredStreams = [
  {
    id: '1',
    title: 'Late Night Chill & Vibes',
    username: 'lunarstream',
    displayName: 'Luna',
    category: 'Just Chatting',
    viewerCount: 12543,
    avatarUrl: null,
    thumbnailUrl: null,
    tags: ['chill', 'vibes', 'music'],
  },
  {
    id: '2',
    title: 'Pro Ranked Push - Road to Radiant',
    username: 'valorantpro',
    displayName: 'Shadow',
    category: 'Gaming',
    viewerCount: 8921,
    avatarUrl: null,
    thumbnailUrl: null,
    tags: ['valorant', 'ranked', 'fps'],
  },
  {
    id: '3',
    title: 'Piano Improvisation Session',
    username: 'melodykeys',
    displayName: 'Melody',
    category: 'Music',
    viewerCount: 3456,
    avatarUrl: null,
    thumbnailUrl: null,
    tags: ['piano', 'music', 'live'],
  },
  {
    id: '4',
    title: 'Digital Art Speedpaint',
    username: 'artbyakira',
    displayName: 'Akira',
    category: 'Art',
    viewerCount: 2109,
    avatarUrl: null,
    thumbnailUrl: null,
    tags: ['art', 'digital', 'speedpaint'],
  },
]

function LiveBadge({ viewerCount }: { viewerCount: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="flex items-center gap-1 px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded-md">
        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
        LIVE
      </span>
      <span className="flex items-center gap-1 px-2 py-0.5 bg-black/70 text-white text-xs rounded-md">
        <Users size={12} />
        {formatNumber(viewerCount)}
      </span>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px]" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-pink-600/15 rounded-full blur-[96px]" />

        <div className="relative max-w-5xl mx-auto text-center">
          <Badge variant="premium" size="md" className="mb-6">
            <Sparkles size={14} />
            Now Available Worldwide
          </Badge>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
            Go Live, Connect,
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Earn Together
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            The next-generation live streaming platform where creators thrive.
            Stream, connect, and build your community with powerful tools.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="xl">
                Get Started Free
                <ArrowRight size={20} />
              </Button>
            </Link>
            <Link href="/feed">
              <Button variant="outline" size="xl">
                <Play size={20} />
                Watch Now
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-center gap-8 mt-8 text-sm text-gray-500">
            <span className="flex items-center gap-2"><Star size={14} className="text-yellow-500" /> 1M+ Creators</span>
            <span className="flex items-center gap-2"><Users size={14} className="text-purple-400" /> 50M+ Viewers</span>
            <span className="flex items-center gap-2"><Crown size={14} className="text-amber-400" /> 200+ Countries</span>
          </div>
        </div>
      </section>

      {/* Featured Streams */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">Featured Live Streams</h2>
          <Link href="/feed" className="flex items-center gap-1 text-purple-400 hover:text-purple-300 text-sm font-medium">
            View All <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredStreams.map((stream) => (
            <Link key={stream.id} href={`/live/${stream.id}`}>
              <Card hover className="group">
                <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <Play size={48} className="text-white/20 group-hover:text-white/60 transition-colors" />
                  <div className="absolute top-2 left-2">
                    <LiveBadge viewerCount={stream.viewerCount} />
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 flex items-center gap-2">
                    {stream.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="px-2 py-0.5 bg-white/10 text-white text-xs rounded-full backdrop-blur-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex items-start gap-3">
                    <Avatar src={stream.avatarUrl} alt={stream.displayName} size="md" />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-white truncate group-hover:text-purple-300 transition-colors">
                        {stream.title}
                      </h3>
                      <p className="text-sm text-gray-400 truncate">{stream.displayName}</p>
                      <p className="text-xs text-gray-500">{stream.category}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Built for <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Creators</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Everything you need to build, grow, and monetize your community.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card key={feature.title} className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                  <Icon size={24} className="text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </Card>
            )
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="relative p-12 rounded-3xl bg-gradient-to-br from-purple-600/20 via-pink-600/10 to-transparent border border-purple-500/20">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent rounded-3xl" />
          <h2 className="relative text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Start Streaming?
          </h2>
          <p className="relative text-gray-400 mb-8 max-w-lg mx-auto">
            Join thousands of creators already earning on FLIQQ. Go live in minutes.
          </p>
          <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg">
                <Sparkles size={18} />
                Create Your Account
              </Button>
            </Link>
            <Link href="/creator/go-live">
              <Button variant="ghost" size="lg">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
