'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
  AlertCircle,
  Ellipsis,
  LoaderCircle,
  Plus,
  Search,
  ShieldCheck,
  UserCheck,
  UserMinus,
  Users,
} from 'lucide-react';
import toast from 'react-hot-toast';
import AddMemberForm from '@/components/dashboard/add-member-from';
import Button from '@/components/ui/button';
import { DropdownMenu } from '@/components/ui/drop-down';
import FormInput from '@/components/ui/form-input';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';
import { memberKeys, useMembers } from '@/hooks/use-members';
import { removeWorkspaceMember as removeMemberFromWorkspace } from '@/lib/member-request';
import { useWorkspace } from '@/providers/workspace-provider';
import type { Member } from '@/types/workspace';
import { cn } from '@/utils/cn';

const roleFilterOptions = [
  { value: 'All', label: 'All roles' },
  { value: 'owner', label: 'Owner' },
  { value: 'manager', label: 'Manager' },
  { value: 'member', label: 'Member' },
] as const;

type RoleFilter = (typeof roleFilterOptions)[number]['value'];

function getRoleBadgeColor(role: string) {
  switch (role) {
    case 'owner':
      return 'bg-amber-100 text-amber-700 ring-1 ring-amber-500/20 ring-inset dark:bg-amber-950 dark:text-amber-300';
    case 'manager':
      return 'bg-sky-100 text-sky-700 ring-1 ring-sky-500/20 ring-inset dark:bg-sky-950 dark:text-sky-300';
    default:
      return 'bg-secondary-bg text-subtitle-color';
  }
}

function getMemberName(member: Member) {
  return member.user?.name || member.name || 'Offline member';
}

