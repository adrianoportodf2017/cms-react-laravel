<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAssociadoPublicRequest;
use App\Http\Requests\StoreAssociadoPrivateRequest;
use App\Http\Requests\UpdateAssociadoRequest;
use App\Http\Resources\AssociadoResource;
use App\Models\Associado;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class AssociadoController extends Controller
{
    /**
     * Lista associados com filtros e paginação (mantido como estava)
     *
     * @param \Illuminate\Http\Request $request
     * @return JsonResponse
     */
    public function index(\Illuminate\Http\Request $request): JsonResponse
    {
        try {
            $query = Associado::query();

            // Filtro por nome (busca parcial)
            if ($request->has('nome')) {
                $query->where('NomeCompleto', 'like', '%' . $request->nome . '%');
            }

            // Filtro por CPF (busca exata, remove máscara)
            if ($request->has('cpf')) {
                $cpf = preg_replace('/[^0-9]/', '', $request->cpf);
                $query->where('NumeroDocumento', $cpf);
            }

            // Filtro por email (busca parcial)
            if ($request->has('email')) {
                $query->where('Email', 'like', '%' . $request->email . '%');
            }

            // Filtro por status
            if ($request->has('status')) {
                $query->where('Status', $request->status);
            }

            // Filtro por data de cadastro (data específica)
            if ($request->has('data_cadastro')) {
                $query->whereDate('created_at', $request->data_cadastro);
            }

            // Filtro por período de cadastro
            if ($request->has('data_inicio')) {
                $query->whereDate('created_at', '>=', $request->data_inicio);
            }
            if ($request->has('data_fim')) {
                $query->whereDate('created_at', '<=', $request->data_fim);
            }

            // Ordenação (padrão: mais recente primeiro)
            $orderBy = $request->get('ordem', 'created_at');
            $orderDirection = $request->get('direcao', 'desc');
            $query->orderBy($orderBy, $orderDirection);

            // Paginação (padrão: 15 por página)
            $perPage = min($request->get('por_pagina', 15), 100); // máximo 100 por página
            $associados = $query->paginate($perPage);

            return response()->json([
                'data' => AssociadoResource::collection($associados),
                'meta' => [
                    'total' => $associados->total(),
                    'por_pagina' => $associados->perPage(),
                    'pagina_atual' => $associados->currentPage(),
                    'ultima_pagina' => $associados->lastPage(),
                    'de' => $associados->firstItem(),
                    'ate' => $associados->lastItem(),
                ],
                'links' => [
                    'primeiro' => $associados->url(1),
                    'anterior' => $associados->previousPageUrl(),
                    'proximo' => $associados->nextPageUrl(),
                    'ultimo' => $associados->url($associados->lastPage()),
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Erro ao listar associados', [
                'mensagem' => $e->getMessage(),
                'linha' => $e->getLine()
            ]);

            return response()->json([
                'mensagem' => 'Erro ao buscar associados.',
                'erro' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Cadastra um novo associado via formulário PÚBLICO
     *
     * @param StoreAssociadoPublicRequest $request
     * @return JsonResponse
     */
    public function storePublic(StoreAssociadoPublicRequest $request): JsonResponse
    {

        try {
            $dados = $request->validated();
            
            // Remove máscaras
            $dados['NumeroDocumento'] = preg_replace('/[^0-9]/', '', $dados['NumeroDocumento']);
            
            if (isset($dados['Cep'])) {
                $dados['Cep'] = preg_replace('/[^0-9]/', '', $dados['Cep']);
            }

            if (isset($dados['Telefone'])) {
                $dados['Telefone'] = preg_replace('/[^0-9+]/', '', $dados['Telefone']);
            }

            // Garante que o status seja Pendente e origem seja 'site'
            $dados['Status'] = 'Pendente';
            $dados['Origem'] = 'site';

            // Cria o associado
            $associado = Associado::create($dados);

            // Log seguro
            Log::info('Associado criado via formulário público', [
                'id' => $associado->id,
                'email' => $associado->Email,
                'tipo_pessoa' => $associado->TipoPessoa,
            ]);

            return (new AssociadoResource($associado))
                ->response()
                ->setStatusCode(201);

        } catch (\Exception $e) {
            Log::error('Erro ao criar associado público', [
                'mensagem' => $e->getMessage(),
                'email' => $request->Email ?? 'não informado',
                'linha' => $e->getLine(),
            ]);

            return response()->json([
                'mensagem' => 'Erro ao cadastrar associado. Tente novamente.',
                'erro' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Cadastra um novo associado via painel PRIVADO (admin)
     *
     * @param StoreAssociadoPrivateRequest $request
     * @return JsonResponse
     */
    public function storePrivate(StoreAssociadoPrivateRequest $request): JsonResponse
    {
        try {
            $dados = $request->validated();
            
            // Remove máscaras
            $dados['NumeroDocumento'] = preg_replace('/[^0-9]/', '', $dados['NumeroDocumento']);
            
            if (isset($dados['Cep'])) {
                $dados['Cep'] = preg_replace('/[^0-9]/', '', $dados['Cep']);
            }

            if (isset($dados['Telefone'])) {
                $dados['Telefone'] = preg_replace('/[^0-9+]/', '', $dados['Telefone']);
            }

            // Admin pode definir status, se não vier assume Pendente
            if (!isset($dados['Status'])) {
                $dados['Status'] = 'Pendente';
            }

            // Define origem como 'admin' se não vier
            if (!isset($dados['Origem'])) {
                $dados['Origem'] = 'admin';
            }

            // Cria o associado
            $associado = Associado::create($dados);

            // Log
            Log::info('Associado criado via painel admin', [
                'id' => $associado->id,
                'email' => $associado->Email,
                'admin_id' => $request->user()->id,
                'admin_email' => $request->user()->email,
            ]);

            return (new AssociadoResource($associado))
                ->response()
                ->setStatusCode(201);

        } catch (\Exception $e) {
            Log::error('Erro ao criar associado privado', [
                'mensagem' => $e->getMessage(),
                'email' => $request->Email ?? 'não informado',
                'admin_id' => $request->user()->id ?? null,
                'linha' => $e->getLine(),
            ]);

            return response()->json([
                'mensagem' => 'Erro ao cadastrar associado.',
                'erro' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Exibe um associado específico
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        try {
            $associado = Associado::findOrFail($id);
            
            return response()->json([
                'data' => new AssociadoResource($associado)
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'mensagem' => 'Associado não encontrado.'
            ], 404);

        } catch (\Exception $e) {
            Log::error('Erro ao buscar associado', [
                'id' => $id,
                'mensagem' => $e->getMessage(),
            ]);

            return response()->json([
                'mensagem' => 'Erro ao buscar associado.',
                'erro' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Atualiza um associado existente (apenas admin)
     *
     * @param UpdateAssociadoRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(UpdateAssociadoRequest $request, int $id): JsonResponse
    {
        try {
            $associado = Associado::findOrFail($id);
            
            $dados = $request->validated();
            
            // Remove máscaras se campos foram enviados
            if (isset($dados['NumeroDocumento'])) {
                $dados['NumeroDocumento'] = preg_replace('/[^0-9]/', '', $dados['NumeroDocumento']);
            }
            
            if (isset($dados['Cep'])) {
                $dados['Cep'] = preg_replace('/[^0-9]/', '', $dados['Cep']);
            }

            if (isset($dados['Telefone'])) {
                $dados['Telefone'] = preg_replace('/[^0-9+]/', '', $dados['Telefone']);
            }

            // Atualiza o associado
            $associado->update($dados);

            // Log
            Log::info('Associado atualizado', [
                'id' => $associado->id,
                'admin_id' => $request->user()->id,
                'admin_email' => $request->user()->email,
                'campos_alterados' => array_keys($dados),
            ]);

            return response()->json([
                'data' => new AssociadoResource($associado),
                'mensagem' => 'Associado atualizado com sucesso.'
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'mensagem' => 'Associado não encontrado.'
            ], 404);

        } catch (\Exception $e) {
            Log::error('Erro ao atualizar associado', [
                'id' => $id,
                'mensagem' => $e->getMessage(),
                'admin_id' => $request->user()->id ?? null,
                'linha' => $e->getLine(),
            ]);

            return response()->json([
                'mensagem' => 'Erro ao atualizar associado.',
                'erro' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Remove um associado (soft delete - apenas admin)
     *
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(\Illuminate\Http\Request $request, int $id): JsonResponse
    {
        try {
            $associado = Associado::findOrFail($id);
            
            // Soft delete
            $associado->delete();

            // Log
            Log::info('Associado removido (soft delete)', [
                'id' => $associado->id,
                'email' => $associado->Email,
                'admin_id' => $request->user()->id,
                'admin_email' => $request->user()->email,
            ]);

            return response()->json([
                'mensagem' => 'Associado removido com sucesso.'
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'mensagem' => 'Associado não encontrado.'
            ], 404);

        } catch (\Exception $e) {
            Log::error('Erro ao remover associado', [
                'id' => $id,
                'mensagem' => $e->getMessage(),
                'admin_id' => $request->user()->id ?? null,
                'linha' => $e->getLine(),
            ]);

            return response()->json([
                'mensagem' => 'Erro ao remover associado.',
                'erro' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }
}