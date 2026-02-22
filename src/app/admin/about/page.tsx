'use client';

import { useState, useCallback, useEffect } from 'react';
import { Loader2, BarChart2, Plus, Trash2, Save } from 'lucide-react';
import { ProtectedRoute } from '@/features/admin/components/protected-route';
import { AdminLayout } from '@/features/admin/components/admin-layout';
import { AboutForm } from '@/features/admin/components/about-form';
import { AboutPreview } from '@/features/admin/components/about-preview';
import { useAbout } from '@/features/admin/hooks/use-about';
import { useHero } from '@/features/admin/hooks/use-hero';
import { cn } from '@/shared/lib/utils';
import type { AboutParagraph, HeroStat } from '@/shared/types';

function AboutPageContent() {
  const { about, isLoading, isSaving, error, updateAbout } = useAbout();
  const { hero, updateHero, isSaving: isHeroSaving } = useHero();

  const [previewParagraphs, setPreviewParagraphs] = useState<AboutParagraph[]>([]);
  const [localStats, setLocalStats] = useState<HeroStat[]>([]);
  const [statsDirty, setStatsDirty] = useState(false);

  // Sync hero stats into local state once loaded
  useEffect(() => {
    if (hero?.stats) {
      setLocalStats(hero.stats);
    }
  }, [hero]);

  const handlePreviewChange = useCallback((paragraphs: AboutParagraph[]) => {
    setPreviewParagraphs(paragraphs);
  }, []);

  const handleSubmit = async (paragraphs: AboutParagraph[]) => {
    await updateAbout({ content: paragraphs });
  };

  const handleStatChange = (index: number, field: 'value' | 'label', val: string) => {
    setLocalStats((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: val } : s))
    );
    setStatsDirty(true);
  };

  const handleAddStat = () => {
    if (localStats.length >= 6) return;
    setLocalStats((prev) => [...prev, { value: '', label: '' }]);
    setStatsDirty(true);
  };

  const handleRemoveStat = (index: number) => {
    setLocalStats((prev) => prev.filter((_, i) => i !== index));
    setStatsDirty(true);
  };

  const handleStatsSave = async () => {
    const valid = localStats.every((s) => s.value.trim() && s.label.trim());
    if (!valid) return;
    await updateHero({ stats: localStats });
    setStatsDirty(false);
  };

  if (isLoading) {
    return (
      <AdminLayout title="About Section" description="Edit your about section content">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  if (error || !about) {
    return (
      <AdminLayout title="About Section" description="Edit your about section content">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 mb-4">{error || 'Failed to load about data'}</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </AdminLayout>
    );
  }

  const displayParagraphs =
    previewParagraphs.length > 0 ? previewParagraphs : about.content;

  return (
    <AdminLayout
      title="About Section"
      description="Edit your bio, stats, and introduction paragraphs"
    >
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Form Column */}
        <div className="space-y-6">
          <AboutForm
            paragraphs={about.content}
            isSaving={isSaving}
            onSubmit={handleSubmit}
            onPreviewChange={handlePreviewChange}
          />

          {/* Stats Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-800 flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-primary-600" />
                Stats
              </h3>
              {localStats.length < 6 && (
                <button
                  type="button"
                  onClick={handleAddStat}
                  className="btn bg-neutral-100 text-neutral-700 hover:bg-neutral-200 gap-2 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Stat
                </button>
              )}
            </div>

            {localStats.length === 0 ? (
              <p className="text-sm text-neutral-500 text-center py-4">
                No stats yet. Add some to display in the About section.
              </p>
            ) : (
              <div className="space-y-3">
                {localStats.map((stat, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <div className="flex-1">
                      <input
                        value={stat.value}
                        onChange={(e) => handleStatChange(index, 'value', e.target.value)}
                        className={cn(
                          'form-input',
                          !stat.value.trim() && statsDirty && 'border-red-500'
                        )}
                        placeholder="8+"
                        maxLength={20}
                      />
                    </div>
                    <div className="flex-[2]">
                      <input
                        value={stat.label}
                        onChange={(e) => handleStatChange(index, 'label', e.target.value)}
                        className={cn(
                          'form-input',
                          !stat.label.trim() && statsDirty && 'border-red-500'
                        )}
                        placeholder="Years Experience"
                        maxLength={50}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveStat(index)}
                      className="mt-1 p-2 rounded-lg text-neutral-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <p className="text-xs text-neutral-400 pt-1">
                  Value (e.g. "8+") · Label (e.g. "Years Experience") · Max 6 stats
                </p>
              </div>
            )}

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-100">
              <p className="text-sm text-neutral-500">
                {statsDirty ? '• You have unsaved changes' : '✓ All changes saved'}
              </p>
              <button
                type="button"
                onClick={handleStatsSave}
                disabled={
                  isHeroSaving ||
                  !statsDirty ||
                  localStats.some((s) => !s.value.trim() || !s.label.trim())
                }
                className={cn(
                  'btn btn-primary gap-2',
                  (isHeroSaving || !statsDirty) && 'opacity-50 cursor-not-allowed'
                )}
              >
                {isHeroSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Stats
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Preview Column */}
        <div className="xl:sticky xl:top-24 xl:self-start">
          <AboutPreview paragraphs={displayParagraphs} stats={localStats} />
        </div>
      </div>
    </AdminLayout>
  );
}

export default function AboutAdminPage() {
  return (
    <ProtectedRoute>
      <AboutPageContent />
    </ProtectedRoute>
  );
}
