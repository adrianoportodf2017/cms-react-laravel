<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('news', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->string('title', 255);
            $table->string('slug', 255)->unique();
            $table->text('summary')->nullable(); // Summary/lead
            $table->json('content'); // { html: string, grapesjs?: array }
            $table->string('featured_image')->nullable();
            
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft')->index();

            // Category
            $table->foreignUuid('category_id')->nullable()
                ->constrained('categories')->nullOnDelete();

            // Author
            $table->foreignUuid('author_id')->nullable()
                ->constrained('users')->nullOnDelete();
            $table->string('author_name', 150)->nullable();

            // Featured and order
            $table->boolean('is_featured')->default(false);
            $table->unsignedInteger('display_order')->default(0);

            // Important dates for news
            $table->timestamp('published_at')->nullable();
            $table->timestamp('archived_at')->nullable();

            $table->timestamps();

            // Useful indexes
            $table->index(['title', 'slug']);
            $table->index('category_id');
            $table->index('is_featured');
            $table->index('display_order');
            $table->index('published_at');
            $table->index(['status', 'is_featured', 'published_at']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('news');
    }
};