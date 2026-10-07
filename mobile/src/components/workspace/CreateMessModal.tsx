import React, { useState } from 'react';
import { X, Building2, Link as LinkIcon, MapPin, Loader2, AlertCircle } from 'lucide-react';
import { useWorkspace } from '@/hooks/use-workspace';
import { ZodError } from 'zod';

interface CreateMessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateMessModal: React.FC<CreateMessModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { createWorkspace } = useWorkspace();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Auto-slugify when typing name if slug is untouched
  const handleNameChange = (val: string) => {
    setName(val);
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setSlug(generatedSlug || 'my-mess');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await createWorkspace({
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim() || undefined,
      });
      onSuccess();
      onClose();
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        setErrorMessage(err.issues[0]?.message || 'সঠিক তথ্য দিন');
      } else if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('মেস তৈরি করতে ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-t-3xl sm:rounded-3xl border border-border-color bg-card-bg p-6 shadow-2xl safe-bottom">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border-color/60">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Building2 className="size-5" />
            </div>
            <h2 className="text-base font-bold text-pure-color">নতুন মেস তৈরি করুন</h2>
          </div>
          <button
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-full bg-secondary-bg text-subtitle-color hover:text-pure-color"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300">
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-rose-600" />
            <p className="leading-snug">{errorMessage}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-subtitle-color mb-1">
              মেসের নাম *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="যেমন: নূর মঞ্জিল মেস"
              className="w-full rounded-xl border border-border-color bg-input-bg px-3.5 py-2.5 text-sm text-pure-color placeholder:text-subtitle-secondary focus:border-emerald-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-subtitle-color mb-1">
              ইউনিক স্লাগ / ইউজারনেম *
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-subtitle-color">
                <LinkIcon className="size-4" />
              </div>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                placeholder="noor-monjil"
                className="w-full rounded-xl border border-border-color bg-input-bg py-2.5 pl-9 pr-3 text-sm text-pure-color placeholder:text-subtitle-secondary focus:border-emerald-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <p className="mt-1 text-[11px] text-subtitle-secondary">
              স্লাগে শুধু ইংরেজি ছোট হাতের অক্ষর, সংখ্যা ও হাইফেন হতে হবে।
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-subtitle-color mb-1">
              ঠিকানা বা বিবরণ (ঐচ্ছিক)
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-subtitle-color">
                <MapPin className="size-4" />
              </div>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="যেমন: বাড়ি #১২, রোড #৪, ধানমন্ডি"
                className="w-full rounded-xl border border-border-color bg-input-bg py-2.5 pl-9 pr-3 text-sm text-pure-color placeholder:text-subtitle-secondary focus:border-emerald-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-700/20 transition active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>মেস খোলা হচ্ছে...</span>
                </>
              ) : (
                <span>মেস তৈরি নিশ্চিত করুন</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
