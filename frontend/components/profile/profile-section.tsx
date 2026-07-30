'use client';

import Button from '@/components/ui/button';
import FormInput from '@/components/ui/form-input';
import { getCurrentUser, updateCurrentUser } from '@/lib/user-requests';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { bn, enUS } from 'date-fns/locale';
import { Calendar, Edit, Mail, Save, User, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { useLocale, useTranslations } from 'next-intl';

const profileSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileSectionProps {
  isLoading?: boolean;
}

export default function ProfileSection({ isLoading = false }: ProfileSectionProps) {
  const t = useTranslations('Profile');
  const locale = useLocale();
  const dateFnsLocale = locale === 'bn' ? bn : enUS;

  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  const {
    data: user,
    isLoading: isLoadingUser,
    refetch,
  } = useQuery({
    queryKey: ['current-user'],
    queryFn: getCurrentUser,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({ name: user.name || '' });
    }
  }, [reset, user]);

  const updateProfileMutation = useMutation({
    mutationFn: updateCurrentUser,
    onSuccess: async (updatedUser) => {
      queryClient.setQueryData(['current-user'], updatedUser);
      await queryClient.invalidateQueries({ queryKey: ['current-user'] });
      toast.success(t('success'));
      setIsEditing(false);
      router.refresh();
    },
    onError: (error) => {
      const message =
        (error as { response?: { data?: { error?: string } } }).response?.data?.error ||
        t('failed');
      toast.error(message);
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    await updateProfileMutation.mutateAsync({ name: data.name });
  };

  const handleCancel = () => {
    reset({ name: user?.name || '' });
    setIsEditing(false);
  };

  if (isLoading || isLoadingUser) {
    return (
      <div className="space-y-6">
        <div className="tablet:grid-cols-2 grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
            <div className="h-10 animate-pulse rounded-md bg-gray-200"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
            <div className="h-10 animate-pulse rounded-md bg-gray-200"></div>
          </div>
        </div>
        <div className="h-4 w-40 animate-pulse rounded bg-gray-200"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-700">{t('unableToLoad')}</p>
        <Button onClick={() => refetch()} variant="secondary" className="mt-3">
          {t('tryAgain')}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="tablet:grid-cols-2 grid grid-cols-1 gap-4">
          <FormInput
            id="name"
            label={t('fullName')}
            placeholder={t('enterFullName')}
            icon={<User className="h-5 w-5 text-gray-400" />}
            error={errors.name?.message}
            disabled={!isEditing}
            {...register('name')}
          />

          <FormInput
            id="email"
            type="email"
            label={t('emailAddress')}
            value={user.email}
            icon={<Mail className="h-5 w-5 text-gray-400" />}
            disabled
            readOnly
          />
        </div>

        <div className="rounded-lg border border-border-color bg-secondary-bg p-4 dark:border-gray-700 dark:bg-gray-800/80">
          <p className="text-sm font-medium text-pure-color dark:text-white">{t('availableFields')}</p>
          <p className="mt-1 text-sm text-subtitle-color dark:text-gray-400">
            {t('readOnlyNotice')}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-subtitle-color dark:text-gray-400">
            <Calendar className="h-4 w-4" />
            <span>
              {t('joined', {
                date: format(new Date(user.createdAt), 'MMMM yyyy', { locale: dateFnsLocale }),
              })}
            </span>
          </div>

          {isEditing ? (
            <div className="flex space-x-3">
              <Button
                type="button"
                variant="secondary"
                onClick={handleCancel}
                className="flex items-center space-x-2"
              >
                <X className="h-4 w-4" />
                {t('cancel')}
              </Button>
              <Button
                type="submit"
                className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700"
                disabled={updateProfileMutation.isPending}
              >
                {updateProfileMutation.isPending ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    {t('saving')}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {t('saveChanges')}
                  </>
                )}
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700"
            >
              <Edit className="h-4 w-4" />
              {t('editProfile')}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
