'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { AxiosError } from 'axios';
import Button from '@/components/ui/button';
import FormCheckbox from '@/components/ui/form-checkbox';
import FormInput from '@/components/ui/form-input';
import { createSignupSchema, type SignupFormValues } from '@/utils/validation';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { GoogleIcon } from '@/components/svg/google-icon';
import { env } from '@/config/env';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations('Auth.signUp');
  const validation = useTranslations('Auth.validation');
  const signupSchema = createSignupSchema({
    emailRequired: validation('emailRequired'),
    emailInvalid: validation('emailInvalid'),
    passwordRequired: validation('passwordRequired'),
    passwordMin: validation('passwordMin'),
    nameRequired: validation('nameRequired'),
    nameMax: validation('nameMax'),
    passwordUppercase: validation('passwordUppercase'),
    passwordLowercase: validation('passwordLowercase'),
    passwordNumber: validation('passwordNumber'),
    confirmPasswordRequired: validation('confirmPasswordRequired'),
    termsRequired: validation('termsRequired'),
    passwordMismatch: validation('passwordMismatch'),
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormValues) => {
    try {
      setIsLoading(true);

      const signupData = {
        name: data.name,
        email: data.email,
        password: data.password,
        term: data.terms,
      };

      await axios.post(`${env.NEXT_PUBLIC_API_URL}/auth/signup`, signupData);

      toast.success(t('success'));
      router.push('/auth/signin');
    } catch (error) {
      const axiosError = error as AxiosError<{ error?: string }>;
      const errorMessage = axiosError.response?.data?.error || t('failed');

      if (errorMessage.toLowerCase().includes('email')) {
        setError('email', { type: 'manual', message: errorMessage });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border-border-color mt-8 space-y-8 rounded-lg border p-8 shadow-md">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">{t('title')}</h2>
        <p className="mt-2 text-sm text-gray-600">
          {t('hasAccount')}{' '}
          <Link href="/auth/signin" className="font-medium text-emerald-600 hover:text-emerald-500">
            {t('signIn')}
          </Link>
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <FormInput
          id="name"
          type="text"
          label={t('name')}
          placeholder={t('namePlaceholder')}
          icon={<User className="size-5 text-gray-400" />}
          error={errors.name?.message}
          {...register('name')}
        />

        <FormInput
          id="email"
          type="email"
          label={t('email')}
          placeholder="name@example.com"
          icon={<Mail className="size-5 text-gray-400" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <div className="relative">
          <FormInput
            id="password"
            type={showPassword ? 'text' : 'password'}
            label={t('password')}
            placeholder="••••••••"
            icon={<Lock className="size-5 text-gray-400" />}
            error={errors.password?.message}
            {...register('password')}
          />
          <button
            type="button"
            className="absolute top-10 right-3 text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? t('hidePassword') : t('showPassword')}
          >
            {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
          </button>
        </div>

        <div className="relative">
          <FormInput
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            label={t('confirmPassword')}
            placeholder="••••••••"
            icon={<Lock className="size-5 text-gray-400" />}
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
          <button
            type="button"
            className="absolute top-10 right-3 text-gray-500 hover:text-gray-700"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            aria-label={showConfirmPassword ? t('hidePassword') : t('showPassword')}
          >
            {showConfirmPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
          </button>
        </div>

        <FormCheckbox
          id="terms"
          label={
            <span>
              {t('termsPrefix')}{' '}
              <a href="#" className="font-medium text-emerald-600 hover:text-emerald-500">
                {t('terms')}
              </a>{' '}
              {t('and')}{' '}
              <a href="#" className="font-medium text-emerald-600 hover:text-emerald-500">
                {t('privacy')}
              </a>{' '}
              {t('termsSuffix')}
            </span>
          }
          {...register('terms')}
        />

        <div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? t('submitting') : t('submit')}
          </Button>
        </div>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">{t('continueWith')}</span>
        </div>
      </div>

      <Button type="button" onClick={() => signIn('google')} variant="secondary" className="w-full">
        <GoogleIcon className="size-4.5" />
        Google
      </Button>
    </div>
  );
}
