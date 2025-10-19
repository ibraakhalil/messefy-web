'use client';

import api from '@/utils/axios';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import Button from '@/components/ui/button';
import { TickIcon } from '@/components/svg/invitation-icons';
import { Mail, X, RefreshCw, AlertCircle } from 'lucide-react';
import { useWorkspaceMember } from '@/providers/workspace-provider';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Invitation {
  id: string;
  workspaceId: string;
  createdAt: string;
  message?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface InvitationWithUser extends Invitation {
  user: User;
  workspace: {
    id: string;
    name: string;
  };
}

export default function InvitationsPage() {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { member } = useWorkspaceMember();
  const workspace = member?.workspace;

  const {
    data: invitationsData,
    isLoading,
    error,
    refetch,
  } = useQuery<InvitationWithUser[]>({
    queryKey: ['sent-invitations'],
    queryFn: async () => {
      const { data } = await api.get(`/workspaces/${workspace?.id}/invitations`);
      return data;
    },
    enabled: !!workspace?.id,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  const withdrawMutation = useMutation({
    mutationFn: async (invitationId: string) => {
      const { data } = await api.delete(
        `/workspaces/${workspace?.id}/invitations/${invitationId}/cancel`,
      );
      return data;
    },
    onSuccess: () => {
      toast.success('Invitation withdrawn');
      queryClient.invalidateQueries({ queryKey: ['sent-invitations'] });
    },
    onError: () => {
      toast.error('Failed to withdraw invitation');
    },
  });

  const acceptMutation = useMutation({
    mutationFn: async (invitationId: string) => {
      const { data } = await api.post(
        `/workspaces/${workspace?.id}/invitations/${invitationId}/accept`,
      );
      return data;
    },
    onSuccess: () => {
      toast.success('Invitation accepted');
      queryClient.invalidateQueries({ queryKey: ['sent-invitations'] });
    },
    onError: () => {
      toast.error('Failed to accept invitation');
    },
  });

  const handleCancel = (invitationId: string) => {
    if (window.confirm('Withdraw this invitation?')) {
      withdrawMutation.mutate(invitationId);
    }
  };

  const handleAccept = (invitationId: string) => {
    acceptMutation.mutate(invitationId);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6 h-8 w-48 animate-pulse rounded bg-gray-200"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-gray-100"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-lg bg-red-50 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 text-red-600" />
            <div className="flex-1">
              <h3 className="font-medium text-red-900">Failed to load invitations</h3>
              <p className="mt-1 text-sm text-red-700">
                {error instanceof Error ? error.message : 'Something went wrong'}
              </p>
              <Button onClick={() => refetch()} variant="secondary" className="mt-3">
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const invitations = invitationsData || [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-primary-fg text-2xl font-bold">Sent Invitations</h1>
          <p className="text-subtitle-color mt-1 text-sm">{invitations.length} invitations sent</p>
        </div>
        <Button
          onClick={handleRefresh}
          variant="secondary"
          disabled={isRefreshing}
          className="h-9 px-3"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Invitations List */}
      {invitations.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-200 p-12 text-center">
          <Mail className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-sm font-medium text-gray-900">No invitations sent</h3>
          <p className="mt-1 text-sm text-gray-500">
            Start inviting members to join your workspace
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {invitations.map((invitation) => (
            <div
              key={invitation.id}
              className="rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-medium text-gray-900">
                      {invitation.user?.name || 'Unknown'}
                    </h3>
                  </div>

                  <div className="mt-1.5 flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5" />
                      {invitation.user?.email || 'Unknown'}
                    </span>
                  </div>

                  {invitation.message && (
                    <p className="mt-2 text-sm text-gray-500 italic">"{invitation.message}"</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAccept(invitation.id)}
                    disabled={acceptMutation.isPending}
                    className="flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                    title="Accept invitation"
                  >
                    <TickIcon className="size-4" />
                  </button>
                  <button
                    onClick={() => handleCancel(invitation.id)}
                    disabled={withdrawMutation.isPending}
                    className="rounded-md p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                    title="Withdraw invitation"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
