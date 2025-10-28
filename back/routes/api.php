<?php

use Illuminate\Http\Request;
use App\Http\Controllers\AssociadoController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Rotas da API com throttle (rate limit) de 20 requisições por minuto
|
*/  
 

// Health check da API
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
    // Login e Registro (sem autenticação)
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    
    // Recuperação de senha
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
    
    // Rotas protegidas (requerem autenticação)
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