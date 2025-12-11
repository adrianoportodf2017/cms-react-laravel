import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Eye, Upload, X, Star, Calendar, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

import {
    useCreateNews,
    useUpdateNews,
    useGetNewsById,
} from '../../../services/news';

import type {
    CreateNewsDto
} from '../../../types/new.types';

// O mapa global para rastrear o estado de carregamento do script CKEditor
const CKEDITOR_SCRIPT_LOADED_KEY = 'ckeditor_script_loaded';

// Funções utilitárias de formatação (MOVEMOS PARA FORA DO COMPONENTE)
const formatToSlug = (text: string): string => {
    return text
        .toLowerCase()
        .normalize('NFD') // Normaliza para decompor caracteres acentuados
        .replace(/[\u0300-\u036f]/g, '') // Remove os diacríticos (acentos)
        .replace(/[^a-z0-9]+/g, '-') // Substitui não-alfanuméricos (incluindo espaços e a maioria dos símbolos) por hífens
        .replace(/^-+|-+$/g, ''); // Remove hífens do início e do fim
};

// CKEditor Component (mantido o mesmo)
const CKEditorComponent = ({
    value,
    onChange,
}: {
    value: string;
    onChange: (html: string) => void;
}) => {
    const editorRef = useRef<HTMLTextAreaElement>(null);
    const editorInstanceRef = useRef<any>(null);
    const [isEditorReady, setIsEditorReady] = useState(false);

    // Função que inicializa o editor
    const initEditor = () => {
        if (!editorRef.current || editorInstanceRef.current || !(window as any).ClassicEditor) return;

        const ClassicEditor = (window as any).ClassicEditor;
        
        ClassicEditor.create(editorRef.current, {
            toolbar: [
                'heading', '|',
                'bold', 'italic', 'underline', '|',
                'link', 'bulletedList', 'numberedList', '|',
                'outdent', 'indent', '|',
                'blockQuote', 'insertTable', '|',
                'undo', 'redo'
            ],
        })
        .then((editor: any) => {
            editorInstanceRef.current = editor;
            editor.ui.view.editable.element.style.minHeight = '500px';
            
            if (value) {
                editor.setData(value);
            }
            
            editor.model.document.on('change:data', () => {
                onChange(editor.getData());
            });
            
            setIsEditorReady(true);
        })
        .catch((error: any) => {
            console.error('Error initializing CKEditor:', error);
        });
    };

    // Efeito para carregar o script e inicializar o editor
    useEffect(() => {
        if ((window as any).ClassicEditor) {
            initEditor();
        } else {
            const scriptInjected = document.querySelector(`script[data-ckeditor-status="${CKEDITOR_SCRIPT_LOADED_KEY}"]`);
            
            if (!scriptInjected) {
                const script = document.createElement('script');
                script.src = 'https://cdn.ckeditor.com/ckeditor5/35.0.1/classic/ckeditor.js';
                script.async = true;
                script.dataset.ckeditorStatus = CKEDITOR_SCRIPT_LOADED_KEY;
                
                script.onload = () => {
                    initEditor();
                };
                script.onerror = () => {
                    toast.error('Erro ao carregar script do CKEditor.');
                };
                document.head.appendChild(script);
            } else if (scriptInjected && (window as any).ClassicEditor) {
                initEditor();
            }
        }

        return () => {
            if (editorInstanceRef.current) {
                editorInstanceRef.current.destroy().catch((error: any) => {
                    console.warn('CKEditor Error destroying:', error);
                });
                editorInstanceRef.current = null;
                setIsEditorReady(false);
            }
        };
    }, []); 

    // Atualiza conteúdo quando value muda externamente
    useEffect(() => {
        if (isEditorReady && editorInstanceRef.current && value !== editorInstanceRef.current.getData()) {
            editorInstanceRef.current.setData(value || '');
        }
    }, [value, isEditorReady]);

    return (
        <div className="relative">
            <textarea
                ref={editorRef}
                className="hidden" 
                defaultValue={value}
            />
            {!isEditorReady && (
                <div className="flex items-center justify-center h-[500px] border border-gray-300 rounded-lg bg-gray-50">
                    <div className="text-center">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Carregando editor...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export const NewsForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = !!id;

    // Form state
    const [title, setTitle] = useState('');
    // 'slug' armazena o valor formatado (para API)
    const [slug, setSlug] = useState(''); 
    // NOVO: 'rawSlugInput' armazena o valor bruto/não formatado do input do usuário
    const [rawSlugInput, setRawSlugInput] = useState(''); 
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState<'draft' | 'published' | 'archived'>('draft');
    const [isFeatured, setIsFeatured] = useState(false);
    const [displayOrder, setDisplayOrder] = useState(0);
    const [featuredImage, setFeaturedImage] = useState<File | null>(null);
    const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
    const [isSlugManual, setIsSlugManual] = useState(false);

    // Mutations
    const createNews = useCreateNews();
    const updateNews = useUpdateNews();
    const { data: newsData, isLoading } = useGetNewsById(id || '', isEditing);

    // Loading state unificado
    const isSaving = createNews.isPending || updateNews.isPending;

    // Load existing news
    useEffect(() => {
        if (newsData?.data) {
            const news = newsData.data;
            setTitle(news.title);
            setSlug(news.slug);
            // Ao carregar, o valor bruto do input deve ser igual ao slug
            setRawSlugInput(news.slug); 
            setSummary(news.summary || '');
            setContent(news.content.html || '');
            setStatus(news.status);
            setIsFeatured(news.is_featured);
            setDisplayOrder(news.display_order);
            setCurrentImageUrl(news.featured_image || null);
            setIsSlugManual(true);
        }
    }, [newsData]);

    // Auto-generate slug from title
    useEffect(() => {
        // Só gera automaticamente se o slug não for manual E o título existir
        if (!isSlugManual && title) {
            const generated = formatToSlug(title);
            setSlug(generated);
            // Também atualizamos o input bruto para refletir o valor gerado
            setRawSlugInput(generated); 
        } else if (!title) {
             setSlug('');
             setRawSlugInput('');
             setIsSlugManual(false);
        }
    }, [title, isSlugManual]);

    // NOVO: Manipulador para o input do usuário (armazena valor bruto)
    const handleRawSlugChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        setRawSlugInput(rawValue);
        setIsSlugManual(true);
        
        // NOTA: O estado 'slug' formatado só será atualizado ao SALVAR (handleSubmit)
    }, []);


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error('Imagem deve ter no máximo 2MB');
                return;
            }
            setFeaturedImage(file);
            setCurrentImageUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent, publishNow = false) => {
        e.preventDefault();

        if (!title.trim()) {
            toast.error('Título é obrigatório');
            return;
        }

        if (!content.trim() || content === '<p><br></p>') {
            toast.error('Conteúdo é obrigatório');
            return;
        }

        // 1. O slug final é OBRIGATORIAMENTE o valor BRUTO (rawSlugInput) formatado.
        const finalSlug = formatToSlug(rawSlugInput.trim() || title.trim());

        // 2. Garante que haja um slug válido
        if (!finalSlug) {
            toast.error('O Slug não pode ser vazio. Digite um valor válido.');
            return;
        }

        // 3. Atualiza os estados para refletir o slug que foi salvo (para feedback visual)
        setSlug(finalSlug);
        setRawSlugInput(finalSlug);

        const finalStatus = publishNow ? 'published' : status;

        const data: CreateNewsDto = {
            title: title.trim(),
            slug: finalSlug, // Usa o slug formatado
            summary: summary.trim() || undefined,
            content: {
                html: content,
                type: 'html',
            },
            status: finalStatus,
            is_featured: isFeatured,
            display_order: displayOrder,
            ...(featuredImage && { featured_image: featuredImage }),
        };

        // Toast de loading
        const loadingToast = toast.loading(
            isEditing ? 'Atualizando notícia...' : 'Criando notícia...'
        );

        try {
            if (isEditing) {
                await updateNews.mutateAsync({ id: id!, data });
                toast.success('✅ Notícia atualizada com sucesso!', { 
                    id: loadingToast,
                    duration: 3000,
                });
            } else {
                const result = await createNews.mutateAsync(data);
                toast.success('✅ Notícia criada com sucesso!', { 
                    id: loadingToast,
                    duration: 3000,
                });
                // Redireciona para edição após criar
                setTimeout(() => {
                    navigate(`/admin/news/edit/${result.data.id}`);
                }, 1000);
            }
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || 
                                 error?.message || 
                                'Erro ao salvar notícia';
            toast.error(`❌ ${errorMessage}`, { 
                id: loadingToast,
                duration: 4000,
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-lg text-gray-600">Carregando notícia...</p>
                </div>
            </div>
        );
    }

    // O status do slug que será exibido no campo (slug real ou o que está digitando)
    const displayedSlug = isSlugManual ? rawSlugInput : slug;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Bloco de Estilos e Header Mantidos */}
            {/* ... (código da tag style e header) ... */}

            <style>
                {`
                    /* Estilos para o conteúdo gerado pelo CKEditor (classe ck-content é injetada por ele) */
                    .ck-content ul,
                    .ck-content ol {
                        margin-left: 1.5rem;
                        padding-left: 0;
                    }

                    .ck-content ul {
                        list-style-type: disc;
                        list-style-position: outside;
                    }

                    .ck-content ol {
                        list-style-type: decimal;
                        list-style-position: outside;
                    }

                    .ck-content li {
                        margin-bottom: 0.25rem;
                    }
                `}
            </style>

            <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/admin/news')}
                                className="p-2 hover:bg-gray-100 rounded-lg transition"
                                disabled={isSaving}
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">
                                    {isEditing ? 'Editar Notícia' : 'Nova Notícia'}
                                </h1>
                                <p className="text-sm text-gray-500">{title || 'Sem título'}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Botão Salvar (Rascunho) */}
                            <button
                                type="button"
                                onClick={(e) => handleSubmit(e, false)}
                                disabled={isSaving}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Salvando...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Salvar
                                    </>
                                )}
                            </button>

                            {/* Botão Publicar */}
                            <button
                                type="button"
                                onClick={(e) => handleSubmit(e, true)}
                                disabled={isSaving}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Processando...
                                    </>
                                ) : (
                                    <>
                                        <Eye className="w-4 h-4" />
                                        {status === 'published' ? 'Atualizar' : 'Publicar'}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <form onSubmit={handleSubmit} className="max-w-5xl mx-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Title (mantido o mesmo) */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Título *
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Digite o título da notícia"
                                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                                disabled={isSaving}
                            />
                        </div>

                        {/* Slug - AGORA USA rawSlugInput */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Slug (URL) *
                            </label>
                            <input
                                type="text"
                                // Mostra o valor bruto que o usuário está digitando
                                value={rawSlugInput} 
                                // Usa o novo manipulador que NÃO formata em tempo real
                                onChange={handleRawSlugChange} 
                                placeholder="slug-da-noticia"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                                required
                                disabled={isSaving}
                            />
                            {/* Exibe o slug que realmente será usado (o estado 'slug' formatado) */}
                            <p className="text-xs text-gray-500 mt-1">
                                URL que será salva: /news/{slug || 'slug-da-noticia'}
                            </p>
                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                {isSlugManual ? (
                                    <span className="text-red-600">
                                        Slug modificado. Será formatado para '{formatToSlug(rawSlugInput.trim())}' ao salvar.
                                    </span>
                                ) : (
                                    <span className="text-green-600 flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3" /> Gerado a partir do título
                                    </span>
                                )}
                            </p>
                        </div>

                        {/* Summary (mantido o mesmo) */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Resumo
                            </label>
                            <textarea
                                value={summary}
                                onChange={(e) => setSummary(e.target.value)}
                                placeholder="Breve resumo da notícia (opcional)"
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                disabled={isSaving}
                            />
                        </div>

                        {/* Content - CKEditor (mantido o mesmo) */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Conteúdo *
                            </label>
                            <CKEditorComponent value={content} onChange={setContent} />
                        </div>
                    </div>

                    {/* Sidebar (mantido o mesmo) */}
                    <div className="space-y-6">
                        {/* Featured Image */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Imagem Destacada
                            </label>
                            {currentImageUrl ? (
                                <div className="relative">
                                    <img
                                        src={currentImageUrl}
                                        alt="Preview"
                                        className="w-full h-48 object-cover rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFeaturedImage(null);
                                            setCurrentImageUrl(null);
                                        }}
                                        disabled={isSaving}
                                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 disabled:opacity-50"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <label className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg ${isSaving ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-gray-50'} transition`}>
                                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                    <span className="text-sm text-gray-500">Clique para fazer upload</span>
                                    <span className="text-xs text-gray-400 mt-1">PNG, JPG até 2MB</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                        disabled={isSaving}
                                    />
                                </label>
                            )}
                        </div>

                        {/* Status */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Status
                            </label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as any)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                disabled={isSaving}
                            >
                                <option value="draft">Rascunho</option>
                                <option value="published">Publicado</option>
                                <option value="archived">Arquivado</option>
                            </select>
                        </div>

                        {/* Featured */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isFeatured}
                                    onChange={(e) => setIsFeatured(e.target.checked)}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                    disabled={isSaving}
                                />
                                <div className="flex items-center gap-2">
                                    <Star className="w-4 h-4 text-yellow-500" />
                                    <span className="text-sm font-medium text-gray-700">
                                        Notícia em Destaque
                                    </span>
                                </div>
                            </label>
                        </div>

                        {/* Display Order */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ordem de Exibição
                            </label>
                            <input
                                type="number"
                                value={displayOrder}
                                onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                                min="0"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                disabled={isSaving}
                            />
                            <p className="text-xs text-gray-500 mt-1">Menor número aparece primeiro</p>
                        </div>

                        {/* Publish Date (if editing) */}
                        {isEditing && newsData?.data?.published_at && (
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Calendar className="w-4 h-4" />
                                    <span>
                                        Publicado em{' '}
                                        {new Date(newsData.data.published_at).toLocaleDateString('pt-BR')}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default NewsForm;