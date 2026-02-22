'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Loader2, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import type { Project } from '@/shared/types';

const projectSchema = z.object({
  title: z.string().min(2, 'Title is required').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500),
  details: z.string().max(500).optional(),
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  liveUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  githubUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  featured: z.boolean(),
  isVisible: z.boolean(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectModalProps {
  project?: Project | null;
  isOpen: boolean;
  isSaving: boolean;
  onClose: () => void;
  onSave: (data: Partial<Project>) => Promise<void>;
}

export function ProjectModal({
  project,
  isOpen,
  isSaving,
  onClose,
  onSave,
}: ProjectModalProps) {
  const [techStack, setTechStack] = useState<string[]>([]);
  const [newTech, setNewTech] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
      details: '',
      imageUrl: '',
      liveUrl: '',
      githubUrl: '',
      featured: false,
      isVisible: true,
    },
  });

  // Reset form when project changes
  useEffect(() => {
    if (project) {
      reset({
        title: project.title,
        description: project.description,
        details: project.details || '',
        imageUrl: project.imageUrl || '',
        liveUrl: project.liveUrl || '',
        githubUrl: project.githubUrl || '',
        featured: project.featured,
        isVisible: project.isVisible,
      });
      setTechStack(project.techStack || []);
    } else {
      reset({
        title: '',
        description: '',
        details: '',
        imageUrl: '',
        liveUrl: '',
        githubUrl: '',
        featured: false,
        isVisible: true,
      });
      setTechStack([]);
    }
  }, [project, reset]);

  const handleAddTech = () => {
    if (!newTech.trim() || techStack.includes(newTech.trim())) return;
    setTechStack([...techStack, newTech.trim()]);
    setNewTech('');
  };

  const handleRemoveTech = (tech: string) => {
    setTechStack(techStack.filter((t) => t !== tech));
  };

  const onSubmit = async (data: ProjectFormData) => {
    await onSave({
      ...data,
      techStack,
      imageUrl: data.imageUrl || null,
      liveUrl: data.liveUrl || null,
      githubUrl: data.githubUrl || null,
      details: data.details || null,
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
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <h2 className="text-xl font-bold text-neutral-800">
            {project ? 'Edit Project' : 'Add New Project'}
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
            {/* Title */}
            <div>
              <label className="form-label">Title *</label>
              <input
                type="text"
                {...register('title')}
                className={cn('form-input', errors.title && 'border-red-500')}
                placeholder="Project name"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="form-label">Description *</label>
              <textarea
                {...register('description')}
                rows={3}
                className={cn('form-input resize-none', errors.description && 'border-red-500')}
                placeholder="Brief description of the project"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>

            {/* Details */}
            <div>
              <label className="form-label">
                Additional Details
                <span className="font-normal text-neutral-500 ml-1">(optional)</span>
              </label>
              <textarea
                {...register('details')}
                rows={2}
                className="form-input resize-none"
                placeholder="Status, notes, or additional info"
              />
            </div>

            {/* Tech Stack */}
            <div>
              <label className="form-label">Tech Stack</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {techStack.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-lg text-sm"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => handleRemoveTech(tech)}
                      className="p-0.5 hover:bg-primary-200 rounded"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {techStack.length === 0 && (
                  <span className="text-sm text-neutral-400 italic">No technologies added</span>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  placeholder="Add technology..."
                  className="form-input flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTech();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddTech}
                  disabled={!newTech.trim()}
                  className={cn(
                    'btn bg-neutral-100 text-neutral-700 hover:bg-neutral-200 gap-1',
                    !newTech.trim() && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
            </div>

            {/* URLs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">
                  Live URL
                  <span className="font-normal text-neutral-500 ml-1">(optional)</span>
                </label>
                <input
                  type="url"
                  {...register('liveUrl')}
                  className={cn('form-input', errors.liveUrl && 'border-red-500')}
                  placeholder="https://..."
                />
                {errors.liveUrl && (
                  <p className="mt-1 text-sm text-red-500">{errors.liveUrl.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">
                  GitHub URL
                  <span className="font-normal text-neutral-500 ml-1">(optional)</span>
                </label>
                <input
                  type="url"
                  {...register('githubUrl')}
                  className={cn('form-input', errors.githubUrl && 'border-red-500')}
                  placeholder="https://github.com/..."
                />
                {errors.githubUrl && (
                  <p className="mt-1 text-sm text-red-500">{errors.githubUrl.message}</p>
                )}
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label className="form-label">
                Image URL
                <span className="font-normal text-neutral-500 ml-1">(optional)</span>
              </label>
              <input
                type="url"
                {...register('imageUrl')}
                className={cn('form-input', errors.imageUrl && 'border-red-500')}
                placeholder="https://example.com/image.jpg"
              />
              {errors.imageUrl && (
                <p className="mt-1 text-sm text-red-500">{errors.imageUrl.message}</p>
              )}
            </div>

            {/* Toggles */}
            <div className="flex flex-wrap gap-6 pt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('featured')}
                  className="w-5 h-5 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-neutral-700">
                  <strong>Featured</strong>
                  <span className="block text-sm text-neutral-500">Show at the top</span>
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('isVisible')}
                  className="w-5 h-5 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-neutral-700">
                  <strong>Visible</strong>
                  <span className="block text-sm text-neutral-500">Show on portfolio</span>
                </span>
              </label>
            </div>
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
                <>{project ? 'Save Changes' : 'Create Project'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}