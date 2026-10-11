import React from 'react';
import { LogOut } from 'lucide-react';
import { haptics } from '@/lib/haptics';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent showCloseButton={false} className="max-w-sm text-center p-5">
        {/* Warning Icon */}
        <div className="mx-auto size-12 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3">
          <LogOut className="size-6" />
        </div>

        <DialogTitle className="text-base font-bold text-pure-color text-center">
          লগআউট করতে চান?
        </DialogTitle>
        <DialogDescription className="mt-1 text-xs text-subtitle-color max-w-xs mx-auto text-center">
          মেস থেকে সাময়িক প্রস্থান নিচ্ছেন? ইনশাআল্লাহ যেকোনো সময় আপনার ইমেইল ও পাসওয়ার্ড দিয়ে পুনরায় প্রবেশ করতে পারবেন।
        </DialogDescription>

        <div className="mt-5 flex items-center gap-2">
          <button
            onClick={() => {
              haptics.selection();
              onClose();
            }}
            className="flex-1 rounded-2xl border border-border-color py-2.5 text-xs font-semibold text-subtitle-color hover:bg-secondary-bg transition active:scale-95"
          >
            ফিরে যান
          </button>
          <button
            onClick={() => {
              haptics.warning();
              onConfirm();
            }}
            className="flex-1 rounded-2xl bg-rose-600 hover:bg-rose-700 py-2.5 text-xs font-semibold text-white shadow-md shadow-rose-600/20 transition active:scale-95"
          >
            হ্যাঁ, লগআউট করুন
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
