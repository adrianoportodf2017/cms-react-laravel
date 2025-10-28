<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class CpfValido implements ValidationRule
{
    /**
     * Executa a validação do CPF
     *
     * @param string $attribute
     * @param mixed $value
     * @param Closure $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // Remove caracteres não numéricos (pontos, traços, espaços)
        $cpf = preg_replace('/[^0-9]/', '', $value);

        // Verifica se tem exatamente 11 dígitos
        if (strlen($cpf) != 11) {
            $fail('O CPF deve conter 11 dígitos.');
            return;
        }

        // Verifica se todos os dígitos são iguais (ex: 111.111.111-11)
        if (preg_match('/(\d)\1{10}/', $cpf)) {
            $fail('O CPF informado é inválido.');
            return;
        }

        // Valida os dígitos verificadores
        for ($t = 9; $t < 11; $t++) {
            $d = 0;
            for ($c = 0; $c < $t; $c++) {
                $d += $cpf[$c] * (($t + 1) - $c);
            }
            $d = ((10 * $d) % 11) % 10;
            
            if ($cpf[$c] != $d) {
                $fail('O CPF informado é inválido.');
                return;
            }
        }
    }
}
 