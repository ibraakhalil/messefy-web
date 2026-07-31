'use client';

import { useDeferredValue, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Search, ShieldCheck, UserRound, UserRoundCheck, Users, X } from 'lucide-react';
import { useMembers } from '@/hooks/use-members';
import { useWorkspace } from '@/providers/workspace-provider';
import type { Member } from '@/types/workspace';
import { useTranslations } from 'next-intl';

type RoleFilter = 'all' | 'owner' | 'manager' | 'member';

const ROLE_ORDER: Record<string, number> = {
  owner: 0,
  manager: 1,
  member: 2,
};

function getMemberName(member: Member, unnamedText: string) {
  return member.user?.name?.trim() || member.name?.trim() || unnamedText;
}

function getMemberInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

function roleBadgeClassName(role: string) {
  if (role === 'owner') {
    return 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-200';
  }

  if (role === 'manager') {
    return 'bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-200';
  }

  return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200';
}

function MemberListSkeleton() {
  const t = useTranslations('Mess.membersTab');
  return (
    <div className="tablet:grid-cols-2 grid gap-3" role="status" aria-label={t('loading')}>
      {Array.from({ length: 4 }, (_, index) => (
        <div
          key={index}
          className="border-border-color flex animate-pulse items-center gap-3 rounded-xl border p-4 motion-reduce:animate-none"
        >
          <div className="bg-card-shade size-11 rounded-xl" />
          <div className="flex-1 space-y-2">
            <div className="bg-card-shade h-3.5 w-2/5 rounded-full" />
            <div className="bg-card-shade h-3 w-3/5 rounded-full" />
          </div>
        </div>
      ))}
      <span className="sr-only">{t('loading')}</span>
    </div>
  );
}

