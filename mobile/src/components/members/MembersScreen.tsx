import React, { useState, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Share2,
  CalendarCheck,
  Search,
  Shield,
  Utensils,
  Wallet,
  Receipt,
  UserMinus,
  RefreshCw,
  Mail,
  Crown,
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
    <div className="space-y-4 pb-6">
      {/* Overview Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-border-color bg-gradient-to-br from-teal-900 via-slate-900 to-indigo-950 p-5 text-white shadow-lg">
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold text-teal-200">
                সদস্যদের তালিকা ও হিসাব
              </span>
              <span className="rounded-full bg-teal-500/30 px-2 py-0.5 text-[11px] font-medium text-teal-200">
                {periodName}
              </span>
            </div>
            <h1 className="mt-1.5 text-2xl font-black tracking-tight">{workspaceName}</h1>
            <p className="mt-0.5 text-xs text-teal-100/80">
              মোট {toBanglaNumber(combinedMembers.length)} জন সদস্য সক্রিয়
            </p>
          </div>

          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="flex size-9 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 active:scale-95"
              aria-label="রিফ্রেশ করুন"
            >
              <RefreshCw className={cn('size-4', isLoading && 'animate-spin')} />
            </button>
          )}
        </div>

        {/* 4 Stats Cards */}
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <div className="rounded-2xl bg-white/10 p-2.5 backdrop-blur-md">
            <div className="flex items-center gap-1.5 text-teal-200">
              <Users className="size-3.5" />
              <span className="text-[10px] font-medium">মোট মেম্বার</span>
            </div>
            <p className="mt-1 text-base font-bold tabular-nums">
              {toBanglaNumber(combinedMembers.length)} জন
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 p-2.5 backdrop-blur-md">
            <div className="flex items-center gap-1.5 text-teal-200">
              <Utensils className="size-3.5" />
              <span className="text-[10px] font-medium">মোট মিল</span>
            </div>
            <p className="mt-1 text-base font-bold tabular-nums">
              {toBanglaNumber(totalMealsAll)} টি
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 p-2.5 backdrop-blur-md">
            <div className="flex items-center gap-1.5 text-rose-300">
              <Receipt className="size-3.5" />
              <span className="text-[10px] font-medium">মোট ডিউ/বকেয়া</span>
            </div>
            <p className="mt-1 text-base font-bold tabular-nums text-rose-300">
              ৳{toBanglaNumber(Math.round(totalDueAmount).toLocaleString('bn-BD'))}
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 p-2.5 backdrop-blur-md">
            <div className="flex items-center gap-1.5 text-teal-200">
              <Wallet className="size-3.5" />
              <span className="text-[10px] font-medium">মোট জমা</span>
            </div>
            <p className="mt-1 text-base font-bold tabular-nums">
              ৳{toBanglaNumber(Math.round(totalDepositsAll).toLocaleString('bn-BD'))}
            </p>
          </div>
        </div>
      </section>

      {/* Action Row */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Share Invite Code */}
        <button
          onClick={() => setIsShareModalOpen(true)}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-2xl bg-secondary-bg border border-border-color py-2.5 px-3 text-xs font-bold text-pure-color shadow-2xs transition active:scale-95 hover:bg-card-bg"
        >
          <Share2 className="size-3.5 text-primary" />
          <span>মেস কোড শেয়ার</span>
        </button>

        {/* Add Member */}
        {(isManager || isOwner) && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-2xl bg-primary py-2.5 px-3 text-xs font-bold text-white shadow-xs transition active:scale-95 hover:opacity-95"
          >
            <UserPlus className="size-3.5" />
            <span>+ সদস্য যোগ</span>
          </button>
        )}

        {/* Start New Month (Owner only) */}
        {isOwner && (
          <button
            onClick={() => setIsNewMonthModalOpen(true)}
            className="w-full flex items-center justify-center gap-1.5 rounded-2xl bg-indigo-700/80 hover:bg-indigo-700 py-2.5 px-3 text-xs font-bold text-white shadow-xs transition active:scale-95"
          >
            <CalendarCheck className="size-3.5" />
            <span>নতুন মাস শুরু ও পিরিয়ড ক্লোজ</span>
          </button>
        )}
      </div>

      {/* Search & Filter */}
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

        {/* Filter Pills */}
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
            সবাই ({toBanglaNumber(combinedMembers.length)})
          </button>
          <button
            onClick={() => setFilter('due')}
            className={cn(
              'flex-1 rounded-lg py-1.5 text-center text-xs font-semibold transition',
              filter === 'due'
                ? 'bg-card-bg text-rose-600 dark:text-rose-400 shadow-2xs'
                : 'text-subtitle-color hover:text-pure-color'
            )}
          >
            বাকি আছে
          </button>
          <button
            onClick={() => setFilter('surplus')}
            className={cn(
              'flex-1 rounded-lg py-1.5 text-center text-xs font-semibold transition',
              filter === 'surplus'
                ? 'bg-card-bg text-emerald-600 dark:text-emerald-400 shadow-2xs'
                : 'text-subtitle-color hover:text-pure-color'
            )}
          >
            উদ্বৃত্ত আছে
          </button>
        </div>
      </div>

      {/* Member Cards List */}
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
                  'rounded-2xl border p-4 shadow-2xs transition-colors',
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
                        <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-amber-500 text-white">
                          <Crown className="size-2.5" />
                        </span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate text-xs font-bold text-pure-color">
                          {m.name}
                        </p>
                        {m.isMe && (
                          <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/60 px-1.5 py-0.2 text-[9px] font-bold text-emerald-800 dark:text-emerald-300">
                            আপনি
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[10px] text-subtitle-color mt-0.5">
                        <span className="flex items-center gap-0.5">
                          <Shield className="size-2.5" />
                          {m.role === 'owner'
                            ? 'মেস মালিক'
                            : m.role === 'manager'
                            ? 'ম্যানেজার'
                            : 'সদস্য'}
                        </span>
                        {m.email && (
                          <span className="truncate max-w-[140px] flex items-center gap-0.5">
                            <Mail className="size-2.5" />
                            {m.email}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Balance Badge */}
                  <div className="text-right shrink-0">
                    <p
                      className={cn(
                        'text-xs font-extrabold tabular-nums',
                        isDue
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-emerald-700 dark:text-emerald-400'
                      )}
                    >
                      {isDue ? '-' : '+'}৳{toBanglaNumber(Math.abs(Math.round(m.balance)).toLocaleString('bn-BD'))}
                    </p>
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.2 text-[9px] font-semibold inline-block mt-0.5',
                        isDue
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      )}
                    >
                      {isDue ? 'বকেয়া আছে' : 'উদ্বৃত্ত পাবে'}
                    </span>
                  </div>
                </div>

                {/* Metrics 3-Col Grid */}
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl bg-secondary-bg/80 p-2">
                    <p className="text-[10px] text-subtitle-color">মোট মিল</p>
                    <p className="text-xs font-bold text-pure-color tabular-nums mt-0.5">
                      {toBanglaNumber(m.meals)} টি
                    </p>
                  </div>

                  <div className="rounded-xl bg-secondary-bg/80 p-2">
                    <p className="text-[10px] text-subtitle-color">মোট জমা</p>
                    <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 tabular-nums mt-0.5">
                      ৳{toBanglaNumber(Math.round(m.deposits).toLocaleString('bn-BD'))}
                    </p>
                  </div>

                  <div className="rounded-xl bg-secondary-bg/80 p-2">
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
