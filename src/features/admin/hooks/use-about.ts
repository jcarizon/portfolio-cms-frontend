import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { aboutApi } from '@/shared/lib/api';
import type { About } from '@/shared/types';

interface UseAboutReturn {
  about: About | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  fetchAbout: () => Promise<void>;
  updateAbout: (data: { content: About['content'] }) => Promise<void>;
}

export function useAbout(): UseAboutReturn {
  const [about, setAbout] = useState<About | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAbout = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await aboutApi.get();
      setAbout(response.data);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to load about data';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateAbout = useCallback(async (data: { content: About['content'] }) => {
    setIsSaving(true);
    try {
      const response = await aboutApi.update(data);
      setAbout(response.data);
      toast.success('About section updated!');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to update about';
      toast.error(message);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, []);

  useEffect(() => {
    fetchAbout();
  }, [fetchAbout]);

  return {
    about,
    isLoading,
    isSaving,
    error,
    fetchAbout,
    updateAbout,
  };
}