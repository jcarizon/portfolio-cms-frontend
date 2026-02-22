import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { skillsApi } from '@/shared/lib/api';
import type { SkillCategory, Skill } from '@/shared/types';

interface UseSkillsReturn {
  categories: SkillCategory[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  fetchSkills: () => Promise<void>;
  createCategory: (name: string) => Promise<SkillCategory>;
  updateCategory: (id: string, name: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  createSkill: (categoryId: string, name: string) => Promise<Skill>;
  updateSkill: (id: string, name: string) => Promise<void>;
  deleteSkill: (id: string) => Promise<void>;
  reorderCategories: (categoryIds: string[]) => Promise<void>;
  reorderSkills: (categoryId: string, skillIds: string[]) => Promise<void>;
}

export function useSkills(): UseSkillsReturn {
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSkills = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await skillsApi.getAll();
      setCategories(response.data);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to load skills';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ============================================
  // CATEGORIES
  // ============================================

  const createCategory = useCallback(async (name: string) => {
    setIsSaving(true);
    try {
      const response = await skillsApi.createCategory({ name });
      setCategories((prev) => [...prev, response.data]);
      toast.success('Category created!');
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to create category';
      toast.error(message);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const updateCategory = useCallback(async (id: string, name: string) => {
    setIsSaving(true);
    try {
      const response = await skillsApi.updateCategory(id, { name });
      setCategories((prev) =>
        prev.map((cat) => (cat.id === id ? response.data : cat))
      );
      toast.success('Category updated!');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to update category';
      toast.error(message);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const deleteCategory = useCallback(async (id: string) => {
    setIsSaving(true);
    try {
      await skillsApi.deleteCategory(id);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      toast.success('Category deleted!');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to delete category';
      toast.error(message);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const reorderCategories = useCallback(async (categoryIds: string[]) => {
    setIsSaving(true);
    try {
      // Optimistically update UI
      const reordered = categoryIds.map((id, index) => {
        const cat = categories.find((c) => c.id === id)!;
        return { ...cat, order: index };
      });
      setCategories(reordered);

      // Send to API
      await skillsApi.reorderCategories({ items: categoryIds.map((id) => ({ id })) });
    } catch (err: any) {
      // Revert on error
      await fetchSkills();
      const message = err.response?.data?.message || 'Failed to reorder categories';
      toast.error(message);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, [categories, fetchSkills]);

  // ============================================
  // SKILLS
  // ============================================

  const createSkill = useCallback(async (categoryId: string, name: string) => {
    setIsSaving(true);
    try {
      const response = await skillsApi.createSkill({ categoryId, name });
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === categoryId
            ? { ...cat, skills: [...cat.skills, response.data] }
            : cat
        )
      );
      toast.success('Skill added!');
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to add skill';
      toast.error(message);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const updateSkill = useCallback(async (id: string, name: string) => {
    setIsSaving(true);
    try {
      const response = await skillsApi.updateSkill(id, { name });
      setCategories((prev) =>
        prev.map((cat) => ({
          ...cat,
          skills: cat.skills.map((skill) =>
            skill.id === id ? response.data : skill
          ),
        }))
      );
      toast.success('Skill updated!');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to update skill';
      toast.error(message);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const deleteSkill = useCallback(async (id: string) => {
    setIsSaving(true);
    try {
      await skillsApi.deleteSkill(id);
      setCategories((prev) =>
        prev.map((cat) => ({
          ...cat,
          skills: cat.skills.filter((skill) => skill.id !== id),
        }))
      );
      toast.success('Skill deleted!');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to delete skill';
      toast.error(message);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const reorderSkills = useCallback(
    async (categoryId: string, skillIds: string[]) => {
      setIsSaving(true);
      try {
        // Optimistically update UI
        setCategories((prev) =>
          prev.map((cat) => {
            if (cat.id !== categoryId) return cat;
            const reordered = skillIds.map((id, index) => {
              const skill = cat.skills.find((s) => s.id === id)!;
              return { ...skill, order: index };
            });
            return { ...cat, skills: reordered };
          })
        );

        // Send to API
        await skillsApi.reorderSkills(categoryId, {
          items: skillIds.map((id) => ({ id })),
        });
      } catch (err: any) {
        // Revert on error
        await fetchSkills();
        const message = err.response?.data?.message || 'Failed to reorder skills';
        toast.error(message);
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    [fetchSkills]
  );

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  return {
    categories,
    isLoading,
    isSaving,
    error,
    fetchSkills,
    createCategory,
    updateCategory,
    deleteCategory,
    createSkill,
    updateSkill,
    deleteSkill,
    reorderCategories,
    reorderSkills,
  };
}