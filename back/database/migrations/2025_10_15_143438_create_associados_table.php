<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('TB_Associado', function (Blueprint $table) {
            $table->id('id');
            $table->string('NomeCompleto', 160);
            $table->string('NumeroDocumento', 14)->unique();
            $table->string('Email', 160)->unique();
            $table->string('Telefone', 20);
            $table->date('DtNascimento')->nullable();
            $table->string('Cep', 9)->nullable();
            $table->string('Endereco', 160)->nullable();
            $table->string('Numero', 20)->nullable();
            $table->string('Complemento', 60)->nullable();
            $table->string('Bairro', 80)->nullable();
            $table->string('Cidade', 80)->nullable();
            $table->string('Uf', 2)->nullable();
            $table->text('Motivo')->nullable();
            $table->enum('Status', ['Pendente', 'Aprovado', 'Rejeitado'])->default('Pendente');
            $table->boolean('IsConsentimentoLgpd')->default(false);
            $table->string('Origem', 40)->nullable();
            $table->text('Observacao')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('TB_Associado');
    }
};