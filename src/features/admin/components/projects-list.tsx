'use client';

import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Star,
  StarOff,
  GripVertical,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  Github,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import type { Project } from '@/shared/types';

interface ProjectsListProps {
  projects: Project[];
  isSaving: boolean;
  onAdd: () => void;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onToggleFeatured: (id: string) => void;
  onReorder: (projectIds: string[]) => void;
}

export function ProjectsList({
  projects,
  isSaving,
  onAdd,
  onEdit,
  onDelete,
  onToggleVisibility,
  onToggleFeatured,
  onReorder,
}: ProjectsListProps) {
  // Sort by order
  const sortedProjects = [...projects].sort((a, b) => a.order - b.order);

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newOrder = [...sortedProjects];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    onReorder(newOrder.map((p) => p.id));
  };

  const handleMoveDown = (index: number) => {
    if (index === sortedProjects.length - 1) return;
    const newOrder = [...sortedProjects];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    onReorder(newOrder.map((p) => p.id));
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Delete "${title}"? This cannot be undone.`)) {
      onDelete(id);
    }
  };

  return (
    <div className="space-y-4">
      {/* Add Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-neutral-800">
          All Projects ({projects.length})
        </h3>
        <button
          onClick={onAdd}
          className="btn btn-primary gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      {/* Projects List */}
      <div className="space-y-3">
        {sortedProjects.map((project, index) => (
          <div
            key={project.id}
            className={cn(
              'bg-white rounded-xl border shadow-sm overflow-hidden',
              'transition-all duration-200',
              !project.isVisible && 'opacity-60',
              project.featured && 'border-amber-300'
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
                  disabled={index === sortedProjects.length - 1}
                  className={cn(
                    'p-1 rounded hover:bg-neutral-100',
                    index === sortedProjects.length - 1 && 'opacity-30 cursor-not-allowed'
                  )}
                >
                  <ChevronDown className="w-4 h-4 text-neutral-400" />
                </button>
              </div>

              {/* Project Image */}
              {project.imageUrl ? (
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-primary-300">
                    {project.title.charAt(0)}
                  </span>
                </div>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-semibold text-neutral-800 flex items-center gap-2">
                      {project.title}
                      {project.featured && (
                        <span className="px-2 py-0.5 text-xs bg-amber-100 text-amber-700 rounded-full">
                          Featured
                        </span>
                      )}
                      {!project.isVisible && (
                        <span className="px-2 py-0.5 text-xs bg-neutral-200 text-neutral-600 rounded-full">
                          Hidden
                        </span>
                      )}
                    </h4>
                    <p className="text-sm text-neutral-500 mt-1 line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                </div>

                {/* Tech Stack */}
                {project.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 text-xs bg-primary-100 text-primary-700 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {/* Links */}
                {(project.liveUrl || project.githubUrl) && (
                  <div className="flex gap-3 mt-2">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-primary-600 hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Live Demo
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-neutral-600 hover:underline"
                      >
                        <Github className="w-3 h-3" />
                        Source
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => onToggleFeatured(project.id)}
                  disabled={isSaving}
                  className={cn(
                    'p-2 rounded-lg transition-colors',
                    project.featured
                      ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
                      : 'text-neutral-400 hover:bg-neutral-100 hover:text-amber-500'
                  )}
                  title={project.featured ? 'Remove from featured' : 'Mark as featured'}
                >
                  {project.featured ? (
                    <Star className="w-4 h-4 fill-current" />
                  ) : (
                    <StarOff className="w-4 h-4" />
                  )}
                </button>

                <button
                  onClick={() => onToggleVisibility(project.id)}
                  disabled={isSaving}
                  className={cn(
                    'p-2 rounded-lg transition-colors',
                    project.isVisible
                      ? 'text-green-600 bg-green-50 hover:bg-green-100'
                      : 'text-neutral-400 hover:bg-neutral-100'
                  )}
                  title={project.isVisible ? 'Hide project' : 'Show project'}
                >
                  {project.isVisible ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>

                <button
                  onClick={() => onEdit(project)}
                  className="p-2 rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors"
                  title="Edit project"
                >
                  <Pencil className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDelete(project.id, project.title)}
                  disabled={isSaving}
                  className="p-2 rounded-lg text-neutral-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                  title="Delete project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {sortedProjects.length === 0 && (
          <div className="bg-white rounded-xl p-8 border border-neutral-200 text-center">
            <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-neutral-400" />
            </div>
            <p className="text-neutral-600 mb-2">No projects yet</p>
            <p className="text-sm text-neutral-400 mb-4">
              Add your first project to showcase your work
            </p>
            <button onClick={onAdd} className="btn btn-primary gap-2">
              <Plus className="w-4 h-4" />
              Add Project
            </button>
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
        <h4 className="font-medium text-blue-800 mb-2">💡 Tips</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Mark your best work as "Featured" to show it first</li>
          <li>• Hide work-in-progress projects until they're ready</li>
          <li>• Include live demos and source code links when possible</li>
          <li>• Use clear, descriptive titles and tech stack tags</li>
        </ul>
      </div>
    </div>
  );
}