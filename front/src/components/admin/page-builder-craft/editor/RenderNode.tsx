// src/pageBuilder/editor/RenderNode.tsx
import { useNode, useEditor } from '@craftjs/core';
import { ROOT_NODE } from '@craftjs/utils';
import React, { useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

const IndicatorDiv = styled.div`
  height: 30px;
  margin-top: -29px;
  font-size: 12px;
  line-height: 12px;
  display: flex;
  align-items: center;
  padding: 4px 8px;
  background: #2563eb;
  color: #fff;
  border-radius: 4px;

  h2 {
    font-size: 12px;
    margin: 0;
  }
`;

const Btn = styled.button`
  padding: 0 4px;
  opacity: 0.9;
  display: flex;
  align-items: center;
  border: none;
  background: transparent;
  cursor: pointer;

  img {
    width: 15px;
    height: 15px;
    display: block;
  }
`;

type RenderNodeProps = {
  render: React.ReactElement;
};

export const RenderNode: React.FC<RenderNodeProps> = ({ render }) => {
  const { id } = useNode();
  const { actions, query, isActive } = useEditor((state, query) => ({
    isActive: query.getEvent('selected').contains(id),
  }));

  const {
    isHover,
    dom,
    name,
    moveable,
    deletable,
    connectors: { drag },
    parent,
  } = useNode((node) => ({
    isHover: node.events.hovered,
    dom: node.dom as HTMLElement | null,
    name: node.data.custom.displayName || node.data.displayName,
    moveable: query.node(node.id).isDraggable(),
    deletable: query.node(node.id).isDeletable(),
    parent: node.data.parent,
  }));

  const currentRef = useRef<HTMLDivElement | null>(null);

  // adiciona ou remove a classe de seleção no DOM do node
  useEffect(() => {
    if (!dom) return;

    if (isActive || isHover) {
      dom.classList.add('component-selected');
    } else {
      dom.classList.remove('component-selected');
    }
  }, [dom, isActive, isHover]);

  const getPos = useCallback((el: HTMLElement | null) => {
    if (!el) {
      return { top: '0px', left: '0px' };
    }
    const { top, left, bottom } = el.getBoundingClientRect();
    return {
      top: `${top > 0 ? top : bottom}px`,
      left: `${left}px`,
    };
  }, []);

  const scroll = useCallback(() => {
    const currentDOM = currentRef.current;
    if (!currentDOM || !dom) return;

    const { top, left } = getPos(dom);
    currentDOM.style.top = top;
    currentDOM.style.left = left;
  }, [dom, getPos]);

  // atualizar posição ao scroll / resize
  useEffect(() => {
    const scrollContainer = document.querySelector(
      '.craftjs-renderer'
    ) as HTMLElement | null;

    if (!scrollContainer) return;

    scrollContainer.addEventListener('scroll', scroll);
    window.addEventListener('resize', scroll);

    return () => {
      scrollContainer.removeEventListener('scroll', scroll);
      window.removeEventListener('resize', scroll);
    };
  }, [scroll]);

  const portalTarget =
    (typeof document !== 'undefined' &&
      document.querySelector('.page-container')) ||
    null;

  return (
    <>
      {portalTarget && (isHover || isActive)
        ? ReactDOM.createPortal(
            <IndicatorDiv
              ref={currentRef}
              style={{
                left: getPos(dom as HTMLElement | null).left,
                top: getPos(dom as HTMLElement | null).top,
                position: 'fixed',
                zIndex: 9999,
              }}
            >
              <h2 className="flex-1 mr-4">{name}</h2>

              {moveable && (
                <Btn ref={drag as any} title="Mover">
                  <img src="/icons/move.svg" alt="Mover" />
                </Btn>
              )}

              {id !== ROOT_NODE && (
                <Btn
                  title="Selecionar pai"
                  onClick={(e) => {
                    e.stopPropagation();
                    actions.selectNode(parent);
                  }}
                >
                  <img src="/icons/arrow-up.svg" alt="Subir" />
                </Btn>
              )}

              {deletable && (
                <Btn
                  title="Remover"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    actions.delete(id);
                  }}
                >
                  <img src="/icons/delete.svg" alt="Remover" />
                </Btn>
              )}
            </IndicatorDiv>,
            portalTarget
          )
        : null}
      {render}
    </>
  );
};
