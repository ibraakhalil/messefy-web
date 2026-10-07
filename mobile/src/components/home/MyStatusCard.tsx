import React from 'react';
import { Wallet, ArrowUpRight, ArrowDownRight, UserCheck } from 'lucide-react';
import { formatCurrency, cn } from '@/lib/utils';

interface MyStatusCardProps {
  myMeals: number;
  myDeposit: number;
  balance: number;
  role: 'owner' | 'manager' | 'member';
  isLoading?: boolean;
}

export const MyStatusCard: React.FC<MyStatusCardProps> = ({
  myMeals,
  myDeposit,
  balance,
  role,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border-color bg-card-bg p-4.5 shadow-xs animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-4 w-28 bg-secondary-bg rounded-md" />
          <div className="h-5 w-16 bg-secondary-bg rounded-full" />
        </div>
        <div className="mt-3.5 h-16 rounded-xl bg-secondary-bg" />
      </div>
    );
  }

  const isSurplus = balance >= 0;
  const roleName = role === 'owner' ? 'মালিক' : role === 'manager' ? 'ম্যানেজার' : 'সদস্য';

  return (
    <div className="rounded-2xl border border-border-color bg-card-bg p-4.5 shadow-xs transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Wallet className="size-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-pure-color">আমার হিসাব</h2>
            <p className="text-[11px] text-subtitle-color flex items-center gap-1">
              <UserCheck className="size-3 text-emerald-600" />
              <span>{roleName}</span>
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div
          className={cn(
            'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold',
            isSurplus
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40'
              : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800/40'
          )}
        >
          {isSurplus ? (
            <>
              <ArrowUpRight className="size-3.5 text-emerald-600" />
              <span>উদ্বৃত্ত</span>
            </>
          ) : (
            <>
              <ArrowDownRight className="size-3.5 text-rose-600" />
              <span>বকেয়া</span>
            </>
          )}
        </div>
      </div>

      {/* Balance Amount Display */}
      <div className="mt-3.5 flex items-baseline justify-between rounded-xl bg-secondary-bg/80 p-3.5">
        <div>
          <span className="text-xs text-subtitle-color font-medium">বর্তমান ব্যালেন্স</span>
          <p
            className={cn(
              'text-2xl font-extrabold tracking-tight',
              isSurplus ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
            )}
          >
            {formatCurrency(Math.abs(balance))}
          </p>
        </div>
        <div className="text-right text-xs space-y-1">
          <p className="text-subtitle-color">
            মোট জমা: <span className="font-semibold text-pure-color">{formatCurrency(myDeposit)}</span>
          </p>
          <p className="text-subtitle-color">
            আমার মিল: <span className="font-semibold text-pure-color">{myMeals} টি</span>
          </p>
        </div>
      </div>
    </div>
  );
};
