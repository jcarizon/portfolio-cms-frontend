'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Save, Globe, Github, Linkedin, Twitter, FileText } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import type { SiteSettings } from '@/shared/types';

const siteSettingsSchema = z.object({
  siteTitle: z.string().min(1, 'Required').max(100),
  siteTagline: z.string().max(200).optional(),
  githubUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  linkedinUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  twitterUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  portfolioUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  footerText: z.string().max(500).optional(),
});

type SiteSettingsFormData = z.infer<typeof siteSettingsSchema>;

interface SiteSettingsFormProps {
  settings: SiteSettings;
  isSaving: boolean;
  onSubmit: (data: Partial<SiteSettings>) => Promise<void>;
}

export function SiteSettingsForm({ settings, isSaving, onSubmit }: SiteSettingsFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<SiteSettingsFormData>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      siteTitle: settings.siteTitle || '',
      siteTagline: settings.siteTagline || '',
      githubUrl: settings.githubUrl || '',
      linkedinUrl: settings.linkedinUrl || '',
      twitterUrl: settings.twitterUrl || '',
      portfolioUrl: settings.portfolioUrl || '',
      footerText: settings.footerText || '',
    },
  });

  useEffect(() => {
    reset({
      siteTitle: settings.siteTitle || '',
      siteTagline: settings.siteTagline || '',
      githubUrl: settings.githubUrl || '',
      linkedinUrl: settings.linkedinUrl || '',
      twitterUrl: settings.twitterUrl || '',
      portfolioUrl: settings.portfolioUrl || '',
      footerText: settings.footerText || '',
    });
  }, [settings, reset]);

  const handleFormSubmit = async (data: SiteSettingsFormData) => {
    await onSubmit({
      ...data,
      githubUrl: data.githubUrl || null,
      linkedinUrl: data.linkedinUrl || null,
      twitterUrl: data.twitterUrl || null,
      portfolioUrl: data.portfolioUrl || null,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* General Settings */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
        <h3 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary-600" />
          General Settings
        </h3>

        <div className="space-y-4">
          <div>
            <label className="form-label">Site Title *</label>
            <input
              type="text"
              {...register('siteTitle')}
              className={cn('form-input', errors.siteTitle && 'border-red-500')}
              placeholder="My Portfolio"
            />
            {errors.siteTitle && (
              <p className="mt-1 text-sm text-red-500">{errors.siteTitle.message}</p>
            )}
          </div>

          <div>
            <label className="form-label">
              Tagline
              <span className="font-normal text-neutral-500 ml-1">(optional)</span>
            </label>
            <input
              type="text"
              {...register('siteTagline')}
              className="form-input"
              placeholder="Full-Stack Developer"
            />
          </div>

          <div>
            <label className="form-label">
              Footer Text
              <span className="font-normal text-neutral-500 ml-1">(optional)</span>
            </label>
            <textarea
              {...register('footerText')}
              rows={2}
              className="form-input resize-none"
              placeholder="© 2025 Your Name. All rights reserved."
            />
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
        <h3 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary-600" />
          Social Links
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label flex items-center gap-2">
              <Github className="w-4 h-4" />
              GitHub URL
            </label>
            <input
              type="url"
              {...register('githubUrl')}
              className={cn('form-input', errors.githubUrl && 'border-red-500')}
              placeholder="https://github.com/username"
            />
            {errors.githubUrl && (
              <p className="mt-1 text-sm text-red-500">{errors.githubUrl.message}</p>
            )}
          </div>

          <div>
            <label className="form-label flex items-center gap-2">
              <Linkedin className="w-4 h-4" />
              LinkedIn URL
            </label>
            <input
              type="url"
              {...register('linkedinUrl')}
              className={cn('form-input', errors.linkedinUrl && 'border-red-500')}
              placeholder="https://linkedin.com/in/username"
            />
            {errors.linkedinUrl && (
              <p className="mt-1 text-sm text-red-500">{errors.linkedinUrl.message}</p>
            )}
          </div>

          <div>
            <label className="form-label flex items-center gap-2">
              <Twitter className="w-4 h-4" />
              Twitter URL
            </label>
            <input
              type="url"
              {...register('twitterUrl')}
              className={cn('form-input', errors.twitterUrl && 'border-red-500')}
              placeholder="https://twitter.com/username"
            />
            {errors.twitterUrl && (
              <p className="mt-1 text-sm text-red-500">{errors.twitterUrl.message}</p>
            )}
          </div>

          <div>
            <label className="form-label flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Portfolio URL
            </label>
            <input
              type="url"
              {...register('portfolioUrl')}
              className={cn('form-input', errors.portfolioUrl && 'border-red-500')}
              placeholder="https://myportfolio.com"
            />
            {errors.portfolioUrl && (
              <p className="mt-1 text-sm text-red-500">{errors.portfolioUrl.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-between">
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