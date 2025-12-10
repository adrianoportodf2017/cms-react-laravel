import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Edit, Trash2, Eye, Search, Archive, UploadCloud, Copy, 
  ArrowUpDown, ArrowUp, ArrowDown, ChevronRight, Folder, File, 
  ChevronDown, ChevronUp, List, FolderTree 
} from 'lucide-react';

import {
  ListarPaginas,
  DeletarPagina,
  PublicarPagina,
  ArquivarPagina,
  DuplicarPagina,
} from '../../../services/pages/api';

import type { PagesListResponse } from '../../../types/page-builder.types';

interface PageItemFallback {
  id: number | string;
  name: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
  parent_id?: number | string | null;
  display_order?: number;
}

type SortField = 'name' | 'slug' | 'status' | 'created_at' | 'updated_at' | 'display_order';
type SortDirection = 'asc' | 'desc';
type ViewMode = 'flat' | 'hierarchical';

interface PageTreeNode extends PageItemFallback {
  children: PageTreeNode[];
  level: number;
  breadcrumb: string[];
}

// Helper para extrair a lista de páginas
function getItemsFromListResponse(resp: PagesListResponse): PageItemFallback[] {
  const maybeArray = (resp as any)?.data;
  if (Array.isArray(maybeArray)) return maybeArray as PageItemFallback[];
  if (Array.isArray((resp as any)?.items)) return (resp as any).items as PageItemFallback[];
  if (Array.isArray((resp as any)?.results)) return (resp as any).results as PageItemFallback[];
  return [];
}

