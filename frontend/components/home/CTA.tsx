import { ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface CTAProps {
  isAuthenticated: boolean;
}

const CTA = ({ isAuthenticated }: CTAProps) => {
  const t = useTranslations('Home.cta');

  return (
    <section className="tablet:py-24 py-18">
      <div className="tablet:px-6 container px-4">
        <div className="tablet:px-12 tablet:py-16 relative overflow-hidden rounded-[2rem] bg-[#103d31] px-6 py-12 text-center text-white shadow-[0_30px_80px_-42px_rgba(6,78,59,0.85)] dark:bg-emerald-950">
          <div
            aria-hidden="true"
            className="absolute -top-28 -right-20 size-72 rounded-full border-[44px] border-amber-300/10"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-32 -left-20 size-64 rounded-full bg-emerald-300/8"
          />
          <div className="relative mx-auto max-w-3xl">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
              <CheckCircle2 className="size-6 text-emerald-300" />
            </div>
            <h2 className="tablet:text-5xl mt-6 text-3xl leading-tight font-black tracking-[-0.03em]">
              {t('title')}
            </h2>
            <p className="tablet:text-lg mx-auto mt-5 max-w-2xl text-base leading-7 text-emerald-50/75">
              {t('description')}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 min-[480px]:flex-row">
              <Link
                href={isAuthenticated ? '/mess' : '/auth/signup'}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-amber-300 px-6 font-extrabold text-emerald-950 transition hover:-translate-y-0.5 hover:bg-amber-200 min-[480px]:w-auto"
              >
                {isAuthenticated ? t('goToWorkspace') : t('startFree')}
                <ArrowRight className="size-5" />
              </Link>
              {!isAuthenticated ? (
                <Link
                  href="/auth/signin"
                  className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-white/20 bg-white/8 px-6 font-bold text-white transition hover:bg-white/12 min-[480px]:w-auto"
                >
                  {t('hasAccount')}
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
