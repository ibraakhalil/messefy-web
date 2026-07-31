'use client';

import { CreateMonthForm } from '@/components/dashboard/new-month-form';
import Button from '@/components/ui/button';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';
import { useDeletePeriod, usePeriodsByWorkspace, useUpdatePeriod } from '@/hooks/use-periods';
import { useWorkspace } from '@/providers/workspace-provider';
import type { Period } from '@/types/period';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/format-currency';
import { endOfMonth, format, startOfMonth } from 'date-fns';
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  LoaderCircle,
  Plus,
  RefreshCw,
  Trash2,
  Utensils,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

type DashboardPeriod = Period & {
  totalDeposits?: number;
  totalExpenses?: number;
  totalMeals?: number;
  mealRate?: number;
};

interface PeriodCardProps {
  period: DashboardPeriod;
  canReopen: boolean;
  isUpdating: boolean;
  onStatusChange: (period: DashboardPeriod) => void;
  onDelete: (period: DashboardPeriod) => void;
}

function PeriodCard({ period, canReopen, isUpdating, onStatusChange, onDelete }: PeriodCardProps) {
  const periodDate = new Date(period.year, period.month - 1);
  const deposits = period.totalDeposits ?? 0;
  const expenses = period.totalExpenses ?? 0;
  const isOpen = period.status === 'open';
  const periodName = format(periodDate, 'MMMM yyyy');

  return (
    <article
      className={cn(
        'bg-card-bg hover:bg-secondary-bg/35 tablet:px-5 px-4 py-4 transition-colors',
        isOpen && 'border-l-2 border-l-emerald-500',
      )}
    >
      <div className="laptop:hidden flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-pure-color truncate text-lg font-semibold tracking-tight">
            {periodName}
          </h2>
          <p className="text-subtitle-color mt-1 flex items-center gap-1.5 text-xs">
            <CalendarDays className="size-3.5" aria-hidden="true" />
            <span>
              {format(startOfMonth(periodDate), 'MMM dd')} –{' '}
              {format(endOfMonth(periodDate), 'MMM dd, yyyy')}
            </span>
          </p>
        </div>

        <span
          className={cn(
            'inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
            isOpen
              ? 'motion-safe:animate-pulse bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
              : 'bg-secondary-bg text-subtitle-color',
          )}
        >
          {isOpen ? (
            <CheckCircle2 className="size-3.5" aria-hidden="true" />
          ) : (
            <Clock3 className="size-3.5" aria-hidden="true" />
          )}
          {isOpen ? 'Active' : 'Closed'}
        </span>
      </div>

      <div className="laptop:mt-0 laptop:grid-cols-[minmax(180px,1.5fr)_repeat(3,minmax(80px,1fr))_minmax(220px,auto)] laptop:items-center laptop:gap-4 mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
        <div className="laptop:block hidden min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-pure-color truncate font-semibold">{periodName}</h2>
            <span
              className={cn(
                'inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold',
                isOpen
                  ? 'motion-safe:animate-pulse bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-secondary-bg text-subtitle-color',
              )}
            >
              {isOpen ? (
                <CheckCircle2 className="size-3" aria-hidden="true" />
              ) : (
                <Clock3 className="size-3" aria-hidden="true" />
              )}
              {isOpen ? 'Active' : 'Closed'}
            </span>
          </div>
          <p className="text-subtitle-color mt-1 truncate text-xs">
            {format(startOfMonth(periodDate), 'MMM dd')} –{' '}
            {format(endOfMonth(periodDate), 'MMM dd, yyyy')}
          </p>
        </div>

        <dl className="contents">
          <div>
            <dt className="text-subtitle-color laptop:sr-only text-xs font-medium">Deposits</dt>
            <dd className="laptop:mt-0 mt-1 font-semibold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(deposits)}
            </dd>
          </div>
          <div>
            <dt className="text-subtitle-color laptop:sr-only text-xs font-medium">Expenses</dt>
            <dd className="laptop:mt-0 mt-1 font-semibold text-rose-600 dark:text-rose-400">
              {formatCurrency(expenses)}
            </dd>
          </div>
          <div>
            <dt className="text-subtitle-color laptop:sr-only flex items-center gap-1.5 text-xs font-medium">
              <Utensils className="size-3.5" aria-hidden="true" /> Meals
            </dt>
            <dd className="text-pure-color laptop:mt-0 mt-1 font-semibold">
              {period.totalMeals ?? 0}
              {typeof period.mealRate === 'number' && period.mealRate > 0 ? (
                <span className="text-subtitle-color ml-1 text-xs font-normal">
                  @ {formatCurrency(period.mealRate)}
                </span>
              ) : null}
            </dd>
          </div>
        </dl>

        <div className="border-border-color laptop:col-span-1 laptop:mt-0 laptop:justify-end laptop:border-0 laptop:pt-0 col-span-2 mt-1 flex items-center gap-2 border-t pt-3">
          <Link
            href={`/mess/dashboard/all-months/${period.id}`}
            className="laptop:flex-none inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:outline-none"
            aria-label={`View details for ${periodName}`}
          >
            View
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
          {isOpen || canReopen ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => onStatusChange(period)}
              disabled={isUpdating}
              className="h-9 shrink-0 px-3 text-sm"
              aria-label={`${isOpen ? 'Close' : 'Reopen'} ${periodName}`}
            >
              {isUpdating ? (
                <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
              ) : isOpen ? (
                <Clock3 className="size-4" aria-hidden="true" />
              ) : (
                <RefreshCw className="size-4" aria-hidden="true" />
              )}
              <span>{isOpen ? 'Close' : 'Reopen'}</span>
            </Button>
          ) : null}
          <Button
            type="button"
            variant="ghost"
            onClick={() => onDelete(period)}
            className="h-9 shrink-0 px-2.5 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/40"
            aria-label={`Delete ${periodName}`}
          >
            <Trash2 className="size-4" aria-hidden="true" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </div>
    </article>
  );
}

