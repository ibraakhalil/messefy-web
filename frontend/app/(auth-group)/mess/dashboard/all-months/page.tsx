/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import Button from '@/components/ui/button';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';
import {
  Calendar,
  Download,
  Eye,
  Plus,
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw,
  Trash2,
  BarChart3,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { usePeriodsByWorkspace, useUpdatePeriod, useDeletePeriod } from '@/hooks/use-periods';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { useWorkspace } from '@/providers/workspace-provider';
import { CreateMonthForm } from '@/components/dashboard/new-month-form';

export default function AllMonthsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const { member } = useWorkspace();
  const workspaceId = member?.workspaceId;

  // Period queries
  const {
    data: periods,
    isLoading: isLoadingPeriods,
    refetch: refetchPeriods,
  } = usePeriodsByWorkspace(workspaceId || '');

  // Mutations
  const updatePeriodMutation = useUpdatePeriod();
  const deletePeriodMutation = useDeletePeriod();

  // Form setup

  const handleClosePeriod = async (periodId: string) => {
    try {
      await updatePeriodMutation.mutateAsync({
        periodId,
        data: { status: 'closed' },
      });
      refetchPeriods();
    } catch {
      // Error is handled by the mutation
    }
  };

  const handleReopenPeriod = async (periodId: string) => {
    try {
      await updatePeriodMutation.mutateAsync({
        periodId,
        data: { status: 'open' },
      });
      refetchPeriods();
    } catch {
      // Error is handled by the mutation
    }
  };

  const handleDeletePeriod = async (periodId: string) => {
    if (!confirm('Are you sure you want to delete this period? This action cannot be undone.')) {
      return;
    }

    try {
      await deletePeriodMutation.mutateAsync(periodId);
      refetchPeriods();
    } catch {
      // Error is handled by the mutation
    }
  };

  const handleViewPeriod = (period: any) => {
    setSelectedPeriod(period);
    setIsViewDialogOpen(true);
  };

  if (isLoadingPeriods) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center p-6">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading periods...</p>
        </div>
      </div>
    );
  }

  // No workspace state
  if (!member) {
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
            href="/mess/dashboard"
            className="text-purple-600 hover:text-purple-700 dark:text-purple-400"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="tablet:flex-row tablet:items-center tablet:justify-between flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Period Management</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage all periods for your workspace
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <ResponsiveDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <ResponsiveDialog.Trigger>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Period
              </Button>
            </ResponsiveDialog.Trigger>

            <ResponsiveDialog.Content>
              <CreateMonthForm />
            </ResponsiveDialog.Content>
          </ResponsiveDialog>

          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export All
          </Button>
        </div>
      </div>

      <div className="tablet:grid-cols-2 laptop:grid-cols-3 grid grid-cols-1 gap-4">
        {periods?.map((period: any) => (
          <div
            key={period.id}
            className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {format(new Date(period.year, period.month - 1), 'MMMM yyyy')}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {format(startOfMonth(new Date(period.year, period.month - 1)), 'MMM dd')} -{' '}
                  {format(endOfMonth(new Date(period.year, period.month - 1)), 'MMM dd, yyyy')}
                </p>
              </div>
              <div
                className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                  period.status === 'open'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                }`}
              >
                {period.status === 'open' ? (
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

            {/* Period Stats */}
            <div className="mb-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Deposits:</span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  ${period.totalDeposits || 0}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Expenses:</span>
                <span className="font-medium text-red-600 dark:text-red-400">
                  ${period.totalExpenses || 0}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Balance:</span>
                <span className="font-medium text-purple-600 dark:text-purple-400">
                  ${(period.totalDeposits || 0) - (period.totalExpenses || 0)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Meals:</span>
                <span className="font-medium text-orange-600 dark:text-orange-400">
                  {period.totalMeals || 0}
                </span>
              </div>
              {period.mealRate && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Meal Rate:</span>
                  <span className="font-medium text-orange-600 dark:text-orange-400">
                    ${period.mealRate}
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => handleViewPeriod(period)} className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                View
              </Button>

              {period.status === 'open' ? (
                <Button
                  onClick={() => handleClosePeriod(period.id)}
                  disabled={updatePeriodMutation.isPending}
                  className="flex items-center gap-1"
                >
                  <Clock className="h-3 w-3" />
                  Close
                </Button>
              ) : (
                <Button
                  onClick={() => handleReopenPeriod(period.id)}
                  disabled={updatePeriodMutation.isPending}
                  className="flex items-center gap-1"
                >
                  <RefreshCw className="h-3 w-3" />
                  Reopen
                </Button>
              )}

              <Button
                onClick={() => handleDeletePeriod(period.id)}
                disabled={deletePeriodMutation.isPending}
                className="flex items-center gap-1 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3" />
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {periods?.length === 0 && (
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="w-full max-w-md text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600">
              <Calendar className="h-10 w-10" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
              No Periods Found
            </h3>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              {periods.length === 0
                ? 'Get started by creating your first period.'
                : 'No periods match your current filters.'}
            </p>
            {periods.length === 0 ? (
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="mx-auto flex items-center gap-2"
              >
                <Plus className="size-4" />
                Create First Period
              </Button>
            ) : (
              <Button onClick={() => ''}>Clear Filters</Button>
            )}
          </div>
        </div>
      )}

      {/* View Period Dialog */}
      <ResponsiveDialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <ResponsiveDialog.Content>
          {selectedPeriod && (
            <>
              <ResponsiveDialog.Header>
                <ResponsiveDialog.Title>
                  {format(new Date(selectedPeriod.year, selectedPeriod.month - 1), 'MMMM yyyy')}
                </ResponsiveDialog.Title>
                <ResponsiveDialog.Description>
                  Detailed view of period statistics and information.
                </ResponsiveDialog.Description>
              </ResponsiveDialog.Header>

              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                    <div className="mb-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Period Details
                      </span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Status:</span>
                        <span
                          className={`font-medium ${
                            selectedPeriod.status === 'open'
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          {selectedPeriod.status === 'open' ? 'Active' : 'Closed'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Created:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {format(new Date(selectedPeriod.createdAt), 'MMM dd, yyyy')}
                        </span>
                      </div>
                      {selectedPeriod.closedAt && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Closed:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {format(new Date(selectedPeriod.closedAt), 'MMM dd, yyyy')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                    <div className="mb-2 flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Statistics
                      </span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Deposits:</span>
                        <span className="font-medium text-green-600 dark:text-green-400">
                          ${selectedPeriod.totalDeposits || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Expenses:</span>
                        <span className="font-medium text-red-600 dark:text-red-400">
                          ${selectedPeriod.totalExpenses || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Balance:</span>
                        <span className="font-medium text-purple-600 dark:text-purple-400">
                          $
                          {(selectedPeriod.totalDeposits || 0) -
                            (selectedPeriod.totalExpenses || 0)}
                        </span>
                      </div>
                      {selectedPeriod.mealRate && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Meal Rate:</span>
                          <span className="font-medium text-orange-600 dark:text-orange-400">
                            ${selectedPeriod.mealRate}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <ResponsiveDialog.Footer>
                <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
                <Button
                  onClick={() => {
                    window.location.href = '/mess/dashboard/current-month';
                  }}
                >
                  Go To Current Period
                </Button>
              </ResponsiveDialog.Footer>
            </>
          )}
        </ResponsiveDialog.Content>
      </ResponsiveDialog>
    </div>
  );
}
