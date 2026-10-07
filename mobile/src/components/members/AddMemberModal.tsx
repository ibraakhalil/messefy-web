import React, { useState } from 'react';
import {
  X,
  UserPlus,
  Mail,
  User,
  Check,
  Loader2,
  AlertCircle,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMemberActions } from '@/hooks/use-member-actions';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  onSuccessToast?: (msg: string) => void;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({
  isOpen,
  onClose,
  workspaceId,
  onSuccessToast,
}) => {
  const [memberType, setMemberType] = useState<'online' | 'offline'>('online');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { addMember, isAdding } = useMemberActions(workspaceId);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (memberType === 'online') {
      const cleanEmail = email.trim().toLowerCase();
      if (!cleanEmail || !cleanEmail.includes('@')) {
        setErrorMsg('অনুগ্রহ করে সঠিক ইমেইল ঠিকানা দিন');
        return;
      }

      try {
        await addMember({
          workspaceId,
          type: 'online',
          email: cleanEmail,
        });
        onSuccessToast?.('মাশাআল্লাহ! নতুন সদস্য সফলভাবে যুক্ত হয়েছে');
        onClose();
        setEmail('');
      } catch (err: unknown) {
        setErrorMsg(err instanceof Error ? err.message : 'সদস্য যোগ করতে সমস্যা হয়েছে');
      }
    } else {
      const cleanName = name.trim();
      if (!cleanName || cleanName.length < 2) {
        setErrorMsg('অনুগ্রহ করে মেম্বারের পূর্ণ নাম দিন');
        return;
      }

      try {
        await addMember({
          workspaceId,
          type: 'offline',
          name: cleanName,
        });
        onSuccessToast?.('অফলাইন সদস্য তৈরি হয়েছে');
        onClose();
        setName('');
      } catch (err: unknown) {
        setErrorMsg(err instanceof Error ? err.message : 'অফলাইন সদস্য যোগ করতে সমস্যা হয়েছে');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="flex max-h-[90vh] w-full max-w-md flex-col rounded-t-3xl sm:rounded-3xl border border-border-color bg-card-bg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-color px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <UserPlus className="size-4.5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-pure-color">মেসে সদস্য যোগ করুন</h3>
              <p className="text-xs text-subtitle-color">অনলাইন বা অফলাইন মেম্বার</p>
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

          {/* Type Switcher */}
          <div className="flex items-center gap-1.5 rounded-xl bg-secondary-bg/80 p-1">
            <button
              type="button"
              onClick={() => {
                setMemberType('online');
                setErrorMsg(null);
              }}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition',
                memberType === 'online'
                  ? 'bg-card-bg text-primary shadow-2xs font-bold'
                  : 'text-subtitle-color hover:text-pure-color'
              )}
            >
              <Wifi className="size-3.5" />
              <span>অনলাইন মেম্বার</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMemberType('offline');
                setErrorMsg(null);
              }}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition',
                memberType === 'offline'
                  ? 'bg-card-bg text-primary shadow-2xs font-bold'
                  : 'text-subtitle-color hover:text-pure-color'
              )}
            >
              <WifiOff className="size-3.5" />
              <span>অফলাইন মেম্বার</span>
            </button>
          </div>

          {memberType === 'online' ? (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-pure-color flex items-center gap-1.5">
                <Mail className="size-3.5 text-subtitle-color" />
                <span>মেম্বারের রেজিস্টার্ড ইমেইল</span>
              </label>
              <input
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMsg(null);
                }}
                className="w-full rounded-xl border border-border-color bg-secondary-bg px-3.5 py-2.5 text-xs text-pure-color placeholder:text-subtitle-color focus:border-primary focus:outline-hidden"
                required
              />
              <p className="text-[11px] text-subtitle-color pt-0.5">
                ব্যবহারকারীকে ইতিমধ্যে মেসিফাই অ্যাপে অ্যাকাউন্ট থাকতে হবে।
              </p>
            </div>
          ) : (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-pure-color flex items-center gap-1.5">
                <User className="size-3.5 text-subtitle-color" />
                <span>মেম্বারের নাম</span>
              </label>
              <input
                type="text"
                placeholder="যেমন: রহিম আহমেদ"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrorMsg(null);
                }}
                className="w-full rounded-xl border border-border-color bg-secondary-bg px-3.5 py-2.5 text-xs text-pure-color placeholder:text-subtitle-color focus:border-primary focus:outline-hidden"
                required
              />
              <p className="text-[11px] text-subtitle-color pt-0.5">
                অফলাইন মেম্বারের মিল ও জমার হিসাব আপনি ম্যানেজার হিসেবে পরিচালনা করতে পারবেন।
              </p>
            </div>
          )}

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isAdding}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-bold text-white shadow-md transition active:scale-98 disabled:opacity-50"
            >
              {isAdding ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>যুক্ত হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Check className="size-4" />
                  <span>মেম্বার যুক্ত করুন</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
