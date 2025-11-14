// src/pageBuilder/layout/SettingsPanel.tsx
import React from 'react';
import { useEditor } from '@craftjs/core';

export const SettingsPanel: React.FC = () => {
  const { actions, selected, nodeProps } = useEditor((state, query) => {
    const [selectedId] = state.events.selected;
    if (!selectedId) {
      return {
        selected: null as string | null,
        nodeProps: {} as any,
      };
    }

    const node = query.node(selectedId).get();
    return {
      selected: selectedId,
      nodeProps: node.data.props as any,
    };
  });

  if (!selected) {
    return (
      <div
        style={{
          width: '280px',
          background: '#f8f9fa',
          padding: '20px',
          borderLeft: '1px solid #e5e7eb',
        }}
      >
        <div
          style={{
            background: '#e5e7eb',
            padding: '15px',
            borderRadius: '6px',
            textAlign: 'center',
          }}
        >
          <span style={{ fontSize: '48px' }}>⚙️</span>
          <p style={{ margin: '10px 0 0 0', color: '#6b7280' }}>
            Selecione um componente para editar
          </p>
        </div>
      </div>
    );
  }

  const { text, background, fontSize, color, textAlign, padding } = nodeProps;

  return (
    <div
      style={{
        width: '280px',
        background: '#f8f9fa',
        padding: '20px',
        borderLeft: '1px solid #e5e7eb',
        overflowY: 'auto',
      }}
    >
      <h3
        style={{
          margin: '0 0 20px 0',
          color: '#374151',
          fontSize: '18px',
        }}
      >
        Configurações
      </h3>

      {text !== undefined && (
        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Texto:</label>
          <textarea
            value={text}
            onChange={(e) =>
              actions.setProp(selected, (props: any) => {
                props.text = e.target.value;
              })
            }
            style={textareaStyle}
            rows={3}
          />
        </div>
      )}

      {background !== undefined && (
        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Cor de Fundo:</label>
          <input
            type="color"
            value={background}
            onChange={(e) =>
              actions.setProp(selected, (props: any) => {
                props.background = e.target.value;
              })
            }
            style={colorInputStyle}
          />
        </div>
      )}

      {fontSize !== undefined && (
        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Tamanho da Fonte: {fontSize}px</label>
          <input
            type="range"
            min="12"
            max="72"
            value={fontSize}
            onChange={(e) =>
              actions.setProp(selected, (props: any) => {
                props.fontSize = parseInt(e.target.value);
              })
            }
            style={{ width: '100%' }}
          />
        </div>
      )}

      {color !== undefined && (
        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Cor do Texto:</label>
          <input
            type="color"
            value={color}
            onChange={(e) =>
              actions.setProp(selected, (props: any) => {
                props.color = e.target.value;
              })
            }
            style={colorInputStyle}
          />
        </div>
      )}

      {textAlign !== undefined && (
        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Alinhamento:</label>
          <select
            value={textAlign}
            onChange={(e) =>
              actions.setProp(selected, (props: any) => {
                props.textAlign = e.target.value;
              })
            }
            style={selectStyle}
          >
            <option value="left">Esquerda</option>
            <option value="center">Centro</option>
            <option value="right">Direita</option>
            <option value="justify">Justificado</option>
          </select>
        </div>
      )}

      {padding !== undefined && (
        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Padding: {padding}px</label>
          <input
            type="range"
            min="0"
            max="100"
            value={padding}
            onChange={(e) =>
              actions.setProp(selected, (props: any) => {
                props.padding = parseInt(e.target.value);
              })
            }
            style={{ width: '100%' }}
          />
        </div>
      )}
    </div>
  );
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '5px',
  fontWeight: 'bold',
  color: '#374151',
};

const textareaStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px',
  border: '1px solid #d1d5db',
  borderRadius: '4px',
  resize: 'vertical',
};

const colorInputStyle: React.CSSProperties = {
  width: '100%',
  height: '40px',
  border: '1px solid #d1d5db',
  borderRadius: '4px',
};

const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px',
  border: '1px solid #d1d5db',
  borderRadius: '4px',
};
