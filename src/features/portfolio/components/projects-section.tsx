'use client';

import { useEffect, useRef, useState } from 'react';
import { ExternalLink, Github } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import type { Project } from '@/shared/types';

// Temporary mock data
const mockProjects: Project[] = [
  {
    id: '1',
    title: 'LeadAI',
    description: 'Solo mobile developer with full ownership of the app, from planning to structure to publishing.',
    details: 'AI-powered mobile application for lead generation.',
    imageUrl: null,
    liveUrl: null,
    githubUrl: null,
    techStack: ['React Native', 'Redux Toolkit'],
    featured: true,
    order: 0,
    isVisible: true,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '2',
    title: 'Dental System SaaS',
    description: 'Comprehensive dental practice management system with booking appointments and separate portals for dentists and patients.',
    details: 'Currently in progress.',
    imageUrl: null,
    liveUrl: null,
    githubUrl: null,
    techStack: ['Next.js', 'Nest.js', 'Redux Toolkit', 'PostgreSQL'],
    featured: true,
    order: 1,
    isVisible: true,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '3',
    title: 'Colegio de Sto. Tomas-Recoletos Enrollment System',
    description: 'Full-featured enrollment management system for educational institution.',
    details: 'Freelance project currently in progress.',
    imageUrl: null,
    liveUrl: null,
    githubUrl: null,
    techStack: ['Laravel', 'Vue.js', 'MySQL', 'SCSS'],
    featured: true,
    order: 2,
    isVisible: true,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '4',
    title: 'Invoicer & LMS',
    description: 'Attendance checker with hourly computation for time tracking and learning management.',
    details: 'Personal projects in development.',
    imageUrl: null,
    liveUrl: null,
    githubUrl: null,
    techStack: ['React Native', 'React', 'Nest.js', 'Firebase'],
    featured: false,
    order: 3,
    isVisible: true,
    createdAt: '',
    updatedAt: '',
  },
];

export function ProjectsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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

  const visibleProjects = mockProjects.filter((p) => p.isVisible);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="section bg-white"
    >
      <div className="container mx-auto px-5">
        <h2 className="section-title">Featured Projects</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {visibleProjects
            .sort((a, b) => a.order - b.order)
            .map((project, index) => (
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
                {/* Project Image Placeholder */}
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

                <h3 className="text-xl font-bold text-primary-600 mb-2 group-hover:text-primary-700 transition-colors">
                  {project.title}
                </h3>

                <p className="text-neutral-600 mb-2">{project.description}</p>

                {project.details && (
                  <p className="text-sm text-neutral-500 mb-4">{project.details}</p>
                )}

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.techStack.map((tech) => (
                    <span key={tech} className="tech-badge">
                      {tech}
                    </span>
                  ))}
                </div>

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
      </div>
    </section>
  );
}
