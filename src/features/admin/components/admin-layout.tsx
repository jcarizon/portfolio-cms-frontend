'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
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
  LayoutDashboard,
  ChevronLeft,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore, useAdmin } from '@/features/admin/stores/auth-store';
import { cn } from '@/shared/lib/utils';

const navItems = [
  { id: 'dashboard', name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { id: 'hero', name: 'Hero', href: '/admin/hero', icon: User },
  { id: 'about', name: 'About', href: '/admin/about', icon: FileText },
  { id: 'skills', name: 'Skills', href: '/admin/skills', icon: Code2 },
  { id: 'projects', name: 'Projects', href: '/admin/projects', icon: FolderKanban },
  { id: 'experience', name: 'Experience', href: '/admin/experience', icon: Briefcase },
  { id: 'contact', name: 'Contact', href: '/admin/contact', icon: Mail },
  { id: 'settings', name: 'Settings', href: '/admin/settings', icon: Settings },
];

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export function AdminLayout({ children, title, description }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const admin = useAdmin();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-900 text-white flex flex-col fixed h-full">
        {/* Logo */}
        <div className="p-6 border-b border-neutral-800">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center font-bold">
              P
            </div>
            <div>
              <h1 className="font-bold">Portfolio CMS</h1>
              <p className="text-xs text-neutral-400">Admin Panel</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/admin' && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-neutral-800">
          <div className="flex items-center gap-3 mb-4">
            {admin?.avatarUrl ? (
              <img
                src={admin.avatarUrl}
                alt={admin.name}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center">
                <span className="font-medium">
                  {admin?.name?.charAt(0) || 'A'}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{admin?.name}</p>
              <p className="text-xs text-neutral-400 truncate">{admin?.email}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white transition-colors text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              View Site
            </a>
            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-lg bg-neutral-800 text-neutral-300 hover:bg-red-600 hover:text-white transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {/* Top Bar */}
        <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm text-neutral-500 mb-1">
                  <Link href="/admin" className="hover:text-neutral-700">
                    Dashboard
                  </Link>
                  <ChevronLeft className="w-4 h-4 rotate-180" />
                  <span className="text-neutral-800">{title}</span>
                </div>
                <h1 className="text-2xl font-bold text-neutral-800">{title}</h1>
                {description && (
                  <p className="text-neutral-500 mt-1">{description}</p>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}