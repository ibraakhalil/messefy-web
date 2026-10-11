import React, { useState, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Share2,
  CalendarCheck,
  Search,
  UserMinus,
  RefreshCw,
  Crown,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getBanglaPeriodName, toBanglaNumber } from '@/lib/period-utils';
import { useMemberActions } from '@/hooks/use-member-actions';
import { AddMemberModal } from './AddMemberModal';
import { ShareInviteModal } from './ShareInviteModal';
import { StartNewMonthModal } from './StartNewMonthModal';
import type { WorkspaceMember } from '@/types/workspace';
import type { PeriodMemberSummary } from '@/services/summary-service';

interface MembersScreenProps {
  workspaceId: string;
  workspaceName: string;
  periodId: string;
  periodYear: number;
  periodMonth: number;
  members: WorkspaceMember[];
  summaryMembers: PeriodMemberSummary[];
  currentMemberId: string;
  isOwner: boolean;
  isManager: boolean;
  isLoading?: boolean;
  onRefresh?: () => void;
  onSuccessToast?: (msg: string) => void;
}

type FilterType = 'all' | 'due' | 'surplus';

export const MembersScreen: React.FC<MembersScreenProps> = ({
  workspaceId,
  workspaceName,
  periodId,
  periodYear,
  periodMonth,
  members,
  summaryMembers,
  currentMemberId,
  isOwner,
  isManager,
  isLoading = false,
  onRefresh,
  onSuccessToast,
}) => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isNewMonthModalOpen, setIsNewMonthModalOpen] = useState(false);

  const { removeMember, isRemoving } = useMemberActions(workspaceId);

  // Map summary member data (financials) with workspace members list
  const combinedMembers = useMemo(() => {
    const summaryMap = new Map(summaryMembers.map((sm) => [sm.memberId, sm]));

    return members.map((m) => {
      const summaryInfo = summaryMap.get(m.id);
      const name = m.user?.name || m.name || 'সদস্য';
      const email = m.user?.email || '';
      const meals = summaryInfo?.meals ?? 0;
      const deposits = summaryInfo?.deposits ?? 0;
      const mealCost = summaryInfo?.mealCost ?? 0;
      const balance = summaryInfo?.balance ?? 0;

      return {
        id: m.id,
        userId: m.userId,
        name,
        email,
        role: m.role,
        isOffline: m.isOffline,
        isActive: m.isActive,
        meals,
        deposits,
        mealCost,
        balance,
        isMe: m.id === currentMemberId,
      };
    });
  }, [members, summaryMembers, currentMemberId]);

  // Overall Statistics
  const totalDueAmount = useMemo(() => {
    return combinedMembers
      .filter((m) => m.balance < 0)
      .reduce((sum, m) => sum + Math.abs(m.balance), 0);
  }, [combinedMembers]);

  const totalMealsAll = useMemo(() => {
    return combinedMembers.reduce((sum, m) => sum + m.meals, 0);
  }, [combinedMembers]);

  const totalDepositsAll = useMemo(() => {
    return combinedMembers.reduce((sum, m) => sum + m.deposits, 0);
  }, [combinedMembers]);

  const dueCount = useMemo(() => {
    return combinedMembers.filter((m) => m.balance < 0).length;
  }, [combinedMembers]);

  const surplusCount = useMemo(() => {
    return combinedMembers.filter((m) => m.balance >= 0).length;
  }, [combinedMembers]);

  // Filtered members
  const filteredMembers = useMemo(() => {
    let list = combinedMembers;

    if (filter === 'due') {
      list = list.filter((m) => m.balance < 0);
    } else if (filter === 'surplus') {
      list = list.filter((m) => m.balance >= 0);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.role.toLowerCase().includes(q)
      );
    }

    return list;
  }, [combinedMembers, filter, searchQuery]);

  const handleRemoveMember = async (targetMemberId: string, memberName: string) => {
    const confirmed = window.confirm(
      `আপনি কি "${memberName}"-কে মেস থেকে রিমুভ করতে নিশ্চিত?`
    );
    if (!confirmed) return;

    try {
      await removeMember({ memberId: targetMemberId });
      onSuccessToast?.('সদস্যকে মেস থেকে রিমুভ করা হয়েছে');
    } catch (err: unknown) {
      console.error('Failed to remove member:', err);
      window.alert('সদস্য রিমুভ করতে সমস্যা হয়েছে');
    }
  };

  const periodName = getBanglaPeriodName(periodYear, periodMonth);

  return (
    <div className="space-y-3.5 pb-6">
      {/* 1. Sleek Compact Header & Metric Strip */}
      <section className="rounded-2xl border border-border-color bg-card-bg p-3.5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Users className="size-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-bold text-pure-color">{workspaceName}</h1>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                  {periodName}
                </span>
              </div>
              <p className="text-[11px] text-subtitle-color">
                মোট {toBanglaNumber(combinedMembers.length)} জন সদস্য
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                disabled={isLoading}
                className="flex size-8 items-center justify-center rounded-xl border border-border-color bg-card-bg text-subtitle-color transition hover:text-pure-color active:scale-95"
                aria-label="রিফ্রেশ করুন"
              >
                <RefreshCw className={cn('size-3.5', isLoading && 'animate-spin')} />
              </button>
            )}
          </div>
        </div>

        {/* 4 Compact Stat Chips */}
        <div className="grid grid-cols-4 divide-x divide-border-color/60 rounded-xl bg-surface-alt/70 py-2 text-center">
          <div className="px-1">
            <span className="text-[10px] font-medium text-subtitle-color">সদস্য</span>
            <p className="mt-0.5 text-xs font-black tabular-nums text-pure-color">
              {toBanglaNumber(combinedMembers.length)} জন
            </p>
          </div>

          <div className="px-1">
            <span className="text-[10px] font-medium text-subtitle-color">মোট মিল</span>
            <p className="mt-0.5 text-xs font-black tabular-nums text-pure-color">
              {toBanglaNumber(totalMealsAll)} টি
            </p>
          </div>

          <div className="px-1">
            <span className="text-[10px] font-medium text-subtitle-color">মোট বকেয়া</span>
            <p className="mt-0.5 text-xs font-black tabular-nums text-rose-600 dark:text-rose-400 truncate">
              ৳{toBanglaNumber(Math.round(totalDueAmount).toLocaleString('bn-BD'))}
            </p>
          </div>

          <div className="px-1">
            <span className="text-[10px] font-medium text-subtitle-color">মোট জমা</span>
            <p className="mt-0.5 text-xs font-black tabular-nums text-emerald-700 dark:text-emerald-400 truncate">
              ৳{toBanglaNumber(Math.round(totalDepositsAll).toLocaleString('bn-BD'))}
            </p>
          </div>
        </div>
      </section>

      {/* 2. Action Row */}
      <div className="grid grid-cols-2 gap-2">
        {/* Share Invite Code */}
        <button
          type="button"
          onClick={() => setIsShareModalOpen(true)}
          className="flex items-center justify-center gap-1.5 rounded-2xl border border-border-color bg-card-bg py-2.5 px-3 text-xs font-bold text-pure-color shadow-2xs transition active:scale-95 hover:bg-hover-bg"
        >
          <Share2 className="size-3.5 text-primary" />
          <span>মেস কোড শেয়ার</span>
        </button>

        {/* Add Member */}
        {(isManager || isOwner) && (
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-1.5 rounded-2xl bg-primary py-2.5 px-3 text-xs font-bold text-white shadow-xs transition active:scale-95 hover:opacity-95"
          >
            <UserPlus className="size-3.5" />
            <span>+ সদস্য যোগ</span>
          </button>
        )}
      </div>

      {/* Start New Month (Owner only, subtle & clean banner) */}
      {isOwner && (
        <button
          type="button"
          onClick={() => setIsNewMonthModalOpen(true)}
          className="w-full flex items-center justify-between rounded-2xl border border-indigo-500/20 bg-indigo-50/70 dark:bg-indigo-950/30 px-3.5 py-2.5 text-xs font-semibold text-indigo-900 dark:text-indigo-300 transition active:scale-98 hover:bg-indigo-100/70 dark:hover:bg-indigo-900/40"
        >
          <div className="flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <CalendarCheck className="size-3.5" />
            </div>
            <span>নতুন মাস শুরু ও পিরিয়ড ক্লোজ করুন</span>
          </div>
          <ChevronRight className="size-4 opacity-60" />
        </button>
      )}

      {/* 3. Search & Filter Bar */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 size-3.5 -translate-y-1/2 text-subtitle-color" />
          <input
            type="text"
            placeholder="সদস্যের নাম বা ইমেইল খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-border-color bg-card-bg py-2 pl-9 pr-3 text-xs text-pure-color placeholder:text-subtitle-color focus:border-primary focus:outline-hidden"
          />
        </div>

        {/* Filter Pills with real counts */}
        <div className="flex items-center gap-1.5 rounded-xl bg-surface-alt p-1">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={cn(
              'flex-1 rounded-lg py-1.5 text-center text-xs font-bold transition',
              filter === 'all'
                ? 'bg-card-bg text-pure-color shadow-2xs'
                : 'text-subtitle-color hover:text-pure-color'
            )}
          >
            সবাই ({toBanglaNumber(combinedMembers.length)})
          </button>

          <button
            type="button"
            onClick={() => setFilter('due')}
            className={cn(
              'flex-1 rounded-lg py-1.5 text-center text-xs font-bold transition flex items-center justify-center gap-1',
              filter === 'due'
                ? 'bg-card-bg text-rose-600 dark:text-rose-400 shadow-2xs'
                : 'text-subtitle-color hover:text-pure-color'
            )}
          >
            <span>বাকি আছে</span>
            <span
              className={cn(
                'text-[10px] px-1 rounded-full',
                dueCount > 0 ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 font-extrabold' : ''
              )}
            >
              ({toBanglaNumber(dueCount)})
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFilter('surplus')}
            className={cn(
              'flex-1 rounded-lg py-1.5 text-center text-xs font-bold transition flex items-center justify-center gap-1',
              filter === 'surplus'
                ? 'bg-card-bg text-emerald-700 dark:text-emerald-400 shadow-2xs'
                : 'text-subtitle-color hover:text-pure-color'
            )}
          >
            <span>উদ্বৃত্ত আছে</span>
            <span className="text-[10px]">
              ({toBanglaNumber(surplusCount)})
            </span>
          </button>
        </div>
      </div>

      {/* 4. Member Cards List */}
      <section className="space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-28 rounded-2xl border border-border-color bg-card-bg p-4 animate-pulse"
              />
            ))}
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="rounded-2xl border border-border-color bg-card-bg p-8 text-center">
            <Users className="mx-auto size-8 text-subtitle-color opacity-50" />
            <p className="mt-2 text-xs font-semibold text-pure-color">কোনো সদস্য পাওয়া যায়নি</p>
          </div>
        ) : (
          filteredMembers.map((m) => {
            const isDue = m.balance < 0;

            return (
              <article
                key={m.id}
                className={cn(
                  'rounded-2xl border p-3.5 shadow-2xs transition-colors',
                  m.isMe
                    ? 'border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-950/20'
                    : 'border-border-color bg-card-bg'
                )}
              >
                {/* Member Top Row */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-border-color/50">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative flex size-10 shrink-0 items-center justify-center rounded-2xl bg-secondary-bg text-sm font-black text-pure-color shadow-2xs">
                      {m.name.charAt(0) || 'M'}
                      {m.role === 'owner' && (
                        <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-amber-500 text-white shadow-2xs">
                          <Crown className="size-2.5" />
                        </span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center flex-wrap gap-1.5">
                        <p className="truncate text-xs font-bold text-pure-color">
                          {m.name}
                        </p>
                        {m.isMe && (
                          <span className="rounded-md bg-emerald-500/15 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 dark:text-emerald-400">
                            আপনি
                          </span>
                        )}
                        {m.role !== 'member' && (
                          <span className="rounded-md bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-bold text-amber-700 dark:text-amber-400">
                            {m.role === 'owner' ? 'মালিক' : 'ম্যানেজার'}
                          </span>
                        )}
                      </div>

                      <div className="mt-0.5">
                        {m.email ? (
                          <p className="truncate text-[11px] text-subtitle-color max-w-[170px]">
                            {m.email}
                          </p>
                        ) : (
                          <p className="text-[11px] text-subtitle-color">
                            {m.isOffline ? 'অফলাইন সদস্য' : 'অ্যাক্টিভ সদস্য'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Balance Badge */}
                  <div className="text-right shrink-0">
                    <p
                      className={cn(
                        'text-xs font-black tabular-nums',
                        isDue
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-emerald-700 dark:text-emerald-400'
                      )}
                    >
                      {isDue ? '-' : '+'}৳{toBanglaNumber(Math.abs(Math.round(m.balance)).toLocaleString('bn-BD'))}
                    </p>
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-[9px] font-bold inline-block mt-0.5 border',
                        isDue
                          ? 'border-rose-500/30 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                          : 'border-emerald-500/30 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                      )}
                    >
                      {isDue ? 'বকেয়া আছে' : 'উদ্বৃত্ত পাবে'}
                    </span>
                  </div>
                </div>

                {/* Metrics 3-Col Grid */}
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl bg-surface-alt/70 p-2">
                    <p className="text-[10px] text-subtitle-color">মোট মিল</p>
                    <p className="text-xs font-bold text-pure-color tabular-nums mt-0.5">
                      {toBanglaNumber(m.meals)} টি
                    </p>
                  </div>

                  <div className="rounded-xl bg-surface-alt/70 p-2">
                    <p className="text-[10px] text-subtitle-color">মোট জমা</p>
                    <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 tabular-nums mt-0.5">
                      ৳{toBanglaNumber(Math.round(m.deposits).toLocaleString('bn-BD'))}
                    </p>
                  </div>

                  <div className="rounded-xl bg-surface-alt/70 p-2">
                    <p className="text-[10px] text-subtitle-color">মিল খরচ</p>
                    <p className="text-xs font-bold text-rose-600 dark:text-rose-400 tabular-nums mt-0.5">
                      ৳{toBanglaNumber(Math.round(m.mealCost).toLocaleString('bn-BD'))}
                    </p>
                  </div>
                </div>

                {/* Owner Remove Action */}
                {isOwner && !m.isMe && m.role !== 'owner' && (
                  <div className="mt-2.5 pt-2 border-t border-border-color/40 flex justify-end">
                    <button
                      onClick={() => handleRemoveMember(m.id, m.name)}
                      disabled={isRemoving}
                      className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition active:scale-95"
                    >
                      <UserMinus className="size-3" />
                      <span>মেস থেকে রিমুভ</span>
                    </button>
                  </div>
                )}
              </article>
            );
          })
        )}
      </section>

      {/* Add Member Modal */}
      <AddMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        workspaceId={workspaceId}
        onSuccessToast={onSuccessToast}
      />

      {/* Share Invite Modal */}
      <ShareInviteModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        workspaceName={workspaceName}
        workspaceId={workspaceId}
        onSuccessToast={onSuccessToast}
      />

      {/* Start New Month Modal */}
      <StartNewMonthModal
        isOpen={isNewMonthModalOpen}
        onClose={() => setIsNewMonthModalOpen(false)}
        workspaceId={workspaceId}
        currentPeriodId={periodId}
        currentYear={periodYear}
        currentMonth={periodMonth}
        members={members}
        currentMemberId={currentMemberId}
        onSuccessToast={onSuccessToast}
      />
    </div>
  );
};
