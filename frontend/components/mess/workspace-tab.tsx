'use client';

import { useWorkspace } from '@/providers/workspace-provider';
import { ResponsiveDialog } from '../ui/responsive-dialog';
import Button from '../ui/button';
import { LogOut, Settings, Users } from 'lucide-react';
import { DeleteModal } from '../modals/delete-modal';
import { leaveWorkspace } from '@/lib/workspace-requests';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function WorkspaceTab() {
  const { member } = useWorkspace();
  const canLeaveWorkspace = Boolean(member && member.role !== 'owner' && !member.isOffline);

  const handleLeaveWorkspace = async () => {
    try {
      await leaveWorkspace(member?.workspaceId || '');
      toast.success('Successfully left the workspace');
      window.location.reload();
    } catch (error) {
      toast.error('Failed to leave workspace');
      console.error('Error leaving workspace:', error);
    }
  };

  if (!member?.workspace) {
    return null;
  }

  const isManagerOrOwner = ['owner', 'manager'].includes(member.role);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border-color bg-card-bg p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800/90">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-2xl font-bold text-white shadow-md">
              {member.workspace.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-semibold text-pure-color dark:text-white">
                  {member.workspace.name}
                </h3>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    member.workspace.isActive
                      ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                  }`}>
                  {member.workspace.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="mt-1 flex items-center gap-4 text-sm text-subtitle-color dark:text-gray-400">
                <span>Role: <span className="capitalize font-medium text-pure-color dark:text-gray-300">{member.role}</span></span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {isManagerOrOwner && (
              <Link href="/mess/dashboard">
                <Button variant="secondary" leftIcon={Settings}>
                  Dashboard
                </Button>
              </Link>
            )}
            
            {canLeaveWorkspace && (
              <ResponsiveDialog>
                <ResponsiveDialog.Trigger>
                  <Button
                    variant="secondary"
                    className="border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40"
                    leftIcon={LogOut}
                  >
                    Leave Workspace
                  </Button>
                </ResponsiveDialog.Trigger>
                <ResponsiveDialog.Content>
                  <DeleteModal
                    title="Leave Workspace"
                    subtitle="Are you sure you want to leave this workspace? All your data will be preserved but you won't have access anymore."
                    onDelete={handleLeaveWorkspace}
                  />
                </ResponsiveDialog.Content>
              </ResponsiveDialog>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-blue-200 bg-blue-50/80 p-5 dark:border-blue-900/60 dark:bg-blue-950/40">
        <h4 className="mb-3 font-medium text-blue-900 dark:text-blue-200 flex items-center gap-2">
          <Users className="size-4" />
          Workspace Information
        </h4>
        <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
          {member.isOffline ? (
            <li>• Offline members can only be removed by the mess owner</li>
          ) : (
            <li>• You can leave this workspace at any time</li>
          )}
          <li>• Your data will be preserved but you won't have access</li>
          <li>• You can be re-invited by an admin later</li>
        </ul>
      </div>
    </div>
  );
}
