'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { aboutApi, heroApi } from '@/shared/lib/api';
import type { AboutParagraph, HeroStat } from '@/shared/types';

// Default data while loading
const defaultParagraphs: AboutParagraph[] = [
  {
    id: '1',
    text: 'Web developer with 8+ years of experience in building ERP, HRIS, and e-commerce platforms using Vue, React, Node.js, Laravel, and AWS. Skilled in leading frontend teams, optimizing UI performance, and delivering scalable cloud-based apps.',
    order: 0,
  },
  {
    id: '2',
    text: 'Mainly a frontend engineer but solid knowledge about backend technologies like PHP, Nest, and Express. Currently working as a solo mobile developer on LeadAI, building AI-powered solutions with React Native and Redux Toolkit.',
    order: 1,
  },
];

export function AboutSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [paragraphs, setParagraphs] = useState<AboutParagraph[]>(defaultParagraphs);
  const [stats, setStats] = useState<HeroStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aboutRes, heroRes] = await Promise.all([aboutApi.get(), heroApi.get()]);
        if (aboutRes.data?.content) {
          setParagraphs(aboutRes.data.content);
        }
        if (heroRes.data?.stats) {
          setStats(heroRes.data.stats);
        }
      } catch (error) {
        console.error('Failed to fetch about:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
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

  // Sort paragraphs by order
  const sortedParagraphs = [...paragraphs].sort((a, b) => a.order - b.order);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="section bg-white"
    >
      <div className="container mx-auto px-5 max-w-4xl">
        <h2 className="section-title">About Me</h2>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 text-primary-600 animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            {sortedParagraphs.map((paragraph, index) => (
              <p
                key={paragraph.id}
                className={cn(
                  'text-lg md:text-xl leading-relaxed text-neutral-600',
                  'transition-all duration-700',
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4'
                )}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {paragraph.text}
              </p>
            ))}
          </div>
        )}

        {/* Stats */}
        {stats.length > 0 && (
          <div
            className={cn(
              'grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-12 border-t border-neutral-200',
              'transition-all duration-700 delay-300',
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-neutral-500">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}