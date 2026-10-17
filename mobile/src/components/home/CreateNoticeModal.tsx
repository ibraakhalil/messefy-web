import React, { useState } from 'react';
import { Megaphone, AlertCircle, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useCreateNotice } from '@/hooks/use-notices';
import type { NoticePriority } from '@/types/notice';

interface CreateNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  onSuccessToast?: (msg: string) => void;
}

export const CreateNoticeModal: React.FC<CreateNoticeModalProps> = ({
  isOpen,
  onClose,
  workspaceId,
  onSuccessToast,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<NoticePriority>('normal');
  const [formError, setFormError] = useState<string | null>(null);

  const { mutateAsync: createNotice, isPending } = useCreateNotice();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const cleanTitle = title.trim();
    const cleanContent = content.trim();

    if (!cleanTitle) {
      setFormError('অনুগ্রহ করে নোটিসের শিরোনাম লিখুন');
      return;
    }

    if (!cleanContent) {
      setFormError('অনুগ্রহ করে নোটিসের বিস্তারিত বিষয় লিখুন');
      return;
    }

    try {
      await createNotice({
        workspaceId,
        title: cleanTitle,
        content: cleanContent,
        priority,
      });

      setTitle('');
      setContent('');
      setPriority('normal');
      onSuccessToast?.('নোটিস সফলভাবে জারি করা হয়েছে!');
      onClose();
    } catch (err: unknown) {
      console.error('Failed to create notice:', err);
      const msg = err instanceof Error ? err.message : 'নোটিস জারি করতে সমস্যা হয়েছে';
      setFormError(msg);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md w-[95vw] rounded-2xl bg-card-bg border-border-color p-5">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary-color/10 text-primary-color">
              <Megaphone className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-pure-color">
                নতুন নোটিস জারি করুন
              </DialogTitle>
              <DialogDescription className="text-xs text-subtitle-color">
                মেসের সকল সদস্যের নোটিস বোর্ডে এটি প্রদর্শিত হবে
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {formError && (
          <div className="mt-2 flex items-center gap-2 rounded-xl bg-rose-500/10 p-3 text-xs font-medium text-rose-500 border border-rose-500/20">
            <AlertCircle className="size-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Title */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-subtitle-color">
              নোটিসের শিরোনাম <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="উদাঃ আগামীকাল রাতের মিলের পর জরুরি মিটিং"
              className="w-full rounded-xl border border-border-color bg-secondary-bg px-3.5 py-2.5 text-sm text-pure-color placeholder:text-subtitle-color/60 focus:border-primary-color focus:outline-hidden"
              maxLength={150}
            />
          </div>

          {/* Priority */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-subtitle-color">
              গুরুত্ব (Priority)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPriority('normal')}
                className={`rounded-xl border py-2 text-xs font-semibold transition-all ${
                  priority === 'normal'
                    ? 'border-emerald-500 bg-emerald-500/15 text-emerald-500'
                    : 'border-border-color bg-secondary-bg text-subtitle-color hover:border-emerald-500/40'
                }`}
              >
                সাধারণ
              </button>
              <button
                type="button"
                onClick={() => setPriority('important')}
                className={`rounded-xl border py-2 text-xs font-semibold transition-all ${
                  priority === 'important'
                    ? 'border-amber-500 bg-amber-500/15 text-amber-500'
                    : 'border-border-color bg-secondary-bg text-subtitle-color hover:border-amber-500/40'
                }`}
              >
                গুরুত্বপূর্ণ
              </button>
              <button
                type="button"
                onClick={() => setPriority('urgent')}
                className={`rounded-xl border py-2 text-xs font-semibold transition-all ${
                  priority === 'urgent'
                    ? 'border-rose-500 bg-rose-500/15 text-rose-500'
                    : 'border-border-color bg-secondary-bg text-subtitle-color hover:border-rose-500/40'
                }`}
              >
                জরুরি
              </button>
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-subtitle-color">
              বিস্তারিত বার্তা <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="নোটিসের যাবতীয় বিবরণ এখানে লিখুন..."
              rows={4}
              className="w-full rounded-xl border border-border-color bg-secondary-bg px-3.5 py-2.5 text-sm text-pure-color placeholder:text-subtitle-color/60 focus:border-primary-color focus:outline-hidden resize-none"
            />
          </div>

          {/* Submit Actions */}
          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="flex-1 rounded-xl border border-border-color bg-secondary-bg py-2.5 text-xs font-semibold text-subtitle-color transition-colors hover:text-pure-color"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary-color py-2.5 text-xs font-semibold text-white shadow-md transition-all hover:opacity-95 disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>পোস্ট হচ্ছে...</span>
                </>
              ) : (
                <span>নোটিস পোস্ট করুন</span>
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
