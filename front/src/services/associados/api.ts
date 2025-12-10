// src/services/associados/api.ts

import { axiosConfig } from '../../lib/axios';
import type {
  AssociadoResponse,
  AssociadoListResponse,
  CreateAssociadoPublicDto,
  CreateAssociadoPrivateDto,
  UpdateAssociadoDto,
  TipoPessoa,
  StatusAssociado,
  FormaPagamento,
} from '../../types/associado.types';

/**
 * Cadastro PÚBLICO de associado (formulário do site)
 */
export const CriarAssociadoPublico = async (
  data: CreateAssociadoPublicDto
): Promise<AssociadoResponse> => {
  const response = await axiosConfig.post<AssociadoResponse>('/associados/public', data);
  return response.data;
};

/**
 * Cadastro PRIVADO de associado (painel admin)
 */
export const CriarAssociadoPrivado = async (
  data: CreateAssociadoPrivateDto
): Promise<AssociadoResponse> => {
  const response = await axiosConfig.post<AssociadoResponse>('/admin/associados', data);
  return response.data;
};

/**
 * Lista associados com filtros (apenas admin)
 */
export const ListarAssociados = async (params?: {
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
}): Promise<AssociadoListResponse> => {
  const response = await axiosConfig.get<AssociadoListResponse>('/admin/associados', { params });
  return response.data;
};

/**
 * Busca um associado por ID (apenas admin)
 */
export const ObterAssociadoPorId = async (id: number): Promise<AssociadoResponse> => {
  const response = await axiosConfig.get<AssociadoResponse>(`/admin/associados/${id}`);
  return response.data;
};

/**
 * Atualiza um associado (apenas admin)
 */
export const AtualizarAssociado = async (
  id: number,
  data: UpdateAssociadoDto
): Promise<AssociadoResponse> => {
  const response = await axiosConfig.put<AssociadoResponse>(`/admin/associados/${id}`, data);
  return response.data;
};

/**
 * Deleta um associado (soft delete - apenas admin)
 */
export const DeletarAssociado = async (id: number): Promise<void> => {
  await axiosConfig.delete(`/admin/associados/${id}`);
};

/**
 * Validações e operações auxiliares
 */

/**
 * Valida CPF
 */
export const validarCPF = (cpf: string): boolean => {
  cpf = cpf.replace(/[^\d]+/g, '');
  
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  
  let soma = 0;
  let resto;
  
  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;
  
  soma = 0;
  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  
  return resto === parseInt(cpf.substring(10, 11));
};

/**
 * Valida CNPJ
 */
export const validarCNPJ = (cnpj: string): boolean => {
  cnpj = cnpj.replace(/[^\d]+/g, '');
  
  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;
  
  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  const digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;
  
  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(0))) return false;
  
  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  
  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  return resultado === parseInt(digitos.charAt(1));
};

/**
 * Valida CPF ou CNPJ baseado no tipo
 */
export const validarDocumento = (documento: string, tipo: TipoPessoa): boolean => {
  if (tipo === 'PF') {
    return validarCPF(documento);
  } else {
    return validarCNPJ(documento);
  }
};

/**
 * Formata CPF
 */
export const formatarCPF = (cpf: string): string => {
  cpf = cpf.replace(/\D/g, '');
  cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
  cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
  cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  return cpf;
};

/**
 * Formata CNPJ
 */
export const formatarCNPJ = (cnpj: string): string => {
  cnpj = cnpj.replace(/\D/g, '');
  cnpj = cnpj.replace(/^(\d{2})(\d)/, '$1.$2');
  cnpj = cnpj.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
  cnpj = cnpj.replace(/\.(\d{3})(\d)/, '.$1/$2');
  cnpj = cnpj.replace(/(\d{4})(\d)/, '$1-$2');
  return cnpj;
};

/**
 * Formata CEP
 */
export const formatarCEP = (cep: string): string => {
  cep = cep.replace(/\D/g, '');
  cep = cep.replace(/^(\d{5})(\d)/, '$1-$2');
  return cep;
};

/**
 * Formata Telefone
 */
export const formatarTelefone = (telefone: string): string => {
  telefone = telefone.replace(/\D/g, '');
  
  if (telefone.length <= 10) {
    telefone = telefone.replace(/(\d{2})(\d)/, '($1) $2');
    telefone = telefone.replace(/(\d{4})(\d)/, '$1-$2');
  } else {
    telefone = telefone.replace(/(\d{2})(\d)/, '($1) $2');
    telefone = telefone.replace(/(\d{5})(\d)/, '$1-$2');
  }
  
  return telefone;
};

/**
 * Remove formatação de documento
 */
export const removerFormatacao = (valor: string): string => {
  return valor.replace(/\D/g, '');
};

/**
 * Busca CEP na API ViaCEP
 */
export const buscarCEP = async (cep: string) => {
  const cepLimpo = removerFormatacao(cep);
  
  if (cepLimpo.length !== 8) {
    throw new Error('CEP inválido');
  }
  
  const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
  const data = await response.json();
  
  if (data.erro) {
    throw new Error('CEP não encontrado');
  }
  
  return {
    logradouro: data.logradouro || '',
    bairro: data.bairro || '',
    cidade: data.localidade || '',
    uf: data.uf || '',
  };
};

/**
 * Valida email
 */
export const validarEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Valida data de nascimento (maior de 18 anos)
 */
export const validarIdade = (dataNascimento: string, idadeMinima: number = 18): boolean => {
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  const idade = hoje.getFullYear() - nascimento.getFullYear();
  const mes = hoje.getMonth() - nascimento.getMonth();
  
  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    return idade - 1 >= idadeMinima;
  }
  
  return idade >= idadeMinima;
};