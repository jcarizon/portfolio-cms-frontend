import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { settingsApi } from '@/shared/lib/api';
import type { SiteSettings, ContactSettings, ContactMessage } from '@/shared/types';

interface UseSettingsReturn {
  siteSettings: SiteSettings | null;
  contactSettings: ContactSettings | null;
  messages: ContactMessage[];
  unreadCount: number;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  fetchSettings: () => Promise<void>;
  updateSiteSettings: (data: Partial<SiteSettings>) => Promise<void>;
  updateContactSettings: (data: Partial<ContactSettings>) => Promise<void>;
  fetchMessages: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
}

export function useSettings(): UseSettingsReturn {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [contactSettings, setContactSettings] = useState<ContactSettings | null>(null);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [siteRes, contactRes] = await Promise.all([
        settingsApi.getSite(),
        settingsApi.getContact(),
      ]);
      setSiteSettings(siteRes.data);
      setContactSettings(contactRes.data);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to load settings';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateSiteSettings = useCallback(async (data: Partial<SiteSettings>) => {
    setIsSaving(true);
    try {
      const response = await settingsApi.updateSite(data);
      setSiteSettings(response.data);
      toast.success('Site settings updated!');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to update settings';
      toast.error(message);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const updateContactSettings = useCallback(async (data: Partial<ContactSettings>) => {
    setIsSaving(true);
    try {
      const response = await settingsApi.updateContact(data);
      setContactSettings(response.data);
      toast.success('Contact settings updated!');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to update settings';
      toast.error(message);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const fetchMessages = useCallback(async () => {
    try {
      const [messagesRes, countRes] = await Promise.all([
        settingsApi.getMessages(),
        settingsApi.getUnreadCount(),
      ]);
      setMessages(messagesRes.data);
      setUnreadCount(countRes.data.count);
    } catch (err: any) {
      console.error('Failed to fetch messages:', err);
    }
  }, []);

  const markAsRead = useCallback(async (id: string) => {
    try {
      await settingsApi.markAsRead(id);
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, isRead: true } : m))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err: any) {
      toast.error('Failed to mark as read');
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await settingsApi.markAllAsRead();
      setMessages((prev) => prev.map((m) => ({ ...m, isRead: true })));
      setUnreadCount(0);
      toast.success('All messages marked as read');
    } catch (err: any) {
      toast.error('Failed to mark all as read');
    }
  }, []);

  const deleteMessage = useCallback(async (id: string) => {
    try {
      await settingsApi.deleteMessage(id);
      const deletedMessage = messages.find((m) => m.id === id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (deletedMessage && !deletedMessage.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
      toast.success('Message deleted');
    } catch (err: any) {
      toast.error('Failed to delete message');
    }
  }, [messages]);

  useEffect(() => {
    fetchSettings();
    fetchMessages();
  }, [fetchSettings, fetchMessages]);

  return {
    siteSettings,
    contactSettings,
    messages,
    unreadCount,
    isLoading,
    isSaving,
    error,
    fetchSettings,
    updateSiteSettings,
    updateContactSettings,
    fetchMessages,
    markAsRead,
    markAllAsRead,
    deleteMessage,
  };
}