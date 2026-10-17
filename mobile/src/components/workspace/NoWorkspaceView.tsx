import React, { useState } from 'react';
import {
  Plus,
  KeyRound,
  LogOut,
  ChevronRight,
  Utensils,
  ReceiptText,
  Users,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { haptics } from '@/lib/haptics';
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
    <div className="min-h-screen bg-primary-bg text-pure-color transition-colors">
      {/* Centered Mobile Container */}
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-between px-5 pt-[calc(env(safe-area-inset-top,0px)+1rem)] pb-[calc(env(safe-area-inset-bottom,0px)+1.5rem)] relative">
        {/* Ambient Subtle Glow Backdrop */}
        <div
          className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 size-72 rounded-full bg-emerald-500/10 blur-3xl -z-10 dark:bg-emerald-500/5"
          aria-hidden="true"
        />

        {/* Top Bar with Brand & Logout */}
        <header className="flex items-center justify-between pb-3.5 border-b border-border-color/80">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src="/brand-icon.png"
                alt="মেসিফাই"
                className="size-10 rounded-2xl shadow-xs object-contain ring-1 ring-border-color bg-card-bg"
              />
              <span
                className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-emerald-500 ring-2 ring-primary-bg"
                title="সক্রিয় অ্যাকাউন্ট"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-bold tracking-tight text-pure-color">মেসিফাই</h1>
                <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                  v1.0
                </span>
              </div>
              <p className="text-[11px] text-subtitle-color font-medium truncate max-w-[180px]">
                স্বাগতম, {user?.name || 'ব্যবহারকারী'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              haptics.selection();
              logout();
            }}
            className="group flex items-center gap-1.5 rounded-xl border border-border-color bg-card-bg px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all active:scale-95 shadow-2xs"
            title="অ্যাকাউন্ট থেকে লগআউট করুন"
          >
            <LogOut className="size-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>লগআউট</span>
          </button>
        </header>

        {/* Main Action Content */}
        <main className="my-auto py-6 text-center">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-pure-color">
            কোনো সক্রিয় মেস পাওয়া যায়নি
          </h2>
          <p className="mx-auto mt-2 max-w-xs text-xs font-medium text-subtitle-color leading-relaxed">
            হিসাব শুরু করার জন্য একটি নতুন মেস খুলুন অথবা ম্যানেজারের দেওয়া মেস কোড দিয়ে যুক্ত হন।
          </p>

          {/* Action Cards */}
          <div className="mt-7 space-y-3 max-w-sm mx-auto text-left">
            {/* Card 1: Create Mess */}
            <button
              onClick={() => {
                haptics.impact('light');
                setIsCreateOpen(true);
              }}
              className="group relative flex w-full items-center justify-between gap-3.5 rounded-2xl border border-emerald-500/30 bg-card-bg p-3.5 sm:p-4 text-left shadow-xs hover:border-emerald-500 hover:shadow-md hover:shadow-emerald-500/10 transition-all duration-200 active:scale-[0.98] overflow-hidden"
            >
              <div
                className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                aria-hidden="true"
              />

              <div className="flex items-center gap-3.5 relative z-10 min-w-0 text-left">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 group-hover:scale-105 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all duration-200 shadow-xs">
                  <Plus className="size-6 transition-transform group-hover:rotate-90 duration-300" />
                </div>
                <div className="min-w-0 text-left">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-pure-color group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      নতুন মেস খুলুন
                    </h3>
                    <span className="rounded-md bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      ম্যানেজার
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-subtitle-color leading-snug text-left">
                    আপনি যদি ম্যানেজার হন, নতুন মেস বানিয়ে সদস্য ও মিল পরিচালনা করুন।
                  </p>
                </div>
              </div>

              <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-secondary-bg text-subtitle-secondary group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:bg-emerald-500/10 group-hover:translate-x-0.5 transition-all relative z-10">
                <ChevronRight className="size-4" />
              </div>
            </button>

            {/* Card 2: Join Mess */}
            <button
              onClick={() => {
                haptics.impact('light');
                setIsJoinOpen(true);
              }}
              className="group relative flex w-full items-center justify-between gap-3.5 rounded-2xl border border-sky-500/25 bg-card-bg p-3.5 sm:p-4 text-left shadow-xs hover:border-sky-500 hover:shadow-md hover:shadow-sky-500/10 transition-all duration-200 active:scale-[0.98] overflow-hidden"
            >
              <div
                className="absolute inset-0 bg-gradient-to-r from-sky-500/10 via-sky-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                aria-hidden="true"
              />

              <div className="flex items-center gap-3.5 relative z-10 min-w-0 text-left">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/25 group-hover:scale-105 group-hover:bg-sky-600 group-hover:text-white group-hover:border-sky-600 transition-all duration-200 shadow-xs">
                  <KeyRound className="size-6 transition-transform group-hover:rotate-12 duration-300" />
                </div>
                <div className="min-w-0 text-left">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-pure-color group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                      মেসে যুক্ত হন
                    </h3>
                    <span className="rounded-md bg-sky-500/15 px-1.5 py-0.5 text-[10px] font-bold text-sky-600 dark:text-sky-400 border border-sky-500/20">
                      সদস্য
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-subtitle-color leading-snug text-left">
                    ম্যানেজার থেকে পাওয়া ইনভাইট কোড দিয়ে সদস্য হিসেবে যোগ দিন।
                  </p>
                </div>
              </div>

              <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-secondary-bg text-subtitle-secondary group-hover:text-sky-600 dark:group-hover:text-sky-400 group-hover:bg-sky-500/10 group-hover:translate-x-0.5 transition-all relative z-10">
                <ChevronRight className="size-4" />
              </div>
            </button>
          </div>

          {/* Value Props / Features */}
          <div className="mt-7 pt-5 border-t border-border-color/60 grid grid-cols-3 gap-2.5 max-w-sm mx-auto">
            <div className="flex flex-col items-center p-2 rounded-xl bg-card-bg/60 border border-border-color/60 text-center">
              <div className="flex size-7 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 mb-1.5">
                <Utensils className="size-3.5" />
              </div>
              <span className="text-[11px] font-bold text-pure-color">মিল ট্র্যাকিং</span>
              <span className="text-[10px] text-subtitle-secondary">দৈনিক স্বচ্ছ হিসাব</span>
            </div>

            <div className="flex flex-col items-center p-2 rounded-xl bg-card-bg/60 border border-border-color/60 text-center">
              <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-1.5">
                <ReceiptText className="size-3.5" />
              </div>
              <span className="text-[11px] font-bold text-pure-color">বাজার খরচ</span>
              <span className="text-[10px] text-subtitle-secondary">আমানতদার হিসাব</span>
            </div>

            <div className="flex flex-col items-center p-2 rounded-xl bg-card-bg/60 border border-border-color/60 text-center">
              <div className="flex size-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 mb-1.5">
                <Users className="size-3.5" />
              </div>
              <span className="text-[11px] font-bold text-pure-color">সহজ সমন্বয়</span>
              <span className="text-[10px] text-subtitle-secondary">সবার সাথে শেয়ার</span>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center pt-2">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-subtitle-secondary">
            <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>আমানত ও ইনসাফের সাথে মেসের সুন্দর ব্যবস্থাপনা</span>
          </div>
        </footer>
      </div>

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
