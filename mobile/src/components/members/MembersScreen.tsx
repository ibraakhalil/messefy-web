import React, { useState, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Share2,
  CalendarCheck,
  Search,
  UserMinus,
  Crown,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toBanglaNumber } from '@/lib/period-utils';
import { useMemberActions } from '@/hooks/use-member-actions';
import { toast } from 'sonner';
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
      const mealCost = summaryInfo?.due ?? 0;
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

  // Filtered members (by search query)
  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) return combinedMembers;

    const q = searchQuery.toLowerCase().trim();
    return combinedMembers.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q)
    );
  }, [combinedMembers, searchQuery]);

  const handleRemoveMember = async (targetMemberId: string, memberName: string) => {
    const confirmed = window.confirm(
      `আপনি কি "${memberName}"-কে মেস থেকে রিমুভ করতে নিশ্চিত?`
    );
    if (!confirmed) return;

    try {
      await removeMember({ memberId: targetMemberId });
      toast.success('সদস্যকে মেস থেকে রিমুভ করা হয়েছে');
      onSuccessToast?.('সদস্যকে মেস থেকে রিমুভ করা হয়েছে');
    } catch (err: unknown) {
      console.error('Failed to remove member:', err);
      toast.error('সদস্য রিমুভ করতে সমস্যা হয়েছে');
    }
  };

  return (
    <div className="space-y-3.5 pb-6">
      {/* 1. Action Row */}
      {/* 1. Action Row (Compact & consistent) */}
      <div className="flex items-center gap-2">
        {/* Share Invite Code */}
        <button
          type="button"
          onClick={() => setIsShareModalOpen(true)}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-border-color bg-card-bg py-2 px-3 text-xs font-semibold text-pure-color transition active:scale-95 hover:bg-secondary-bg"
        >
          <Share2 className="size-3.5 text-primary" />
          <span>মেস কোড</span>
        </button>

        {/* Add Member */}
        {(isManager || isOwner) && (
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-border-color bg-card-bg py-2 px-3 text-xs font-semibold text-pure-color transition active:scale-95 hover:bg-secondary-bg"
          >
            <UserPlus className="size-3.5 text-primary" />
            <span>সদস্য যোগ</span>
          </button>
        )}

        {/* Start New Month (Compact icon/text button if owner) */}
        {isOwner && (
          <button
            type="button"
            onClick={() => setIsNewMonthModalOpen(true)}
            title="নতুন মাস শুরু ও পিরিয়ড ক্লোজ করুন"
            className="flex items-center justify-center gap-1.5 rounded-xl border border-border-color bg-card-bg py-2 px-3 text-xs font-semibold text-pure-color transition active:scale-95 hover:bg-secondary-bg"
          >
            <CalendarCheck className="size-3.5 text-indigo-500" />
            <span className="hidden sm:inline">নতুন মাস</span>
          </button>
        )}
      </div>

      {/* 2. Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 size-3.5 -translate-y-1/2 text-subtitle-color" />
        <input
          type="text"
          placeholder="সদস্যের নাম বা ইমেইল খুঁজুন..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-border-color bg-card-bg py-2 pl-9 pr-3 text-xs text-pure-color placeholder:text-subtitle-color focus:border-primary focus:outline-hidden"
        />
      </div>

      {/* 3. Member Cards List (Compact & Simplified) */}
      <section className="space-y-2">
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 rounded-xl border border-border-color bg-card-bg p-3 animate-pulse"
              />
            ))}
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="rounded-xl border border-border-color bg-card-bg p-6 text-center">
            <Users className="mx-auto size-7 text-subtitle-color opacity-50" />
            <p className="mt-1.5 text-xs font-medium text-subtitle-color">কোনো সদস্য পাওয়া যায়নি</p>
          </div>
        ) : (
          filteredMembers.map((m) => {
            const isDue = m.balance < 0;

            return (
              <article
                key={m.id}
                className="rounded-xl border border-border-color bg-card-bg p-3 shadow-2xs transition-colors"
              >
                {/* Header: Avatar, Name/Role, Balance */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary-bg text-xs font-bold text-pure-color">
                      {m.name.charAt(0) || 'M'}
                      {m.role === 'owner' && (
                        <Crown className="absolute -top-1 -right-1 size-3 text-amber-500 fill-amber-500" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate text-xs font-bold text-pure-color leading-normal">
                          {m.name}
                        </p>
                        {m.isMe && (
                          <span className="rounded bg-secondary-bg px-1 py-0.2 text-[9px] font-semibold text-subtitle-color">
                            আপনি
                          </span>
                        )}
                        {m.role !== 'member' && (
                          <span className="rounded bg-amber-500/10 px-1 py-0.2 text-[9px] font-semibold text-amber-600 dark:text-amber-400">
                            {m.role === 'owner' ? 'মালিক' : 'ম্যানেজার'}
                          </span>
                        )}
                      </div>
                      <p className="truncate text-[10px] text-subtitle-color">
                        {m.email || (m.isOffline ? 'অফলাইন' : 'সদস্য')}
                      </p>
                    </div>
                  </div>

                  {/* Balance Display */}
                  <div className="text-right shrink-0">
                    <p
                      className={cn(
                        'text-xs font-bold tabular-nums',
                        isDue
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-emerald-700 dark:text-emerald-400'
                      )}
                    >
                      {isDue ? '-' : '+'}৳{toBanglaNumber(Math.abs(Math.round(m.balance)).toLocaleString('bn-BD'))}
                    </p>
                    <p className="text-[10px] text-subtitle-color">
                      {isDue ? 'বকেয়া' : 'উদ্বৃত্ত'}
                    </p>
                  </div>
                </div>

                {/* Compact Metrics Row */}
                <div className="mt-2.5 pt-2 border-t border-border-color/50 flex items-center justify-between text-[11px] text-subtitle-color">
                  <div className="flex items-center gap-4">
                    <span>
                      মিল: <strong className="font-semibold text-pure-color tabular-nums">{toBanglaNumber(m.meals)}</strong>
                    </span>
                    <span>
                      জমা: <strong className="font-semibold text-pure-color tabular-nums">৳{toBanglaNumber(Math.round(m.deposits).toLocaleString('bn-BD'))}</strong>
                    </span>
                    <span>
                      খরচ: <strong className="font-semibold text-pure-color tabular-nums">৳{toBanglaNumber(Math.round(m.mealCost).toLocaleString('bn-BD'))}</strong>
                    </span>
                  </div>

                  {/* Owner Remove Action */}
                  {isOwner && !m.isMe && m.role !== 'owner' && (
                    <button
                      onClick={() => handleRemoveMember(m.id, m.name)}
                      disabled={isRemoving}
                      className="text-[11px] text-rose-500 hover:text-rose-600 font-medium transition active:opacity-70"
                    >
                      রিমুভ
                    </button>
                  )}
                </div>
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
