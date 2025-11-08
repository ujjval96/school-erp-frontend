import { createRouter, createRootRoute, createRoute, Outlet } from '@tanstack/react-router';
import { lazy } from 'react';

// Lazy load route components
const DashboardPage = lazy(() => import('@/features/dashboard/components/DashboardPage'));
const LoginPage = lazy(() => import('@/features/auth/components/LoginPage'));
const CallbackPage = lazy(() => import('@/features/auth/components/CallbackPage'));

// Root route
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// Auth routes
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

const callbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth/callback',
  component: CallbackPage,
});

// Dashboard route (protected)
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardPage,
});

// Create router with route tree
const routeTree = rootRoute.addChildren([
  loginRoute,
  callbackRoute,
  dashboardRoute,
]);

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
});

// Type augmentation for router
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

