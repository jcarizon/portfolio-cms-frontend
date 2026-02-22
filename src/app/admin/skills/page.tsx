'use client';

import { Loader2 } from 'lucide-react';
import { ProtectedRoute } from '@/features/admin/components/protected-route';
import { AdminLayout } from '@/features/admin/components/admin-layout';
import { SkillsForm } from '@/features/admin/components/skills-form';
import { SkillsPreview } from '@/features/admin/components/skills-preview';
import { useSkills } from '@/features/admin/hooks/use-skills';

function SkillsPageContent() {
  const {
    categories,
    isLoading,
    isSaving,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    createSkill,
    updateSkill,
    deleteSkill,
    reorderCategories,
    reorderSkills,
  } = useSkills();

  if (isLoading) {
    return (
      <AdminLayout title="Skills" description="Manage your technical skills">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Skills" description="Manage your technical skills">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
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

  return (
    <AdminLayout
      title="Skills"
      description="Manage skill categories and individual skills"
    >
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Form Column */}
        <div>
          <SkillsForm
            categories={categories}
            isSaving={isSaving}
            onCreateCategory={createCategory}
            onUpdateCategory={updateCategory}
            onDeleteCategory={deleteCategory}
            onCreateSkill={createSkill}
            onUpdateSkill={updateSkill}
            onDeleteSkill={deleteSkill}
            onReorderCategories={reorderCategories}
            onReorderSkills={reorderSkills}
          />
        </div>

        {/* Preview Column */}
        <div className="xl:sticky xl:top-24 xl:self-start">
          <SkillsPreview categories={categories} />
        </div>
      </div>
    </AdminLayout>
  );
}

export default function SkillsAdminPage() {
  return (
    <ProtectedRoute>
      <SkillsPageContent />
    </ProtectedRoute>
  );
}