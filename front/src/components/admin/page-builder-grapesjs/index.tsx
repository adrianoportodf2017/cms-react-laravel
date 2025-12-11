import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'grapesjs/dist/css/grapes.min.css';

import { useGrapesEditor } from './hooks/useGrapesEditor';
import { usePageState } from './hooks/usePageState';
import { useContentLoader } from './hooks/useContentLoader';
import { usePageActions } from './hooks/usePageActions';
import { useParentPages } from './hooks/useParentPages';

import { EditorHeader } from './layout/Header';
import { EditorSidebar } from './layout/Sidebar';
import './styles/editor-custom.css';

export const GrapesPageBuilder = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // UI State
  const [showSidebar, setShowSidebar] = useState(false);

  // Editor
  const { editorRef, isEditorReady } = useGrapesEditor();

  // Page State
  const {
    pageTitle,
    setPageTitle,
    pageSlug,
    setPageSlug,
    status,
    setStatus,
    parentId,
    setParentId,
    displayOrder,
    setDisplayOrder,
    inMainMenu,
    setInMainMenu,
    isFeatured,
    setIsFeatured,
    isLoading,
    pageData,
  } = usePageState(id);

  // Content Loader
  useContentLoader({ 
    editorRef, 
    isEditorReady, 
    pageData, 
    id 
  });

  // Parent Pages Options
  const { parentOptions } = useParentPages(id);

  // Page Actions
  const {
    handleSave,
    handleSaveDraft,
    handlePublish,
    handleArchive,
    handleDuplicate,
    isSaving,
  } = usePageActions({
    id,
    editorRef,
    isEditorReady,
    pageTitle,
    pageSlug,
    status,
    setStatus,
    isFeatured,
    displayOrder,
    inMainMenu,
    parentId,
  });

  // Loading State
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p>Carregando editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <EditorHeader
        pageTitle={pageTitle}
        pageId={id}
        status={status}
        isEditorReady={isEditorReady}
        isSaving={isSaving}
        authorName={pageData?.data?.author_name || undefined}
        showSidebar={showSidebar}
        onBack={() => navigate('/admin/pages')}
        onSave={handleSave}
        onToggleSidebar={() => setShowSidebar(!showSidebar)}
      />

      <div className="flex-1 flex  ">
        {/* Editor Canvas */}
        <div className="flex-1">
          <div 
            id="gjs" 
            className="h-full " 
            style={{ minHeight: '500px', background: '#f8f9fa' }} 
          />
        </div>

        {/* Sidebar */}
        <EditorSidebar
          show={showSidebar}
          pageId={id}
          status={status}
          pageTitle={pageTitle}
          setPageTitle={setPageTitle}
          pageSlug={pageSlug}
          setPageSlug={setPageSlug}
          parentId={parentId}
          setParentId={setParentId}
          displayOrder={displayOrder}
          setDisplayOrder={setDisplayOrder}
          inMainMenu={inMainMenu}
          setInMainMenu={setInMainMenu}
          isFeatured={isFeatured}
          setIsFeatured={setIsFeatured}
          parentOptions={parentOptions}
          onClose={() => setShowSidebar(false)}
          onSave={handleSave}
          onSaveDraft={handleSaveDraft}
          onPublish={handlePublish}
          onArchive={handleArchive}
          onDuplicate={handleDuplicate}
          isSaving={isSaving}
          canPublish={!!pageTitle && !!pageSlug}
          canArchive={status === 'published'}
        />
      </div>
    </div>
  );
};