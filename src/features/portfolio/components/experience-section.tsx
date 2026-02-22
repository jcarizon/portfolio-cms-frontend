'use client';

import { useEffect, useRef, useState } from 'react';
import { Building2, MapPin, Calendar, Loader2 } from 'lucide-react';
import { cn, formatDateRange } from '@/shared/lib/utils';
import { experienceApi } from '@/shared/lib/api';
import type { Experience } from '@/shared/types';

export function ExperienceSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Fetch experiences from API (only visible ones)
    const fetchExperiences = async () => {
      try {
        const response = await experienceApi.getAll(false);
        setExperiences(response.data);
      } catch (error) {
        console.error('Failed to fetch experiences:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExperiences();
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

  // Sort by order
  const sortedExperiences = [...experiences].sort((a, b) => a.order - b.order);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="section bg-neutral-50"
    >
      <div className="container mx-auto px-5 max-w-4xl">
        <h2 className="section-title">Work Experience</h2>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 text-primary-600 animate-spin" />
          </div>
        ) : sortedExperiences.length > 0 ? (
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-400 via-accent-400 to-primary-200 hidden md:block" />

            {sortedExperiences.map((experience, index) => {
              const isEven = index % 2 === 0;

              return (
                <div
                  key={experience.id}
                  className={cn(
                    'relative mb-8 last:mb-0',
                    'md:w-[calc(50%-2rem)]',
                    isEven ? 'md:ml-auto md:pl-8' : 'md:mr-auto md:pr-8',
                    'transition-all duration-700',
                    isVisible
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-8'
                  )}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  {/* Timeline Dot */}
                  <div
                    className={cn(
                      'hidden md:block absolute top-6 w-4 h-4 rounded-full',
                      'bg-white border-4 border-primary-500',
                      isEven ? '-left-[2.5rem]' : '-right-[2.5rem]'
                    )}
                  />

                  <article className="card p-6 relative">
                    {/* Current Job Badge */}
                    {!experience.endDate && (
                      <span className="absolute -top-3 right-4 px-3 py-1 text-xs font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-full">
                        Current
                      </span>
                    )}

                    <h3 className="text-xl font-bold text-primary-600 mb-1">
                      {experience.jobTitle}
                    </h3>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {experience.company}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {experience.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDateRange(experience.startDate, experience.endDate)}
                      </span>
                    </div>

                    <p className="text-neutral-600 leading-relaxed">
                      {experience.description}
                    </p>
                  </article>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-neutral-500 py-8">
            No experience to display
          </p>
        )}
      </div>
    </section>
  );
}