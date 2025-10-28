import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Layout } from '../components/layout';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import LoginPage from '../pages/login';
import { Home } from '../pages';
import { HistoriaIdeologia } from '../pages/sobre-nos/historia-e-ideologia';
import { PropostoValoresNegocio } from '../pages/sobre-nos/missao-visao-valores';
import { Governanca } from '../pages/sobre-nos/governanca';



import LogoutPage from '../pages/logout';

const router = createBrowserRouter([
    /** ===== ROTA PÚBLICA (SEM LAYOUT) ===== */
    {
        path: '/',
        element: (
            <PublicRoute>
                <Layout />
            </PublicRoute>
        ),
        children: [
            { index: true, element: <Home /> },
            { path: 'logout', element: <LogoutPage /> },
            { path: 'sobre-nos/historia-e-ideologia', element: <HistoriaIdeologia /> },
            { path: 'sobre-nos/missao-visao-valores', element: <PropostoValoresNegocio /> },
            { path: 'sobre-nos/governanca', element: <Governanca /> },


            { path: 'login', element: <LoginPage /> },
        ]
    },

    /** ===== ROTAS PRIVADAS (COM LAYOUT) ===== */
    {
        path: '/',
        element: (
            <ProtectedRoute>
                <Layout />
            </ProtectedRoute>
        ),
    },

    { path: '*', element: <Navigate to="/novo-site-instituto" replace /> },
], {
    // Adicione o basename aqui para definir o caminho base da aplicação
    basename: '/novo-site-instituto'
});

export function AppRouter() {
    return <RouterProvider router={router} />;
}

export default router;