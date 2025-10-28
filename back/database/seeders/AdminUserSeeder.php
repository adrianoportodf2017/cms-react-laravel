<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'Administrador',
                'email' => 'admin@instituto.com',
                'password' => 'Admin@123',
            ],
            [
                'name' => 'Editor',
                'email' => 'editor@instituto.com',
                'password' => 'Editor@123',
            ],
            [
                'name' => 'Usuário Teste',
                'email' => 'teste@instituto.com',
                'password' => 'Teste@123',
            ],
        ];

        $this->command->info('🌱 Criando usuários de teste...');
        $this->command->info('');

        foreach ($users as $userData) {
            // Verifica se o usuário já existe
            $exists = User::where('email', $userData['email'])->exists();

            if ($exists) {
                $this->command->warn("⚠️  {$userData['email']} já existe!");
                continue;
            }

            // Cria o usuário
            User::create([
                'name' => $userData['name'],
                'email' => $userData['email'],
                'password' => Hash::make($userData['password']),
                'email_verified_at' => now(),
            ]);

            $this->command->info("✅ {$userData['name']} criado!");
            $this->command->info("   📧 E-mail: {$userData['email']}");
            $this->command->info("   🔑 Senha: {$userData['password']}");
            $this->command->info('');
        }

        $this->command->info('🎉 Usuários criados com sucesso!');
        $this->command->warn('⚠️  IMPORTANTE: Altere as senhas em produção!');
    }
}