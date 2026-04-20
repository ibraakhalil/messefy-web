'use client'

import { AlertTriangle, Bell, Calculator, Settings, Users } from 'lucide-react'
import { useState } from 'react'

interface SettingsSection {
  id: string
  title: string
  icon: React.ReactNode
  component: React.ReactNode
}

export default function MessSettingsPage() {
  const [activeSection, setActiveSection] = useState('general')

  const sections: SettingsSection[] = [
    {
      id: 'general',
      title: 'General',
      icon: <Settings className="h-5 w-5" />,
      component: <GeneralSettings />,
    },
    {
      id: 'calculations',
      title: 'Calculations',
      icon: <Calculator className="h-5 w-5" />,
      component: <CalculationSettings />,
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: <Bell className="h-5 w-5" />,
      component: <NotificationSettings />,
    },
    {
      id: 'members',
      title: 'Members',
      icon: <Users className="h-5 w-5" />,
      component: <MemberSettings />,
    },
    {
      id: 'advanced',
      title: 'Advanced',
      icon: <AlertTriangle className="h-5 w-5" />,
      component: <AdvancedSettings />,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mess Settings</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Configure your mess accounting system
          </p>
        </div>

        <div className="flex flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64">
            <nav className="space-y-1 rounded-lg bg-white p-4 shadow dark:bg-gray-800">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    activeSection === section.id
                      ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'
                      : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {section.icon}
                  {section.title}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="rounded-lg bg-white shadow dark:bg-gray-800">
              {sections.find((s) => s.id === activeSection)?.component}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function GeneralSettings() {
  const [settings, setSettings] = useState({
    messName: 'Office Mess',
    currency: 'BDT',
    timezone: 'Asia/Dhaka',
    messType: 'office',
    workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  })

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">General Settings</h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Basic configuration for your mess
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="messName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Mess Name
            </label>
            <input
              type="text"
              id="messName"
              value={settings.messName}
              onChange={(e) => setSettings({ ...settings, messName: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label
              htmlFor="currency"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Currency
            </label>
            <select
              id="currency"
              value={settings.currency}
              onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="BDT">BDT - Bangladeshi Taka (৳)</option>
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="messType"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Mess Type
          </label>
          <select
            id="messType"
            value={settings.messType}
            onChange={(e) => setSettings({ ...settings, messType: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="office">Office Mess</option>
            <option value="residential">Residential Mess</option>
            <option value="student">Student Mess</option>
          </select>
        </div>

        <div>
          <label className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Working Days
          </label>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(
              (day) => (
                <label key={day} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.workingDays.includes(day)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSettings({ ...settings, workingDays: [...settings.workingDays, day] })
                      } else {
                        setSettings({
                          ...settings,
                          workingDays: settings.workingDays.filter((d) => d !== day),
                        })
                      }
                    }}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 capitalize dark:text-gray-300">
                    {day}
                  </span>
                </label>
              ),
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            Save General Settings
          </button>
        </div>
      </div>
    </div>
  )
}

function CalculationSettings() {
  const [calculations, setCalculations] = useState({
    mealRate: 100,
    includeWeekends: true,
    autoCalculateMealRate: true,
    allowNegativeBalance: true,
    warningThreshold: -500,
  })

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Calculation Settings</h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Configure how meal costs and balances are calculated
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="mealRate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Default Meal Rate ({calculations.autoCalculateMealRate ? 'Auto-calculated' : 'Fixed'})
            </label>
            <input
              type="number"
              id="mealRate"
              value={calculations.mealRate}
              onChange={(e) =>
                setCalculations({ ...calculations, mealRate: parseFloat(e.target.value) })
              }
              disabled={calculations.autoCalculateMealRate}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:disabled:bg-gray-600"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label
              htmlFor="warningThreshold"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Negative Balance Warning
            </label>
            <input
              type="number"
              id="warningThreshold"
              value={calculations.warningThreshold}
              onChange={(e) =>
                setCalculations({ ...calculations, warningThreshold: parseFloat(e.target.value) })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Calculation Options</h3>

          {[
            {
              key: 'autoCalculateMealRate',
              label: 'Auto-calculate Meal Rate',
              description: 'Automatically calculate meal rate based on total expenses and meals',
            },
            {
              key: 'includeWeekends',
              label: 'Include Weekends',
              description: 'Include Saturday and Sunday in meal calculations',
            },
            {
              key: 'allowNegativeBalance',
              label: 'Allow Negative Balance',
              description: 'Allow members to have negative balance',
            },
          ].map(({ key, label, description }) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{label}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
              </div>
              <button
                onClick={() =>
                  setCalculations({
                    ...calculations,
                    [key]: !calculations[key as keyof typeof calculations],
                  })
                }
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none ${
                  calculations[key as keyof typeof calculations]
                    ? 'bg-indigo-600'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    calculations[key as keyof typeof calculations]
                      ? 'translate-x-5'
                      : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            Save Calculation Settings
          </button>
        </div>
      </div>
    </div>
  )
}

function NotificationSettings() {
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    balanceWarnings: true,
    monthlyReports: true,
    settlementReminders: true,
    emailRecipients: 'admin@messefy.com',
  })

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Notification Settings</h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Configure email alerts and notifications
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label
            htmlFor="emailRecipients"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Alert Email Recipients
          </label>
          <input
            type="email"
            id="emailRecipients"
            value={notifications.emailRecipients}
            onChange={(e) =>
              setNotifications({ ...notifications, emailRecipients: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="admin@messefy.com"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Alert Types</h3>

          {[
            {
              key: 'balanceWarnings',
              label: 'Balance Warnings',
              description: 'Get notified when members have negative balances',
            },
            {
              key: 'settlementReminders',
              label: 'Settlement Reminders',
              description: 'Remind members about pending settlements',
            },
            {
              key: 'monthlyReports',
              label: 'Monthly Reports',
              description: 'Monthly overview of mess performance',
            },
            {
              key: 'emailAlerts',
              label: 'Email Notifications',
              description: 'Enable all email notifications',
            },
          ].map(({ key, label, description }) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{label}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
              </div>
              <button
                onClick={() =>
                  setNotifications({
                    ...notifications,
                    [key]: !notifications[key as keyof typeof notifications],
                  })
                }
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none ${
                  notifications[key as keyof typeof notifications]
                    ? 'bg-indigo-600'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    notifications[key as keyof typeof notifications]
                      ? 'translate-x-5'
                      : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            Save Notification Settings
          </button>
        </div>
      </div>
    </div>
  )
}

function MemberSettings() {
  const [memberSettings, setMemberSettings] = useState({
    maxMembers: 50,
    requireApproval: true,
    defaultRole: 'member',
    allowSelfRegistration: false,
  })

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Member Settings</h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Configure member management settings
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="maxMembers"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Maximum Members
            </label>
            <input
              type="number"
              id="maxMembers"
              value={memberSettings.maxMembers}
              onChange={(e) =>
                setMemberSettings({ ...memberSettings, maxMembers: parseInt(e.target.value) })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              min="1"
              max="200"
            />
          </div>

          <div>
            <label
              htmlFor="defaultRole"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Default Member Role
            </label>
            <select
              id="defaultRole"
              value={memberSettings.defaultRole}
              onChange={(e) =>
                setMemberSettings({ ...memberSettings, defaultRole: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="member">Member</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Member Features</h3>

          {[
            {
              key: 'allowSelfRegistration',
              label: 'Allow Self Registration',
              description: 'Enable new member sign-ups',
            },
            {
              key: 'requireApproval',
              label: 'Require Admin Approval',
              description: 'New members need admin approval',
            },
          ].map(({ key, label, description }) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{label}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
              </div>
              <button
                onClick={() =>
                  setMemberSettings({
                    ...memberSettings,
                    [key]: !memberSettings[key as keyof typeof memberSettings],
                  })
                }
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none ${
                  memberSettings[key as keyof typeof memberSettings]
                    ? 'bg-indigo-600'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    memberSettings[key as keyof typeof memberSettings]
                      ? 'translate-x-5'
                      : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            Save Member Settings
          </button>
        </div>
      </div>
    </div>
  )
}

function AdvancedSettings() {
  const [advanced, setAdvanced] = useState({
    enableAuditLogs: true,
    backupFrequency: 'daily',
    sessionTimeout: 60,
  })

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Advanced Settings</h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Advanced configuration and danger zone
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="backupFrequency"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Backup Frequency
            </label>
            <select
              id="backupFrequency"
              value={advanced.backupFrequency}
              onChange={(e) => setAdvanced({ ...advanced, backupFrequency: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="sessionTimeout"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Session Timeout (minutes)
            </label>
            <input
              type="number"
              id="sessionTimeout"
              value={advanced.sessionTimeout}
              onChange={(e) =>
                setAdvanced({ ...advanced, sessionTimeout: parseInt(e.target.value) })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              min="15"
              max="480"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Security & Logging</h3>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Enable Audit Logs</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Keep detailed logs of all system activities
              </p>
            </div>
            <button
              onClick={() =>
                setAdvanced({ ...advanced, enableAuditLogs: !advanced.enableAuditLogs })
              }
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none ${
                advanced.enableAuditLogs ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  advanced.enableAuditLogs ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
          <h3 className="mb-4 text-lg font-medium text-red-600 dark:text-red-400">Danger Zone</h3>

          <div className="space-y-4">
            <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
              <h4 className="text-sm font-medium text-red-800 dark:text-red-400">
                Transfer Manager Role
              </h4>
              <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                Transfer mess manager role to another member. This action requires confirmation.
              </p>
              <button className="mt-3 rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700">
                Transfer Management
              </button>
            </div>

            <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
              <h4 className="text-sm font-medium text-red-800 dark:text-red-400">Reset All Data</h4>
              <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                Permanently delete all mess data. This action cannot be undone.
              </p>
              <button className="mt-3 rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700">
                Reset Mess Data
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            Save Advanced Settings
          </button>
        </div>
      </div>
    </div>
  )
}
