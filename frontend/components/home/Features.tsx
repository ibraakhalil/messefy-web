import {
  BadgeDollarSign,
  CalendarRange,
  ClipboardList,
  ReceiptText,
  ShieldCheck,
  UserRoundPlus,
  Utensils,
  WalletCards,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

const featureCards = [
  {
    icon: Utensils,
    id: 'mealEntry',
    className: 'tablet:col-span-2 laptop:col-span-1',
    accent: 'bg-emerald-600/10 text-emerald-700 dark:text-emerald-300',
  },
  {
    icon: WalletCards,
    id: 'deposits',
    className: '',
    accent: 'bg-blue-600/10 text-blue-700 dark:text-blue-300',
  },
  {
    icon: ReceiptText,
    id: 'expenses',
    className: '',
    accent: 'bg-amber-600/10 text-amber-700 dark:text-amber-300',
  },
  {
    icon: BadgeDollarSign,
    id: 'balance',
    className: 'tablet:col-span-2',
    accent: 'bg-rose-600/10 text-rose-700 dark:text-rose-300',
  },
  {
    icon: UserRoundPlus,
    id: 'members',
    className: '',
    accent: 'bg-violet-600/10 text-violet-700 dark:text-violet-300',
  },
  {
    icon: CalendarRange,
    id: 'periods',
    className: '',
    accent: 'bg-cyan-600/10 text-cyan-700 dark:text-cyan-300',
  },
] as const;

export const Features = () => {
  const t = useTranslations('Home.features');

  return (
    <section
      id="features"
      className="border-border-color bg-secondary-bg tablet:py-24 border-y py-18"
    >
      <div className="tablet:px-6 container px-4">
        <div className="laptop:grid-cols-[0.78fr_1.22fr] laptop:items-end grid gap-8">
          <div>
            <span className="text-primary inline-flex items-center gap-2 text-sm font-extrabold tracking-wide">
              <ClipboardList className="size-4" />
              {t('eyebrow')}
            </span>
            <h2 className="tablet:text-5xl mt-4 max-w-[14ch] text-3xl leading-tight font-black tracking-[-0.03em]">
              {t('title')}
            </h2>
          </div>
          <p className="text-subtitle-color tablet:text-lg max-w-2xl text-base leading-7">
            {t('description')}
          </p>
        </div>

        <div className="tablet:grid-cols-2 laptop:grid-cols-3 mt-12 grid gap-4">
          {featureCards.map(({ icon: Icon, id, className, accent }) => (
            <article
              key={id}
              className={`group border-border-color bg-card-bg hover:border-primary/30 rounded-2xl border p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-28px_rgba(11,54,40,0.38)] ${className}`}
            >
              <div className={`flex size-11 items-center justify-center rounded-xl ${accent}`}>
                <Icon className="size-5" />
              </div>
              <h3 className="tablet:text-xl mt-5 text-lg font-extrabold tracking-tight">
                {t(`${id}.title`)}
              </h3>
              <p className="text-subtitle-color tablet:text-base mt-2 text-sm leading-6">
                {t(`${id}.description`)}
              </p>
            </article>
          ))}
        </div>

        <div className="tablet:flex-row tablet:items-center tablet:px-7 mt-5 flex flex-col items-start justify-between gap-4 rounded-2xl border border-emerald-700/15 bg-emerald-700/8 px-5 py-5">
          <div className="flex items-start gap-3">
            <span className="bg-primary text-primary-fg mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full">
              <ShieldCheck className="size-4.5" />
            </span>
            <div>
              <p className="font-extrabold">{t('roles.title')}</p>
              <p className="text-subtitle-color mt-1 text-sm leading-6">{t('roles.description')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
