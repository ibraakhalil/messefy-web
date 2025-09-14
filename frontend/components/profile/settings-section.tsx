import { User, Shield, Briefcase } from 'lucide-react'

interface SettingsTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function SettingsTabs({ activeTab, onTabChange }: SettingsTabsProps) {
  const tabs = [
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
    },
    {
      id: 'security',
      label: 'Security',
      icon: Shield,
    },
    {
      id: 'workspaces',
      label: 'Workspaces',
      icon: Briefcase,
    },
  ]

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav className="flex overflow-x-auto" aria-label="Settings tabs">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${isActive
                ? 'border-emerald-500 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="mr-2 h-5 w-5" />
              {tab.label}
            </button>
          )
        })}
      </nav>
    </div>
  )
}