import React, { useState } from 'react';
import { Building2, Plus, KeyRound, LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { CreateMessModal } from './CreateMessModal';
import { JoinMessModal } from './JoinMessModal';

interface NoWorkspaceViewProps {
  onSuccess: () => void;
}

export const NoWorkspaceView: React.FC<NoWorkspaceViewProps> = ({ onSuccess }) => {
  const { user, logout } = useAuth();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col justify-between bg-primary-bg px-4 py-6 text-pure-color safe-top safe-bottom">
      {/* Top Bar with Logout */}
      <header className="flex items-center justify-between pb-4 border-b border-border-color">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-xs">
            <Building2 className="size-4.5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-pure-color">মেসিফাই</h1>
            <p className="text-[11px] text-subtitle-color">স্বাগতম, {user?.name}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-1.5 rounded-xl border border-border-color bg-card-bg px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition active:scale-95"
        >
          <LogOut className="size-3.5" />
          <span>লগআউট</span>
        </button>
      </header>

      {/* Main Action Content */}
      <main className="my-auto py-8 text-center">
        <div className="mx-auto flex size-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-950/60 dark:to-teal-950/40 text-emerald-700 dark:text-emerald-400 shadow-inner">
          <Sparkles className="size-10" />
        </div>

        <h2 className="mt-5 text-xl font-extrabold tracking-tight text-pure-color">
          কোনো সক্রিয় মেস পাওয়া যায়নি
        </h2>
        <p className="mx-auto mt-2 max-w-xs text-xs font-medium text-subtitle-color">
          হিসাব শুরু করার জন্য একটি নতুন মেস খুলুন অথবা ম্যানেজারের দেওয়া মেস কোড দিয়ে যুক্ত হন।
        </p>

        {/* Action Cards */}
        <div className="mt-8 space-y-3.5 max-w-sm mx-auto text-left">
          {/* Card 1: Create Mess */}
          <button
            onClick={() => setIsCreateOpen(true)}
            className="group flex w-full items-center gap-4 rounded-2xl border-2 border-emerald-500/30 bg-card-bg p-4 shadow-sm hover:border-emerald-600 dark:hover:border-emerald-500 transition active:scale-[0.98]"
          >
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition">
              <Plus className="size-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-pure-color group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                নতুন মেস খুলুন
              </h3>
              <p className="mt-0.5 text-xs text-subtitle-color">
                আপনি যদি ম্যানেজার হন, মেস তৈরি করে সদস্যদের যোগ করুন।
              </p>
            </div>
          </button>

          {/* Card 2: Join Mess */}
          <button
            onClick={() => setIsJoinOpen(true)}
            className="group flex w-full items-center gap-4 rounded-2xl border-2 border-blue-500/20 bg-card-bg p-4 shadow-sm hover:border-blue-600 dark:hover:border-blue-500 transition active:scale-[0.98]"
          >
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/20 group-hover:scale-105 transition">
              <KeyRound className="size-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-pure-color group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                মেসে যুক্ত হন
              </h3>
              <p className="mt-0.5 text-xs text-subtitle-color">
                ম্যানেজার থেকে পাওয়া ইনভাইট কোড দিয়ে সদস্য হিসেবে যোগ দিন।
              </p>
            </div>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center">
        <p className="text-[11px] text-subtitle-secondary">
          সবার সাথে মিলেমিশে সহজ ও পরিচ্ছন্ন মেস লাইফ
        </p>
      </footer>

      {/* Modals */}
      <CreateMessModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={onSuccess}
      />
      <JoinMessModal
        isOpen={isJoinOpen}
        onClose={() => setIsJoinOpen(false)}
        onSuccess={onSuccess}
      />
    </div>
  );
};
