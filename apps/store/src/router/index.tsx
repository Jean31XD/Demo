import React, { lazy, Suspense, useEffect } from 'react';
import { createHashRouter, RouterProvider, Outlet, useLocation } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import PageLoader from '@/components/common/PageLoader';

/**
 * Cada página se importa con lazy() → Vite genera un chunk JS independiente.
 * El navegador solo descarga la página que el usuario visita.
 * Esto reduce el bundle inicial ~60-80% en apps medianas.
 */
const Home          = lazy(() => import('@/pages/Home'));
const Catalog       = lazy(() => import('@/pages/Catalog'));
const ProductDetail = lazy(() => import('@/pages/ProductDetail'));
const Cart          = lazy(() => import('@/pages/Cart'));
const Checkout      = lazy(() => import('@/pages/Checkout'));
const Account       = lazy(() => import('@/pages/Account'));
const Brands        = lazy(() => import('@/pages/Brands'));
const Offers        = lazy(() => import('@/pages/Offers'));
const Support       = lazy(() => import('@/pages/Support'));
const NotFound      = lazy(() => import('@/pages/NotFound'));

/**
 * Componente utilitario para resetear el scroll de la ventana al inicio
 * cuando cambia la ruta (incluyendo parámetros de búsqueda como página o categoría).
 */
const ScrollToTop: React.FC = () => {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, search]);
  return null;
};

/**
 * RootLayout envuelve todas las páginas con el layout principal
 * y el boundary de Suspense global. Las páginas hijas pueden tener
 * sus propios Suspense boundaries si necesitan control más granular.
 */
const RootLayout: React.FC = () => (
  <Suspense fallback={<PageLoader />}>
    <ScrollToTop />
    <MainLayout>
      <Outlet />
    </MainLayout>
  </Suspense>
);

export const router = createHashRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true,                  element: <Home /> },
      { path: 'catalogo',             element: <Catalog /> },
      { path: 'catalogo/:category',   element: <Catalog /> },
      { path: 'producto/:slug',       element: <ProductDetail /> },
      { path: 'carrito',              element: <Cart /> },
      { path: 'checkout',             element: <Checkout /> },
      { path: 'cuenta/*',             element: <Account /> },
      { path: 'marcas',               element: <Brands /> },
      { path: 'ofertas',              element: <Offers /> },
      { path: 'soporte',              element: <Support /> },
      { path: '*',                    element: <NotFound /> },
    ],
  },
]);

const AppRouter: React.FC = () => <RouterProvider router={router} />;
export default AppRouter;
