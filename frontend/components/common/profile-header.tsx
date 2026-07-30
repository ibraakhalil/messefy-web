'use client';

import { signIn } from 'next-auth/react';
import Logo from './logo';
import UserDropdown from './user-dropdown';
import ThemeToggle from './theme-toggle';
import LocaleSwitcher from './locale-switcher';
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

  return (
    <header className="border-border-color bg-card-bg/90 sticky top-0 z-40 w-full border-b backdrop-blur-xl">
      <div className="tablet:px-6 container flex h-16 items-center justify-between px-4">
        <Logo />

        <div className="flex items-center gap-3">
          <LocaleSwitcher />
          <ThemeToggle />
          {!user ? (
            <button
              type="button"
              onClick={() => signIn()}
              className="border-border-color bg-card-bg text-pure-color hover:bg-secondary-bg rounded-lg border px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
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
