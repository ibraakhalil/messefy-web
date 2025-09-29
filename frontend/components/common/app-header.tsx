'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/drop-down';
import { ChevronDown, Settings, User as UserIcon } from 'lucide-react';
import { SessionProviderProps, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import Logo from './logo';

export type AppHeaderProps = {
  session?: SessionProviderProps['session'];
  subdomain?: string;
};

export default function AppHeader({ session }: AppHeaderProps) {
  const user = session?.user;

  const essentials = [
    { label: 'Messes', value: '3' },
    { label: 'Members', value: '15' },
    { label: 'Admins', value: '2' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200/60 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Logo />

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

        {!user && (
          <button
            onClick={() => signIn()}
            className="rounded-lg border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:border-gray-300 hover:bg-gray-50"
          >
            Sign In
          </button>
        )}

        {user && (
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm hover:border-gray-300 hover:bg-gray-50">
                  {user?.image ? (
                    <Image
                      src={user.image}
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
                    <span className="block text-[11px] leading-tight text-gray-500">Member</span>
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
                    <button
                      onClick={() => signOut()}
                      className="rounded-lg border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:border-gray-300 hover:bg-gray-50"
                    >
                      Sign Out
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </header>
  );
}
