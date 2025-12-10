import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ObterPaginaPorSlug } from '../../services/pages';
import { initCfDynamicForms } from '../../lib/cfDynamicForms';

function normalizePath(pathname: string) {
  // remove "/" inicial e final
  return pathname.replace(/^\/+|\/+$/g, '');
}

export default function PublicPage() {
  const { pathname } = useLocation();
  const fullPath = normalizePath(pathname); // ex: "sobre-nos/historia-e-ideologia"
  const lastSegment = fullPath.split('/').filter(Boolean).pop() || '';

  const containerRef = useRef<HTMLDivElement | null>(null);

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['cms-page', fullPath],
    queryFn: async () => {
      // 1) tenta path completo (caso backend aceite slugs com "/")
      try {
        return await ObterPaginaPorSlug(fullPath);
      } catch {
        // 2) fallback: tenta último segmento (slugs únicos)
        if (!lastSegment || lastSegment === fullPath) throw new Error('not-found');
        return await ObterPaginaPorSlug(lastSegment);
      }
    },
  });

  // Quando o conteúdo HTML mudar, inicializa os formulários dinâmicos
  useEffect(() => {
    if (!data) return;
    if (!containerRef.current) return;

    initCfDynamicForms(containerRef.current);
  }, [data]);

  if (!fullPath) {
    // Caso seja a home ("/"), quem renderiza é a rota index do Layout.
    return null;
  }

  if (isLoading || isFetching) {
    return (
      <div className="mx-auto max-w-[900px] px-4 py-10">
        <div className="h-6 w-40 animate-pulse rounded bg-gray-200 mb-6" />
        <div className="space-y-3">
          <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-[900px] px-4 py-10">
        <h1 className="text-2xl font-semibold mb-2">Página não encontrada</h1>
        <p className="text-gray-600 mb-6">
          Não foi possível localizar este conteúdo. {error instanceof Error ? error.message : null}
        </p>
        <button
          onClick={() => refetch()}
          className="rounded-full bg-black px-5 py-2 text-white hover:opacity-90"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <article className="mx-auto w-full">
      <div
        ref={containerRef}
        dangerouslySetInnerHTML={{ __html: data.data.content?.html ?? '' }}
      />
    </article>
  );
}