function getMemberEmail(member: Member) {
  return member.user?.email || 'No email address';
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

function formatRole(role: string) {
  return role.charAt(0).toUpperCase() + role.slice(1);
}

export default function MembersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('All');
  const queryClient = useQueryClient();
  const currentMember = useWorkspace((state) => state.member);
  const workspace = currentMember?.workspace;
  const workspaceId = workspace?.id ?? '';
  const isOwner = currentMember?.role === 'owner';
  const { data: members = [], isLoading, error, refetch } = useMembers(workspaceId);

  const removeMemberMutation = useMutation({
    mutationFn: async (memberToRemove: Member) => {
      if (!workspaceId) throw new Error('Workspace not found');
      return removeMemberFromWorkspace(workspaceId, memberToRemove.id);
    },
    onSuccess: async (_, memberToRemove) => {
      toast.success(`${getMemberName(memberToRemove)} removed from workspace`);
      await queryClient.invalidateQueries({ queryKey: memberKeys.list(workspaceId) });
    },
    onError: (mutationError: unknown) => {
      const message =
        mutationError instanceof AxiosError
          ? mutationError.response?.data?.error || 'Failed to remove member'
          : 'Failed to remove member';

      toast.error(message);
    },
  });

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const filteredMembers = members.filter((memberItem) => {
    const matchesSearch =
      getMemberName(memberItem).toLowerCase().includes(normalizedSearchTerm) ||
      getMemberEmail(memberItem).toLowerCase().includes(normalizedSearchTerm);
    const matchesRole = roleFilter === 'All' || memberItem.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const totalMembers = members.length;
  const onlineMembers = members.filter((memberItem) => !memberItem.isOffline).length;
  const offlineMembers = totalMembers - onlineMembers;
  const managerCount = members.filter((memberItem) => memberItem.role === 'manager').length;

  const handleRemoveMember = (memberToRemove: Member) => {
    const confirmed = window.confirm(
      `Remove ${getMemberName(memberToRemove)} from ${workspace?.name || 'this workspace'}?`,
    );

    if (confirmed) removeMemberMutation.mutate(memberToRemove);
  };

  return (
    <div className="tablet:px-6 tablet:py-8 mx-auto w-full max-w-7xl space-y-6 px-4 py-6">
      <header className="tablet:flex-row tablet:items-end tablet:justify-between flex flex-col gap-4">
        <div>
          <p className="mb-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            Workspace access
          </p>
          <h1 className="text-pure-color tablet:text-3xl text-2xl font-bold tracking-tight">
            Members
          </h1>
          <p className="text-subtitle-color mt-1 text-sm">
            Manage everyone who can access {workspace?.name || 'this workspace'}.
          </p>
          <p className="text-subtitle-secondary mt-2 text-xs">
            {totalMembers} total · {onlineMembers} online · {offlineMembers} offline ·{' '}
            {managerCount} {managerCount === 1 ? 'manager' : 'managers'}
          </p>
        </div>

        {isOwner ? (
          <ResponsiveDialog>
            <ResponsiveDialog.Trigger asChild>
              <Button type="button" className="tablet:w-auto w-full">
                <Plus className="size-4" aria-hidden="true" />
                Add member
              </Button>
            </ResponsiveDialog.Trigger>
            <ResponsiveDialog.Content>
              <AddMemberForm onSuccess={() => void refetch()} />
            </ResponsiveDialog.Content>
          </ResponsiveDialog>
        ) : null}
      </header>

      {error ? (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          <AlertCircle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold">Could not load members</p>
            <p className="mt-0.5 text-xs opacity-80">Please refresh the page and try again.</p>
          </div>
        </div>
      ) : null}

      <section className="border-border-color bg-card-bg overflow-hidden rounded-xl border shadow-sm">
        <div className="border-border-color tablet:flex-row tablet:items-center tablet:justify-between flex flex-col gap-3 border-b p-4">
          <div className="tablet:max-w-md w-full">
            <FormInput
              id="member-search"
              type="search"
              aria-label="Search members by name or email"
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              icon={<Search className="text-subtitle-secondary size-4" aria-hidden="true" />}
            />
          </div>

          <div className="tablet:w-auto flex w-full items-center gap-2">
            <label htmlFor="member-role-filter" className="sr-only">
              Filter members by role
            </label>
            <select
              id="member-role-filter"
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value as RoleFilter)}
              className="border-border-color bg-card-bg text-pure-color focus:border-primary tablet:flex-none min-h-10 flex-1 rounded-lg border px-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
            >
              {roleFilterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div
              className="bg-secondary-bg text-subtitle-color laptop:flex hidden min-h-10 items-center gap-2 rounded-lg px-3 text-sm"
              title={
                isOwner ? 'You can manage workspace members' : 'Only owners can remove members'
              }
            >
              <ShieldCheck className="size-4" aria-hidden="true" />
              {isOwner ? 'Owner controls' : 'View only'}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div
            className="text-subtitle-color flex min-h-64 items-center justify-center px-6 py-12 text-center"
            role="status"
          >
            <div>
              <LoaderCircle
                className="mx-auto mb-3 size-8 animate-spin text-emerald-600"
                aria-hidden="true"
              />
              <p className="text-sm font-medium">Loading members…</p>
            </div>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="flex min-h-64 items-center justify-center px-6 py-12 text-center">
            <div className="max-w-sm">
              <div className="bg-secondary-bg mx-auto mb-4 flex size-12 items-center justify-center rounded-xl text-emerald-600">
                <Users className="size-6" aria-hidden="true" />
              </div>
              <h2 className="text-pure-color font-semibold">
                {searchTerm || roleFilter !== 'All' ? 'No matching members' : 'No members yet'}
              </h2>
              <p className="text-subtitle-color mt-1 text-sm">
                {searchTerm || roleFilter !== 'All'
                  ? 'Try a different search term or role filter.'
                  : 'Add someone to start building your workspace.'}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="border-border-color bg-secondary-bg/70 text-subtitle-color laptop:grid hidden grid-cols-[minmax(220px,1.6fr)_minmax(90px,0.45fr)_minmax(90px,0.45fr)_48px] gap-4 border-b px-5 py-2.5 text-xs font-semibold tracking-wide uppercase">
              <span>Member</span>
              <span>Role</span>
              <span>Status</span>
              <span className="text-right">Actions</span>
            </div>

            <div className="divide-border-color divide-y">
              {filteredMembers.map((workspaceMember) => {
                const memberName = getMemberName(workspaceMember);
                const memberEmail = getMemberEmail(workspaceMember);
                const isCurrentMember = workspaceMember.id === currentMember?.id;
                const canRemove = isOwner && workspaceMember.role !== 'owner' && !isCurrentMember;
                const isRemoving =
                  removeMemberMutation.isPending &&
                  removeMemberMutation.variables?.id === workspaceMember.id;

                return (
                  <article
                    key={workspaceMember.id}
                    className="hover:bg-secondary-bg/35 laptop:grid-cols-[minmax(220px,1.6fr)_minmax(90px,0.45fr)_minmax(90px,0.45fr)_48px] laptop:items-center tablet:px-5 laptop:gap-4 grid gap-3 px-4 py-4 transition-colors"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="bg-secondary-bg text-pure-color flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
                        {getInitials(memberName) || 'M'}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h2 className="text-pure-color truncate text-sm font-semibold">
                            {memberName}
                          </h2>
                          {isCurrentMember ? (
                            <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                              You
                            </span>
                          ) : null}
                        </div>
                        <p className="text-subtitle-color mt-0.5 truncate text-sm">{memberEmail}</p>
                      </div>
                    </div>

                    <div className="laptop:contents flex items-center justify-between gap-3 pl-[3.25rem]">
                      <span
                        className={cn(
                          'inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-semibold',
                          getRoleBadgeColor(workspaceMember.role),
                        )}
                      >
                        {formatRole(workspaceMember.role)}
                      </span>

                      <span
                        className={cn(
                          'inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
                          workspaceMember.isOffline
                            ? 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
                        )}
                      >
                        <UserCheck className="size-3.5" aria-hidden="true" />
                        {workspaceMember.isOffline ? 'Offline' : 'Online'}
                      </span>

                      <div className="laptop:justify-self-end">
                        {canRemove ? (
                          <DropdownMenu>
                            <DropdownMenu.Trigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                className="size-9 px-0"
                                aria-label={`More actions for ${memberName}`}
                                disabled={isRemoving}
                              >
                                {isRemoving ? (
                                  <LoaderCircle
                                    className="size-4 animate-spin"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <Ellipsis className="size-4" aria-hidden="true" />
                                )}
                              </Button>
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Content align="end" className="w-44">
                              <DropdownMenu.Item
                                variant="destructive"
                                onSelect={() => handleRemoveMember(workspaceMember)}
                                disabled={isRemoving}
                              >
                                <UserMinus className="size-4" aria-hidden="true" />
                                Remove member
                              </DropdownMenu.Item>
                            </DropdownMenu.Content>
                          </DropdownMenu>
                        ) : (
                          <span
                            className="text-subtitle-secondary block size-9 text-center text-xs leading-9"
                            title={
                              workspaceMember.role === 'owner'
                                ? 'Owner access'
                                : 'No actions available'
                            }
                          >
                            —
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
