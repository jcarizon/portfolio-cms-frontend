'use client';

import { useState } from 'react';
import {
  Mail,
  MailOpen,
  Trash2,
  CheckCheck,
  Clock,
  User,
  ChevronDown,
  ChevronUp,
  Inbox,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import type { ContactMessage } from '@/shared/types';

interface MessagesListProps {
  messages: ContactMessage[];
  unreadCount: number;
  onMarkAsRead: (id: string) => Promise<void>;
  onMarkAllAsRead: () => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function MessagesList({
  messages,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
}: MessagesListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = async (message: ContactMessage) => {
    if (expandedId === message.id) {
      setExpandedId(null);
    } else {
      setExpandedId(message.id);
      if (!message.isRead) {
        await onMarkAsRead(message.id);
      }
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this message?')) {
      await onDelete(id);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 24) {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      });
    } else if (diffHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-neutral-800 flex items-center gap-2">
          <Inbox className="w-5 h-5" />
          Messages
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 text-xs bg-primary-100 text-primary-700 rounded-full">
              {unreadCount} unread
            </span>
          )}
        </h3>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllAsRead}
            className="btn bg-neutral-100 text-neutral-700 hover:bg-neutral-200 gap-2 text-sm"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="space-y-2">
        {messages.map((message) => {
          const isExpanded = expandedId === message.id;

          return (
            <div
              key={message.id}
              className={cn(
                'bg-white rounded-xl border shadow-sm overflow-hidden transition-all',
                !message.isRead && 'border-l-4 border-l-primary-500'
              )}
            >
              {/* Header - Clickable */}
              <div
                onClick={() => toggleExpand(message)}
                className={cn(
                  'flex items-center gap-4 p-4 cursor-pointer hover:bg-neutral-50 transition-colors'
                )}
              >
                {/* Read Status Icon */}
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                    message.isRead ? 'bg-neutral-100' : 'bg-primary-100'
                  )}
                >
                  {message.isRead ? (
                    <MailOpen className="w-5 h-5 text-neutral-500" />
                  ) : (
                    <Mail className="w-5 h-5 text-primary-600" />
                  )}
                </div>

                {/* Content Preview */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'font-medium truncate',
                        message.isRead ? 'text-neutral-700' : 'text-neutral-900'
                      )}
                    >
                      {message.name}
                    </span>
                    {!message.isRead && (
                      <span className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-neutral-500 truncate">
                    {message.subject || message.message.substring(0, 50)}
                  </p>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-neutral-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(message.createdAt)}
                  </span>
                  <button
                    onClick={(e) => handleDelete(message.id, e)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-neutral-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-neutral-400" />
                  )}
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-0 border-t border-neutral-100">
                  <div className="bg-neutral-50 rounded-lg p-4 mt-3">
                    <div className="flex flex-wrap gap-4 text-sm text-neutral-500 mb-3">
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {message.name}
                      </span>
                      <a
                        href={`mailto:${message.email}`}
                        className="flex items-center gap-1 text-primary-600 hover:underline"
                      >
                        <Mail className="w-4 h-4" />
                        {message.email}
                      </a>
                    </div>

                    {message.subject && (
                      <p className="font-medium text-neutral-800 mb-2">
                        Subject: {message.subject}
                      </p>
                    )}

                    <p className="text-neutral-700 whitespace-pre-wrap">
                      {message.message}
                    </p>

                    <div className="flex gap-2 mt-4">
                      <a
                        href={`mailto:${message.email}?subject=Re: ${message.subject || 'Your message'}`}
                        className="btn btn-primary text-sm gap-2"
                      >
                        <Mail className="w-4 h-4" />
                        Reply
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Empty State */}
        {messages.length === 0 && (
          <div className="bg-white rounded-xl p-8 border border-neutral-200 text-center">
            <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
              <Inbox className="w-8 h-8 text-neutral-400" />
            </div>
            <p className="text-neutral-600 mb-2">No messages yet</p>
            <p className="text-sm text-neutral-400">
              When visitors contact you, their messages will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}