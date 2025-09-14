'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Sparkles, ChevronDown, LogOut, Settings, User as UserIcon } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/drop-down'

export type AppHeaderProps = {
  appName?: string
  workspaceName?: string
  subdomain?: string
  user?: {
    name?: string
    email?: string
    avatarUrl?: string
    role?: string
  }
  essentials?: Array<{ label: string; value: string }>
}

export default function AppHeader({
  appName = 'MessMate',
  workspaceName,
  subdomain,
  user = { name: 'Guest', email: 'guest@example.com', role: 'Owner' },
  essentials = [
    { label: 'Members', value: '—' },
    { label: 'Meals', value: '—' },
    { label: 'Due', value: '—' },
  ],
}: AppHeaderProps) {
  const displayWorkspace = workspaceName || subdomain || 'Workspace'

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200/60 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="group inline-flex items-center gap-2">
            <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-600 text-white shadow-md">
              <Sparkles className="size-4" />
            </span>
            <span className="text-base font-semibold text-gray-900">{appName}</span>
          </Link>
          <span className="text-gray-400">/</span>
          <span className="rounded-md bg-gray-100 px-2 py-1 text-sm font-medium text-gray-700">
            {displayWorkspace}
          </span>
        </div>

        {/* Essentials (Owner quick stats) */}
        <div className="hidden items-center gap-4 md:flex">
          {essentials.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span className="text-xs tracking-wide text-gray-500 uppercase">{item.label}</span>
              <span className="rounded-md bg-gray-50 px-2 py-1 text-sm font-semibold text-gray-900">
                {item.value}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm hover:border-gray-300 hover:bg-gray-50">
                {user?.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt={user?.name || 'User'}
                    width={24}
                    height={24}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-[10px] font-semibold text-gray-700">
                    {(user?.name || 'U').substring(0, 1).toUpperCase()}
                  </span>
                )}
                <span className="hidden sm:block">
                  <span className="block text-left text-sm leading-tight font-medium">
                    {user?.name || 'User'}
                  </span>
                  <span className="block text-[11px] leading-tight text-gray-500">
                    {user?.role || 'Member'}
                  </span>
                </span>
                <ChevronDown className="size-4 text-gray-500" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                    <UserIcon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{user?.name}</div>
                    <div className="text-sm text-gray-500">{user?.email}</div>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-2">
                    <Settings className="size-4" /> Profile & Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/auth/login?logout=true" className="flex items-center gap-2">
                    <LogOut className="size-4" /> Logout
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
