import React from 'react';
import { ArrowDownLeft, Receipt, ChevronRight, Inbox } from 'lucide-react';
import type { MessActivity } from '@/types/mess';
import { formatCurrency, cn } from '@/lib/utils';

interface RecentActivityListProps {
  activities: MessActivity[];
  onViewAll: () => void;
  isLoading?: boolean;
}

export const RecentActivityList: React.FC<RecentActivityListProps> = ({
  activities,
  onViewAll,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-2.5 animate-pulse">
        <div className="h-4 w-36 bg-secondary-bg rounded-md" />
        <div className="h-16 bg-card-bg border border-border-color rounded-xl" />
        <div className="h-16 bg-card-bg border border-border-color rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xs font-semibold text-subtitle-color uppercase tracking-wider">
          সাম্প্রতিক লেনদেন ও খরচ
        </h2>
        {activities.length > 0 && (
          <button
            onClick={onViewAll}
            className="flex items-center text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:underline"
          >
            <span>সব দেখুন</span>
            <ChevronRight className="size-3.5" />
          </button>
        )}
      </div>

      {activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border-color bg-card-bg/50 p-6 text-center">
          <Inbox className="size-7 text-subtitle-secondary mb-1.5 opacity-60" />
          <p className="text-xs font-medium text-subtitle-color">
            এই মাসে এখনও কোনো লেনদেন বা খরচ যোগ করা হয়নি
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {activities.map((item) => {
            const isDeposit = item.type === 'deposit';

            return (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl border border-border-color bg-card-bg p-3 shadow-2xs transition active:bg-secondary-bg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'flex size-9 items-center justify-center rounded-xl',
                      isDeposit
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                    )}
                  >
                    {isDeposit ? (
                      <ArrowDownLeft className="size-4.5" />
                    ) : (
                      <Receipt className="size-4.5" />
                    )}
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-pure-color leading-tight">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-subtitle-color">
                      {item.author} • {item.timeAgo}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p
                    className={cn(
                      'text-xs font-bold',
                      isDeposit
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-600 dark:text-rose-400'
                    )}
                  >
                    {isDeposit ? '+' : '-'} {formatCurrency(item.amount)}
                  </p>
                  <span className="text-[10px] text-subtitle-color capitalize">
                    {isDeposit ? 'জমা' : 'খরচ'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
