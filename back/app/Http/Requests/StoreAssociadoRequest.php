<?php

namespace App\Http\Requests;

use App\Rules\CpfValido;
use Illuminate\Foundation\Http\FormRequest;

class StoreAssociadoRequest extends FormRequest
{
    /**
     * Determina se o usuário está autorizado a fazer esta requisição
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Regras de validação da requisição
     */
    public function rules(): array
    {
        return [
            'NomeCompleto' => ['required', 'string', 'min:3', 'max:160'],
            'NumeroDocumento' => [
                'required',
                'string',
                new CpfValido(),
                'unique:TB_Associado,NumeroDocumento'
            ],
            'Email' => ['required', 'email', 'max:160', 'unique:TB_Associado,Email'],
            'Telefone' => [
                'required',
                'string',
                'regex:/^(\+55\s?)?(\(?\d{2}\)?\s?)?(9?\d{4})-?(\d{4})$/'
            ],
            'DtNascimento' => ['nullable', 'date', 'before:today'],
            'Cep' => ['nullable', 'string', 'regex:/^\d{5}-?\d{3}$/'],
            'Endereco' => ['nullable', 'string', 'max:160'],
            'Numero' => ['nullable', 'string', 'max:20'],
            'Complemento' => ['nullable', 'string', 'max:60'],
            'Bairro' => ['nullable', 'string', 'max:80'],
            'Cidade' => ['nullable', 'string', 'max:80'],
            'Uf' => ['nullable', 'string', 'size:2', 'regex:/^[A-Z]{2}$/'],
            'Motivo' => ['nullable', 'string', 'max:2000'],
            'IsConsentimentoLgpd' => ['required', 'boolean', 'accepted'],
            'Origem' => ['nullable', 'string', 'max:40'],
            'Observacao' => ['nullable', 'string'],
        ];
    }

    /**
     * Mensagens personalizadas de validação
     */
    public function messages(): array
    {
        return [
            'NomeCompleto.required' => 'O nome completo é obrigatório.',
            'NomeCompleto.min' => 'O nome completo deve ter no mínimo 3 caracteres.',
            'NomeCompleto.max' => 'O nome completo deve ter no máximo 160 caracteres.',
            
            'NumeroDocumento.required' => 'O CPF é obrigatório.',
            'NumeroDocumento.unique' => 'Este CPF já está cadastrado.',
            
            'Email.required' => 'O e-mail é obrigatório.',
            'Email.email' => 'O e-mail deve ser válido.',
            'Email.unique' => 'Este e-mail já está cadastrado.',
            'Email.max' => 'O e-mail deve ter no máximo 160 caracteres.',
            
            'Telefone.required' => 'O telefone é obrigatório.',
            'Telefone.regex' => 'O formato do telefone é inválido. Use: (61) 99999-9999',
            
            'DtNascimento.date' => 'A data de nascimento deve ser uma data válida.',
            'DtNascimento.before' => 'A data de nascimento deve ser anterior a hoje.',
            
            'Cep.regex' => 'O formato do CEP é inválido. Use: 70000-000',
            
            'Uf.size' => 'A UF deve ter exatamente 2 caracteres.',
            'Uf.regex' => 'A UF deve conter apenas letras maiúsculas.',
            
            'Motivo.max' => 'O motivo deve ter no máximo 2000 caracteres.',
            
            'IsConsentimentoLgpd.required' => 'O consentimento LGPD é obrigatório.',
            'IsConsentimentoLgpd.accepted' => 'Você deve aceitar os termos da LGPD para prosseguir.',
            
            'Origem.max' => 'A origem deve ter no máximo 40 caracteres.',
        ];
    }

    /**
     * Prepara os dados antes da validação
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'Origem' => $this->Origem ?? 'site',
            'Status' => 'Pendente',
        ]);
    }

    /**
     * Customiza os nomes dos atributos para as mensagens de erro
     */
    public function attributes(): array
    {
        return [
            'NomeCompleto' => 'nome completo',
            'NumeroDocumento' => 'CPF',
            'Email' => 'e-mail',
            'Telefone' => 'telefone',
            'DtNascimento' => 'data de nascimento',
            'Cep' => 'CEP',
            'Endereco' => 'endereço',
            'Numero' => 'número',
            'Complemento' => 'complemento',
            'Bairro' => 'bairro',
            'Cidade' => 'cidade',
            'Uf' => 'UF',
            'Motivo' => 'motivo',
            'IsConsentimentoLgpd' => 'consentimento LGPD',
            'Origem' => 'origem',
            'Observacao' => 'observação',
        ];
    }
}