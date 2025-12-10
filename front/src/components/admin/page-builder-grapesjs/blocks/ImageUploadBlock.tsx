// src/components/admin/page-builder-grapesjs/components/MediaManager.tsx

import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Loader2, 
  Search, 
  X, 
  Image as ImageIcon,
  Trash2,
  Check,
  Grid3x3,
  List,
  Calendar,
  FileImage,
  FolderOpen,
} from 'lucide-react';
import { toast } from 'sonner';
import { useUploadMedia, useListarMedia, useDeletarMedia } from '../../../../services/midias';
import { validarTipoArquivo, validarTamanhoArquivo } from '../../../../services/midias/api';

interface MediaManagerProps {
  onSelect: (url: string) => void;
  onClose: () => void;
  allowMultiple?: boolean;
}

type ViewMode = 'grid' | 'list';

export const MediaManager: React.FC<MediaManagerProps> = ({ 
  onSelect, 
  onClose,
  allowMultiple = false 
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'gallery'>('gallery');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [uploading, setUploading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Hooks
  const uploadMutation = useUploadMedia();
  const deleteMutation = useDeletarMedia();
  const { data: mediaList, isLoading, refetch } = useListarMedia({
    type: 'image',
    per_page: 50,
    search: searchTerm || undefined,
  });

  // Upload de arquivo
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      for (const file of files) {
        // Validações
        if (!validarTipoArquivo(file)) {
          toast.error(`${file.name}: Tipo não permitido`);
          continue;
        }

        if (!validarTamanhoArquivo(file, 5)) {
          toast.error(`${file.name}: Arquivo muito grande (máx 5MB)`);
          continue;
        }

        // Upload
        const result = await uploadMutation.mutateAsync({
          file,
          category: 'page-builder',
        });

        if (result.success) {
          toast.success(`✅ ${file.name} enviado!`);
        }
      }

      // Atualiza galeria e muda pra tab gallery
      await refetch();
      setActiveTab('gallery');
    } catch (error: any) {
      toast.error('Erro no upload: ' + error.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    setUploading(true);

    try {
      for (const file of files) {
        if (!file.type.startsWith('image/')) continue;

        if (!validarTipoArquivo(file)) {
          toast.error(`${file.name}: Tipo não permitido`);
          continue;
        }

        if (!validarTamanhoArquivo(file, 5)) {
          toast.error(`${file.name}: Arquivo muito grande (máx 5MB)`);
          continue;
        }

        const result = await uploadMutation.mutateAsync({
          file,
          category: 'page-builder',
        });

        if (result.success) {
          toast.success(`✅ ${file.name} enviado!`);
        }
      }

      await refetch();
      setActiveTab('gallery');
    } catch (error: any) {
      toast.error('Erro no upload: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  // Selecionar imagem
  const handleImageClick = (url: string) => {
    if (allowMultiple) {
      const newSelected = new Set(selectedImages);
      if (newSelected.has(url)) {
        newSelected.delete(url);
      } else {
        newSelected.add(url);
      }
      setSelectedImages(newSelected);
    } else {
      onSelect(url);
      onClose();
    }
  };

  // Confirmar seleção múltipla
  const handleConfirmMultiple = () => {
    if (selectedImages.size > 0) {
      const firstUrl = Array.from(selectedImages)[0];
      onSelect(firstUrl);
      onClose();
    }
  };

  // Deletar imagem
  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm('Tem certeza que deseja deletar esta imagem?')) return;

    try {
      await deleteMutation.mutateAsync(id);
      toast.success('✅ Imagem deletada!');
      refetch();
    } catch (error) {
      toast.error('Erro ao deletar imagem');
    }
  };

  const medias = mediaList?.data?.data || [];

  // Formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Biblioteca de Mídia</h3>
              <p className="text-xs text-gray-500">Gerencie suas imagens e arquivos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs + View Toggle */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-gray-50">
          <div className="flex gap-1 p-1 bg-white rounded-lg border border-gray-200">
            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === 'gallery'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              <span className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Galeria
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-black/10">
                  {medias.length}
                </span>
              </span>
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === 'upload'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              <span className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload
              </span>
            </button>
          </div>

          {/* View Mode Toggle - só mostra na gallery */}
          {activeTab === 'gallery' && (
            <div className="flex gap-1 p-1 bg-white rounded-lg border border-gray-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all ${
                  viewMode === 'grid'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
                title="Visualização em grade"
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all ${
                  viewMode === 'list'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
                title="Visualização em lista"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {activeTab === 'upload' ? (
            <div className="p-6 max-w-2xl mx-auto">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                id="media-upload"
              />

              <label
                htmlFor="media-upload"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center w-full h-80 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
                  uploading
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                }`}
              >
                {uploading ? (
                  <div className="text-center">
                    <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
                    <p className="text-sm font-medium text-blue-600">Fazendo upload...</p>
                    <p className="text-xs text-gray-500 mt-2">Aguarde enquanto processamos suas imagens</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-10 h-10 text-white" />
                    </div>
                    <p className="text-lg font-semibold text-gray-900 mb-2">
                      Arraste e solte suas imagens aqui
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      ou clique para selecionar arquivos
                    </p>
                    <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <FileImage className="w-4 h-4" />
                        <span>PNG, JPG, GIF, WEBP, SVG</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>•</span>
                        <span>Máx 5MB por arquivo</span>
                      </div>
                    </div>
                    <p className="text-xs text-blue-500 mt-3 font-medium">
                      Aceita múltiplos arquivos simultaneamente
                    </p>
                  </div>
                )}
              </label>

              {/* Dicas */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">💡 Dicas para melhor qualidade:</h4>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• Use imagens em alta resolução para melhor qualidade</li>
                  <li>• Formatos PNG ou WebP são ideais para transparências</li>
                  <li>• Comprima suas imagens antes do upload para melhor performance</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {/* Search Bar */}
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por título ou nome do arquivo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow bg-white"
                />
              </div>

              {/* Loading */}
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-3" />
                  <p className="text-sm text-gray-500">Carregando biblioteca...</p>
                </div>
              )}

              {/* Grid View */}
              {!isLoading && medias.length > 0 && viewMode === 'grid' && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {medias.map((media) => (
                    <button
                      key={media.id}
                      onClick={() => handleImageClick(media.url)}
                      className={`relative group aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImages.has(media.url)
                          ? 'border-blue-500 ring-4 ring-blue-100 shadow-lg scale-[0.98]'
                          : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                      }`}
                      type="button"
                    >
                      {/* Imagem */}
                      <img
                        src={media.url}
                        alt={media.alt_text || media.title || 'Imagem'}
                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                      />

                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <p className="text-xs font-semibold text-white truncate mb-0.5">
                            {media.title || media.filename}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-white/80">
                            <span>{(media.size / 1024).toFixed(0)} KB</span>
                            <span>•</span>
                            <span>{media.width}x{media.height}</span>
                          </div>
                        </div>
                      </div>

                      {/* Botão deletar */}
                      <button
                        onClick={(e) => handleDelete(media.id, e)}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 hover:scale-110 shadow-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Check de seleção */}
                      {selectedImages.has(media.url) && (
                        <div className="absolute top-2 left-2 p-1.5 bg-blue-500 text-white rounded-lg shadow-lg animate-in zoom-in duration-200">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* List View */}
              {!isLoading && medias.length > 0 && viewMode === 'list' && (
                <div className="space-y-2">
                  {medias.map((media) => (
                    <button
                      key={media.id}
                      onClick={() => handleImageClick(media.url)}
                      className={`w-full flex items-center gap-4 p-3 rounded-xl border-2 transition-all ${
                        selectedImages.has(media.url)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      }`}
                      type="button"
                    >
                      {/* Thumbnail */}
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                        <img
                          src={media.url}
                          alt={media.alt_text || media.title || 'Imagem'}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 text-left min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {media.title || media.filename}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                          <span>{(media.size / 1024).toFixed(0)} KB</span>
                          <span>•</span>
                          <span>{media.width}x{media.height}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(media.created_at)}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {selectedImages.has(media.url) && (
                          <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                        <button
                          onClick={(e) => handleDelete(media.id, e)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!isLoading && medias.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                    <ImageIcon className="w-10 h-10 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {searchTerm ? 'Nenhuma imagem encontrada' : 'Sua biblioteca está vazia'}
                  </h4>
                  <p className="text-sm text-gray-500 mb-6 text-center max-w-sm">
                    {searchTerm 
                      ? 'Tente ajustar os termos de busca'
                      : 'Comece fazendo upload de suas primeiras imagens'
                    }
                  </p>
                  {!searchTerm && (
                    <button
                      onClick={() => setActiveTab('upload')}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
                    >
                      <Upload className="w-4 h-4" />
                      Fazer primeiro upload
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer - Seleção múltipla */}
        {allowMultiple && selectedImages.size > 0 && (
          <div className="border-t border-gray-200 px-6 py-4 bg-white flex items-center justify-between rounded-b-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Check className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {selectedImages.size} {selectedImages.size === 1 ? 'imagem selecionada' : 'imagens selecionadas'}
                </p>
                <p className="text-xs text-gray-500">Pronto para inserir no editor</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedImages(new Set())}
                className="px-4 py-2 text-sm font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Limpar
              </button>
              <button
                onClick={handleConfirmMultiple}
                className="px-6 py-2 text-sm font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
              >
                Inserir Seleção
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};