import React, { useState } from 'react';
import { Lock, Check, KeyRound, AlertCircle, ShieldCheck } from 'lucide-react';
import { haptics } from '@/lib/haptics';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessToast?: (msg: string) => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccessToast,
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (newPassword.length < 6) {
      haptics.error();
      setErrorMsg('নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে');
      return;
    }

    if (newPassword !== confirmPassword) {
      haptics.error();
      setErrorMsg('নতুন পাসওয়ার্ড ও কনফার্ম পাসওয়ার্ড মিলছে না');
      return;
    }

    haptics.success();
    onSuccessToast?.('ইনশাআল্লাহ! আপনার পাসওয়ার্ড সফলভাবে আপডেট করা হয়েছে।');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-sm p-5">
        {/* Header */}
        <DialogHeader className="pb-3 border-b border-border-color/60 text-left pr-8">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Lock className="size-5" />
            </div>
            <div>
              <DialogTitle className="font-bold text-base text-pure-color">
                পাসওয়ার্ড পরিবর্তন
              </DialogTitle>
              <DialogDescription className="text-[11px] text-subtitle-color mt-0.5">
                অ্যাকাউন্টের নিরাপত্তা জোরদার করুন
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Security Notice */}
        <div className="mt-3 flex items-start gap-2 rounded-2xl bg-emerald-500/10 p-2.5 text-[11px] text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
          <ShieldCheck className="size-4 shrink-0 mt-0.5" />
          <span>পাসওয়ার্ডে বর্ণ, সংখ্যা ও স্পেশাল ক্যারেক্টার মিলিয়ে শক্তিশালী পাসওয়ার্ড ব্যবহার করুন।</span>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-rose-50 dark:bg-rose-950/30 p-2.5 text-xs text-rose-600 dark:text-rose-400 border border-rose-200/50 dark:border-rose-800/40">
            <AlertCircle className="size-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-pure-color mb-1">
              বর্তমান পাসওয়ার্ড
            </label>
            <div className="relative">
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="বর্তমান পাসওয়ার্ড দিন"
                className="w-full rounded-2xl border border-border-color bg-primary-bg px-3.5 py-2.5 text-xs text-pure-color placeholder:text-subtitle-color/60 focus:border-emerald-500 focus:outline-hidden transition"
                required
              />
              <KeyRound className="absolute right-3 top-2.5 size-4 text-subtitle-color/50" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-pure-color mb-1">
              নতুন পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="নতুন গোপন পাসওয়ার্ড দিন"
              className="w-full rounded-2xl border border-border-color bg-primary-bg px-3.5 py-2.5 text-xs text-pure-color placeholder:text-subtitle-color/60 focus:border-emerald-500 focus:outline-hidden transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-pure-color mb-1">
              নতুন পাসওয়ার্ড নিশ্চিত করুন
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="একই পাসওয়ার্ড পুনরায় লিখুন"
              className="w-full rounded-2xl border border-border-color bg-primary-bg px-3.5 py-2.5 text-xs text-pure-color placeholder:text-subtitle-color/60 focus:border-emerald-500 focus:outline-hidden transition"
              required
            />
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                haptics.selection();
                onClose();
              }}
              className="flex-1 rounded-2xl border border-border-color py-2.5 text-xs font-semibold text-subtitle-color hover:bg-secondary-bg transition active:scale-95"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="flex-1 rounded-2xl bg-primary hover:bg-primary-light py-2.5 text-xs font-semibold text-white shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Check className="size-3.5" />
              <span>আপডেট করুন</span>
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
