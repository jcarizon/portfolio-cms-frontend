import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '@/shared/lib/api';
import type { Admin } from '@/shared/types';

interface AuthState {
  // State
  token: string | null;
  admin: Pick<Admin, 'id' | 'email' | 'name' | 'avatarUrl'> | null;
  isLoading: boolean;
  isInitialized: boolean;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  loginWithToken: (token: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      token: null,
      admin: null,
      isLoading: false,
      isInitialized: false,

      // Login with email/password
      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await authApi.login({ email, password });
          const { accessToken, admin } = response.data;

          // Store token in localStorage for API interceptor
          localStorage.setItem('token', accessToken);

          set({
            token: accessToken,
            admin,
            isLoading: false,
            isInitialized: true,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // Login with OAuth token (from callback)
      loginWithToken: async (token: string) => {
        set({ isLoading: true });
        try {
          // Store token first so API interceptor can use it
          localStorage.setItem('token', token);

          // Fetch admin profile
          const response = await authApi.getProfile();
          const admin = response.data;

          set({
            token,
            admin,
            isLoading: false,
            isInitialized: true,
          });
        } catch (error) {
          // Clear invalid token
          localStorage.removeItem('token');
          set({
            token: null,
            admin: null,
            isLoading: false,
            isInitialized: true,
          });
          throw error;
        }
      },

      // Logout
      logout: () => {
        localStorage.removeItem('token');
        set({
          token: null,
          admin: null,
          isInitialized: true,
        });
      },

      // Check if user is authenticated (on app load)
      checkAuth: async () => {
        const token = localStorage.getItem('token');

        if (!token) {
          set({ isInitialized: true });
          return;
        }

        set({ isLoading: true });
        try {
          const response = await authApi.getProfile();
          const admin = response.data;

          set({
            token,
            admin,
            isLoading: false,
            isInitialized: true,
          });
        } catch (error) {
          // Token is invalid, clear it
          localStorage.removeItem('token');
          set({
            token: null,
            admin: null,
            isLoading: false,
            isInitialized: true,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      // Only persist token and admin, not loading states
      partialize: (state) => ({
        token: state.token,
        admin: state.admin,
      }),
    }
  )
);

// Selector hooks for convenience
export const useIsAuthenticated = () =>
  useAuthStore((state) => !!state.token && !!state.admin);

export const useAdmin = () => useAuthStore((state) => state.admin);

export const useAuthLoading = () => useAuthStore((state) => state.isLoading);

export const useAuthInitialized = () =>
  useAuthStore((state) => state.isInitialized);