'use client';

import { Workspace } from '@/types/workspace';
import { cn } from '@/utils/cn';
import { User } from 'next-auth';
import { useState } from 'react';
import { FiActivity, FiBell, FiShield, FiUser } from 'react-icons/fi';
import { Briefcase } from 'lucide-react';

import OverviewTab from './overview-tab';
import WorkspaceTab from './workspace-tab';
import ProfileSection from '@/components/profile/profile-section';
import NotificationsSection from '@/components/profile/notifications-section';
import SecuritySection from '@/components/profile/security-section';

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
  {
    id: 'workspace',
    label: 'Workspace',
    icon: Briefcase,
    description: 'Workspace details and management',
  },
];

interface UserData {
  user: User | undefined;
  workspace: Workspace | undefined;
}

export function MessPageContents({ userData }: { userData: UserData }) {
  const { workspace } = userData;
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading] = useState(false);

  return (
    <div>
      <nav className="mt-6 mb-8 flex overflow-x-auto rounded-xl border border-border-color bg-card-bg shadow-sm dark:border-gray-800 dark:bg-gray-900">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex min-w-[140px] cursor-pointer flex-col items-center gap-2 border-b-2 border-transparent px-6 py-4 text-sm font-medium whitespace-nowrap transition-all duration-200 text-subtitle-color hover:text-pure-color dark:text-gray-400 dark:hover:text-white',
              {
                'border-emerald-500 text-emerald-600 bg-emerald-50/60 font-semibold dark:bg-emerald-950/40 dark:text-emerald-400': activeTab === tab.id,
              },
              {
                hidden: tab.id === 'workspace' && !workspace,
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
      
      <div className="space-y-12">
        {activeTab === 'overview' && <OverviewTab userData={userData} onNavigate={setActiveTab} />}
        {activeTab === 'profile' && <ProfileSection isLoading={isLoading} />}
        {activeTab === 'notifications' && <NotificationsSection isLoading={isLoading} />}
        {activeTab === 'security' && <SecuritySection isLoading={isLoading} />}
        {activeTab === 'workspace' && workspace && <WorkspaceTab />}
      </div>
    </div>
  );
}
