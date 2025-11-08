import { create } from 'zustand';
import { User as OIDCUser } from 'oidc-client-ts';
import { User, AuthState } from '@/types';
import { userManager, getUser as getOIDCUser } from '@/services/oidc/oidcClient';

interface AuthStore extends AuthState {
  // Actions
  setUser: (user: User | null) => void;
  setOIDCUser: (oidcUser: OIDCUser | null) => void;
  setLoading: (isLoading: boolean) => void;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  // State
  user: null,
  oidcUser: null,
  isAuthenticated: false,
  isLoading: true,

  // Actions
  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
    }),

  setOIDCUser: (oidcUser) =>
    set({
      oidcUser,
    }),

  setLoading: (isLoading) => set({ isLoading }),

  login: async () => {
    try {
      await userManager.signinRedirect();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await userManager.signoutRedirect();
      set({
        user: null,
        oidcUser: null,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  initializeAuth: async () => {
    try {
      set({ isLoading: true });

      const oidcUser = await getOIDCUser();

      if (oidcUser && !oidcUser.expired) {
        // Extract user info from OIDC user
        const user: User = {
          id: oidcUser.profile.sub,
          email: oidcUser.profile.email || '',
          firstName: oidcUser.profile.name?.split(' ')[0] || '',
          lastName: oidcUser.profile.name?.split(' ').slice(1).join(' ') || '',
          fullName: oidcUser.profile.name || '',
          roles: (oidcUser.profile.roles as string[]) || [],
          tenantId: oidcUser.profile.tenant_id || '',
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set({
          user,
          oidcUser,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({
          user: null,
          oidcUser: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({
        user: null,
        oidcUser: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));

