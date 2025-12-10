// src/services/associados/mutation.ts

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  AssociadoResponse,
  AssociadoListResponse,
  CreateAssociadoPublicDto,
  CreateAssociadoPrivateDto,
  UpdateAssociadoDto,
  StatusAssociado,
} from '../../types/associado.types';
import {
  CriarAssociadoPublico,
  CriarAssociadoPrivado,
  ListarAssociados,
  ObterAssociadoPorId,
  AtualizarAssociado,
  DeletarAssociado,
} from './api';

/**
 * Hook para criar associado via formulário PÚBLICO
 */
export const useCriarAssociadoPublico = () => {
  return useMutation<AssociadoResponse, Error, CreateAssociadoPublicDto>({
    mutationFn: CriarAssociadoPublico,
  });
};

/**
 * Hook para criar associado via painel PRIVADO (admin)
 */
export const useCriarAssociadoPrivado = () => {
  const queryClient = useQueryClient();
  
  return useMutation<AssociadoResponse, Error, CreateAssociadoPrivateDto>({
    mutationFn: CriarAssociadoPrivado,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['associados'] });
    },
  });
};

/**
 * Hook para atualizar um associado (admin)
 */
export const useAtualizarAssociado = () => {
  const queryClient = useQueryClient();
  
  return useMutation<AssociadoResponse, Error, { id: number; data: UpdateAssociadoDto }>({
    mutationFn: ({ id, data }) => AtualizarAssociado(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['associado', data.data.id] });
      queryClient.invalidateQueries({ queryKey: ['associados'] });
    },
  });
};

/**
 * Hook para deletar um associado (admin)
 */
export const useDeletarAssociado = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, number>({
    mutationFn: DeletarAssociado,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['associados'] });
    },
  });
};

/**
 * Hook para buscar um associado por ID (admin)
 */
export const useObterAssociadoPorId = (id: number, enabled = true) => {
  return useQuery<AssociadoResponse, Error>({
    queryKey: ['associado', id],
    queryFn: () => ObterAssociadoPorId(id),
    enabled: enabled && !!id,
  });
};

/**
 * Hook para listar associados com filtros (admin)
 */
export const useListarAssociados = (params?: {
  page?: number;
  por_pagina?: number;
  nome?: string;
  cpf?: string;
  email?: string;
  status?: StatusAssociado;
  data_cadastro?: string;
  data_inicio?: string;
  data_fim?: string;
  ordem?: string;
  direcao?: 'asc' | 'desc';
}) => {
  return useQuery<AssociadoListResponse, Error>({
    queryKey: ['associados', params],
    queryFn: () => ListarAssociados(params),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};