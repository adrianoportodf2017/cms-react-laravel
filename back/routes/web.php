<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

// Rotas de setup do banco de dados
Route::get('/setup/migrate-fresh', function () {
    try {
        Artisan::call('migrate:fresh');
        $output = Artisan::output();
        return response()->json([
            'success' => true,
            'message' => 'Migrate fresh executado com sucesso!',
            'output' => $output
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Erro ao executar migrate fresh',
            'error' => $e->getMessage()
        ], 500);
    }
});

Route::get('/setup/seed', function () {
    try {
        Artisan::call('db:seed');
        $output = Artisan::output();
        return response()->json([
            'success' => true,
            'message' => 'Seeds executados com sucesso!',
            'output' => $output
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Erro ao executar seeds',
            'error' => $e->getMessage()
        ], 500);
    }
});

Route::get('/setup/migrate-fresh-seed', function () {
    try {
        Artisan::call('migrate:fresh --seed');
        $output = Artisan::output();
        return response()->json([
            'success' => true,
            'message' => 'Migrate fresh com seeds executado com sucesso!',
            'output' => $output
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Erro ao executar migrate fresh com seeds',
            'error' => $e->getMessage()
        ], 500);
    }
});

Route::get('/setup/seed/{seeder}', function ($seeder) {
    try {
        // Adiciona "Seeder" ao final se não estiver presente
        $seederClass = str_ends_with($seeder, 'Seeder') ? $seeder : $seeder . 'Seeder';
        
        Artisan::call('db:seed', [
            '--class' => $seederClass
        ]);
        $output = Artisan::output();
        return response()->json([
            'success' => true,
            'message' => "{$seederClass} executado com sucesso!",
            'output' => $output
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => "Erro ao executar {$seederClass}",
            'error' => $e->getMessage()
        ], 500);
    }
});