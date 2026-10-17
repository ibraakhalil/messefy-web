import React, { useState } from 'react';
import { KeyRound, Loader2, AlertCircle, CheckCircle2, ClipboardPaste } from 'lucide-react';
import { useWorkspace } from '@/hooks/use-workspace';
import { haptics } from '@/lib/haptics';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

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

  const handlePaste = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setWorkspaceId(text.trim());
          haptics.selection();
        }
      }
    } catch {
      // Browser permission denied or not supported
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);
    haptics.impact('light');

    try {
      await joinWorkspace(workspaceId.trim());
      haptics.notification('success');
      setSuccessMessage('ইনভাইটেশন সফলভাবে পাঠানো হয়েছে! মেস ম্যানেজার অনুমোদন দিলে যুক্ত হতে পারবেন।');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (err: unknown) {
      haptics.notification('error');
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent variant="bottom-sheet" className="p-6 pb-[calc(env(safe-area-inset-bottom,0px)+1.5rem)] sm:pb-6">
        {/* Header */}
        <DialogHeader className="pb-3 border-b border-border-color/60 text-left pr-8">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 shrink-0 border border-sky-500/20">
              <KeyRound className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-pure-color">
                মেসে যুক্ত হন
              </DialogTitle>
              <DialogDescription className="text-xs text-subtitle-color mt-0.5">
                মেস আইডি বা ইনভাইটেশন কোড দিয়ে জয়েন রিকোয়েস্ট পাঠান
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

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
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-subtitle-color">
                মেস আইডি বা ইনভাইটেশন কোড *
              </label>
              <button
                type="button"
                onClick={handlePaste}
                className="flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline active:scale-95 transition"
              >
                <ClipboardPaste className="size-3" />
                <span>পেস্ট করুন</span>
              </button>
            </div>
            <input
              type="text"
              required
              value={workspaceId}
              onChange={(e) => setWorkspaceId(e.target.value)}
              placeholder="যেমন: d290f1ee-6c54-4b01-90e6-d701748f0851"
              className="w-full rounded-xl border border-border-color bg-input-bg px-3.5 py-2.5 text-xs font-mono text-pure-color placeholder:text-subtitle-secondary focus:border-sky-500 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20"
            />
            <p className="mt-1 text-[11px] text-subtitle-secondary">
              আপনার মেস ম্যানেজারের কাছ থেকে পাওয়া মেস আইডি বা কোডটি এখানে দিন।
            </p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || Boolean(successMessage)}
              className="w-full rounded-xl bg-primary hover:bg-primary-light py-3 text-sm font-semibold text-white shadow-xs transition active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
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
      </DialogContent>
    </Dialog>
  );
};
