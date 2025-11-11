<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            // Seeder de usuário admin (apenas 1 usuário)
            AdminUserSeeder::class,
            CategorySeeder::class,
            PagesMenuSeeder::class,
            // OU use este para criar múltiplos usuários de teste
            // UsersSeeder::class,
        ]);
    }
}
