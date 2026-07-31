'use client';

import LocaleSwitcher from '@/components/common/locale-switcher';
import ThemeToggle from '@/components/common/theme-toggle';
import Button from '@/components/ui/button';
import FormInput from '@/components/ui/form-input';
import { updateWorkspace } from '@/lib/workspace-requests';
import { useWorkspace } from '@/providers/workspace-provider';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import {
  ArrowRight,
  CalendarDays,
  KeyRound,
  Languages,
  Link2,
  MoonStar,
  Save,
  Send,
  Settings2,
  ShieldCheck,
  Trash2,
  Users,
} from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

const workspaceSchema = z.object({
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().max(500),
});

type WorkspaceFormValues = z.infer<typeof workspaceSchema>;

const cardClass =
  'rounded-2xl border border-border-color bg-card-bg shadow-sm dark:border-gray-800 dark:bg-gray-900/70';

function SettingsLink({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: typeof Users;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group border-border-color bg-secondary-bg/55 hover:bg-secondary-bg flex items-center gap-4 rounded-xl border p-4 transition-colors hover:border-emerald-500/50 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:border-gray-800 dark:bg-gray-800/45"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm dark:bg-gray-900 dark:text-emerald-400">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="text-pure-color block font-semibold">{title}</span>
        <span className="text-subtitle-color mt-0.5 block text-sm">{description}</span>
      </span>
      <ArrowRight
        className="text-subtitle-secondary size-4 shrink-0 transition-transform group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </Link>
  );
}

