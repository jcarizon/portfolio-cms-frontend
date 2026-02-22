'use client';

import { Building2, MapPin, Calendar } from 'lucide-react';
import { formatDateRange } from '@/shared/lib/utils';
import type { Experience } from '@/shared/types';

interface ExperiencePreviewProps {
  experiences: Experience[];
}

export function ExperiencePreview({ experiences }: ExperiencePreviewProps) {
  // Filter visible and sort by order
  const visibleExperiences = experiences
    .filter((e) => e.isVisible)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="rounded-xl overflow-hidden shadow-lg border border-neutral-200">
      {/* Preview Label */}
      <div className="bg-neutral-800 text-white text-xs px-4 py-2 flex items-center justify-between">
        <span>Live Preview</span>
        <span className="text-neutral-400">
          {visibleExperiences.length} visible
        </span>
      </div>

      {/* Preview Content */}
      <div className="bg-neutral-50 p-6">
        {/* Section Title */}
        <h2 className="text-xl font-bold text-primary-600 text-center mb-4">
          Work Experience
          <div className="w-10 h-1 bg-gradient-to-r from-[#667eea] to-[#764ba2] mx-auto mt-2 rounded" />
        </h2>

        {/* Timeline */}
        {visibleExperiences.length > 0 ? (
          <div className="space-y-4">
            {visibleExperiences.map((exp, index) => (
              <div
                key={exp.id}
                className="relative pl-6 border-l-2 border-primary-200"
              >
                {/* Timeline Dot */}
                <div className="absolute left-[-5px] top-1 w-2 h-2 rounded-full bg-primary-500" />

                {/* Content */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  {/* Current Badge */}
                  {!exp.endDate && (
                    <span className="inline-block px-2 py-0.5 text-[10px] bg-green-100 text-green-700 rounded-full mb-2">
                      Current
                    </span>
                  )}

                  <h3 className="font-semibold text-neutral-800 text-sm">
                    {exp.jobTitle}
                  </h3>

                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-neutral-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      {exp.company}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {exp.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDateRange(exp.startDate, exp.endDate)}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-600 mt-2 line-clamp-2">
                    {exp.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-neutral-400 italic text-center py-8 text-sm">
            No visible experiences to display
          </p>
        )}
      </div>
    </div>
  );
}