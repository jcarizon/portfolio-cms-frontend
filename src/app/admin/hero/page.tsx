'use client';

import { useState, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { ProtectedRoute } from '@/features/admin/components/protected-route';
import { AdminLayout } from '@/features/admin/components/admin-layout';
import { HeroForm } from '@/features/admin/components/hero-form';
import { HeroPreview } from '@/features/admin/components/hero-preview';
import { useHero } from '@/features/admin/hooks/use-hero';
import type { Hero } from '@/shared/types';

function HeroPageContent() {
  const { hero, isLoading, isSaving, error, updateHero } = useHero();
  const [previewData, setPreviewData] = useState<Partial<Hero>>({});

  const handlePreviewChange = useCallback((data: Partial<Hero>) => {
    setPreviewData(data);
  }, []);

  if (isLoading) {
    return (
      <AdminLayout title="Hero Section" description="Edit your hero section content">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  if (error || !hero) {
    return (
      <AdminLayout title="Hero Section" description="Edit your hero section content">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 mb-4">{error || 'Failed to load hero data'}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      </AdminLayout>
    );
  }

  // Merge hero data with preview data for live preview
  const previewHero = { ...hero, ...previewData };

  return (
    <AdminLayout
      title="Hero Section"
      description="Edit your hero section content and see live preview"
    >
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Form Column */}
        <div>
          <HeroForm
            hero={hero}
            isSaving={isSaving}
            onSubmit={updateHero}
            onPreviewChange={handlePreviewChange}
          />
        </div>

        {/* Preview Column */}
        <div className="xl:sticky xl:top-24 xl:self-start">
          <HeroPreview hero={previewHero} />
        </div>
      </div>
    </AdminLayout>
  );
}

export default function HeroAdminPage() {
  return (
    <ProtectedRoute>
      <HeroPageContent />
    </ProtectedRoute>
  );
}