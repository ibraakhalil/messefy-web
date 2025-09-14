'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Camera, User, Mail, Phone, MapPin, Calendar, Edit, Save, X } from 'lucide-react'
import FormInput from '@/components/ui/form-input'
import Button from '@/components/ui/button'
import Image from 'next/image'

// Define the schema for profile form
const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

interface ProfileSectionProps {
  isLoading?: boolean
}

export default function ProfileSection({ isLoading = false }: ProfileSectionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      bio: 'Software engineer passionate about building great products.',
    },
  })

  const watchedValues = watch()

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSaving(true)
    try {
      // Simulate API call
      console.log('Profile form submitted:', data)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsEditing(false)
      // Success notification would go here
    } catch (error) {
      console.error('Profile update failed:', error)
      // Error notification would go here
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    reset()
    setIsEditing(false)
    setAvatarPreview(null)
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setAvatarPreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

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
        <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2">
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
    )
  }

  return (
    <div className="space-y-6">
      {/* Avatar Section */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Image
            src={avatarPreview || '/images/avatar.png'}
            alt="Profile avatar"
            className="h-20 w-20 rounded-full object-cover"
            width={100}
            height={100}
          />
          {isEditing && (
            <label
              htmlFor="avatar-upload"
              className="absolute -right-2 -bottom-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-emerald-600 text-white hover:bg-emerald-700"
            >
              <Camera className="h-4 w-4" />
              <input
                id="avatar-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </label>
          )}
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{watchedValues.fullName}</h2>
          <p className="text-gray-600">{watchedValues.email}</p>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2">
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
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
            Bio
          </label>
          <div className="mt-1">
            <textarea
              id="bio"
              rows={4}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-sm"
              placeholder="Tell us about yourself..."
              disabled={!isEditing}
              {...register('bio')}
            />
          </div>
          {errors.bio && <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>}
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
  )
}
