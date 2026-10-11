import React, { useState } from 'react';
import { X, User, Check, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { haptics } from '@/lib/haptics';

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

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-3xl bg-card-bg border border-border-color p-5 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border-color/60">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <User className="size-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-pure-color">প্রোফাইল পরিবর্তন</h2>
              <p className="text-[11px] text-subtitle-color">আপনার প্রদর্শিত নাম আপডেট করুন</p>
            </div>
          </div>
          <button
            onClick={() => {
              haptics.selection();
              onClose();
            }}
            className="size-8 rounded-full bg-secondary-bg hover:bg-card-shade flex items-center justify-center text-subtitle-color hover:text-pure-color transition active:scale-90"
          >
            <X className="size-4" />
          </button>
        </div>

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
              className="flex-1 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 py-2.5 text-xs font-semibold text-white shadow-md shadow-emerald-700/20 hover:opacity-95 transition active:scale-95 flex items-center justify-center gap-1.5 disabled:opacity-50"
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
      </div>
    </div>
  );
};
