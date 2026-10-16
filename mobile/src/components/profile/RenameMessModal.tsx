import React, { useState } from 'react';
import { Building2, Check, Loader2, AlertCircle, MapPin, ShieldAlert } from 'lucide-react';
import { useUpdateWorkspace } from '@/hooks/use-workspace';
import { haptics } from '@/lib/haptics';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface RenameMessModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  currentName: string;
  currentDescription?: string;
  isOwner: boolean;
  onSuccessToast?: (msg: string) => void;
}

interface RenameMessFormProps {
  onClose: () => void;
  workspaceId: string;
  currentName: string;
  currentDescription: string;
  isOwner: boolean;
  onSuccessToast?: (msg: string) => void;
}

const RenameMessForm: React.FC<RenameMessFormProps> = ({
  onClose,
  workspaceId,
  currentName,
  currentDescription,
  isOwner,
  onSuccessToast,
}) => {
  const { mutateAsync: updateWorkspace, isPending: isLoading } = useUpdateWorkspace();
  const [name, setName] = useState(currentName);
  const [description, setDescription] = useState(currentDescription);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOwner) {
      setErrorMsg('শুধুমাত্র মেস মালিক মেসের নাম পরিবর্তন করতে পারেন');
      haptics.error();
      return;
    }

    const cleanName = name.trim();
    const cleanDescription = description.trim();

    if (cleanName.length < 2) {
      setErrorMsg('মেসের নাম কমপক্ষে ২ অক্ষরের হতে হবে');
      haptics.error();
      return;
    }

    if (cleanName.length > 100) {
      setErrorMsg('মেসের নাম ১০০ অক্ষরের বেশি হতে পারবে না');
      haptics.error();
      return;
    }

    setErrorMsg(null);

    try {
      await updateWorkspace({
        workspaceId,
        input: {
          name: cleanName,
          description: cleanDescription || undefined,
        },
      });
      haptics.success();
      onSuccessToast?.('আলহামদুলিল্লাহ! মেসের নাম সফলভাবে পরিবর্তন করা হয়েছে।');
      onClose();
    } catch (err: unknown) {
      haptics.error();
      setErrorMsg(
        err instanceof Error ? err.message : 'মেসের নাম পরিবর্তন করতে সমস্যা হয়েছে'
      );
    }
  };

  return (
    <DialogContent className="max-w-sm p-5">
      {/* Header */}
      <DialogHeader className="pb-3 border-b border-border-color/60 text-left pr-8">
        <div className="flex items-center gap-2.5">
          <div className="size-9 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Building2 className="size-5" />
          </div>
          <div>
            <DialogTitle className="font-bold text-base text-pure-color">
              মেসের নাম পরিবর্তন
            </DialogTitle>
            <DialogDescription className="text-[11px] text-subtitle-color mt-0.5">
              মেসের নাম ও ঠিকানা/বিবরণ আপডেট করুন
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      {/* Permission Notice if not owner */}
      {!isOwner && (
        <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 p-2.5 text-xs text-amber-700 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/40">
          <ShieldAlert className="size-4 shrink-0 mt-0.5" />
          <span>
            আপনি এই মেসের মালিক নন। নিরাপত্তা ও শৃঙ্খলার স্বার্থে শুধুমাত্র মেস মালিক মেসের নাম পরিবর্তন করতে পারেন।
          </span>
        </div>
      )}

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
            মেসের নাম <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="যেমন: আল-মদিনা মেস"
            disabled={!isOwner || isLoading}
            className="w-full rounded-2xl border border-border-color bg-primary-bg px-3.5 py-2.5 text-xs text-pure-color placeholder:text-subtitle-color/60 focus:border-emerald-500 focus:outline-hidden transition disabled:opacity-50"
            autoFocus={isOwner}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-pure-color mb-1 flex items-center gap-1.5">
            <MapPin className="size-3 text-subtitle-color" />
            <span>ঠিকানা বা মেসের বিবরণ (ঐচ্ছিক)</span>
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="যেমন: বাড়ি #১২, রোড #৪, ধানমন্ডি"
            disabled={!isOwner || isLoading}
            className="w-full rounded-2xl border border-border-color bg-primary-bg px-3.5 py-2.5 text-xs text-pure-color placeholder:text-subtitle-color/60 focus:border-emerald-500 focus:outline-hidden transition disabled:opacity-50"
          />
        </div>

        <div className="mt-5 flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-xl px-4 py-2 text-xs font-semibold text-subtitle-color hover:bg-secondary-bg hover:text-pure-color transition active:scale-95 disabled:opacity-50"
          >
            বাতিল
          </button>
          <button
            type="submit"
            disabled={!isOwner || isLoading || name.trim().length < 2}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-primary-light transition active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>সংরক্ষণ হচ্ছে...</span>
              </>
            ) : (
              <>
                <Check className="size-3.5" />
                <span>নাম পরিবর্তন সংরক্ষণ</span>
              </>
            )}
          </button>
        </div>
      </form>
    </DialogContent>
  );
};

export const RenameMessModal: React.FC<RenameMessModalProps> = ({
  isOpen,
  onClose,
  workspaceId,
  currentName,
  currentDescription = '',
  isOwner,
  onSuccessToast,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {isOpen ? (
        <RenameMessForm
          key={`${workspaceId}-${currentName}`}
          onClose={onClose}
          workspaceId={workspaceId}
          currentName={currentName}
          currentDescription={currentDescription}
          isOwner={isOwner}
          onSuccessToast={onSuccessToast}
        />
      ) : null}
    </Dialog>
  );
};
