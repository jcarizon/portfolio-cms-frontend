'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Save, Mail, MessageSquare } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import type { ContactSettings } from '@/shared/types';

const contactSettingsSchema = z.object({
  heading: z.string().min(1, 'Required').max(100),
  description: z.string().max(500).optional(),
  email: z.string().email('Must be a valid email'),
  buttonText: z.string().min(1, 'Required').max(50),
  showSubjectField: z.boolean(),
  requireSubject: z.boolean(),
});

type ContactSettingsFormData = z.infer<typeof contactSettingsSchema>;

interface ContactSettingsFormProps {
  settings: ContactSettings;
  isSaving: boolean;
  onSubmit: (data: Partial<ContactSettings>) => Promise<void>;
}

export function ContactSettingsForm({ settings, isSaving, onSubmit }: ContactSettingsFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<ContactSettingsFormData>({
    resolver: zodResolver(contactSettingsSchema),
    defaultValues: {
      heading: settings.heading || '',
      description: settings.description || '',
      email: settings.email || '',
      buttonText: settings.buttonText || '',
      showSubjectField: settings.showSubjectField ?? true,
      requireSubject: settings.requireSubject ?? false,
    },
  });

  const watchedFields = watch();

  useEffect(() => {
    reset({
      heading: settings.heading || '',
      description: settings.description || '',
      email: settings.email || '',
      buttonText: settings.buttonText || '',
      showSubjectField: settings.showSubjectField ?? true,
      requireSubject: settings.requireSubject ?? false,
    });
  }, [settings, reset]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Content */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary-600" />
            Contact Section Content
          </h3>

          <div className="space-y-4">
            <div>
              <label className="form-label">Heading *</label>
              <input
                type="text"
                {...register('heading')}
                className={cn('form-input', errors.heading && 'border-red-500')}
                placeholder="Get In Touch"
              />
              {errors.heading && (
                <p className="mt-1 text-sm text-red-500">{errors.heading.message}</p>
              )}
            </div>

            <div>
              <label className="form-label">Description</label>
              <textarea
                {...register('description')}
                rows={3}
                className="form-input resize-none"
                placeholder="I'm always open to discussing new opportunities..."
              />
            </div>

            <div>
              <label className="form-label flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Admin Email
              </label>
              <input
                type="email"
                {...register('email')}
                className={cn('form-input', errors.email && 'border-red-500')}
                placeholder="hello@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
              )}
              <p className="mt-1 text-xs text-neutral-500">
                For admin reference only — visitors submit via the contact form.
              </p>
            </div>

            <div>
              <label className="form-label">Submit Button Text *</label>
              <input
                type="text"
                {...register('buttonText')}
                className={cn('form-input', errors.buttonText && 'border-red-500')}
                placeholder="Send Message"
              />
              {errors.buttonText && (
                <p className="mt-1 text-sm text-red-500">{errors.buttonText.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Form Field Settings */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-800 mb-4">
            Form Field Settings
          </h3>

          <div className="space-y-4">
            {/* Show Subject Field */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative mt-0.5">
                <input
                  type="checkbox"
                  {...register('showSubjectField')}
                  className="sr-only peer"
                />
                <div className={cn(
                  'w-10 h-6 rounded-full transition-colors',
                  watchedFields.showSubjectField ? 'bg-primary-600' : 'bg-neutral-300'
                )}>
                  <div className={cn(
                    'absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform',
                    watchedFields.showSubjectField ? 'translate-x-5' : 'translate-x-1'
                  )} />
                </div>
              </div>
              <div>
                <p className="font-medium text-neutral-800 text-sm">Show Subject Field</p>
                <p className="text-xs text-neutral-500">Display the subject field in the contact form</p>
              </div>
            </label>

            {/* Require Subject */}
            <label className={cn(
              'flex items-start gap-3 cursor-pointer group',
              !watchedFields.showSubjectField && 'opacity-40 pointer-events-none'
            )}>
              <div className="relative mt-0.5">
                <input
                  type="checkbox"
                  {...register('requireSubject')}
                  className="sr-only peer"
                  disabled={!watchedFields.showSubjectField}
                />
                <div className={cn(
                  'w-10 h-6 rounded-full transition-colors',
                  watchedFields.requireSubject && watchedFields.showSubjectField
                    ? 'bg-primary-600'
                    : 'bg-neutral-300'
                )}>
                  <div className={cn(
                    'absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform',
                    watchedFields.requireSubject && watchedFields.showSubjectField
                      ? 'translate-x-5'
                      : 'translate-x-1'
                  )} />
                </div>
              </div>
              <div>
                <p className="font-medium text-neutral-800 text-sm">Require Subject</p>
                <p className="text-xs text-neutral-500">Make the subject field mandatory</p>
              </div>
            </label>
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

      {/* Preview */}
      <div className="xl:sticky xl:top-24 xl:self-start">
        <div className="rounded-xl overflow-hidden shadow-lg border border-neutral-200">
          <div className="bg-neutral-800 text-white text-xs px-4 py-2 flex items-center justify-between">
            <span>Live Preview</span>
            <span className="text-neutral-400">Contact Section</span>
          </div>
          <div className="bg-white p-6">
            <h2 className="text-xl font-bold text-primary-600 text-center mb-1">
              {watchedFields.heading || 'Get In Touch'}
            </h2>
            <div className="w-8 h-1 bg-gradient-to-r from-[#667eea] to-[#764ba2] mx-auto mb-4 rounded" />
            <p className="text-sm text-neutral-600 text-center mb-5">
              {watchedFields.description || 'Your description will appear here...'}
            </p>

            {/* Mock form */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="h-8 rounded-lg border-2 border-neutral-200 bg-neutral-50 px-3 flex items-center">
                  <span className="text-xs text-neutral-400">Name *</span>
                </div>
                <div className="h-8 rounded-lg border-2 border-neutral-200 bg-neutral-50 px-3 flex items-center">
                  <span className="text-xs text-neutral-400">Email *</span>
                </div>
              </div>

              {watchedFields.showSubjectField && (
                <div className="h-8 rounded-lg border-2 border-neutral-200 bg-neutral-50 px-3 flex items-center">
                  <span className="text-xs text-neutral-400">
                    Subject{watchedFields.requireSubject ? ' *' : ''}
                  </span>
                </div>
              )}

              <div className="h-16 rounded-lg border-2 border-neutral-200 bg-neutral-50 px-3 py-2">
                <span className="text-xs text-neutral-400">Message *</span>
              </div>
              <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl">
                <MessageSquare className="w-4 h-4" />
                {watchedFields.buttonText || 'Send Message'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
