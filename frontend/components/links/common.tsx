import Link from 'next/link';
import { ReactNode } from 'react';
import { LinkProps } from 'next/link';

interface HomeLinkProps extends Omit<LinkProps, 'href'> {
  children: ReactNode;
  className?: string;
}

export function HomeLink({ children, className, ...props }: HomeLinkProps) {
  return (
    <Link href="/" className={className} {...props}>
      {children}
    </Link>
  );
}
