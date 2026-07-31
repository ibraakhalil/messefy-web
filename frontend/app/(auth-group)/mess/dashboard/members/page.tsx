'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { MoreHorizontal, Search, Shield, UserCheck, UserMinus, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import AddMemberForm from '@/components/dashboard/add-member-from';
import Button from '@/components/ui/button';
import { DropdownMenu } from '@/components/ui/drop-down';
import FormInput from '@/components/ui/form-input';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';
import {
  getAllWorkspaceMembers,
  removeWorkspaceMember as removeMemberFromWorkspace,
} from '@/lib/member-request';
import { useWorkspace } from '@/providers/workspace-provider';
import { Member } from '@/types/workspace';

const roleFilterOptions = [
  { value: 'All', label: 'All roles' },
  { value: 'owner', label: 'Owner' },
  { value: 'manager', label: 'Manager' },
  { value: 'member', label: 'Member' },
] as const;

function getRoleBadgeColor(role: string) {
  switch (role) {
    case 'owner':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-200';
    case 'manager':
      return 'bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-200';
    case 'member':
      return 'bg-slate-100 text-slate-700 dark:bg-slate-700/60 dark:text-slate-200';
    default:
      return 'bg-slate-100 text-slate-700 dark:bg-slate-700/60 dark:text-slate-200';
  }
}

function getMemberTypeBadgeColor(isOffline: boolean) {
  return isOffline
    ? 'bg-orange-100 text-orange-800 dark:bg-orange-500/15 dark:text-orange-200'
    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-200';
}

function formatRole(role: string) {
  return role.charAt(0).toUpperCase() + role.slice(1);
}

function getMemberName(member: Member) {
  return member.user?.name || member.name || 'Offline member';
}

