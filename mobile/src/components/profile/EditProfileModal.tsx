import React, { useState } from 'react';
import { User, Check, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { haptics } from '@/lib/haptics';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessToast?: (msg: string) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  onSuccessToast,
}) => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();

    if (cleanName.length < 2) {
      setErrorMsg('নাম কমপক্ষে ২ অক্ষরের হতে হবে');
      haptics.error();
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      await updateProfile({ name: cleanName });
      haptics.success();
      onSuccessToast?.('আলহামদুলিল্লাহ! আপনার প্রোফাইল সফলভাবে আপডেট হয়েছে।');
      onClose();
    } catch (err: unknown) {
      haptics.error();
      setErrorMsg(
        err instanceof Error ? err.message : 'প্রোফাইল আপডেট করতে সমস্যা হয়েছে'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-sm p-5">
        {/* Header */}
        <DialogHeader className="pb-3 border-b border-border-color/60 text-left pr-8">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <User className="size-5" />
            </div>
            <div>
              <DialogTitle className="font-bold text-base text-pure-color">
                প্রোফাইল পরিবর্তন
              </DialogTitle>
              <DialogDescription className="text-[11px] text-subtitle-color mt-0.5">
                আপনার প্রদর্শিত নাম আপডেট করুন
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-rose-50 dark:bg-rose-950/30 p-2.5 text-xs text-rose-600 dark:text-rose-400 border border-rose-200/50 dark:border-rose-800/40">
            <AlertCircle className="size-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-pure-color mb-1">
              সম্পূর্ণ নাম <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="যেমন: মোঃ ইব্রাহিম খলিল"
                className="w-full rounded-2xl border border-border-color bg-primary-bg px-3.5 py-2.5 text-xs text-pure-color placeholder:text-subtitle-color/60 focus:border-emerald-500 focus:outline-hidden transition"
                autoFocus
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-pure-color mb-1">
              ইমেইল ঠিকানা (পরিবর্তনযোগ্য নয়)
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full rounded-2xl border border-border-color/60 bg-secondary-bg/60 px-3.5 py-2.5 text-xs text-subtitle-color cursor-not-allowed opacity-80"
            />
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                haptics.selection();
                onClose();
              }}
              disabled={isLoading}
              className="flex-1 rounded-2xl border border-border-color py-2.5 text-xs font-semibold text-subtitle-color hover:bg-secondary-bg transition active:scale-95 disabled:opacity-50"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 rounded-2xl bg-primary hover:bg-primary-light py-2.5 text-xs font-semibold text-white shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>সংরক্ষণ হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Check className="size-3.5" />
                  <span>সংরক্ষণ করুন</span>
                </>
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
