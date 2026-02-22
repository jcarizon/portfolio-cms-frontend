'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { ProtectedRoute } from '@/features/admin/components/protected-route';
import { AdminLayout } from '@/features/admin/components/admin-layout';
import { ExperienceList } from '@/features/admin/components/experience-list';
import { ExperiencePreview } from '@/features/admin/components/experience-preview';
import { ExperienceModal } from '@/features/admin/components/experience-modal';
import { useExperience } from '@/features/admin/hooks/use-experience';
import type { Experience } from '@/shared/types';

function ExperiencePageContent() {
  const {
    experiences,
    isLoading,
    isSaving,
    error,
    createExperience,
    updateExperience,
    deleteExperience,
    toggleVisibility,
    reorderExperiences,
  } = useExperience();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);

  const handleAdd = () => {
    setEditingExperience(null);
    setIsModalOpen(true);
  };

  const handleEdit = (experience: Experience) => {
    setEditingExperience(experience);
    setIsModalOpen(true);
  };

  const handleSave = async (data: Partial<Experience>) => {
    if (editingExperience) {
      await updateExperience(editingExperience.id, data);
    } else {
      await createExperience(data);
    }
    setIsModalOpen(false);
    setEditingExperience(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingExperience(null);
  };

  if (isLoading) {
    return (
      <AdminLayout title="Experience" description="Manage your work history">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Experience" description="Manage your work history">
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
      title="Experience"
      description="Add and manage your professional work history"
    >
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* List Column */}
        <div className="xl:col-span-2">
          <ExperienceList
            experiences={experiences}
            isSaving={isSaving}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={deleteExperience}
            onToggleVisibility={toggleVisibility}
            onReorder={reorderExperiences}
          />
        </div>

        {/* Preview Column */}
        <div className="xl:sticky xl:top-24 xl:self-start">
          <ExperiencePreview experiences={experiences} />
        </div>
      </div>

      {/* Modal */}
      <ExperienceModal
        experience={editingExperience}
        isOpen={isModalOpen}
        isSaving={isSaving}
        onClose={handleCloseModal}
        onSave={handleSave}
      />
    </AdminLayout>
  );
}

export default function ExperienceAdminPage() {
  return (
    <ProtectedRoute>
      <ExperiencePageContent />
    </ProtectedRoute>
  );
}