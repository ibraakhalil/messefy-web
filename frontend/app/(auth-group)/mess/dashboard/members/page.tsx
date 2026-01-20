'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/utils/axios';
import { useWorkspace } from '@/providers/workspace-provider';
import { Member } from '@/types/workspace';
import FormInput from '@/components/ui/form-input';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';
import AddMemberForm from '@/components/dashboard/add-member-from';
import Button from '@/components/ui/button';

export default function MembersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'All' | 'Admin' | 'Member' | 'Viewer'>('All');
  const { member } = useWorkspace();
  const workspace = member?.workspace;

  const {
    data: members = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Member[]>({
    queryKey: ['members', workspace?.id],
    queryFn: async () => {
      const { data } = await api.get(`/workspaces/${workspace?.id}/members`);
      return data;
    },
    enabled: !!workspace?.id,
  });

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'Member':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Viewer':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Members</h1>
        <ResponsiveDialog>
          <ResponsiveDialog.Trigger>
            <Button>Add Member</Button>
          </ResponsiveDialog.Trigger>
          <ResponsiveDialog.Content>
            <AddMemberForm onSuccess={() => refetch()} />
          </ResponsiveDialog.Content>
        </ResponsiveDialog>
      </div>

      {/* Search and Filter */}
      <div className="flex justify-between gap-4">
        <FormInput
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-[300px]"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as typeof roleFilter)}
          className="rounded-md border border-gray-300 px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
        >
          <option value="All">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="Member">Member</option>
          <option value="Viewer">Viewer</option>
        </select>
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
          <p className="text-sm text-red-800 dark:text-red-200">
            Failed to load members. Please try again.
          </p>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500 dark:text-gray-400">Loading members...</div>
        </div>
      ) : filteredMembers.length === 0 ? (
        /* Empty State */
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm || roleFilter !== 'All'
              ? 'No members found matching your filters.'
              : 'No members yet.'}
          </p>
        </div>
      ) : (
        /* Members Table */
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  Role
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
              {filteredMembers.map((member) => (
                <tr
                  key={member.id}
                  className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-gray-200">
                    {member.user.name}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600 dark:text-gray-300">
                    {member.user.email}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getRoleBadgeColor(
                        member.role,
                      )}`}
                    >
                      {member.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
