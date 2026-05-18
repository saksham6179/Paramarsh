<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run migrations.
     */
    public function up(): void
    {
        Schema::create('conversations', function (
            Blueprint $table
        ) {
            $table->id();

            // USER 1
            $table->foreignId('user_one_id')
                ->constrained('users')
                ->onDelete('cascade');

            // USER 2
            $table->foreignId('user_two_id')
                ->constrained('users')
                ->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists(
            'conversations'
        );
    }
};