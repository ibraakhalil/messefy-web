'use client';

import { useRouter } from 'next/navigation';
import LeaveWorkspaceButton from './leave-workspace-button';
import { useWorkspaceMember } from '@/providers/workspace-provider';

export default function MessSection() {
  const { member } = useWorkspaceMember();
  const router = useRouter();

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
            <LeaveWorkspaceButton
              workspaceId={member?.workspace.id}
              workspaceName={member?.workspace.name}
              onSuccess={() => router.refresh()}
            />
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
