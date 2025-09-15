'use client'

import { useState } from 'react'
import { LayoutDashboard, Utensils, Bell, Link, BarChart3, Users, Shield } from 'lucide-react'

interface SettingsSection {
  id: string
  title: string
  icon: React.ReactNode
  component: React.ReactNode
}

export default function AdminSettingsPage() {
  const [activeSection, setActiveSection] = useState('meal-config')

  const sections: SettingsSection[] = [
    {
      id: 'meal-config',
      title: 'Meal Configuration',
      icon: <Utensils className="h-5 w-5" />,
      component: <MealConfiguration />,
    },
    {
      id: 'dashboard-layout',
      title: 'Dashboard Layout',
      icon: <LayoutDashboard className="h-5 w-5" />,
      component: <DashboardLayoutSettings />,
    },
    {
      id: 'system-alerts',
      title: 'System Alerts',
      icon: <Bell className="h-5 w-5" />,
      component: <SystemAlerts />,
    },
    {
      id: 'analytics',
      title: 'Analytics & Reports',
      icon: <BarChart3 className="h-5 w-5" />,
      component: <AnalyticsSettings />,
    },
    {
      id: 'integrations',
      title: 'Integrations',
      icon: <Link className="h-5 w-5" />,
      component: <IntegrationSettings />,
    },
    {
      id: 'user-management',
      title: 'User Management',
      icon: <Users className="h-5 w-5" />,
      component: <UserManagementSettings />,
    },
    {
      id: 'security',
      title: 'Security Settings',
      icon: <Shield className="h-5 w-5" />,
      component: <SecuritySettings />,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Settings</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Configure your meal management dashboard and system settings
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

function MealConfiguration() {
  const [config, setConfig] = useState({
    maxOrdersPerDay: 100,
    orderCutoffTime: '10:00',
    deliveryWindowStart: '11:30',
    deliveryWindowEnd: '14:00',
    mealPrepTime: 45,
    enableBulkOrdering: true,
    enableMealCustomization: true,
    defaultPortionSize: 'regular',
    allowSpecialRequests: true,
    autoApproveOrders: false,
  })

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Meal System Configuration
        </h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Configure meal ordering limits, timing, and system behavior
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="maxOrders"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Max Orders Per Day
            </label>
            <input
              type="number"
              id="maxOrders"
              value={config.maxOrdersPerDay}
              onChange={(e) => setConfig({ ...config, maxOrdersPerDay: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              min="1"
              max="1000"
            />
          </div>

          <div>
            <label
              htmlFor="prepTime"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Meal Prep Time (minutes)
            </label>
            <input
              type="number"
              id="prepTime"
              value={config.mealPrepTime}
              onChange={(e) => setConfig({ ...config, mealPrepTime: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              min="15"
              max="180"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <label
              htmlFor="cutoffTime"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Order Cutoff Time
            </label>
            <input
              type="time"
              id="cutoffTime"
              value={config.orderCutoffTime}
              onChange={(e) => setConfig({ ...config, orderCutoffTime: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label
              htmlFor="deliveryStart"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Delivery Window Start
            </label>
            <input
              type="time"
              id="deliveryStart"
              value={config.deliveryWindowStart}
              onChange={(e) => setConfig({ ...config, deliveryWindowStart: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label
              htmlFor="deliveryEnd"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Delivery Window End
            </label>
            <input
              type="time"
              id="deliveryEnd"
              value={config.deliveryWindowEnd}
              onChange={(e) => setConfig({ ...config, deliveryWindowEnd: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Order Features</h3>

          {[
            {
              key: 'enableBulkOrdering',
              label: 'Enable Bulk Ordering',
              description: 'Allow users to place bulk orders',
            },
            {
              key: 'enableMealCustomization',
              label: 'Enable Meal Customization',
              description: 'Allow users to customize their meals',
            },
            {
              key: 'allowSpecialRequests',
              label: 'Allow Special Requests',
              description: 'Enable special dietary requests',
            },
            {
              key: 'autoApproveOrders',
              label: 'Auto-Approve Orders',
              description: 'Automatically approve incoming orders',
            },
          ].map(({ key, label, description }) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{label}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
              </div>
              <button
                onClick={() => setConfig({ ...config, [key]: !config[key as keyof typeof config] })}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none ${
                  config[key as keyof typeof config]
                    ? 'bg-indigo-600'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    config[key as keyof typeof config] ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  )
}

function DashboardLayoutSettings() {
  const [layout, setLayout] = useState({
    defaultView: 'overview',
    showQuickStats: true,
    showRecentOrders: true,
    showMealCalendar: true,
    showRevenueChart: true,
    compactMode: false,
    refreshInterval: 30,
  })

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Layout</h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Customize your dashboard appearance and widgets
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label
            htmlFor="defaultView"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Default Dashboard View
          </label>
          <select
            id="defaultView"
            value={layout.defaultView}
            onChange={(e) => setLayout({ ...layout, defaultView: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="overview">Overview</option>
            <option value="orders">Orders</option>
            <option value="meals">Meals</option>
            <option value="analytics">Analytics</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="refreshInterval"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Auto-Refresh Interval (seconds)
          </label>
          <select
            id="refreshInterval"
            value={layout.refreshInterval}
            onChange={(e) => setLayout({ ...layout, refreshInterval: parseInt(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="15">15 seconds</option>
            <option value="30">30 seconds</option>
            <option value="60">1 minute</option>
            <option value="300">5 minutes</option>
            <option value="0">Disabled</option>
          </select>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Dashboard Widgets</h3>

          {[
            {
              key: 'showQuickStats',
              label: 'Quick Stats Card',
              description: 'Show key metrics at a glance',
            },
            {
              key: 'showRecentOrders',
              label: 'Recent Orders List',
              description: 'Display latest order activity',
            },
            {
              key: 'showMealCalendar',
              label: 'Meal Calendar',
              description: 'Show upcoming meals and schedules',
            },
            {
              key: 'showRevenueChart',
              label: 'Revenue Chart',
              description: 'Display revenue trends',
            },
            {
              key: 'compactMode',
              label: 'Compact Mode',
              description: 'Use compact layout for more information',
            },
          ].map(({ key, label, description }) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{label}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
              </div>
              <button
                onClick={() => setLayout({ ...layout, [key]: !layout[key as keyof typeof layout] })}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none ${
                  layout[key as keyof typeof layout]
                    ? 'bg-indigo-600'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    layout[key as keyof typeof layout] ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            Save Layout Settings
          </button>
        </div>
      </div>
    </div>
  )
}

function SystemAlerts() {
  const [alerts, setAlerts] = useState({
    lowInventory: true,
    orderBacklog: true,
    deliveryDelays: true,
    systemErrors: true,
    dailySummary: true,
    weeklyReport: true,
    emailRecipients: 'admin@messefy.com',
    smsAlerts: false,
  })

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          System Alerts & Notifications
        </h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Configure system alerts and notification preferences
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Alert Types</h3>

          {[
            {
              key: 'lowInventory',
              label: 'Low Inventory Alerts',
              description: 'Get notified when ingredients run low',
            },
            {
              key: 'orderBacklog',
              label: 'Order Backlog Alerts',
              description: 'Alerts when order queue gets too long',
            },
            {
              key: 'deliveryDelays',
              label: 'Delivery Delay Notifications',
              description: 'Notify about delivery delays',
            },
            {
              key: 'systemErrors',
              label: 'System Error Alerts',
              description: 'Critical system error notifications',
            },
            {
              key: 'dailySummary',
              label: 'Daily Summary Reports',
              description: 'Daily overview of system performance',
            },
            {
              key: 'weeklyReport',
              label: 'Weekly Analytics Reports',
              description: 'Weekly detailed analytics',
            },
          ].map(({ key, label, description }) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{label}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
              </div>
              <button
                onClick={() => setAlerts({ ...alerts, [key]: !alerts[key as keyof typeof alerts] })}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none ${
                  alerts[key as keyof typeof alerts]
                    ? 'bg-indigo-600'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    alerts[key as keyof typeof alerts] ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

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
            value={alerts.emailRecipients}
            onChange={(e) => setAlerts({ ...alerts, emailRecipients: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="admin@messefy.com"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900 dark:text-white">SMS Alerts</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Receive critical alerts via SMS
            </p>
          </div>
          <button
            onClick={() => setAlerts({ ...alerts, smsAlerts: !alerts.smsAlerts })}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none ${
              alerts.smsAlerts ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                alerts.smsAlerts ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="flex justify-end">
          <button className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            Save Alert Settings
          </button>
        </div>
      </div>
    </div>
  )
}

function AnalyticsSettings() {
  const [analytics, setAnalytics] = useState({
    enableTracking: true,
    trackPopularMeals: true,
    trackOrderPatterns: true,
    trackRevenue: true,
    exportFormat: 'csv',
    retentionPeriod: 90,
    anonymizeData: false,
  })

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics & Reports</h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Configure analytics tracking and reporting preferences
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Tracking Settings</h3>

          {[
            {
              key: 'trackPopularMeals',
              label: 'Track Popular Meals',
              description: 'Monitor most ordered meals',
            },
            {
              key: 'trackOrderPatterns',
              label: 'Track Order Patterns',
              description: 'Analyze ordering trends and patterns',
            },
            {
              key: 'trackRevenue',
              label: 'Track Revenue',
              description: 'Monitor daily and monthly revenue',
            },
          ].map(({ key, label, description }) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{label}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
              </div>
              <button
                onClick={() =>
                  setAnalytics({ ...analytics, [key]: !analytics[key as keyof typeof analytics] })
                }
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none ${
                  analytics[key as keyof typeof analytics]
                    ? 'bg-indigo-600'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    analytics[key as keyof typeof analytics] ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="exportFormat"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Default Export Format
            </label>
            <select
              id="exportFormat"
              value={analytics.exportFormat}
              onChange={(e) => setAnalytics({ ...analytics, exportFormat: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="csv">CSV</option>
              <option value="excel">Excel</option>
              <option value="pdf">PDF</option>
              <option value="json">JSON</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="retentionPeriod"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Data Retention Period (days)
            </label>
            <select
              id="retentionPeriod"
              value={analytics.retentionPeriod}
              onChange={(e) =>
                setAnalytics({ ...analytics, retentionPeriod: parseInt(e.target.value) })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="30">30 days</option>
              <option value="90">90 days</option>
              <option value="180">6 months</option>
              <option value="365">1 year</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Anonymize User Data</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Remove personal identifiers from analytics
            </p>
          </div>
          <button
            onClick={() => setAnalytics({ ...analytics, anonymizeData: !analytics.anonymizeData })}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none ${
              analytics.anonymizeData ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                analytics.anonymizeData ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="flex justify-end">
          <button className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            Save Analytics Settings
          </button>
        </div>
      </div>
    </div>
  )
}

function IntegrationSettings() {
  const [integrations, setIntegrations] = useState({
    enableStripe: true,
    enableSlack: false,
    enableEmailService: true,
    enableSMS: false,
    webhookUrl: '',
    apiKey: '',
  })

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Integrations</h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Manage third-party integrations and services
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Payment & Communication
          </h3>

          {[
            {
              key: 'enableStripe',
              label: 'Stripe Payment Integration',
              description: 'Accept online payments',
            },
            {
              key: 'enableSlack',
              label: 'Slack Notifications',
              description: 'Send notifications to Slack',
            },
            {
              key: 'enableEmailService',
              label: 'Email Service',
              description: 'Send transactional emails',
            },
            { key: 'enableSMS', label: 'SMS Service', description: 'Send SMS notifications' },
          ].map(({ key, label, description }) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{label}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
              </div>
              <button
                onClick={() =>
                  setIntegrations({
                    ...integrations,
                    [key]: !integrations[key as keyof typeof integrations],
                  })
                }
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none ${
                  integrations[key as keyof typeof integrations]
                    ? 'bg-indigo-600'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    integrations[key as keyof typeof integrations]
                      ? 'translate-x-5'
                      : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        <div>
          <label
            htmlFor="webhookUrl"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Webhook URL
          </label>
          <input
            type="url"
            id="webhookUrl"
            value={integrations.webhookUrl}
            onChange={(e) => setIntegrations({ ...integrations, webhookUrl: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="https://your-domain.com/webhook"
          />
        </div>

        <div>
          <label
            htmlFor="apiKey"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            API Key
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="password"
              id="apiKey"
              value={integrations.apiKey}
              onChange={(e) => setIntegrations({ ...integrations, apiKey: e.target.value })}
              className="block w-full flex-1 rounded-none rounded-l-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="••••••••••••••••••••"
            />
            <button className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600">
              Generate
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            Save Integration Settings
          </button>
        </div>
      </div>
    </div>
  )
}

function UserManagementSettings() {
  const [userSettings, setUserSettings] = useState({
    allowRegistration: true,
    requireApproval: false,
    maxUsers: 1000,
    defaultRole: 'member',
    enablePasswordReset: true,
    sessionTimeout: 60,
  })

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Configure user registration and management settings
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="maxUsers"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Maximum Users
            </label>
            <input
              type="number"
              id="maxUsers"
              value={userSettings.maxUsers}
              onChange={(e) =>
                setUserSettings({ ...userSettings, maxUsers: parseInt(e.target.value) })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              min="1"
              max="10000"
            />
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
              value={userSettings.sessionTimeout}
              onChange={(e) =>
                setUserSettings({ ...userSettings, sessionTimeout: parseInt(e.target.value) })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              min="15"
              max="480"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="defaultRole"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Default User Role
          </label>
          <select
            id="defaultRole"
            value={userSettings.defaultRole}
            onChange={(e) => setUserSettings({ ...userSettings, defaultRole: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="member">Member</option>
            <option value="user">User</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">User Features</h3>

          {[
            {
              key: 'allowRegistration',
              label: 'Allow User Registration',
              description: 'Enable new user sign-ups',
            },
            {
              key: 'requireApproval',
              label: 'Require Admin Approval',
              description: 'New users need admin approval',
            },
            {
              key: 'enablePasswordReset',
              label: 'Enable Password Reset',
              description: 'Allow users to reset passwords',
            },
          ].map(({ key, label, description }) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{label}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
              </div>
              <button
                onClick={() =>
                  setUserSettings({
                    ...userSettings,
                    [key]: !userSettings[key as keyof typeof userSettings],
                  })
                }
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none ${
                  userSettings[key as keyof typeof userSettings]
                    ? 'bg-indigo-600'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    userSettings[key as keyof typeof userSettings]
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
            Save User Settings
          </button>
        </div>
      </div>
    </div>
  )
}

function SecuritySettings() {
  const [security, setSecurity] = useState({
    enableRateLimiting: true,
    maxLoginAttempts: 5,
    lockoutDuration: 30,
    enableAuditLogging: true,
    requireStrongPasswords: true,
    enableIPWhitelist: false,
    allowedIPs: '',
  })

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Security Settings</h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Configure security policies and access controls
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <label
              htmlFor="maxLoginAttempts"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Max Login Attempts
            </label>
            <input
              type="number"
              id="maxLoginAttempts"
              value={security.maxLoginAttempts}
              onChange={(e) =>
                setSecurity({ ...security, maxLoginAttempts: parseInt(e.target.value) })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              min="3"
              max="10"
            />
          </div>

          <div>
            <label
              htmlFor="lockoutDuration"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Lockout Duration (minutes)
            </label>
            <input
              type="number"
              id="lockoutDuration"
              value={security.lockoutDuration}
              onChange={(e) =>
                setSecurity({ ...security, lockoutDuration: parseInt(e.target.value) })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              min="5"
              max="120"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Security Policies</h3>

          {[
            {
              key: 'enableRateLimiting',
              label: 'Enable Rate Limiting',
              description: 'Limit API request rates',
            },
            {
              key: 'enableAuditLogging',
              label: 'Enable Audit Logging',
              description: 'Log all admin activities',
            },
            {
              key: 'requireStrongPasswords',
              label: 'Require Strong Passwords',
              description: 'Enforce password complexity',
            },
            {
              key: 'enableIPWhitelist',
              label: 'Enable IP Whitelist',
              description: 'Restrict access by IP address',
            },
          ].map(({ key, label, description }) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{label}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
              </div>
              <button
                onClick={() =>
                  setSecurity({ ...security, [key]: !security[key as keyof typeof security] })
                }
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none ${
                  security[key as keyof typeof security]
                    ? 'bg-indigo-600'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    security[key as keyof typeof security] ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        {security.enableIPWhitelist && (
          <div>
            <label
              htmlFor="allowedIPs"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Allowed IP Addresses
            </label>
            <textarea
              id="allowedIPs"
              rows={3}
              value={security.allowedIPs}
              onChange={(e) => setSecurity({ ...security, allowedIPs: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="192.168.1.100&#10;10.0.0.0/24&#10;One IP or range per line"
            />
          </div>
        )}

        <div className="flex justify-end">
          <button className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            Save Security Settings
          </button>
        </div>
      </div>
    </div>
  )
}
