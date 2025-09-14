'use client'

import { useState } from 'react'
import { FiUser, FiShield, FiBriefcase, FiActivity } from 'react-icons/fi'
import ProfileSection from '@/components/profile/profile-section'
import SecuritySection from '@/components/profile/security-section'
import WorkspacesSection from '@/components/profile/workspace-section'
import OverviewSection from '@/components/profile/overview-section'
import PageWrapper from '@/components/common/page-wrapper'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [isLoading] = useState(false)

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiActivity },
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'security', label: 'Security', icon: FiShield },
    { id: 'workspaces', label: 'Workspaces', icon: FiBriefcase },
  ]

  return (
    <PageWrapper className="py-8 md:py-12">
      {/* Navigation Tabs */}
      <div className="mb-8 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <nav className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 border-b-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700'
              }`}
            >
              <tab.icon className="size-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content Sections */}
      <div className="space-y-12">
        {activeTab === 'overview' && <OverviewSection onNavigate={setActiveTab} />}
        {activeTab === 'profile' && <ProfileSection isLoading={isLoading} />}
        {activeTab === 'security' && <SecuritySection isLoading={isLoading} />}
        {activeTab === 'workspaces' && <WorkspacesSection isLoading={isLoading} />}
      </div>
    </PageWrapper>
  )
}
