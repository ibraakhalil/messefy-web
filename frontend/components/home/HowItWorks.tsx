import { ArrowDown, CalendarPlus, LineChart, ListPlus, UsersRound } from 'lucide-react';
import { useTranslations } from 'next-intl';

const steps = [
  {
    id: 'step1',
    icon: CalendarPlus,
  },
  {
    id: 'step2',
    icon: UsersRound,
  },
  {
    id: 'step3',
    icon: ListPlus,
  },
  {
    id: 'step4',
    icon: LineChart,
  },
] as const;

export const HowItWorks = () => {
  const t = useTranslations('Home.how');

  return (
    <section id="how" className="tablet:py-24 py-18">
      <div className="tablet:px-6 container px-4">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-primary text-sm font-extrabold tracking-wide">{t('eyebrow')}</p>
          <h2 className="tablet:text-5xl mt-4 text-3xl leading-tight font-black tracking-[-0.03em]">
            {t('title')}
          </h2>
          <p className="text-subtitle-color tablet:text-lg mx-auto mt-5 max-w-2xl text-base leading-7">
            {t('description')}
          </p>
        </div>

        <ol className="laptop:grid-cols-4 relative mt-12 grid gap-4">
          {steps.map(({ id, icon: Icon }, index) => (
            <li key={id} className="relative">
              <article className="border-border-color bg-card-bg tablet:p-6 h-full rounded-2xl border p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-primary text-sm font-black tracking-[0.16em]">
                    {t(`${id}.number`)}
                  </span>
                  <span className="bg-secondary-bg text-primary flex size-10 items-center justify-center rounded-xl">
                    <Icon className="size-5" />
                  </span>
                </div>
                <h3 className="mt-8 text-lg font-extrabold">{t(`${id}.title`)}</h3>
                <p className="text-subtitle-color mt-2 text-sm leading-6">
                  {t(`${id}.description`)}
                </p>
              </article>
              {index < steps.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="text-border-color laptop:absolute laptop:top-1/2 laptop:-right-[14px] laptop:z-10 laptop:-translate-y-1/2 laptop:rotate-[-90deg] mx-auto flex h-7 items-center justify-center"
                >
                  <ArrowDown className="size-5" />
                </span>
              ) : null}
            </li>
          ))}
        </ol>

        <div className="mt-12 overflow-hidden rounded-[1.75rem] bg-[#103d31] text-white dark:bg-emerald-950">
          <div className="tablet:px-10 tablet:py-10 laptop:grid-cols-[0.95fr_1.05fr] laptop:items-center grid gap-8 px-6 py-8">
            <div>
              <p className="text-sm font-bold text-emerald-300">{t('managerEyebrow')}</p>
              <h3 className="tablet:text-3xl mt-3 text-2xl leading-tight font-black">
                {t('managerTitle')}
              </h3>
            </div>
            <div className="grid gap-3 min-[520px]:grid-cols-3">
              {[
                { label: t('todayMeals'), value: '12.5' },
                { label: t('monthExpense'), value: '৳21,446' },
                { label: t('pendingEntries'), value: t('pendingEntriesValue') },
              ].map((item) => (
                <div key={item.label} className="rounded-xl bg-white/8 p-4 ring-1 ring-white/10">
                  <p className="text-xs text-emerald-100/70">{item.label}</p>
                  <p className="mt-2 text-xl font-black">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
