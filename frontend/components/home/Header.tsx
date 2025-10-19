'use client';

import { Menu } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import Logo from '../common/logo';
import { Session } from 'next-auth';
import Button from '../ui/button';
import UserDropdown from '../common/user-dropdown';
import { Workspace } from '@/types/workspace';

interface HeaderProps {
  userData: {
    user: Session['user'];
    workspace: Workspace | undefined;
  };
}

const navItems = [
  {
    id: 'features',
    label: 'Features',
    href: '#features',
  },
  {
    id: 'how',
    label: 'How it works',
    href: '#how',
  },
  {
    id: 'about',
    label: 'About',
    href: '/about',
  },
  {
    id: 'contact',
    label: 'Contact',
    href: '/contact',
  },
];

function NavItem({ children }: { children: string }) {
  return (
    <span
      key={children}
      className="group relative text-base font-medium text-gray-600 transition-colors duration-200 hover:text-gray-900"
    >
      {children}
      <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-emerald-600 to-teal-600 transition-all duration-300 group-hover:w-full"></span>
    </span>
  );
}

export const Header = ({ userData }: HeaderProps) => {
  const { user } = userData;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header
      id="top"
      className="sticky top-0 z-50 w-full border-b border-gray-200/20 bg-white/80 backdrop-blur-lg"
    >
      <div className="container flex max-w-7xl items-center justify-between px-4 py-4">
        <Logo />

        <nav className="tablet:flex hidden items-center gap-8">
          {navItems.map((item) => (
            <Link href={item.href} key={item.id}>
              <NavItem>{item.label}</NavItem>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {!user && (
            <Link href="/auth/signin">
              <Button>Get Started</Button>
            </Link>
          )}
          {user && <UserDropdown />}

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="tablet:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white/80 text-gray-600 shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-gray-300 hover:text-gray-900 hover:shadow-md"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Enhanced Mobile menu */}
      <div
        className={`container max-w-7xl px-4 ${
          isMenuOpen ? 'block' : 'hidden'
        } tablet:hidden border-t border-gray-200/50 bg-white/95 backdrop-blur-lg`}
      >
        <nav className="space-y-1 py-4">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="block rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-gray-50/80 hover:text-gray-900"
            >
              {item.label}
            </a>
          ))}
          <div className="mt-2 border-t border-gray-200/50 pt-2">
            <a
              href="/auth/signin"
              className="block rounded-xl border border-gray-200/60 bg-gray-50/50 px-4 py-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-100/80 hover:text-gray-900"
            >
              Sign in
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
