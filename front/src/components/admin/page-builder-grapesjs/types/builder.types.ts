export interface EditorHeaderProps {
  pageTitle: string;
  status: 'draft' | 'published' | 'archived';
  isEditorReady: boolean;
  onBack: () => void;
  onSave: () => void;
  onToggleSidebar: () => void;
}

export interface EditorSidebarProps {
  show: boolean;
  inMainMenu: boolean;
  isFeatured: boolean;
  displayOrder: number;
  status: 'draft' | 'published' | 'archived';
  onClose: () => void;
  onInMainMenuChange: (value: boolean) => void;
  onIsFeaturedChange: (value: boolean) => void;
  onDisplayOrderChange: (value: number) => void;
  onStatusChange: (value: 'draft' | 'published' | 'archived') => void;
}

export interface EditorFieldsProps {
  pageTitle: string;
  pageSlug: string;
  onPageTitleChange: (value: string) => void;
  onPageSlugChange: (value: string) => void;
}