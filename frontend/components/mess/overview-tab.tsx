'use client';

import { Workspace } from '@/types/workspace';
import { User } from 'next-auth';
import MessOverview from './mess-overview';
import JoinOrCreateMess from '@/components/profile/join-create-mess';
import { Mail } from 'lucide-react';
import Image from 'next/image';

interface UserData {
  user: User | undefined;
  workspace: Workspace | undefined;
}

interface OverviewTabProps {
  userData: UserData;
}

export default function OverviewTab({ userData }: OverviewTabProps) {
  const { user, workspace } = userData;

  if (workspace) {
    return <MessOverview />;
  }

  return (
    <div className="border-border-color bg-card-bg overflow-hidden rounded-2xl border shadow-sm">
      <div className="via-card-bg tablet:p-8 dark:via-card-bg bg-gradient-to-br from-emerald-50 to-teal-50 p-6 dark:from-emerald-950/40 dark:to-teal-950/30">
        <div className="tablet:flex-row tablet:items-center flex flex-col gap-5">
          <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-sm ring-4 ring-white/80 dark:ring-gray-900/60">
            {user?.image ? (
              <Image
                src={user.image}
                alt={user?.name || 'User'}
                width={64}
                height={64}
                className="size-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-white">
                {(user?.name || 'U').substring(0, 1).toUpperCase()}
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
              Ready when you are
            </p>
            <h2 className="text-pure-color mt-1 text-2xl font-bold text-balance">
              Welcome, {user?.name || 'User'}
            </h2>
            <p className="text-subtitle-color mt-2 flex min-w-0 items-center gap-2 text-sm">
              <Mail className="size-4 shrink-0" aria-hidden="true" />
              <span className="truncate">{user?.email}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="border-border-color tablet:p-8 border-t p-6">
        <h3 className="text-pure-color text-lg font-bold">Choose How to Get Started</h3>
        <p className="text-subtitle-color mt-2 max-w-2xl text-sm leading-6">
          Create a new mess to manage members and costs, or join an existing group with an
          invitation.
        </p>
        <div className="mt-6">
          <JoinOrCreateMess workspace={workspace} />
        </div>
      </div>
    </div>
  );
}
