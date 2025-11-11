import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EditorContent } from '@tiptap/react';
import { Save, UploadCloud, Archive, Copy, Star } from 'lucide-react';

// Hooks
import { useTipTapEditor } from './hooks/useTipTapEditor';
import { useDragAndDrop } from './hooks/useDragAndDrop';

// Components
import { EditorHeader } from './layout/EditorHeader';
import { EditorToolbar } from './layout/EditorToolbar';
import { CodeEditor } from './layout/CodeEditor';
import { Preview } from './layout/Preview';

// Utils & Services
import { generateSlug } from './utils/slug-generator';
import {
  SalvarPagina,
  AtualizarPagina,
  ObterPaginaPorId,
  ListarPaginas,
  PublicarPagina,
  ArquivarPagina,
  DuplicarPagina,
  debugSaveContent,
} from '../../../services/pages/api';

// Types
import type { CreatePageDto, PageResponse, Page } from '../../../types/page-builder.types';

// Constants
import { outlineStyles } from './constants/editor-constants';
import { tailwindBlocks } from './constants/tailwind-blocks';

type Option = { value: string; label: string };

export const PageBuilder: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  // Estados básicos
  const [pageName, setPageName] = useState('');
  const [pageSlug, setPageSlug] = useState('');
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>('draft');

  // Novos campos
  const [inMainMenu, setInMainMenu] = useState(false);
  const [displayOrder, setDisplayOrder] = useState<number>(0);
  const [isFeatured, setIsFeatured] = useState(false);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [parentId, setParentId] = useState<string | null>(null);
  const [authorName, setAuthorName] = useState<string | null>(null);

  // Opções
  const [categoryOptions, setCategoryOptions] = useState<Option[]>([]);
  const [parentOptions, setParentOptions] = useState<Option[]>([]);

  // UI
  const [showPreview, setShowPreview] = useState(false);
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [htmlCode, setHtmlCode] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showOutline, setShowOutline] = useState(false);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [isLoadingInitialData, setIsLoadingInitialData] = useState(false);

  // Editor
  const editor = useTipTapEditor({ showOutline });
  useDragAndDrop(editor, showOutline);

  // Helpers de status para botões laterais
  const canPublish = status !== 'published';
  const canArchive = status === 'published';

  // Carrega categorias (plugue seu endpoint quando existir)
  useEffect(() => {
    (async () => {
      try {
        // const { data } = await axiosConfig.get<{ data: { id: string, name: string }[] }>('/categories');
        // setCategoryOptions(data.data.map(c => ({ value: c.id, label: c.name })));
      } catch {
        setCategoryOptions([]);
      }
    })();
  }, []);

  // Carrega páginas raiz para página-pai
  useEffect(() => {
    (async () => {
      try {
        const list = await ListarPaginas({
          in_main_menu: true,
          status: 'published',
          per_page: 100,
          page: 1,
          parent_id: null,
        });
        const opts = (list.data || [])
          .filter((p) => !id || p.id !== id)
          .map((p) => ({ value: p.id, label: `${p.name} (${p.slug})` }));
        setParentOptions(opts);
      } catch {
        setParentOptions([]);
      }
    })();
  }, [id]);

  // Carrega página ao editar
  useEffect(() => {
    if (!isEditMode || !id || !editor) return;

    (async () => {
      try {
        setIsLoadingInitialData(true);
        const response = await ObterPaginaPorId(id);
        const item = (response as PageResponse).data as Page;

        const initialName = item?.name ?? '';
        const initialSlug = item?.slug ?? '';
        const initialHtml = item?.content?.html ?? '';

        setPageName(initialName);
        setPageSlug(initialSlug);
        setStatus(item?.status ?? 'draft');
        setIsSlugManuallyEdited(true);

        setInMainMenu(Boolean((item as any).in_main_menu));
        setDisplayOrder(typeof (item as any).display_order === 'number' ? (item as any).display_order : 0);
        setIsFeatured(Boolean((item as any).is_featured));
        setCategoryId((item as any).category_id ?? null);
        setParentId((item as any).parent_id ?? null);
        setAuthorName((item as any).author_name ?? null);

        if (initialHtml && editor) {
          editor.commands.setContent(initialHtml);
          setHtmlCode(initialHtml);
        }
      } catch (error) {
        console.error('Erro ao carregar a página para edição:', error);
        alert('Não foi possível carregar a página.');
        navigate('/admin/pages');
      } finally {
        setIsLoadingInitialData(false);
      }
    })();
  }, [id, isEditMode, editor, navigate]);

  // Handlers de campos
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setPageName(name);
    if (!isSlugManuallyEdited) setPageSlug(generateSlug(name));
  };
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageSlug(e.target.value);
    setIsSlugManuallyEdited(true);
  };

  const currentHTML = useMemo(
    () => (showCodeEditor ? htmlCode : editor?.getHTML() || ''),
    [showCodeEditor, htmlCode, editor]
  );

  // Payload
  const buildPayload = (override?: Partial<CreatePageDto>): CreatePageDto | Partial<CreatePageDto> =>
  ({
    name: pageName,
    slug: pageSlug,
    content: { html: currentHTML, type: 'tiptap-html' },
    status,
    category_id: categoryId ?? undefined,
    is_featured: isFeatured,
    display_order: Number.isFinite(displayOrder) ? displayOrder : 0,
    in_main_menu: inMainMenu,
    parent_id: parentId ?? undefined,
    author_name: authorName ?? undefined,
    ...override,
  } as any);

  // Ações
  const doSave = async (override?: Partial<CreatePageDto>) => {
    if (!pageName || !pageSlug) {
      alert('Por favor, preencha o nome e o slug da página!');
      return;
    }
    const htmlContent = currentHTML;
    debugSaveContent(htmlContent);
    setIsSaving(true);
    try {
      if (isEditMode && id) {
        await AtualizarPagina(String(id), buildPayload(override));
        alert('✅ Página atualizada com sucesso!');
      } else {
        const response = await SalvarPagina(buildPayload(override) as CreatePageDto);
        if (!(response as PageResponse)?.data) throw new Error('Resposta inesperada ao criar página');
        alert('✅ Página salva com sucesso!');
      }
      //navigate('/admin/pages');
    } catch (error) {
      console.error('Erro ao salvar página:', error);
      alert('❌ Erro ao salvar página!');
    } finally {
      setIsSaving(false);
    }
  };
  const handleSave = () => doSave();
  const handleSaveDraft = () => doSave({ status: 'draft' });

  const handlePublish = async () => {
    if (!isEditMode || !id) return alert('Salve a página antes de publicar.');
    try {
      const res = await PublicarPagina(id);
      setStatus(res.data.status);
      alert('🚀 Página publicada!');
    } catch (e) {
      console.error(e);
      alert('❌ Não foi possível publicar a página.');
    }
  };
  const handleArchive = async () => {
    if (!isEditMode || !id) return alert('Salve a página antes de arquivar.');
    try {
      const res = await ArquivarPagina(id);
      setStatus(res.data.status);
      alert('📦 Página arquivada!');
    } catch (e) {
      console.error(e);
      alert('❌ Não foi possível arquivar a página.');
    }
  };
  const handleDuplicate = async () => {
    if (!isEditMode || !id) return alert('Abra uma página existente para duplicar.');
    try {
      await DuplicarPagina(id);
      alert('📄 Página duplicada como rascunho!');
      navigate('/admin/pages');
    } catch (e) {
      console.error(e);
      alert('❌ Não foi possível duplicar a página.');
    }
  };

  // Toggles
  const toggleCodeEditor = () => {
    if (!editor) return;
    if (!showCodeEditor) {
      setHtmlCode(editor.getHTML());
      setShowCodeEditor(true);
    } else {
      editor.commands.setContent(htmlCode);
      setShowCodeEditor(false);
    }
  };
  const toggleOutline = () => setShowOutline((v) => !v);
  const addTailwindBlock = () => {
    if (!editor) return;
    const blockType = window.prompt(
      'Escolha o tipo de bloco Tailwind:\n1 - Card Simples\n2 - Grid 3 Colunas\n3 - Hero Section\n4 - Botão',
      '1'
    );
    const blockMap: Record<string, string> = {
      '1': tailwindBlocks.card,
      '2': tailwindBlocks.grid,
      '3': tailwindBlocks.hero,
      '4': tailwindBlocks.buttons,
    };
    const html = blockMap[blockType || ''];
    if (html) editor.chain().focus().insertContent(html).run();
  };
  const addImage = () => {
    const url = window.prompt('URL da imagem:', 'https://placehold.co/600x400');
    if (url && editor) editor.chain().focus().setImage({ src: url }).run();
  };
  const setLink = () => {
    const url = window.prompt('URL do link:', 'https://');
    if (url && editor) editor.chain().focus().setLink({ href: url }).run();
  };

  if (!editor || isLoadingInitialData) {
    return (
      <div className="flex justify-center items-center h-64">
        {isLoadingInitialData ? 'Carregando dados...' : 'Carregando editor...'}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{outlineStyles}</style>

      {/* Header enxuto */}
      <EditorHeader
        status={status}
        isEditMode={isEditMode}
        titleOverride={isEditMode ? 'Editar Página' : 'Nova Página'}
        authorName={authorName}
        showPreview={showPreview}
        showCodeEditor={showCodeEditor}
        showOutline={showOutline}
        onToggleCodeEditor={toggleCodeEditor}
        onTogglePreview={() => setShowPreview(!showPreview)}
        onToggleOutline={toggleOutline}
        onAddTailwindBlock={addTailwindBlock}
      />

      {/* Grid principal: 12 colunas (9/3) */}
      <main className="grid grid-cols-12 gap-6 p-6 max-w-7xl mx-auto">
        {/* col-9: editor */}
        <section className="col-span-12 lg:col-span-9 space-y-6">
          {/* Card Nome/Slug */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Página</label>
                <input
                  type="text"
                  value={pageName}
                  onChange={handleNameChange}
                  className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                  placeholder="Ex: Página Inicial"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug da Página</label>
                <input
                  type="text"
                  value={pageSlug}
                  onChange={handleSlugChange}
                  className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                  placeholder="Ex: pagina-inicial"
                />
              </div>
            </div>
          </div>

          {/* Toolbar sticky */}
          <div className="sticky top-[72px] z-20">
            <div className="rounded-xl border border-gray-200 bg-white/80 backdrop-blur shadow-sm px-3 py-2">
              <EditorToolbar editor={editor} onAddImage={addImage} onSetLink={setLink} />
            </div>
          </div>

          {/* Canvas */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            {showCodeEditor ? (
              <CodeEditor htmlCode={htmlCode} onCodeChange={setHtmlCode} />
            ) : showPreview ? (
              <Preview htmlContent={editor.getHTML()} />
            ) : (
              <EditorContent editor={editor} className="min-h-[560px] p-4" />
            )}
          </div>
        </section>

        {/* col-3: sidebar */}
        <aside className="col-span-12 lg:col-span-3 space-y-6">
          {/* Publicar */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Publicar</h3>
            <div className="space-y-2">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Salvando...' : (isEditMode ? 'Salvar alterações' : 'Salvar página')}
              </button>

              <button
                onClick={handleSaveDraft}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
              >
                <Save className="w-4 h-4" />
                Salvar como rascunho
              </button>

              <button
                onClick={handlePublish}
                disabled={!canPublish || isSaving}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <UploadCloud className="w-4 h-4" />
                Publicar
              </button>

              <button
                onClick={handleArchive}
                disabled={!canArchive || isSaving}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Archive className="w-4 h-4" />
                Arquivar
              </button>
            </div>
          </div>

          {/* Categoria / Hierarquia */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Categoria e Hierarquia</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Categoria</label>
                <select
                  value={categoryId ?? ''}
                  onChange={(e) => setCategoryId(e.target.value || null)}
                  className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                >
                  <option value="">— Sem categoria —</option>
                  {categoryOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Página Pai</label>
                <select
                  value={parentId ?? ''}
                  onChange={(e) => setParentId(e.target.value || null)}
                  className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                >
                  <option value="">— Sem pai (nível raiz) —</option>
                  {parentOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Posição no Menu</label>
                <input
                  type="number"
                  min={0}
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(parseInt(e.target.value || '0', 10))}
                  className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                />
              </div>

              <label className="flex items-center gap-2 mt-1 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={inMainMenu}
                  onChange={(e) => setInMainMenu(e.target.checked)}
                  className="h-4 w-4 border-gray-300 rounded"
                />
                Exibir no menu principal
              </label>

              <label className="flex items-center gap-2 mt-1 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="h-4 w-4 border-amber-300 rounded"
                />
                <Star className="w-4 h-4 text-amber-500" />
                Marcar como destaque
              </label>
            </div>
          </div>

          {/* Duplicar */}
          {isEditMode && (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Outras Ações</h3>
              <button
                onClick={handleDuplicate}
                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                <Copy className="w-4 h-4" /> Duplicar Página
              </button>
            </div>
          )}

          {/* Dicas */}
          <div className="rounded-xl border border-blue-200 bg-blue-50 shadow-sm p-4 text-sm text-blue-800">
            <div className="font-semibold mb-1">Dica rápida</div>
            Use <b>Blocos</b> para inserir componentes prontos, ative <b>Outline</b> para
            arrastar elementos e alterne para <b>Código</b> para editar HTML bruto.
          </div>

          {/* Atalhos & Preview */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-4">
            <h3 className="font-semibold text-gray-800 mb-2">Atalhos</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><kbd className="px-1.5 py-0.5 rounded bg-gray-100 border">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-gray-100 border">B</kbd> — Negrito</li>
              <li><kbd className="px-1.5 py-0.5 rounded bg-gray-100 border">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-gray-100 border">I</kbd> — Itálico</li>
              <li><kbd className="px-1.5 py-0.5 rounded bg-gray-100 border">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-gray-100 border">K</kbd> — Link</li>
              <li><kbd className="px-1.5 py-0.5 rounded bg-gray-100 border">/</kbd> — Comandos</li>
            </ul>

            <hr className="my-3" />
            <h3 className="font-semibold text-gray-800 mb-2">Pré-visualização pública</h3>
            <a
              href={`/pages/${pageSlug || id}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center w-full rounded-lg bg-gray-900 text-white px-3 py-2 text-sm hover:bg-black"
            >
              Abrir preview
            </a>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default PageBuilder;
