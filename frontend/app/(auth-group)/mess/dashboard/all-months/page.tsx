/* eslint-disable @typescript-eslint/no-explicit-any */

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
  Filter,
  Plus,
  Receipt,
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw,
  Trash2,
  Search,
  BarChart3,
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import {
  usePeriodsByWorkspace,
  useCreatePeriod,
  useUpdatePeriod,
  useDeletePeriod,
} from '@/hooks/use-periods';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { toast } from 'react-hot-toast';
import { useWorkspaceMember } from '@/providers/workspace-provider';

// Form schema for new period
const newPeriodSchema = z.object({
  year: z.number().min(2020).max(2100),
  month: z.number().min(1).max(12),
});

type NewPeriodFormValues = z.infer<typeof newPeriodSchema>;

// Filter schema
const filterSchema = z.object({
  year: z.number().optional(),
  status: z.string().optional(),
  search: z.string().optional(),
});

type FilterFormValues = z.infer<typeof filterSchema>;

export default function AllMonthsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [filters, setFilters] = useState<FilterFormValues>({});
  const { member } = useWorkspaceMember();
  const workspaceId = member?.workspaceId;

  // Period queries
  const {
    data: periods,
    isLoading: isLoadingPeriods,
    refetch: refetchPeriods,
  } = usePeriodsByWorkspace(workspaceId || '');

  // Mutations
  const createPeriodMutation = useCreatePeriod();
  const updatePeriodMutation = useUpdatePeriod();
  const deletePeriodMutation = useDeletePeriod();

  // Form setup
  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    formState: { errors: errorsCreate, isSubmitting: isSubmittingCreate },
    reset: resetCreate,
    setValue: setValueCreate,
  } = useForm<NewPeriodFormValues>({
    resolver: zodResolver(newPeriodSchema),
    defaultValues: {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
    },
  });

  const {
    register: registerFilter,
    handleSubmit: handleSubmitFilter,
    reset: resetFilter,
  } = useForm<FilterFormValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: filters,
  });

  // Set current date as default when create dialog opens
  useEffect(() => {
    if (isCreateDialogOpen) {
      setValueCreate('year', new Date().getFullYear());
      setValueCreate('month', new Date().getMonth() + 1);
    }
  }, [isCreateDialogOpen, setValueCreate]);

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
      resetCreate();
      refetchPeriods();
    } catch {
      // Error is handled by the mutation
    }
  };

  const handleApplyFilters = (data: FilterFormValues) => {
    setFilters(data);
    setIsFilterDialogOpen(false);
  };

  const clearFilters = () => {
    setFilters({});
    resetFilter({});
  };

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

  // Mock period data for demonstration (will be replaced with real data from backend)
  const mockPeriods = [
    {
      id: '1',
      year: 2024,
      month: 1,
      status: 'closed',
      totalDeposits: 1500,
      totalExpenses: 1200,
      totalMeals: 180,
      mealRate: 6.67,
      createdAt: '2024-01-01T00:00:00Z',
      closedAt: '2024-01-31T23:59:59Z',
    },
    {
      id: '2',
      year: 2024,
      month: 2,
      status: 'closed',
      totalDeposits: 1600,
      totalExpenses: 1350,
      totalMeals: 195,
      mealRate: 6.92,
      createdAt: '2024-02-01T00:00:00Z',
      closedAt: '2024-02-29T23:59:59Z',
    },
    {
      id: '3',
      year: 2024,
      month: 3,
      status: 'open',
      totalDeposits: 800,
      totalExpenses: 650,
      totalMeals: 95,
      mealRate: 6.84,
      createdAt: '2024-03-01T00:00:00Z',
      closedAt: null,
    },
  ];

  // Use mock periods when real data is not available
  const displayPeriods = periods || mockPeriods;

  // Mock data for demonstration (will be replaced with real data from backend)
  const mockPeriodStats = {
    totalPeriods: displayPeriods.length,
    activePeriods: displayPeriods.filter((p: any) => p.status === 'open').length,
    closedPeriods: displayPeriods.filter((p: any) => p.status === 'closed').length,
    totalDeposits: displayPeriods.reduce((sum: number, p: any) => sum + (p.totalDeposits || 0), 0),
    totalExpenses: displayPeriods.reduce((sum: number, p: any) => sum + (p.totalExpenses || 0), 0),
  };

  const tabs = [
    { id: 'all', label: 'All Periods', count: mockPeriodStats.totalPeriods },
    { id: 'active', label: 'Active', count: mockPeriodStats.activePeriods },
    { id: 'closed', label: 'Closed', count: mockPeriodStats.closedPeriods },
  ];

  // Filter periods based on active tab and filters
  const filteredPeriods =
    displayPeriods.filter((period: any) => {
      // Tab filtering
      if (activeTab === 'active' && period.status !== 'open') return false;
      if (activeTab === 'closed' && period.status !== 'closed') return false;

      // Search filtering
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const periodName = format(
          new Date(period.year, period.month - 1),
          'MMMM yyyy',
        ).toLowerCase();
        if (!periodName.includes(searchLower)) return false;
      }

      // Year filtering
      if (filters.year && period.year !== filters.year) return false;

      // Status filtering
      if (filters.status && period.status !== filters.status) return false;

      return true;
    }) || [];

  // Sort periods by year and month (newest first)
  const sortedPeriods = [...filteredPeriods].sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });

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
            href="/dashboard"
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
      <div className="flex flex-col gap-4 tablet:flex-row tablet:items-center tablet:justify-between">
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
              <form onSubmit={handleSubmitCreate(handleCreatePeriod)}>
                <ResponsiveDialog.Header>
                  <ResponsiveDialog.Title>Create New Period</ResponsiveDialog.Title>
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
                    {...registerCreate('month', { valueAsNumber: true })}
                    error={errorsCreate.month?.message}
                  />

                  <FormInput
                    label="Year"
                    type="number"
                    min="2020"
                    max="2100"
                    {...registerCreate('year', { valueAsNumber: true })}
                    error={errorsCreate.year?.message}
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
                    disabled={createPeriodMutation.isPending || isSubmittingCreate}
                    className="flex items-center gap-2"
                  >
                    {createPeriodMutation.isPending && (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    )}
                    Create Period
                  </Button>
                </ResponsiveDialog.Footer>
              </form>
            </ResponsiveDialog.Content>
          </ResponsiveDialog>

          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export All
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2 laptop:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Periods</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {mockPeriodStats.totalPeriods}
              </p>
            </div>
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/20">
              <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Periods</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {mockPeriodStats.activePeriods}
              </p>
            </div>
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Deposits</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${mockPeriodStats.totalDeposits}
              </p>
            </div>
            <div className="rounded-full bg-emerald-100 p-3 dark:bg-emerald-900/20">
              <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${mockPeriodStats.totalExpenses}
              </p>
            </div>
            <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/20">
              <Receipt className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Tabs */}
      <div className="flex flex-col gap-4 tablet:flex-row tablet:items-center tablet:justify-between">
        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600 dark:border-purple-400 dark:text-purple-400'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs dark:bg-gray-800">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search periods..."
              value={filters.search || ''}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-10 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <ResponsiveDialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
            <ResponsiveDialog.Trigger>
              <Button className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </ResponsiveDialog.Trigger>

            <ResponsiveDialog.Content>
              <form onSubmit={handleSubmitFilter(handleApplyFilters)}>
                <ResponsiveDialog.Header>
                  <ResponsiveDialog.Title>Filter Periods</ResponsiveDialog.Title>
                  <ResponsiveDialog.Description>
                    Apply filters to find specific periods.
                  </ResponsiveDialog.Description>
                </ResponsiveDialog.Header>

                <div className="space-y-4 py-4">
                  <FormInput
                    label="Year"
                    type="number"
                    min="2020"
                    max="2100"
                    {...registerFilter('year', { valueAsNumber: true })}
                  />

                  <FormSelect
                    options={[
                      { value: '', label: 'All Statuses' },
                      { value: 'open', label: 'Active' },
                      { value: 'closed', label: 'Closed' },
                    ]}
                    label="Status"
                    {...registerFilter('status')}
                  />
                </div>

                <ResponsiveDialog.Footer>
                  <Button type="button" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                  <Button type="submit">Apply Filters</Button>
                </ResponsiveDialog.Footer>
              </form>
            </ResponsiveDialog.Content>
          </ResponsiveDialog>
        </div>
      </div>

      {/* Periods List */}
      <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2 laptop:grid-cols-3">
        {sortedPeriods.map((period: any) => (
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
      {sortedPeriods.length === 0 && (
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="w-full max-w-md text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600">
              <Calendar className="h-10 w-10" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
              No Periods Found
            </h3>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              {displayPeriods.length === 0
                ? 'Get started by creating your first period.'
                : 'No periods match your current filters.'}
            </p>
            {displayPeriods.length === 0 ? (
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Create First Period
              </Button>
            ) : (
              <Button onClick={clearFilters}>Clear Filters</Button>
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
                    // Navigate to detailed view
                    window.location.href = `/dashboard/periods/${selectedPeriod.id}`;
                  }}
                >
                  View Details
                </Button>
              </ResponsiveDialog.Footer>
            </>
          )}
        </ResponsiveDialog.Content>
      </ResponsiveDialog>
    </div>
  );
}
