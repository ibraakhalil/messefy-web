import { ComponentProps } from 'react';
import Link from 'next/link';

type LinkProps = Omit<ComponentProps<typeof Link>, 'href'>;

export function MessLink({ children, ...props }: LinkProps) {
  return (
    <Link href="/mess" {...props}>
      {' '}
      {children}{' '}
    </Link>
  );
}
export function MessCreate({ children, ...props }: LinkProps) {
  return (
    <Link href="/mess/create" {...props}>
      {' '}
      {children}{' '}
    </Link>
  );
}
export function MessDashboard({ children, ...props }: LinkProps) {
  return (
    <Link href="/mess/dashboard" {...props}>
      {' '}
      {children}{' '}
    </Link>
  );
}

export function DataEntryLink({ children, ...props }: LinkProps) {
  return (
    <Link href="/mess/dashboard/data-entry" {...props}>
      {children}
    </Link>
  );
}

export function InvitationsLink({ children, ...props }: LinkProps) {
  return (
    <Link href="/mess/dashboard/invitations" {...props}>
      {children}
    </Link>
  );
}

export function CurrentMonthLink({ children, ...props }: LinkProps) {
  return (
    <Link href="/mess/dashboard/current-month" {...props}>
      {children}
    </Link>
  );
}

export function MemberBalancesLink({ children, ...props }: LinkProps) {
  return (
    <Link href="/mess/dashboard/member-balances" {...props}>
      {children}
    </Link>
  );
}

export function MembersLink({ children, ...props }: LinkProps) {
  return (
    <Link href="/mess/dashboard/members" {...props}>
      {children}
    </Link>
  );
}

export function AllMonthsLink({ children, ...props }: LinkProps) {
  return (
    <Link href="/mess/dashboard/all-months" {...props}>
      {children}
    </Link>
  );
}

export function SettingsLink({ children, ...props }: LinkProps) {
  return (
    <Link href="/mess/dashboard/settings" {...props}>
      {children}
    </Link>
  );
}
