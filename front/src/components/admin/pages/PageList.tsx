import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, Search, Archive, UploadCloud, Copy } from 'lucide-react';

// ✅ usa seus services já criados
import {
  ListarPaginas,
  DeletarPagina,
  PublicarPagina,
  ArquivarPagina,
  DuplicarPagina,
} from '../../../services/pages/api';

// ✅ usa seus types já existentes
import type { PagesListResponse } from '../../../types/page-builder.types';

// Caso você já tenha um tipo de item de página exportado, use-o aqui.
// Senão, este fallback garante compatibilidade com os campos usados no componente.
interface PageItemFallback {
  id: number | string;
  name: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
}

// Helper para extrair a lista de páginas, independente do formato de PagesListResponse
function getItemsFromListResponse(resp: PagesListResponse): PageItemFallback[] {
  // Tenta resp.data como array
  const maybeArray = (resp as any)?.data;
  if (Array.isArray(maybeArray)) return maybeArray as PageItemFallback[];

  // Alguns backends usam resp.items
  if (Array.isArray((resp as any)?.items)) return (resp as any).items as PageItemFallback[];

  // Ou resp.results
  if (Array.isArray((resp as any)?.results)) return (resp as any).results as PageItemFallback[];

  return [];
}

// Helper para paginação a partir do response
function getPaginationFromListResponse(resp: PagesListResponse) {
  const meta = (resp as any)?.meta ?? (resp as any)?.pagination ?? {};
  return {
    total: Number(meta.total ?? 0),
    perPage: Number(meta.per_page ?? meta.perPage ?? 12),
    currentPage: Number(meta.current_page ?? meta.page ?? 1),
    lastPage: Number(meta.last_page ?? meta.total_pages ?? 1),
  };
}

const PAGE_SIZE = 1000;

