import React, { useState } from 'react';
import {
  Megaphone,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Pin,
  Clock,
  User,
  AlertTriangle,
} from 'lucide-react';
import { useNotices, useDeleteNotice } from '@/hooks/use-notices';
import { formatTimeAgo, toBanglaNumber } from '@/lib/period-utils';
import { cn } from '@/lib/utils';
import { CreateNoticeModal } from './CreateNoticeModal';
import type { NoticeItem } from '@/types/notice';

interface NoticeBoardProps {
  workspaceId: string;
  isManager: boolean;
  onToast: (msg: string) => void;
}

export const NoticeBoard: React.FC<NoticeBoardProps> = ({
  workspaceId,
  isManager,
  onToast,
}) => {
  const { data: notices = [], isLoading } = useNotices(workspaceId);
  const { mutateAsync: deleteNotice, isPending: isDeleting } = useDeleteNotice();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Safe current notice
  const validIndex = notices.length > 0 ? Math.min(currentIndex, notices.length - 1) : 0;
  const currentNotice: NoticeItem | undefined = notices[validIndex];

  const handleNext = () => {
    if (notices.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % notices.length);
    setIsExpanded(false);
  };

  const handlePrev = () => {
    if (notices.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + notices.length) % notices.length);
    setIsExpanded(false);
  };

  const handleDelete = async (noticeId: string) => {
    if (!window.confirm('আপনি কি এই নোটিসটি মুছে ফেলতে চান?')) return;
    try {
      await deleteNotice({ noticeId, workspaceId });
      onToast('নোটিসটি মুছে ফেলা হয়েছে');
      if (currentIndex >= notices.length - 1 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    } catch (err: unknown) {
      console.error('Failed to delete notice:', err);
      onToast('নোটিস মুছতে সমস্যা হয়েছে');
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border-color bg-card-bg p-4 shadow-xs animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-4 w-32 rounded-md bg-secondary-bg" />
          <div className="h-4 w-12 rounded-md bg-secondary-bg" />
        </div>
        <div className="mt-3 h-12 rounded-xl bg-secondary-bg" />
      </div>
    );
  }

  // If no notices are present
  if (notices.length === 0) {
    if (!isManager) {
      // Don't clutter normal members' screen if no notices exist
      return null;
    }

    return (
      <>
        <div className="rounded-2xl border border-dashed border-border-color bg-card-bg/60 p-4 transition-colors">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-xl bg-primary-color/10 text-primary-color">
                <Megaphone className="size-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-pure-color">নোটিস বোর্ড ফাঁকা</p>
                <p className="text-[11px] text-subtitle-color">
                  মেম্বারদের জন্য নোটিস বা জরুরি বার্তা জারি করুন
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary-color px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:opacity-95 transition-opacity"
            >
              <Plus className="size-3.5" />
              <span>নোটিস লিখুন</span>
            </button>
          </div>
        </div>

        <CreateNoticeModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          workspaceId={workspaceId}
          onSuccessToast={onToast}
        />
      </>
    );
  }

  // Active Notice priority styles
  const isUrgent = currentNotice?.priority === 'urgent';
  const isImportant = currentNotice?.priority === 'important';

  const badgeConfig = isUrgent
    ? {
        label: 'জরুরি নোটিস',
        badgeClass:
          'bg-rose-500/15 text-rose-500 border-rose-500/30 dark:bg-rose-950/40 dark:text-rose-400',
        cardBorder: 'border-rose-500/30',
        glowBg: 'bg-rose-500/10',
      }
    : isImportant
      ? {
          label: 'গুরুত্বপূর্ণ',
          badgeClass:
            'bg-amber-500/15 text-amber-500 border-amber-500/30 dark:bg-amber-950/40 dark:text-amber-400',
          cardBorder: 'border-amber-500/30',
          glowBg: 'bg-amber-500/10',
        }
      : {
          label: 'বিজ্ঞপ্তি',
          badgeClass:
            'bg-emerald-500/15 text-emerald-500 border-emerald-500/30 dark:bg-emerald-950/40 dark:text-emerald-400',
          cardBorder: 'border-border-color',
          glowBg: 'bg-primary-color/10',
        };

  return (
    <>
      <div className="rounded-2xl border border-border-color bg-card-bg p-4 shadow-2xs transition-colors">
        {/* Header Bar */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <Megaphone className="size-4 text-primary shrink-0" />
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-pure-color">নোটিস বোর্ড</span>
              <span
                className={cn(
                  'rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wide',
                  badgeConfig.badgeClass
                )}
              >
                {badgeConfig.label}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Multiple Notices Carousel Controls */}
            {notices.length > 1 && (
              <div className="flex items-center gap-1 bg-secondary-bg/80 rounded-lg px-1.5 py-0.5 border border-border-color text-[11px] text-subtitle-color font-semibold">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="p-0.5 hover:text-pure-color transition-colors"
                  aria-label="Previous notice"
                >
                  <ChevronLeft className="size-3.5" />
                </button>
                <span>
                  {toBanglaNumber(validIndex + 1)}/{toBanglaNumber(notices.length)}
                </span>
                <button
                  type="button"
                  onClick={handleNext}
                  className="p-0.5 hover:text-pure-color transition-colors"
                  aria-label="Next notice"
                >
                  <ChevronRight className="size-3.5" />
                </button>
              </div>
            )}

            {/* Manager Post Notice Button */}
            {isManager && (
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="flex size-7 items-center justify-center rounded-lg bg-secondary-bg border border-border-color text-subtitle-color hover:text-pure-color hover:border-primary-color transition-colors"
                title="নতুন নোটিস পোস্ট করুন"
              >
                <Plus className="size-3.5" />
              </button>
            )}

            {/* Manager Delete Current Notice */}
            {isManager && currentNotice && (
              <button
                type="button"
                onClick={() => handleDelete(currentNotice.id)}
                disabled={isDeleting}
                className="flex size-7 items-center justify-center rounded-lg bg-secondary-bg border border-border-color text-rose-500/80 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                title="নোটিস মুছে ফেলুন"
              >
                <Trash2 className="size-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Notice Content */}
        {currentNotice && (
          <div className="space-y-1.5">
            <h3 className="text-sm font-semibold text-pure-color leading-normal flex items-center gap-1.5">
              <Pin className="size-3.5 text-primary-color shrink-0" />
              <span>{currentNotice.title}</span>
            </h3>

            <div className="relative">
              <p
                className={cn(
                  'text-xs text-subtitle-color leading-relaxed whitespace-pre-line',
                  !isExpanded && currentNotice.content.length > 240 ? 'line-clamp-4' : ''
                )}
              >
                {currentNotice.content}
              </p>

              {currentNotice.content.length > 240 && (
                <div className="flex justify-end mt-1">
                  <button
                    type="button"
                    onClick={() => setIsExpanded((prev) => !prev)}
                    className="text-[11px] font-semibold text-primary hover:underline active:opacity-80"
                  >
                    {isExpanded ? 'কম দেখুন' : 'আরও পড়ুন...'}
                  </button>
                </div>
              )}
            </div>

            {/* Notice Footer / Meta */}
            <div className="flex items-center justify-between pt-2 border-t border-border-color/60 text-[10px] text-subtitle-color/80">
              <div className="flex items-center gap-1">
                <Clock className="size-3" />
                <span>{formatTimeAgo(currentNotice.createdAt)}</span>
              </div>
              {currentNotice.author?.name && (
                <div className="flex items-center gap-1">
                  <User className="size-3" />
                  <span>{currentNotice.author.name}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal for creating a new notice */}
      <CreateNoticeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        workspaceId={workspaceId}
        onSuccessToast={onToast}
      />
    </>
  );
};
