// src/types/associado.types.ts

/**
 * Tipos básicos
 */
export type TipoPessoa = 'PF' | 'PJ';
export type StatusAssociado = 'Pendente' | 'Aprovado' | 'Rejeitado';
export type FormaPagamento = 'PIX' | 'TED' | 'DescontoFolha' | 'DebitoAutomatico';
export type Sexo = 'Feminino' | 'Masculino' | 'NaoBinario';

/**
 * Interface do Associado
 */
export interface Associado {
  id: number;
  TipoPessoa: TipoPessoa;
  NomeCompleto: string;
  NumeroDocumento: string;
  Email: string;
  Telefone: string;
  DtNascimento?: string | null;
  Sexo?: Sexo | null;
  Endereco?: string | null;
  Numero?: string | null;
  Complemento?: string | null;
  Bairro?: string | null;
  Cidade?: string | null;
  Uf?: string | null;
  Cep?: string | null;
  ValorContribuicao?: string | null;
  FormaPagamento?: FormaPagamento | null;
  BancoDebito?: string | null;
  AgenciaDebito?: string | null;
  ContaDebito?: string | null;
  Status: StatusAssociado;
  Motivo?: string | null;
  Origem?: string | null;
  Observacao?: string | null;
  IsConsentimentoLgpd: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

/**
 * DTO para criar associado PÚBLICO (formulário do site)
 */
export interface CreateAssociadoPublicDto {
  TipoPessoa: TipoPessoa;
  NomeCompleto: string;
  NumeroDocumento: string;
  Email: string;
  Telefone: string;
  DtNascimento?: string;
  Sexo?: Sexo;
  Endereco: string;
  Bairro: string;
  Uf: string;
  Cep: string;
  ValorContribuicao: string;
  FormaPagamento: FormaPagamento;
  BancoDebito?: string;
  AgenciaDebito?: string;
  ContaDebito?: string;
  IsConsentimentoLgpd: boolean;
}

/**
 * DTO para criar associado PRIVADO (painel admin)
 */
export interface CreateAssociadoPrivateDto {
  TipoPessoa: TipoPessoa;
  NomeCompleto: string;
  NumeroDocumento: string;
  Email: string;
  Telefone: string;
  DtNascimento?: string | null;
  Sexo?: Sexo | null;
  Endereco?: string | null;
  Numero?: string | null;
  Complemento?: string | null;
  Bairro?: string | null;
  Cidade?: string | null;
  Uf?: string | null;
  Cep?: string | null;
  ValorContribuicao?: string | null;
  FormaPagamento?: FormaPagamento | null;
  BancoDebito?: string | null;
  AgenciaDebito?: string | null;
  ContaDebito?: string | null;
  Status?: StatusAssociado;
  Motivo?: string | null;
  Origem?: string | null;
  Observacao?: string | null;
  IsConsentimentoLgpd?: boolean;
}

/**
 * DTO para atualizar associado (admin)
 */
export interface UpdateAssociadoDto {
  TipoPessoa?: TipoPessoa;
  NomeCompleto?: string;
  NumeroDocumento?: string;
  Email?: string;
  Telefone?: string;
  DtNascimento?: string | null;
  Sexo?: Sexo | null;
  Endereco?: string | null;
  Numero?: string | null;
  Complemento?: string | null;
  Bairro?: string | null;
  Cidade?: string | null;
  Uf?: string | null;
  Cep?: string | null;
  ValorContribuicao?: string | null;
  FormaPagamento?: FormaPagamento | null;
  BancoDebito?: string | null;
  AgenciaDebito?: string | null;
  ContaDebito?: string | null;
  Status?: StatusAssociado;
  Motivo?: string | null;
  Origem?: string | null;
  Observacao?: string | null;
  IsConsentimentoLgpd?: boolean;
}

/**
 * Response de uma operação com associado
 */
export interface AssociadoResponse {
  data: Associado;
  mensagem?: string;
}

/**
 * Response de listagem de associados
 */
export interface AssociadoListResponse {
  data: Associado[];
  meta: {
    total: number;
    por_pagina: number;
    pagina_atual: number;
    ultima_pagina: number;
    de: number | null;
    ate: number | null;
  };
  links: {
    primeiro: string | null;
    anterior: string | null;
    proximo: string | null;
    ultimo: string | null;
  };
}

/**
 * Opções para selects
 */
export const TipoPessoaOptions = [
  { value: 'PF', label: 'Pessoa Física' },
  { value: 'PJ', label: 'Pessoa Jurídica' },
] as const;

export const StatusAssociadoOptions = [
  { value: 'Pendente', label: 'Pendente' },
  { value: 'Aprovado', label: 'Aprovado' },
  { value: 'Rejeitado', label: 'Rejeitado' },
] as const;

export const FormaPagamentoOptions = [
  { value: 'PIX', label: 'PIX' },
  { value: 'TED', label: 'TED/Transferência' },
  { value: 'DescontoFolha', label: 'Desconto em Folha' },
  { value: 'DebitoAutomatico', label: 'Débito Automático' },
] as const;

export const SexoOptions = [
  { value: 'Feminino', label: 'Feminino' },
  { value: 'Masculino', label: 'Masculino' },
  { value: 'NaoBinario', label: 'Não binário' },
] as const;

export const UFOptions = [
  { value: 'AC', label: 'AC' },
  { value: 'AL', label: 'AL' },
  { value: 'AP', label: 'AP' },
  { value: 'AM', label: 'AM' },
  { value: 'BA', label: 'BA' },
  { value: 'CE', label: 'CE' },
  { value: 'DF', label: 'DF' },
  { value: 'ES', label: 'ES' },
  { value: 'GO', label: 'GO' },
  { value: 'MA', label: 'MA' },
  { value: 'MT', label: 'MT' },
  { value: 'MS', label: 'MS' },
  { value: 'MG', label: 'MG' },
  { value: 'PA', label: 'PA' },
  { value: 'PB', label: 'PB' },
  { value: 'PR', label: 'PR' },
  { value: 'PE', label: 'PE' },
  { value: 'PI', label: 'PI' },
  { value: 'RJ', label: 'RJ' },
  { value: 'RN', label: 'RN' },
  { value: 'RS', label: 'RS' },
  { value: 'RO', label: 'RO' },
  { value: 'RR', label: 'RR' },
  { value: 'SC', label: 'SC' },
  { value: 'SP', label: 'SP' },
  { value: 'SE', label: 'SE' },
  { value: 'TO', label: 'TO' },
] as const;