export const PageList = () => {
  const navigate = useNavigate();

  const [pages, setPages] = useState<PageItemFallback[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hardLoadingAction, setHardLoadingAction] = useState<string | null>(null);

  // Carrega lista
  useEffect(() => {
    void fetchPages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const resp = await ListarPaginas({
        page,
        per_page: PAGE_SIZE,
        search: searchTerm || undefined,
      });

      const items = getItemsFromListResponse(resp);
      const { lastPage } = getPaginationFromListResponse(resp);

      setPages(items);
      setTotalPages(lastPage || 1);
    } catch (error) {
      console.error('Erro ao buscar páginas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1);
    await fetchPages();
  };

  const handleDelete = async (id: number | string) => {
    if (!confirm('Tem certeza que deseja excluir esta página?')) return;
    try {
      setHardLoadingAction(`delete-${id}`);
      await DeletarPagina(String(id));
      alert('Página excluída com sucesso!');
      await fetchPages();
    } catch (error) {
      console.error('Erro ao excluir página:', error);
      alert('Erro ao excluir página!');
    } finally {
      setHardLoadingAction(null);
    }
  };

  const handlePublish = async (id: number | string) => {
    try {
      setHardLoadingAction(`publish-${id}`);
      await PublicarPagina(String(id));
      await fetchPages();
    } catch (error) {
      console.error('Erro ao publicar página:', error);
      alert('Erro ao publicar página!');
    } finally {
      setHardLoadingAction(null);
    }
  };

  const handleArchive = async (id: number | string) => {
    try {
      setHardLoadingAction(`archive-${id}`);
      await ArquivarPagina(String(id));
      await fetchPages();
    } catch (error) {
      console.error('Erro ao arquivar página:', error);
      alert('Erro ao arquivar página!');
    } finally {
      setHardLoadingAction(null);
    }
  };

  const handleDuplicate = async (id: number | string) => {
    try {
      setHardLoadingAction(`duplicate-${id}`);
      await DuplicarPagina(String(id));
      await fetchPages();
    } catch (error) {
      console.error('Erro ao duplicar página:', error);
      alert('Erro ao duplicar página!');
    } finally {
      setHardLoadingAction(null);
    }
  };

  const statusChip = (status: PageItemFallback['status']) => {
    const map: Record<PageItemFallback['status'], string> = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800',
      archived: 'bg-gray-200 text-gray-700',
    } as const;
    return map[status] ?? 'bg-gray-100 text-gray-700';
  };

  const isActing = (prefix: string, id: number | string) => hardLoadingAction === `${prefix}-${id}`;

  const emptyState = useMemo(() => (
    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Plus className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">Nenhuma página encontrada</h3>
      <p className="text-gray-600 mb-6">
        {searchTerm ? 'Nenhuma página corresponde à sua busca.' : 'Comece criando sua primeira página personalizada.'}
      </p>
      {!searchTerm && (
        <button
          onClick={() => navigate('/admin/pages/new')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5" />
          Criar Primeira Página
        </button>
      )}
    </div>
  ), [navigate, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Gerenciar Páginas</h1>
              <p className="text-gray-600 mt-1">Crie e gerencie as páginas do seu site</p>
            </div>
            <button
              onClick={() => navigate('admin/pages/new')}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
            >
              <Plus className="w-5 h-5" />
              Nova Página
            </button>
          </div>

          {/* Search Bar */}
          <form className="mt-6" onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar páginas..."
                className="w-full pl-10 pr-28 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
                <button
                  type="button"
                  onClick={() => { setSearchTerm(''); setPage(1); void fetchPages(); }}
                  className="px-3 py-1 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition text-sm"
                >
                  Limpar
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
                >
                  Buscar
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : pages.length === 0 ? (
          emptyState
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pages.map((page) => (
                <div
                  key={String(page.id)}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">{page.name}</h3>
                        <p className="text-sm text-gray-600 truncate">/{page.slug}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${statusChip(page.status)}`}>
                        {page.status === 'published' ? 'Publicado' : page.status === 'archived' ? 'Arquivado' : 'Rascunho'}
                      </span>
                    </div>

                    <div className="text-xs text-gray-500 mb-4 space-y-1">
                      <div>Criado em: {new Date(page.created_at).toLocaleDateString('pt-BR')}</div>
                      <div>Atualizado em: {new Date(page.updated_at).toLocaleDateString('pt-BR')}</div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => window.open(`/${page.slug}`, '_blank')}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition"
                      >
                        <Eye className="w-4 h-4" />
                        Ver
                      </button>
                      <button
                        onClick={() => navigate(`/admin/pages/edit/${page.id}`)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-blue-700 bg-blue-50 rounded hover:bg-blue-100 transition"
                      >
                        <Edit className="w-4 h-4" />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDuplicate(page.id)}
                        disabled={isActing('duplicate', page.id)}
                        className="flex items-center justify-center gap-2 px-3 py-2 text-indigo-700 bg-indigo-50 rounded hover:bg-indigo-100 transition disabled:opacity-60"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      {page.status !== 'published' ? (
                        <button
                          onClick={() => handlePublish(page.id)}
                          disabled={isActing('publish', page.id)}
                          className="flex items-center justify-center gap-2 px-3 py-2 text-green-700 bg-green-50 rounded hover:bg-green-100 transition disabled:opacity-60"
                        >
                          <UploadCloud className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleArchive(page.id)}
                          disabled={isActing('archive', page.id)}
                          className="flex items-center justify-center gap-2 px-3 py-2 text-amber-700 bg-amber-50 rounded hover:bg-amber-100 transition disabled:opacity-60"
                        >
                          <Archive className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(page.id)}
                        disabled={isActing('delete', page.id)}
                        className="flex items-center justify-center gap-2 px-3 py-2 text-red-700 bg-red-50 rounded hover:bg-red-100 transition disabled:opacity-60"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="text-sm text-gray-600">Página {page} de {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Próxima
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PageList;