export default function AllMonthsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [periodToDelete, setPeriodToDelete] = useState<DashboardPeriod | null>(null);
  const { member } = useWorkspace();
  const workspaceId = member?.workspaceId ?? '';
  const { data: periods = [], isLoading: isLoadingPeriods } = usePeriodsByWorkspace(workspaceId);
  const updatePeriodMutation = useUpdatePeriod();
  const deletePeriodMutation = useDeletePeriod();
  const latestPeriod = periods.reduce<DashboardPeriod | null>((latest, candidate) => {
    if (!latest) return candidate;
    return candidate.year * 12 + candidate.month > latest.year * 12 + latest.month
      ? candidate
      : latest;
  }, null);
  const latestPeriodId = latestPeriod?.id ?? null;

  const handleStatusChange = async (period: DashboardPeriod) => {
    if (period.status === 'closed' && period.id !== latestPeriodId) return;

    try {
      await updatePeriodMutation.mutateAsync({
        periodId: period.id,
        data: { status: period.status === 'open' ? 'closed' : 'open' },
      });
    } catch {
      // Mutation feedback is handled by the shared hook.
    }
  };

  const handleDeletePeriod = async () => {
    if (!periodToDelete) return;

    try {
      await deletePeriodMutation.mutateAsync(periodToDelete.id);
      setPeriodToDelete(null);
    } catch {
      // Mutation feedback is handled by the shared hook.
    }
  };

  const handleExport = () => {
    if (periods.length === 0) return;

    const headings = ['Period', 'Status', 'Deposits', 'Expenses', 'Meals', 'Meal rate'];
    const rows = periods.map((period: DashboardPeriod) => {
      const deposits = period.totalDeposits ?? 0;
      const expenses = period.totalExpenses ?? 0;
      return [
        format(new Date(period.year, period.month - 1), 'MMMM yyyy'),
        period.status,
        deposits,
        expenses,
        period.totalMeals ?? 0,
        period.mealRate ?? 0,
      ];
    });
    const csv = [headings, ...rows]
      .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(','))
      .join('\n');
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `periods-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  if (isLoadingPeriods) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6" role="status">
        <div className="text-subtitle-color text-center">
          <LoaderCircle className="mx-auto mb-3 size-8 animate-spin text-emerald-600" />
          <p className="text-sm font-medium">Loading periods…</p>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="border-border-color bg-card-bg w-full max-w-md rounded-2xl border p-8 text-center shadow-sm">
          <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
            <AlertCircle className="size-7" aria-hidden="true" />
          </div>
          <h1 className="text-pure-color text-2xl font-bold">No workspace access</h1>
          <p className="text-subtitle-color mt-2 text-sm leading-6">
            Join a workspace before managing its periods.
          </p>
          <Link
            href="/mess/dashboard"
            className="mt-6 inline-flex font-semibold text-emerald-600 hover:text-emerald-700"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="tablet:px-6 tablet:py-8 mx-auto w-full max-w-7xl space-y-6 px-4 py-6">
      <header className="tablet:flex-row tablet:items-end tablet:justify-between flex flex-col gap-4">
        <div>
          <p className="mb-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            Workspace periods
          </p>
          <h1 className="text-pure-color tablet:text-3xl text-2xl font-bold tracking-tight">
            Period management
          </h1>
          <p className="text-subtitle-color mt-1 text-sm">
            Review balances, update status, or start a new period.
          </p>
        </div>

        <div className="tablet:w-auto flex w-full gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleExport}
            disabled={periods.length === 0}
            className="tablet:flex-none flex-1"
          >
            <Download className="size-4" aria-hidden="true" />
            Export CSV
          </Button>
          <ResponsiveDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <ResponsiveDialog.Trigger asChild>
              <Button type="button" className="tablet:flex-none flex-1">
                <Plus className="size-4" aria-hidden="true" />
                New period
              </Button>
            </ResponsiveDialog.Trigger>
            <ResponsiveDialog.Content>
              <CreateMonthForm />
            </ResponsiveDialog.Content>
          </ResponsiveDialog>
        </div>
      </header>

      {periods.length > 0 ? (
        <section className="border-border-color bg-card-bg overflow-hidden rounded-xl border shadow-sm">
          <div className="border-border-color bg-secondary-bg/70 text-subtitle-color laptop:grid hidden grid-cols-[minmax(180px,1.5fr)_repeat(3,minmax(80px,1fr))_minmax(220px,auto)] gap-4 border-b px-5 py-2.5 text-xs font-semibold tracking-wide uppercase">
            <span>Period</span>
            <span>Deposits</span>
            <span>Expenses</span>
            <span>Meals</span>
            <span className="text-right">Actions</span>
          </div>
          <div className="divide-border-color divide-y">
            {periods.map((period: DashboardPeriod) => (
              <PeriodCard
                key={period.id}
                period={period}
                canReopen={period.id === latestPeriodId}
                isUpdating={
                  updatePeriodMutation.isPending &&
                  updatePeriodMutation.variables?.periodId === period.id
                }
                onStatusChange={handleStatusChange}
                onDelete={setPeriodToDelete}
              />
            ))}
          </div>
        </section>
      ) : (
        <section className="border-border-color bg-card-bg/60 flex min-h-[45vh] items-center justify-center rounded-2xl border border-dashed px-6 py-12">
          <div className="max-w-sm text-center">
            <div className="bg-secondary-bg mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl text-emerald-600">
              <CalendarDays className="size-7" aria-hidden="true" />
            </div>
            <h2 className="text-pure-color text-xl font-semibold">Create your first period</h2>
            <p className="text-subtitle-color mt-2 text-sm leading-6">
              Start tracking deposits, expenses, and meals in one place.
            </p>
            <Button
              type="button"
              onClick={() => setIsCreateDialogOpen(true)}
              className="mx-auto mt-6"
            >
              <Plus className="size-4" aria-hidden="true" />
              Create period
            </Button>
          </div>
        </section>
      )}

      <ResponsiveDialog
        open={periodToDelete !== null}
        onOpenChange={(open) => {
          if (!open && !deletePeriodMutation.isPending) setPeriodToDelete(null);
        }}
      >
        <ResponsiveDialog.Content className="bg-card-bg tablet:max-w-md p-6">
          <ResponsiveDialog.Header>
            <ResponsiveDialog.Title>Delete this period?</ResponsiveDialog.Title>
            <ResponsiveDialog.Description>
              {periodToDelete
                ? `${format(new Date(periodToDelete.year, periodToDelete.month - 1), 'MMMM yyyy')} and all of its records will be permanently removed.`
                : 'This action cannot be undone.'}
            </ResponsiveDialog.Description>
          </ResponsiveDialog.Header>
          <ResponsiveDialog.Footer>
            <ResponsiveDialog.Close>
              <Button type="button" variant="outline" disabled={deletePeriodMutation.isPending}>
                Cancel
              </Button>
            </ResponsiveDialog.Close>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeletePeriod}
              isLoading={deletePeriodMutation.isPending}
            >
              {deletePeriodMutation.isPending ? (
                <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <Trash2 className="size-4" aria-hidden="true" />
              )}
              {deletePeriodMutation.isPending ? 'Deleting…' : 'Delete period'}
            </Button>
          </ResponsiveDialog.Footer>
        </ResponsiveDialog.Content>
      </ResponsiveDialog>
    </div>
  );
}
