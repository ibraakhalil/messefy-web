'use client';

import { ArrowRight, LayoutDashboard, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import Logo from '../common/logo';
import { Session } from 'next-auth';
import UserDropdown from '../common/user-dropdown';
import ThemeToggle from '../common/theme-toggle';
import LocaleSwitcher from '../common/locale-switcher';
import { useTranslations } from 'next-intl';

interface HeaderProps {
  user: Session['user'] | undefined;
}

export const Header = ({ user }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations('Home.header');
  const navItems = [
    { id: 'features', label: t('features'), href: '#features' },
    { id: 'how', label: t('how'), href: '#how' },
    { id: 'faq', label: t('faq'), href: '#faq' },
  ] as const;

  return (
    <header
      id="top"
      className="border-border-color/70 bg-primary-bg/90 sticky top-0 z-50 w-full border-b backdrop-blur-xl"
    >
      <div className="tablet:px-6 container flex h-[72px] items-center justify-between px-4">
        <Logo className="[&_span]:text-xl" />

        <nav className="tablet:flex hidden items-center gap-7" aria-label={t('primaryNavigation')}>
          {navItems.map((item) => (
            <Link
              href={item.href}
              key={item.id}
              className="text-subtitle-color hover:text-primary focus-visible:outline-primary text-sm font-medium transition-colors focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <ThemeToggle />
          {user ? (
            <div className="tablet:flex hidden items-center gap-2">
              <Link
                href="/mess"
                className="bg-primary text-primary-fg focus-visible:outline-primary inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <LayoutDashboard className="size-4" />
                {t('workspace')}
              </Link>
              <UserDropdown />
            </div>
          ) : (
            <div className="tablet:flex hidden items-center gap-2">
              <Link
                href="/auth/signin"
                className="text-subtitle-color hover:text-pure-color rounded-lg px-3 py-2 text-sm font-semibold transition-colors"
              >
                {t('signIn')}
              </Link>
              <Link
                href="/auth/signup"
                className="bg-primary text-primary-fg focus-visible:outline-primary inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                {t('getStarted')}
                <ArrowRight className="size-4" />
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="border-border-color bg-card-bg text-pure-color hover:bg-secondary-bg tablet:hidden flex h-10 w-10 items-center justify-center rounded-lg border transition-colors"
            aria-label={isMenuOpen ? t('closeMenu') : t('openMenu')}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={`${isMenuOpen ? 'block' : 'hidden'} border-border-color bg-primary-bg tablet:hidden border-t`}
      >
        <nav className="container space-y-1 px-4 py-4" aria-label={t('mobileNavigation')}>
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className="text-subtitle-color hover:bg-secondary-bg hover:text-pure-color block rounded-lg px-3 py-3 text-sm font-medium transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <div
            className={`border-border-color mt-3 grid gap-2 border-t pt-4 ${
              user ? 'grid-cols-1' : 'grid-cols-2'
            }`}
          >
            {!user ? (
              <Link
                href="/auth/signin"
                className="border-border-color bg-card-bg inline-flex h-11 items-center justify-center rounded-lg border px-4 text-sm font-semibold"
              >
                {t('signIn')}
              </Link>
            ) : null}
            <Link
              href={user ? '/mess' : '/auth/signup'}
              className="bg-primary text-primary-fg inline-flex h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold"
            >
              {user ? t('goToWorkspace') : t('getStarted')}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
