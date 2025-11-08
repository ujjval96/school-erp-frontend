/**
 * Route Guards
 * Authentication and authorization guards for routes
 */

import { UserRole } from '@/types';

/**
 * Check if user is authenticated
 * Used in route beforeLoad
 */
export function requireAuth(authState: { isAuthenticated: boolean; isLoading: boolean }) {
  if (authState.isLoading) {
    return { redirect: null }; // Wait for auth to load
  }

  if (!authState.isAuthenticated) {
    return {
      redirect: {
        to: '/login',
        search: {
          redirect: window.location.pathname,
        },
      },
    };
  }

  return { redirect: null };
}

/**
 * Check if user has required role
 * Used in route beforeLoad
 */
export function requireRole(
  roles: UserRole[],
  userRoles: UserRole[]
): { redirect: { to: string } | null } {
  const hasRole = roles.some((role) => userRoles.includes(role));

  if (!hasRole) {
    return {
      redirect: {
        to: '/403', // Forbidden page
      },
    };
  }

  return { redirect: null };
}

/**
 * Check if user is admin (SUPER_ADMIN or ADMIN)
 */
export function requireAdmin(userRoles: UserRole[]): { redirect: { to: string } | null } {
  return requireRole([UserRole.SUPER_ADMIN, UserRole.ADMIN], userRoles);
}

/**
 * Check if user is teacher
 */
export function requireTeacher(userRoles: UserRole[]): { redirect: { to: string } | null } {
  return requireRole([UserRole.TEACHER], userRoles);
}

/**
 * Check if user is parent
 */
export function requireParent(userRoles: UserRole[]): { redirect: { to: string } | null } {
  return requireRole([UserRole.PARENT], userRoles);
}

