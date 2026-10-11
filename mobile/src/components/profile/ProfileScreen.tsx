import React, { useState } from 'react';
import {
  Mail,
  Crown,
  Shield,
  UserCheck,
  Moon,
  Sun,
  Smartphone,
  Lock,
  Edit3,
  LogOut,
  Building2,
  Utensils,
  Wallet,
  Coins,
  ChevronRight,
  Info,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { toBanglaNumber } from '@/lib/period-utils';
import { haptics } from '@/lib/haptics';
import { Switch } from '@/components/ui/switch';
import { EditProfileModal } from './EditProfileModal';
import { ChangePasswordModal } from './ChangePasswordModal';
import { LogoutConfirmModal } from './LogoutConfirmModal';

interface ProfileScreenProps {
  workspaceName?: string;
  workspaceAddress?: string;
  memberRole?: string;
  myMeals?: number;
  myDeposit?: number;
  myBalance?: number;
  isDark: boolean;
  onToggleTheme: () => void;
  onSuccessToast?: (msg: string) => void;
  onLogout: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  workspaceName = 'মেস',
  workspaceAddress,
  memberRole = 'member',
  myMeals = 0,
  myDeposit = 0,
  myBalance = 0,
  isDark,
  onToggleTheme,
  onSuccessToast,
  onLogout,
}) => {
  const { user } = useAuth();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [hapticsActive, setHapticsActive] = useState<boolean>(() => haptics.isEnabled());

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'owner':
        return {
          label: 'মেস মালিক (Owner)',
          icon: Crown,
          className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
        };
      case 'manager':
      case 'admin':
        return {
          label: 'মেস ম্যানেজার (Admin)',
          icon: Shield,
          className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
        };
      default:
        return {
          label: 'মেস সদস্য (Member)',
          icon: UserCheck,
          className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
        };
    }
  };

  const roleInfo = getRoleBadge(memberRole);
  const RoleIcon = roleInfo.icon;

  const handleToggleHaptics = () => {
    const next = !hapticsActive;
    setHapticsActive(next);
    haptics.setEnabled(next);
    if (next) {
      haptics.impact('light');
    }
    onSuccessToast?.(next ? 'হ্যাপটিক ভাইব্রেশন চালু করা হয়েছে' : 'হ্যাপটিক ভাইব্রেশন বন্ধ করা হয়েছে');
  };

  return (
    <div className="space-y-4 pb-12 animate-in fade-in duration-300">
      {/* 1. Header Title */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h2 className="text-lg font-bold text-pure-color">প্রোফাইল ও সেটিংস</h2>
          <p className="text-xs text-subtitle-color">ব্যক্তিগত অ্যাকাউন্ট ও অ্যাপ প্রেফারেন্স</p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold">
          <Sparkles className="size-3.5" />
          <span>অনলাইন</span>
        </div>
      </div>

      {/* 2. User Profile Card */}
      <div className="relative overflow-hidden rounded-3xl bg-card-bg border border-border-color p-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          {/* Avatar with solid primary surface */}
          <div className="relative">
            <div className="size-16 rounded-2xl bg-primary text-white font-bold text-xl flex items-center justify-center shadow-xs">
              {getInitials(user?.name)}
            </div>
            <span className="absolute -bottom-1 -right-1 size-4 rounded-full bg-emerald-500 ring-2 ring-card-bg flex items-center justify-center">
              <CheckCircle2 className="size-3 text-white" />
            </span>
          </div>

          {/* User Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-base text-pure-color truncate">
                {user?.name || 'ব্যবহারকারী'}
              </h3>
            </div>
            <div className="flex items-center gap-1 text-xs text-subtitle-color truncate mt-0.5">
              <Mail className="size-3 shrink-0" />
              <span className="truncate">{user?.email || 'ইমেইল নেই'}</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              <span
                className={cn(
                  'inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[10px] font-semibold border',
                  roleInfo.className
                )}
              >
                <RoleIcon className="size-3" />
                {roleInfo.label}
              </span>
            </div>
          </div>

          {/* Edit Profile Action Button */}
          <button
            onClick={() => {
              haptics.selection();
              setIsEditOpen(true);
            }}
            aria-label="Edit Profile"
            className="size-9 rounded-2xl bg-secondary-bg hover:bg-card-shade flex items-center justify-center text-subtitle-color hover:text-pure-color transition active:scale-90"
          >
            <Edit3 className="size-4" />
          </button>
        </div>
      </div>

      {/* 3. My Mess Status Card */}
      <div className="rounded-3xl bg-card-bg border border-border-color p-4 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-border-color/60">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Building2 className="size-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-pure-color">{workspaceName}</h4>
              <p className="text-[10px] text-subtitle-color">
                {workspaceAddress || 'বর্তমান মেসের সদস্য'}
              </p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
            চলতি মাস
          </span>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          {/* Meals */}
          <div className="rounded-2xl bg-secondary-bg p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 text-[10px] text-subtitle-color mb-0.5">
              <Utensils className="size-3" />
              <span>আমার মিল</span>
            </div>
            <p className="text-sm font-bold text-pure-color">
              {toBanglaNumber(myMeals)}
            </p>
          </div>

          {/* Deposits */}
          <div className="rounded-2xl bg-secondary-bg p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 text-[10px] text-subtitle-color mb-0.5">
              <Wallet className="size-3" />
              <span>মোট জমা</span>
            </div>
            <p className="text-sm font-bold text-pure-color">
              {toBanglaNumber(myDeposit)}৳
            </p>
          </div>

          {/* Balance */}
          <div className="rounded-2xl bg-secondary-bg p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 text-[10px] text-subtitle-color mb-0.5">
              <Coins className="size-3" />
              <span>ব্যালেন্স</span>
            </div>
            <p
              className={cn(
                'text-sm font-bold',
                myBalance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'
              )}
            >
              {myBalance >= 0 ? `+${toBanglaNumber(myBalance)}৳` : `${toBanglaNumber(myBalance)}৳`}
            </p>
          </div>
        </div>
      </div>

      {/* 4. App Preferences & Security */}
      <div className="rounded-3xl bg-card-bg border border-border-color overflow-hidden shadow-sm divide-y divide-border-color/60">
        <div className="px-4 py-3 bg-secondary-bg/50">
          <p className="text-xs font-bold text-pure-color">অ্যাপ সেটিংস ও প্রেফারেন্স</p>
        </div>

        {/* Theme Preference Toggle */}
        <div className="flex items-center justify-between p-3.5">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              {isDark ? <Moon className="size-4" /> : <Sun className="size-4" />}
            </div>
            <div>
              <p className="text-xs font-semibold text-pure-color">ডার্ক মোড</p>
              <p className="text-[10px] text-subtitle-color">
                {isDark ? 'ডার্ক থিম সক্রিয় রয়েছে' : 'লাইট থিম সক্রিয় রয়েছে'}
              </p>
            </div>
          </div>
          <Switch
            checked={isDark}
            onCheckedChange={() => {
              haptics.selection();
              onToggleTheme();
            }}
            aria-label="ডার্ক মোড টগল করুন"
          />
        </div>

        {/* Haptics Feedback Toggle */}
        <div className="flex items-center justify-between p-3.5">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Smartphone className="size-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-pure-color">টাচ হ্যাপটিক্স (ভাইব্রেশন)</p>
              <p className="text-[10px] text-subtitle-color">
                বাটন প্রেসে মোবাইল ভাইব্রেশন রেসপন্স
              </p>
            </div>
          </div>
          <Switch
            checked={hapticsActive}
            onCheckedChange={handleToggleHaptics}
            aria-label="টাচ হ্যাপটিক্স টগল করুন"
          />
        </div>

        {/* Password / Security */}
        <button
          onClick={() => {
            haptics.selection();
            setIsPasswordOpen(true);
          }}
          className="w-full flex items-center justify-between p-3.5 hover:bg-secondary-bg/50 transition text-left"
        >
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Lock className="size-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-pure-color">পাসওয়ার্ড পরিবর্তন</p>
              <p className="text-[10px] text-subtitle-color">আপনার অ্যাকাউন্ট পাসওয়ার্ড আপডেট করুন</p>
            </div>
          </div>
          <ChevronRight className="size-4 text-subtitle-color" />
        </button>
      </div>

      {/* 5. App Specs & Islamic Note */}
      <div className="rounded-3xl bg-card-bg border border-border-color p-4 text-center shadow-sm">
        <div className="flex items-center justify-center gap-2 mb-1.5 text-emerald-600 dark:text-emerald-400">
          <Info className="size-4" />
          <span className="text-xs font-bold">Messefy Mobile v1.0.0</span>
        </div>
        <p className="text-[11px] text-subtitle-color">
          Tauri 2.0 (Rust) + React 19 + TypeScript + Bun
        </p>
        <p className="mt-2 text-[10px] text-subtitle-color/80 italic font-medium">
          «اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا» — হে আল্লাহ, আমাদের রিযিকে বরকত দান করুন।
        </p>
      </div>

      {/* 6. Logout Button */}
      <button
        onClick={() => {
          haptics.warning();
          setIsLogoutOpen(true);
        }}
        className="w-full rounded-2xl border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 dark:bg-rose-950/20 py-3 text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center justify-center gap-2 transition active:scale-98 shadow-sm"
      >
        <LogOut className="size-4" />
        <span>অ্যাকাউন্ট থেকে লগআউট করুন</span>
      </button>

      {/* Modals */}
      <EditProfileModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSuccessToast={onSuccessToast}
      />

      <ChangePasswordModal
        isOpen={isPasswordOpen}
        onClose={() => setIsPasswordOpen(false)}
        onSuccessToast={onSuccessToast}
      />

      <LogoutConfirmModal
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={() => {
          setIsLogoutOpen(false);
          onLogout();
        }}
      />
    </div>
  );
};
