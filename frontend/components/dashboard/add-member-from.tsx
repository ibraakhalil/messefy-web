'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
  Check,
  Copy,
  Info,
  LoaderCircle,
  Mail,
  UserPlus,
  UserRound,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { useWorkspace } from '@/providers/workspace-provider';
import api from '@/utils/axios';
import Button from '../ui/button';
import FormInput from '../ui/form-input';
import { ResponsiveDialog, useResponsiveDialog } from '../ui/responsive-dialog';

const memberFormSchema = z
  .object({
    type: z.enum(['online', 'offline']),
    email: z.string(),
    name: z.string(),
  })
  .superRefine((values, context) => {
    if (values.type === 'online') {
      const result = z.string().trim().email('Enter a valid email address').safeParse(values.email);
      if (!result.success) {
        context.addIssue({
          code: 'custom',
          path: ['email'],
          message: result.error.issues[0].message,
        });
      }
      return;
    }

    if (values.name.trim().length < 2) {
      context.addIssue({
        code: 'custom',
        path: ['name'],
        message: 'Enter at least 2 characters',
      });
    }
  });

const addMemberResponseSchema = z.object({
  generatedCredentials: z
    .object({
      email: z.string().email(),
      password: z.string().min(1),
    })
    .nullable(),
});

type MemberFormValues = z.infer<typeof memberFormSchema>;
type GeneratedCredentials = NonNullable<
  z.infer<typeof addMemberResponseSchema>['generatedCredentials']
>;

const memberTypeOptions = [
  {
    value: 'online' as const,
    label: 'Online member',
    description: 'Add by email',
    icon: Wifi,
  },
  {
    value: 'offline' as const,
    label: 'Offline member',
    description: 'Create a new profile',
    icon: WifiOff,
  },
];

