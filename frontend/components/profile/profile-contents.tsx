'use client'

import MessSection from '@/components/profile/mess-section'
import NotificationsSection from '@/components/profile/notifications-section'
import OverviewSection from '@/components/profile/overview-section'
import ProfileSection from '@/components/profile/profile-section'
import SecuritySection from '@/components/profile/security-section'
import { cn } from '@/utils/cn'
import { ChefHat } from 'lucide-react'
import { useState } from 'react'
import { FiActivity, FiBell, FiShield, FiUser } from 'react-icons/fi'

const tabs = [
  {
    id: 'overview',
    label: 'Overview',
    icon: FiActivity,
    description: 'Dashboard and recent activity',
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: FiUser,
    description: 'Personal information and preferences',
  },
  {
    id: 'mess',
    label: 'Mess Management',
    icon: ChefHat,
    description: 'Join messes and manage meals',
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: FiBell,
    description: 'Invitations and alerts',
  },
  {
    id: 'security',
    label: 'Security',
    icon: FiShield,
    description: 'Password and account security',
  },
]

export function ProfileContents() {
  const [activeTab, setActiveTab] = useState('overview')
  const [isLoading] = useState(false)

  return (
    <div>
      {' '}
      <nav className="border-border-color mt-6 mb-8 flex overflow-x-auto border-t bg-emerald-50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex min-w-[140px] cursor-pointer flex-col items-center gap-2 border-b-2 border-transparent px-6 py-4 text-sm font-medium whitespace-nowrap transition-all duration-200',
              {
                'border-emerald-500 text-emerald-600': activeTab === tab.id,
              },
            )}
          >
            <div className="flex items-center gap-3.5">
              <tab.icon className="size-5" />
              <div className="font-medium">{tab.label}</div>
            </div>
          </button>
        ))}
      </nav>
      {/* Content Sections */}
      <div className="space-y-12">
        {activeTab === 'overview' && <OverviewSection onNavigate={setActiveTab} />}
        {activeTab === 'profile' && <ProfileSection isLoading={isLoading} />}
        {activeTab === 'mess' && <MessSection isLoading={isLoading} />}
        {activeTab === 'notifications' && <NotificationsSection isLoading={isLoading} />}
        {activeTab === 'security' && <SecuritySection isLoading={isLoading} />}
      </div>
    </div>
  )
}
