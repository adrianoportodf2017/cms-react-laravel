<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AssociadoController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\MediaController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| Rotas da API com throttle (rate limit) de 20 req/min
|--------------------------------------------------------------------------
*/

// Health check
Route::middleware('throttle:20,1')->group(function () {
    Route::get('/health', function () {
        return response()->json([
            'status' => 'ok',
            'timestamp' => now()->toIso8601String(),
            'service' => 'API Instituto Cooperforte'
        ]);
    })->name('health');
});

/*
|--------------------------------------------------------------------------
| Rotas de Autenticação (Públicas)
|--------------------------------------------------------------------------
*/
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login'])->name('login');
    Route::post('/register', [AuthController::class, 'register']);

    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/logout-all', [AuthController::class, 'logoutAll']);
    });
});

/*
|--------------------------------------------------------------------------
| Rotas de Associados (Com API Token)
|--------------------------------------------------------------------------
*/
Route::middleware(['throttle:20,1', 'validate_api_token'])->group(function () {
    Route::get('/associados', [AssociadoController::class, 'index']);
    Route::post('/associados', [AssociadoController::class, 'store']);
});

/*
|--------------------------------------------------------------------------
| Rota de Usuário Autenticado (Sanctum)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

/*
|--------------------------------------------------------------------------
| Rotas PÚBLICAS do Site (Páginas CMS)
|--------------------------------------------------------------------------
| - Acesso aberto (sem login)
| - Usadas pelo site para renderizar conteúdo e menus
| - Protegidas com throttle leve
|--------------------------------------------------------------------------
*/
Route::middleware('throttle:60,1')->group(function () {
    // Menu principal (hierarquia de páginas)
    Route::get('/menus/main', [PageController::class, 'mainMenu']);

    // Exibir página por slug ou id
    Route::get('/pages/{key}', [PageController::class, 'show'])
        ->where('key', '[A-Za-z0-9-]+');
});

/*
|--------------------------------------------------------------------------
| Rotas PRIVADAS do Painel (Páginas CMS)
|--------------------------------------------------------------------------
| - Somente para usuários autenticados (admin)
| - CRUD completo + ações especiais
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum'])->prefix('admin')->group(function () {
    Route::get('/pages', [PageController::class, 'index']);
    Route::post('/pages', [PageController::class, 'store']);
    Route::get('/pages/{id}', [PageController::class, 'show'])->whereUuid('id');
    Route::put('/pages/{id}', [PageController::class, 'update'])->whereUuid('id');
    Route::delete('/pages/{id}', [PageController::class, 'destroy'])->whereUuid('id');

    // Ações específicas
    Route::patch('/pages/{id}/publish', [PageController::class, 'publish'])->whereUuid('id');
    Route::patch('/pages/{id}/archive', [PageController::class, 'archive'])->whereUuid('id');
    Route::post('/pages/{id}/duplicate', [PageController::class, 'duplicate'])->whereUuid('id');

  


});

Route::middleware(['auth:sanctum'])->group(function () {


   Route::prefix('media')->group(function () {
        Route::post('upload', [MediaController::class, 'upload']);
        Route::get('/', [MediaController::class, 'index']);
        Route::get('stats', [MediaController::class, 'stats']);
        Route::get('orphaned', [MediaController::class, 'orphaned']);
        Route::delete('clean-orphaned', [MediaController::class, 'cleanOrphaned']);
        Route::get('{id}', [MediaController::class, 'show']);
        Route::put('{id}', [MediaController::class, 'update']);
        Route::delete('{id}', [MediaController::class, 'destroy']);
    });
});
Route::get('/menu', [PageController::class, 'menu']);


/*
|--------------------------------------------------------------------------
| Rotas de Associados PÚBLICAS (Formulário do Site)
|--------------------------------------------------------------------------
*/
Route::middleware('throttle:10,1')->group(function () {
    // Cadastro público (formulário do site)
    Route::post('/associados/public', [AssociadoController::class, 'storePublic']);
});

/*
|--------------------------------------------------------------------------
| Rotas de Associados PRIVADAS (Painel Admin)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum'])->prefix('admin')->group(function () {
    // Listar associados (com filtros e paginação)
    Route::get('/associados', [AssociadoController::class, 'index']);
    
    // Criar associado via admin
    Route::post('/associados', [AssociadoController::class, 'storePrivate']);
    
    // Ver detalhes de um associado
    Route::get('/associados/{id}', [AssociadoController::class, 'show']);
    
    // Atualizar associado
    Route::put('/associados/{id}', [AssociadoController::class, 'update']);
    
    // Deletar associado (soft delete)
    Route::delete('/associados/{id}', [AssociadoController::class, 'destroy']);
});


