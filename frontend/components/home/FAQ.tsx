import { ChevronDown, HelpCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

const faqItems = ['item1', 'item2', 'item3', 'item4', 'item5'] as const;

const FAQ = () => {
  const t = useTranslations('Home.faq');

  return (
    <section id="faq" className="border-border-color bg-secondary-bg tablet:py-24 border-y py-18">
      <div className="tablet:px-6 laptop:grid-cols-[0.72fr_1.28fr] container grid gap-10 px-4">
        <div className="laptop:sticky laptop:top-28 laptop:self-start">
          <span className="bg-primary text-primary-fg flex size-11 items-center justify-center rounded-xl">
            <HelpCircle className="size-5" />
          </span>
          <h2 className="tablet:text-5xl mt-5 max-w-[12ch] text-3xl leading-tight font-black tracking-[-0.03em]">
            {t('title')}
          </h2>
          <p className="text-subtitle-color mt-4 max-w-md text-base leading-7">
            {t('description')}
          </p>
        </div>

        <div className="space-y-3">
          {faqItems.map((item, index) => (
            <details
              key={item}
              className="group border-border-color bg-card-bg open:border-primary/25 rounded-2xl border open:shadow-sm"
              open={index === 0}
            >
              <summary className="focus-visible:outline-primary tablet:px-6 flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 font-extrabold focus-visible:rounded-2xl focus-visible:outline-2">
                <span>{t(`${item}.question`)}</span>
                <span className="bg-secondary-bg text-subtitle-color flex size-8 shrink-0 items-center justify-center rounded-full transition-transform group-open:rotate-180">
                  <ChevronDown className="size-4" />
                </span>
              </summary>
              <p className="text-subtitle-color tablet:px-6 tablet:text-base px-5 pb-5 text-sm leading-7">
                {t(`${item}.answer`)}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
