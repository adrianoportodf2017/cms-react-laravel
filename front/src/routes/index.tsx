import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Layout } from '../components/layout';
import AdminLayout from '../components/admin/AdminLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import { GuestRoute } from './GuestRoute';
import LoginPage from '../pages/login';
import { Home } from '../pages';
import { HistoriaIdeologia } from '../pages/sobre-nos/historia-e-ideologia';
import { PropostoValoresNegocio } from '../pages/sobre-nos/missao-visao-valores';
import { Governanca } from '../pages/sobre-nos/governanca';
import LogoutPage from '../pages/logout';

// Admin Pages
import Dashboard from '../pages/admin/Dashboard';
import { PagesPage, MediaPage, UsersPage, SettingsPage } from '../pages/admin/AdminPages';

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
            { path: 'sobre-nos/historia-e-ideologia', element: <HistoriaIdeologia /> },
            { path: 'sobre-nos/missao-visao-valores', element: <PropostoValoresNegocio /> },
            { path: 'sobre-nos/governanca', element: <Governanca /> },
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
            { path: 'pages', element: <PagesPage /> },
            { path: 'media', element: <MediaPage /> },
            { path: 'users', element: <UsersPage /> },
            { path: 'settings', element: <SettingsPage /> },
        ]
    },

    /** ===== REDIRECT PARA HOME EM ROTAS NÃO ENCONTRADAS ===== */
    { path: '*', element: <Navigate to="/" replace /> },
], {
    basename: '/'
});

export function AppRouter() {
    return <RouterProvider router={router} />;
}

export default router;