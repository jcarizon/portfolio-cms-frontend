'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Save } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { ColorPicker } from '@/shared/components/color-picker';
import type { Hero } from '@/shared/types';

const heroSchema = z.object({
  initials: z.string().min(1, 'Required').max(5, 'Max 5 characters'),
  fullName: z.string().min(2, 'Required').max(100, 'Max 100 characters'),
  title: z.string().min(2, 'Required').max(100, 'Max 100 characters'),
  location: z.string().min(2, 'Required').max(150, 'Max 150 characters'),
  profileImage: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  gradientFrom: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid hex color'),
  gradientTo: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid hex color'),
});

type HeroFormData = z.infer<typeof heroSchema>;

interface HeroFormProps {
  hero: Hero;
  isSaving: boolean;
  onSubmit: (data: Partial<Hero>) => Promise<void>;
  onPreviewChange: (data: Partial<Hero>) => void;
}

export function HeroForm({ hero, isSaving, onSubmit, onPreviewChange }: HeroFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<HeroFormData>({
    resolver: zodResolver(heroSchema),
    defaultValues: {
      initials: hero.initials,
      fullName: hero.fullName,
      title: hero.title,
      location: hero.location,
      profileImage: hero.profileImage || '',
      gradientFrom: hero.gradientFrom,
      gradientTo: hero.gradientTo,
    },
  });

  const watchedFields = watch();

  useEffect(() => {
    const subscription = watch((value) => {
      onPreviewChange(value);
    });
    return () => subscription.unsubscribe();
  }, [watch, onPreviewChange]);

  const handleFormSubmit = async (data: HeroFormData) => {
    await onSubmit({
      ...data,
      profileImage: data.profileImage || null,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Basic Info Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
        <h3 className="text-lg font-semibold text-neutral-800 mb-4">
          Basic Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Initials */}
          <div>
            <label htmlFor="initials" className="form-label">
              Initials
            </label>
            <input
              id="initials"
              type="text"
              {...register('initials')}
              className={cn('form-input', errors.initials && 'border-red-500')}
              placeholder="JC"
              maxLength={5}
            />
            {errors.initials && (
              <p className="mt-1 text-sm text-red-500">{errors.initials.message}</p>
            )}
            <p className="mt-1 text-xs text-neutral-500">
              Shown when no profile image is set
            </p>
          </div>

          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="form-label">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              {...register('fullName')}
              className={cn('form-input', errors.fullName && 'border-red-500')}
              placeholder="Jhon Mark Carizon"
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>
            )}
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="form-label">
              Job Title
            </label>
            <input
              id="title"
              type="text"
              {...register('title')}
              className={cn('form-input', errors.title && 'border-red-500')}
              placeholder="Web Developer"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="form-label">
              Location
            </label>
            <input
              id="location"
              type="text"
              {...register('location')}
              className={cn('form-input', errors.location && 'border-red-500')}
              placeholder="Mandaue City, Cebu, Philippines"
            />
            {errors.location && (
              <p className="mt-1 text-sm text-red-500">{errors.location.message}</p>
            )}
          </div>
        </div>

        {/* Profile Image URL */}
        <div className="mt-6">
          <label htmlFor="profileImage" className="form-label">
            Profile Image URL
            <span className="font-normal text-neutral-500 ml-1">(optional)</span>
          </label>
          <input
            id="profileImage"
            type="url"
            {...register('profileImage')}
            className={cn('form-input', errors.profileImage && 'border-red-500')}
            placeholder="https://example.com/your-photo.jpg"
          />
          {errors.profileImage && (
            <p className="mt-1 text-sm text-red-500">{errors.profileImage.message}</p>
          )}
          <p className="mt-1 text-xs text-neutral-500">
            Leave empty to show initials instead
          </p>
        </div>
      </div>

      {/* Gradient Colors Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
        <h3 className="text-lg font-semibold text-neutral-800 mb-4">
          Header Gradient Colors
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ColorPicker
            label="Start Color (Left)"
            value={watchedFields.gradientFrom}
            onChange={(color) => setValue('gradientFrom', color, { shouldDirty: true })}
          />
          <ColorPicker
            label="End Color (Right)"
            value={watchedFields.gradientTo}
            onChange={(color) => setValue('gradientTo', color, { shouldDirty: true })}
          />
        </div>

        {/* Gradient Preview Bar */}
        <div className="mt-4">
          <p className="text-sm text-neutral-600 mb-2">Gradient Preview:</p>
          <div
            className="h-12 rounded-lg"
            style={{
              background: `linear-gradient(135deg, ${watchedFields.gradientFrom} 0%, ${watchedFields.gradientTo} 100%)`,
            }}
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-between pt-4">
        <p className="text-sm text-neutral-500">
          {isDirty ? '• You have unsaved changes' : '✓ All changes saved'}
        </p>
        <button
          type="submit"
          disabled={isSaving || !isDirty}
          className={cn(
            'btn btn-primary gap-2',
            (isSaving || !isDirty) && 'opacity-50 cursor-not-allowed'
          )}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </form>
  );
}
