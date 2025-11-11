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
        Schema::table('pages', function (Blueprint $table) {
            $table->string('icon')->nullable()->after('is_featured'); // ex: 'user-plus', 'menu'
            $table->string('button_label')->nullable()->after('icon'); // ex: "Doe", "Associe-se"
            $table->string('action')->nullable()->after('button_label'); // ex: 'toggle-menu', 'link'
        });
    }

    public function down(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            $table->dropColumn(['icon', 'button_label', 'action']);
        });
    }
};
