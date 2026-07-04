'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Sparkles, Heart, Star, Crown, Rocket, Gift as GiftIcon, Flame, Music, Gem } from 'lucide-react'

type GiftItem = {
  id: string
  name: string
  price: number
  icon: React.ElementType
  color: string
  category: string
}

const gifts: GiftItem[] = [
  { id: 'g1', name: 'Heart', price: 5, icon: Heart, color: 'text-red-400', category: 'standard' },
  { id: 'g2', name: 'Star', price: 10, icon: Star, color: 'text-yellow-400', category: 'standard' },
  { id: 'g3', name: 'Fire', price: 25, icon: Flame, color: 'text-orange-400', category: 'standard' },
  { id: 'g4', name: 'Star', price: 50, icon: Star, color: 'text-yellow-400', category: 'standard' },
  { id: 'g5', name: 'Music', price: 100, icon: Music, color: 'text-blue-400', category: 'premium' },
  { id: 'g6', name: 'Crown', price: 250, icon: Crown, color: 'text-purple-400', category: 'premium' },
  { id: 'g7', name: 'Gem', price: 500, icon: Gem, color: 'text-cyan-400', category: 'premium' },
  { id: 'g8', name: 'Rocket', price: 1000, icon: Rocket, color: 'text-green-400', category: 'exclusive' },
  { id: 'g9', name: 'Sparkle', price: 2500, icon: Sparkles, color: 'text-pink-400', category: 'exclusive' },
]

interface GiftPickerProps {
  isOpen: boolean
  onClose: () => void
  onSendGift: (giftId: string, quantity: number) => void
}

const categories = [
  { value: 'all', label: 'All' },
  { value: 'standard', label: 'Standard' },
  { value: 'premium', label: 'Premium' },
  { value: 'exclusive', label: 'Exclusive' },
]

export function GiftPicker({ isOpen, onClose, onSendGift }: GiftPickerProps) {
  const [selectedGift, setSelectedGift] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [category, setCategory] = useState('all')

  const filteredGifts = category === 'all' ? gifts : gifts.filter((g) => g.category === category)
  const selectedGiftItem = gifts.find((g) => g.id === selectedGift)

  const handleSend = () => {
    if (selectedGift) {
      onSendGift(selectedGift, quantity)
      onClose()
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Send a Gift" size="lg">
      <div className="space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={cn(
                'px-3 py-1 text-sm font-medium rounded-full whitespace-nowrap transition-all',
                category === cat.value
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {filteredGifts.map((gift) => {
            const Icon = gift.icon
            const isSelected = selectedGift === gift.id
            return (
              <button
                key={gift.id}
                onClick={() => { setSelectedGift(gift.id); setQuantity(1) }}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-xl border transition-all',
                  isSelected
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-white/10 hover:border-white/20 bg-white/5'
                )}
              >
                <Icon size={28} className={gift.color} />
                <span className="text-sm font-medium text-white">{gift.name}</span>
                <span className="text-xs text-yellow-400">{gift.price} coins</span>
              </button>
            )
          })}
        </div>

        {selectedGiftItem && (
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div className="flex items-center gap-3">
              <selectedGiftItem.icon size={28} className={selectedGiftItem.color} />
              <div>
                <p className="font-semibold text-white">{selectedGiftItem.name}</p>
                <p className="text-sm text-gray-400">{selectedGiftItem.price * quantity} coins</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  -
                </button>
                <span className="text-lg font-bold text-white w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(100, quantity + 1))}
                  className="w-8 h-8 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  +
                </button>
              </div>
              <Button onClick={handleSend} size="sm">
                <GiftIcon size={14} />
                Send
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
