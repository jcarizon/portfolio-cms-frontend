'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import {
  useAuthStore,
  useIsAuthenticated,
  useAuthInitialized,
} from '@/features/admin/stores/auth-store';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();
  const isInitialized = useAuthInitialized();
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    // Check auth status on mount
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    // Redirect to login if not authenticated after initialization
    if (isInitialized && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isInitialized, isAuthenticated, router]);

  // Show loading while checking auth
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-neutral-500">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render children if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-neutral-500">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}