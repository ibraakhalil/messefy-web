'use client';

import Button from '@/components/ui/button';
import FormInput from '@/components/ui/form-input';
import FormSelect from '@/components/ui/form-select';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';
import {
  Calendar,
  DollarSign,
  Download,
  Eye,
  Plus,
  Receipt,
  TrendingUp,
  Users,
  Utensils,
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import {
  useCurrentPeriod,
  useCreatePeriod,
  useCloseCurrentAndCreateNext,
  useUpdatePeriod,
  useDeletePeriod,
} from '@/hooks/use-periods';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import toast from 'react-hot-toast';
import { useWorkspaceMember } from '@/providers/workspace-provider';

// Form schema for new period
const newPeriodSchema = z.object({
  year: z.number().min(2020).max(2100),
  month: z.number().min(1).max(12),
});

type NewPeriodFormValues = z.infer<typeof newPeriodSchema>;

export default function CurrentMonthPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState(false);
  const { member } = useWorkspaceMember();
  const workspaceId = member?.workspaceId;

  const { data: currentPeriod, refetch: refetchCurrentPeriod } = useCurrentPeriod(
    workspaceId || '',
  );

  // Mutations
  const createPeriodMutation = useCreatePeriod();
  const closeAndCreateNextMutation = useCloseCurrentAndCreateNext();
  const updatePeriodMutation = useUpdatePeriod();
  const deletePeriodMutation = useDeletePeriod();

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<NewPeriodFormValues>({
    resolver: zodResolver(newPeriodSchema),
    defaultValues: {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
    },
  });

  // Set current date as default when dialog opens
  useEffect(() => {
    if (isCreateDialogOpen) {
      setValue('year', new Date().getFullYear());
      setValue('month', new Date().getMonth() + 1);
    }
  }, [isCreateDialogOpen, setValue]);

  const handleCreatePeriod = async (data: NewPeriodFormValues) => {
    if (!workspaceId) {
      toast.error('No workspace selected');
      return;
    }

    try {
      await createPeriodMutation.mutateAsync({
        workspaceId,
        year: data.year,
        month: data.month,
      });

      setIsCreateDialogOpen(false);
      reset();
      refetchCurrentPeriod();
    } catch {
      // Error is handled by the mutation
    }
  };

  const handleCloseAndCreateNext = async () => {
    if (!workspaceId) {
      toast.error('No workspace selected');
      return;
    }

    try {
      await closeAndCreateNextMutation.mutateAsync({ workspaceId });
      setIsCloseDialogOpen(false);
      refetchCurrentPeriod();
    } catch {
      // Error is handled by the mutation
    }
  };

  const handleClosePeriod = async () => {
    if (!currentPeriod) return;

    try {
      await updatePeriodMutation.mutateAsync({
        periodId: currentPeriod.id,
        data: { status: 'closed' },
      });
      refetchCurrentPeriod();
    } catch {
      // Error is handled by the mutation
    }
  };

  const handleDeletePeriod = async () => {
    if (!currentPeriod) return;

    if (!confirm('Are you sure you want to delete this period? This action cannot be undone.')) {
      return;
    }

    try {
      await deletePeriodMutation.mutateAsync(currentPeriod.id);
      refetchCurrentPeriod();
    } catch {
      // Error is handled by the mutation
    }
  };

  // No workspace state
  if (!workspaceId) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400">
            <AlertCircle className="h-10 w-10" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            No Workspace Access
          </h1>
          <p className="mb-8 text-gray-600 dark:text-gray-400">
            You need to be a member of a workspace to access period management.
          </p>
          <Link
            href="/dashboard"
            className="text-purple-600 hover:text-purple-700 dark:text-purple-400"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // No current period state
  if (!currentPeriod) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
            <Calendar className="h-10 w-10" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            No Active Period
          </h1>
          <p className="mb-8 text-gray-600 dark:text-gray-400">
            Start a new period to begin tracking meals, expenses, and member balances.
          </p>

          <ResponsiveDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <ResponsiveDialog.Trigger>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Start New Period
              </Button>
            </ResponsiveDialog.Trigger>

            <ResponsiveDialog.Content>
              <form onSubmit={handleSubmit(handleCreatePeriod)}>
                <ResponsiveDialog.Header>
                  <ResponsiveDialog.Title>Start New Period</ResponsiveDialog.Title>
                  <ResponsiveDialog.Description>
                    Set up a new period for tracking meals and expenses.
                  </ResponsiveDialog.Description>
                </ResponsiveDialog.Header>

                <div className="space-y-4 py-4">
                  <FormSelect
                    options={Array.from({ length: 12 }, (_, i) => ({
                      value: (i + 1).toString(),
                      label: new Date(2000, i, 1).toLocaleString('default', { month: 'long' }),
                    }))}
                    label="Month"
                    {...register('month', { valueAsNumber: true })}
                    error={errors.month?.message}
                  />

                  <FormInput
                    label="Year"
                    type="number"
                    min="2020"
                    max="2100"
                    {...register('year', { valueAsNumber: true })}
                    error={errors.year?.message}
                  />
                </div>

                <ResponsiveDialog.Footer>
                  <Button
                    type="button"
                    onClick={() => setIsCreateDialogOpen(false)}
                    disabled={createPeriodMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createPeriodMutation.isPending || isSubmitting}
                    className="flex items-center gap-2"
                  >
                    {createPeriodMutation.isPending && (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    )}
                    Start Period
                  </Button>
                </ResponsiveDialog.Footer>
              </form>
            </ResponsiveDialog.Content>
          </ResponsiveDialog>
        </div>
      </div>
    );
  }

  // Mock data for demonstration (will be replaced with real data from backend)
  const periodData = {
    currentPeriod: `${format(new Date(currentPeriod.year, currentPeriod.month - 1), 'MMMM yyyy')}`,
    startDate: format(
      startOfMonth(new Date(currentPeriod.year, currentPeriod.month - 1)),
      'yyyy-MM-dd',
    ),
    endDate: format(
      endOfMonth(new Date(currentPeriod.year, currentPeriod.month - 1)),
      'yyyy-MM-dd',
    ),
    daysRemaining: Math.max(
      0,
      Math.ceil((endOfMonth(new Date()).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
    ),
    totalMembers: 8,
    totalDeposits: 4500,
    totalExpenses: 3250,
    totalMeals: 124,
    balance: 1250,
    mealRate: 26.21,
    status: currentPeriod.status,
  };

  // Mock data for demonstration (will be replaced with real data from backend)
  const memberSummary = [
    { name: 'John Doe', meals: 18, deposit: 600, balance: 128.22, status: 'positive' as const },
    { name: 'Jane Smith', meals: 15, deposit: 500, balance: -45.5, status: 'negative' as const },
    { name: 'Mike Johnson', meals: 22, deposit: 700, balance: 89.75, status: 'positive' as const },
  ];

  // Mock data for demonstration (will be replaced with real data from backend)
  const recentTransactions = [
    {
      id: 1,
      description: 'Grocery shopping',
      amount: -125.5,
      date: '2024-01-15',
      category: 'Food',
      type: 'expense' as const,
    },
    {
      id: 2,
      description: 'Monthly deposit',
      amount: 300.0,
      date: '2024-01-10',
      category: 'Deposit',
      type: 'deposit' as const,
    },
    {
      id: 3,
      description: 'Utilities',
      amount: -85.25,
      date: '2024-01-08',
      category: 'Utilities',
      type: 'meal' as const,
    },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'members', label: 'Member Summary', icon: Users },
    { id: 'transactions', label: 'Recent Activity', icon: Receipt },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {periodData.currentPeriod}
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {periodData.startDate} to {periodData.endDate} • {periodData.daysRemaining} days
            remaining
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {currentPeriod.status === 'open' && (
            <>
              <ResponsiveDialog open={isCloseDialogOpen} onOpenChange={setIsCloseDialogOpen}>
                <ResponsiveDialog.Trigger>
                  <Button className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Close & Create Next
                  </Button>
                </ResponsiveDialog.Trigger>

                <ResponsiveDialog.Content>
                  <ResponsiveDialog.Header>
                    <ResponsiveDialog.Title>Close Current Period</ResponsiveDialog.Title>
                    <ResponsiveDialog.Description>
                      This will close the current period and automatically create the next month's
                      period. This action cannot be undone.
                    </ResponsiveDialog.Description>
                  </ResponsiveDialog.Header>

                  <ResponsiveDialog.Footer>
                    <Button
                      type="button"
                      onClick={() => setIsCloseDialogOpen(false)}
                      disabled={closeAndCreateNextMutation.isPending}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCloseAndCreateNext}
                      disabled={closeAndCreateNextMutation.isPending}
                      className="flex items-center gap-2"
                    >
                      {closeAndCreateNextMutation.isPending && (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                      )}
                      Close & Create Next
                    </Button>
                  </ResponsiveDialog.Footer>
                </ResponsiveDialog.Content>
              </ResponsiveDialog>

              <Button
                onClick={handleClosePeriod}
                disabled={updatePeriodMutation.isPending}
                className="flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Close Period
              </Button>

              <Button
                onClick={handleDeletePeriod}
                disabled={deletePeriodMutation.isPending}
                className="flex items-center gap-2 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </>
          )}

          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex items-center gap-2">
        <div
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${
            currentPeriod.status === 'open'
              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
          }`}
        >
          {currentPeriod.status === 'open' ? (
            <>
              <CheckCircle className="h-3 w-3" />
              Active
            </>
          ) : (
            <>
              <Clock className="h-3 w-3" />
              Closed
            </>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Members</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {periodData.totalMembers}
              </p>
            </div>
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/20">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Deposits</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${periodData.totalDeposits}
              </p>
            </div>
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20">
              <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${periodData.totalExpenses}
              </p>
            </div>
            <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/20">
              <Receipt className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Current Balance
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${periodData.balance}
              </p>
            </div>
            <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900/20">
              <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Meal Rate Card */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Meal Rate</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              ${periodData.mealRate}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">per meal</p>
          </div>
          <div className="rounded-full bg-orange-100 p-3 dark:bg-orange-900/20">
            <Utensils className="h-8 w-8 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600 dark:border-purple-400 dark:text-purple-400'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Quick Actions */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link href="/dashboard/meals">
                  <Button className="w-full justify-start">
                    <Utensils className="mr-2 h-4 w-4" />
                    Record Meals
                  </Button>
                </Link>
                <Link href="/dashboard/expenses">
                  <Button className="w-full justify-start">
                    <Receipt className="mr-2 h-4 w-4" />
                    Add Expense
                  </Button>
                </Link>
                <Link href="/dashboard/deposits">
                  <Button className="w-full justify-start">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Record Deposit
                  </Button>
                </Link>
              </div>
            </div>

            {/* Period Info */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Period Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Status:</span>
                  <span
                    className={`font-medium ${
                      currentPeriod.status === 'open'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {currentPeriod.status === 'open' ? 'Active' : 'Closed'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Created:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {format(new Date(currentPeriod.createdAt), 'MMM dd, yyyy')}
                  </span>
                </div>
                {currentPeriod.closedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Closed:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {format(new Date(currentPeriod.closedAt), 'MMM dd, yyyy')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                      Member
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                      Meals
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                      Deposit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                      Balance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                  {memberSummary.map((member) => (
                    <tr key={member.name}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {member.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{member.meals}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          ${member.deposit}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`text-sm font-medium ${
                            member.status === 'positive'
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}
                        >
                          ${Math.abs(member.balance).toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${
                            member.status === 'positive'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                          }`}
                        >
                          {member.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`rounded-full p-2 ${
                        transaction.type === 'expense'
                          ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                          : transaction.type === 'deposit'
                            ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                      }`}
                    >
                      {transaction.type === 'expense' && <Receipt className="h-4 w-4" />}
                      {transaction.type === 'deposit' && <DollarSign className="h-4 w-4" />}
                      {transaction.type === 'meal' && <Utensils className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {transaction.description}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {transaction.date} • {transaction.category}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {transaction.amount && (
                      <p
                        className={`font-medium ${
                          transaction.type === 'expense'
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-green-600 dark:text-green-400'
                        }`}
                      >
                        {transaction.type === 'expense' ? '-' : '+'}${transaction.amount}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
