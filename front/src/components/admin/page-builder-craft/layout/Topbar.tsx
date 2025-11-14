// src/pageBuilder/layout/Topbar.tsx
import React from 'react';
import { useEditor } from '@craftjs/core';

export const Topbar: React.FC = () => {
  const { actions, enabled } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  return (
    <div
      style={{
        background: '#1f2937',
        color: 'white',
        padding: '10px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <h2 style={{ margin: 0 }}>🚀 Meu CMS</h2>

      <button
        onClick={() =>
          actions.setOptions((options) => {
            options.enabled = !enabled;
          })
        }
        style={{
          background: enabled ? '#ef4444' : '#10b981',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        {enabled ? '🔒 Desativar' : '✏️ Ativar'}
      </button>
    </div>
  );
};
