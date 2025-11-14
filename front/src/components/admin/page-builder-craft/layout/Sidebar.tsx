// src/pageBuilder/layout/Sidebar.tsx
import React from 'react';
import { useEditor, Element } from '@craftjs/core';
import { Container, Text, Image, Button, Hero, Card } from '../blocks';

export const Sidebar: React.FC = () => {
  const { connectors } = useEditor();

  return (
    <div
      style={{
        width: '250px',
        background: '#1f2937',
        color: 'white',
        padding: '20px',
        overflowY: 'auto',
      }}
    >
      <h3 style={{ marginTop: 0 }}>📦 Componentes</h3>
      <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '20px' }}>
        Arraste para o canvas →
      </p>

      <button
        ref={(ref) =>
          ref && connectors.create(ref, <Element is={Container} canvas />)
        }
        style={btnStyle}
      >
        📦 Container
      </button>

      <button
        ref={(ref) => ref && connectors.create(ref, <Text text="Novo texto" />)}
        style={btnStyle}
      >
        📝 Texto
      </button>

      <button
        ref={(ref) => ref && connectors.create(ref, <Image />)}
        style={btnStyle}
      >
        🖼️ Imagem
      </button>

      <button
        ref={(ref) => ref && connectors.create(ref, <Button />)}
        style={btnStyle}
      >
        🔘 Botão
      </button>

      <button
        ref={(ref) => ref && connectors.create(ref, <Hero />)}
        style={btnStyle}
      >
        🎯 Hero Section
      </button>

      <button
        ref={(ref) => ref && connectors.create(ref, <Card />)}
        style={btnStyle}
      >
        🃏 Card
      </button>

      <div
        style={{
          marginTop: '30px',
          padding: '15px',
          background: '#374151',
          borderRadius: '6px',
          fontSize: '12px',
          color: '#9ca3af',
        }}
      >
        <strong style={{ color: 'white' }}>💡 Dicas:</strong>
        <ul style={{ marginLeft: '15px', marginTop: '10px' }}>
          <li>Arraste componentes da sidebar</li>
          <li>Clique no texto para editar</li>
          <li>Selecione para redimensionar</li>
          <li>Use o painel de configurações</li>
          <li>Salve o JSON quando terminar</li>
        </ul>
      </div>
    </div>
  );
};

const btnStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  margin: '10px 0',
  background: '#374151',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'grab',
  fontSize: '14px',
  textAlign: 'left',
};
