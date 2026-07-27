'use client';

import { Workspace } from '@/types/workspace';
import { User } from 'next-auth';
import MessOverview from './mess-overview';
import JoinOrCreateMess from '@/components/profile/join-create-mess';
import { Calendar, Mail, User as UserIcon } from 'lucide-react';
import { useWorkspace } from '@/providers/workspace-provider';
import Link from 'next/link';

interface UserData {
  user: User | undefined;
  workspace: Workspace | undefined;
}

interface OverviewTabProps {
  userData: UserData;
  onNavigate: (tab: string) => void;
}

export default function OverviewTab({ userData, onNavigate }: OverviewTabProps) {
  const { user, workspace } = userData;
  const { member } = useWorkspace();

  if (workspace) {
    return (
      <div className="space-y-6">
        <MessOverview />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Profile Summary Card */}
      <div className="rounded-xl border border-border-color bg-card-bg p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800/90">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 shadow-sm ring-4 ring-white dark:ring-gray-900">
            {user?.image ? (
              <img
                src={user.image}
                alt={user?.name || 'User'}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <span className="text-3xl font-bold text-white">
                {(user?.name || 'U').substring(0, 1).toUpperCase()}
              </span>
            )}
          </div>
          
          <div className="flex-1 space-y-1">
            <h2 className="text-2xl font-semibold text-pure-color dark:text-white">
              Welcome, {user?.name || 'User'}!
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-sm text-subtitle-color dark:text-gray-400">
              <div className="flex items-center gap-1.5">
                <Mail className="h-4 w-4" />
                {user?.email}
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                Joined recently
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Area */}
      <div className="rounded-xl border border-border-color bg-card-bg p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800/90">
        <h3 className="mb-4 text-lg font-medium text-pure-color dark:text-white">
          Get Started
        </h3>
        <p className="mb-6 text-subtitle-color dark:text-gray-400">
          You are not currently part of any workspace. Create a new mess to manage meals and expenses, or join an existing one using an invitation.
        </p>
        <JoinOrCreateMess workspace={workspace} />
      </div>
    </div>
  );
}
