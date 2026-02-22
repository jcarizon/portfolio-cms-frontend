'use client';

import { Loader2 } from 'lucide-react';
import { ProtectedRoute } from '@/features/admin/components/protected-route';
import { AdminLayout } from '@/features/admin/components/admin-layout';
import { ContactSettingsForm } from '@/features/admin/components/contact-settings-form';
import { MessagesList } from '@/features/admin/components/messages-list';
import { useSettings } from '@/features/admin/hooks/use-settings';
import { useState } from 'react';
import { Mail, Inbox } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

type TabId = 'settings' | 'messages';

const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'settings', label: 'Contact Section', icon: Mail },
  { id: 'messages', label: 'Messages', icon: Inbox },
];

function ContactPageContent() {
  const {
    contactSettings,
    messages,
    unreadCount,
    isLoading,
    isSaving,
    error,
    updateContactSettings,
    markAsRead,
    markAllAsRead,
    deleteMessage,
  } = useSettings();

  const [activeTab, setActiveTab] = useState<TabId>('settings');

  if (isLoading) {
    return (
      <AdminLayout title="Contact" description="Manage contact section and messages">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  if (error || !contactSettings) {
    return (
      <AdminLayout title="Contact" description="Manage contact section and messages">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 mb-4">{error || 'Failed to load contact settings'}</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Contact"
      description="Manage your contact section content and view messages"
    >
      {/* Tabs */}
      <div className="mb-6">
        <div className="flex gap-2 p-1 bg-neutral-100 rounded-xl w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all',
                activeTab === tab.id
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.id === 'messages' && unreadCount > 0 && (
                <span className="px-1.5 py-0.5 text-xs bg-primary-100 text-primary-700 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'settings' && (
        <ContactSettingsForm
          settings={contactSettings}
          isSaving={isSaving}
          onSubmit={updateContactSettings}
        />
      )}

      {activeTab === 'messages' && (
        <MessagesList
          messages={messages}
          unreadCount={unreadCount}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
          onDelete={deleteMessage}
        />
      )}
    </AdminLayout>
  );
}

export default function ContactAdminPage() {
  return (
    <ProtectedRoute>
      <ContactPageContent />
    </ProtectedRoute>
  );
}
