import React, { lazy, Suspense } from 'react';
import { createHashRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import AdminLayout from '@/components/layout/AdminLayout';
import PageLoader from '@/components/common/PageLoader';

// ─── Lazy pages ───────────────────────────────────────────────────────────────
const Login     = lazy(() => import('@/pages/Login'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Products  = lazy(() => import('@/pages/Products'));
const Orders    = lazy(() => import('@/pages/Orders'));
const Customers = lazy(() => import('@/pages/Customers'));
const NotFound  = lazy(() => import('@/pages/NotFound'));

// ─── Guard de autenticación ───────────────────────────────────────────────────
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

/** Layout wrapper con Suspense + guard */
const AdminRoot: React.FC = () => (
  <ProtectedRoute>
    <Suspense fallback={<PageLoader />}>
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    </Suspense>
  </ProtectedRoute>
);

/** Login sin layout */
const PublicRoot: React.FC = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  if (isAuthenticated) return <Navigate to="/" replace />;
  return (
    <Suspense fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
  );
};

export const router = createHashRouter([
  {
    path: '/login',
    element: <PublicRoot />,
    children: [{ index: true, element: <Login /> }],
  },
  {
    path: '/',
    element: <AdminRoot />,
    children: [
      { index: true,           element: <Dashboard /> },
      { path: 'products',      element: <Products /> },
      { path: 'orders',        element: <Orders /> },
      { path: 'customers',     element: <Customers /> },
      { path: '*',             element: <NotFound /> },
    ],
  },
]);

const AppRouter: React.FC = () => <RouterProvider router={router} />;
export default AppRouter;
