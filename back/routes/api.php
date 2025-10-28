<?php

use Illuminate\Http\Request;
use App\Http\Controllers\AssociadoController;
use Illuminate\Support\Facades\Route;



/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Rotas da API com throttle (rate limit) de 20 requisições por minuto
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::middleware('throttle:20,1')->group(function () {
   // Health check da API
    Route::get('/health', function () {
        return response()->json([
            'status' => 'ok',
            'timestamp' => now()->toIso8601String(),
            'service' => 'API Associados'
        ]);
    })->name('health');
});


Route::middleware(['throttle:20,1', 'validate_api_token'])->group(function () {
    Route::get('/associados', [AssociadoController::class, 'index']);
    Route::post('/associados', [AssociadoController::class, 'store']);
});
