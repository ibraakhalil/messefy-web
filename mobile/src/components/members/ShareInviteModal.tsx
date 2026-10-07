import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  MessageSquare,
  Building2,
} from 'lucide-react';

interface ShareInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceName: string;
  workspaceId: string;
  onSuccessToast?: (msg: string) => void;
}

export const ShareInviteModal: React.FC<ShareInviteModalProps> = ({
  isOpen,
  onClose,
  workspaceName,
  workspaceId,
  onSuccessToast,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  if (!isOpen) return null;

  const inviteMessage = `আসসালামু আলাইকুম! আমাদের "${workspaceName}" মেসে আপনাকে স্বাগতম। মেসিফাই অ্যাপে যুক্ত হতে এই মেস আইডি ব্যবহার করুন:\n\n${workspaceId}\n\nঅ্যাপ থেকে "মেসে যোগ দিন" অপশনে গিয়ে আইডিটি পেস্ট করুন।`;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(workspaceId);
      setCopiedCode(true);
      onSuccessToast?.('মেস আইডি কপি করা হয়েছে');
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      onSuccessToast?.('কপি করতে সমস্যা হয়েছে');
    }
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(inviteMessage);
      setCopiedMessage(true);
      onSuccessToast?.('ইনভাইটেশন মেসেজ কপি করা হয়েছে');
      setTimeout(() => setCopiedMessage(false), 2000);
    } catch {
      onSuccessToast?.('কপি করতে সমস্যা হয়েছে');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `মেসিফাই - ${workspaceName}`,
          text: inviteMessage,
        });
        onSuccessToast?.('মেস কোড শেয়ার করা হয়েছে');
      } catch {
        // User dismissed
      }
    } else {
      handleCopyMessage();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="flex max-h-[90vh] w-full max-w-md flex-col rounded-t-3xl sm:rounded-3xl border border-border-color bg-card-bg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-color px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Share2 className="size-4.5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-pure-color">মেস ইনভাইটেশন কোড</h3>
              <p className="text-xs text-subtitle-color">নতুন মেম্বারদের ইনভাইট করুন</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-full bg-secondary-bg text-subtitle-color hover:text-pure-color transition active:scale-95"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Workspace ID Card */}
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20 p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
              <Building2 className="size-3.5" />
              <span>{workspaceName}</span>
            </div>
            <p className="mt-1 text-[11px] text-subtitle-color">মেস আইডি / ইনভাইট কোড</p>
            <div className="mt-2.5 flex items-center justify-between rounded-xl border border-border-color bg-card-bg px-3.5 py-2.5 shadow-2xs">
              <code className="select-all font-mono text-xs font-bold text-primary truncate max-w-[240px]">
                {workspaceId}
              </code>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary transition active:scale-90"
              >
                {copiedCode ? (
                  <>
                    <Check className="size-3.5" />
                    <span>কপি হয়েছে</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" />
                    <span>কপি</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Invitation Preview Note */}
          <div className="rounded-2xl border border-border-color bg-secondary-bg/60 p-3.5 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-pure-color">
              <MessageSquare className="size-3.5 text-subtitle-color" />
              <span>ইনভাইটেশন মেসেজ প্রিভিউ</span>
            </div>
            <p className="text-xs text-subtitle-color whitespace-pre-line leading-relaxed bg-card-bg p-3 rounded-xl border border-border-color/60 font-sans">
              {inviteMessage}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              onClick={handleNativeShare}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-bold text-white shadow-md transition active:scale-98 hover:opacity-95"
            >
              <Share2 className="size-4" />
              <span>হোয়াটসঅ্যাপ বা মেসেঞ্জারে শেয়ার করুন</span>
            </button>

            <button
              onClick={handleCopyMessage}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-border-color bg-card-bg py-2.5 text-xs font-semibold text-pure-color transition active:scale-98 hover:bg-secondary-bg"
            >
              {copiedMessage ? (
                <>
                  <Check className="size-4 text-emerald-600" />
                  <span>মেসেজ কপি হয়েছে!</span>
                </>
              ) : (
                <>
                  <Copy className="size-4" />
                  <span>পুরো মেসেজ কপি করুন</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
