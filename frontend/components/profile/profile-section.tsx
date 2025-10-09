'use client';

import Button from '@/components/ui/button';
import FormInput from '@/components/ui/form-input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar, Clock, Edit, Globe, Mail, MapPin, Phone, Save, User, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// Define the schema for profile form
const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  timezone: z.string().optional(),
  language: z.string().optional(),
  dietaryPreferences: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileSectionProps {
  isLoading?: boolean;
}

export default function ProfileSection({ isLoading = false }: ProfileSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      bio: 'Software engineer passionate about building great products and managing mess efficiently.',
      timezone: 'America/New_York',
      language: 'English',
      dietaryPreferences: 'Vegetarian',
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSaving(true);
    try {
      // Simulate API call
      console.log('Profile form submitted:', data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsEditing(false);
      // Success notification would go here
    } catch (error) {
      console.error('Profile update failed:', error);
      // Error notification would go here
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  //   const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const file = e.target.files?.[0];
  //     if (file) {
  //       const reader = new FileReader();
  //       reader.onload = (event) => {
  //         setAvatarPreview(event.target?.result as string);
  //       };
  //       reader.readAsDataURL(file);
  //     }
  //   };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="h-20 w-20 animate-pulse rounded-full bg-gray-200"></div>
          <div className="flex-1 space-y-2">
            <div className="h-6 w-48 animate-pulse rounded bg-gray-200"></div>
            <div className="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
          </div>
        </div>
        <div className="tablet:grid-cols-2 grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
            <div className="h-10 animate-pulse rounded-md bg-gray-200"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
            <div className="h-10 animate-pulse rounded-md bg-gray-200"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
            <div className="h-10 animate-pulse rounded-md bg-gray-200"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
            <div className="h-10 animate-pulse rounded-md bg-gray-200"></div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
          <div className="h-24 animate-pulse rounded-md bg-gray-200"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="tablet:grid-cols-2 grid grid-cols-1 gap-4">
          <FormInput
            id="fullName"
            label="Full Name"
            placeholder="Enter your full name"
            icon={<User className="h-5 w-5 text-gray-400" />}
            error={errors.fullName?.message}
            disabled={!isEditing}
            {...register('fullName')}
          />

          <FormInput
            id="email"
            type="email"
            label="Email Address"
            placeholder="Enter your email"
            icon={<Mail className="h-5 w-5 text-gray-400" />}
            error={errors.email?.message}
            disabled={!isEditing}
            {...register('email')}
          />

          <FormInput
            id="phone"
            type="tel"
            label="Phone Number"
            placeholder="Enter your phone number"
            icon={<Phone className="h-5 w-5 text-gray-400" />}
            error={errors.phone?.message}
            disabled={!isEditing}
            {...register('phone')}
          />

          <FormInput
            id="location"
            label="Location"
            placeholder="Enter your location"
            icon={<MapPin className="h-5 w-5 text-gray-400" />}
            error={errors.location?.message}
            disabled={!isEditing}
            {...register('location')}
          />

          <div>
            <label htmlFor="timezone" className="mb-2 block text-sm font-medium text-gray-700">
              Timezone
            </label>
            <div className="relative">
              <Clock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
              <select
                id="timezone"
                disabled={!isEditing}
                className="block w-full rounded-lg border border-gray-300 bg-white py-2.5 pr-4 pl-10 text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500"
                {...register('timezone')}
              >
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="Asia/Dhaka">Bangladesh Time (BST)</option>
                <option value="Asia/Kolkata">India Standard Time (IST)</option>
                <option value="Europe/London">Greenwich Mean Time (GMT)</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="language" className="mb-2 block text-sm font-medium text-gray-700">
              Preferred Language
            </label>
            <div className="relative">
              <Globe className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
              <select
                id="language"
                disabled={!isEditing}
                className="block w-full rounded-lg border border-gray-300 bg-white py-2.5 pr-4 pl-10 text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500"
                {...register('language')}
              >
                <option value="English">English</option>
                <option value="Bengali">Bengali</option>
                <option value="Hindi">Hindi</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
              </select>
            </div>
          </div>
        </div>

        <div className="tablet:grid-cols-2 grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="bio" className="mb-2 block text-sm font-medium text-gray-700">
              Bio
            </label>
            <textarea
              id="bio"
              rows={4}
              className="block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500 disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="Tell us about yourself..."
              disabled={!isEditing}
              {...register('bio')}
            />
            {errors.bio && <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>}
          </div>

          <div>
            <label
              htmlFor="dietaryPreferences"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Dietary Preferences
            </label>
            <textarea
              id="dietaryPreferences"
              rows={4}
              className="block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500 disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="Any dietary restrictions or preferences for mess meals..."
              disabled={!isEditing}
              {...register('dietaryPreferences')}
            />
            {errors.dietaryPreferences && (
              <p className="mt-1 text-sm text-red-600">{errors.dietaryPreferences.message}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>Joined January 2024</span>
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
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
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
              Edit Profile
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
