'use client';

import { ExternalLink, Github } from 'lucide-react';
import type { Project } from '@/shared/types';

interface ProjectsPreviewProps {
  projects: Project[];
}

export function ProjectsPreview({ projects }: ProjectsPreviewProps) {
  // Filter visible and sort by featured first, then order
  const visibleProjects = projects
    .filter((p) => p.isVisible)
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return a.order - b.order;
    });

  return (
    <div className="rounded-xl overflow-hidden shadow-lg border border-neutral-200">
      {/* Preview Label */}
      <div className="bg-neutral-800 text-white text-xs px-4 py-2 flex items-center justify-between">
        <span>Live Preview</span>
        <span className="text-neutral-400">
          {visibleProjects.length} visible project{visibleProjects.length !== 1 && 's'}
        </span>
      </div>

      {/* Preview Content */}
      <div className="bg-white p-6">
        {/* Section Title */}
        <h2 className="text-xl font-bold text-primary-600 text-center mb-4">
          Featured Projects
          <div className="w-10 h-1 bg-gradient-to-r from-[#667eea] to-[#764ba2] mx-auto mt-2 rounded" />
        </h2>

        {/* Projects Grid */}
        {visibleProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visibleProjects.slice(0, 4).map((project) => (
              <div
                key={project.id}
                className="bg-neutral-50 rounded-lg p-4 border border-neutral-200"
              >
                {/* Image Placeholder */}
                <div className="w-full h-24 rounded-lg mb-3 bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary-300">
                    {project.title.charAt(0)}
                  </span>
                </div>

                {/* Content */}
                <h3 className="font-semibold text-neutral-800 text-sm mb-1 flex items-center gap-2">
                  {project.title}
                  {project.featured && (
                    <span className="px-1.5 py-0.5 text-[10px] bg-amber-100 text-amber-700 rounded">
                      Featured
                    </span>
                  )}
                </h3>
                <p className="text-xs text-neutral-500 mb-2 line-clamp-2">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-1 mb-2">
                  {project.techStack.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 text-[10px] bg-primary-600 text-white rounded"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.techStack.length > 3 && (
                    <span className="text-[10px] text-neutral-400">
                      +{project.techStack.length - 3}
                    </span>
                  )}
                </div>

                {/* Links */}
                {(project.liveUrl || project.githubUrl) && (
                  <div className="flex gap-2 pt-2 border-t border-neutral-200">
                    {project.liveUrl && (
                      <span className="flex items-center gap-1 text-[10px] text-primary-600">
                        <ExternalLink className="w-3 h-3" />
                        Live
                      </span>
                    )}
                    {project.githubUrl && (
                      <span className="flex items-center gap-1 text-[10px] text-neutral-500">
                        <Github className="w-3 h-3" />
                        Code
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-neutral-400 italic text-center py-8 text-sm">
            No visible projects to display
          </p>
        )}

        {visibleProjects.length > 4 && (
          <p className="text-xs text-neutral-400 text-center mt-3">
            +{visibleProjects.length - 4} more projects
          </p>
        )}
      </div>
    </div>
  );
}