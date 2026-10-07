import React, { useState, useMemo } from 'react';
import {
  Receipt,
  Wallet,
  TrendingDown,
  TrendingUp,
  Plus,
  Search,
  RefreshCw,
  Trash2,
  DollarSign,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  getBanglaPeriodName,
  formatTimeAgo,
  toBanglaNumber,
} from '@/lib/period-utils';
import {
  useDeposits,
  useExpenses,
  useDeleteDeposit,
  useDeleteExpense,
} from '@/hooks/use-finances';
import { DepositEntryModal } from './DepositEntryModal';
import { ExpenseEntryModal } from './ExpenseEntryModal';
import type { WorkspaceMember } from '@/types/workspace';

interface ExpensesScreenProps {
  workspaceId: string;
  periodId: string;
  periodYear: number;
  periodMonth: number;
  members: WorkspaceMember[];
  currentMemberId: string;
  isManager: boolean;
  mealRate?: number;
  onSuccessToast?: (msg: string) => void;
}

type FilterType = 'all' | 'expenses' | 'deposits';

interface LedgerItem {
  id: string;
  rawId: string;
  type: 'expense' | 'deposit';
  title: string;
  amount: number;
  dateStr: string;
  note: string | null;
  author: string;
  timestamp: number;
}

export const ExpensesScreen: React.FC<ExpensesScreenProps> = ({
  workspaceId,
  periodId,
  periodYear,
  periodMonth,
  members,
  currentMemberId,
  isManager,
  mealRate = 0,
  onSuccessToast,
}) => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  // Queries
  const {
    data: deposits = [],
    isLoading: isLoadingDeposits,
    isRefetching: isRefetchingDeposits,
    refetch: refetchDeposits,
  } = useDeposits(periodId);

  const {
    data: expenses = [],
    isLoading: isLoadingExpenses,
    isRefetching: isRefetchingExpenses,
    refetch: refetchExpenses,
  } = useExpenses(periodId);

  // Mutations
  const { mutateAsync: deleteDeposit } = useDeleteDeposit();
  const { mutateAsync: deleteExpense } = useDeleteExpense();

  const isRefreshing = isRefetchingDeposits || isRefetchingExpenses;
  const isLoading = isLoadingDeposits || isLoadingExpenses;

  const handleRefresh = async () => {
    await Promise.all([refetchDeposits(), refetchExpenses()]);
  };

  // Calculations
  const totalExpenses = useMemo(() => {
    return expenses.reduce((sum, e) => sum + parseFloat(e.amount || '0'), 0);
  }, [expenses]);

  const totalDeposits = useMemo(() => {
    return deposits.reduce((sum, d) => sum + parseFloat(d.amount || '0'), 0);
  }, [deposits]);

  const netFund = totalDeposits - totalExpenses;

  // Build combined ledger
  const allTransactions = useMemo<LedgerItem[]>(() => {
    const depositItems: LedgerItem[] = deposits.map((d) => {
      const memberName = d.member?.user?.name || d.member?.id || 'মেম্বার';
      const time = new Date(d.createdAt).getTime();
      return {
        id: `dep-${d.id}`,
        rawId: d.id,
        type: 'deposit',
        title: `${memberName} (টাকা জমা)`,
        amount: parseFloat(d.amount || '0'),
        dateStr: d.createdAt,
        note: d.note,
        author: memberName,
        timestamp: isNaN(time) ? 0 : time,
      };
    });

    const expenseItems: LedgerItem[] = expenses.map((e) => {
      const time = new Date(e.createdAt).getTime();
      return {
        id: `exp-${e.id}`,
        rawId: e.id,
        type: 'expense',
        title: e.title,
        amount: parseFloat(e.amount || '0'),
        dateStr: e.createdAt,
        note: e.note,
        author: 'বাজার খরচ',
        timestamp: isNaN(time) ? 0 : time,
      };
    });

    return [...depositItems, ...expenseItems].sort(
      (a, b) => b.timestamp - a.timestamp
    );
  }, [deposits, expenses]);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    let list = allTransactions;

    if (filter === 'expenses') {
      list = list.filter((item) => item.type === 'expense');
    } else if (filter === 'deposits') {
      list = list.filter((item) => item.type === 'deposit');
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          (item.note && item.note.toLowerCase().includes(q))
      );
    }

    return list;
  }, [allTransactions, filter, searchQuery]);

  const handleDelete = async (item: LedgerItem) => {
    const confirmDelete = window.confirm(`আপনি কি "${item.title}" মুছে ফেলতে চান?`);
    if (!confirmDelete) return;

    try {
      if (item.type === 'deposit') {
        await deleteDeposit({ depositId: item.rawId, periodId });
        onSuccessToast?.('ডিপোজিট সফলভাবে মুছে ফেলা হয়েছে');
      } else {
        await deleteExpense({ expenseId: item.rawId, periodId });
        onSuccessToast?.('বাজার খরচ সফলভাবে মুছে ফেলা হয়েছে');
      }
    } catch (err: unknown) {
      console.error('Failed to delete transaction:', err);
      window.alert('মুছে ফেলতে সমস্যা হয়েছে');
    }
  };

  const periodName = getBanglaPeriodName(periodYear, periodMonth);

  return (
    <div className="space-y-4 pb-6">
      {/* Financial Overview Card */}
      <section className="relative overflow-hidden rounded-3xl border border-border-color bg-gradient-to-br from-indigo-900 via-slate-900 to-emerald-950 p-5 text-white shadow-lg">
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-200">
                বাজার ও আর্থিক লেজার
              </span>
              <span className="rounded-full bg-indigo-500/30 px-2 py-0.5 text-[11px] font-medium text-indigo-200">
                {periodName}
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-300">মেস ব্যালেন্স ও ক্যাশ ফান্ড</p>
            <h1 className="mt-0.5 text-2xl font-black tracking-tight tabular-nums flex items-baseline gap-1">
              <span>{netFund >= 0 ? '+' : '-'}৳{toBanglaNumber(Math.abs(Math.round(netFund)).toLocaleString('bn-BD'))}</span>
              <span className="text-xs font-semibold text-emerald-300">
                ({netFund >= 0 ? 'ক্যাশ জমা আছে' : 'ঘাটতি আছে'})
              </span>
            </h1>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex size-9 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 active:scale-95"
            aria-label="রিফ্রেশ করুন"
          >
            <RefreshCw className={cn('size-4', isRefreshing && 'animate-spin')} />
          </button>
        </div>

        {/* 3 Stats Overview Tiles */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {/* Total Expenses */}
          <div className="rounded-2xl bg-white/10 p-2.5 backdrop-blur-md">
            <div className="flex items-center gap-1 text-rose-300">
              <TrendingDown className="size-3.5" />
              <span className="text-[10px] font-medium">মোট বাজার</span>
            </div>
            <p className="mt-1 text-sm font-bold tabular-nums">
              ৳{toBanglaNumber(Math.round(totalExpenses).toLocaleString('bn-BD'))}
            </p>
          </div>

          {/* Total Deposits */}
          <div className="rounded-2xl bg-white/10 p-2.5 backdrop-blur-md">
            <div className="flex items-center gap-1 text-emerald-300">
              <TrendingUp className="size-3.5" />
              <span className="text-[10px] font-medium">মোট জমা</span>
            </div>
            <p className="mt-1 text-sm font-bold tabular-nums">
              ৳{toBanglaNumber(Math.round(totalDeposits).toLocaleString('bn-BD'))}
            </p>
          </div>

          {/* Meal Rate */}
          <div className="rounded-2xl bg-white/10 p-2.5 backdrop-blur-md">
            <div className="flex items-center gap-1 text-amber-300">
              <DollarSign className="size-3.5" />
              <span className="text-[10px] font-medium">মিল রেট</span>
            </div>
            <p className="mt-1 text-sm font-bold tabular-nums">
              ৳{toBanglaNumber(mealRate.toFixed(2))}
            </p>
          </div>
        </div>
      </section>

      {/* Action Buttons Row */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={() => setIsExpenseModalOpen(true)}
          className="flex items-center justify-center gap-1.5 rounded-2xl bg-orange-600 py-3 text-xs font-bold text-white shadow-xs transition active:scale-95 hover:bg-orange-700"
        >
          <Plus className="size-4" />
          <span>+ বাজার খরচ</span>
        </button>

        <button
          onClick={() => setIsDepositModalOpen(true)}
          className="flex items-center justify-center gap-1.5 rounded-2xl bg-emerald-700 py-3 text-xs font-bold text-white shadow-xs transition active:scale-95 hover:bg-emerald-800"
        >
          <Plus className="size-4" />
          <span>+ টাকা জমা</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 size-3.5 -translate-y-1/2 text-subtitle-color" />
          <input
            type="text"
            placeholder="খরচ বা মেম্বারের নাম খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-border-color bg-card-bg py-2 pl-9 pr-3 text-xs text-pure-color placeholder:text-subtitle-color focus:border-primary focus:outline-hidden"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 rounded-xl bg-secondary-bg/70 p-1">
          <button
            onClick={() => setFilter('all')}
            className={cn(
              'flex-1 rounded-lg py-1.5 text-center text-xs font-semibold transition',
              filter === 'all'
                ? 'bg-card-bg text-pure-color shadow-2xs'
                : 'text-subtitle-color hover:text-pure-color'
            )}
          >
            সবগুলো ({toBanglaNumber(allTransactions.length)})
          </button>
          <button
            onClick={() => setFilter('expenses')}
            className={cn(
              'flex-1 rounded-lg py-1.5 text-center text-xs font-semibold transition',
              filter === 'expenses'
                ? 'bg-card-bg text-orange-600 dark:text-orange-400 shadow-2xs'
                : 'text-subtitle-color hover:text-pure-color'
            )}
          >
            বাজার খরচ ({toBanglaNumber(expenses.length)})
          </button>
          <button
            onClick={() => setFilter('deposits')}
            className={cn(
              'flex-1 rounded-lg py-1.5 text-center text-xs font-semibold transition',
              filter === 'deposits'
                ? 'bg-card-bg text-emerald-600 dark:text-emerald-400 shadow-2xs'
                : 'text-subtitle-color hover:text-pure-color'
            )}
          >
            টাকা জমা ({toBanglaNumber(deposits.length)})
          </button>
        </div>
      </div>

      {/* Ledger Feed */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-subtitle-color">
            লেনদেন বিবরণী ({toBanglaNumber(filteredTransactions.length)}টি)
          </h2>
        </div>

        {isLoading ? (
          <div className="space-y-2.5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-18 rounded-2xl border border-border-color bg-card-bg p-3.5 animate-pulse"
              />
            ))}
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="rounded-2xl border border-border-color bg-card-bg p-8 text-center">
            <Receipt className="mx-auto size-8 text-subtitle-color opacity-50" />
            <p className="mt-2 text-xs font-semibold text-pure-color">কোনো লেনদেন পাওয়া যায়নি</p>
            <p className="mt-0.5 text-[11px] text-subtitle-color">
              বাজার খরচ বা জমা এন্ট্রি করতে উপরের বাটনগুলো ব্যবহার করুন
            </p>
          </div>
        ) : (
          filteredTransactions.map((item) => {
            const isExpense = item.type === 'expense';

            return (
              <article
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-border-color bg-card-bg p-3.5 shadow-2xs transition active:scale-[0.99]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={cn(
                      'flex size-10 shrink-0 items-center justify-center rounded-xl',
                      isExpense
                        ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400'
                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    )}
                  >
                    {isExpense ? (
                      <Receipt className="size-5" />
                    ) : (
                      <Wallet className="size-5" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-pure-color">
                      {item.title}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-subtitle-color mt-0.5">
                      <span>{formatTimeAgo(item.dateStr)}</span>
                      {item.note && (
                        <span className="truncate max-w-[150px] italic">
                          • {item.note}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-right">
                    <p
                      className={cn(
                        'text-xs font-extrabold tabular-nums',
                        isExpense
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-emerald-700 dark:text-emerald-400'
                      )}
                    >
                      {isExpense ? '-' : '+'}৳{toBanglaNumber(item.amount.toLocaleString('bn-BD'))}
                    </p>
                    <span className="text-[9px] text-subtitle-color uppercase">
                      {isExpense ? 'বাজার খরচ' : 'জমা'}
                    </span>
                  </div>

                  {/* Manager Delete Button */}
                  {isManager && (
                    <button
                      onClick={() => handleDelete(item)}
                      className="flex size-7 items-center justify-center rounded-lg bg-secondary-bg text-subtitle-color hover:text-rose-600 transition active:scale-90"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  )}
                </div>
              </article>
            );
          })
        )}
      </section>

      {/* Deposit Entry Modal */}
      <DepositEntryModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        workspaceId={workspaceId}
        periodId={periodId}
        members={members}
        currentMemberId={currentMemberId}
        isManager={isManager}
        onSuccessToast={onSuccessToast}
      />

      {/* Expense Entry Modal */}
      <ExpenseEntryModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        workspaceId={workspaceId}
        periodId={periodId}
        onSuccessToast={onSuccessToast}
      />
    </div>
  );
};
