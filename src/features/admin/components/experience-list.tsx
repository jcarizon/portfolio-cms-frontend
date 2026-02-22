'use client';

import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Building2,
  MapPin,
  Calendar,
} from 'lucide-react';
import { cn, formatDateRange } from '@/shared/lib/utils';
import type { Experience } from '@/shared/types';

interface ExperienceListProps {
  experiences: Experience[];
  isSaving: boolean;
  onAdd: () => void;
  onEdit: (experience: Experience) => void;
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onReorder: (experienceIds: string[]) => void;
}

export function ExperienceList({
  experiences,
  isSaving,
  onAdd,
  onEdit,
  onDelete,
  onToggleVisibility,
  onReorder,
}: ExperienceListProps) {
  // Sort by order
  const sortedExperiences = [...experiences].sort((a, b) => a.order - b.order);

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newOrder = [...sortedExperiences];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    onReorder(newOrder.map((e) => e.id));
  };

  const handleMoveDown = (index: number) => {
    if (index === sortedExperiences.length - 1) return;
    const newOrder = [...sortedExperiences];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    onReorder(newOrder.map((e) => e.id));
  };

  const handleDelete = (id: string, title: string, company: string) => {
    if (confirm(`Delete "${title}" at ${company}? This cannot be undone.`)) {
      onDelete(id);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-neutral-800">
          Work History ({experiences.length})
        </h3>
        <button onClick={onAdd} className="btn btn-primary gap-2">
          <Plus className="w-4 h-4" />
          Add Experience
        </button>
      </div>

      {/* Experience List */}
      <div className="space-y-3">
        {sortedExperiences.map((exp, index) => (
          <div
            key={exp.id}
            className={cn(
              'bg-white rounded-xl border shadow-sm overflow-hidden',
              'transition-all duration-200',
              !exp.isVisible && 'opacity-60',
              !exp.endDate && 'border-l-4 border-l-green-500'
            )}
          >
            <div className="flex items-start gap-4 p-4">
              {/* Drag Handle & Reorder */}
              <div className="flex flex-col items-center gap-1 pt-1">
                <GripVertical className="w-5 h-5 text-neutral-300 cursor-grab" />
                <button
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                  className={cn(
                    'p-1 rounded hover:bg-neutral-100',
                    index === 0 && 'opacity-30 cursor-not-allowed'
                  )}
                >
                  <ChevronUp className="w-4 h-4 text-neutral-400" />
                </button>
                <button
                  onClick={() => handleMoveDown(index)}
                  disabled={index === sortedExperiences.length - 1}
                  className={cn(
                    'p-1 rounded hover:bg-neutral-100',
                    index === sortedExperiences.length - 1 && 'opacity-30 cursor-not-allowed'
                  )}
                >
                  <ChevronDown className="w-4 h-4 text-neutral-400" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-semibold text-neutral-800 flex items-center gap-2">
                      {exp.jobTitle}
                      {!exp.endDate && (
                        <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
                          Current
                        </span>
                      )}
                      {!exp.isVisible && (
                        <span className="px-2 py-0.5 text-xs bg-neutral-200 text-neutral-600 rounded-full">
                          Hidden
                        </span>
                      )}
                    </h4>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {exp.company}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {exp.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDateRange(exp.startDate, exp.endDate)}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-neutral-600 mt-2 line-clamp-2">
                  {exp.description}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => onToggleVisibility(exp.id)}
                  disabled={isSaving}
                  className={cn(
                    'p-2 rounded-lg transition-colors',
                    exp.isVisible
                      ? 'text-green-600 bg-green-50 hover:bg-green-100'
                      : 'text-neutral-400 hover:bg-neutral-100'
                  )}
                  title={exp.isVisible ? 'Hide experience' : 'Show experience'}
                >
                  {exp.isVisible ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>

                <button
                  onClick={() => onEdit(exp)}
                  className="p-2 rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors"
                  title="Edit experience"
                >
                  <Pencil className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDelete(exp.id, exp.jobTitle, exp.company)}
                  disabled={isSaving}
                  className="p-2 rounded-lg text-neutral-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                  title="Delete experience"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {sortedExperiences.length === 0 && (
          <div className="bg-white rounded-xl p-8 border border-neutral-200 text-center">
            <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-neutral-400" />
            </div>
            <p className="text-neutral-600 mb-2">No work experience yet</p>
            <p className="text-sm text-neutral-400 mb-4">
              Add your professional experience to showcase your career
            </p>
            <button onClick={onAdd} className="btn btn-primary gap-2">
              <Plus className="w-4 h-4" />
              Add Experience
            </button>
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
        <h4 className="font-medium text-blue-800 mb-2">💡 Tips</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• List your most recent/relevant positions first</li>
          <li>• Use action verbs: "Led", "Built", "Improved", "Delivered"</li>
          <li>• Include measurable achievements when possible</li>
          <li>• Keep descriptions concise but impactful</li>
        </ul>
      </div>
    </div>
  );
}