import { ComponentProps } from 'react';
import Link from 'next/link';

type LinkProps = Omit<ComponentProps<typeof Link>, 'href'>;

export function MessLink({ children, ...props }: LinkProps) {
  return (
    <Link href="/mess" {...props}>
      {children}
    </Link>
  );
}

export function MessCreate({ children, ...props }: LinkProps) {
  return (
    <Link href="/mess/create" {...props}>
      {children}
    </Link>
  );
}

export function MessDashboard({ children, ...props }: LinkProps) {
  return (
    <Link href="/mess/dashboard" {...props}>
      {children}
    </Link>
  );
}
