import React from 'react';
import { LogOut } from 'lucide-react';
import { haptics } from '@/lib/haptics';

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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-3xl bg-card-bg border border-border-color p-5 shadow-2xl animate-in zoom-in-95 duration-200 text-center">
        {/* Warning Icon */}
        <div className="mx-auto size-12 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3">
          <LogOut className="size-6" />
        </div>

        <h3 className="text-base font-bold text-pure-color">লগআউট করতে চান?</h3>
        <p className="mt-1 text-xs text-subtitle-color max-w-xs mx-auto">
          মেস থেকে সাময়িক প্রস্থান নিচ্ছেন? ইনশাআল্লাহ যেকোনো সময় আপনার ইমেইল ও পাসওয়ার্ড দিয়ে পুনরায় প্রবেশ করতে পারবেন।
        </p>

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
      </div>
    </div>
  );
};
