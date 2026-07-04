'use client'

import { GoLiveForm } from '@/components/stream/go-live-form'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function GoLivePage() {
  return (
    <div className="p-4 lg:p-8">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-white">Go Live</h1>
        <p className="text-gray-400 mt-1">Configure your stream and start broadcasting</p>
      </div>
      <GoLiveForm />
    </div>
  )
}
