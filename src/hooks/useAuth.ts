import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/types';

/**
 * useAuth Hook
 * Provides access to authentication state and actions
 */
export function useAuth() {
  const {
    user,
    oidcUser,
    isAuthenticated,
    isLoading,
    login,
    logout,
    initializeAuth,
  } = useAuthStore();

  /**
   * Check if user has a specific role
   */
  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (!user || !user.roles) return false;

    const roles = Array.isArray(role) ? role : [role];
    return roles.some((r) => user.roles.includes(r));
  };

  /**
   * Check if user has any of the specified roles
   */
  const hasAnyRole = (roles: UserRole[]): boolean => {
    if (!user || !user.roles) return false;
    return roles.some((role) => user.roles.includes(role));
  };

  /**
   * Check if user has all of the specified roles
   */
  const hasAllRoles = (roles: UserRole[]): boolean => {
    if (!user || !user.roles) return false;
    return roles.every((role) => user.roles.includes(role));
  };

  /**
   * Check if user is admin (SUPER_ADMIN or ADMIN)
   */
  const isAdmin = (): boolean => {
    return hasAnyRole([UserRole.SUPER_ADMIN, UserRole.ADMIN]);
  };

  /**
   * Check if user is teacher
   */
  const isTeacher = (): boolean => {
    return hasRole(UserRole.TEACHER);
  };

  /**
   * Check if user is parent
   */
  const isParent = (): boolean => {
    return hasRole(UserRole.PARENT);
  };

  /**
   * Check if user is student
   */
  const isStudent = (): boolean => {
    return hasRole(UserRole.STUDENT);
  };

  /**
   * Get access token
   */
  const getAccessToken = (): string | null => {
    return oidcUser?.access_token || null;
  };

  return {
    // State
    user,
    oidcUser,
    isAuthenticated,
    isLoading,

    // Actions
    login,
    logout,
    initializeAuth,

    // Role checks
    hasRole,
    hasAnyRole,
    hasAllRoles,
    isAdmin,
    isTeacher,
    isParent,
    isStudent,

    // Token
    getAccessToken,
  };
}

