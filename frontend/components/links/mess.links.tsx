'use client';

import { ComponentProps } from 'react';
import Link from 'next/link';
import { useCurrentPeriod } from '@/hooks/use-periods';
import { useWorkspace } from '@/providers/workspace-provider';

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

export function InvitationsLink({ children, ...props }: LinkProps) {
  return (
    <Link href="/mess/dashboard/invitations" {...props}>
      {children}
    </Link>
  );
}

export function CurrentMonthLink({ children, ...props }: LinkProps) {
  const workspaceId = useWorkspace().member?.workspaceId || '';
  const { data: currentPeriod } = useCurrentPeriod(workspaceId);
  const href = currentPeriod
    ? `/mess/dashboard/all-months/${currentPeriod.id}`
    : '/mess/dashboard/all-months';

  return (
    <Link href={href} {...props}>
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
