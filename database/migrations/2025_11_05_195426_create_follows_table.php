<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('follows', function (Blueprint $table) {
            $table->id();

            // Usuario que sigue a otro usuario
            $table->foreignId('follower_id')
                ->constrained('users')
                ->onDelete('cascade');

            // Usuario que es seguido
            $table->foreignId('followed_id')
                ->constrained('users')
                ->onDelete('cascade');

            $table->timestamps();

            // Evita duplicados (un mismo usuario no puede seguir dos veces al mismo)
            $table->unique(['follower_id', 'followed_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('follows');
    }
};
