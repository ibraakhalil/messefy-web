import React, { useState } from 'react';
import {
  X,
  Receipt,
  Check,
  Loader2,
  FileText,
  AlertCircle,
  Tag,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toBanglaNumber } from '@/lib/period-utils';
import { useCreateExpense } from '@/hooks/use-finances';

interface ExpenseEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  periodId: string;
  onSuccessToast?: (msg: string) => void;
}

const COMMON_EXPENSE_TAGS = [
  'শাকসবজি ও মাছ',
  'মুরগি ও ডিম',
  'চাল ও ডাল',
  'তেল ও মসলা',
  'গ্যাস সিলিন্ডার',
  'খালা বিল',
  'মসলা ও পেঁয়াজ',
  'নাস্তা ও চা',
];

const PRESET_AMOUNTS = [100, 200, 500, 1000, 2000];

export const ExpenseEntryModal: React.FC<ExpenseEntryModalProps> = ({
  isOpen,
  onClose,
  workspaceId,
  periodId,
  onSuccessToast,
}) => {
  const [title, setTitle] = useState<string>('');
  const [amount, setAmount] = useState<string>('300');
  const [note, setNote] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

  const { mutateAsync: createExpense, isPending } = useCreateExpense();

  if (!isOpen) return null;

  const handleAmountPreset = (preset: number) => {
    setAmount(String(preset));
    setFormError(null);
  };

  const handleTagClick = (tag: string) => {
    setTitle(tag);
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setFormError('অনুগ্রহ করে খরচের নাম বা বিবরণ দিন');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setFormError('অনুগ্রহ করে সঠিক খরচের পরিমাণ দিন');
      return;
    }

    try {
      await createExpense({
        workspaceId,
        periodId,
        title: cleanTitle,
        amount: numAmount,
        note: note.trim() || undefined,
        allocationType: 'by_meals',
      });

      onSuccessToast?.('মাশাআল্লাহ! বাজার খরচ সফলভাবে সংরক্ষণ করা হয়েছে');
      onClose();
      // Reset form
      setTitle('');
      setAmount('300');
      setNote('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'খরচ সংরক্ষণ করতে সমস্যা হয়েছে';
      setFormError(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-t-3xl sm:rounded-3xl border border-border-color bg-card-bg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-color px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
              <Receipt className="size-4.5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-pure-color">মেসের বাজার খরচ যোগ করুন</h3>
              <p className="text-xs text-subtitle-color">দৈনিক বাজার ও আনুষঙ্গিক খরচ</p>
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

          {/* Title Input & Common Tags */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-pure-color flex items-center gap-1.5">
              <Tag className="size-3.5 text-subtitle-color" />
              <span>খরচের নাম / বিবরণ</span>
            </label>
            <input
              type="text"
              placeholder="যেমন: শাকসবজি ও মাছ, গ্যাস সিলিন্ডার..."
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setFormError(null);
              }}
              className="w-full rounded-xl border border-border-color bg-secondary-bg px-3.5 py-2.5 text-xs text-pure-color placeholder:text-subtitle-color focus:border-primary focus:outline-hidden"
              required
            />

            {/* Quick Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              {COMMON_EXPENSE_TAGS.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={cn(
                    'rounded-lg px-2.5 py-1 text-[11px] font-semibold transition active:scale-95',
                    title === tag
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'bg-secondary-bg text-subtitle-color hover:text-pure-color border border-border-color/60'
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
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
                      ? 'bg-orange-600 text-white shadow-xs'
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
              <span>নোট বা মন্তব্য (ঐচ্ছিক)</span>
            </label>
            <input
              type="text"
              placeholder="যেমন: রশিদ আছে, কারওয়ান বাজার থেকে ক্রয়..."
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
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 py-3 text-xs font-bold text-white shadow-md transition active:scale-98 disabled:opacity-50 hover:bg-orange-700"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>সংরক্ষণ হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Check className="size-4" />
                  <span>বাজার খরচ নিশ্চিত করুন</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
