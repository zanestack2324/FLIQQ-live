'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Calendar, Clock, Plus, Trash2, Edit2, Bell } from 'lucide-react'
import Link from 'next/link'

type ScheduledStream = {
  id: string
  title: string
  category: string
  scheduledAt: string
  duration: number
  isRecurring: boolean
}

const mockSchedule: ScheduledStream[] = [
  { id: '1', title: 'Morning Vibes & Chill Music', category: 'Just Chatting', scheduledAt: '2026-07-05T14:00:00Z', duration: 120, isRecurring: true },
  { id: '2', title: 'Weekend Gaming Marathon', category: 'Gaming', scheduledAt: '2026-07-06T18:00:00Z', duration: 240, isRecurring: false },
  { id: '3', title: 'Art Stream - Digital Painting', category: 'Art', scheduledAt: '2026-07-07T16:00:00Z', duration: 90, isRecurring: true },
]

export default function SchedulePage() {
  const [schedule, setSchedule] = useState<ScheduledStream[]>(mockSchedule)

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-4">
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Schedule</h1>
            <p className="text-gray-400 mt-1">Plan and manage your upcoming streams</p>
          </div>
          <Button>
            <Plus size={16} />
            Schedule Stream
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {schedule.length === 0 ? (
          <Card className="p-12 text-center">
            <Calendar size={48} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-400 mb-2">No streams scheduled</h3>
            <p className="text-gray-500 mb-4">Schedule your first stream to let viewers know when you&apos;ll be live</p>
            <Button>
              <Plus size={16} />
              Schedule Now
            </Button>
          </Card>
        ) : (
          schedule.map((stream) => (
            <Card key={stream.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                    <Calendar size={24} className="text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{stream.title}</h3>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {new Date(stream.scheduledAt).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      <Badge variant="primary">{stream.category}</Badge>
                      {stream.isRecurring && <Badge variant="success">Recurring</Badge>}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{stream.duration} minutes</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Bell size={14} />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit2 size={14} />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
