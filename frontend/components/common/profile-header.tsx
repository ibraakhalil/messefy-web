'use client';

import { signIn } from 'next-auth/react';
import Logo from './logo';
import UserDropdown from './user-dropdown';
import ThemeToggle from './theme-toggle';
import { Session } from 'next-auth';
import { Workspace } from '@/types/workspace';

export type AppHeaderProps = {
  userData: {
    user: Session['user'];
    workspace: Workspace | undefined;
  };
};

export default function ProfileHeader({ userData }: AppHeaderProps) {
  const user = userData?.user;

  const essentials = [
    { label: 'Messes', value: '3' },
    { label: 'Members', value: '15' },
    { label: 'Admins', value: '2' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200/60 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Logo />

        <div className="hidden items-center gap-4 md:flex">
          {essentials.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span className="text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">{item.label}</span>
              <span className="rounded-md bg-gray-50 px-2 py-1 text-sm font-semibold text-gray-900 dark:bg-gray-800 dark:text-white">
                {item.value}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {!user ? (
            <button
              onClick={() => signIn()}
              className="rounded-lg border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Sign In
            </button>
          ) : (
            <UserDropdown />
          )}
        </div>
      </div>
    </header>
  );
}