export default function AddMemberForm({ onSuccess }: { onSuccess: () => void }) {
  const [generatedCredentials, setGeneratedCredentials] = useState<GeneratedCredentials | null>(
    null,
  );
  const [hasCopiedCredentials, setHasCopiedCredentials] = useState(false);
  const member = useWorkspace((state) => state.member);
  const workspaceId = member?.workspace?.id;
  const { close } = useResponsiveDialog();
  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<MemberFormValues>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: { type: 'online', email: '', name: '' },
  });
  const memberType = useWatch({ control, name: 'type' });

  const addMemberMutation = useMutation({
    mutationFn: async (values: MemberFormValues) => {
      if (!workspaceId) throw new Error('Workspace not found');

      const payload =
        values.type === 'offline'
          ? { type: 'offline' as const, name: values.name.trim() }
          : { type: 'online' as const, email: values.email.trim().toLowerCase() };
      const response = await api.post(`/members/${workspaceId}`, payload);

      return addMemberResponseSchema.parse(response.data);
    },
    onSuccess: (data, values) => {
      toast.success(values.type === 'offline' ? 'Offline member created' : 'Member added');
      onSuccess();

      if (data.generatedCredentials) {
        setGeneratedCredentials(data.generatedCredentials);
        reset({ type: 'offline', email: '', name: '' });
        return;
      }

      close();
    },
    onError: (error: unknown) => {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.error || 'Could not add this member. Please try again.'
          : error instanceof Error
            ? error.message
            : 'Could not add this member. Please try again.';

      setError('root', { message });
      toast.error(message);
    },
  });

  const selectMemberType = (type: MemberFormValues['type']) => {
    setValue('type', type);
    clearErrors();
    setGeneratedCredentials(null);
    setHasCopiedCredentials(false);
  };

  const copyCredentials = async () => {
    if (!generatedCredentials) return;

    try {
      await navigator.clipboard.writeText(
        `Email: ${generatedCredentials.email}\nPassword: ${generatedCredentials.password}`,
      );
      setHasCopiedCredentials(true);
      toast.success('Credentials copied');
    } catch {
      toast.error('Could not copy. Select the credentials and copy them manually.');
    }
  };

  return (
    <form onSubmit={handleSubmit((values) => addMemberMutation.mutate(values))}>
      <ResponsiveDialog.Header>
        <div className="flex items-start gap-3 text-left">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            <UserPlus className="size-5" aria-hidden="true" />
          </div>
          <div className="min-w-0 pt-0.5">
            <ResponsiveDialog.Title>Add Member</ResponsiveDialog.Title>
            <ResponsiveDialog.Description>
              Add an existing account or create a profile for someone without one.
            </ResponsiveDialog.Description>
          </div>
        </div>
      </ResponsiveDialog.Header>

      <div className="space-y-5 px-4 pb-2 md:px-0 md:pb-0">
        <div
          role="group"
          aria-label="Member type"
          className="bg-secondary-bg mt-3 grid grid-cols-2 gap-1 rounded-xl p-1 md:mt-0"
        >
          {memberTypeOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = memberType === option.value;

            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={isSelected}
                onClick={() => selectMemberType(option.value)}
                className={`touch-manipulation rounded-lg px-3 py-2.5 text-left transition-[background-color,color,box-shadow] focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:outline-none ${
                  isSelected
                    ? 'bg-card-bg text-pure-color shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                    : 'text-subtitle-color hover:bg-card-bg/60 hover:text-pure-color'
                }`}
              >
                <span className="flex items-center justify-center gap-2 text-sm font-semibold sm:justify-start">
                  <Icon className="size-4" aria-hidden="true" />
                  {option.label}
                </span>
                <span className="text-subtitle-secondary mt-0.5 hidden pl-6 text-xs sm:block">
                  {option.description}
                </span>
              </button>
            );
          })}
        </div>

        <div className="space-y-3">
          {memberType === 'online' ? (
            <FormInput
              id="member-email"
              type="email"
              label="Email address"
              placeholder="member@example.com…"
              autoComplete="off"
              spellCheck={false}
              icon={<Mail className="text-subtitle-secondary size-4" aria-hidden="true" />}
              error={errors.email?.message}
              aria-invalid={!!errors.email}
              aria-describedby="member-type-help"
              {...register('email')}
            />
          ) : (
            <FormInput
              id="member-name"
              type="text"
              label="Member name"
              placeholder="e.g. Ismail…"
              autoComplete="off"
              icon={<UserRound className="text-subtitle-secondary size-4" aria-hidden="true" />}
              error={errors.name?.message}
              aria-invalid={!!errors.name}
              aria-describedby="member-type-help"
              {...register('name')}
            />
          )}

          <div
            id="member-type-help"
            className="flex items-start gap-2 rounded-lg bg-emerald-50 px-3 py-2.5 text-xs leading-5 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
          >
            <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <p>
              {memberType === 'offline'
                ? 'We’ll generate a sign-in email and temporary password you can share securely.'
                : 'The email must belong to an existing Messefy account.'}
            </p>
          </div>
        </div>

        {generatedCredentials ? (
          <div
            className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 dark:border-emerald-900 dark:bg-emerald-950/30"
            role="status"
            aria-live="polite"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
                  Member created successfully
                </p>
                <p className="mt-0.5 text-xs text-emerald-700 dark:text-emerald-400">
                  Save these credentials before closing.
                </p>
              </div>
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                <Check className="size-4" aria-hidden="true" />
              </span>
            </div>
            <dl className="space-y-2 rounded-lg border border-emerald-200/80 bg-white/70 p-3 text-sm dark:border-emerald-900 dark:bg-black/10">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-emerald-700 dark:text-emerald-400">Email</dt>
                <dd className="min-w-0 font-mono font-medium break-all text-emerald-950 dark:text-emerald-100">
                  {generatedCredentials.email}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-emerald-700 dark:text-emerald-400">Password</dt>
                <dd className="font-mono font-medium break-all text-emerald-950 dark:text-emerald-100">
                  {generatedCredentials.password}
                </dd>
              </div>
            </dl>
            <Button
              type="button"
              variant="outline"
              className="mt-3 w-full border-emerald-300 text-emerald-800 hover:bg-emerald-100 dark:border-emerald-800 dark:text-emerald-200 dark:hover:bg-emerald-950"
              onClick={() => void copyCredentials()}
            >
              {hasCopiedCredentials ? (
                <Check className="size-4" aria-hidden="true" />
              ) : (
                <Copy className="size-4" aria-hidden="true" />
              )}
              {hasCopiedCredentials ? 'Copied' : 'Copy Credentials'}
            </Button>
          </div>
        ) : null}

        {errors.root?.message ? (
          <p
            className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300"
            role="alert"
          >
            {errors.root.message}
          </p>
        ) : null}
      </div>

      <ResponsiveDialog.Footer className="border-border-color mt-6 flex-row border-t pt-4 md:p-0 md:pt-4">
        <Button type="button" variant="outline" className="flex-1 md:flex-none" onClick={close}>
          {generatedCredentials ? 'Done' : 'Cancel'}
        </Button>
        <Button
          type="submit"
          className="flex-1 md:flex-none"
          disabled={addMemberMutation.isPending}
        >
          {addMemberMutation.isPending ? (
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <UserPlus className="size-4" aria-hidden="true" />
          )}
          {addMemberMutation.isPending
            ? 'Saving…'
            : memberType === 'offline'
              ? 'Create Member'
              : 'Add Member'}
        </Button>
      </ResponsiveDialog.Footer>
    </form>
  );
}
