import { ArrowUp, Heart } from 'lucide-react';
import Link from 'next/link';
import Logo from '../common/logo';
import { useTranslations } from 'next-intl';

const footerLinks = [
  { id: 'features', href: '#features' },
  { id: 'how', href: '#how' },
  { id: 'faq', href: '#faq' },
  { id: 'signIn', href: '/auth/signin' },
] as const;

export const Footer = () => {
  const t = useTranslations('Home.footer');

  return (
    <footer className="border-border-color bg-secondary-bg border-t">
      <div className="tablet:px-6 container px-4 py-10">
        <div className="tablet:flex-row tablet:items-center tablet:justify-between flex flex-col gap-8">
          <div>
            <Logo className="[&_span]:text-xl" />
            <p className="text-subtitle-color mt-3 max-w-md text-sm leading-6">
              {t('description')}
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-5 gap-y-3" aria-label={t('navigation')}>
            {footerLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className="text-subtitle-color hover:text-primary text-sm font-semibold transition-colors"
              >
                {t(link.id)}
              </Link>
            ))}
          </nav>
        </div>

        <div className="border-border-color text-subtitle-color tablet:flex-row tablet:items-center tablet:justify-between mt-8 flex flex-col gap-4 border-t pt-6 text-sm">
          <p className="flex flex-wrap items-center gap-1.5">
            © {new Date().getFullYear()} Mess Mate
            <span aria-hidden="true">·</span>
            {t('madeIn')}
            <Heart className="size-3.5 fill-rose-500 text-rose-500" aria-label={t('love')} />
            {t('withLove')}
          </p>
          <Link
            href="#top"
            className="text-pure-color hover:text-primary inline-flex w-fit items-center gap-2 font-semibold transition-colors"
          >
            {t('backToTop')}
            <ArrowUp className="size-4" />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
