import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Layout } from '../components/layout';
import AdminLayout from '../components/admin/layout/AdminLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { GuestRoute } from './GuestRoute';
import LoginPage from '../pages/login';
import { Home } from '../pages';
import PublicPage from '../pages/public';

import LogoutPage from '../pages/logout';

// Admin Pages
import Dashboard from '../pages/admin/Dashboard';
import { MediaPage, UsersPage, SettingsPage } from '../pages/admin/AdminPages';
import { PageBuilderPage } from '../pages/admin/pages/page-builder';
import { PageListPage } from '../pages/admin/pages/index';
import { TabelaAssociados } from '../pages/admin/associados/index';
import { NewsListPage } from '../pages/admin/news/index';
import { NewsFormPage } from '../pages/admin/news/new-form';



const router = createBrowserRouter([
    /** ===== ROTA DE LOGIN (APENAS PARA NÃO AUTENTICADOS) ===== */
    {
        path: '/login',
        element: (
            <GuestRoute redirectTo="/admin">
                <LoginPage />
            </GuestRoute>
        ),
    },

    /** ===== ROTAS PÚBLICAS (ACESSÍVEIS PARA TODOS) ===== */
    {
        path: '/',
        element: <Layout />,
        children: [
            { index: true, element: <Home /> },
            { path: '*', element: <PublicPage /> },
        ]
    },

    /** ===== ROTA DE LOGOUT (LIMPA TOKEN E REDIRECIONA) ===== */
    {
        path: '/logout',
        element: <LogoutPage />,
    },

    /** ===== ROTAS ADMINISTRATIVAS (APENAS AUTENTICADOS) ===== */
    {
        path: '/admin',
        element: (
            <ProtectedRoute>
                <AdminLayout />
            </ProtectedRoute>
        ),
        children: [
            { index: true, element: <Dashboard /> },
            { path: 'pages', element: <PageListPage /> },
            { path: 'associados', element: <TabelaAssociados /> },
            { path: 'pages/new', element: <PageBuilderPage /> },
            { path: 'pages/edit/:id', element: <PageBuilderPage /> },
            { path: 'media', element: <MediaPage /> },
            { path: 'users', element: <UsersPage /> },
            { path: 'settings', element: <SettingsPage /> },
            { path: 'news', element: <NewsListPage /> },
            { path: 'news/new', element: <NewsFormPage /> },
            { path: 'news/edit/:id', element: <NewsFormPage /> },
        ]
    },

    /** ===== REDIRECT PARA HOME EM ROTAS NÃO ENCONTRADAS ===== */
    { path: '*', element: <Navigate to="/" replace /> },
], {
    basename: '/',
});

export function AppRouter() {
    return <RouterProvider router={router} />;
}

export default router;