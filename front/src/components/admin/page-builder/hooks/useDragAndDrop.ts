import { useEffect, useState } from 'react';
import { Editor } from '@tiptap/react';

export const useDragAndDrop = (editor: Editor | null, showOutline: boolean) => {
  const [draggedElement, setDraggedElement] = useState<HTMLElement | null>(null);
  const [dragOverElement, setDragOverElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!showOutline || !editor) return;

    const editorElement = editor.view.dom;
    
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      if (target.matches('div:not(.ProseMirror):not([data-type="bulletList"]):not([data-type="orderedList"])')) {
        setDraggedElement(target);
        target.classList.add('draggable');
        e.dataTransfer?.setData('text/html', target.outerHTML);
        e.dataTransfer!.effectAllowed = 'move';
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      const target = e.target as HTMLElement;
      
      if (target.matches('div:not(.ProseMirror):not([data-type="bulletList"]):not([data-type="orderedList"])')) {
        setDragOverElement(target);
        target.classList.add('drag-over');
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      target.classList.remove('drag-over');
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      const target = e.target as HTMLElement;
      
      if (draggedElement && target.matches('div:not(.ProseMirror):not([data-type="bulletList"]):not([data-type="orderedList"])')) {
        alert(`🎯 Elemento movido para: ${target.className}`);
        
        draggedElement.classList.remove('draggable');
        target.classList.remove('drag-over');
        setDraggedElement(null);
        setDragOverElement(null);
      }
    };

    const handleDragEnd = () => {
      if (draggedElement) {
        draggedElement.classList.remove('draggable');
      }
      if (dragOverElement) {
        dragOverElement.classList.remove('drag-over');
      }
      setDraggedElement(null);
      setDragOverElement(null);
    };

    editorElement.addEventListener('dragstart', handleDragStart);
    editorElement.addEventListener('dragover', handleDragOver);
    editorElement.addEventListener('dragleave', handleDragLeave);
    editorElement.addEventListener('drop', handleDrop);
    editorElement.addEventListener('dragend', handleDragEnd);

    const draggableElements = editorElement.querySelectorAll('div:not(.ProseMirror):not([data-type="bulletList"]):not([data-type="orderedList"])');
    draggableElements.forEach(el => {
      (el as HTMLElement).draggable = true;
    });

    return () => {
      editorElement.removeEventListener('dragstart', handleDragStart);
      editorElement.removeEventListener('dragover', handleDragOver);
      editorElement.removeEventListener('dragleave', handleDragLeave);
      editorElement.removeEventListener('drop', handleDrop);
      editorElement.removeEventListener('dragend', handleDragEnd);
    };
  }, [showOutline, editor, draggedElement, dragOverElement]);

  return { draggedElement, dragOverElement };
};