function getMemberEmail(member: Member) {
  return member.user?.email || 'No email';
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

export default function MembersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'All' | 'owner' | 'manager' | 'member'>('All');
  const queryClient = useQueryClient();
  const currentMember = useWorkspace((state) => state.member);
  const workspace = currentMember?.workspace;
  const workspaceId = workspace?.id || '';
  const isOwner = currentMember?.role === 'owner';

  const {
    data: members = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Member[]>({
    queryKey: ['members', workspaceId],
    queryFn: () => getAllWorkspaceMembers(workspaceId),
    enabled: Boolean(workspaceId),
  });

  const removeMemberMutation = useMutation({
    mutationFn: async (memberToRemove: Member) => {
      if (!workspaceId) {
        throw new Error('Workspace not found');
      }

      return removeMemberFromWorkspace(workspaceId, memberToRemove.id);
    },
    onSuccess: async (_, memberToRemove) => {
      toast.success(`${getMemberName(memberToRemove)} removed from workspace`);
      await queryClient.invalidateQueries({ queryKey: ['members', workspaceId] });
    },
    onError: (mutationError: unknown) => {
      const message =
        mutationError instanceof AxiosError
          ? mutationError.response?.data?.error || 'Failed to remove member'
          : 'Failed to remove member';

      toast.error(message);
    },
  });

  const filteredMembers = members.filter((memberItem) => {
    const memberName = getMemberName(memberItem);
    const memberEmail = getMemberEmail(memberItem);
    const searchValue = searchTerm.toLowerCase();
    const matchesSearch =
      memberName.toLowerCase().includes(searchValue) ||
      memberEmail.toLowerCase().includes(searchValue);
    const matchesRole = roleFilter === 'All' || memberItem.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const totalMembers = members.length;
  const onlineMembers = members.filter((memberItem) => !memberItem.isOffline).length;
  const offlineMembers = totalMembers - onlineMembers;
  const managerCount = members.filter((memberItem) => memberItem.role === 'manager').length;

  const handleRemoveMember = (memberToRemove: Member) => {
    const memberName = getMemberName(memberToRemove);
    const confirmed = window.confirm(
      `Remove ${memberName} from ${workspace?.name || 'this workspace'}?`,
    );

    if (!confirmed) {
      return;
    }

    removeMemberMutation.mutate(memberToRemove);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-4 p-4 tablet:p-6">
      <div className="flex flex-col gap-4 laptop:flex-row laptop:items-center laptop:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200">
            <Users className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Members</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              A simple view of everyone in your workspace.
            </p>
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                {totalMembers} total
              </span>
              <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                {onlineMembers} online
              </span>
              <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                {offlineMembers} offline
              </span>
              <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                {managerCount} managers
              </span>
            </div>
          </div>
        </div>

        {isOwner && (
          <ResponsiveDialog>
            <ResponsiveDialog.Trigger>
              <Button className="w-full tablet:w-auto">Add Member</Button>
            </ResponsiveDialog.Trigger>
            <ResponsiveDialog.Content>
              <AddMemberForm onSuccess={() => refetch()} />
            </ResponsiveDialog.Content>
          </ResponsiveDialog>
        )}
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm laptop:flex-row laptop:items-center laptop:justify-between dark:border-gray-700 dark:bg-gray-800">
        <div className="w-full laptop:max-w-md">
          <FormInput
            type="text"
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="h-4 w-4 text-gray-400" />}
          />
        </div>

        <div className="flex flex-col gap-3 tablet:flex-row tablet:items-center">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as typeof roleFilter)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-emerald-500 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200"
          >
            {roleFilterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-600 dark:bg-gray-900 dark:text-gray-300">
            <Shield className="h-4 w-4" />
            {isOwner ? 'Owner controls enabled' : 'Only owners can remove members'}
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-500/30 dark:bg-red-500/10">
          <p className="text-sm text-red-700 dark:text-red-200">
            Failed to load members. Please try again.
          </p>
        </div>
      )}

      {isLoading ? (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 py-12 text-center text-sm text-gray-500 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
          Loading members...
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 py-12 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {searchTerm || roleFilter !== 'All'
              ? 'No members found for the current filters.'
              : 'No members available yet.'}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
            <div className="flex flex-col gap-1 tablet:flex-row tablet:items-center tablet:justify-between">
              <div>
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Workspace members
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Showing {filteredMembers.length} of {totalMembers} members
                </p>
              </div>
            </div>
          </div>

          <div className="hidden grid-cols-[minmax(0,2fr)_auto_auto_auto] gap-3 border-b border-gray-200 bg-gray-50 px-4 py-2 text-[11px] font-semibold tracking-[0.18em] text-gray-500 uppercase tablet:grid dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
            <span>Member</span>
            <span>Role</span>
            <span>Type</span>
            <span className="text-right">More</span>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredMembers.map((workspaceMember) => {
              const memberName = getMemberName(workspaceMember);
              const memberEmail = getMemberEmail(workspaceMember);
              const initials = getInitials(memberName);
              const isCurrentMember = workspaceMember.id === currentMember?.id;
              const canRemove =
                isOwner &&
                workspaceMember.role !== 'owner' &&
                workspaceMember.id !== currentMember?.id;
              const isRemoving =
                removeMemberMutation.isPending &&
                removeMemberMutation.variables?.id === workspaceMember.id;

              return (
                <div
                  key={workspaceMember.id}
                  className="grid gap-3 px-4 py-3 tablet:grid-cols-[minmax(0,2fr)_auto_auto_auto] tablet:items-center"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                      {initials || 'M'}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                          {memberName}
                        </p>
                        {isCurrentMember && (
                          <span className="inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200">
                            You
                          </span>
                        )}
                      </div>
                      <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                        {memberEmail}
                      </p>
                    </div>
                  </div>

                  <div className="tablet:justify-self-start">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getRoleBadgeColor(
                        workspaceMember.role,
                      )}`}
                    >
                      {formatRole(workspaceMember.role)}
                    </span>
                  </div>

                  <div className="tablet:justify-self-start">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${getMemberTypeBadgeColor(
                        workspaceMember.isOffline,
                      )}`}
                    >
                      <UserCheck className="h-3.5 w-3.5" />
                      {workspaceMember.isOffline ? 'Offline' : 'Online'}
                    </span>
                  </div>

                  <div className="flex justify-start tablet:justify-end">
                    {canRemove ? (
                      <DropdownMenu>
                        <DropdownMenu.Trigger asChild>
                          <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                            disabled={isRemoving}
                          >
                            {isRemoving ? (
                              <>
                                <UserMinus className="h-4 w-4" />
                                Removing...
                              </>
                            ) : (
                              <>
                                <MoreHorizontal className="h-4 w-4" />
                                More
                              </>
                            )}
                          </button>
                        </DropdownMenu.Trigger>

                        <DropdownMenu.Content align="end" className="w-44">
                          <DropdownMenu.Item
                            variant="destructive"
                            onSelect={() => handleRemoveMember(workspaceMember)}
                            disabled={isRemoving}
                          >
                            <UserMinus className="h-4 w-4" />
                            Remove
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu>
                    ) : (
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {workspaceMember.role === 'owner' ? 'Owner access' : 'No actions'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
