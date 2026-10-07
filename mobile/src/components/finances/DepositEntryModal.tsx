import React, { useState } from 'react';
import {
  X,
  Wallet,
  Check,
  Loader2,
  User,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toBanglaNumber } from '@/lib/period-utils';
import { useCreateDeposit } from '@/hooks/use-finances';
import type { WorkspaceMember } from '@/types/workspace';

interface DepositEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  periodId: string;
  members: WorkspaceMember[];
  currentMemberId: string;
  isManager: boolean;
  onSuccessToast?: (msg: string) => void;
}

const PRESET_AMOUNTS = [500, 1000, 1500, 2000, 3000];

export const DepositEntryModal: React.FC<DepositEntryModalProps> = ({
  isOpen,
  onClose,
  workspaceId,
  periodId,
  members,
  currentMemberId,
  isManager,
  onSuccessToast,
}) => {
  const [selectedMemberId, setSelectedMemberId] = useState<string>(currentMemberId);
  const [amount, setAmount] = useState<string>('1000');
  const [note, setNote] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

  const { mutateAsync: createDeposit, isPending } = useCreateDeposit();

  if (!isOpen) return null;

  const handleAmountPreset = (preset: number) => {
    setAmount(String(preset));
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setFormError('অনুগ্রহ করে সঠিক টাকার পরিমাণ দিন');
      return;
    }

    if (!selectedMemberId) {
      setFormError('অনুগ্রহ করে মেম্বার নির্বাচন করুন');
      return;
    }

    try {
      await createDeposit({
        workspaceId,
        periodId,
        memberId: selectedMemberId,
        amount: numAmount,
        note: note.trim() || undefined,
      });

      onSuccessToast?.('মাশাআল্লাহ! টাকা জমা সফলভাবে সম্পন্ন হয়েছে');
      onClose();
      // Reset form
      setAmount('1000');
      setNote('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'টাকা জমা দিতে সমস্যা হয়েছে';
      setFormError(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-t-3xl sm:rounded-3xl border border-border-color bg-card-bg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-color px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Wallet className="size-4.5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-pure-color">মেসে টাকা জমা দিন</h3>
              <p className="text-xs text-subtitle-color">মেম্বারদের ডিপোজিট হিসাব</p>
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
          {formError && (
            <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300">
              <AlertCircle className="size-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Member Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-pure-color flex items-center gap-1.5">
              <User className="size-3.5 text-subtitle-color" />
              <span>কার হিসাবে জমা হবে?</span>
            </label>

            {isManager && members.length > 0 ? (
              <select
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
                className="w-full rounded-xl border border-border-color bg-secondary-bg px-3.5 py-2.5 text-xs font-medium text-pure-color focus:border-primary focus:outline-hidden"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.user?.name || m.name || 'সদস্য'} ({m.role === 'owner' ? 'মালিক' : m.role === 'manager' ? 'ম্যানেজার' : 'সদস্য'})
                  </option>
                ))}
              </select>
            ) : (
              <div className="rounded-xl border border-border-color bg-secondary-bg px-3.5 py-2.5 text-xs font-semibold text-pure-color">
                {members.find((m) => m.id === currentMemberId)?.user?.name || 'আপনার একাউন্ট'}
              </div>
            )}
          </div>

          {/* Amount Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-pure-color">
              টাকার পরিমাণ (৳)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-subtitle-color">
                ৳
              </span>
              <input
                type="number"
                min="1"
                step="any"
                placeholder="0"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setFormError(null);
                }}
                className="w-full rounded-xl border border-border-color bg-secondary-bg py-2.5 pl-8 pr-3.5 text-base font-bold text-pure-color focus:border-primary focus:outline-hidden tabular-nums"
                required
              />
            </div>

            {/* Quick Amount Presets */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {PRESET_AMOUNTS.map((val) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => handleAmountPreset(val)}
                  className={cn(
                    'rounded-lg px-2.5 py-1 text-xs font-semibold transition active:scale-95',
                    amount === String(val)
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-secondary-bg text-subtitle-color hover:text-pure-color border border-border-color/60'
                  )}
                >
                  +৳{toBanglaNumber(val)}
                </button>
              ))}
            </div>
          </div>

          {/* Note / Memo */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-pure-color flex items-center gap-1.5">
              <FileText className="size-3.5 text-subtitle-color" />
              <span>নোট বা বিবরণ (ঐচ্ছিক)</span>
            </label>
            <input
              type="text"
              placeholder="যেমন: বিকাশে সেন্ট মানি, ক্যাশ দিয়েছি..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full rounded-xl border border-border-color bg-secondary-bg px-3.5 py-2.5 text-xs text-pure-color placeholder:text-subtitle-color focus:border-primary focus:outline-hidden"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3 text-xs font-bold text-white shadow-md transition active:scale-98 disabled:opacity-50 hover:bg-emerald-800"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>জমা হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Check className="size-4" />
                  <span>টাকা জমা নিশ্চিত করুন</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
