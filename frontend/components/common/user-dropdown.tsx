import Image from 'next/image';
import { DropdownMenu } from '../ui/drop-down';
import { ChevronDown, Settings, LogOut, UserIcon } from 'lucide-react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { useWorkspace } from '@/providers/workspace-provider';

export default function UserDropdown() {
  const session = useSession();
  const { member } = useWorkspace();
  const user = session.data?.user;

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <button className="inline-flex items-center gap-2 rounded-lg border border-border-color bg-card-bg px-3 py-1.5 text-sm text-pure-color shadow-sm transition-all hover:bg-secondary-bg hover:shadow dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">
            {user?.image ? (
              <Image
                src={user.image}
                alt={user?.name || 'User'}
                width={24}
                height={24}
                className="rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-700"
              />
            ) : (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-[10px] font-semibold text-white">
                {(user?.name || 'U').substring(0, 1).toUpperCase()}
              </span>
            )}
            <span className="hidden sm:block">
              <span className="block text-left text-sm leading-tight font-medium text-pure-color dark:text-white">
                {user?.name || 'User'}
              </span>
              <span className="block text-[11px] leading-tight text-subtitle-color dark:text-gray-400">Member</span>
            </span>
            <ChevronDown className="size-4 text-subtitle-color transition-transform group-data-[state=open]:rotate-180 dark:text-gray-400" />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content className="w-64" align="end">
          <div className="mb-2 flex items-center gap-3 rounded-lg bg-secondary-bg p-3 dark:bg-gray-800/80">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-sm ring-2 ring-white dark:ring-gray-700">
              {user?.image ? (
                <Image
                  src={user.image}
                  alt={user?.name || 'User'}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              ) : (
                <UserIcon className="h-5 w-5 text-white" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate font-semibold text-pure-color dark:text-white">{user?.name || 'User'}</div>
              <div className="truncate text-sm text-subtitle-color dark:text-gray-400">
                {user?.email || 'user@example.com'}
              </div>
            </div>
          </div>

          <Link
            href="/mess"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-pure-color transition-colors hover:bg-secondary-bg dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-white"
          >
            <Settings className="size-4 text-subtitle-color dark:text-gray-400" />
            <span className="font-medium">Profile, Mess & Settings</span>
          </Link>

          {member && ['owner', 'manager'].includes(member.role) && (
            <Link
              href={`/mess/dashboard`}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-pure-color transition-colors hover:bg-secondary-bg dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              <Settings className="size-4 text-subtitle-color dark:text-gray-400" />
              <span className="font-medium">Dashboard</span>
            </Link>
          )}

          <button
            onClick={() => signOut()}
            className="flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
          >
            <LogOut className="size-4" />
            <span>Sign Out</span>
          </button>
        </DropdownMenu.Content>
      </DropdownMenu>
    </div>
  );
}

