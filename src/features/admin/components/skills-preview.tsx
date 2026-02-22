'use client';

import type { SkillCategory } from '@/shared/types';

interface SkillsPreviewProps {
  categories: SkillCategory[];
}

export function SkillsPreview({ categories }: SkillsPreviewProps) {
  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

  return (
    <div className="rounded-xl overflow-hidden shadow-lg border border-neutral-200">
      {/* Preview Label */}
      <div className="bg-neutral-800 text-white text-xs px-4 py-2 flex items-center justify-between">
        <span>Live Preview</span>
        <span className="text-neutral-400">Skills Section</span>
      </div>

      {/* Preview Content */}
      <div className="bg-neutral-50 p-8">
        {/* Section Title */}
        <h2 className="text-2xl font-bold text-primary-600 text-center mb-6">
          Technical Skills
          <div className="w-12 h-1 bg-gradient-to-r from-[#667eea] to-[#764ba2] mx-auto mt-3 rounded" />
        </h2>

        {/* Categories Grid */}
        {sortedCategories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedCategories.map((category) => {
              const sortedSkills = [...category.skills].sort(
                (a, b) => a.order - b.order
              );

              return (
                <div
                  key={category.id}
                  className="bg-white p-5 rounded-xl shadow-sm"
                >
                  <h3 className="text-sm font-bold text-primary-600 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#667eea] to-[#764ba2]" />
                    {category.name}
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {sortedSkills.length > 0 ? (
                      sortedSkills.map((skill) => (
                        <span
                          key={skill.id}
                          className="px-3 py-1 text-xs bg-neutral-100 text-neutral-700 rounded-md"
                        >
                          {skill.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-neutral-400 italic">
                        No skills added
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-neutral-400 italic text-center py-8">
            No skill categories added yet
          </p>
        )}
      </div>
    </div>
  );
}