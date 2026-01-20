'use client';

import { useWorkspace } from '@/providers/workspace-provider';
import { ResponsiveDialog } from '../ui/responsive-dialog';
import Button from '../ui/button';
import { LogOut } from 'lucide-react';
import { DeleteModal } from '../modals/delete-modal';
import { leaveWorkspace } from '@/lib/workspace-requests';
import toast from 'react-hot-toast';

export default function MessSection() {
  const { member } = useWorkspace();

  const handleLeaveWorkspace = async () => {
    try {
      await leaveWorkspace(member?.workspaceId || '');
      toast.success('Successfully left the workspace');
    } catch (error) {
      toast.error('Failed to leave workspace');
      console.error('Error leaving workspace:', error);
    }
  };

  if (!member?.workspace) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500">You are not a member of any workspace</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {member?.workspace?.name || 'Workspace'}
            </h3>
            <p className="text-sm text-gray-500">
              Role: <span className="capitalize">{member?.role}</span>
            </p>
          </div>

          {member.role !== 'owner' && (
            <ResponsiveDialog>
              <ResponsiveDialog.Trigger>
                <Button
                  variant="secondary"
                  className="border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50"
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

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <h4 className="mb-2 text-sm font-medium text-blue-900">Workspace Information</h4>
        <ul className="space-y-1 text-sm text-blue-800">
          <li>• You can leave this workspace at any time</li>
          <li>• Your data will be preserved but you won't have access</li>
          <li>• You can be re-invited by an admin later</li>
        </ul>
      </div>
    </div>
  );
}
