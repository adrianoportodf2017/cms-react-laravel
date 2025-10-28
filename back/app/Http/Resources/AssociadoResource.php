<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AssociadoResource extends JsonResource
{
    /**
     * Transforma o recurso em um array
     *
     * @param Request $request
     * @return array
     */
     public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'NomeCompleto' => $this->NomeCompleto,
            'NumeroDocumento' => $this->NumeroDocumento,
            'Email' => $this->Email,
            'Telefone' => $this->Telefone,
            'DtNascimento' => $this->DtNascimento?->format('Y-m-d'),
            'Cep' => $this->Cep,
            'Endereco' => $this->Endereco,
            'Numero' => $this->Numero,
            'Complemento' => $this->Complemento,
            'Bairro' => $this->Bairro,
            'Cidade' => $this->Cidade,
            'Uf' => $this->Uf,
            'Motivo' => $this->Motivo,
            'Status' => $this->Status,
            'IsConsentimentoLgpd' => $this->IsConsentimentoLgpd,
            'Origem' => $this->Origem,
            'Observacao' => $this->Observacao,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }

    /**
     * Mascara o CPF para proteger dados sensíveis
     * Formato: ***.***.***.09
     *
     * @param string $cpf
     * @return string
     */
    private function maskCpf(string $cpf): string
    {
        // Remove qualquer caractere não numérico
        $cpf = preg_replace('/[^0-9]/', '', $cpf);
        
        // Verifica se o CPF tem 11 dígitos
        if (strlen($cpf) !== 11) {
            return '***.***.***-**';
        }

        // Retorna CPF mascarado mostrando apenas os 2 últimos dígitos
        return '***.***.***-' . substr($cpf, -2);
    }

    /**
     * Formata o telefone para exibição
     * 
     * @param string|null $telefone
     * @return string|null
     */
    private function formatTelefone(?string $telefone): ?string
    {
        if (!$telefone) {
            return null;
        }

        // Remove caracteres não numéricos
        $telefone = preg_replace('/[^0-9]/', '', $telefone);

        // Formata conforme o tamanho
        if (strlen($telefone) === 11) {
            // Celular: (61) 99999-9999
            return '(' . substr($telefone, 0, 2) . ') ' . 
                   substr($telefone, 2, 5) . '-' . 
                   substr($telefone, 7);
        } elseif (strlen($telefone) === 10) {
            // Fixo: (61) 3333-4444
            return '(' . substr($telefone, 0, 2) . ') ' . 
                   substr($telefone, 2, 4) . '-' . 
                   substr($telefone, 6);
        }

        return $telefone;
    }
}