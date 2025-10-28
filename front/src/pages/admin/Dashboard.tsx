import { Link } from 'react-router-dom';
import {
  FileText,
  Image,
  Users,
  Eye,
  TrendingUp,
  Clock,
  Activity,
} from 'lucide-react';

interface StatCard {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  link?: string;
}

export default function Dashboard() {
  const stats: StatCard[] = [
    {
      title: 'Total de Páginas',
      value: 12,
      icon: <FileText className="w-6 h-6" />,
      trend: '+3 este mês',
      trendUp: true,
      link: '/admin/pages',
    },
    {
      title: 'Mídias',
      value: 45,
      icon: <Image className="w-6 h-6" />,
      trend: '+8 novos arquivos',
      trendUp: true,
      link: '/admin/media',
    },
    {
      title: 'Usuários',
      value: 8,
      icon: <Users className="w-6 h-6" />,
      trend: '2 ativos hoje',
      trendUp: true,
      link: '/admin/users',
    },
    {
      title: 'Visualizações',
      value: '2.4k',
      icon: <Eye className="w-6 h-6" />,
      trend: '+12% vs mês passado',
      trendUp: true,
    },
  ];

  const recentActivities = [
    {
      title: 'Nova página criada',
      description: 'Página "Sobre Nós" foi publicada',
      time: 'Há 2 horas',
      icon: <FileText className="w-5 h-5 text-blue-500" />,
    },
    {
      title: 'Imagem adicionada',
      description: 'Logo atualizado na biblioteca de mídia',
      time: 'Há 5 horas',
      icon: <Image className="w-5 h-5 text-green-500" />,
    },
    {
      title: 'Novo usuário',
      description: 'Editor João Silva foi adicionado',
      time: 'Há 1 dia',
      icon: <Users className="w-5 h-5 text-purple-500" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Bem-vindo de volta! Aqui está um resumo do seu site.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                {stat.icon}
              </div>
              {stat.trendUp !== undefined && (
                <div
                  className={`flex items-center gap-1 text-sm font-medium ${
                    stat.trendUp ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  <TrendingUp
                    className={`w-4 h-4 ${!stat.trendUp && 'rotate-180'}`}
                  />
                </div>
              )}
            </div>

            <div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.title}</p>
              {stat.trend && (
                <p
                  className={`text-xs mt-2 ${
                    stat.trendUp ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {stat.trend}
                </p>
              )}
            </div>

            {stat.link && (
              <Link
                to={stat.link}
                className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
              >
                Ver todos
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Atividades Recentes
            </h2>
            <Link
              to="/admin/activity"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Ver todas
            </Link>
          </div>

          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
              >
                <div className="p-2 bg-gray-50 rounded-lg">{activity.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.title}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Ações Rápidas
          </h2>

          <div className="space-y-3">
            <Link
              to="/admin/pages/new"
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors duration-150 group"
            >
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600 group-hover:bg-blue-200">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Nova Página</p>
                <p className="text-xs text-gray-500">Criar conteúdo</p>
              </div>
            </Link>

            <Link
              to="/admin/media/upload"
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors duration-150 group"
            >
              <div className="p-2 bg-green-100 rounded-lg text-green-600 group-hover:bg-green-200">
                <Image className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Upload de Mídia
                </p>
                <p className="text-xs text-gray-500">Adicionar imagens</p>
              </div>
            </Link>

            <Link
              to="/admin/users/new"
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors duration-150 group"
            >
              <div className="p-2 bg-purple-100 rounded-lg text-purple-600 group-hover:bg-purple-200">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Novo Usuário
                </p>
                <p className="text-xs text-gray-500">Convidar membro</p>
              </div>
            </Link>

            <Link
              to="/"
              target="_blank"
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors duration-150 group"
            >
              <div className="p-2 bg-gray-100 rounded-lg text-gray-600 group-hover:bg-gray-200">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Ver Site</p>
                <p className="text-xs text-gray-500">Abrir em nova aba</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}