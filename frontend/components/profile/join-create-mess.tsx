'use client';

import { Links } from '../links';
import { Plus, UserPlus, X, Clock } from 'lucide-react';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';
import Button from '../ui/button';
import { Workspace } from '@/types/workspace';
import JoinMessModal from './join-mess-modal';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/utils/axios';
import { toast } from 'react-hot-toast';

interface JoinOrCreateMessProps {
  workspace?: Workspace;
}

interface Invitation {
  id: string;
  workspaceId: string;
  workspaceName: string;
  status: string;
  message?: string;
}

export default function JoinOrCreateMess({ workspace }: JoinOrCreateMessProps) {
  const queryClient = useQueryClient();

  // Fetch invitation - auto loading, error, refetch
  const { data: invitation, isLoading } = useQuery({
    queryKey: ['invitation'],
    queryFn: async () => {
      const response = await api.get<Invitation>('/workspaces/invitation');
      return response.data;
    },
    enabled: !workspace, // শুধু workspace না থাকলে fetch করবে
    retry: false, // 404 error এ retry করবে না
  });

  // Cancel invitation mutation
  const cancelMutation = useMutation({
    mutationFn: (invitationId: string) => api.delete(`/workspaces/invitation/${invitationId}`),
    onSuccess: () => {
      toast.success('Invitation cancelled');
      queryClient.invalidateQueries({ queryKey: ['invitation'] }); // Auto refetch
    },
    onError: () => {
      toast.error('Failed to cancel invitation');
    },
  });

  // If workspace exists
  if (workspace) {
    return (
      <Links.Mess>
        <Button variant="secondary" className="flex items-center gap-2">
          <div className="text-gray-600">{workspace.name}</div>
        </Button>
      </Links.Mess>
    );
  }

  // Loading skeleton
  if (isLoading) {
    return <div className="h-10 w-48 animate-pulse rounded-md bg-gray-200" />;
  }

  // If invitation pending
  if (invitation) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2">
        <Clock className="h-4 w-4 text-amber-600" />
        <div className="flex-1">
          <p className="text-sm font-medium text-amber-900">Waiting for approval</p>
          <p className="text-xs text-amber-700">{invitation.workspaceName}</p>
        </div>
        <Button
          onClick={() => cancelMutation.mutate(invitation.id)}
          disabled={cancelMutation.isPending}
        >
          <X className="size-4" />
        </Button>
      </div>
    );
  }

  // Default: Create or Join
  return (
    <div className="flex items-center gap-3">
      <Links.CreateMess>
        <Button variant="secondary" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Mess
        </Button>
      </Links.CreateMess>
      <span className="text-gray-500">or</span>
      <ResponsiveDialog>
        <ResponsiveDialog.Trigger>
          <Button className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Join Mess
          </Button>
        </ResponsiveDialog.Trigger>
        <ResponsiveDialog.Content>
          <JoinMessModal />
        </ResponsiveDialog.Content>
      </ResponsiveDialog>
    </div>
  );
}