// Helper para paginação
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
  const [sortField, setSortField] = useState<SortField>('display_order');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [viewMode, setViewMode] = useState<ViewMode>('hierarchical');
  const [collapsedNodes, setCollapsedNodes] = useState<Set<string | number>>(new Set());

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

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Constrói árvore hierárquica
  const buildTree = (items: PageItemFallback[]): PageTreeNode[] => {
    const map = new Map<string | number, PageTreeNode>();
    const roots: PageTreeNode[] = [];

    // Primeiro, cria todos os nós
    items.forEach((item) => {
      map.set(item.id, {
        ...item,
        children: [],
        level: 0,
        breadcrumb: [],
      });
    });

    // Depois, organiza a hierarquia
    items.forEach((item) => {
      const node = map.get(item.id)!;
      
      if (!item.parent_id) {
        roots.push(node);
      } else {
        const parent = map.get(item.parent_id);
        if (parent) {
          node.level = parent.level + 1;
          node.breadcrumb = [...parent.breadcrumb, parent.name];
          parent.children.push(node);
        } else {
          // Pai não encontrado, adiciona como raiz
          roots.push(node);
        }
      }
    });

    // Ordena por display_order
    const sortByOrder = (nodes: PageTreeNode[]) => {
      nodes.sort((a, b) => {
        const orderA = a.display_order ?? 999;
        const orderB = b.display_order ?? 999;
        return orderA - orderB;
      });
      nodes.forEach(node => {
        if (node.children.length > 0) {
          sortByOrder(node.children);
        }
      });
    };

    sortByOrder(roots);
    return roots;
  };

  // Flatten tree para exibição
  const flattenTree = (nodes: PageTreeNode[]): PageTreeNode[] => {
    const result: PageTreeNode[] = [];
    
    const traverse = (node: PageTreeNode) => {
      result.push(node);
      if (!collapsedNodes.has(node.id) && node.children.length > 0) {
        node.children.forEach(child => traverse(child));
      }
    };

    nodes.forEach(node => traverse(node));
    return result;
  };

  // Toggle collapse
  const toggleCollapse = (id: string | number) => {
    const newCollapsed = new Set(collapsedNodes);
    if (newCollapsed.has(id)) {
      newCollapsed.delete(id);
    } else {
      newCollapsed.add(id);
    }
    setCollapsedNodes(newCollapsed);
  };

  // Páginas organizadas
  const organizedPages = useMemo(() => {
    if (viewMode === 'hierarchical') {
      const tree = buildTree(pages);
      return flattenTree(tree);
    } else {
      // Modo flat com ordenação
      return [...pages].sort((a, b) => {
        let aValue: any = a[sortField];
        let bValue: any = b[sortField];

        if (sortField === 'created_at' || sortField === 'updated_at') {
          aValue = new Date(aValue).getTime();
          bValue = new Date(bValue).getTime();
        }

        if (sortField === 'display_order') {
          aValue = aValue ?? 999;
          bValue = bValue ?? 999;
        }

        if (typeof aValue === 'string') aValue = aValue.toLowerCase();
        if (typeof bValue === 'string') bValue = bValue.toLowerCase();

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      }).map(p => ({ ...p, children: [], level: 0, breadcrumb: [] } as PageTreeNode));
    }
  }, [pages, viewMode, sortField, sortDirection, collapsedNodes]);

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

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4" />;
    return sortDirection === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />;
  };

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
              onClick={() => navigate('/admin/pages/new')}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
            >
              <Plus className="w-5 h-5" />
              Nova Página
            </button>
          </div>

          {/* Search Bar + View Toggle */}
          <div className="mt-6 flex items-center gap-4">
            <form className="flex-1" onSubmit={handleSearch}>
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

            {/* View Mode Toggle */}
            <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
              <button
                onClick={() => setViewMode('hierarchical')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${
                  viewMode === 'hierarchical'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                title="Visualização hierárquica"
              >
                <FolderTree className="w-4 h-4" />
                Hierarquia
              </button>
              <button
                onClick={() => setViewMode('flat')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${
                  viewMode === 'flat'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                title="Visualização plana"
              >
                <List className="w-4 h-4" />
                Lista
              </button>
            </div>
          </div>
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
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          {viewMode === 'hierarchical' ? 'Hierarquia' : 'Nome'}
                        </div>
                      </th>
                      <th
                        onClick={() => viewMode === 'flat' && handleSort('slug')}
                        className={`px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider ${viewMode === 'flat' ? 'cursor-pointer hover:bg-gray-100 transition' : ''}`}
                      >
                        <div className="flex items-center gap-2">
                          Slug
                          {viewMode === 'flat' && <SortIcon field="slug" />}
                        </div>
                      </th>
                      <th
                        onClick={() => viewMode === 'flat' && handleSort('status')}
                        className={`px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider ${viewMode === 'flat' ? 'cursor-pointer hover:bg-gray-100 transition' : ''}`}
                      >
                        <div className="flex items-center gap-2">
                          Status
                          {viewMode === 'flat' && <SortIcon field="status" />}
                        </div>
                      </th>
                      <th
                        onClick={() => viewMode === 'flat' && handleSort('created_at')}
                        className={`px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider ${viewMode === 'flat' ? 'cursor-pointer hover:bg-gray-100 transition' : ''}`}
                      >
                        <div className="flex items-center gap-2">
                          Criado em
                          {viewMode === 'flat' && <SortIcon field="created_at" />}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {organizedPages.map((page) => (
                      <tr key={String(page.id)} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div 
                            className="flex items-center gap-2"
                            style={{ paddingLeft: `${page.level * 24}px` }}
                          >
                            {/* Toggle para páginas com filhos */}
                            {page.children.length > 0 && viewMode === 'hierarchical' && (
                              <button
                                onClick={() => toggleCollapse(page.id)}
                                className="p-0.5 hover:bg-gray-200 rounded transition"
                              >
                                {collapsedNodes.has(page.id) ? (
                                  <ChevronRight className="w-4 h-4 text-gray-500" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-gray-500" />
                                )}
                              </button>
                            )}

                            {/* Ícone */}
                            {page.children.length > 0 ? (
                              <Folder className="w-4 h-4 text-blue-500 flex-shrink-0" />
                            ) : (
                              <File className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            )}

                            {/* Nome + Breadcrumb */}
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-gray-900">
                                {page.name}
                              </span>
                              {page.breadcrumb.length > 0 && viewMode === 'hierarchical' && (
                                <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                                  {page.breadcrumb.map((crumb, idx) => (
                                    <span key={idx} className="flex items-center gap-1">
                                      {crumb}
                                      <ChevronRight className="w-3 h-3" />
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">/{page.slug}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded ${statusChip(page.status)}`}>
                            {page.status === 'published' ? 'Publicado' : page.status === 'archived' ? 'Arquivado' : 'Rascunho'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(page.created_at).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => window.open(`/${page.slug}`, '_blank')}
                              className="p-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition"
                              title="Visualizar"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => navigate(`/admin/pages/edit/${page.id}`)}
                              className="p-2 text-blue-700 bg-blue-50 rounded hover:bg-blue-100 transition"
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDuplicate(page.id)}
                              disabled={isActing('duplicate', page.id)}
                              className="p-2 text-indigo-700 bg-indigo-50 rounded hover:bg-indigo-100 transition disabled:opacity-60"
                              title="Duplicar"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            {page.status !== 'published' ? (
                              <button
                                onClick={() => handlePublish(page.id)}
                                disabled={isActing('publish', page.id)}
                                className="p-2 text-green-700 bg-green-50 rounded hover:bg-green-100 transition disabled:opacity-60"
                                title="Publicar"
                              >
                                <UploadCloud className="w-4 h-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleArchive(page.id)}
                                disabled={isActing('archive', page.id)}
                                className="p-2 text-amber-700 bg-amber-50 rounded hover:bg-amber-100 transition disabled:opacity-60"
                                title="Arquivar"
                              >
                                <Archive className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(page.id)}
                              disabled={isActing('delete', page.id)}
                              className="p-2 text-red-700 bg-red-50 rounded hover:bg-red-100 transition disabled:opacity-60"
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