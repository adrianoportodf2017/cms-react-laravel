<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AssociadoController;
use App\Http\Controllers\PageController;

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


Route::get('/menu', [PageController::class, 'menu']);

