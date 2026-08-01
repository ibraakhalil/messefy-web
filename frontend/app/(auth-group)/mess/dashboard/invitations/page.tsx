'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import {
  AlertCircle,
  Check,
  Clock,
  Loader2,
  Mail,
  RefreshCw,
  Send,
  UserPlus,
  X,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Button from '@/components/ui/button';
import { useWorkspace } from '@/providers/workspace-provider';
import api from '@/utils/axios';

interface User {
  id: string;
  name: string;
  email: string;
}

interface Invitation {
  id: string;
  workspaceId: string;
  createdAt: string;
  message?: string;
  user?: User;
  workspace?: {
    id: string;
    name: string;
  };
}

export default function InvitationsPage() {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const member = useWorkspace((state) => state.member);
  const workspace = member?.workspace;

  const {
    data: invitationsData,
    isLoading,
    error,
    refetch,
  } = useQuery<Invitation[]>({
    queryKey: ['sent-invitations', workspace?.id],
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
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="bg-card-shade h-7 w-48 animate-pulse rounded-lg" />
            <div className="bg-card-shade h-4 w-32 animate-pulse rounded-lg" />
          </div>
          <div className="bg-card-shade h-10 w-24 animate-pulse rounded-xl" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="border-border-color bg-card-bg h-28 animate-pulse rounded-2xl border"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="border-red-500/20 bg-red-500/10 rounded-2xl border p-6 text-pure-color">
          <div className="flex items-start gap-3.5">
            <AlertCircle className="mt-0.5 h-5 w-5 text-red-500 shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-pure-color">Failed to load invitations</h3>
              <p className="text-subtitle-secondary mt-1 text-sm">
                {error instanceof Error ? error.message : 'Something went wrong while fetching invitations.'}
              </p>
              <Button onClick={() => refetch()} variant="secondary" className="mt-4">
                <RefreshCw className="mr-2 h-4 w-4" /> Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const invitations = invitationsData || [];

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      {/* Header */}
      <div className="flex flex-col gap-4 tablet:flex-row tablet:items-center tablet:justify-between">
        <div className="flex items-center gap-3.5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
            <Send className="h-5.5 w-5.5" aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-pure-color text-2xl font-bold tracking-tight">Sent Invitations</h1>
            <p className="text-subtitle-secondary text-sm">
              {invitations.length} {invitations.length === 1 ? 'invitation' : 'invitations'} sent in total
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={handleRefresh}
            variant="secondary"
            disabled={isRefreshing}
            className="border-border-color bg-card-bg hover:bg-secondary-bg text-pure-color h-10 px-3.5 rounded-xl border font-medium transition-colors"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Link href="/mess/dashboard/add-member">
            <Button className="h-10 px-4 rounded-xl">
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Member
            </Button>
          </Link>
        </div>
      </div>

      {/* Invitations List */}
      {invitations.length === 0 ? (
        <div className="border-border-color bg-card-bg/60 rounded-2xl border-2 border-dashed p-12 text-center backdrop-blur-xs flex flex-col items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 mb-4">
            <Mail className="h-8 w-8" />
          </div>
          <h3 className="text-pure-color text-base font-semibold">No invitations sent yet</h3>
          <p className="text-subtitle-secondary mt-1.5 text-sm max-w-sm">
            Start inviting members to join your workspace to track meals, expenses, and deposits together.
          </p>
          <Link href="/mess/dashboard/add-member" className="mt-5">
            <Button className="h-10 px-5 rounded-xl">
              <UserPlus className="mr-2 h-4 w-4" />
              Invite First Member
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3.5">
          {invitations.map((invitation) => {
            const userName = invitation.user?.name || 'Pending Member';
            const userEmail = invitation.user?.email || 'No email specified';
            const initial = userName.charAt(0).toUpperCase();

            let formattedDate = '';
            if (invitation.createdAt) {
              try {
                formattedDate = format(parseISO(invitation.createdAt), 'MMM dd, yyyy');
              } catch {
                formattedDate = '';
              }
            }

            return (
              <div
                key={invitation.id}
                className="border-border-color bg-card-bg hover:border-emerald-500/40 group relative overflow-hidden rounded-2xl border p-5 transition-all duration-200 shadow-2xs hover:shadow-md"
              >
                <div className="flex flex-col gap-4 tablet:flex-row tablet:items-center tablet:justify-between">
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 font-bold text-base dark:bg-emerald-950/60 dark:text-emerald-300">
                      {initial}
                    </span>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h3 className="text-pure-color font-semibold text-base">
                          {userName}
                        </h3>
                        <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
                          Pending
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-subtitle-secondary text-sm">
                        <span className="flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 text-subtitle-secondary" />
                          {userEmail}
                        </span>

                        {formattedDate && (
                          <span className="flex items-center gap-1.5 text-xs">
                            <Clock className="h-3.5 w-3.5 text-subtitle-secondary" />
                            {formattedDate}
                          </span>
                        )}
                      </div>

                      {invitation.message && (
                        <p className="text-subtitle-secondary bg-secondary-bg/50 mt-2 rounded-lg px-3 py-1.5 text-xs italic">
                          "{invitation.message}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end tablet:self-center">
                    <button
                      onClick={() => handleAccept(invitation.id)}
                      disabled={acceptMutation.isPending}
                      className="flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-900/60 disabled:opacity-50 transition-colors cursor-pointer"
                      title="Accept invitation"
                    >
                      {acceptMutation.isPending ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Check className="h-3.5 w-3.5" />
                      )}
                      Accept
                    </button>

                    <button
                      onClick={() => handleCancel(invitation.id)}
                      disabled={withdrawMutation.isPending}
                      className="flex items-center gap-1.5 rounded-xl bg-rose-50 px-3.5 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-900/60 disabled:opacity-50 transition-colors cursor-pointer"
                      title="Withdraw invitation"
                    >
                      {withdrawMutation.isPending ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <X className="h-3.5 w-3.5" />
                      )}
                      Withdraw
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
