import React, { useState } from 'react';
import {
  X,
  CalendarCheck,
  Check,
  Loader2,
  AlertCircle,
  UserCheck,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import { getBanglaPeriodName } from '@/lib/period-utils';
import { usePeriodManagement } from '@/hooks/use-period-management';
import type { WorkspaceMember } from '@/types/workspace';

interface StartNewMonthModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  currentPeriodId?: string;
  currentYear: number;
  currentMonth: number;
  members: WorkspaceMember[];
  currentMemberId: string;
  onSuccessToast?: (msg: string) => void;
}

const MONTH_NAMES = [
  'জানুয়ারি (১)',
  'ফেব্রুয়ারি (২)',
  'মার্চ (৩)',
  'এপ্রিল (৪)',
  'মে (৫)',
  'জুন (৬)',
  'জুলাই (৭)',
  'আগস্ট (৮)',
  'সেপ্টেম্বর (৯)',
  'অক্টোবর (১০)',
  'নভেম্বর (১১)',
  'ডিসেম্বর (১২)',
];

export const StartNewMonthModal: React.FC<StartNewMonthModalProps> = ({
  isOpen,
  onClose,
  workspaceId,
  currentPeriodId,
  currentYear,
  currentMonth,
  members,
  currentMemberId,
  onSuccessToast,
}) => {
  // Suggest next month
  const defaultNextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
  const defaultNextYear = currentMonth === 12 ? currentYear + 1 : currentYear;

  const [year, setYear] = useState<number>(defaultNextYear);
  const [month, setMonth] = useState<number>(defaultNextMonth);
  const [managerId, setManagerId] = useState<string>(currentMemberId);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { createPeriod, updateStatus, isCreating, isUpdatingStatus } = usePeriodManagement();

  if (!isOpen) return null;

  const isSubmitting = isCreating || isUpdatingStatus;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!managerId) {
      setErrorMsg('অনুগ্রহ করে নতুন মাসের জন্য ম্যানেজার নির্বাচন করুন');
      return;
    }

    try {
      // 1. If there's an open current period, close it first
      if (currentPeriodId && currentPeriodId !== 'none') {
        try {
          await updateStatus({
            periodId: currentPeriodId,
            status: 'closed',
          });
        } catch (closeErr) {
          console.warn('Could not close previous period:', closeErr);
        }
      }

      // 2. Create the new period
      await createPeriod({
        workspaceId,
        year,
        month,
        managerId,
      });

      onSuccessToast?.('মাশাআল্লাহ! নতুন মাস সফলভাবে শুরু করা হয়েছে');
      onClose();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'নতুন মাস শুরু করতে সমস্যা হয়েছে');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="flex max-h-[90vh] w-full max-w-md flex-col rounded-t-3xl sm:rounded-3xl border border-border-color bg-card-bg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-color px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <CalendarCheck className="size-4.5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-pure-color">নতুন মাস শুরু করুন</h3>
              <p className="text-xs text-subtitle-color">পিরিয়ড সাইকেল ও হিসাব ক্লোজ</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-full bg-secondary-bg text-subtitle-color hover:text-pure-color transition active:scale-95"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {errorMsg && (
            <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300">
              <AlertCircle className="size-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Warning Banner */}
          <div className="flex items-start gap-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 p-3.5 text-xs text-amber-900 dark:text-amber-200">
            <AlertTriangle className="size-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div>
              <p className="font-bold">চলতি মাস ক্লোজ হবে</p>
              <p className="text-[11px] opacity-80 mt-0.5 leading-relaxed">
                নতুন মাস চালু করলে চলতি মাসের ({getBanglaPeriodName(currentYear, currentMonth)}) যাবতীয় বাজার ও মিল হিসাব ক্লোজ হবে।
              </p>
            </div>
          </div>

          {/* Month & Year Selection */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-pure-color flex items-center gap-1">
                <Calendar className="size-3 text-subtitle-color" />
                <span>মাস নির্বাচন</span>
              </label>
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="w-full rounded-xl border border-border-color bg-secondary-bg px-3 py-2.5 text-xs font-medium text-pure-color focus:border-primary focus:outline-hidden"
              >
                {MONTH_NAMES.map((name, idx) => (
                  <option key={idx + 1} value={idx + 1}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-pure-color">বছর</label>
              <input
                type="number"
                min="2024"
                max="2035"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full rounded-xl border border-border-color bg-secondary-bg px-3 py-2.5 text-xs font-bold text-pure-color focus:border-primary focus:outline-hidden tabular-nums"
                required
              />
            </div>
          </div>

          {/* Manager Assignment */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-pure-color flex items-center gap-1.5">
              <UserCheck className="size-3.5 text-subtitle-color" />
              <span>নতুন মাসের দায়িত্বপ্রাপ্ত ম্যানেজার</span>
            </label>
            <select
              value={managerId}
              onChange={(e) => setManagerId(e.target.value)}
              className="w-full rounded-xl border border-border-color bg-secondary-bg px-3 py-2.5 text-xs font-medium text-pure-color focus:border-primary focus:outline-hidden"
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.user?.name || m.name || 'সদস্য'} ({m.role === 'owner' ? 'মালিক' : 'সদস্য'})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-subtitle-color pt-0.5">
              নির্বাচিত সদস্য নতুন মাসের মিল ও বাজার হিসাব পরিচালনার ম্যানেজার পারমিশন পাবেন।
            </p>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-bold text-white shadow-md transition active:scale-98 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>নতুন মাস শুরু হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Check className="size-4" />
                  <span>নতুন মাস শুরু নিশ্চিত করুন</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
