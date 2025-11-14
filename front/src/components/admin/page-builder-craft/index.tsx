// src/pageBuilder/index.tsx
import React from 'react';
import { Editor, Frame, Element } from '@craftjs/core';

import { craftResolver } from './config/craftResolver';
import { Topbar, Sidebar, SettingsPanel } from './layout';
import { Container, Text, Button } from './blocks';
import { RenderNode } from './editor'; // <= importante

export const PageBuilder: React.FC = () => {
  return (
    <div
      className="page-container"
      style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      <Editor
        resolver={craftResolver}
        onRender={RenderNode} // <= aqui plugamos o RenderNode
      >
        <Topbar />

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <Sidebar />

          {/* Canvas com GRID */}
          <div
            className="craftjs-renderer" // <= ESSA classe o RenderNode usa pra ouvir scroll
            style={{
              flex: 1,
              padding: '20px',
              background: '#f5f5f5',
              overflow: 'auto',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                maxWidth: '1200px',
                width: '100%',
                minHeight: '100%',
                backgroundImage: `
                  linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                  linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
                `,
                backgroundSize: '8px 8px',
              }}
            >
              <Frame>
                <Element is={Container} canvas>
                  <Text text="Bem-vindo ao seu editor! Arraste componentes da sidebar." />
                  <Element is={Container} canvas>
                    <Text text="Container interno com texto editável" />
                    <Button text="Botão Exemplo" />
                  </Element>
                </Element>
              </Frame>
            </div>
          </div>

          <SettingsPanel />
        </div>
      </Editor>
    </div>
  );
};

export default PageBuilder;
