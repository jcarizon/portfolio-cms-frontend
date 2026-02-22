'use client';

import type { AboutParagraph, HeroStat } from '@/shared/types';

interface AboutPreviewProps {
  paragraphs: AboutParagraph[];
  stats: HeroStat[];
}

export function AboutPreview({ paragraphs, stats }: AboutPreviewProps) {
  const sortedParagraphs = [...paragraphs].sort((a, b) => a.order - b.order);

  return (
    <div className="rounded-xl overflow-hidden shadow-lg border border-neutral-200">
      {/* Preview Label */}
      <div className="bg-neutral-800 text-white text-xs px-4 py-2 flex items-center justify-between">
        <span>Live Preview</span>
        <span className="text-neutral-400">About Section</span>
      </div>

      {/* Preview Content */}
      <div className="bg-white p-8">
        {/* Section Title */}
        <h2 className="text-2xl font-bold text-primary-600 text-center mb-6">
          About Me
          <div className="w-12 h-1 bg-gradient-to-r from-[#667eea] to-[#764ba2] mx-auto mt-3 rounded" />
        </h2>

        {/* Paragraphs */}
        <div className="space-y-4 max-w-2xl mx-auto">
          {sortedParagraphs.length > 0 ? (
            sortedParagraphs.map((paragraph) => (
              <p
                key={paragraph.id}
                className="text-neutral-600 leading-relaxed"
              >
                {paragraph.text || (
                  <span className="text-neutral-400 italic">Empty paragraph...</span>
                )}
              </p>
            ))
          ) : (
            <p className="text-neutral-400 italic text-center">
              No paragraphs added yet. Add one to get started!
            </p>
          )}
        </div>

        {/* Stats Preview */}
        {stats.length > 0 && (
          <div className="grid grid-cols-4 gap-4 mt-8 pt-8 border-t border-neutral-200">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-xl font-bold text-primary-600">{stat.value}</div>
                <div className="text-xs text-neutral-500">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}