export default function MessSettingsPage() {
  const t = useTranslations('Settings');
  const locale = useLocale();
  const router = useRouter();
  const member = useWorkspace((state) => state.member);
  const setMember = useWorkspace((state) => state.setMember);
  const workspace = member?.workspace;
  const isOwner = member?.role === 'owner';

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<WorkspaceFormValues>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: { name: '', description: '' },
  });

  useEffect(() => {
    reset({
      name: workspace?.name ?? '',
      description: workspace?.description ?? '',
    });
  }, [reset, workspace?.description, workspace?.name]);

  const updateMutation = useMutation({
    mutationFn: (values: WorkspaceFormValues) => updateWorkspace(workspace?.id ?? '', values),
    onSuccess: (updatedWorkspace) => {
      if (member) setMember({ ...member, workspace: updatedWorkspace });
      reset({
        name: updatedWorkspace.name,
        description: updatedWorkspace.description ?? '',
      });
      toast.success(t('saved'));
      router.refresh();
    },
    onError: (error) => {
      const message =
        (error as { response?: { data?: { error?: string } } }).response?.data?.error ??
        t('saveFailed');
      toast.error(message);
    },
  });

  if (!workspace || !member) return null;

  const createdDate = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(workspace.createdAt));

  return (
    <div className="tablet:px-6 tablet:py-8 laptop:px-8 min-h-full px-4 py-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="laptop:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.85fr)] grid gap-6">
          <div className="space-y-6">
            <section className={cardClass} aria-labelledby="workspace-settings-title">
              <div className="border-border-color tablet:p-6 border-b p-5 dark:border-gray-800">
                <div className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                    <Settings2 className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h2 id="workspace-settings-title" className="text-pure-color font-semibold">
                      {t('workspaceDetails')}
                    </h2>
                    <p className="text-subtitle-color mt-1 text-sm">{t('workspaceDetailsDesc')}</p>
                  </div>
                </div>
              </div>

              <form
                onSubmit={handleSubmit((values) => updateMutation.mutate(values))}
                className="tablet:p-6 space-y-5 p-5"
              >
                <FormInput
                  id="workspace-name"
                  label={t('messName')}
                  placeholder={t('messNamePlaceholder')}
                  disabled={!isOwner || updateMutation.isPending}
                  error={errors.name ? t('nameError') : undefined}
                  {...register('name')}
                />

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <label
                      htmlFor="workspace-description"
                      className="text-subtitle-color text-sm font-medium"
                    >
                      {t('descriptionLabel')}
                    </label>
                    <span className="text-subtitle-secondary text-xs">{t('optional')}</span>
                  </div>
                  <textarea
                    id="workspace-description"
                    rows={4}
                    disabled={!isOwner || updateMutation.isPending}
                    placeholder={t('descriptionPlaceholder')}
                    className="border-border-color bg-card-bg text-pure-color block w-full resize-y rounded-lg border px-4 py-3 placeholder:text-sm placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none disabled:bg-gray-100 disabled:opacity-75 dark:border-gray-700 dark:bg-gray-800 dark:disabled:bg-gray-800/50"
                    {...register('description')}
                  />
                  {errors.description ? (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {t('descriptionError')}
                    </p>
                  ) : null}
                </div>

                {!isOwner ? (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
                    <div className="flex gap-2.5">
                      <KeyRound className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                      <p>{t('ownerOnlyNotice')}</p>
                    </div>
                  </div>
                ) : null}

                <div className="border-border-color tablet:flex-row tablet:items-center tablet:justify-between flex flex-col-reverse gap-3 border-t pt-5 dark:border-gray-800">
                  <p className="text-subtitle-secondary text-xs">{t('savedImmediately')}</p>
                  {isOwner ? (
                    <Button
                      type="submit"
                      isLoading={updateMutation.isPending}
                      disabled={!isDirty}
                      className="tablet:w-auto w-full"
                    >
                      <Save className="size-4" aria-hidden="true" />
                      {updateMutation.isPending ? t('saving') : t('saveChanges')}
                    </Button>
                  ) : null}
                </div>
              </form>
            </section>

            <section className={`${cardClass} tablet:p-6 p-5`} aria-labelledby="management-title">
              <div className="mb-5">
                <h2 id="management-title" className="text-pure-color font-semibold">
                  {t('management')}
                </h2>
                <p className="text-subtitle-color mt-1 text-sm">{t('managementDesc')}</p>
              </div>
              <div className="tablet:grid-cols-2 grid gap-3">
                <SettingsLink
                  href="/mess/dashboard/members"
                  icon={Users}
                  title={t('members')}
                  description={t('membersDesc')}
                />
                <SettingsLink
                  href="/mess/dashboard/invitations"
                  icon={Send}
                  title={t('invitations')}
                  description={t('invitationsDesc')}
                />
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className={`${cardClass} tablet:p-6 p-5`} aria-labelledby="preferences-title">
              <h2 id="preferences-title" className="text-pure-color font-semibold">
                {t('preferences')}
              </h2>
              <p className="text-subtitle-color mt-1 text-sm">{t('preferencesDesc')}</p>
              <div className="divide-border-color mt-5 divide-y dark:divide-gray-800">
                <div className="flex items-center justify-between gap-4 pb-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <Languages className="size-5 shrink-0 text-emerald-600" aria-hidden="true" />
                    <div>
                      <p className="text-pure-color text-sm font-medium">{t('language')}</p>
                      <p className="text-subtitle-secondary text-xs">
                        {locale === 'bn' ? 'বাংলা' : 'English'}
                      </p>
                    </div>
                  </div>
                  <LocaleSwitcher />
                </div>
                <div className="flex items-center justify-between gap-4 pt-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <MoonStar className="size-5 shrink-0 text-emerald-600" aria-hidden="true" />
                    <div>
                      <p className="text-pure-color text-sm font-medium">{t('appearance')}</p>
                      <p className="text-subtitle-secondary text-xs">{t('appearanceDesc')}</p>
                    </div>
                  </div>
                  <ThemeToggle />
                </div>
              </div>
            </section>

            <section
              className={`${cardClass} tablet:p-6 p-5`}
              aria-labelledby="workspace-info-title"
            >
              <h2 id="workspace-info-title" className="text-pure-color font-semibold">
                {t('workspaceInfo')}
              </h2>
              <dl className="mt-5 space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <Link2
                    className="text-subtitle-secondary mt-0.5 size-4 shrink-0"
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <dt className="text-subtitle-secondary">{t('workspaceSlug')}</dt>
                    <dd className="text-pure-color mt-0.5 truncate font-medium">
                      {workspace.slug}
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CalendarDays
                    className="text-subtitle-secondary mt-0.5 size-4 shrink-0"
                    aria-hidden="true"
                  />
                  <div>
                    <dt className="text-subtitle-secondary">{t('createdOn')}</dt>
                    <dd className="text-pure-color mt-0.5 font-medium">{createdDate}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ShieldCheck
                    className="text-subtitle-secondary mt-0.5 size-4 shrink-0"
                    aria-hidden="true"
                  />
                  <div>
                    <dt className="text-subtitle-secondary">{t('yourRole')}</dt>
                    <dd className="text-pure-color mt-0.5 font-medium">
                      {isOwner ? t('owner') : t('manager')}
                    </dd>
                  </div>
                </div>
              </dl>
            </section>

            {isOwner ? (
              <section
                className="tablet:p-6 rounded-2xl border border-red-200 bg-red-50/70 p-5 dark:border-red-950 dark:bg-red-950/20"
                aria-labelledby="danger-title"
              >
                <div className="flex gap-3">
                  <Trash2
                    className="mt-0.5 size-5 shrink-0 text-red-600 dark:text-red-400"
                    aria-hidden="true"
                  />
                  <div>
                    <h2 id="danger-title" className="font-semibold text-red-900 dark:text-red-200">
                      {t('dangerZone')}
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-red-700 dark:text-red-300">
                      {t('dangerDesc')}
                    </p>
                  </div>
                </div>
                <Link
                  href="/mess/dashboard/delete-mess"
                  className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-red-300 bg-white px-3 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-950"
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                  {t('deleteMess')}
                </Link>
              </section>
            ) : null}
          </aside>
        </div>
      </div>
    </div>
  );
}
