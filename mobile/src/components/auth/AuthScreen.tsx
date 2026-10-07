import React, { useState } from 'react';
import { Building2, Mail, Lock, User, Eye, EyeOff, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { loginSchema, registerSchema } from '@/services/auth-service';
import { ZodError } from 'zod';

export const AuthScreen: React.FC = () => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      if (mode === 'signin') {
        const validated = loginSchema.parse({ email, password });
        await login(validated);
      } else {
        const validated = registerSchema.parse({ name, email, password });
        await register(validated);
      }
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        setErrorMessage(err.issues[0]?.message || 'অনুগ্রহ করে সঠিক তথ্য দিন');
      } else if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('লগইন করতে সমস্যা হচ্ছে। আবার চেষ্টা করুন।');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-between bg-primary-bg px-5 py-8 text-pure-color transition-colors safe-top safe-bottom">
      {/* Top Branding */}
      <div className="mt-6 flex flex-col items-center text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-lg ring-4 ring-emerald-500/20">
          <Building2 className="size-8" />
        </div>
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-pure-color">
          মেসিফাই
        </h1>
        <p className="mt-1 text-xs font-medium text-subtitle-color max-w-xs">
          মেসের মিল, বাজার খরচ ও জমার হিসাব রাখুন ঝামেলামুক্ত ও আমানতদারিতার সাথে
        </p>
      </div>

      {/* Auth Card */}
      <div className="mx-auto w-full max-w-sm rounded-3xl border border-border-color bg-card-bg p-6 shadow-xl shadow-emerald-950/5">
        {/* Tab Toggle (Sign In / Sign Up) */}
        <div className="flex rounded-xl bg-secondary-bg p-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMessage(null);
            }}
            className={`flex-1 rounded-lg py-2 transition-all ${
              mode === 'signin'
                ? 'bg-card-bg text-emerald-700 dark:text-emerald-400 shadow-xs'
                : 'text-subtitle-color hover:text-pure-color'
            }`}
          >
            লগইন
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMessage(null);
            }}
            className={`flex-1 rounded-lg py-2 transition-all ${
              mode === 'signup'
                ? 'bg-card-bg text-emerald-700 dark:text-emerald-400 shadow-xs'
                : 'text-subtitle-color hover:text-pure-color'
            }`}
          >
            নতুন অ্যাকাউন্ট
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300 animate-shake">
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-rose-600" />
            <p className="leading-snug">{errorMessage}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-subtitle-color mb-1">
                আপনার নাম
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-subtitle-color">
                  <User className="size-4" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="যেমন: ইব্রাহিম খলিল"
                  className="w-full rounded-xl border border-border-color bg-input-bg py-2.5 pl-10 pr-3 text-sm text-pure-color placeholder:text-subtitle-secondary focus:border-emerald-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-subtitle-color mb-1">
              ইমেইল অ্যাড্রেস
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-subtitle-color">
                <Mail className="size-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-xl border border-border-color bg-input-bg py-2.5 pl-10 pr-3 text-sm text-pure-color placeholder:text-subtitle-secondary focus:border-emerald-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-subtitle-color mb-1">
              পাসওয়ার্ড
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-subtitle-color">
                <Lock className="size-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="কমপক্ষে ৬ অক্ষর"
                className="w-full rounded-xl border border-border-color bg-input-bg py-2.5 pl-10 pr-10 text-sm text-pure-color placeholder:text-subtitle-secondary focus:border-emerald-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-subtitle-color hover:text-pure-color"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-700/20 transition active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 mt-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>যাচাই করা হচ্ছে...</span>
              </>
            ) : (
              <span>{mode === 'signin' ? 'প্রবেশ করুন' : 'অ্যাকাউন্ট খুলুন'}</span>
            )}
          </button>
        </form>

        {/* Demo Fast Login Shortcut */}
        <div className="mt-4 pt-4 border-t border-border-color/60 text-center">
          <button
            type="button"
            onClick={() => {
              setEmail('admin@messefy.com');
              setPassword('password123');
              setMode('signin');
            }}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:underline"
          >
            <Sparkles className="size-3" />
            <span>ডেমো ক্রেডেনশিয়াল পূরণ করুন</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-4 text-center">
        <p className="text-[11px] text-subtitle-secondary">
          বিসমিল্লাহির রহমানির রাহীম • আমানতদারিতার সাথে হিসাব সংরক্ষণ
        </p>
      </footer>
    </div>
  );
};
