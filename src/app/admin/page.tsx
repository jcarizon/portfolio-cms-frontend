'use client';

import { useRouter } from 'next/navigation';
import {
  User,
  FileText,
  Briefcase,
  FolderKanban,
  Code2,
  Mail,
  Settings,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';
import { ProtectedRoute } from '@/features/admin/components/protected-route';
import { useAuthStore, useAdmin } from '@/features/admin/stores/auth-store';
import { cn } from '@/shared/lib/utils';

// Dashboard sections for quick navigation
const sections = [
  {
    id: 'hero',
    name: 'Hero Section',
    description: 'Edit name, title, location, and profile image',
    icon: User,
    href: '/admin/hero',
    color: 'bg-blue-500',
  },
  {
    id: 'about',
    name: 'About Section',
    description: 'Update your bio and introduction',
    icon: FileText,
    href: '/admin/about',
    color: 'bg-purple-500',
  },
  {
    id: 'skills',
    name: 'Skills',
    description: 'Manage skill categories and technologies',
    icon: Code2,
    href: '/admin/skills',
    color: 'bg-green-500',
  },
  {
    id: 'projects',
    name: 'Projects',
    description: 'Add, edit, or remove projects',
    icon: FolderKanban,
    href: '/admin/projects',
    color: 'bg-orange-500',
  },
  {
    id: 'experience',
    name: 'Experience',
    description: 'Update work history and timeline',
    icon: Briefcase,
    href: '/admin/experience',
    color: 'bg-pink-500',
  },
  {
    id: 'contact',
    name: 'Contact',
    description: 'Edit contact info and view messages',
    icon: Mail,
    href: '/admin/contact',
    color: 'bg-teal-500',
  },
];

function DashboardContent() {
  const router = useRouter();
  const admin = useAdmin();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center text-white font-bold">
                P
              </div>
              <div>
                <h1 className="font-bold text-neutral-800">Portfolio CMS</h1>
                <p className="text-xs text-neutral-500">Admin Dashboard</p>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {/* View Site Link */}
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 text-sm text-neutral-600 hover:text-neutral-800 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                View Site
              </a>

              {/* User Menu */}
              <div className="flex items-center gap-3">
                {admin?.avatarUrl ? (
                  <img
                    src={admin.avatarUrl}
                    alt={admin.name}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-600">
                      {admin?.name?.charAt(0) || 'A'}
                    </span>
                  </div>
                )}
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-neutral-800">
                    {admin?.name}
                  </p>
                  <p className="text-xs text-neutral-500">{admin?.email}</p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-neutral-800 mb-2">
            Welcome back, {admin?.name?.split(' ')[0]}! 👋
          </h2>
          <p className="text-neutral-600">
            Manage your portfolio content from here. Click on any section to
            start editing.
          </p>
        </div>

        {/* Section Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => router.push(section.href)}
              className={cn(
                'card p-6 text-left group',
                'hover:shadow-lg transition-all duration-300'
              )}
            >
              <div
                className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4',
                  'group-hover:scale-110 transition-transform duration-300',
                  section.color
                )}
              >
                <section.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-800 mb-1">
                {section.name}
              </h3>
              <p className="text-sm text-neutral-500">{section.description}</p>
            </button>
          ))}

          {/* Settings Card */}
          <button
            onClick={() => router.push('/admin/settings')}
            className={cn(
              'card p-6 text-left group border-2 border-dashed border-neutral-200',
              'hover:border-neutral-300 hover:shadow-md transition-all duration-300'
            )}
          >
            <div
              className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center mb-4',
                'bg-neutral-100 text-neutral-500',
                'group-hover:bg-neutral-200 transition-colors duration-300'
              )}
            >
              <Settings className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-800 mb-1">
              Site Settings
            </h3>
            <p className="text-sm text-neutral-500">
              Manage site title, social links, and footer
            </p>
          </button>
        </div>
      </main>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}