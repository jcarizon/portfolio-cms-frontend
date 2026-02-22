import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { projectsApi } from '@/shared/lib/api';
import type { Project } from '@/shared/types';

interface UseProjectsReturn {
  projects: Project[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  createProject: (data: Partial<Project>) => Promise<Project>;
  updateProject: (id: string, data: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  toggleVisibility: (id: string) => Promise<void>;
  toggleFeatured: (id: string) => Promise<void>;
  reorderProjects: (projectIds: string[]) => Promise<void>;
}

export function useProjects(): UseProjectsReturn {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await projectsApi.getAll(true); // Include hidden
      setProjects(response.data);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to load projects';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createProject = useCallback(async (data: Partial<Project>) => {
    setIsSaving(true);
    try {
      const response = await projectsApi.create(data);
      setProjects((prev) => [...prev, response.data]);
      toast.success('Project created!');
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to create project';
      toast.error(message);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const updateProject = useCallback(async (id: string, data: Partial<Project>) => {
    setIsSaving(true);
    try {
      const response = await projectsApi.update(id, data);
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? response.data : p))
      );
      toast.success('Project updated!');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to update project';
      toast.error(message);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const deleteProject = useCallback(async (id: string) => {
    setIsSaving(true);
    try {
      await projectsApi.delete(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      toast.success('Project deleted!');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to delete project';
      toast.error(message);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const toggleVisibility = useCallback(async (id: string) => {
    setIsSaving(true);
    try {
      const response = await projectsApi.toggleVisibility(id);
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? response.data : p))
      );
      toast.success(response.data.isVisible ? 'Project visible' : 'Project hidden');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to toggle visibility';
      toast.error(message);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const toggleFeatured = useCallback(async (id: string) => {
    setIsSaving(true);
    try {
      const response = await projectsApi.toggleFeatured(id);
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? response.data : p))
      );
      toast.success(response.data.featured ? 'Project featured' : 'Project unfeatured');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to toggle featured';
      toast.error(message);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const reorderProjects = useCallback(async (projectIds: string[]) => {
    setIsSaving(true);
    try {
      // Optimistic update
      const reordered = projectIds.map((id, index) => {
        const project = projects.find((p) => p.id === id)!;
        return { ...project, order: index };
      });
      setProjects(reordered);

      await projectsApi.reorder({ items: projectIds.map((id) => ({ id })) });
    } catch (err: any) {
      await fetchProjects();
      const message = err.response?.data?.message || 'Failed to reorder projects';
      toast.error(message);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, [projects, fetchProjects]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    isLoading,
    isSaving,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    toggleVisibility,
    toggleFeatured,
    reorderProjects,
  };
}