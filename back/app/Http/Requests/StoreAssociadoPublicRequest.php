<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAssociadoPublicRequest extends FormRequest
{
      

    /**
     * Determina se o usuário está autorizado a fazer esta requisição
     */
    public function authorize(): bool
    {
        return true; // Formulário público
    }

    /**
     * Regras de validação
     */
    public function rules(): array
    {     
        $rules = [
            'TipoPessoa' => ['required', 'in:PF,PJ'],
            'NomeCompleto' => ['required', 'string', 'max:160'],
            'NumeroDocumento' => ['required', 'string', 'max:18', 'unique:TB_Associado,NumeroDocumento'],
            'Email' => ['required', 'email', 'max:160', 'unique:TB_Associado,Email'],
            'Telefone' => ['required', 'string', 'max:20'],
            'Endereco' => ['required', 'string', 'max:160'],
            'Bairro' => ['required', 'string', 'max:80'],
            'Uf' => ['required', 'string', 'size:2'],
            'Cep' => ['required', 'string', 'max:9'],
            'ValorContribuicao' => ['required', 'string'],
            'FormaPagamento' => ['required', 'in:PIX,TED,DescontoFolha,DebitoAutomatico'],
            'IsConsentimentoLgpd' => ['required', 'accepted'],
        ];

        // Campos obrigatórios apenas para Pessoa Física
        if ($this->input('TipoPessoa') === 'PF') {
            $rules['DtNascimento'] = ['required', 'date', 'before:today'];
            $rules['Sexo'] = ['required', 'in:Feminino,Masculino,NaoBinario'];
        }

        // Campos obrigatórios apenas para Débito Automático
        if ($this->input('FormaPagamento') === 'DebitoAutomatico') {
            $rules['BancoDebito'] = ['required', 'string', 'max:250'];
            $rules['AgenciaDebito'] = ['required', 'string', 'max:250'];
            $rules['ContaDebito'] = ['required', 'string', 'max:250'];
        }

        return $rules;
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
            'NomeCompleto.max' => 'O nome não pode ter mais de 160 caracteres.',
            'NumeroDocumento.required' => 'O CPF/CNPJ é obrigatório.',
            'NumeroDocumento.unique' => 'Este CPF/CNPJ já está cadastrado.',
            'Email.required' => 'O e-mail é obrigatório.',
            'Email.email' => 'Digite um e-mail válido.',
            'Email.unique' => 'Este e-mail já está cadastrado.',
            'Telefone.required' => 'O telefone é obrigatório.',
            'DtNascimento.required' => 'A data de nascimento é obrigatória.',
            'DtNascimento.before' => 'A data de nascimento deve ser anterior a hoje.',
            'Sexo.required' => 'Selecione o sexo.',
            'Endereco.required' => 'O endereço é obrigatório.',
            'Bairro.required' => 'O bairro é obrigatório.',
            'Uf.required' => 'Selecione o estado (UF).',
            'Uf.size' => 'UF deve ter 2 caracteres.',
            'Cep.required' => 'O CEP é obrigatório.',
            'ValorContribuicao.required' => 'O valor da contribuição é obrigatório.',
            'FormaPagamento.required' => 'Selecione a forma de pagamento.',
            'FormaPagamento.in' => 'Forma de pagamento inválida.',
            'BancoDebito.required' => 'O banco é obrigatório para débito automático.',
            'AgenciaDebito.required' => 'A agência é obrigatória para débito automático.',
            'ContaDebito.required' => 'A conta é obrigatória para débito automático.',
            'IsConsentimentoLgpd.required' => 'Você deve aceitar os termos.',
            'IsConsentimentoLgpd.accepted' => 'Você deve aceitar os termos para continuar.',
        ];
    }
}