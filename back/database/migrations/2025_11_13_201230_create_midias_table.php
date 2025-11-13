// database/migrations/xxxx_xx_xx_create_media_table.php

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('media', function (Blueprint $table) {
            $table->id();
            
            // User relationship - NULLABLE + SET NULL
            $table->foreignId('user_id')
                  ->nullable()
                  ->constrained('users')
                  ->onDelete('set null');
            
            // File information
            $table->string('filename');
            $table->string('path');
            $table->string('url');
            $table->bigInteger('size'); // bytes
            
            // Type and category
            $table->enum('type', ['image', 'video', 'pdf', 'document', 'other'])
                  ->default('image');
            $table->string('mime_type');
            $table->string('extension', 10);
            
            $table->string('category')->nullable();
            
            // Metadata
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->string('alt_text')->nullable();
            
            // Dimensions (for images and videos)
            $table->integer('width')->nullable();
            $table->integer('height')->nullable();
            $table->integer('duration')->nullable(); // seconds for videos
            
            // Control
            $table->enum('status', ['active', 'inactive', 'processing'])
                  ->default('active');
            $table->timestamp('published_at')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index('user_id');
            $table->index('type');
            $table->index('category');
            $table->index('status');
            $table->index('published_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('media');
    }
};