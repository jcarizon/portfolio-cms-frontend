'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { ProtectedRoute } from '@/features/admin/components/protected-route';
import { AdminLayout } from '@/features/admin/components/admin-layout';
import { ProjectsList } from '@/features/admin/components/projects-list';
import { ProjectsPreview } from '@/features/admin/components/projects-preview';
import { ProjectModal } from '@/features/admin/components/project-modal';
import { useProjects } from '@/features/admin/hooks/use-projects';
import type { Project } from '@/shared/types';

function ProjectsPageContent() {
  const {
    projects,
    isLoading,
    isSaving,
    error,
    createProject,
    updateProject,
    deleteProject,
    toggleVisibility,
    toggleFeatured,
    reorderProjects,
  } = useProjects();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleAdd = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleSave = async (data: Partial<Project>) => {
    if (editingProject) {
      await updateProject(editingProject.id, data);
    } else {
      await createProject(data);
    }
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  if (isLoading) {
    return (
      <AdminLayout title="Projects" description="Manage your portfolio projects">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Projects" description="Manage your portfolio projects">
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
      title="Projects"
      description="Add, edit, and organize your portfolio projects"
    >
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* List Column */}
        <div className="xl:col-span-2">
          <ProjectsList
            projects={projects}
            isSaving={isSaving}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={deleteProject}
            onToggleVisibility={toggleVisibility}
            onToggleFeatured={toggleFeatured}
            onReorder={reorderProjects}
          />
        </div>

        {/* Preview Column */}
        <div className="xl:sticky xl:top-24 xl:self-start">
          <ProjectsPreview projects={projects} />
        </div>
      </div>

      {/* Modal */}
      <ProjectModal
        project={editingProject}
        isOpen={isModalOpen}
        isSaving={isSaving}
        onClose={handleCloseModal}
        onSave={handleSave}
      />
    </AdminLayout>
  );
}

export default function ProjectsAdminPage() {
  return (
    <ProtectedRoute>
      <ProjectsPageContent />
    </ProtectedRoute>
  );
}