<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAssociadoRequest extends FormRequest
{
    /**
     * Determina se o usuário está autorizado a fazer esta requisição
     */
    public function authorize(): bool
    {
        return $this->user() !== null; // Requer autenticação
    }

    /**
     * Regras de validação para atualização
     */
    public function rules(): array
    {
        $associadoId = $this->route('id'); // Pega o ID da rota

        return [
            'TipoPessoa' => ['sometimes', 'in:PF,PJ'],
            'NomeCompleto' => ['sometimes', 'string', 'max:160'],
            'NumeroDocumento' => [
                'sometimes',
                'string',
                'max:18',
                Rule::unique('TB_Associado', 'NumeroDocumento')->ignore($associadoId)
            ],
            'Email' => [
                'sometimes',
                'email',
                'max:160',
                Rule::unique('TB_Associado', 'Email')->ignore($associadoId)
            ],
            'Telefone' => ['sometimes', 'string', 'max:20'],
            'DtNascimento' => ['sometimes', 'nullable', 'date', 'before:today'],
            'Sexo' => ['sometimes', 'nullable', 'in:Feminino,Masculino,NaoBinario'],
            'Endereco' => ['sometimes', 'nullable', 'string', 'max:160'],
            'Numero' => ['sometimes', 'nullable', 'string', 'max:20'],
            'Complemento' => ['sometimes', 'nullable', 'string', 'max:60'],
            'Bairro' => ['sometimes', 'nullable', 'string', 'max:80'],
            'Cidade' => ['sometimes', 'nullable', 'string', 'max:80'],
            'Uf' => ['sometimes', 'nullable', 'string', 'size:2'],
            'Cep' => ['sometimes', 'nullable', 'string', 'max:9'],
            'ValorContribuicao' => ['sometimes', 'nullable', 'string'],
            'FormaPagamento' => ['sometimes', 'nullable', 'in:PIX,TED,DescontoFolha,DebitoAutomatico'],
            'BancoDebito' => ['sometimes', 'nullable', 'string', 'max:250'],
            'AgenciaDebito' => ['sometimes', 'nullable', 'string', 'max:250'],
            'ContaDebito' => ['sometimes', 'nullable', 'string', 'max:250'],
            'Status' => ['sometimes', 'in:Pendente,Aprovado,Rejeitado'],
            'Motivo' => ['sometimes', 'nullable', 'string'],
            'Origem' => ['sometimes', 'nullable', 'string', 'max:40'],
            'Observacao' => ['sometimes', 'nullable', 'string'],
            'IsConsentimentoLgpd' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * Mensagens de erro customizadas
     */
    public function messages(): array
    {
        return [
            'TipoPessoa.in' => 'Tipo de pessoa inválido.',
            'NumeroDocumento.unique' => 'Este CPF/CNPJ já está cadastrado.',
            'Email.email' => 'Digite um e-mail válido.',
            'Email.unique' => 'Este e-mail já está cadastrado.',
            'DtNascimento.before' => 'A data de nascimento deve ser anterior a hoje.',
            'Status.in' => 'Status inválido. Use: Pendente, Aprovado ou Rejeitado.',
            'FormaPagamento.in' => 'Forma de pagamento inválida.',
            'Uf.size' => 'UF deve ter 2 caracteres.',
        ];
    }
}