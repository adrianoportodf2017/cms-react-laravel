<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ValidateApiToken
{
    /**
     * Valida o token de API enviado no cabeçalho
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Pega o token do cabeçalho
        $token = $request->header('X-API-Token');

        // Token configurado no .env
        $validToken = config('app.api_token');

        // Verifica se o token foi enviado
        if (!$token) {
            return response()->json([
                'mensagem' => 'Token de API não fornecido.',
                'erro' => 'É necessário enviar o cabeçalho X-API-Token'
            ], 401);
        }

        // Verifica se o token está configurado
        if (!$validToken) {
            return response()->json([
                'mensagem' => 'Token de API não configurado no servidor.',
                'erro' => 'Entre em contato com o administrador.'
            ], 500);
        }

        // Valida o token (comparação segura contra timing attacks)
        if (!hash_equals($validToken, $token)) {
            return response()->json([
                'mensagem' => 'Token de API inválido.',
                'erro' => 'Acesso não autorizado.'
            ], 403);
        }

        // Token válido, continua a requisição
        return $next($request);
    }
}