import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Archive,
  UploadCloud,
  Copy,
  Star,
} from 'lucide-react';

import {
  useListNews,
  useDeleteNews,
  usePublishNews,
  useArchiveNews,
  useDuplicateNews,

} from '../../../services/news';


import type {
  NewsItem
} from '../../../types/new.types';

export const NewsList = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all');
  const [featuredFilter, setFeaturedFilter] = useState<'all' | 'featured' | 'normal'>('all');
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Query
  const { data, isLoading, refetch } = useListNews({
    page,
    per_page: 20,
    status: statusFilter === 'all' ? undefined : statusFilter,
    is_featured: featuredFilter === 'featured' ? true : featuredFilter === 'normal' ? false : undefined,
    search: debouncedSearch || undefined,
  });

  // Mutations
  const deleteNews = useDeleteNews();
  const publishNews = usePublishNews();
  const archiveNews = useArchiveNews();
  const duplicateNews = useDuplicateNews();

  const news = data?.data || [];
  const totalPages = Math.ceil((data?.total || 0) / (data?.per_page || 20));

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta notícia?')) return;
    await deleteNews.mutateAsync(id);
    refetch();
  };

  const handlePublish = async (id: string) => {
    await publishNews.mutateAsync(id);
    refetch();
  };

  const handleArchive = async (id: string) => {
    await archiveNews.mutateAsync(id);
    refetch();
  };

  const handleDuplicate = async (id: string) => {
    await duplicateNews.mutateAsync(id);
    refetch();
  };

  const statusBadge = (status: NewsItem['status']) => {
    const styles = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800',
      archived: 'bg-gray-200 text-gray-700',
    };
    const labels = {
      published: 'Publicado',
      draft: 'Rascunho',
      archived: 'Arquivado',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notícias</h1>
            <p className="text-gray-500 mt-1">Gerencie as notícias do site</p>
          </div>
          <button
            onClick={() => navigate('/admin/news/new')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-5 h-5" />
            Nova Notícia
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar notícias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos os Status</option>
              <option value="draft">Rascunhos</option>
              <option value="published">Publicados</option>
              <option value="archived">Arquivados</option>
            </select>

            {/* Featured Filter */}
            <select
              value={featuredFilter}
              onChange={(e) => {
                setFeaturedFilter(e.target.value as any);
                setPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todas</option>
              <option value="featured">Em Destaque</option>
              <option value="normal">Normais</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Carregando notícias...</p>
          </div>
        </div>
      ) : news.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <div className="text-gray-400 mb-4">
            <Search className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma notícia encontrada</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || statusFilter !== 'all' || featuredFilter !== 'all'
              ? 'Tente ajustar os filtros de busca'
              : 'Comece criando sua primeira notícia'}
          </p>
          {!searchTerm && statusFilter === 'all' && featuredFilter === 'all' && (
            <button
              onClick={() => navigate('/admin/news/new')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Plus className="w-5 h-5" />
              Criar Primeira Notícia
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Notícia
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Publicação
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {news.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          {item.featured_image && (
                            <img
                              src={item.featured_image}
                              alt={item.title}
                              className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-medium text-gray-900 truncate">
                                {item.title}
                              </h3>
                              {item.is_featured && (
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-sm text-gray-500 truncate">/{item.slug}</p>
                            {item.summary && (
                              <p className="text-xs text-gray-400 mt-1 line-clamp-2">{item.summary}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {statusBadge(item.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {item.published_at
                          ? new Date(item.published_at).toLocaleDateString('pt-BR')
                          : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => window.open(`/news/${item.slug}`, '_blank')}
                            className="p-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition"
                            title="Visualizar"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/admin/news/edit/${item.id}`)}
                            className="p-2 text-blue-700 bg-blue-50 rounded hover:bg-blue-100 transition"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDuplicate(item.id)}
                            className="p-2 text-indigo-700 bg-indigo-50 rounded hover:bg-indigo-100 transition"
                            title="Duplicar"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          {item.status !== 'published' ? (
                            <button
                              onClick={() => handlePublish(item.id)}
                              className="p-2 text-green-700 bg-green-50 rounded hover:bg-green-100 transition"
                              title="Publicar"
                            >
                              <UploadCloud className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleArchive(item.id)}
                              className="p-2 text-amber-700 bg-amber-50 rounded hover:bg-amber-100 transition"
                              title="Arquivar"
                            >
                              <Archive className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-red-700 bg-red-50 rounded hover:bg-red-100 transition"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <span className="text-sm text-gray-600">
                Página {page} de {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próxima
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NewsList;