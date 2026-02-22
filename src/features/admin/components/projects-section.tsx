'use client';

import { useEffect, useRef, useState } from 'react';
import { ExternalLink, Github, Loader2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { projectsApi } from '@/shared/lib/api';
import type { Project } from '@/shared/types';

export function ProjectsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Fetch projects from API (only visible ones)
    const fetchProjects = async () => {
      try {
        const response = await projectsApi.getAll(false);
        setProjects(response.data);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Sort by featured first, then order
  const sortedProjects = [...projects].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return a.order - b.order;
  });

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="section bg-white"
    >
      <div className="container mx-auto px-5">
        <h2 className="section-title">Featured Projects</h2>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 text-primary-600 animate-spin" />
          </div>
        ) : sortedProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {sortedProjects.map((project, index) => (
              <article
                key={project.id}
                className={cn(
                  'card p-6 group',
                  'transition-all duration-700',
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                )}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Project Image */}
                {project.imageUrl ? (
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                ) : (
                  <div className="w-full h-48 rounded-lg mb-4 bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
                    <span className="text-4xl font-bold text-primary-300">
                      {project.title.charAt(0)}
                    </span>
                  </div>
                )}

                <h3 className="text-xl font-bold text-primary-600 mb-2 group-hover:text-primary-700 transition-colors flex items-center gap-2">
                  {project.title}
                  {project.featured && (
                    <span className="px-2 py-0.5 text-xs bg-amber-100 text-amber-700 rounded-full">
                      Featured
                    </span>
                  )}
                </h3>

                <p className="text-neutral-600 mb-2">{project.description}</p>

                {project.details && (
                  <p className="text-sm text-neutral-500 mb-4">{project.details}</p>
                )}

                {/* Tech Stack */}
                {project.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack.map((tech) => (
                      <span key={tech} className="tech-badge">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {/* Links */}
                {(project.liveUrl || project.githubUrl) && (
                  <div className="flex gap-3 pt-4 border-t border-neutral-100">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Live Demo
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm text-neutral-600 hover:text-neutral-800 transition-colors"
                      >
                        <Github className="w-4 h-4" />
                        Source Code
                      </a>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>
        ) : (
          <p className="text-center text-neutral-500 py-8">
            No projects to display
          </p>
        )}
      </div>
    </section>
  );
}