import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { experienceApi } from '@/shared/lib/api';
import type { Experience } from '@/shared/types';

interface UseExperienceReturn {
  experiences: Experience[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  fetchExperiences: () => Promise<void>;
  createExperience: (data: Partial<Experience>) => Promise<Experience>;
  updateExperience: (id: string, data: Partial<Experience>) => Promise<void>;
  deleteExperience: (id: string) => Promise<void>;
  toggleVisibility: (id: string) => Promise<void>;
  reorderExperiences: (experienceIds: string[]) => Promise<void>;
}

export function useExperience(): UseExperienceReturn {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExperiences = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await experienceApi.getAll(true); // Include hidden
      setExperiences(response.data);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to load experiences';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createExperience = useCallback(async (data: Partial<Experience>) => {
    setIsSaving(true);
    try {
      const response = await experienceApi.create(data);
      setExperiences((prev) => [...prev, response.data]);
      toast.success('Experience added!');
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to create experience';
      toast.error(message);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const updateExperience = useCallback(async (id: string, data: Partial<Experience>) => {
    setIsSaving(true);
    try {
      const response = await experienceApi.update(id, data);
      setExperiences((prev) =>
        prev.map((e) => (e.id === id ? response.data : e))
      );
      toast.success('Experience updated!');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to update experience';
      toast.error(message);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const deleteExperience = useCallback(async (id: string) => {
    setIsSaving(true);
    try {
      await experienceApi.delete(id);
      setExperiences((prev) => prev.filter((e) => e.id !== id));
      toast.success('Experience deleted!');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to delete experience';
      toast.error(message);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const toggleVisibility = useCallback(async (id: string) => {
    setIsSaving(true);
    try {
      const response = await experienceApi.toggleVisibility(id);
      setExperiences((prev) =>
        prev.map((e) => (e.id === id ? response.data : e))
      );
      toast.success(response.data.isVisible ? 'Experience visible' : 'Experience hidden');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to toggle visibility';
      toast.error(message);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const reorderExperiences = useCallback(async (experienceIds: string[]) => {
    setIsSaving(true);
    try {
      // Optimistic update
      const reordered = experienceIds.map((id, index) => {
        const experience = experiences.find((e) => e.id === id)!;
        return { ...experience, order: index };
      });
      setExperiences(reordered);

      await experienceApi.reorder({ items: experienceIds.map((id) => ({ id })) });
    } catch (err: any) {
      await fetchExperiences();
      const message = err.response?.data?.message || 'Failed to reorder experiences';
      toast.error(message);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, [experiences, fetchExperiences]);

  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);

  return {
    experiences,
    isLoading,
    isSaving,
    error,
    fetchExperiences,
    createExperience,
    updateExperience,
    deleteExperience,
    toggleVisibility,
    reorderExperiences,
  };
}