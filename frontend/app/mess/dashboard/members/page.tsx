'use client';

import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, ChevronDown, Loader2 } from 'lucide-react';
import { z } from 'zod';
import Button from '@/components/ui/button';
import FormInput from '@/components/ui/form-input';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';

const memberSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['Admin', 'Member', 'Viewer']),
});

type MemberFormValues = z.infer<typeof memberSchema>;

export default function MembersPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editingMember, setEditingMember] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'All' | 'Admin' | 'Member' | 'Viewer'>('All');
  const [showAddForm, setShowAddForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'Member',
    },
  });

  const loadMembers = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchMembers();
      setMembers(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch members');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const onSubmit = async (data: MemberFormValues) => {
    setIsSubmitting(true);
    setError(null);
    try {
      if (editingMember) {
        const memberToUpdate = members.find((m) => m.id === editingMember);
        if (memberToUpdate) {
          const updatedMember = await updateMember({ ...memberToUpdate, ...data });
          setMembers((prev) =>
            prev.map((member) => (member.id === editingMember ? updatedMember : member)),
          );
          setEditingMember(null);
        }
      } else {
        const newMember = await addMember(data);
        setMembers((prev) => [...prev, newMember]);
      }
      reset();
      setShowAddForm(false);
    } catch (err) {
      setError(editingMember ? 'Failed to update member' : 'Failed to add member');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (member: Member) => {
    setEditingMember(member.id);
    setValue('name', member.name);
    setValue('email', member.email);
    setValue('role', member.role);
    setShowAddForm(true);
  };

  const handleDelete = async (memberId: string) => {
    if (!confirm('Are you sure you want to delete this member?')) return;

    setIsLoading(true);
    setError(null);
    try {
      await deleteMember(memberId);
      setMembers((prev) => prev.filter((member) => member.id !== memberId));
    } catch (err) {
      setError('Failed to delete member');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    setEditingMember(null);
    setShowAddForm(false);
  };

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Members</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {filteredMembers.length} of {members.length} members
          </span>
          <ResponsiveDialog
            open={showAddForm}
            onOpenChange={(open) => {
              setShowAddForm(open);
              if (!open) {
                handleCancel();
              }
            }}
          >
            <ResponsiveDialog.Trigger>
              <Button className="ml-4">+ Add Member</Button>
            </ResponsiveDialog.Trigger>

            <ResponsiveDialog.Content>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Form Header */}
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {editingMember ? 'Edit Team Member' : 'Add New Team Member'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {editingMember
                      ? 'Update the information below to modify team member details.'
                      : 'Fill in the information below to add a new team member.'}
                  </p>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div className="tablet:space-y-0 tablet:grid tablet:grid-cols-2 tablet:gap-4 space-y-4">
                    {/* Name Field */}
                    <div className="space-y-2">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Full Name
                      </label>
                      <FormInput
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        {...register('name')}
                        className={`w-full transition-colors ${
                          errors.name
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : 'focus:border-blue-500 focus:ring-blue-500'
                        }`}
                      />
                      {errors.name && (
                        <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
                          <AlertCircle className="h-4 w-4" />
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Email Address
                      </label>
                      <FormInput
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        {...register('email')}
                        className={`w-full transition-colors ${
                          errors.email
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : 'focus:border-blue-500 focus:ring-blue-500'
                        }`}
                      />
                      {errors.email && (
                        <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
                          <AlertCircle className="h-4 w-4" />
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Role Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="role"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Role
                    </label>
                    <div className="relative">
                      <select
                        id="role"
                        {...register('role')}
                        className={
                          'border-border-color w-full appearance-none rounded-lg border px-4 py-2.5 pr-10 text-gray-900 transition-colors'
                        }
                      >
                        <option value="Admin">Admin - Full access to all features</option>
                        <option value="Member">Member - Standard access</option>
                        <option value="Viewer">Viewer - Read-only access</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    {errors.role && (
                      <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
                        <AlertCircle className="h-4 w-4" />
                        {errors.role.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <ResponsiveDialog.Close>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleCancel}
                      className="w-full min-w-[120px]"
                    >
                      Cancel
                    </Button>
                  </ResponsiveDialog.Close>
                  <Button type="submit" disabled={isSubmitting} className="w-full min-w-[120px]">
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </span>
                    ) : (
                      <span>{editingMember ? 'Update' : 'Add'} Member</span>
                    )}
                  </Button>
                </div>
              </form>
            </ResponsiveDialog.Content>
          </ResponsiveDialog>
        </div>
      </div>

      {/* Search and Filter Bar */}
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
          className="rounded-md border border-gray-300 px-4 py-2"
        >
          <option value="All">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="Member">Member</option>
          <option value="Viewer">Viewer</option>
        </select>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
          <p className="text-sm text-red-800 dark:text-red-200">Error: {error}</p>
        </div>
      )}

      {/* Members List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500 dark:text-gray-400">Loading members...</div>
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm || roleFilter !== 'All'
              ? 'No members found matching your filters.'
              : 'No members yet. Add your first member above.'}
          </p>
        </div>
      ) : (
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
                <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  Actions
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
                    {member.name}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600 dark:text-gray-300">
                    {member.email}
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
                  <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                    <Button
                      onClick={() => handleEdit(member)}
                      disabled={isLoading}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(member.id)}
                      disabled={isLoading}
                      className="ml-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Delete
                    </Button>
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
