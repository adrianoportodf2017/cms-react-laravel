// src/components/admin/page-builder-grapesjs/components/MediaManager.tsx

import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Loader2, 
  Search, 
  X, 
  Image as ImageIcon,
  Trash2,
  Check
} from 'lucide-react';
import { toast } from 'sonner';
import { useUploadMedia, useListarMedia, useDeletarMedia } from '../../../../services/midias';
import { validarTipoArquivo, validarTamanhoArquivo } from '../../../../services/midias/api';

interface MediaManagerProps {
  onSelect: (url: string) => void;
  onClose: () => void;
  allowMultiple?: boolean;
}

export const MediaManager: React.FC<MediaManagerProps> = ({ 
  onSelect, 
  onClose,
  allowMultiple = false 
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'gallery'>('gallery');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [uploading, setUploading] = useState(false);
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
      // Por enquanto, pega a primeira
      // Depois você pode adaptar pra inserir múltiplas
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Gerenciar Mídias</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('gallery')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition ${
              activeTab === 'gallery'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            📂 Galeria ({medias.length})
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition ${
              activeTab === 'upload'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            📤 Upload
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'upload' ? (
            <div className="space-y-4">
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
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition"
              >
                {uploading ? (
                  <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-gray-400 mb-3" />
                    <span className="text-sm font-medium text-gray-700">
                      Clique para fazer upload ou arraste arquivos
                    </span>
                    <span className="text-xs text-gray-500 mt-2">
                      PNG, JPG, GIF, WEBP, SVG (máx 5MB)
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      Aceita múltiplos arquivos
                    </span>
                  </>
                )}
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por título ou nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Gallery Grid */}
              {isLoading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
              )}

              {!isLoading && medias.length > 0 && (
                <div className="grid grid-cols-4 gap-3">
                  {medias.map((media) => (
                    <button
                      key={media.id}
                      onClick={() => handleImageClick(media.url)}
                      aria-pressed={selectedImages.has(media.url)}
                      className={`relative group aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                        selectedImages.has(media.url)
                          ? 'border-blue-500 ring-2 ring-blue-200'
                          : 'border-transparent hover:border-blue-300'
                      }`}
                      type="button"
                    >
                      {/* Imagem */}
                      <img
                        src={media.url}
                        alt={media.alt_text || media.title || 'Imagem'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />

                      {/* Info on hover (sem overlay preto) */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-xs font-medium text-white truncate">
                          {media.title || media.filename}
                        </p>
                        <p className="text-xs text-white opacity-75">
                          {(media.size / 1024).toFixed(1)} KB
                        </p>
                      </div>

                      {/* Botão deletar */}
                      <button
                        onClick={(e) => handleDelete(media.id, e)}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>

                      {/* Check de seleção */}
                      {selectedImages.has(media.url) && (
                        <div className="absolute top-2 left-2 p-1 bg-blue-500 text-white rounded-full">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {!isLoading && medias.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12">
                  <ImageIcon className="w-12 h-12 text-gray-300 mb-3" />
                  <p className="text-gray-500 text-sm">
                    {searchTerm ? 'Nenhuma imagem encontrada' : 'Nenhuma imagem na galeria'}
                  </p>
                  <button
                    onClick={() => setActiveTab('upload')}
                    className="mt-3 text-blue-500 hover:text-blue-600 text-sm font-medium"
                  >
                    Fazer primeiro upload →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer - Só aparece se allowMultiple */}
        {allowMultiple && selectedImages.size > 0 && (
          <div className="border-t p-4 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {selectedImages.size} imagem(ns) selecionada(s)
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedImages(new Set())}
                className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 transition"
              >
                Limpar
              </button>
              <button
                onClick={handleConfirmMultiple}
                className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                Inserir
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};