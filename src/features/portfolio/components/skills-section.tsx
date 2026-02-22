'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { skillsApi } from '@/shared/lib/api';
import type { SkillCategory } from '@/shared/types';

export function SkillsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Fetch skills from API
    const fetchSkills = async () => {
      try {
        const response = await skillsApi.getAll();
        setCategories(response.data);
      } catch (error) {
        console.error('Failed to fetch skills:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSkills();
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

  // Sort categories by order
  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="section bg-neutral-50"
    >
      <div className="container mx-auto px-5">
        <h2 className="section-title">Technical Skills</h2>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 text-primary-600 animate-spin" />
          </div>
        ) : sortedCategories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {sortedCategories.map((category, categoryIndex) => {
              const sortedSkills = [...category.skills].sort(
                (a, b) => a.order - b.order
              );

              return (
                <div
                  key={category.id}
                  className={cn(
                    'card p-6',
                    'transition-all duration-700',
                    isVisible
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-8'
                  )}
                  style={{ transitionDelay: `${categoryIndex * 100}ms` }}
                >
                  <h3 className="text-lg font-bold text-primary-600 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#667eea] to-[#764ba2]" />
                    {category.name}
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {sortedSkills.map((skill, skillIndex) => (
                      <span
                        key={skill.id}
                        className={cn(
                          'skill-tag',
                          'transition-all duration-500',
                          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                        )}
                        style={{
                          transitionDelay: `${categoryIndex * 100 + skillIndex * 50}ms`,
                        }}
                      >
                        {skill.name}
                      </span>
                    ))}

                    {sortedSkills.length === 0 && (
                      <span className="text-sm text-neutral-400 italic">
                        No skills added
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-neutral-500 py-8">
            No skills to display
          </p>
        )}
      </div>
    </section>
  );
}