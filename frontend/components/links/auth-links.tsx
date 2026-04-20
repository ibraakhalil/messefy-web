import { ComponentProps } from 'react';
import Link from 'next/link';

type LinkProps = Omit<ComponentProps<typeof Link>, 'href'>;

export function SignUpLink({ children, ...props }: LinkProps) {
  return (
    <Link href="/auth/signup" {...props}>
      {children}
    </Link>
  );
}

export function SignInLink({ children, ...props }: LinkProps) {
  return (
    <Link href="/auth/signin" {...props}>
      {children}
    </Link>
  );
}
