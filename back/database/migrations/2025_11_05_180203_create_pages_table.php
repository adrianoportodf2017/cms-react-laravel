<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void {
        Schema::create('pages', function (Blueprint $table) {
        $table->uuid('id')->primary(); // ✅ REMOVA o default

            $table->string('name', 180);
            $table->string('slug', 200)->unique();
            $table->json('content'); // { html: string, type: "tiptap-html" }
            $table->enum('status', ['draft','published','archived'])->default('draft')->index();

            // Novos requisitos
            $table->foreignUuid('category_id')->nullable()
                ->constrained('categories')->nullOnDelete();

            $table->boolean('is_featured')->default(false);
            $table->unsignedInteger('display_order')->default(0);
            $table->boolean('in_main_menu')->default(false);

            // Hierarquia (submenu)
            $table->foreignUuid('parent_id')->nullable()
                ->constrained('pages')->nullOnDelete();

            // Autor (users já existe)
            $table->foreignUuid('author_id')->nullable()
                ->constrained('users')->nullOnDelete();
            $table->string('author_name', 150)->nullable();

            $table->timestamps();

            // Índices úteis
            $table->index(['name', 'slug']);
            $table->index('category_id');
            $table->index('is_featured');
            $table->index('in_main_menu');
            $table->index('display_order');
            $table->index('parent_id');
            $table->index(['status', 'in_main_menu', 'display_order']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('pages');
    }
};
