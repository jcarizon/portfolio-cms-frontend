import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { heroApi } from '@/shared/lib/api';
import type { Hero } from '@/shared/types';

interface UseHeroReturn {
  hero: Hero | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  fetchHero: () => Promise<void>;
  updateHero: (data: Partial<Hero>) => Promise<void>;
}

export function useHero(): UseHeroReturn {
  const [hero, setHero] = useState<Hero | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHero = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await heroApi.get();
      setHero(response.data);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to load hero data';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateHero = useCallback(async (data: Partial<Hero>) => {
    setIsSaving(true);
    try {
      const response = await heroApi.update(data);
      setHero(response.data);
      toast.success('Hero section updated!');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to update hero';
      toast.error(message);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, []);

  useEffect(() => {
    fetchHero();
  }, [fetchHero]);

  return {
    hero,
    isLoading,
    isSaving,
    error,
    fetchHero,
    updateHero,
  };
}