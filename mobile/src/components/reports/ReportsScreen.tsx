import React, { useState, useMemo } from 'react';
import {
  RefreshCw,
  Copy,
  Check,
  Search,
  Utensils,
  ShoppingCart,
  Coins,
  Receipt,
  Scale,
  Users,
  UserCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { haptics } from '@/lib/haptics';
import { toast } from 'sonner';
import { getBanglaPeriodName, toBanglaNumber } from '@/lib/period-utils';
import type { WorkspaceSummaryResponse, SummaryMember } from '@/services/summary-service';

interface ReportsScreenProps {
  workspaceName?: string;
  periodYear: number;
  periodMonth: number;
  summary: WorkspaceSummaryResponse | null;
  isLoading?: boolean;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  onSuccessToast?: (msg: string) => void;
}

export const ReportsScreen: React.FC<ReportsScreenProps> = ({
  workspaceName = 'মেস',
  periodYear,
  periodMonth,
  summary,
  isLoading: _isLoading = false,
  onRefresh,
  isRefreshing = false,
  onSuccessToast,
}) => {
  const [searchMember, setSearchMember] = useState('');
  const [copied, setCopied] = useState(false);

  const periodName = getBanglaPeriodName(periodYear, periodMonth);

  const totals = summary?.totals || {
    memberCount: 0,
    totalMeals: 0,
    totalDeposits: 0,
    totalExpenses: 0,
    mealExpenses: 0,
    totalDue: 0,
    mealRate: 0,
    netBalance: 0,
  };

  const membersList = useMemo<SummaryMember[]>(() => {
    return summary?.members || [];
  }, [summary?.members]);

  const filteredMembers = useMemo(() => {
    if (!searchMember.trim()) return membersList;
    const q = searchMember.toLowerCase();
    return membersList.filter((m) => m.name.toLowerCase().includes(q));
  }, [membersList, searchMember]);

  const handleCopySummary = async () => {
    haptics.impact();
    const lines = [
      `📊 ${workspaceName} - মেস অডিট রিপোর্ট`,
      `📅 পিরিয়ড: ${periodName}`,
      `---------------------------------`,
      `🍲 মোট মিল: ${toBanglaNumber(totals.totalMeals)} টি`,
      `🛒 মোট বাজার খরচ: ৳${toBanglaNumber(Math.round(totals.totalExpenses).toLocaleString('bn-BD'))}`,
      `🏷️ মিল রেট: ৳${toBanglaNumber(totals.mealRate.toFixed(2))}`,
      `💰 মোট টাকা জমা: ৳${toBanglaNumber(Math.round(totals.totalDeposits).toLocaleString('bn-BD'))}`,
      `⚖️ ক্যাশ ব্যালেন্স: ${totals.netBalance >= 0 ? '+' : '-'}৳${toBanglaNumber(Math.abs(Math.round(totals.netBalance)).toLocaleString('bn-BD'))} (${totals.netBalance >= 0 ? 'উদ্বৃত্ত' : 'ঘাটতি'})`,
      `---------------------------------`,
      `👥 মেম্বারদের দেনা-পাওনা লেজার:`,
    ];

    membersList.forEach((m, idx) => {
      const balanceStr =
        m.balance >= 0
          ? `পাবে: +৳${toBanglaNumber(Math.round(m.balance).toLocaleString('bn-BD'))}`
          : `দিবে: -৳${toBanglaNumber(Math.abs(Math.round(m.balance)).toLocaleString('bn-BD'))}`;
      lines.push(
        `${idx + 1}. ${m.name} | মিল: ${toBanglaNumber(m.meals)} | জমা: ৳${toBanglaNumber(Math.round(m.deposits).toLocaleString('bn-BD'))} | ${balanceStr}`
      );
    });

    lines.push(`\nGenerated via Messefy App 📱`);

    const fullText = lines.join('\n');

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(fullText);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = fullText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      toast.success('পুরো রিপোর্ট টেক্সট কপি করা হয়েছে!');
      onSuccessToast?.('পুরো রিপোর্ট টেক্সট কপি করা হয়েছে!');
    } catch (err) {
      console.error('Clipboard copy error:', err);
      toast.error('কপি করা সম্ভব হয়নি');
      onSuccessToast?.('কপি করা সম্ভব হয়নি');
    }
  };

  return (
    <div className="space-y-4 pb-8">
      {/* 1. Header Card */}
      <section className="relative overflow-hidden rounded-3xl border border-primary-light/20 bg-primary p-5 text-white shadow-xs">
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-100">
                মাসিক অডিট ও ব্যালেন্স শিট
              </span>
              <span className="rounded-full bg-emerald-500/30 px-2 py-0.5 text-[11px] font-medium text-emerald-200">
                {periodName}
              </span>
            </div>
            <h1 className="mt-1.5 text-2xl font-black tracking-tight">মেস হিসাব রিপোর্ট</h1>
            <p className="mt-0.5 text-xs text-emerald-100/80">
              সকল মেম্বারের মিল ও জমা খরচের স্বয়ংক্রিয় হিসাব
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleCopySummary}
              className="flex size-9 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 active:scale-95"
              aria-label="রিপোর্ট কপি করুন"
              title="রিপোর্ট কপি করুন"
            >
              {copied ? <Check className="size-4 text-emerald-300" /> : <Copy className="size-4" />}
            </button>

            {onRefresh && (
              <button
                type="button"
                onClick={() => {
                  haptics.impact();
                  onRefresh();
                }}
                disabled={isRefreshing}
                className="flex size-9 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 active:scale-95"
                aria-label="রিফ্রেশ করুন"
              >
                <RefreshCw className={cn('size-4', isRefreshing && 'animate-spin')} />
              </button>
            )}
          </div>
        </div>

        {/* 4 Primary KPIs */}
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <div className="rounded-2xl bg-white/10 p-2.5 backdrop-blur-md">
            <div className="flex items-center gap-1.5 text-emerald-200">
              <Receipt className="size-3.5" />
              <span className="text-[10px] font-medium">মিল রেট</span>
            </div>
            <p className="mt-1 text-lg font-bold tabular-nums">
              ৳{toBanglaNumber(totals.mealRate.toFixed(2))}
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 p-2.5 backdrop-blur-md">
            <div className="flex items-center gap-1.5 text-emerald-200">
              <Utensils className="size-3.5" />
              <span className="text-[10px] font-medium">মোট মিল</span>
            </div>
            <p className="mt-1 text-lg font-bold tabular-nums">
              {toBanglaNumber(totals.totalMeals)} টি
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 p-2.5 backdrop-blur-md">
            <div className="flex items-center gap-1.5 text-emerald-200">
              <ShoppingCart className="size-3.5" />
              <span className="text-[10px] font-medium">মোট বাজার</span>
            </div>
            <p className="mt-1 text-lg font-bold tabular-nums">
              ৳{toBanglaNumber(Math.round(totals.totalExpenses).toLocaleString('bn-BD'))}
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 p-2.5 backdrop-blur-md">
            <div className="flex items-center gap-1.5 text-emerald-200">
              <Coins className="size-3.5" />
              <span className="text-[10px] font-medium">মোট জমা</span>
            </div>
            <p className="mt-1 text-lg font-bold tabular-nums">
              ৳{toBanglaNumber(Math.round(totals.totalDeposits).toLocaleString('bn-BD'))}
            </p>
          </div>
        </div>
      </section>

      {/* 2. Mess Fund Summary Banner */}
      <section className="flex items-center justify-between rounded-2xl border border-border-color bg-card-bg p-3.5 shadow-2xs">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex size-10 shrink-0 items-center justify-center rounded-xl text-white shadow-2xs',
              totals.netBalance >= 0 ? 'bg-emerald-600' : 'bg-rose-600'
            )}
          >
            <Scale className="size-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-subtitle-color">
              মেস ক্যাশ ফান্ড ({totals.netBalance >= 0 ? 'উদ্বৃত্ত' : 'ঘাটতি'})
            </span>
            <p
              className={cn(
                'text-base font-black tabular-nums',
                totals.netBalance >= 0
                  ? 'text-emerald-700 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              )}
            >
              {totals.netBalance >= 0 ? '+' : '-'}৳
              {toBanglaNumber(Math.abs(Math.round(totals.netBalance)).toLocaleString('bn-BD'))}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopySummary}
          className="flex items-center gap-1.5 rounded-xl border border-border-color bg-card-bg px-3 py-1.5 text-xs font-bold text-pure-color transition active:scale-95 hover:bg-hover-bg"
        >
          <Copy className="size-3.5 text-subtitle-color" />
          <span>কপি সামারি</span>
        </button>
      </section>

      {/* 3. Member Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 size-3.5 -translate-y-1/2 text-subtitle-color" />
        <input
          type="text"
          placeholder="মেম্বারের নাম খুঁজুন..."
          value={searchMember}
          onChange={(e) => setSearchMember(e.target.value)}
          className="w-full rounded-2xl border border-border-color bg-card-bg py-2.5 pl-9 pr-3.5 text-xs text-pure-color placeholder:text-subtitle-color focus:border-primary focus:outline-hidden"
        />
      </div>

      {/* 4. Member-by-Member Balance Sheet */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-subtitle-color flex items-center gap-1.5">
            <Users className="size-3.5 text-primary" />
            <span>মেম্বারদের ব্যালেন্স শিট ({toBanglaNumber(filteredMembers.length)} জন)</span>
          </h2>
        </div>

        {filteredMembers.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border-color p-8 text-center bg-card-bg/50">
            <UserCheck className="size-8 text-subtitle-color/60 mb-2" />
            <p className="text-xs font-medium text-subtitle-color">কোনো মেম্বার পাওয়া যায়নি</p>
          </div>
        ) : (
          filteredMembers.map((m) => {
            const mealExpense = Math.round(m.meals * totals.mealRate);
            const isSurplus = m.balance >= 0;

            return (
              <article
                key={m.memberId}
                className="overflow-hidden rounded-2xl border border-border-color bg-card-bg p-3.5 shadow-2xs transition hover:border-border-color/80"
              >
                {/* Top: Member name, role, net balance pill */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xs font-black text-primary uppercase">
                      {m.name.slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-pure-color">{m.name}</h3>
                        {m.role !== 'member' && (
                          <span className="rounded-md bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-bold text-amber-700 dark:text-amber-400">
                            {m.role === 'owner' ? 'মালিক' : 'ম্যানেজার'}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-subtitle-color">
                        {m.isOffline ? 'অফলাইন সদস্য' : m.email || 'অ্যাক্টিভ সদস্য'}
                      </p>
                    </div>
                  </div>

                  {/* Surplus / Due Badge */}
                  <div
                    className={cn(
                      'shrink-0 rounded-xl px-2.5 py-1 text-right text-xs font-black tabular-nums border',
                      isSurplus
                        ? 'border-emerald-500/30 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                        : 'border-rose-500/30 bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
                    )}
                  >
                    <div>
                      {isSurplus ? '+' : '-'}৳
                      {toBanglaNumber(Math.abs(Math.round(m.balance)).toLocaleString('bn-BD'))}
                    </div>
                    <div className="text-[9px] font-semibold opacity-90">
                      {isSurplus ? 'মেস থেকে পাবে' : 'মেসে দিতে হবে'}
                    </div>
                  </div>
                </div>

                {/* Bottom Stats Breakdown Grid */}
                <div className="mt-3 grid grid-cols-3 gap-1 rounded-xl bg-surface-alt/60 p-2 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-subtitle-color">মিল সংখ্যা</span>
                    <p className="font-bold text-pure-color tabular-nums">
                      {toBanglaNumber(m.meals)} টি
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-subtitle-color">মিল বাবদ খরচ</span>
                    <p className="font-bold text-pure-color tabular-nums">
                      ৳{toBanglaNumber(mealExpense.toLocaleString('bn-BD'))}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-subtitle-color">মোট জমা</span>
                    <p className="font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                      ৳{toBanglaNumber(Math.round(m.deposits).toLocaleString('bn-BD'))}
                    </p>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </section>
    </div>
  );
};
