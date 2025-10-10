import Link from 'next/link';
import { ReactNode } from 'react';
import { LinkProps } from 'next/link';
import { getUrl } from '@/utils/get-url';

interface HomeLinkProps extends Omit<LinkProps, 'href'> {
  children: ReactNode;
  className?: string;
}

export function HomeLink({ children, className, ...props }: HomeLinkProps) {
  return (
    <Link href={getUrl('/')} className={className} {...props}>
      {children}
    </Link>
  );
}
