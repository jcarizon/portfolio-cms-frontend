'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Loader2, Calendar } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import type { Experience } from '@/shared/types';

const experienceSchema = z.object({
  jobTitle: z.string().min(2, 'Job title is required').max(100),
  company: z.string().min(2, 'Company is required').max(100),
  location: z.string().min(2, 'Location is required').max(100),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  isCurrentJob: z.boolean(),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000),
  isVisible: z.boolean(),
});

type ExperienceFormData = z.infer<typeof experienceSchema>;

interface ExperienceModalProps {
  experience?: Experience | null;
  isOpen: boolean;
  isSaving: boolean;
  onClose: () => void;
  onSave: (data: Partial<Experience>) => Promise<void>;
}

// Helper to format date for input
function formatDateForInput(dateString: string | null | undefined): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}

export function ExperienceModal({
  experience,
  isOpen,
  isSaving,
  onClose,
  onSave,
}: ExperienceModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      jobTitle: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrentJob: false,
      description: '',
      isVisible: true,
    },
  });

  const isCurrentJob = watch('isCurrentJob');

  // Reset form when experience changes
  useEffect(() => {
    if (experience) {
      const isCurrentJob = !experience.endDate;
      reset({
        jobTitle: experience.jobTitle,
        company: experience.company,
        location: experience.location,
        startDate: formatDateForInput(experience.startDate),
        endDate: formatDateForInput(experience.endDate),
        isCurrentJob,
        description: experience.description,
        isVisible: experience.isVisible,
      });
    } else {
      reset({
        jobTitle: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        isCurrentJob: false,
        description: '',
        isVisible: true,
      });
    }
  }, [experience, reset]);

  // Clear end date when current job is checked
  useEffect(() => {
    if (isCurrentJob) {
      setValue('endDate', '');
    }
  }, [isCurrentJob, setValue]);

  const onSubmit = async (data: ExperienceFormData) => {
    await onSave({
      jobTitle: data.jobTitle,
      company: data.company,
      location: data.location,
      startDate: data.startDate,
      endDate: data.isCurrentJob ? null : (data.endDate || null),
      description: data.description,
      isVisible: data.isVisible,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <h2 className="text-xl font-bold text-neutral-800">
            {experience ? 'Edit Experience' : 'Add New Experience'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-5">
            {/* Job Title */}
            <div>
              <label className="form-label">Job Title *</label>
              <input
                type="text"
                {...register('jobTitle')}
                className={cn('form-input', errors.jobTitle && 'border-red-500')}
                placeholder="e.g., Senior Frontend Engineer"
              />
              {errors.jobTitle && (
                <p className="mt-1 text-sm text-red-500">{errors.jobTitle.message}</p>
              )}
            </div>

            {/* Company & Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Company *</label>
                <input
                  type="text"
                  {...register('company')}
                  className={cn('form-input', errors.company && 'border-red-500')}
                  placeholder="e.g., Acme Inc."
                />
                {errors.company && (
                  <p className="mt-1 text-sm text-red-500">{errors.company.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">Location *</label>
                <input
                  type="text"
                  {...register('location')}
                  className={cn('form-input', errors.location && 'border-red-500')}
                  placeholder="e.g., Remote or City, Country"
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-500">{errors.location.message}</p>
                )}
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Start Date *</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="date"
                    {...register('startDate')}
                    className={cn('form-input pl-10', errors.startDate && 'border-red-500')}
                  />
                </div>
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-500">{errors.startDate.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">End Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="date"
                    {...register('endDate')}
                    disabled={isCurrentJob}
                    className={cn(
                      'form-input pl-10',
                      isCurrentJob && 'bg-neutral-100 cursor-not-allowed'
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Current Job Toggle */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register('isCurrentJob')}
                className="w-5 h-5 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-neutral-700">
                <strong>I currently work here</strong>
                <span className="block text-sm text-neutral-500">
                  This will show "Present" as the end date
                </span>
              </span>
            </label>

            {/* Description */}
            <div>
              <label className="form-label">Description *</label>
              <textarea
                {...register('description')}
                rows={4}
                className={cn('form-input resize-none', errors.description && 'border-red-500')}
                placeholder="Describe your responsibilities, achievements, and key contributions..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
              )}
              <p className="mt-1 text-xs text-neutral-500">
                Tip: Use action verbs and highlight measurable achievements
              </p>
            </div>

            {/* Visibility Toggle */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register('isVisible')}
                className="w-5 h-5 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-neutral-700">
                <strong>Visible</strong>
                <span className="block text-sm text-neutral-500">
                  Show this experience on your portfolio
                </span>
              </span>
            </label>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-200 bg-neutral-50">
            <button
              type="button"
              onClick={onClose}
              className="btn bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className={cn(
                'btn btn-primary gap-2',
                isSaving && 'opacity-70 cursor-not-allowed'
              )}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>{experience ? 'Save Changes' : 'Add Experience'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}