export default function TotalMessMembers() {
  const t = useTranslations('Mess.membersTab');
  const currentMember = useWorkspace((state) => state.member);
  const workspaceId = currentMember?.workspaceId || '';
  const canManage = Boolean(currentMember && ['owner', 'manager'].includes(currentMember.role));
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const { data: members = [], isLoading, isError, refetch } = useMembers(workspaceId);

  const roleFilters: { value: RoleFilter; label: string }[] = [
    { value: 'all', label: t('all') },
    { value: 'owner', label: t('owners') },
    { value: 'manager', label: t('managers') },
    { value: 'member', label: t('members') },
  ];

  const registeredMemberCount = members.filter((member) => !member.isOffline).length;
  const offlineMemberCount = members.length - registeredMemberCount;

  const filteredMembers = useMemo(() => {
    return [...members]
      .sort((firstMember, secondMember) => {
        if (firstMember.id === currentMember?.id) return -1;
        if (secondMember.id === currentMember?.id) return 1;

        const roleDifference =
          (ROLE_ORDER[firstMember.role] ?? 3) - (ROLE_ORDER[secondMember.role] ?? 3);

        return (
          roleDifference ||
          getMemberName(firstMember, t('unnamedMember')).localeCompare(
            getMemberName(secondMember, t('unnamedMember')),
          )
        );
      })
      .filter((member) => {
        const matchesRole = roleFilter === 'all' || member.role === roleFilter;
        const searchableText = `${getMemberName(member, t('unnamedMember'))} ${
          member.isOffline ? '' : member.user?.email || ''
        }`.toLowerCase();

        return matchesRole && searchableText.includes(deferredQuery);
      });
  }, [currentMember?.id, deferredQuery, members, roleFilter, t]);

  const getRoleLabel = (role: string) => {
    if (role === 'owner') return t('owners').slice(0, -1) || role;
    if (role === 'manager') return t('managers').slice(0, -1) || role;
    if (role === 'member') return t('members').slice(0, -1) || role;
    return role;
  };

  return (
    <section className="border-border-color bg-card-bg overflow-hidden rounded-2xl border shadow-sm">
      <div className="tablet:p-6 border-border-color border-b p-5">
        <div className="laptop:flex-row laptop:items-start laptop:justify-between flex flex-col gap-5">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
              <Users className="size-5" aria-hidden="true" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-pure-color text-lg font-semibold">{t('totalMembers')}</h2>
                {!isLoading ? (
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800 tabular-nums dark:bg-emerald-500/15 dark:text-emerald-200">
                    {members.length}
                  </span>
                ) : null}
              </div>
              <p className="text-subtitle-color mt-1 text-sm">
                {t('all')}
              </p>
              {!isLoading && members.length > 0 ? (
                <div className="text-subtitle-secondary mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                  <span className="inline-flex items-center gap-1.5">
                    <UserRoundCheck className="size-3.5 text-emerald-600" aria-hidden="true" />
                    {registeredMemberCount} {t('registered')}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <UserRound className="size-3.5 text-orange-500" aria-hidden="true" />
                    {offlineMemberCount} {t('offline')}
                  </span>
                </div>
              ) : null}
            </div>
          </div>

          {canManage ? (
            <Link
              href="/mess/dashboard/members"
              className="text-pure-color border-border-color hover:bg-secondary-bg tablet:self-start inline-flex h-10 items-center justify-center gap-2 self-stretch rounded-xl border px-4 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            >
              {t('addMember')}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          ) : null}
        </div>

        <div className="laptop:flex-row laptop:items-center laptop:justify-between mt-5 flex flex-col gap-3">
          <label className="border-border-color bg-primary-bg laptop:max-w-sm flex h-11 w-full items-center gap-2 rounded-xl border px-3 transition focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/15">
            <Search className="text-subtitle-secondary size-4 shrink-0" aria-hidden="true" />
            <span className="sr-only">{t('searchPlaceholder')}</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('searchPlaceholder')}
              className="text-pure-color placeholder:text-subtitle-secondary min-w-0 flex-1 bg-transparent text-sm outline-none"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-subtitle-secondary hover:text-pure-color -mr-1 flex size-8 items-center justify-center rounded-lg transition-colors"
                aria-label="Clear"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            ) : null}
          </label>

          <div
            className="bg-secondary-bg flex gap-1 overflow-x-auto rounded-xl p-1"
            aria-label="Filter members by role"
          >
            {roleFilters.map((filter) => {
              const isSelected = roleFilter === filter.value;

              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setRoleFilter(filter.value)}
                  aria-pressed={isSelected}
                  className={`min-h-9 shrink-0 rounded-lg px-3 text-xs font-semibold transition-colors ${
                    isSelected
                      ? 'bg-card-bg text-pure-color shadow-sm'
                      : 'text-subtitle-color hover:text-pure-color'
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="tablet:p-6 p-4">
        {isLoading ? (
          <MemberListSkeleton />
        ) : isError ? (
          <div className="border-border-color bg-secondary-bg rounded-xl border p-6 text-center">
            <p className="text-pure-color text-sm font-semibold">{t('noMembersMatch')}</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-3 text-sm font-semibold text-emerald-700 hover:text-emerald-800 dark:text-emerald-300"
            >
              {t('clearFilters')}
            </button>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="border-border-color bg-secondary-bg rounded-xl border px-5 py-10 text-center">
            <Search className="text-subtitle-secondary mx-auto size-6" aria-hidden="true" />
            <p className="text-pure-color mt-3 text-sm font-semibold">{t('noMembersMatch')}</p>
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setRoleFilter('all');
              }}
              className="mt-4 text-sm font-semibold text-emerald-700 hover:text-emerald-800 dark:text-emerald-300"
            >
              {t('clearFilters')}
            </button>
          </div>
        ) : (
          <div className="tablet:grid-cols-2 grid gap-3">
            {filteredMembers.map((member) => {
              const name = getMemberName(member, t('unnamedMember'));
              const isCurrentMember = member.id === currentMember?.id;

              return (
                <article
                  key={member.id}
                  className="border-border-color flex min-w-0 items-center gap-3 rounded-xl border p-3.5 transition-colors [content-visibility:auto] hover:border-emerald-300 hover:bg-emerald-50/40 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/20"
                >
                  <div className="relative flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 text-sm font-bold text-emerald-800 dark:from-emerald-900/70 dark:to-teal-900/70 dark:text-emerald-100">
                    {getMemberInitials(name) || 'M'}
                    <span
                      className={`border-card-bg absolute -right-1 -bottom-1 size-3 rounded-full border-2 ${
                        member.isOffline ? 'bg-orange-400' : 'bg-emerald-500'
                      }`}
                      title={member.isOffline ? t('offline') : t('registered')}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                      <h3 className="text-pure-color truncate text-sm font-semibold">{name}</h3>
                      {isCurrentMember ? (
                        <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-200">
                          {t('you')}
                        </span>
                      ) : null}
                    </div>
                    <p className="text-subtitle-secondary mt-0.5 truncate text-xs">
                      {member.isOffline
                        ? t('offline')
                        : member.user?.email || t('registered')}
                    </p>
                  </div>

                  <span
                    className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${roleBadgeClassName(
                      member.role,
                    )}`}
                  >
                    {member.role === 'owner' ? (
                      <ShieldCheck className="size-3" aria-hidden="true" />
                    ) : null}
                    {getRoleLabel(member.role)}
                  </span>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
