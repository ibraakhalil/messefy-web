import {
  ArrowRight,
  CalendarDays,
  Check,
  CircleDollarSign,
  ReceiptText,
  Utensils,
  UsersRound,
} from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface HeroProps {
  isAuthenticated: boolean;
}

export const Hero = ({ isAuthenticated }: HeroProps) => {
  const t = useTranslations('Home.hero');
  const primaryHref = isAuthenticated ? '/mess' : '/auth/signup';
  const memberRows = [
    { name: t('member1'), meals: '42.5', balance: '+৳1,240', positive: true },
    { name: t('member2'), meals: '38', balance: '-৳480', positive: false },
    { name: t('member3'), meals: '41', balance: '+৳760', positive: true },
  ] as const;

  return (
    <section className="relative">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-[700px] bg-[radial-gradient(circle_at_18%_18%,rgba(16,185,129,0.12),transparent_34%),radial-gradient(circle_at_82%_10%,rgba(245,158,11,0.10),transparent_30%)]"
      />
      <div className="tablet:px-6 tablet:py-20 laptop:grid-cols-[1.02fr_0.98fr] laptop:py-24 container grid items-center gap-14 px-4 py-14">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-700/15 bg-emerald-700/7 px-3 py-1.5 text-sm font-semibold text-emerald-800 dark:text-emerald-300">
            <span className="flex size-6 items-center justify-center rounded-full bg-emerald-700 text-white">
              <Check className="size-3.5" strokeWidth={3} />
            </span>
            {t('eyebrow')}
          </div>

          <h1 className="text-pure-color tablet:text-6xl laptop:text-[4.2rem] max-w-[12ch] text-[2.65rem] leading-[1.08] font-black tracking-[-0.04em]">
            {t('title')}
          </h1>

          <p className="text-subtitle-color tablet:text-xl mt-6 max-w-xl text-lg leading-8">
            {t('description')}
          </p>

          <div className="mt-8 flex flex-col gap-3 min-[440px]:flex-row">
            <Link
              href={primaryHref}
              className="bg-primary text-primary-fg focus-visible:outline-primary inline-flex h-12 items-center justify-center gap-2 rounded-xl px-6 text-base font-bold shadow-[0_10px_30px_-12px_rgba(4,120,87,0.65)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_-12px_rgba(4,120,87,0.7)] focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {isAuthenticated ? t('goToWorkspace') : t('startFree')}
              <ArrowRight className="size-5" />
            </Link>
            <Link
              href="#how"
              className="border-border-color bg-card-bg text-pure-color hover:bg-secondary-bg focus-visible:outline-primary inline-flex h-12 items-center justify-center rounded-xl border px-6 text-base font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {t('howItWorks')}
            </Link>
          </div>

          <div className="text-subtitle-color mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {[t('benefit1'), t('benefit2'), t('benefit3')].map((item) => (
              <span key={item} className="inline-flex items-center gap-1.5">
                <Check className="text-primary size-4" strokeWidth={2.5} />
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[560px]">
          <div
            aria-hidden="true"
            className="absolute -inset-5 -z-10 rotate-2 rounded-[2rem] bg-emerald-700/8"
          />
          <div className="border-border-color bg-card-bg overflow-hidden rounded-[1.65rem] border shadow-[0_28px_80px_-34px_rgba(11,54,40,0.4)]">
            <div className="border-border-color flex items-center justify-between border-b px-5 py-4">
              <div>
                <p className="text-sm font-bold">{t('workspaceName')}</p>
                <p className="text-subtitle-color mt-0.5 text-xs">{t('currentPeriod')}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600/10 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                {t('active')}
              </span>
            </div>

            <div className="bg-border-color grid grid-cols-3 gap-px">
              {[
                { label: t('totalMeals'), value: '368.5', icon: Utensils },
                { label: t('mealRate'), value: '৳58.20', icon: CircleDollarSign },
                { label: t('totalExpense'), value: '৳21,446', icon: ReceiptText },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="bg-card-bg tablet:px-4 px-3 py-4">
                  <Icon className="text-primary mb-3 size-4" />
                  <p className="text-subtitle-color tablet:text-xs text-[11px]">{label}</p>
                  <p className="tablet:text-lg mt-1 text-sm font-extrabold tracking-tight">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="tablet:p-5 p-4">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold">{t('memberBalance')}</p>
                  <p className="text-subtitle-color mt-0.5 text-xs">{t('balanceHint')}</p>
                </div>
                <span className="border-border-color bg-secondary-bg text-subtitle-color rounded-lg border px-2.5 py-1.5 text-xs font-semibold">
                  {t('viewAll')}
                </span>
              </div>
              <div className="border-border-color overflow-hidden rounded-xl border">
                <div className="bg-secondary-bg text-subtitle-color grid grid-cols-[1fr_68px_92px] px-3 py-2 text-[11px] font-semibold">
                  <span>{t('member')}</span>
                  <span className="text-right">{t('meals')}</span>
                  <span className="text-right">{t('balance')}</span>
                </div>
                {memberRows.map((member, index) => (
                  <div
                    key={member.name}
                    className={`grid grid-cols-[1fr_68px_92px] items-center px-3 py-3 text-sm ${
                      index !== memberRows.length - 1 ? 'border-border-color border-b' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="flex size-8 items-center justify-center rounded-full bg-amber-100 text-xs font-black text-amber-800 dark:bg-amber-400/15 dark:text-amber-300">
                        {member.name.slice(0, 1)}
                      </span>
                      <span className="font-semibold">{member.name}</span>
                    </div>
                    <span className="text-subtitle-color text-right">{member.meals}</span>
                    <span
                      className={`text-right font-bold ${
                        member.positive
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {member.balance}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="border-border-color bg-secondary-bg rounded-xl border p-3">
                  <CalendarDays className="mb-2 size-4 text-amber-600" />
                  <p className="text-subtitle-color text-xs">{t('todayMeals')}</p>
                  <p className="mt-1 text-lg font-extrabold">12.5</p>
                </div>
                <div className="bg-primary text-primary-fg rounded-xl p-3">
                  <UsersRound className="mb-2 size-4" />
                  <p className="text-xs text-white/70">{t('activeMembers')}</p>
                  <p className="mt-1 text-lg font-extrabold">{t('activeMembersValue')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="tablet:px-6 tablet:pb-20 container px-4 pb-14">
        <div className="border-border-color bg-card-bg grid gap-3 rounded-2xl border p-3 shadow-sm min-[560px]:grid-cols-3">
          {[
            { value: t('highlight1Value'), label: t('highlight1Label') },
            { value: t('highlight2Value'), label: t('highlight2Label') },
            { value: t('highlight3Value'), label: t('highlight3Label') },
          ].map((item) => (
            <div key={item.value} className="rounded-xl px-4 py-3 text-center">
              <p className="text-primary font-extrabold">{item.value}</p>
              <p className="text-subtitle-color mt-1 text-sm">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
