'use client'

import { ComponentType, ReactNode, SVGProps, useState } from 'react'
import { Menu, Home, Settings, Users, PieChart, LogOut, BellIcon } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/utils/cn'
import { usePathname } from 'next/navigation'

interface DashboardLayoutProps {
  children: ReactNode
}

interface NavItemProps {
  children: ReactNode
  icon: ComponentType<SVGProps<SVGSVGElement>>
  isActive?: boolean
}

function NavItem({ children, icon: Icon, isActive = false }: NavItemProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white',
        { 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white': isActive },
      )}
    >
      <Icon className="size-5" />
      {children}
    </div>
  )
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const path = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-10 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform dark:border-gray-700 dark:bg-gray-800 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} tablet:relative tablet:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4 dark:border-gray-700">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
              <PieChart className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">MessMate</span>
          </Link>
          <button
            onClick={toggleSidebar}
            className="tablet:hidden rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-2 py-4">
          <Link href="/dashboard">
            <NavItem icon={Home} isActive={path === '/dashboard'}>
              Dashboard
            </NavItem>
          </Link>
          <Link href="/dashboard/members">
            <NavItem icon={Users} isActive={path.includes('/members')}>
              Members
            </NavItem>
          </Link>
          <Link href="/dashboard/settings">
            <NavItem icon={Settings} isActive={path.includes('/settings')}>
              Settings
            </NavItem>
          </Link>
        </nav>

        {/* User section */}
        <div className="border-t border-gray-200 p-4 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                <span className="text-sm font-medium">JD</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">John Doe</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Manager</p>
              </div>
            </div>
          </div>
          <button className="mt-4 flex w-full items-center justify-center rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white">
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Top header */}
        <header className="tablet:justify-end flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-700 dark:bg-gray-800">
          <button
            onClick={toggleSidebar}
            className="tablet:hidden rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center space-x-4">
            <button className="rounded-full bg-gray-100 p-1 text-gray-600 hover:bg-gray-200 hover:text-gray-900 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white">
              <span className="sr-only">Notifications</span>
              <BellIcon />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
