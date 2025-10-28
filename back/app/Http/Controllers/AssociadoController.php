<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAssociadoRequest;
use App\Http\Resources\AssociadoResource;
use App\Models\Associado;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class AssociadoController extends Controller
{




/**
     * Lista associados com filtros e paginação
     *
     * @param Request $request
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
     * Cadastra um novo associado
     *
     * @param StoreAssociadoRequest $request
     * @return JsonResponse
     */
    public function store(StoreAssociadoRequest $request): JsonResponse
    {
        try {
            $dados = $request->validated();
            
            // Remove máscara do CPF antes de salvar
            $dados['NumeroDocumento'] = preg_replace('/[^0-9]/', '', $dados['NumeroDocumento']);
            
            // Remove máscara do CEP se presente
            if (isset($dados['Cep'])) {
                $dados['Cep'] = preg_replace('/[^0-9]/', '', $dados['Cep']);
            }

            // Remove máscara do Telefone se presente
            if (isset($dados['Telefone'])) {
                $dados['Telefone'] = preg_replace('/[^0-9+]/', '', $dados['Telefone']);
            }

            // Garante que o status seja Pendente
            $dados['Status'] = 'Pendente';

            // Cria o associado
            $associado = Associado::create($dados);

            // Log seguro sem expor CPF completo
            Log::info('Associado criado com sucesso', [
                'id' => $associado->id,
                'email' => $associado->Email,
                'cpf_mascarado' => '***.***.***-' . substr($associado->NumeroDocumento, -2),
                'origem' => $associado->Origem
            ]);

            // Retorna resposta com status 201 (Created)
            return (new AssociadoResource($associado))
                ->response()
                ->setStatusCode(201);

        } catch (\Exception $e) {
            // Log do erro sem dados sensíveis
            Log::error('Erro ao criar associado', [
                'mensagem' => $e->getMessage(),
                'email' => $request->Email ?? 'não informado',
                'linha' => $e->getLine(),
                'arquivo' => $e->getFile()
            ]);

            return response()->json([
                'mensagem' => 'Erro ao cadastrar associado. Tente novamente.',
                'erro' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }
}