'use client';

import Button from '@/components/ui/button';
import FormInput from '@/components/ui/form-input';
import { useMembers } from '@/hooks/use-members';
import { deleteWorkspace } from '@/lib/workspace-requests';
import { useWorkspace } from '@/providers/workspace-provider';
import { formatCurrency } from '@/utils/format-currency';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, AlertTriangle, Database, Loader2, Shield, Trash2, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

const deleteMessSchema = z.object({
  messName: z.string().min(1, 'Mess name confirmation is required'),
  password: z.string().min(1, 'Password is required'),
  confirmationText: z.string().refine((val) => val === 'DELETE', {
    message: 'You must type "DELETE" to confirm',
  }),
  dataExport: z.boolean().default(true),
  notifyMembers: z.boolean().default(true),
});

type DeleteMessFormValues = z.infer<typeof deleteMessSchema>;

export default function DeleteMessPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { member } = useWorkspace();
  const workspace = member?.workspace;
  const workspaceId = workspace?.id || '';
  const { data: members = [] } = useMembers(workspaceId);

  const messData = {
    name: workspace?.name || '',
    createdDate: workspace?.createdAt || '',
    totalMembers: members.length,
    totalMonths: 0,
    currentBalance: 0,
    totalTransactions: 0,
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<DeleteMessFormValues>({
    resolver: zodResolver(deleteMessSchema),
    defaultValues: {
      messName: '',
      password: '',
      confirmationText: '' as 'DELETE',
      dataExport: true,
      notifyMembers: true,
    },
  });

  const watchedMessName = watch('messName');
  const watchedConfirmation = watch('confirmationText');

  const isFormValid = watchedMessName === messData.name && watchedConfirmation === 'DELETE';

  const onSubmit = async (data: DeleteMessFormValues) => {
    if (!isFormValid || !workspaceId) return;

    setIsSubmitting(true);
    try {
      await deleteWorkspace(workspaceId, data.password);
      toast.success('Mess deleted successfully');
      router.push('/profile');
    } catch (error) {
      console.error('Error deleting mess:', error);
      const message =
        (error as { response?: { data?: { error?: string } } }).response?.data?.error ||
        'Failed to delete mess';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400">
          <Trash2 className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Delete Mess</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Permanently delete this mess and all associated data, including offline-only members
          </p>
        </div>
      </div>

      {/* Danger Warning */}
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
        <div className="flex items-start gap-4">
          <AlertTriangle className="mt-0.5 h-6 w-6 flex-shrink-0 text-red-600 dark:text-red-400" />
          <div>
            <h3 className="mb-2 text-lg font-semibold text-red-800 dark:text-red-200">
              ⚠️ DANGER ZONE - This action cannot be undone!
            </h3>
            <p className="mb-4 text-red-700 dark:text-red-300">
              Deleting your mess will permanently remove all data including:
            </p>
            <ul className="space-y-1 text-sm text-red-700 dark:text-red-300">
              <li>• All offline member accounts created for this mess</li>
              <li>• Complete transaction history and records</li>
              <li>• Monthly reports and analytics</li>
              <li>• Meal logs and expense tracking</li>
              <li>• Settings and configurations</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Current Mess Overview */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Current Mess Overview
        </h2>

        <div className="tablet:grid-cols-2 laptop:grid-cols-4 grid grid-cols-1 gap-4">
          <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/20">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Mess Name</p>
              <p className="font-semibold text-gray-900 dark:text-white">{messData.name || 'Loading...'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg bg-emerald-50 p-4 dark:bg-emerald-900/20">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Members</p>
              <p className="font-semibold text-gray-900 dark:text-white">{messData.totalMembers}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/20">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Records</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {messData.totalTransactions || 'Pending'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg bg-orange-50 p-4 dark:bg-orange-900/20">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-900/20">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Outstanding Balance</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(messData.currentBalance)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Form */}
      <div className="rounded-xl border-2 border-red-200 bg-white p-8 shadow-sm dark:border-red-800 dark:bg-gray-800">
        <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
          Confirm Mess Deletion
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="messName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Type the mess name "{messData.name}" to confirm *
            </label>
            <FormInput
              id="messName"
              type="text"
              placeholder={messData.name}
              {...register('messName')}
              className={`${errors.messName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''} ${
                watchedMessName === messData.name
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : ''
              }`}
            />
            {errors.messName && (
              <p className="flex items-center gap-1 text-sm text-red-500">
                <AlertCircle className="h-4 w-4" />
                {errors.messName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="confirmationText"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Type "DELETE" to confirm *
            </label>
            <FormInput
              id="confirmationText"
              type="text"
              placeholder="DELETE"
              {...register('confirmationText')}
              className={`${errors.confirmationText ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''} ${
                watchedConfirmation === 'DELETE'
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : ''
              }`}
            />
            {errors.confirmationText && (
              <p className="flex items-center gap-1 text-sm text-red-500">
                <AlertCircle className="h-4 w-4" />
                {errors.confirmationText.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Enter your password *
            </label>
            <FormInput
              id="password"
              type="password"
              placeholder="Your account password"
              {...register('password')}
              className={
                errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
              }
            />
            {errors.password && (
              <p className="flex items-center gap-1 text-sm text-red-500">
                <AlertCircle className="h-4 w-4" />
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Options */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Before deletion</h3>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <input
                  id="dataExport"
                  type="checkbox"
                  {...register('dataExport')}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <label
                    htmlFor="dataExport"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Export all data before deletion
                  </label>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Download a complete backup of all your mess data
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input
                  id="notifyMembers"
                  type="checkbox"
                  {...register('notifyMembers')}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <label
                    htmlFor="notifyMembers"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Notify all members about mess deletion
                  </label>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Send final notification to all members
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Final Warning */}
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
            <h3 className="mb-2 text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Final Warning
            </h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              This action will immediately and permanently delete your mess. All{' '}
              {messData.totalMembers} members will lose access, and {messData.totalTransactions}{' '}
              records will be permanently lost. Offline members created only for this mess will be
              removed as well.
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || !isFormValid}
              className="min-w-[140px] bg-red-600 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete Mess Forever
                </span>
              )}
            </Button>
            <Button type="button" variant="secondary" onClick={() => window.history.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </div>

      {/* Recovery Information */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
        <h3 className="mb-2 text-sm font-medium text-blue-800 dark:text-blue-200">
          Recovery Information
        </h3>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          Once deleted, your mess cannot be recovered. If you need to start a new mess later, you
          will need to create a completely new account and invite members again.
        </p>
      </div>
    </div>
  );
}
