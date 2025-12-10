<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAssociadoPrivateRequest extends FormRequest
{
    /**
     * Determina se o usuário está autorizado a fazer esta requisição
     */
    public function authorize(): bool
    {
        return $this->user() !== null; // Requer autenticação
    }

    /**
     * Regras de validação (Admin pode preencher todos os campos)
     */
    public function rules(): array
    {
        return [
            'TipoPessoa' => ['required', 'in:PF,PJ'],
            'NomeCompleto' => ['required', 'string', 'max:160'],
            'NumeroDocumento' => ['required', 'string', 'max:18', 'unique:TB_Associado,NumeroDocumento'],
            'Email' => ['required', 'email', 'max:160', 'unique:TB_Associado,Email'],
            'Telefone' => ['required', 'string', 'max:20'],
            'DtNascimento' => ['nullable', 'date', 'before:today'],
            'Sexo' => ['nullable', 'in:Feminino,Masculino,NaoBinario'],
            'Endereco' => ['nullable', 'string', 'max:160'],
            'Numero' => ['nullable', 'string', 'max:20'],
            'Complemento' => ['nullable', 'string', 'max:60'],
            'Bairro' => ['nullable', 'string', 'max:80'],
            'Cidade' => ['nullable', 'string', 'max:80'],
            'Uf' => ['nullable', 'string', 'size:2'],
            'Cep' => ['nullable', 'string', 'max:9'],
            'ValorContribuicao' => ['nullable', 'string'],
            'FormaPagamento' => ['nullable', 'in:PIX,TED,DescontoFolha,DebitoAutomatico'],
            'BancoDebito' => ['nullable', 'string', 'max:250'],
            'AgenciaDebito' => ['nullable', 'string', 'max:250'],
            'ContaDebito' => ['nullable', 'string', 'max:250'],
            'Status' => ['nullable', 'in:Pendente,Aprovado,Rejeitado'],
            'Motivo' => ['nullable', 'string'],
            'Origem' => ['nullable', 'string', 'max:40'],
            'Observacao' => ['nullable', 'string'],
            'IsConsentimentoLgpd' => ['boolean'],
        ];
    }

    /**
     * Mensagens de erro customizadas
     */
    public function messages(): array
    {
        return [
            'TipoPessoa.required' => 'Selecione o tipo de pessoa.',
            'TipoPessoa.in' => 'Tipo de pessoa inválido.',
            'NomeCompleto.required' => 'O nome completo é obrigatório.',
            'NumeroDocumento.required' => 'O CPF/CNPJ é obrigatório.',
            'NumeroDocumento.unique' => 'Este CPF/CNPJ já está cadastrado.',
            'Email.required' => 'O e-mail é obrigatório.',
            'Email.email' => 'Digite um e-mail válido.',
            'Email.unique' => 'Este e-mail já está cadastrado.',
            'Telefone.required' => 'O telefone é obrigatório.',
            'Status.in' => 'Status inválido. Use: Pendente, Aprovado ou Rejeitado.',
            'FormaPagamento.in' => 'Forma de pagamento inválida.',
        ];
    }
}