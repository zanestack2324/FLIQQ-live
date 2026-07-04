'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useUIStore } from '@/stores/ui-store'
import {
  User,
  Bell,
  Shield,
  Palette,
  Key,
  Globe,
  Smartphone,
  Camera,
  Save,
  Moon,
  Sun,
} from 'lucide-react'

const settingsTabs = [
  { value: 'profile', label: 'Profile', icon: User },
  { value: 'notifications', label: 'Notifications', icon: Bell },
  { value: 'appearance', label: 'Appearance', icon: Palette },
  { value: 'security', label: 'Security', icon: Shield },
  { value: 'stream', label: 'Stream Settings', icon: Camera },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const { theme, toggleTheme } = useUIStore()

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 mt-1">Manage your account preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:w-48 shrink-0">
          <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {settingsTabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
                    activeTab === tab.value
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <Card className="p-6 space-y-6">
              <h2 className="text-lg font-semibold text-white">Profile Information</h2>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-2xl font-bold text-white">
                  U
                </div>
                <Button variant="secondary" size="sm">
                  <Camera size={14} />
                  Change Photo
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Display Name" defaultValue="User" />
                <Input label="Username" defaultValue="user" />
                <Input label="Email" type="email" defaultValue="user@example.com" />
                <Input label="Phone" type="tel" placeholder="+1 (555) 000-0000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Bio</label>
                <textarea
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none h-24"
                  placeholder="Tell us about yourself..."
                />
              </div>
              <Button>
                <Save size={16} />
                Save Changes
              </Button>
            </Card>
          )}

          {activeTab === 'appearance' && (
            <Card className="p-6 space-y-6">
              <h2 className="text-lg font-semibold text-white">Appearance</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Theme</label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => theme === 'dark' || toggleTheme()}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                        theme === 'dark' ? 'border-purple-500 bg-purple-500/10' : 'border-white/10'
                      }`}
                    >
                      <Moon size={18} className="text-purple-400" />
                      <span className="text-sm font-medium text-white">Dark</span>
                    </button>
                    <button
                      onClick={() => theme === 'light' || toggleTheme()}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                        theme === 'light' ? 'border-purple-500 bg-purple-500/10' : 'border-white/10'
                      }`}
                    >
                      <Sun size={18} className="text-yellow-400" />
                      <span className="text-sm font-medium text-white">Light</span>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
                  <select className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option value="en">English</option>
                    <option value="es">Espa&ntilde;ol</option>
                    <option value="fr">Fran&ccedil;ais</option>
                    <option value="de">Deutsch</option>
                    <option value="ja">日本語</option>
                  </select>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card className="p-6 space-y-4">
              <h2 className="text-lg font-semibold text-white mb-4">Notification Preferences</h2>
              {[
                { label: 'Email Notifications', desc: 'Receive updates via email' },
                { label: 'Push Notifications', desc: 'Receive push notifications' },
                { label: 'SMS Notifications', desc: 'Receive text messages' },
                { label: 'Stream Start Notifications', desc: 'When creators you follow go live' },
                { label: 'Gift Notifications', desc: 'When you receive gifts' },
                { label: 'Subscription Notifications', desc: 'When someone subscribes' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-white">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-9 h-5 bg-white/10 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600" />
                  </label>
                </div>
              ))}
            </Card>
          )}

          {activeTab === 'security' && (
            <Card className="p-6 space-y-6">
              <h2 className="text-lg font-semibold text-white">Security</h2>
              <div className="space-y-4">
                <Input label="Current Password" type="password" placeholder="Enter current password" icon={<Key size={16} />} />
                <Input label="New Password" type="password" placeholder="Enter new password" icon={<Key size={16} />} />
                <Input label="Confirm New Password" type="password" placeholder="Confirm new password" icon={<Key size={16} />} />
                <Button>
                  <Save size={16} />
                  Update Password
                </Button>
              </div>
              <div className="border-t border-white/10 pt-6">
                <h3 className="text-sm font-medium text-white mb-4">Two-Factor Authentication</h3>
                <Button variant="outline">
                  <Shield size={16} />
                  Enable 2FA
                </Button>
              </div>
            </Card>
          )}

          {activeTab === 'stream' && (
            <Card className="p-6 space-y-6">
              <h2 className="text-lg font-semibold text-white">Stream Settings</h2>
              <div className="space-y-4">
                {[
                  { label: 'Auto-record streams', desc: 'Automatically save VODs' },
                  { label: 'Allow clipping', desc: 'Let viewers create clips' },
                  { label: 'Subscriber-only chat', desc: 'Only subscribers can chat' },
                  { label: 'Slow mode', desc: 'Limit how often users can chat' },
                  { label: 'Emote-only chat', desc: 'Only emotes allowed in chat' },
                  { label: 'Show viewer count', desc: 'Display live viewer count' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium text-white">{item.label}</p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={item.label === 'Allow clipping' || item.label === 'Show viewer count'} />
                      <div className="w-9 h-5 bg-white/10 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600" />
                    </label>
                  </div>
                ))}
              </div>
              <Button>
                <Save size={16} />
                Save Stream Settings
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
