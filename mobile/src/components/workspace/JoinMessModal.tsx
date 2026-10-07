import React, { useState } from 'react';
import { X, KeyRound, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useWorkspace } from '@/hooks/use-workspace';

interface JoinMessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const JoinMessModal: React.FC<JoinMessModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { joinWorkspace } = useWorkspace();
  const [workspaceId, setWorkspaceId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      await joinWorkspace(workspaceId.trim());
      setSuccessMessage('ইনভাইটেশন সফলভাবে পাঠানো হয়েছে! মেস ম্যানেজার অনুমোদন দিলে যুক্ত হতে পারবেন।');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('মেসে যুক্ত হতে সমস্যা হচ্ছে। আইডি পুনরায় চেক করুন।');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-t-3xl sm:rounded-3xl border border-border-color bg-card-bg p-6 shadow-2xl safe-bottom">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border-color/60">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <KeyRound className="size-5" />
            </div>
            <h2 className="text-base font-bold text-pure-color">মেসে যুক্ত হন</h2>
          </div>
          <button
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-full bg-secondary-bg text-subtitle-color hover:text-pure-color"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Error / Success Alerts */}
        {errorMessage && (
          <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300">
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-rose-600" />
            <p className="leading-snug">{errorMessage}</p>
          </div>
        )}

        {successMessage && (
          <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
            <p className="leading-snug">{successMessage}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-subtitle-color mb-1">
              মেস আইডি বা ইনভাইটেশন কোড *
            </label>
            <input
              type="text"
              required
              value={workspaceId}
              onChange={(e) => setWorkspaceId(e.target.value)}
              placeholder="যেমন: d290f1ee-6c54-4b01-90e6-d701748f0851"
              className="w-full rounded-xl border border-border-color bg-input-bg px-3.5 py-2.5 text-sm text-pure-color placeholder:text-subtitle-secondary focus:border-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 font-mono text-xs"
            />
            <p className="mt-1 text-[11px] text-subtitle-secondary">
              আপনার মেস ম্যানেজারের কাছ থেকে পাওয়া মেস আইডিটি এখানে পেস্ট করুন।
            </p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || Boolean(successMessage)}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 py-3 text-sm font-semibold text-white shadow-md shadow-blue-700/20 transition active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>অনুরোধ পাঠানো হচ্ছে...</span>
                </>
              ) : (
                <span>যুক্ত হওয়ার অনুরোধ পাঠান</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
