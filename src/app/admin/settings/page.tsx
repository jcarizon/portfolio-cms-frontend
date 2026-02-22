'use client';

import { useState } from 'react';
import { Loader2, Settings, Inbox } from 'lucide-react';
import { ProtectedRoute } from '@/features/admin/components/protected-route';
import { AdminLayout } from '@/features/admin/components/admin-layout';
import { SiteSettingsForm } from '@/features/admin/components/site-settings-form';
import { useSettings } from '@/features/admin/hooks/use-settings';
import { cn } from '@/shared/lib/utils';

function SettingsPageContent() {
  const {
    siteSettings,
    unreadCount,
    isLoading,
    isSaving,
    error,
    updateSiteSettings,
    markAsRead,
    markAllAsRead,
    deleteMessage,
  } = useSettings();

  if (isLoading) {
    return (
      <AdminLayout title="Settings" description="Manage site settings">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  if (error || !siteSettings) {
    return (
      <AdminLayout title="Settings" description="Manage site settings">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 mb-4">{error || 'Failed to load settings'}</p>
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
      title="Settings"
      description="Manage your site settings and messages"
    >
      <SiteSettingsForm
        settings={siteSettings}
        isSaving={isSaving}
        onSubmit={updateSiteSettings}
      />
    </AdminLayout>
  );
}

export default function SettingsAdminPage() {
  return (
    <ProtectedRoute>
      <SettingsPageContent />
    </ProtectedRoute>
  );
}
