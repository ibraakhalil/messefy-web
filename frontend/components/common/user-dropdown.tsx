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
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50 hover:shadow">
            {user?.image ? (
              <Image
                src={user.image}
                alt={user?.name || 'User'}
                width={24}
                height={24}
                className="rounded-full object-cover ring-2 ring-gray-100"
              />
            ) : (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-[10px] font-semibold text-white">
                {(user?.name || 'U').substring(0, 1).toUpperCase()}
              </span>
            )}
            <span className="hidden sm:block">
              <span className="block text-left text-sm leading-tight font-medium">
                {user?.name || 'User'}
              </span>
              <span className="block text-[11px] leading-tight text-gray-500">Member</span>
            </span>
            <ChevronDown className="size-4 text-gray-400 transition-transform group-data-[state=open]:rotate-180" />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content className="w-64" align="end">
          <div className="mb-2 flex items-center gap-3 rounded-lg bg-gray-50 p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-sm ring-2 ring-white">
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
              <div className="truncate font-semibold text-gray-900">{user?.name || 'User'}</div>
              <div className="truncate text-sm text-gray-500">
                {user?.email || 'user@example.com'}
              </div>
            </div>
          </div>

          <Link
            href="/profile"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <Settings className="size-4 text-gray-500" />
            <span className="font-medium">Profile & Settings</span>
          </Link>

          {member && (
            <Link
              href="/mess"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              <Settings className="size-4 text-gray-500" />
              <span className="font-medium">My Mess</span>
            </Link>
          )}

          {member && ['owner', 'manager'].includes(member.role) && (
            <Link
              href={`/mess/dashboard`}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              <Settings className="size-4 text-gray-500" />
              <span className="font-medium">Dashboard</span>
            </Link>
          )}

          <button
            onClick={() => signOut()}
            className="flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut className="size-4" />
            <span>Sign Out</span>
          </button>
        </DropdownMenu.Content>
      </DropdownMenu>
    </div>
  );
}
